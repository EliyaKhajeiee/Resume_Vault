import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container max-w-2xl mx-auto px-4 py-16">
        <Card className="text-center shadow-xl border-0">
          <CardHeader className="pb-8 bg-gradient-to-b from-green-50 to-white rounded-t-lg">
            <div className="mx-auto mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-green-800">
              🎉 Purchase Successful!
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Your Resume Pack has been activated
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-8">
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
              <div className="flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="font-semibold text-green-900 text-lg">Your $1.01 Resume Pack</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center mb-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">5</div>
                  <div className="text-sm text-green-800">Resume Views</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">30</div>
                  <div className="text-sm text-green-800">Days Access</div>
                </div>
              </div>
              <ul className="text-sm text-green-800 space-y-2 text-left max-w-md mx-auto">
                <li>✅ Access to 5 premium resumes</li>
                <li>✅ Download in PDF format</li>
                <li>✅ Basic search and filters</li>
                <li>✅ 30-day access period</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Want unlimited access?</h4>
              <p className="text-sm text-blue-800 mb-3">
                Upgrade to Pro for just $1/month and get unlimited resume views, advanced features, and priority support.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/pricing')}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                View Pro Plan
              </Button>
            </div>

            <div className="space-y-6">
              <p className="text-gray-600 text-base">
                Start exploring resumes right away! Your 5 resume views are ready to use.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate('/resumes')}
                  className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg font-semibold"
                >
                  🔍 Start Viewing Resumes
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/settings')}
                  className="border-2 border-green-200 text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-semibold"
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

export default PurchaseSuccess;