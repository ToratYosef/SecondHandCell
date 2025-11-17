# SecondHand(Whole)Cell - B2B Wholesale Device Platform

## Overview

SecondHand(Whole)Cell is a production B2B wholesale buying platform for certified pre-owned electronic devices (smartphones, tablets, laptops, wearables). The platform connects resellers, refurbishers, and dealers with a live inventory catalog, enabling bulk wholesale orders with transparent tiered pricing.

**Key Features:**
- **Full authentication system**: Login, registration, session management with bcrypt password hashing
- Live wholesale device catalog with tiered pricing by quantity
- Multi-role authentication (buyer, admin, super_admin)
- Complete order management with payment processing
- Quote request and management system
- Saved lists feature for buyers to organize and save device selections
- **Buyer account management**: Profile editing, password changes, account overview
- Company account approval workflow
- Inventory and pricing management
- Stripe payment integration

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with Vite as the build tool and development server

**Routing**: Wouter (lightweight client-side routing)
- Public routes: Marketing pages, catalog preview, legal pages
- Buyer portal routes: Protected dashboard, catalog, cart, orders, account management
- Admin portal routes: Protected admin dashboard, inventory, companies, orders management

**UI Component System**: shadcn/ui with Radix UI primitives
- Styling: Tailwind CSS with custom design system (Shopify-inspired marketing, Material Design portals)
- Typography: Inter (primary), JetBrains Mono (monospace for data)
- Theme: Light mode with custom HSL color variables
- Component library includes: Cards, Forms, Dialogs, Tables, Badges, Status indicators

**State Management**: 
- TanStack Query (React Query) for server state and API data fetching
- Query client configured with custom fetch wrapper for API requests
- Session-based authentication state

**Form Handling**: React Hook Form with Zod validation schemas

### Backend Architecture

**Framework**: Express.js with TypeScript

**API Structure**: RESTful API with route handlers under `/api/*`
- Authentication endpoints (`/api/auth/*`)
- Resource endpoints for devices, orders, quotes, inventory, etc.
- Middleware chain: JSON parsing, session management, authentication checks, role-based access control

**Session Management**: express-session with PostgreSQL session store (connect-pg-simple)
- Session-based authentication (no JWT)
- Role-based access control middleware (`requireAuth`, `requireAdmin`)

**Authentication**: 
- Credential-based authentication with bcrypt password hashing
- Three user roles: `buyer`, `admin`, `super_admin`
- Session data includes userId and userRole

**Data Access Layer**: Storage abstraction pattern
- `server/storage.ts` provides interface for all database operations
- Methods organized by entity (users, companies, devices, orders, etc.)
- Separation of concerns between routes and data access

### Database Architecture

**ORM**: Drizzle ORM with PostgreSQL dialect

**Database Provider**: Neon serverless PostgreSQL with WebSocket connection pooling

**Schema Design** (key tables):
- **users**: Authentication and user profiles with role-based access
- **companies**: Business entities with approval workflow (pending_review, approved, rejected, suspended)
- **companyUsers**: Many-to-many relationship between users and companies with role assignments
- **deviceCategories**: Product taxonomy (smartphones, tablets, laptops, wearables)
- **deviceModels**: Product master data (brand, name, SKU, slug, description)
- **deviceVariants**: SKU variants (storage, color, condition grade, network lock status)
- **inventoryItems**: Stock management with quantity tracking and status
- **priceTiers**: Quantity-based pricing tiers per variant
- **carts/cartItems**: Shopping cart persistence
- **orders/orderItems**: Complete order lifecycle with status tracking
- **quotes/quoteItems**: Custom quote requests and management
- **shippingAddresses/billingAddresses**: Customer address management
- **payments**: Payment transaction records with multiple payment methods
- **shipments**: Shipment tracking information
- **savedLists/savedListItems**: Buyer wishlist functionality
- **faqs**: Dynamic FAQ content management
- **announcements**: Marketing content/banners
- **supportTickets**: Customer support ticketing system
- **auditLogs**: System activity audit trail

**Enums**: PostgreSQL enums for controlled vocabularies (user roles, company status, order status, payment methods, condition grades, etc.)

**Relationships**: Drizzle ORM relations define foreign key relationships and enable join queries

### Payment Processing

**Stripe Integration**: 
- Stripe JS SDK for frontend payment elements
- Stripe server SDK for backend payment processing
- API version: 2024-11-20.acacia
- Support for card payments via Stripe
- Database records for offline payment methods (wire, ACH, net terms)

### External Dependencies

**Third-Party Services**:
- Stripe: Payment processing for credit card transactions
- Neon: Serverless PostgreSQL database hosting
- Google Fonts: Inter and JetBrains Mono typography

**Key NPM Packages**:
- @neondatabase/serverless: PostgreSQL database driver with WebSocket support
- drizzle-orm: TypeScript ORM for type-safe database queries
- bcrypt: Password hashing for authentication
- express-session: Server-side session management
- connect-pg-simple: PostgreSQL session store
- @stripe/stripe-js & @stripe/react-stripe-js: Payment UI components
- stripe: Server-side payment API
- @tanstack/react-query: Async state management
- react-hook-form: Form state management
- zod: Runtime schema validation
- wouter: Lightweight React routing
- @radix-ui/*: Headless UI component primitives
- tailwindcss: Utility-first CSS framework

**Build Tools**:
- Vite: Frontend build tool and dev server with HMR
- esbuild: Backend bundler for production builds
- TypeScript: Type checking across full stack
- PostCSS with Autoprefixer: CSS processing

**Development Environment**:
- Replit-specific plugins for dev banner, error overlay, and cartographer
- WebSocket configuration for Neon serverless in development