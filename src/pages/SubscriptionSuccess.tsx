import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refetch } = useSubscription();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Add a delay to ensure webhook has processed
      const timer = setTimeout(() => {
        refetch();
        toast.success("Welcome to Resume Proof Pro!");
      }, 2000); // Wait 2 seconds for webhook to process

      return () => clearTimeout(timer);
    }
  }, [sessionId, refetch]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container max-w-2xl mx-auto px-4 py-20">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="text-center pb-8 pt-12">
            <div className="mx-auto mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-gray-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-medium text-gray-900 mb-2">
              Welcome to Pro
            </CardTitle>
            <CardDescription className="text-gray-600">
              Your subscription has been activated
            </CardDescription>
          </CardHeader>

          <CardContent className="px-12 pb-12">
            <div className="border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="font-medium text-gray-900 mb-6 text-center">Pro Subscription Features</h3>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
                  Unlimited resume views
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
                  Download all resumes in multiple formats
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
                  Access to all featured resumes
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
                  Advanced search and filters
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
                  AI-powered insights
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
                  Priority customer support
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
                  Resume review checklist
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
                  Industry-specific templates
                </div>
              </div>
            </div>

            <div className="text-center space-y-6">
              <p className="text-gray-600">
                Manage your subscription anytime from account settings.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => navigate('/resumes')}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2"
                >
                  Start Browsing Resumes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/settings')}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2"
                >
                  Account Settings
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center pt-8 mt-8 border-t border-gray-200">
              Need help? Contact <a href="mailto:support@resumeproof.com" className="text-gray-700 hover:underline">support@resumeproof.com</a>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default SubscriptionSuccess;