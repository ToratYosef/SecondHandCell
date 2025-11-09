import CartDrawer from '../CartDrawer';
import { useState } from 'react';
import iphoneBlue from '@assets/generated_images/iPhone_13_Pro_Blue_b5275bdb.png';
import iphoneBlack from '@assets/generated_images/iPhone_13_Pro_Black_0adbf2a8.png';

export default function CartDrawerExample() {
  const [items, setItems] = useState([
    {
      id: '1',
      productId: 'iphone-13-pro-blue',
      title: 'iPhone 13 Pro 128GB - Blue',
      image: iphoneBlue,
      variant: 'Grade A, Unlocked',
      price: 64900,
      quantity: 2,
    },
    {
      id: '2',
      productId: 'iphone-13-pro-black',
      title: 'iPhone 13 Pro 256GB - Black',
      image: iphoneBlack,
      variant: 'Grade A, Unlocked',
      price: 74900,
      quantity: 1,
    },
  ]);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setItems(items.map(item => item.id === id ? { ...item, quantity } : item));
    console.log(`Updated quantity for ${id}:`, quantity);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    console.log('Removed item:', id);
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout');
  };

  return (
    <div className="p-8">
      <CartDrawer
        items={items}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
