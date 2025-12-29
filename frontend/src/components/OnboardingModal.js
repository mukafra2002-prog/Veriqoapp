import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Link2, CheckCircle, Crown, ArrowRight, X } from 'lucide-react';

const steps = [
  {
    icon: Link2,
    title: 'Paste Product Link',
    description: 'Copy any Amazon product URL and paste it into Veriqo',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: CheckCircle,
    title: 'Get Buy / Think / Avoid',
    description: 'Our AI analyzes real reviews to give you a clear verdict',
    color: 'bg-emerald-100 text-emerald-600'
  },
  {
    icon: Crown,
    title: 'Upgrade for Unlimited',
    description: '3 free checks per month. Go premium for unlimited access',
    color: 'bg-amber-100 text-amber-600'
  }
];

export const OnboardingModal = ({ open, onClose }) => {
  const { completeOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    await completeOnboarding();
    onClose();
  };

  const handleSkip = async () => {
    await completeOnboarding();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden" data-testid="onboarding-modal">
        <VisuallyHidden>
          <DialogTitle>Welcome to Veriqo</DialogTitle>
          <DialogDescription>Learn how to use Veriqo to analyze Amazon products</DialogDescription>
        </VisuallyHidden>
        <div className="relative">
          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 transition-colors"
            data-testid="onboarding-skip"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-8 pt-12">
            {/* Step Indicator */}
            <div className="flex justify-center gap-2 mb-8">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 w-8 rounded-full transition-colors ${
                    idx <= currentStep ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>

            {/* Step Content */}
            <div className="text-center">
              <div className={`w-16 h-16 rounded-2xl ${steps[currentStep].color} flex items-center justify-center mx-auto mb-6`}>
                {(() => {
                  const Icon = steps[currentStep].icon;
                  return <Icon className="w-8 h-8" />;
                })()}
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {steps[currentStep].title}
              </h3>
              
              <p className="text-slate-600 mb-8">
                {steps[currentStep].description}
              </p>

              <Button
                onClick={handleNext}
                className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                data-testid="onboarding-next"
              >
                {currentStep < steps.length - 1 ? (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  "Get Started"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
