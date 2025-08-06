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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <Card className="text-center shadow-xl border-0">
          <CardHeader className="pb-8 bg-gradient-to-b from-blue-50 to-white rounded-t-lg">
            <div className="mx-auto mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-blue-800">
              🎉 Welcome to Resume Proof Pro!
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Your subscription has been activated successfully
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 p-8">
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-4 text-lg">🚀 What's included in your Pro subscription:</h3>
              <ul className="text-sm text-blue-800 space-y-3 text-left max-w-md mx-auto">
                <li>✅ Unlimited resume views</li>
                <li>✅ Download all resumes in multiple formats</li>
                <li>✅ Access to all featured resumes</li>
                <li>✅ Advanced search and filters</li>
                <li>✅ AI-powered insights</li>
                <li>✅ Priority customer support</li>
                <li>✅ Resume review checklist</li>
                <li>✅ Industry-specific templates</li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <p className="text-gray-600 text-base">
                You can manage your subscription, update payment methods, or view invoices anytime from your account settings.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => navigate('/resumes')}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg font-semibold"
                >
                  🔍 Start Browsing Resumes
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/settings')}
                  className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold"
                >
                  ⚙️ Account Settings
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 pt-6 border-t border-gray-200 bg-gray-50 -mx-8 -mb-8 px-8 py-4 rounded-b-lg">
              💬 Need help? Contact our support team at <a href="mailto:support@resumeproof.com" className="text-blue-600 hover:underline">support@resumeproof.com</a>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default SubscriptionSuccess;