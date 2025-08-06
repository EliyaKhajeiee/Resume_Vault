import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, User, CreditCard, Mail, HelpCircle, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

const Settings = () => {
  const { user } = useAuth();
  const { subscription, hasActiveSubscription, createPortalSession } = useSubscription();
  const [isManagingSubscription, setIsManagingSubscription] = useState(false);

  const handleManageSubscription = async () => {
    if (!subscription?.stripe_customer_id) {
      toast.error("No subscription found");
      return;
    }

    setIsManagingSubscription(true);
    try {
      await createPortalSession();
    } catch (error) {
      toast.error("Failed to open subscription management");
      console.error(error);
    } finally {
      setIsManagingSubscription(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-gray-700" />
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-gray-600">Manage your account, subscription, and preferences</p>
        </div>

        <div className="space-y-8">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <CardTitle>Account Information</CardTitle>
              </div>
              <CardDescription>
                Your basic account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email changes are managed through your authentication provider
                  </p>
                </div>
                <div>
                  <Label htmlFor="status">Account Status</Label>
                  <div className="mt-2">
                    <Badge variant={hasActiveSubscription ? "default" : "secondary"}>
                      {hasActiveSubscription ? "Pro Member" : "Free Account"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <CardTitle>Subscription</CardTitle>
              </div>
              <CardDescription>
                Manage your subscription plan and billing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasActiveSubscription && subscription ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Current Plan</Label>
                      <div className="mt-1">
                        <Badge className="bg-blue-600">Pro - $29/month</Badge>
                      </div>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <div className="mt-1">
                        <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
                          {subscription.status === 'active' ? 'Active' : subscription.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label>Current Period</Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
                      </p>
                    </div>
                    <div>
                      <Label>Next Billing Date</Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(subscription.current_period_end)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={handleManageSubscription}
                      disabled={isManagingSubscription}
                      className="w-full sm:w-auto"
                    >
                      {isManagingSubscription ? "Opening..." : "Manage Subscription & Billing"}
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Update payment methods, view invoices, or cancel your subscription
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">No Active Subscription</h3>
                    <p className="text-gray-600">You're currently on the free plan</p>
                  </div>
                  <Button onClick={() => window.location.href = '/pricing'}>
                    Upgrade to Pro
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>


          {/* Support & Contact */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                <CardTitle>Support & Contact</CardTitle>
              </div>
              <CardDescription>
                Get help and contact our support team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email Support</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <a href="mailto:support@resumeproof.com" className="text-blue-600 hover:underline">
                        support@resumeproof.com
                      </a>
                    </div>
                    <p className="text-xs text-gray-500">
                      We typically respond within 24 hours
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Help Center</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full sm:w-auto"
                      onClick={() => window.location.href = '/pricing#faq'}
                    >
                      View FAQ
                    </Button>
                    <p className="text-xs text-gray-500">
                      Find answers to common questions
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <CardTitle>Privacy & Security</CardTitle>
              </div>
              <CardDescription>
                Review our policies and legal documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Privacy Policy</Label>
                    <p className="text-sm text-gray-500">Review how we handle your data</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/privacy'}
                  >
                    View
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Terms of Service</Label>
                    <p className="text-sm text-gray-500">Read our terms and conditions</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/terms'}
                  >
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Settings;