import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MapPin, Truck, CreditCard, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

interface ReviewStepProps {
  checkoutData: any;
  cartItems: any[];
  onBack: () => void;
  onOrderComplete: (orderData: any) => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ 
  checkoutData, 
  cartItems, 
  onBack,
  onOrderComplete 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const shippingCost = checkoutData.shipping?.cost || 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax;

  const generateOrderId = () => {
    return 'ORD-' + Date.now().toString(36).toUpperCase();
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderId = generateOrderId();
      
      // Create order data
      const orderData = {
        orderId,
        items: cartItems,
        subtotal,
        shipping: shippingCost,
        tax,
        total,
        address: checkoutData.address,
        shippingMethod: checkoutData.shipping,
        paymentMethod: checkoutData.payment,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      };
      
      // Clear cart
      clearCart();
      
      toast({
        title: "Order placed successfully!",
        description: `Order #${orderId} has been confirmed`,
      });
      
      // Call the completion handler
      onOrderComplete(orderData);
      
    } catch (error) {
      toast({
        title: "Order failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Order Review */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Order Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Size: {item.size} • Color: {item.color}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p className="font-medium">{checkoutData.address.name}</p>
              <p>{checkoutData.address.street}</p>
              <p>{checkoutData.address.city}, {checkoutData.address.state} {checkoutData.address.zipCode}</p>
              <p>{checkoutData.address.country}</p>
            </div>
          </CardContent>
        </Card>

        {/* Shipping */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{checkoutData.shipping.name}</p>
                <p className="text-sm text-muted-foreground">
                  Estimated delivery: {checkoutData.shipping.estimatedDays}
                </p>
              </div>
              <p className="font-medium">
                {checkoutData.shipping.cost === 0 ? 'FREE' : `$${checkoutData.shipping.cost}`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {checkoutData.payment.method === 'card' && (
                <p>Credit Card ending in ****{checkoutData.payment.cardDetails?.cardNumber?.slice(-4)}</p>
              )}
              {checkoutData.payment.method === 'upi' && (
                <p>UPI Payment</p>
              )}
              {checkoutData.payment.method === 'cod' && (
                <p>Cash on Delivery</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div>
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Back to Payment
              </Button>
              <Button 
                onClick={handlePlaceOrder} 
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  'Processing...'
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Place Order
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
                You will receive an order confirmation email shortly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReviewStep;