import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { EmailService } from "@/services/emailService";

const Index = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsLoading(true);
      
      try {
        const result = await EmailService.saveEmail(email, 'landing_page');
        
        if (result.success) {
          setIsSubmitted(true);
          toast.success("Email saved! Stay tuned for exclusive resume insights.");
          console.log("Email successfully saved to database:", email);
        } else {
          if (result.error === 'Email already registered') {
            toast.error("This email is already registered!");
          } else {
            toast.error("Failed to save email. Please try again.");
          }
          console.error("Failed to save email:", result.error);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="font-bold text-2xl text-black">Resume Proof</div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-black mb-8 leading-tight">
            Resumes that actually <br />
            <span className="text-blue-600">got people hired</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Stop guessing what works. Get access to real resumes from successful candidates at Google, Goldman Sachs, Meta, and 200+ top companies.
          </p>

          {/* Email Capture */}
          {!isSubmitted ? (
            <form onSubmit={handleEmailSubmit} className="max-w-lg mx-auto mb-16">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 pl-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Get Early Access"}
                  {!isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Be the first to know when we launch. No spam, just career gold.
              </p>
            </form>
          ) : (
            <div className="max-w-lg mx-auto mb-16 text-center">
              <div className="bg-green-50 border border-green-200 rounded-xl p-8">
                <Check className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-800 mb-2">You're in!</h3>
                <p className="text-green-700 text-lg">
                  Thanks for joining! Stay tuned to crack your next interview with resumes that actually worked.
                </p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-3">500+</div>
              <div className="text-gray-600 text-lg">Successful Resumes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-3">200+</div>
              <div className="text-gray-600 text-lg">Top Companies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-3">95%</div>
              <div className="text-gray-600 text-lg">Interview Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* What We're Building Section */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">What's Coming</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            We're building the ultimate resource for proven resume examples from top companies
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real Resume Examples</h3>
              <p className="text-gray-600">Access hundreds of resumes that landed offers at FAANG, finance, and consulting firms</p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Search & Filters</h3>
              <p className="text-gray-600">Find resumes by company, role, industry, and experience level in seconds</p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered Insights</h3>
              <p className="text-gray-600">Understand what made each resume successful with detailed breakdowns</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black text-white">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <div className="font-bold text-xl mb-4">Resume Proof</div>
          <p className="text-gray-400 mb-4">
            The definitive resource for proven resume examples from top companies.
          </p>
          <p className="text-gray-500 text-sm">
            &copy; 2024 Resume Proof. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;