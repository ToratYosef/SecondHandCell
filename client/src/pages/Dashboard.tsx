import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminTable from "@/components/AdminTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Package, ShoppingCart, Users, Plus } from "lucide-react";

export default function Dashboard() {
  // todo: remove mock functionality
  const stats = [
    { title: "Total Revenue", value: "$45,231", icon: DollarSign, change: "+20%" },
    { title: "Total Orders", value: "342", icon: ShoppingCart, change: "+12%" },
    { title: "Products", value: "126", icon: Package, change: "+3%" },
    { title: "Customers", value: "892", icon: Users, change: "+18%" },
  ];

  const orderColumns = [
    { key: 'orderNumber', label: 'Order #' },
    { key: 'customer', label: 'Customer' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => {
        const colors: Record<string, string> = {
          paid: 'bg-green-500/10 text-green-500',
          pending: 'bg-yellow-500/10 text-yellow-500',
          shipped: 'bg-blue-500/10 text-blue-500',
          delivered: 'bg-green-600/10 text-green-600',
        };
        return <Badge className={colors[value] || ''}>{value}</Badge>;
      }
    },
    { 
      key: 'total', 
      label: 'Total',
      render: (value: number) => `$${(value / 100).toFixed(2)}`
    },
    { key: 'date', label: 'Date' },
  ];

  const productColumns = [
    { key: 'title', label: 'Product' },
    { key: 'sku', label: 'SKU' },
    { 
      key: 'stock', 
      label: 'Stock',
      render: (value: number) => (
        <span className={value < 10 ? 'text-destructive font-medium' : ''}>
          {value}
        </span>
      )
    },
    { 
      key: 'price', 
      label: 'Price',
      render: (value: number) => `$${(value / 100).toFixed(2)}`
    },
  ];

  const orders = [
    { orderNumber: 'ORD-2025-0001', customer: 'John Doe', status: 'paid', total: 129800, date: '2025-11-08' },
    { orderNumber: 'ORD-2025-0002', customer: 'Jane Smith', status: 'pending', total: 64900, date: '2025-11-08' },
    { orderNumber: 'ORD-2025-0003', customer: 'Acme Corp', status: 'shipped', total: 1298000, date: '2025-11-07' },
    { orderNumber: 'ORD-2025-0004', customer: 'Tech Store Inc', status: 'delivered', total: 549000, date: '2025-11-06' },
  ];

  const products = [
    { title: 'iPhone 13 Pro 128GB', sku: 'IP13P-128-A-BL', stock: 12, price: 64900 },
    { title: 'iPhone 13 Pro 256GB', sku: 'IP13P-256-A-BL', stock: 8, price: 74900 },
    { title: 'Samsung Galaxy S21', sku: 'SG-S21-256-B', stock: 5, price: 59900 },
    { title: 'Google Pixel 7 Pro', sku: 'GP7P-128-A', stock: 20, price: 54900 },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your products, orders, and inventory</p>
          </div>
          <Button data-testid="button-add-product">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600 mt-1">{stat.change} from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
            <TabsTrigger value="products" data-testid="tab-products">Products</TabsTrigger>
            <TabsTrigger value="inventory" data-testid="tab-inventory">Inventory</TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminTable
                  columns={orderColumns}
                  data={orders}
                  onEdit={(row) => console.log('Edit order:', row)}
                  onDelete={(row) => console.log('Delete order:', row)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminTable
                  columns={productColumns}
                  data={products}
                  onEdit={(row) => console.log('Edit product:', row)}
                  onDelete={(row) => console.log('Delete product:', row)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Stock Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2 text-destructive">Low Stock Alert</h3>
                    <p className="text-sm text-muted-foreground mb-4">The following products have stock below 10 units</p>
                    <AdminTable
                      columns={productColumns}
                      data={products.filter(p => p.stock < 10)}
                      onEdit={(row) => console.log('Edit product:', row)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminTable
                  columns={[
                    { key: 'name', label: 'Name' },
                    { key: 'email', label: 'Email' },
                    { 
                      key: 'role', 
                      label: 'Role',
                      render: (value: string) => <Badge>{value}</Badge>
                    },
                    { key: 'orders', label: 'Orders' },
                  ]}
                  data={[
                    { name: 'John Doe', email: 'john@example.com', role: 'customer', orders: 5 },
                    { name: 'Jane Smith', email: 'jane@example.com', role: 'wholesale', orders: 12 },
                    { name: 'Admin User', email: 'admin@example.com', role: 'admin', orders: 0 },
                  ]}
                  onEdit={(row) => console.log('Edit user:', row)}
                  onDelete={(row) => console.log('Delete user:', row)}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
