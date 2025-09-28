import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

const PurchaseSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refetch } = useSubscription();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Add a delay to ensure webhook has processed
      const timer = setTimeout(() => {
        refetch();
        toast.success("Your Resume Pack is ready!");
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
              Purchase Successful
            </CardTitle>
            <CardDescription className="text-gray-600">
              Your Resume Pack has been activated
            </CardDescription>
          </CardHeader>

          <CardContent className="px-12 pb-12">
            <div className="border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="font-medium text-gray-900 mb-6 text-center">Resume Access Pack</h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-medium text-gray-900 mb-1">5</div>
                  <div className="text-sm text-gray-600">Resume Views</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-medium text-gray-900 mb-1">30</div>
                  <div className="text-sm text-gray-600">Days Access</div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
                  Access to 5 premium resumes
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
                  Download in PDF format
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
                  Basic search and filters
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
                  30-day access period
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
              <h4 className="font-medium text-gray-900 mb-2">Need unlimited access?</h4>
              <p className="text-sm text-gray-600 mb-3">
                Upgrade to Pro for $1/month and get unlimited resume views and advanced features.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/pricing')}
                className="text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                View Pro Plan
              </Button>
            </div>

            <div className="text-center space-y-6">
              <p className="text-gray-600">
                Your resume views are ready to use.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => navigate('/resumes')}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2"
                >
                  Start Viewing Resumes
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

export default PurchaseSuccess;