import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "signin" | "signup";
}

export const AuthDialog = ({ open, onOpenChange, defaultTab = "signin" }: AuthDialogProps) => {
  const { signIn, signUp, resetPassword, resendConfirmation } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Form states
  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [signUpForm, setSignUpForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [resetForm, setResetForm] = useState({ email: "" });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = await signIn(signInForm.email, signInForm.password);
      
      if (result.success) {
        toast.success("Successfully signed in!");
        onOpenChange(false);
        setSignInForm({ email: "", password: "" });
      } else {
        setMessage({ type: 'error', text: result.error || 'Sign in failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    if (signUpForm.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      setLoading(false);
      return;
    }

    try {
      const result = await signUp(signUpForm.email, signUpForm.password);
      
      if (result.success) {
        if (result.error) {
          // This means email confirmation is required
          setMessage({ type: 'info', text: result.error });
        } else {
          toast.success("Account created successfully!");
          onOpenChange(false);
        }
        setSignUpForm({ email: "", password: "", confirmPassword: "" });
      } else {
        setMessage({ type: 'error', text: result.error || 'Sign up failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = await resetPassword(resetForm.email);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Password reset email sent! Check your inbox.' });
        setResetForm({ email: "" });
      } else {
        setMessage({ type: 'error', text: result.error || 'Password reset failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!signUpForm.email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    setLoading(true);
    try {
      const result = await resendConfirmation(signUpForm.email);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Confirmation email sent! Check your inbox.' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to resend confirmation' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Resume Proof</DialogTitle>
          <DialogDescription>
            Sign in to your account or create a new one to get started.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "signin" | "signup")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {message && (
            <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}>
              <AlertDescription className={message.type === 'error' ? 'text-red-800' : message.type === 'success' ? 'text-green-800' : 'text-blue-800'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signInForm.email}
                    onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={signInForm.password}
                    onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setActiveTab("reset")}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Forgot your password?
              </button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password (min. 6 characters)"
                    value={signUpForm.password}
                    onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={signUpForm.confirmPassword}
                    onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            {message?.type === 'info' && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  className="text-sm text-blue-600 hover:text-blue-800"
                  disabled={loading}
                >
                  Resend confirmation email
                </button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reset" className="space-y-4">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email"
                    value={resetForm.email}
                    onChange={(e) => setResetForm({ ...resetForm, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Email"}
              </Button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setActiveTab("signin")}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Back to sign in
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};