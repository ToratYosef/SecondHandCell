import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Public Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import Support from "@/pages/Support";
import Catalog from "@/pages/Catalog";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";

// Auth Pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import RegisterThanks from "@/pages/RegisterThanks";

// Buyer Portal Pages
import { BuyerLayout } from "@/components/BuyerLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import BuyerDashboard from "@/pages/buyer/Dashboard";
import BuyerCatalog from "@/pages/buyer/BuyerCatalog";
import DeviceDetails from "@/pages/buyer/DeviceDetails";
import Cart from "@/pages/buyer/Cart";
import Checkout from "@/pages/buyer/Checkout";
import Orders from "@/pages/buyer/Orders";

// Admin Portal Pages
import { AdminLayout } from "@/components/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import Companies from "@/pages/admin/Companies";
import Inventory from "@/pages/admin/Inventory";

function Router() {
  return (
    <Switch>
      {/* Public Pages */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/faq" component={FAQ} />
      <Route path="/support" component={Support} />
      <Route path="/catalog" component={Catalog} />
      
      {/* Legal Pages */}
      <Route path="/legal/terms" component={Terms} />
      <Route path="/legal/privacy" component={Privacy} />
      
      {/* Auth Pages */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/register/thanks" component={RegisterThanks} />
      
      {/* Buyer Portal Routes */}
      <Route path="/buyer/dashboard">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <BuyerLayout>
              <BuyerDashboard />
            </BuyerLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/buyer/catalog">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <BuyerLayout>
              <BuyerCatalog />
            </BuyerLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/buyer/devices/:slug">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <BuyerLayout>
              <DeviceDetails />
            </BuyerLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/buyer/cart">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <BuyerLayout>
              <Cart />
            </BuyerLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/buyer/checkout">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <BuyerLayout>
              <Checkout />
            </BuyerLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/buyer/orders">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <BuyerLayout>
              <Orders />
            </BuyerLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/buyer/saved-lists">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <BuyerLayout>
              <div className="space-y-6">
                <h1 className="text-3xl font-semibold tracking-tight">Saved Lists</h1>
                <p className="text-muted-foreground">Manage your saved device lists</p>
              </div>
            </BuyerLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/buyer/account">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <BuyerLayout>
              <div className="space-y-6">
                <h1 className="text-3xl font-semibold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground">Manage your account and preferences</p>
              </div>
            </BuyerLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      {/* Admin Portal Routes */}
      <Route path="/admin/dashboard">
        {() => (
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/companies">
        {() => (
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <Companies />
            </AdminLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/inventory">
        {() => (
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <Inventory />
            </AdminLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/orders">
        {() => (
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <div className="space-y-6">
                <h1 className="text-3xl font-semibold tracking-tight">Order Management</h1>
                <p className="text-muted-foreground">Manage and fulfill customer orders</p>
              </div>
            </AdminLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/users">
        {() => (
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <div className="space-y-6">
                <h1 className="text-3xl font-semibold tracking-tight">User Management</h1>
                <p className="text-muted-foreground">Manage platform users and permissions</p>
              </div>
            </AdminLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/settings">
        {() => (
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <div className="space-y-6">
                <h1 className="text-3xl font-semibold tracking-tight">Admin Settings</h1>
                <p className="text-muted-foreground">Configure platform settings</p>
              </div>
            </AdminLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
