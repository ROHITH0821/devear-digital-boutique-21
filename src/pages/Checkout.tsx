import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutSteps from '@/components/Checkout/CheckoutSteps';

const Checkout = () => {
  const navigate = useNavigate();

  const handleOrderComplete = (orderData: any) => {
    // Navigate to order confirmation page with order details
    navigate('/order-confirmation', { state: { orderData } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          <CheckoutSteps onOrderComplete={handleOrderComplete} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;