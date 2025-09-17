import ProductCard from "./ProductCard";
import tshirtImage from "@/assets/product-tshirt.jpg";
import jeansImage from "@/assets/product-jeans.jpg";
import hoodieImage from "@/assets/product-hoodie.jpg";
import jacketImage from "@/assets/product-jacket.jpg";

const FeaturedProducts = () => {
  const products = [
    {
      id: "1",
      name: "Essential Black Tee",
      price: 45,
      image: tshirtImage,
      category: "Essentials",
      isNew: true,
    },
    {
      id: "2", 
      name: "Premium Denim",
      price: 120,
      originalPrice: 150,
      image: jeansImage,
      category: "Denim",
      isOnSale: true,
    },
    {
      id: "3",
      name: "Comfort Hoodie",
      price: 85,
      image: hoodieImage,
      category: "Essentials",
    },
    {
      id: "4",
      name: "Minimalist Jacket",
      price: 180,
      image: jacketImage,
      category: "Outerwear",
      isNew: true,
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            Featured Collection
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Carefully curated pieces that define modern elegance and timeless style
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a href="/shop" className="group inline-flex items-center text-foreground hover:text-gray-600 transition-colors">
            <span className="text-lg font-medium">View All Products</span>
            <svg 
              className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;