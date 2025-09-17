import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';

interface CartPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartPreview = ({ isOpen, onClose }: CartPreviewProps) => {
  const { state, getCartTotal, getCartCount } = useCart();

  if (!isOpen) return null;

  const total = getCartTotal();
  const itemCount = getCartCount();

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-large z-50 animate-scale-in transition-all-smooth">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Cart ({itemCount})
          </h3>
        </div>

        {state.items.length === 0 ? (
          <div className="text-center py-6">
            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {state.items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.size} • {item.color} • Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-medium">${item.price}</p>
                  </div>
                </div>
              ))}
              {state.items.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{state.items.length - 3} more items
                </p>
              )}
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>

              <div className="space-y-2">
                <Link to="/cart" onClick={onClose}>
                  <Button variant="outline" className="w-full">
                    View Cart
                  </Button>
                </Link>
                <Link to="/checkout" onClick={onClose}>
                  <Button className="w-full">
                    Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPreview;