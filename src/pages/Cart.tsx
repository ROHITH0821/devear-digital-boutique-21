import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, Truck, Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from '@/contexts/CartContext';
import CouponSystem from '@/components/Coupons/CouponSystem';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Cart = () => {
  const { 
    state, 
    removeItem, 
    updateQuantity, 
    saveForLater, 
    moveToCart,
    getCartTotal, 
    getCartCount,
    getShippingThreshold 
  } = useCart();

  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const { current, needed, progress } = getShippingThreshold();
  const total = getCartTotal();
  const itemCount = getCartCount();

  const calculateFinalTotal = () => {
    if (!appliedCoupon) return total;
    
    if (appliedCoupon.type === 'percentage') {
      return total * (1 - appliedCoupon.discount / 100);
    }
    return Math.max(0, total - appliedCoupon.discount);
  };

  const finalTotal = calculateFinalTotal();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Link to="/shop">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-8">Shopping Cart ({itemCount})</h1>

          {/* Free Shipping Progress */}
          {needed > 0 ? (
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="flex items-center gap-2 font-medium">
                  <Truck className="h-4 w-4" />
                  Free shipping on orders over $75
                </span>
                <span className="text-muted-foreground">
                  Add ${needed.toFixed(2)} more
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <Truck className="h-4 w-4" />
                <span className="font-medium">You qualify for free shipping!</span>
              </div>
            </div>
          )}

          {state.items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground/50 mb-6" />
              <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Add some items to get started
              </p>
              <Link to="/shop">
                <Button size="lg">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {state.items.map((item) => (
                  <div key={item.id} className="bg-card border border-border rounded-lg p-6">
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Size: {item.size} • Color: {item.color}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              In stock: {item.inStock} available
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-medium">${item.price}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${item.originalPrice}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.inStock}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => saveForLater(item.id)}
                            className="text-xs"
                          >
                            <Heart className="h-3 w-3 mr-1" />
                            Save for later
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                    ))}

                    {/* Saved for Later */}
                    {state.savedForLater.length > 0 && (
                      <div className="bg-card border border-border rounded-lg p-6">
                        <h3 className="font-medium mb-4">Saved for Later ({state.savedForLater.length})</h3>
                        <div className="space-y-4">
                          {state.savedForLater.map((item) => (
                            <div key={item.id} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{item.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {item.size} • {item.color}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="font-medium">${item.price}</span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => moveToCart(item.id)}
                                    className="h-6 text-xs"
                                  >
                                    Move to Cart
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                  <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                  
                  {/* Coupon System */}
                  <CouponSystem 
                    onCouponApplied={setAppliedCoupon}
                    appliedCoupon={appliedCoupon}
                  />

                  <Separator className="my-4" />

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>-${(total - finalTotal).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{needed > 0 ? 'Calculated at checkout' : 'Free'}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mt-6">
                    <Link to="/checkout">
                      <Button className="w-full" size="lg">
                        Proceed to Checkout
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                    <Link to="/shop">
                      <Button variant="outline" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Taxes calculated at checkout
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;