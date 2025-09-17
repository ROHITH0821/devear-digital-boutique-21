import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CreditCard, Smartphone, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import CouponSystem from '@/components/Coupons/CouponSystem';

const cardSchema = z.object({
  cardNumber: z.string().min(16, 'Card number must be 16 digits'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Format: MM/YY'),
  cvv: z.string().min(3, 'CVV must be 3-4 digits'),
  cardholderName: z.string().min(2, 'Cardholder name is required'),
});

type CardFormData = z.infer<typeof cardSchema>;

interface PaymentStepProps {
  initialData: any;
  onNext: (data: any) => void;
  onBack: () => void;
  orderTotal: number;
  appliedCoupon?: any;
  onCouponApplied?: (coupon: any) => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ 
  initialData, 
  onNext, 
  onBack, 
  orderTotal,
  appliedCoupon,
  onCouponApplied
}) => {
  const [paymentMethod, setPaymentMethod] = useState(initialData?.method || 'card');

  const { register, handleSubmit, formState: { errors } } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: initialData?.cardDetails || {},
  });

  const paymentOptions = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      description: 'GooglePay, PhonePe, Paytm',
      icon: <Smartphone className="h-5 w-5" />
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: <DollarSign className="h-5 w-5" />
    }
  ];

  const onSubmit = (data: CardFormData) => {
    const paymentData = {
      method: paymentMethod,
      ...(paymentMethod === 'card' && { cardDetails: data })
    };
    onNext(paymentData);
  };

  const handleNonCardPayment = () => {
    onNext({ method: paymentMethod });
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <Label className="text-base font-medium">Choose Payment Method</Label>
          <RadioGroup 
            value={paymentMethod} 
            onValueChange={setPaymentMethod}
            className="mt-3 space-y-3"
          >
            {paymentOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <label htmlFor={option.id} className="flex-1 cursor-pointer">
                  <Card className="p-3 hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-primary">{option.icon}</div>
                      <div>
                        <div className="font-medium">{option.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </Card>
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        {/* Coupon System */}
        {onCouponApplied && (
          <div>
            <Label className="text-base font-medium">Apply Coupon</Label>
            <div className="mt-3">
              <CouponSystem 
                onCouponApplied={onCouponApplied}
                appliedCoupon={appliedCoupon}
              />
            </div>
          </div>
        )}

        <Separator />

        {/* Payment Form */}
        {paymentMethod === 'card' ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                {...register('cardNumber')}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                onChange={(e) => {
                  e.target.value = formatCardNumber(e.target.value);
                }}
              />
              {errors.cardNumber && (
                <p className="text-sm text-destructive">{errors.cardNumber.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  {...register('expiryDate')}
                  placeholder="MM/YY"
                  maxLength={5}
                />
                {errors.expiryDate && (
                  <p className="text-sm text-destructive">{errors.expiryDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  {...register('cvv')}
                  placeholder="123"
                  maxLength={4}
                />
                {errors.cvv && (
                  <p className="text-sm text-destructive">{errors.cvv.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                {...register('cardholderName')}
                placeholder="Enter name on card"
              />
              {errors.cardholderName && (
                <p className="text-sm text-destructive">{errors.cardholderName.message}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Back to Shipping
              </Button>
              <Button type="submit" className="flex-1">
                Continue to Review
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {paymentMethod === 'upi' && (
              <div className="p-4 bg-accent rounded-lg">
                <h4 className="font-medium mb-2">UPI Payment Instructions</h4>
                <p className="text-sm text-muted-foreground">
                  You will be redirected to your UPI app to complete the payment of ${orderTotal.toFixed(2)}.
                </p>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-4 bg-accent rounded-lg">
                <h4 className="font-medium mb-2">Cash on Delivery</h4>
                <p className="text-sm text-muted-foreground">
                  Pay ${orderTotal.toFixed(2)} when you receive your order. Additional handling charges may apply.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Back to Shipping
              </Button>
              <Button onClick={handleNonCardPayment} className="flex-1">
                Continue to Review
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentStep;