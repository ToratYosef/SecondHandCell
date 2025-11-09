import ProductCard from '../ProductCard';
import iphoneBlue from '@assets/generated_images/iPhone_13_Pro_Blue_b5275bdb.png';

export default function ProductCardExample() {
  return (
    <div className="p-8 bg-gradient-to-br from-blue-600 to-purple-600 max-w-sm">
      <ProductCard
        id="iphone-13-pro"
        title="iPhone 13 Pro 128GB - Blue"
        brand="Apple"
        image={iphoneBlue}
        grade="A"
        price={64900}
        originalPrice={79900}
        stock={12}
        onClick={() => console.log('Product clicked')}
      />
    </div>
  );
}
