import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertTriangle, X, ThumbsDown } from "lucide-react";
import { toast } from "sonner";

interface CancellationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmCancel: (feedback: CancellationFeedback) => Promise<void>;
  subscription: any;
}

export interface CancellationFeedback {
  reason: string;
  comments: string;
  satisfaction: string;
}

const CancellationDialog = ({
  open,
  onOpenChange,
  onConfirmCancel,
  subscription
}: CancellationDialogProps) => {
  const [step, setStep] = useState<'warning' | 'confirmation' | 'feedback'>('warning');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<CancellationFeedback>({
    reason: '',
    comments: '',
    satisfaction: ''
  });

  const resetDialog = () => {
    setStep('warning');
    setFeedback({ reason: '', comments: '', satisfaction: '' });
    setLoading(false);
  };

  const handleClose = () => {
    resetDialog();
    onOpenChange(false);
  };

  const handleFirstConfirm = () => {
    setStep('confirmation');
  };

  const handleSecondConfirm = () => {
    setStep('feedback');
  };

  const handleFinalCancel = async () => {
    if (!feedback.reason) {
      toast.error("Please select a reason for cancellation");
      return;
    }

    setLoading(true);
    try {
      await onConfirmCancel(feedback);
      toast.success("Your subscription has been cancelled");
      handleClose();
    } catch (error) {
      console.error('Cancellation error:', error);
      toast.error("Failed to cancel subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const cancellationReasons = [
    "Too expensive",
    "Not using it enough",
    "Found a better alternative",
    "Technical issues",
    "Missing features I need",
    "Temporary financial difficulties",
    "No longer need the service",
    "Other"
  ];

  const satisfactionOptions = [
    { value: "very-satisfied", label: "Very Satisfied" },
    { value: "satisfied", label: "Satisfied" },
    { value: "neutral", label: "Neutral" },
    { value: "dissatisfied", label: "Dissatisfied" },
    { value: "very-dissatisfied", label: "Very Dissatisfied" }
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === 'warning' && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <DialogTitle className="text-xl">Wait! Before you cancel...</DialogTitle>
              </div>
              <DialogDescription className="text-base">
                Are you sure you want to cancel your Resume Proof Pro subscription?
                Here's what you'll lose access to:
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Current Plan Info */}
              <Card className="border-red-100 bg-red-50">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">Resume Proof Pro</h3>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Billing period: {formatDate(subscription?.current_period_start)} - {formatDate(subscription?.current_period_end)}</p>
                    <p className="mt-1">Next billing: {formatDate(subscription?.current_period_end)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Features You'll Lose */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <ThumbsDown className="w-5 h-5 text-red-500" />
                  You'll lose access to:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-red-600">
                    <X className="w-4 h-4" />
                    <span>Unlimited resume access</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-600">
                    <X className="w-4 h-4" />
                    <span>Download all resumes</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-600">
                    <X className="w-4 h-4" />
                    <span>Advanced search filters</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-600">
                    <X className="w-4 h-4" />
                    <span>Priority support</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-600">
                    <X className="w-4 h-4" />
                    <span>Resume review checklist</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-600">
                    <X className="w-4 h-4" />
                    <span>Industry-specific templates</span>
                  </div>
                </div>
              </div>

              {/* Alternative Options */}
              <Card className="border-blue-100 bg-blue-50">
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">Consider these alternatives:</h3>
                  <ul className="text-sm space-y-1 text-blue-800">
                    <li>• Contact support if you're having technical issues</li>
                    <li>• Pause your subscription instead of cancelling</li>
                    <li>• Check our Resume Pack ($1.01) for limited access</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleClose}>
                Keep My Subscription
              </Button>
              <Button variant="destructive" onClick={handleFirstConfirm}>
                Continue to Cancel
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'confirmation' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl text-red-600">Final Confirmation</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Your subscription will be cancelled and you'll lose access to Pro features.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-red-800 mb-2">Important Notice:</h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Your subscription will end on {formatDate(subscription?.current_period_end)}</li>
                    <li>• You'll be downgraded to the Free plan (1 resume view only)</li>
                    <li>• You can resubscribe anytime, but this cancellation is immediate</li>
                    <li>• No refunds will be processed for the current billing period</li>
                  </ul>
                </CardContent>
              </Card>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Still want to cancel? We'd love to hear why to improve our service.
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setStep('warning')}>
                Go Back
              </Button>
              <Button variant="destructive" onClick={handleSecondConfirm}>
                Yes, Cancel My Subscription
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'feedback' && (
          <>
            <DialogHeader>
              <DialogTitle>Help Us Improve</DialogTitle>
              <DialogDescription>
                We're sorry to see you go. Your feedback helps us improve Resume Proof for everyone.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Why are you cancelling? *</Label>
                <RadioGroup
                  value={feedback.reason}
                  onValueChange={(value) => setFeedback(prev => ({ ...prev, reason: value }))}
                  className="mt-2"
                >
                  {cancellationReasons.map((reason) => (
                    <div key={reason} className="flex items-center space-x-2">
                      <RadioGroupItem value={reason} id={reason} />
                      <Label htmlFor={reason} className="text-sm">{reason}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold">How satisfied were you with Resume Proof?</Label>
                <RadioGroup
                  value={feedback.satisfaction}
                  onValueChange={(value) => setFeedback(prev => ({ ...prev, satisfaction: value }))}
                  className="mt-2"
                >
                  {satisfactionOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="text-sm">{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="comments" className="text-base font-semibold">
                  Additional Comments (Optional)
                </Label>
                <Textarea
                  id="comments"
                  placeholder="Tell us what we could do better or what made you cancel..."
                  value={feedback.comments}
                  onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setStep('confirmation')}>
                Go Back
              </Button>
              <Button
                variant="destructive"
                onClick={handleFinalCancel}
                disabled={loading || !feedback.reason}
              >
                {loading ? 'Cancelling...' : 'Complete Cancellation'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CancellationDialog;