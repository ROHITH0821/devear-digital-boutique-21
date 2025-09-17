import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About DEVEAR</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              Welcome to DEVEAR, where fashion meets innovation. We're passionate about bringing you 
              the latest trends and timeless classics that make you look and feel your best.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="mb-6">
              Founded with a vision to revolutionize online fashion retail, DEVEAR combines cutting-edge 
              technology with curated style to deliver an exceptional shopping experience. We believe 
              that everyone deserves access to quality fashion that expresses their unique personality.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="mb-6">
              To provide high-quality, trendy fashion at accessible prices while maintaining the highest 
              standards of customer service and sustainability. We're committed to making fashion more 
              inclusive, sustainable, and enjoyable for everyone.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">What Sets Us Apart</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Carefully curated collection from top designers and emerging brands</li>
              <li>Personalized shopping experience with AI-powered recommendations</li>
              <li>Sustainable and ethical sourcing practices</li>
              <li>Fast, reliable shipping and hassle-free returns</li>
              <li>24/7 customer support from fashion experts</li>
            </ul>
            
            <p className="text-lg">
              Join the DEVEAR community and discover fashion that speaks to you. Your style journey starts here.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;