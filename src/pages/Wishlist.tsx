import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const Wishlist = () => {
  const { state, removeFromWishlist, getWishlistCount } = useWishlist();
  const { addItem } = useCart();

  const wishlistCount = getWishlistCount();

  const handleAddToCart = (product: any) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      size: product.sizes[0], // Default to first available size
      color: product.colors[0], // Default to first available color
      quantity: 1,
      inStock: product.inStock,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500" />
              My Wishlist ({wishlistCount})
            </h1>
            <Link to="/shop">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>

          {state.items.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-24 w-24 mx-auto text-muted-foreground/50 mb-6" />
              <h2 className="text-2xl font-medium mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Save items you love to view them later
              </p>
              <Link to="/shop">
                <Button size="lg">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {state.items.map((product) => (
                  <div key={product.id} className="group relative">
                    <ProductCard 
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      category={product.category}
                      isNew={product.isNew}
                      isOnSale={product.isOnSale}
                      originalPrice={product.originalPrice}
                    />
                    
                    {/* Wishlist-specific actions */}
                    <div className="mt-4 space-y-2">
                      <Button 
                        className="w-full" 
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeFromWishlist(product.id)}
                      >
                        <Heart className="h-4 w-4 mr-2 fill-current" />
                        Remove from Wishlist
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Wishlist Stats */}
              <div className="mt-12 bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Wishlist Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{wishlistCount}</p>
                    <p className="text-sm text-muted-foreground">Items Saved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      ${state.items.reduce((total, item) => total + item.price, 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      ${state.items.filter(item => item.originalPrice).reduce((total, item) => 
                        total + (item.originalPrice! - item.price), 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">Potential Savings</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;