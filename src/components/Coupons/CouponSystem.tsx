import { useState, useEffect } from 'react';
import { Tag, X, Gift, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface Coupon {
  code: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minAmount?: number;
  maxUses?: number;
  expiresAt?: Date;
  isActive: boolean;
}

const availableCoupons: Coupon[] = [
  {
    code: 'WELCOME10',
    description: 'Welcome discount for new customers',
    discount: 10,
    type: 'percentage',
    isActive: true
  },
  {
    code: 'SAVE20',
    description: '20% off orders over $100',
    discount: 20,
    type: 'percentage',
    minAmount: 100,
    isActive: true
  },
  {
    code: 'FREESHIP',
    description: 'Free shipping on any order',
    discount: 10,
    type: 'fixed',
    isActive: true
  },
  {
    code: 'BULK15',
    description: '15% off when buying 3+ items',
    discount: 15,
    type: 'percentage',
    isActive: true
  }
];

interface CouponSystemProps {
  onCouponApplied?: (coupon: Coupon) => void;
  appliedCoupon?: Coupon | null;
}

const CouponSystem = ({ onCouponApplied, appliedCoupon }: CouponSystemProps) => {
  const [couponCode, setCouponCode] = useState('');
  const [suggestedCoupons, setSuggestedCoupons] = useState<Coupon[]>([]);
  const { state, getCartTotal } = useCart();
  const { toast } = useToast();

  const cartTotal = getCartTotal();
  const itemCount = state.items.reduce((count, item) => count + item.quantity, 0);

  // Smart coupon suggestions based on cart
  useEffect(() => {
    const suggestions: Coupon[] = [];
    
    if (cartTotal >= 100) {
      suggestions.push(availableCoupons.find(c => c.code === 'SAVE20')!);
    }
    
    if (itemCount >= 3) {
      suggestions.push(availableCoupons.find(c => c.code === 'BULK15')!);
    }
    
    if (cartTotal < 75) {
      suggestions.push(availableCoupons.find(c => c.code === 'FREESHIP')!);
    }
    
    if (suggestions.length === 0) {
      suggestions.push(availableCoupons.find(c => c.code === 'WELCOME10')!);
    }

    setSuggestedCoupons(suggestions.filter(Boolean));
  }, [cartTotal, itemCount]);

  const validateCoupon = (code: string): Coupon | null => {
    const coupon = availableCoupons.find(c => c.code === code.toUpperCase() && c.isActive);
    
    if (!coupon) {
      return null;
    }

    if (coupon.minAmount && cartTotal < coupon.minAmount) {
      toast({
        title: "Minimum amount required",
        description: `This coupon requires a minimum order of $${coupon.minAmount}`,
        variant: "destructive"
      });
      return null;
    }

    return coupon;
  };

  const applyCoupon = (code: string) => {
    const coupon = validateCoupon(code);
    if (coupon) {
      onCouponApplied?.(coupon);
      toast({
        title: "Coupon applied!",
        description: `${coupon.description} - ${coupon.type === 'percentage' ? `${coupon.discount}% off` : `$${coupon.discount} off`}`,
      });
      setCouponCode('');
    } else {
      toast({
        title: "Invalid coupon",
        description: "Please check the coupon code and try again",
        variant: "destructive"
      });
    }
  };

  const calculateDiscount = (coupon: Coupon): number => {
    if (coupon.type === 'percentage') {
      return (cartTotal * coupon.discount) / 100;
    }
    return coupon.discount;
  };

  return (
    <div className="space-y-4">
      {/* Coupon Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && applyCoupon(couponCode)}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={() => applyCoupon(couponCode)}
          disabled={!couponCode.trim()}
        >
          Apply
        </Button>
      </div>

      {/* Applied Coupon */}
      {appliedCoupon && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gift className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">{appliedCoupon.code}</p>
                  <p className="text-sm text-green-600">{appliedCoupon.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-800">
                  -${calculateDiscount(appliedCoupon).toFixed(2)}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onCouponApplied?.(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Smart Suggestions */}
      {!appliedCoupon && suggestedCoupons.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Recommended for you
            </CardTitle>
            <CardDescription className="text-xs">
              Save more with these coupons
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestedCoupons.slice(0, 2).map((coupon) => (
              <div 
                key={coupon.code}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                onClick={() => applyCoupon(coupon.code)}
              >
                <div>
                  <Badge variant="outline" className="mb-1">
                    {coupon.code}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {coupon.description}
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Apply
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CouponSystem;