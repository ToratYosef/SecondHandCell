import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/components/ScrollToTop";
import NotFound from "@/pages/not-found";

// Public Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import Support from "@/pages/Support";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";

// Auth Pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import RegisterThanks from "@/pages/RegisterThanks";

// Buyer Portal Pages
import { ProtectedRoute } from "@/components/ProtectedRoute";
import BuyerDashboard from "@/pages/buyer/Dashboard";
import BuyerCatalog from "@/pages/buyer/BuyerCatalog";
import DeviceDetails from "@/pages/buyer/DeviceDetails";
import Cart from "@/pages/buyer/Cart";
import Checkout from "@/pages/buyer/Checkout";
import Orders from "@/pages/buyer/Orders";
import OrderDetail from "@/pages/buyer/OrderDetail";
import RequestQuote from "@/pages/buyer/RequestQuote";
import Quotes from "@/pages/buyer/Quotes";
import QuoteDetail from "@/pages/buyer/QuoteDetail";
import SavedLists from "@/pages/buyer/SavedLists";
import SavedListDetail from "@/pages/buyer/SavedListDetail";
import Account from "@/pages/buyer/Account";
import EditProfile from "@/pages/buyer/EditProfile";
import ChangePassword from "@/pages/buyer/ChangePassword";

// Admin Portal Pages
import { AdminLayout } from "@/components/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import Companies from "@/pages/admin/Companies";
import Inventory from "@/pages/admin/Inventory";
import AdminQuotes from "@/pages/admin/Quotes";
import AdminOrders from "@/pages/admin/Orders";
import AdminUsers from "@/pages/admin/Users";
import AdminSettings from "@/pages/admin/Settings";
import AdminReports from "@/pages/admin/Reports";

function Router() {
  return (
    <Switch>
      {/* Public Pages */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/faq" component={FAQ} />
      <Route path="/support" component={Support} />
      
      {/* Legal Pages */}
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      
      {/* Auth Pages */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/register/thanks" component={RegisterThanks} />
      
      {/* Buyer Portal Routes */}
      <Route path="/buyer/dashboard">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <BuyerDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/buyer/catalog">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <BuyerCatalog />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/buyer/devices/:slug">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <DeviceDetails />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/buyer/cart">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <Cart />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/buyer/checkout">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <Checkout />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/buyer/orders">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <Orders />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/buyer/orders/:orderNumber">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <OrderDetail />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/buyer/quotes">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <Quotes />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/buyer/quotes/:id">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <QuoteDetail />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/buyer/quotes/new">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <RequestQuote />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/buyer/saved-lists">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <SavedLists />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/buyer/saved-lists/:id">
        {(params) => (
          <ProtectedRoute requiredRole="buyer">
            <SavedListDetail params={params} />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/buyer/account">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <Account />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/buyer/account/edit">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <EditProfile />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/buyer/account/password">
        {() => (
          <ProtectedRoute requiredRole="buyer">
            <ChangePassword />
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
      <Route path="/admin/quotes">
        {() => (
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminQuotes />
            </AdminLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/orders">
        {() => (
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/users">
        {() => (
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/settings">
        {() => (
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/reports">
        {() => (
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminReports />
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
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const redirectPath = sessionStorage.getItem("spaRedirect");
      if (redirectPath) {
        sessionStorage.removeItem("spaRedirect");
        setLocation(redirectPath);
      }

      const theme = localStorage.getItem("theme");
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [setLocation]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScrollToTop />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
