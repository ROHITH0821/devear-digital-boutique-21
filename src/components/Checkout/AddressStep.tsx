import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Address } from '@/contexts/UserContext';

const addressSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressStepProps {
  initialData: any;
  onNext: (data: any) => void;
  userAddresses: Address[];
}

const AddressStep: React.FC<AddressStepProps> = ({ initialData, onNext, userAddresses }) => {
  const [selectedAddress, setSelectedAddress] = useState(initialData?.id || '');
  const [showNewForm, setShowNewForm] = useState(!userAddresses.length || selectedAddress === 'new');

  const { register, handleSubmit, formState: { errors } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData || {},
  });

  const onSubmit = (data: AddressFormData) => {
    onNext(data);
  };

  const handleExistingAddress = (addressId: string) => {
    if (addressId === 'new') {
      setShowNewForm(true);
      setSelectedAddress('new');
    } else {
      const address = userAddresses.find(addr => addr.id === addressId);
      if (address) {
        onNext(address);
      }
      setSelectedAddress(addressId);
      setShowNewForm(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {userAddresses.length > 0 && (
          <div>
            <Label className="text-base font-medium">Choose Address</Label>
            <RadioGroup 
              value={selectedAddress} 
              onValueChange={handleExistingAddress}
              className="mt-3 space-y-3"
            >
              {userAddresses.map((address) => (
                <div key={address.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={address.id} id={address.id} />
                  <label htmlFor={address.id} className="flex-1 cursor-pointer">
                    <Card className="p-3 hover:bg-accent transition-colors">
                      <div className="font-medium">{address.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {address.street}, {address.city}, {address.state} {address.zipCode}
                      </div>
                      {address.isDefault && (
                        <div className="text-xs text-primary font-medium">Default Address</div>
                      )}
                    </Card>
                  </label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <label htmlFor="new" className="flex items-center gap-2 cursor-pointer text-primary">
                  <Plus className="h-4 w-4" />
                  Add New Address
                </label>
              </div>
            </RadioGroup>
          </div>
        )}

        {showNewForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  {...register('street')}
                  placeholder="Enter street address"
                />
                {errors.street && (
                  <p className="text-sm text-destructive">{errors.street.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...register('city')}
                  placeholder="Enter city"
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  {...register('state')}
                  placeholder="Enter state"
                />
                {errors.state && (
                  <p className="text-sm text-destructive">{errors.state.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  {...register('zipCode')}
                  placeholder="Enter ZIP code"
                />
                {errors.zipCode && (
                  <p className="text-sm text-destructive">{errors.zipCode.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  {...register('country')}
                  placeholder="Enter country"
                  defaultValue="United States"
                />
                {errors.country && (
                  <p className="text-sm text-destructive">{errors.country.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Continue to Shipping
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default AddressStep;