import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  isOnSale?: boolean;
  originalPrice?: number;
}

const ProductCard = ({ 
  id,
  name, 
  price, 
  image, 
  category, 
  isNew, 
  isOnSale, 
  originalPrice 
}: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const product = products.find(p => p.id === id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    
    if (!product) return;

    // Use first available size and color for quick add
    const defaultSize = product.sizes[0];
    const defaultColor = product.colors[0];

    addItem({
      productId: id,
      name,
      price,
      originalPrice,
      image,
      size: defaultSize,
      color: defaultColor,
      quantity: 1,
      inStock: product.inStock
    });
  };

  return (
    <a 
      href={`/product/${id}`}
      className="group relative bg-card overflow-hidden transition-all-smooth hover:shadow-medium block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="bg-primary text-primary-foreground px-2 py-1 text-xs font-medium">
              NEW
            </span>
          )}
          {isOnSale && (
            <span className="bg-destructive text-destructive-foreground px-2 py-1 text-xs font-medium">
              SALE
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 bg-white/80 backdrop-blur hover:bg-white transition-all-smooth ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart 
            className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </Button>

        {/* Quick Add Button */}
        <div className={`absolute bottom-3 left-3 right-3 transition-all-smooth ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <Button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all-smooth"
            onClick={handleQuickAdd}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {category}
        </p>
        <h3 className="font-medium text-foreground mb-2 group-hover:text-gray-600 transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">
            ${price}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice}
            </span>
          )}
        </div>
      </div>
    </a>
  );
};

export default ProductCard;