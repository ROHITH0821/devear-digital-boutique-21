import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: 'signin' | 'signup';
}

const AuthDialog: React.FC<AuthDialogProps> = ({ 
  open, 
  onOpenChange, 
  defaultMode = 'signin' 
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);

  const handleClose = () => {
    onOpenChange(false);
  };

  const switchToSignIn = () => setMode('signin');
  const switchToSignUp = () => setMode('signup');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-0 p-0">
        {mode === 'signin' ? (
          <SignInForm onSwitchToSignUp={switchToSignUp} onClose={handleClose} />
        ) : (
          <SignUpForm onSwitchToSignIn={switchToSignIn} onClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;