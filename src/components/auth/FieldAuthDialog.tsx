import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, Sparkles, Trophy, Briefcase, TrendingUp, DollarSign, Users, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FieldAuthDialogProps {
  fieldId: string;
  fieldTitle: string;
  targetGoal: string;
}

const fieldConfig = {
  general: {
    icon: Sparkles,
    gradient: "from-purple-600 via-pink-600 to-red-600",
    accentColor: "purple",
    headline: "Unlock Your Career Potential",
    subheadline: "Join thousands who transformed their careers",
    benefits: [
      "Access proven resume templates",
      "Stand out to recruiters instantly",
      "Land interviews 3x faster"
    ],
    ctaText: "Get Instant Access",
    testimonial: {
      text: "This resume got me 5 interviews in one week!",
      author: "Sarah M.",
      role: "Career Changer"
    }
  },
  swe: {
    icon: Trophy,
    gradient: "from-blue-600 via-cyan-600 to-teal-600",
    accentColor: "blue",
    headline: "Break Into FAANG",
    subheadline: "Used by engineers at Google, Meta, Amazon",
    benefits: [
      "FAANG-optimized resume format",
      "Pass ATS systems with ease",
      "Highlight technical impact"
    ],
    ctaText: "Start Your Tech Career",
    testimonial: {
      text: "Landed offers from Google and Uber with this template!",
      author: "Alex K.",
      role: "Software Engineer @ Google"
    }
  },
  marketing: {
    icon: TrendingUp,
    gradient: "from-orange-600 via-red-600 to-pink-600",
    accentColor: "orange",
    headline: "Showcase Your Marketing Impact",
    subheadline: "Templates used by top marketers worldwide",
    benefits: [
      "Highlight campaign ROI",
      "Showcase data-driven results",
      "Stand out in creative roles"
    ],
    ctaText: "Unlock Marketing Success",
    testimonial: {
      text: "My applications went from ignored to interviews!",
      author: "Jessica L.",
      role: "Marketing Manager"
    }
  },
  finance: {
    icon: DollarSign,
    gradient: "from-emerald-600 via-green-600 to-teal-600",
    accentColor: "emerald",
    headline: "Break Into Wall Street",
    subheadline: "Proven resumes from top financial institutions",
    benefits: [
      "IB & PE-ready format",
      "Quantify deal experience",
      "Elite finance positioning"
    ],
    ctaText: "Launch Finance Career",
    testimonial: {
      text: "Received offers from Goldman and JP Morgan!",
      author: "Michael R.",
      role: "Investment Banker"
    }
  },
  consulting: {
    icon: Users,
    gradient: "from-indigo-600 via-purple-600 to-pink-600",
    accentColor: "indigo",
    headline: "Land MBB Consulting Roles",
    subheadline: "Templates from McKinsey, Bain, BCG consultants",
    benefits: [
      "MBB-optimized structure",
      "Showcase strategic impact",
      "Problem-solving focus"
    ],
    ctaText: "Start Consulting Journey",
    testimonial: {
      text: "This format helped me land Bain and Deloitte offers!",
      author: "David P.",
      role: "Strategy Consultant @ Bain"
    }
  },
  "private-equity": {
    icon: Briefcase,
    gradient: "from-slate-700 via-gray-800 to-zinc-900",
    accentColor: "slate",
    headline: "Break Into PE & Startups",
    subheadline: "Resumes that win competitive positions",
    benefits: [
      "Startup & PE-focused format",
      "Highlight ownership & impact",
      "Fast-paced role positioning"
    ],
    ctaText: "Unlock PE Opportunities",
    testimonial: {
      text: "Landed my dream PE role with this resume!",
      author: "Emily C.",
      role: "Private Equity Associate"
    }
  },
  "visa-sponsor": {
    icon: Globe,
    gradient: "from-sky-600 via-blue-600 to-indigo-600",
    accentColor: "sky",
    headline: "Secure Visa Sponsorship",
    subheadline: "Navigate international hiring successfully",
    benefits: [
      "Visa-friendly format",
      "Highlight global experience",
      "Sponsorship-ready positioning"
    ],
    ctaText: "Get Sponsored",
    testimonial: {
      text: "Got H1B sponsorship at a top tech company!",
      author: "Raj P.",
      role: "International Professional"
    }
  }
};

export const FieldAuthDialog = ({ fieldId, fieldTitle, targetGoal }: FieldAuthDialogProps) => {
  const { signUp, signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [signUpForm, setSignUpForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [signInForm, setSignInForm] = useState({ email: "", password: "" });

  const config = fieldConfig[fieldId as keyof typeof fieldConfig] || fieldConfig.general;
  const Icon = config.icon;

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
          setMessage({ type: 'info', text: result.error });
        } else {
          toast.success("Account created! Resume unlocked!");
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = await signIn(signInForm.email, signInForm.password);

      if (result.success) {
        toast.success("Welcome back!");
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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setMessage(null);

    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        setMessage({ type: 'error', text: result.error || 'Google sign in failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in zoom-in duration-300">
      {/* Header with Icon and Gradient */}
      <div className={`bg-gradient-to-r ${config.gradient} rounded-t-2xl p-8 text-white text-center shadow-xl`}>
        <div className="flex justify-center mb-4 animate-bounce-slow">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 shadow-lg">
            <Icon className="w-12 h-12" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-2 tracking-tight">{config.headline}</h2>
        <p className="text-white/90 text-sm font-medium">{config.subheadline}</p>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-b-2xl p-8 shadow-2xl border-x-2 border-b-2 border-gray-100">
        {/* Benefits List */}
        <div className="mb-6 space-y-3">
          {config.benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-3 animate-in slide-in-from-left duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700 text-sm font-medium leading-relaxed">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200/50 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-gray-800 text-sm italic mb-3 leading-relaxed font-medium">"{config.testimonial.text}"</p>
          <p className="text-gray-600 text-xs font-semibold">
            — {config.testimonial.author}, {config.testimonial.role}
          </p>
        </div>

        {message && (
          <Alert className={`mb-4 ${message.type === 'error' ? 'border-red-200 bg-red-50' : message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}`}>
            <AlertDescription className={message.type === 'error' ? 'text-red-800' : message.type === 'success' ? 'text-green-800' : 'text-blue-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Google Sign In */}
        <Button
          type="button"
          variant="outline"
          className="w-full mb-4 h-12 text-base font-semibold border-2 hover:bg-gray-50 hover:shadow-md transition-all duration-200"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </Button>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-500 font-medium">Or sign up with email</span>
          </div>
        </div>

        {/* Conditional Sign In / Sign Up Forms */}
        {!showSignIn ? (
          <>
            {/* Email Sign Up Form */}
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-gray-700 font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                    className="pl-11 h-12 text-base border-2 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-gray-700 font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={signUpForm.password}
                    onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                    className="pl-11 pr-11 h-12 text-base border-2 focus:border-blue-500"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password" className="text-gray-700 font-medium">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="signup-confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={signUpForm.confirmPassword}
                    onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                    className="pl-11 pr-11 h-12 text-base border-2 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className={`w-full h-12 text-base font-bold bg-gradient-to-r ${config.gradient} hover:opacity-90 transition-opacity`}
                disabled={loading}
              >
                {loading ? "Creating Account..." : config.ctaText}
              </Button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setShowSignIn(true)}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Sign In
              </button>
            </p>
          </>
        ) : (
          <>
            {/* Sign In Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-gray-700 font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signInForm.email}
                    onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                    className="pl-11 h-12 text-base border-2 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-gray-700 font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={signInForm.password}
                    onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                    className="pl-11 pr-11 h-12 text-base border-2 focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className={`w-full h-12 text-base font-bold bg-gradient-to-r ${config.gradient} hover:opacity-90 transition-opacity`}
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setShowSignIn(false)}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Sign Up
              </button>
            </p>
          </>
        )}

        <p className="text-xs text-gray-400 text-center mt-4 border-t border-gray-200 pt-4">
          By continuing, you agree to our{" "}
          <button onClick={() => navigate('/terms')} className="text-blue-600 hover:underline">Terms</button>
          {" "}and{" "}
          <button onClick={() => navigate('/privacy')} className="text-blue-600 hover:underline">Privacy Policy</button>
        </p>
      </div>
    </div>
  );
};
