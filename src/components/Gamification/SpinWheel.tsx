import { useState, useRef } from 'react';
import { Gift, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Prize {
  id: string;
  label: string;
  value: string;
  probability: number; // out of 100
  color: string;
}

const prizes: Prize[] = [
  { id: '1', label: '5% OFF', value: 'SPIN5', probability: 30, color: 'bg-blue-500' },
  { id: '2', label: '10% OFF', value: 'SPIN10', probability: 25, color: 'bg-green-500' },
  { id: '3', label: 'Free Shipping', value: 'FREESHIP', probability: 20, color: 'bg-purple-500' },
  { id: '4', label: '15% OFF', value: 'SPIN15', probability: 15, color: 'bg-orange-500' },
  { id: '5', label: '20% OFF', value: 'SPIN20', probability: 8, color: 'bg-red-500' },
  { id: '6', label: 'Try Again', value: '', probability: 2, color: 'bg-gray-500' }
];

interface SpinWheelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SpinWheel = ({ isOpen, onClose }: SpinWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const spin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    
    // Determine prize based on probability
    const random = Math.random() * 100;
    let cumulative = 0;
    let selectedPrize = prizes[0];
    
    for (const prize of prizes) {
      cumulative += prize.probability;
      if (random <= cumulative) {
        selectedPrize = prize;
        break;
      }
    }

    // Calculate rotation (multiple full rotations + position for selected prize)
    const prizeIndex = prizes.findIndex(p => p.id === selectedPrize.id);
    const anglePerPrize = 360 / prizes.length;
    const finalAngle = 3600 + (prizeIndex * anglePerPrize); // 10 full rotations + final position

    // Apply rotation
    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${finalAngle}deg)`;
    }

    // Show result after animation
    setTimeout(() => {
      setIsSpinning(false);
      setResult(selectedPrize);
      setHasSpun(true);

      if (selectedPrize.value) {
        toast({
          title: "Congratulations! 🎉",
          description: `You won ${selectedPrize.label}! Code: ${selectedPrize.value}`,
        });
      }
    }, 3000);
  };

  const reset = () => {
    setResult(null);
    setHasSpun(false);
    setIsSpinning(false);
    if (wheelRef.current) {
      wheelRef.current.style.transform = 'rotate(0deg)';
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Spin to Win!
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!result ? (
            <>
              <p className="text-center text-sm text-muted-foreground">
                Spin the wheel for a chance to win exclusive discounts and offers!
              </p>

              {/* Wheel Container */}
              <div className="relative mx-auto w-64 h-64">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-500"></div>
                </div>

                {/* Wheel */}
                <div 
                  ref={wheelRef}
                  className="w-full h-full rounded-full border-8 border-gray-300 relative transition-transform duration-3000 ease-out"
                  style={{ 
                    background: `conic-gradient(${prizes.map((prize, index) => {
                      const startAngle = (360 / prizes.length) * index;
                      const endAngle = (360 / prizes.length) * (index + 1);
                      return `${prize.color} ${startAngle}deg ${endAngle}deg`;
                    }).join(', ')})` 
                  }}
                >
                  {/* Prize Labels */}
                  {prizes.map((prize, index) => {
                    const angle = (360 / prizes.length) * index + (360 / prizes.length) / 2;
                    const radian = (angle * Math.PI) / 180;
                    const x = Math.cos(radian) * 80;
                    const y = Math.sin(radian) * 80;
                    
                    return (
                      <div
                        key={prize.id}
                        className="absolute text-white font-bold text-xs transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                        }}
                      >
                        {prize.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={spin}
                  disabled={isSpinning || hasSpun}
                  size="lg"
                  className="px-8"
                >
                  {isSpinning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Spinning...
                    </>
                  ) : hasSpun ? (
                    'Already Spun'
                  ) : (
                    <>
                      <Gift className="h-4 w-4 mr-2" />
                      Spin Now!
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            /* Result Display */
            <div className="text-center space-y-4">
              {result.value ? (
                <>
                  <div className="text-6xl">🎉</div>
                  <h3 className="text-2xl font-bold text-green-600">Congratulations!</h3>
                  <div className="space-y-2">
                    <p>You won:</p>
                    <Badge className="text-lg px-4 py-2" variant="secondary">
                      {result.label}
                    </Badge>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700 mb-1">Your coupon code:</p>
                      <code className="text-lg font-mono font-bold text-green-800 bg-white px-3 py-1 rounded border">
                        {result.value}
                      </code>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Copy this code and apply it at checkout
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-4xl">😅</div>
                  <h3 className="text-xl font-medium">Better luck next time!</h3>
                  <p className="text-muted-foreground">
                    Don't worry, we still have great deals waiting for you!
                  </p>
                </>
              )}

              <div className="space-y-2">
                <Button onClick={handleClose} className="w-full">
                  Continue Shopping
                </Button>
                {!result.value && (
                  <Button variant="outline" onClick={reset} className="w-full">
                    Try Again Later
                  </Button>
                )}
              </div>
            </div>
          )}

          <p className="text-xs text-center text-muted-foreground">
            * One spin per customer. Terms and conditions apply.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SpinWheel;