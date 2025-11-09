import AdminTable from '../AdminTable';
import { Badge } from '@/components/ui/badge';

export default function AdminTableExample() {
  const columns = [
    { key: 'orderNumber', label: 'Order #' },
    { key: 'customer', label: 'Customer' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => {
        const colors = {
          paid: 'bg-green-500/10 text-green-500',
          pending: 'bg-yellow-500/10 text-yellow-500',
          shipped: 'bg-blue-500/10 text-blue-500',
        };
        return <Badge className={colors[value as keyof typeof colors] || ''}>{value}</Badge>;
      }
    },
    { 
      key: 'total', 
      label: 'Total',
      render: (value: number) => `$${(value / 100).toFixed(2)}`
    },
  ];

  const data = [
    { orderNumber: 'ORD-2025-0001', customer: 'John Doe', status: 'paid', total: 129800 },
    { orderNumber: 'ORD-2025-0002', customer: 'Jane Smith', status: 'pending', total: 64900 },
    { orderNumber: 'ORD-2025-0003', customer: 'Acme Corp', status: 'shipped', total: 1298000 },
  ];

  return (
    <div className="p-8 bg-background">
      <AdminTable
        columns={columns}
        data={data}
        onEdit={(row) => console.log('Edit:', row)}
        onDelete={(row) => console.log('Delete:', row)}
      />
    </div>
  );
}
