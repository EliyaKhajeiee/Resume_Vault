import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Subscription = () => {
  const { isAuthenticated } = useAuth();
  const { subscription, hasActiveSubscription, createPortalSession, loading } = useSubscription();
  const navigate = useNavigate();
  const [portalLoading, setPortalLoading] = useState(false);

  if (!isAuthenticated) {
    navigate('/pricing');
    return null;
  }

  const handleManageSubscription = async () => {
    if (!subscription?.stripe_customer_id) {
      toast.error("No subscription found");
      return;
    }

    setPortalLoading(true);
    try {
      await createPortalSession();
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error("Failed to open subscription management");
    } finally {
      setPortalLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">Loading subscription details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Subscription</h1>
          <p className="text-xl text-gray-600">
            Manage your Resume Proof subscription and billing
          </p>
        </div>

        <div className="grid gap-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <CardTitle>Current Plan</CardTitle>
                </div>
                {hasActiveSubscription && (
                  <Badge className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {hasActiveSubscription && subscription ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">Plan</h4>
                      <p className="text-lg font-medium">Resume Proof Pro</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">Status</h4>
                      <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">Current Period</h4>
                      <p className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">Next Billing</h4>
                      <p className="text-sm text-gray-600">
                        {formatDate(subscription.current_period_end)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={handleManageSubscription}
                      disabled={portalLoading}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {portalLoading ? 'Loading...' : 'Manage Billing & Payment'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
                  <p className="text-gray-600 mb-6">
                    You're currently on the free plan with limited access to resume examples.
                  </p>
                  <Button onClick={() => navigate('/pricing')}>
                    Upgrade to Pro
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Plan Features */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Features</CardTitle>
              <CardDescription>
                {hasActiveSubscription ? 'Your Pro plan includes:' : 'Upgrade to Pro to unlock:'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${hasActiveSubscription ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={hasActiveSubscription ? 'text-gray-900' : 'text-gray-500'}>
                      Unlimited resume views
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${hasActiveSubscription ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={hasActiveSubscription ? 'text-gray-900' : 'text-gray-500'}>
                      Download all resumes
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${hasActiveSubscription ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={hasActiveSubscription ? 'text-gray-900' : 'text-gray-500'}>
                      Access to featured resumes
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${hasActiveSubscription ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={hasActiveSubscription ? 'text-gray-900' : 'text-gray-500'}>
                      Advanced search filters
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${hasActiveSubscription ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={hasActiveSubscription ? 'text-gray-900' : 'text-gray-500'}>
                      AI-powered insights
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${hasActiveSubscription ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={hasActiveSubscription ? 'text-gray-900' : 'text-gray-500'}>
                      Priority support
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${hasActiveSubscription ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={hasActiveSubscription ? 'text-gray-900' : 'text-gray-500'}>
                      Resume review checklist
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${hasActiveSubscription ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={hasActiveSubscription ? 'text-gray-900' : 'text-gray-500'}>
                      Industry-specific templates
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                Our support team is here to help with any questions about your subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" onClick={() => navigate('/contact')}>
                  Contact Support
                </Button>
                <Button variant="outline" onClick={() => navigate('/pricing')}>
                  View All Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Subscription;