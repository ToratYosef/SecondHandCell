import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import Stripe from "stripe";
import { z } from "zod";
import { insertUserSchema, insertCompanySchema, insertShippingAddressSchema } from "@shared/schema";

// Initialize Stripe (only if key is provided)
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-10-29.clover",
  });
}

// Session user type
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    userRole?: string;
  }
}

// Middleware to check if user is authenticated
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

// Middleware to check if user is admin or super_admin
const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  const user = await storage.getUser(req.session.userId);
  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    return res.status(403).json({ error: "Admin access required" });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  const sessionSecret = process.env.SESSION_SECRET || 
    (process.env.NODE_ENV === 'production' 
      ? (() => { throw new Error('SESSION_SECRET must be set in production'); })()
      : 'dev-secret-only-for-local-development');
  
  app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  }));

  // ==================== AUTH ROUTES ====================
  
  // Register new user and company
  app.post("/api/auth/register", async (req, res) => {
    try {
      const registerSchema = z.object({
        // User data
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        password: z.string().min(6),
        // Company data
        companyName: z.string(),
        legalName: z.string(),
        website: z.string().optional(),
        taxId: z.string().optional(),
        businessType: z.string(),
        // Address data
        contactName: z.string(),
        addressPhone: z.string(),
        street1: z.string(),
        street2: z.string().optional(),
        city: z.string(),
        state: z.string(),
        postalCode: z.string(),
      });

      const data = registerSchema.parse(req.body);

      // Check if user exists
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, 10);

      // Create user
      const user = await storage.createUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash,
        role: "buyer",
        isActive: true,
      });

      // Create company
      const company = await storage.createCompany({
        name: data.companyName,
        legalName: data.legalName,
        website: data.website || null,
        taxId: data.taxId || null,
        primaryPhone: data.phone,
        billingEmail: data.email,
        status: "pending_review",
        creditLimit: "0",
      });

      // Link user to company as owner
      await storage.createCompanyUser({
        userId: user.id,
        companyId: company.id,
        roleInCompany: "owner",
      });

      // Create first shipping address
      await storage.createShippingAddress({
        companyId: company.id,
        contactName: data.contactName,
        phone: data.addressPhone,
        street1: data.street1,
        street2: data.street2 || null,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: "USA",
        isDefault: true,
      });

      res.json({ success: true, userId: user.id, companyId: company.id });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ error: error.message || "Registration failed" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      if (!user.isActive) {
        return res.status(403).json({ error: "Account is inactive" });
      }

      // Update last login
      await storage.updateUser(user.id, { lastLoginAt: new Date() });

      // Set session
      req.session.userId = user.id;
      req.session.userRole = user.role;
      
      res.json({ 
        success: true, 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // Get current user
  const getMeHandler = async (req: any, res: any) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get user's company
      const companyUsers = await storage.getCompanyUsersByUserId(user.id);
      let companyId = null;
      if (companyUsers.length > 0) {
        companyId = companyUsers[0].companyId;
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        companyId,
      });
    } catch (error: any) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  };
  
  app.get("/api/auth/me", requireAuth, getMeHandler);
  app.get("/api/me", requireAuth, getMeHandler);

  // ==================== CATALOG ROUTES ====================
  
  // Get all device models
  app.get("/api/catalog/models", async (req, res) => {
    try {
      const models = await storage.getAllDeviceModels();
      res.json(models);
    } catch (error: any) {
      console.error("Get models error:", error);
      res.status(500).json({ error: "Failed to get models" });
    }
  });

  // Get device model by slug
  app.get("/api/catalog/models/:slug", async (req, res) => {
    try {
      const model = await storage.getDeviceModelBySlug(req.params.slug);
      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }

      const variants = await storage.getDeviceVariantsByModelId(model.id);
      
      // Get inventory and price tiers for each variant
      const variantsWithDetails = await Promise.all(
        variants.map(async (variant) => {
          const inventory = await storage.getInventoryByVariantId(variant.id);
          const priceTiers = await storage.getPriceTiersByVariantId(variant.id);
          return { ...variant, inventory, priceTiers };
        })
      );

      res.json({ ...model, variants: variantsWithDetails });
    } catch (error: any) {
      console.error("Get model error:", error);
      res.status(500).json({ error: "Failed to get model" });
    }
  });

  // Get full catalog with variants
  app.get("/api/catalog", async (req, res) => {
    try {
      const models = await storage.getAllDeviceModels();
      
      const modelsWithVariants = await Promise.all(
        models.map(async (model) => {
          const variants = await storage.getDeviceVariantsByModelId(model.id);
          
          // Get inventory and price tiers for each variant
          const variantsWithDetails = await Promise.all(
            variants.map(async (variant) => {
              const inventory = await storage.getInventoryByVariantId(variant.id);
              const priceTiers = await storage.getPriceTiersByVariantId(variant.id);
              return { ...variant, inventory, priceTiers, deviceModel: model };
            })
          );
          
          return { ...model, variants: variantsWithDetails };
        })
      );

      res.json(modelsWithVariants);
    } catch (error: any) {
      console.error("Get catalog error:", error);
      res.status(500).json({ error: "Failed to get catalog" });
    }
  });

  // Get all categories
  const getCategoriesHandler = async (req: any, res: any) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error: any) {
      console.error("Get categories error:", error);
      res.status(500).json({ error: "Failed to get categories" });
    }
  };
  
  app.get("/api/catalog/categories", getCategoriesHandler);
  app.get("/api/categories", getCategoriesHandler);

  // ==================== CART ROUTES ====================
  
  // Get user's cart
  app.get("/api/cart", requireAuth, async (req, res) => {
    try {
      let cart = await storage.getCartByUserId(req.session.userId!);
      
      // Create cart if it doesn't exist
      if (!cart) {
        const companyUsers = await storage.getCompanyUsersByUserId(req.session.userId!);
        if (companyUsers.length === 0) {
          return res.status(400).json({ error: "No company found for user" });
        }
        
        cart = await storage.createCart({
          userId: req.session.userId!,
          companyId: companyUsers[0].companyId,
        });
      }

      const items = await storage.getCartItems(cart.id);
      
      // Get full details for each cart item
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          const variant = await storage.getDeviceVariant(item.deviceVariantId);
          const model = variant ? await storage.getDeviceModel(variant.deviceModelId) : null;
          return { ...item, variant, model };
        })
      );

      res.json({ cart, items: itemsWithDetails });
    } catch (error: any) {
      console.error("Get cart error:", error);
      res.status(500).json({ error: "Failed to get cart" });
    }
  });

  // Add item to cart
  app.post("/api/cart/items", requireAuth, async (req, res) => {
    try {
      const { deviceVariantId, quantity } = req.body;

      let cart = await storage.getCartByUserId(req.session.userId!);
      if (!cart) {
        const companyUsers = await storage.getCompanyUsersByUserId(req.session.userId!);
        cart = await storage.createCart({
          userId: req.session.userId!,
          companyId: companyUsers[0].companyId,
        });
      }

      // Get price tier for quantity
      const priceTiers = await storage.getPriceTiersByVariantId(deviceVariantId);
      const applicableTier = priceTiers.find(
        tier => quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity)
      );
      
      const unitPrice = applicableTier?.unitPrice || "0";

      const item = await storage.addCartItem({
        cartId: cart.id,
        deviceVariantId,
        quantity,
        unitPriceSnapshot: unitPrice,
      });

      res.json(item);
    } catch (error: any) {
      console.error("Add cart item error:", error);
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  });

  // Update cart item quantity
  app.patch("/api/cart/items/:id", requireAuth, async (req, res) => {
    try {
      const { quantity } = req.body;
      const item = await storage.updateCartItem(req.params.id, { quantity });
      res.json(item);
    } catch (error: any) {
      console.error("Update cart item error:", error);
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  // Remove item from cart
  app.delete("/api/cart/items/:id", requireAuth, async (req, res) => {
    try {
      await storage.removeCartItem(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Remove cart item error:", error);
      res.status(500).json({ error: "Failed to remove cart item" });
    }
  });

  // ==================== ORDER ROUTES ====================
  
  // Create order from cart
  app.post("/api/orders", requireAuth, async (req, res) => {
    try {
      const { paymentMethod, shippingAddressId, billingAddressId, notes } = req.body;

      const cart = await storage.getCartByUserId(req.session.userId!);
      if (!cart) {
        return res.status(400).json({ error: "Cart not found" });
      }

      const items = await storage.getCartItems(cart.id);
      if (items.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      // Calculate totals
      let subtotal = 0;
      for (const item of items) {
        subtotal += parseFloat(item.unitPriceSnapshot) * item.quantity;
      }

      const shippingCost = 25; // Flat rate for now
      const taxAmount = subtotal * 0.08; // 8% tax
      const total = subtotal + shippingCost + taxAmount;

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

      // Create order
      const order = await storage.createOrder({
        orderNumber,
        companyId: cart.companyId,
        createdByUserId: req.session.userId!,
        status: "pending_payment",
        subtotal: subtotal.toFixed(2),
        shippingCost: shippingCost.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        discountAmount: "0",
        total: total.toFixed(2),
        currency: "USD",
        paymentStatus: "unpaid",
        paymentMethod: paymentMethod || "card",
        shippingAddressId: shippingAddressId || null,
        billingAddressId: billingAddressId || null,
        notes: notes || null,
      });

      // Create order items
      for (const item of items) {
        await storage.createOrderItem({
          orderId: order.id,
          deviceVariantId: item.deviceVariantId,
          quantity: item.quantity,
          unitPrice: item.unitPriceSnapshot,
          lineTotal: (parseFloat(item.unitPriceSnapshot) * item.quantity).toFixed(2),
        });
      }

      // Clear cart
      await storage.clearCart(cart.id);

      res.json(order);
    } catch (error: any) {
      console.error("Create order error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Get user's company orders
  app.get("/api/orders", requireAuth, async (req, res) => {
    try {
      const companyUsers = await storage.getCompanyUsersByUserId(req.session.userId!);
      if (companyUsers.length === 0) {
        return res.json([]);
      }

      const orders = await storage.getOrdersByCompanyId(companyUsers[0].companyId);
      res.json(orders);
    } catch (error: any) {
      console.error("Get orders error:", error);
      res.status(500).json({ error: "Failed to get orders" });
    }
  });

  // Get order by number
  app.get("/api/orders/:orderNumber", requireAuth, async (req, res) => {
    try {
      const order = await storage.getOrderByNumber(req.params.orderNumber);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const items = await storage.getOrderItems(order.id);
      const payments = await storage.getPaymentsByOrderId(order.id);
      const shipments = await storage.getShipmentsByOrderId(order.id);

      res.json({ ...order, items, payments, shipments });
    } catch (error: any) {
      console.error("Get order error:", error);
      res.status(500).json({ error: "Failed to get order" });
    }
  });

  // ==================== STRIPE PAYMENT ROUTES ====================
  
  // Create payment intent
  app.post("/api/create-payment-intent", requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: "Payment processing is not configured" });
      }

      const { amount, orderId } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(amount) * 100), // Convert to cents
        currency: "usd",
        metadata: { orderId },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Create payment intent error:", error);
      res.status(500).json({ error: "Failed to create payment intent: " + error.message });
    }
  });

  // Confirm payment and update order
  app.post("/api/confirm-payment", requireAuth, async (req, res) => {
    try {
      const { orderId, paymentIntentId } = req.body;

      if (!orderId) {
        return res.status(400).json({ error: "Order ID is required" });
      }

      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Update order status
      await storage.updateOrder(orderId, {
        status: "processing",
        paymentStatus: "paid",
      });

      // Record payment if payment intent provided
      if (paymentIntentId && stripe) {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        await storage.createPayment({
          orderId,
          amount: (paymentIntent.amount / 100).toFixed(2),
          currency: paymentIntent.currency.toUpperCase(),
          method: "card",
          status: "paid",
          stripePaymentIntentId: paymentIntent.id,
          processedAt: new Date(),
        });
      }

      res.json({ success: true, order });
    } catch (error: any) {
      console.error("Confirm payment error:", error);
      res.status(500).json({ error: "Failed to confirm payment" });
    }
  });

  // ==================== COMPANY ROUTES ====================
  
  // Get company by ID (buyer can only access their own)
  app.get("/api/companies/:id", requireAuth, async (req, res) => {
    try {
      const company = await storage.getCompany(req.params.id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      // Check if user is admin or member of this company
      if (req.session.userRole !== "admin" && req.session.userRole !== "super_admin") {
        const companyUsers = await storage.getCompanyUsersByUserId(req.session.userId!);
        const isMember = companyUsers.some((cu) => cu.companyId === req.params.id);
        if (!isMember) {
          return res.status(403).json({ error: "Access denied" });
        }
      }

      // Get addresses
      const shippingAddresses = await storage.getShippingAddressesByCompanyId(company.id);
      const billingAddresses = await storage.getBillingAddressesByCompanyId(company.id);

      res.json({
        ...company,
        shippingAddresses,
        billingAddresses,
      });
    } catch (error: any) {
      console.error("Get company error:", error);
      res.status(500).json({ error: "Failed to get company" });
    }
  });
  
  // ==================== ADMIN ROUTES ====================
  
  // Get all companies (admin only)
  app.get("/api/admin/companies", requireAdmin, async (req, res) => {
    try {
      const companies = await storage.getAllCompanies();
      res.json(companies);
    } catch (error: any) {
      console.error("Get companies error:", error);
      res.status(500).json({ error: "Failed to get companies" });
    }
  });

  // Update company status (admin only)
  app.patch("/api/admin/companies/:id", requireAdmin, async (req, res) => {
    try {
      const { status, creditLimit } = req.body;
      const updates: any = {};
      if (status) updates.status = status;
      if (creditLimit !== undefined) updates.creditLimit = creditLimit;

      const company = await storage.updateCompany(req.params.id, updates);
      
      // Log the action
      await storage.createAuditLog({
        actorUserId: req.session.userId!,
        companyId: req.params.id,
        action: "company_updated",
        entityType: "company",
        entityId: req.params.id,
        newValues: JSON.stringify(updates),
      });

      res.json(company);
    } catch (error: any) {
      console.error("Update company error:", error);
      res.status(500).json({ error: "Failed to update company" });
    }
  });

  // Get all FAQs
  app.get("/api/faqs", async (req, res) => {
    try {
      const faqs = await storage.getAllFaqs();
      res.json(faqs);
    } catch (error: any) {
      console.error("Get FAQs error:", error);
      res.status(500).json({ error: "Failed to get FAQs" });
    }
  });

  // Create support ticket
  app.post("/api/support/tickets", async (req, res) => {
    try {
      const { name, email, company, subject, message } = req.body;
      
      // For non-authenticated users, create ticket without user/company link
      const ticket = await storage.createSupportTicket({
        companyId: req.session.userId ? undefined : null,
        createdByUserId: req.session.userId || null,
        subject,
        description: `From: ${name} (${email})\nCompany: ${company || 'N/A'}\n\n${message}`,
        status: "open",
        priority: "medium",
      });

      res.json(ticket);
    } catch (error: any) {
      console.error("Create ticket error:", error);
      res.status(500).json({ error: "Failed to create ticket" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
