import React, { useState } from 'react';
import { Truck, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: React.ReactNode;
}

interface ShippingStepProps {
  initialData: any;
  onNext: (data: any) => void;
  onBack: () => void;
  cartTotal: number;
}

const ShippingStep: React.FC<ShippingStepProps> = ({ 
  initialData, 
  onNext, 
  onBack, 
  cartTotal 
}) => {
  const [selectedShipping, setSelectedShipping] = useState(initialData?.id || '');

  const shippingOptions: ShippingOption[] = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Regular delivery',
      price: cartTotal > 100 ? 0 : 9.99,
      estimatedDays: '5-7 business days',
      icon: <Truck className="h-5 w-5" />
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Faster delivery',
      price: 19.99,
      estimatedDays: '2-3 business days',
      icon: <Clock className="h-5 w-5" />
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next day delivery',
      price: 39.99,
      estimatedDays: '1 business day',
      icon: <Zap className="h-5 w-5" />
    }
  ];

  const handleContinue = () => {
    const selected = shippingOptions.find(option => option.id === selectedShipping);
    if (selected) {
      onNext({
        id: selected.id,
        name: selected.name,
        cost: selected.price,
        estimatedDays: selected.estimatedDays
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Shipping Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
          {shippingOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <label htmlFor={option.id} className="flex-1 cursor-pointer">
                <Card className="p-4 hover:bg-accent transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-primary">{option.icon}</div>
                      <div>
                        <div className="font-medium">{option.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {option.description} • {option.estimatedDays}
                        </div>
                        {option.id === 'standard' && cartTotal > 100 && (
                          <div className="text-xs text-green-600 font-medium">
                            Free shipping on orders over $100!
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {option.price === 0 ? 'FREE' : `$${option.price}`}
                      </div>
                    </div>
                  </div>
                </Card>
              </label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back to Address
          </Button>
          <Button 
            onClick={handleContinue} 
            disabled={!selectedShipping}
            className="flex-1"
          >
            Continue to Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShippingStep;