import React, { useState } from 'react';
import { Check, ChevronRight, MapPin, Truck, CreditCard, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import AddressStep from './AddressStep';
import ShippingStep from './ShippingStep';
import PaymentStep from './PaymentStep';
import ReviewStep from './ReviewStep';

interface CheckoutData {
  address: any;
  shipping: any;
  payment: any;
}

interface CheckoutStepsProps {
  onOrderComplete: (orderData: any) => void;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ onOrderComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    address: null,
    shipping: null,
    payment: null,
  });
  const { state, getCartTotal } = useCart();
  const { state: userState } = useUser();

  const steps = [
    { id: 1, name: 'Address', icon: MapPin, description: 'Shipping information' },
    { id: 2, name: 'Shipping', icon: Truck, description: 'Delivery method' },
    { id: 3, name: 'Payment', icon: CreditCard, description: 'Payment details' },
    { id: 4, name: 'Review', icon: FileText, description: 'Order confirmation' },
  ];

  const progress = (currentStep / steps.length) * 100;

  const updateCheckoutData = (step: string, data: any) => {
    setCheckoutData(prev => ({
      ...prev,
      [step]: data,
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step <= currentStep || (step === currentStep + 1 && isStepValid(currentStep))) {
      setCurrentStep(step);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1: return checkoutData.address !== null;
      case 2: return checkoutData.shipping !== null;
      case 3: return checkoutData.payment !== null;
      default: return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <AddressStep
            initialData={checkoutData.address}
            onNext={(data) => {
              updateCheckoutData('address', data);
              nextStep();
            }}
            userAddresses={userState.profile.addresses}
          />
        );
      case 2:
        return (
          <ShippingStep
            initialData={checkoutData.shipping}
            onNext={(data) => {
              updateCheckoutData('shipping', data);
              nextStep();
            }}
            onBack={prevStep}
            cartTotal={getCartTotal()}
          />
        );
      case 3:
        return (
          <PaymentStep
            initialData={checkoutData.payment}
            onNext={(data) => {
              updateCheckoutData('payment', data);
              nextStep();
            }}
            onBack={prevStep}
            orderTotal={getCartTotal() + (checkoutData.shipping?.cost || 0)}
          />
        );
      case 4:
        return (
          <ReviewStep
            checkoutData={checkoutData}
            cartItems={state.items}
            onBack={prevStep}
            onOrderComplete={onOrderComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle>Checkout</CardTitle>
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {steps.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Steps Navigation */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => goToStep(step.id)}
              disabled={step.id > currentStep + 1 || (step.id === currentStep + 1 && !isStepValid(currentStep))}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                step.id < currentStep
                  ? 'bg-primary text-primary-foreground border-primary'
                  : step.id === currentStep
                  ? 'border-primary text-primary bg-background'
                  : 'border-muted text-muted-foreground bg-background'
              } ${
                step.id <= currentStep || (step.id === currentStep + 1 && isStepValid(currentStep))
                  ? 'hover:bg-primary/10 cursor-pointer'
                  : 'cursor-not-allowed opacity-50'
              }`}
            >
              {step.id < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                <step.icon className="h-5 w-5" />
              )}
            </button>
            
            <div className="ml-3 hidden sm:block">
              <p className={`text-sm font-medium ${
                step.id <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.name}
              </p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
            
            {index < steps.length - 1 && (
              <ChevronRight className="h-5 w-5 text-muted-foreground mx-4 hidden sm:block" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default CheckoutSteps;