import { useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { products } from '@/data/products';

interface Look {
  id: string;
  title: string;
  description: string;
  image: string;
  products: string[];
  totalPrice: number;
  discountedPrice: number;
}

const curated_looks: Look[] = [
  {
    id: '1',
    title: 'Casual Weekend',
    description: 'Perfect for relaxed days out',
    image: '/api/placeholder/400/500',
    products: ['1', '2'], // T-shirt + Jeans
    totalPrice: 165,
    discountedPrice: 148.5 // 10% bundle discount
  },
  {
    id: '2', 
    title: 'Professional Edge',
    description: 'Sleek look for the office',
    image: '/api/placeholder/400/500',
    products: ['5', '4'], // White Shirt + Jacket
    totalPrice: 245,
    discountedPrice: 220.5 // 10% bundle discount
  },
  {
    id: '3',
    title: 'Cozy Comfort',
    description: 'Ultimate comfort meets style',
    image: '/api/placeholder/400/500',
    products: ['3', '2'], // Hoodie + Jeans
    totalPrice: 205,
    discountedPrice: 184.5 // 10% bundle discount
  }
];

const ShopTheLookCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addItem } = useCart();

  const nextLook = () => {
    setCurrentIndex((prev) => (prev + 1) % curated_looks.length);
  };

  const prevLook = () => {
    setCurrentIndex((prev) => (prev - 1 + curated_looks.length) % curated_looks.length);
  };

  const addAllToCart = (look: Look) => {
    look.products.forEach(productId => {
      const product = products.find(p => p.id === productId);
      if (product) {
        addItem({
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          size: product.sizes[0], // Default size
          color: product.colors[0], // Default color
          quantity: 1,
          inStock: product.inStock
        });
      }
    });
  };

  const currentLook = curated_looks[currentIndex];
  const lookProducts = currentLook.products.map(id => products.find(p => p.id === id)).filter(Boolean);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-light mb-4">Shop the Look</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover perfectly curated outfits and add complete looks to your cart with one click
          </p>
        </div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Look Image */}
            <div className="relative">
              <div className="aspect-[4/5] bg-muted rounded-lg overflow-hidden">
                <img 
                  src={currentLook.image} 
                  alt={currentLook.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Hot spots for individual products */}
                <div className="absolute top-1/4 right-1/4">
                  <Button 
                    size="sm" 
                    className="rounded-full w-8 h-8 p-0 animate-pulse"
                    variant="secondary"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-1/3 left-1/3">
                  <Button 
                    size="sm" 
                    className="rounded-full w-8 h-8 p-0 animate-pulse"
                    variant="secondary"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Look Details */}
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="mb-2">
                  Look #{currentIndex + 1}
                </Badge>
                <h3 className="text-2xl font-light mb-2">{currentLook.title}</h3>
                <p className="text-muted-foreground">{currentLook.description}</p>
              </div>

              {/* Products in Look */}
              <div className="space-y-3">
                <h4 className="font-medium">Includes:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lookProducts.map((product) => (
                    <Card key={product!.id} className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          <img 
                            src={product!.image} 
                            alt={product!.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{product!.name}</p>
                            <p className="text-xs text-muted-foreground">{product!.category}</p>
                            <p className="text-sm font-medium">${product!.price}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Individual prices:</span>
                  <span className="text-sm line-through">${currentLook.totalPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Bundle price:</span>
                  <span className="text-xl font-bold text-green-600">
                    ${currentLook.discountedPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-600">You save:</span>
                  <span className="text-green-600 font-medium">
                    ${(currentLook.totalPrice - currentLook.discountedPrice).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => addAllToCart(currentLook)}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add Complete Look to Cart
                </Button>
                <Button variant="outline" className="w-full">
                  View Individual Items
                </Button>
              </div>

              {/* Navigation */}
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={prevLook}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {curated_looks.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={nextLook}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopTheLookCarousel;