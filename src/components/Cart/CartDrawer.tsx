import { X, Plus, Minus, ShoppingBag, Truck, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import CouponSystem from '@/components/Coupons/CouponSystem';
import { useState } from 'react';

const CartDrawer = () => {
  const { 
    state, 
    toggleCart, 
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
    <Sheet open={state.isOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:w-[420px] flex flex-col h-full">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shopping Cart ({itemCount})
            </SheetTitle>
          </div>

          {/* Free Shipping Progress */}
          {needed > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Truck className="h-4 w-4" />
                  Free shipping
                </span>
                <span className="text-muted-foreground">
                  Add ${needed.toFixed(2)} more
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <Truck className="h-4 w-4" />
              <span>You qualify for free shipping!</span>
            </div>
          )}
        </SheetHeader>

        <Separator />

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
              <div>
                <h3 className="font-medium">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Add some items to get started
                </p>
              </div>
              <Button onClick={toggleCart}>Continue Shopping</Button>
            </div>
          ) : (
            <>
              {state.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm leading-tight">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {item.size} • {item.color}
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
                        <span className="font-medium">${item.price}</span>
                        {item.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${item.originalPrice}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.inStock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => saveForLater(item.id)}
                      className="text-xs h-auto p-1"
                    >
                      <Heart className="h-3 w-3 mr-1" />
                      Save for later
                    </Button>
                  </div>
                </div>
              ))}

              {/* Saved for Later */}
              {state.savedForLater.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Saved for Later ({state.savedForLater.length})</h3>
                    {state.savedForLater.map((item) => (
                      <div key={item.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {item.size} • {item.color}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-medium text-sm">${item.price}</span>
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
                </>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4 pt-4">
              {/* Coupon System */}
              <CouponSystem 
                onCouponApplied={setAppliedCoupon}
                appliedCoupon={appliedCoupon}
              />

              <Separator />

              {/* Total Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center text-sm text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-${(total - finalTotal).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full" size="lg">
                  Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" className="w-full" onClick={toggleCart}>
                  Continue Shopping
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Taxes and shipping calculated at checkout
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;