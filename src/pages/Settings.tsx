import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, User, CreditCard, Mail, HelpCircle, Shield, X, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { StripeService } from "@/services/stripeService";
import { EmailPreferencesService, type EmailPreferences } from "@/services/emailPreferencesService";
import { toast } from "sonner";
import CancellationDialog, { type CancellationFeedback } from "@/components/CancellationDialog";

const Settings = () => {
  const { user } = useAuth();
  const { subscription, purchase, hasActiveSubscription, hasActivePurchase, createPortalSession, cancelSubscription, refetch } = useSubscription();

  const [isManagingSubscription, setIsManagingSubscription] = useState(false);
  const [isCreatingTestPurchase, setIsCreatingTestPurchase] = useState(false);
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);
  const [emailPreferences, setEmailPreferences] = useState<EmailPreferences>({
    marketing_emails: true,
    product_updates: true,
    security_alerts: true
  });
  const [isUpdatingEmailPrefs, setIsUpdatingEmailPrefs] = useState(false);
  const [isLoadingEmailPrefs, setIsLoadingEmailPrefs] = useState(true);

  const handleManageSubscription = async () => {
    if (!subscription?.stripe_customer_id) {
      toast.error("No subscription found");
      return;
    }

    setIsManagingSubscription(true);
    try {
      const { url, error } = await StripeService.createPortalSession(subscription.stripe_customer_id);

      if (error) {
        toast.error(error);
        return;
      }

      if (url) {
        // Check if this is a test customer redirect
        if (url.includes('/contact')) {
          toast.info("For subscription management assistance, please contact support");
        }
        window.location.href = url;
      }
    } catch (error) {
      toast.error("Failed to open subscription management");
      console.error(error);
    } finally {
      setIsManagingSubscription(false);
    }
  };

  const handleCancelSubscription = async (feedback: CancellationFeedback) => {
    try {
      console.log('🚫 Starting cancellation process...');
      await cancelSubscription(feedback);
      toast.success("Your subscription has been cancelled successfully");
      setShowCancellationDialog(false);

      refetch();

    } catch (error) {
      toast.error("Failed to cancel subscription. Please try again.");
      throw error; // Re-throw to prevent dialog from closing
    }
  };

  const handleCreateTestPurchase = async () => {
    setIsCreatingTestPurchase(true);
    try {
      const { success, error } = await StripeService.createTestPurchase();
      if (error) {
        toast.error(error);
      } else {
        toast.success("Test purchase created! You now have 5 resume access for 30 days.");
        // Refresh subscription data to show the purchase
        await refetch();
      }
    } catch (error) {
      toast.error("Failed to create test purchase");
      console.error(error);
    } finally {
      setIsCreatingTestPurchase(false);
    }
  };

  // Load email preferences on component mount
  useEffect(() => {
    const loadEmailPreferences = async () => {
      if (!user) return;

      setIsLoadingEmailPrefs(true);
      try {
        const { preferences, error } = await EmailPreferencesService.getEmailPreferences();

        if (error) {
          console.error('Failed to load email preferences:', error);
          toast.error("Failed to load email preferences");
        } else if (preferences) {
          setEmailPreferences(preferences);
        }
      } catch (error) {
        console.error('Unexpected error loading email preferences:', error);
        toast.error("Failed to load email preferences");
      } finally {
        setIsLoadingEmailPrefs(false);
      }
    };

    loadEmailPreferences();
  }, [user]);

  const handleUpdateEmailPreferences = async (newPreferences: Partial<EmailPreferences>) => {
    setIsUpdatingEmailPrefs(true);
    try {
      const { success, preferences, error } = await EmailPreferencesService.updateEmailPreferences(newPreferences);

      if (success && preferences) {
        setEmailPreferences(preferences);
        toast.success("Email preferences updated successfully");
      } else {
        toast.error(error || "Failed to update email preferences");
      }
    } catch (error) {
      toast.error("Failed to update email preferences");
      console.error(error);
    } finally {
      setIsUpdatingEmailPrefs(false);
    }
  };

  const handleUnsubscribeAll = async () => {
    setIsUpdatingEmailPrefs(true);
    try {
      const { success, preferences, error } = await EmailPreferencesService.unsubscribeFromAll();

      if (success && preferences) {
        setEmailPreferences(preferences);
        toast.success("Unsubscribed from all marketing emails successfully");
      } else {
        toast.error(error || "Failed to unsubscribe from emails");
      }
    } catch (error) {
      toast.error("Failed to unsubscribe from emails");
      console.error(error);
    } finally {
      setIsUpdatingEmailPrefs(false);
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
                    <Badge variant={
                      hasActiveSubscription
                        ? "default"
                        : hasActivePurchase
                        ? "outline"
                        : "secondary"
                    }>
                      {hasActiveSubscription
                        ? subscription?.status === 'canceled'
                          ? "Pro Member (Cancels at period end)"
                          : "Pro Member"
                        : hasActivePurchase
                        ? `Resume Pack (${purchase?.resumes_remaining} left)`
                        : "Free Account"}
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
              {subscription ? (
                hasActiveSubscription ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Current Plan</Label>
                      <div className="mt-1">
                        <Badge className="bg-blue-600">
                          {subscription.plan_id === 'pro-monthly' ? 'Pro - $29.99/month' : subscription.plan_id}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <div className="mt-1">
                        <Badge variant={hasActiveSubscription ? 'default' : 'destructive'}>
                          {subscription.status === 'active'
                            ? 'Active'
                            : subscription.status === 'canceled' && hasActiveSubscription
                              ? 'Active (Cancels at period end)'
                              : subscription.status}
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
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={handleManageSubscription}
                        disabled={isManagingSubscription}
                        className="flex-1 sm:flex-initial"
                      >
                        {isManagingSubscription ? "Opening..." : "Manage Billing"}
                      </Button>
                      {subscription.status === 'active' && (
                        <Button
                          variant="destructive"
                          onClick={() => setShowCancellationDialog(true)}
                          className="flex-1 sm:flex-initial"
                        >
                          Cancel Subscription
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {subscription.stripe_customer_id?.startsWith('cus_test_')
                        ? "Cancel anytime - no commitments or contracts"
                        : "Update payment methods, view invoices, or cancel your subscription"
                      }
                    </p>
                  </div>
                </div>
                ) : (
                  // Canceled subscription display
                  <div className="space-y-4">
                    <div className="text-center py-6 bg-red-50 rounded-lg border border-red-200">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-red-900">Subscription Canceled</h3>
                        <p className="text-red-700">Your Pro subscription has been canceled</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-left">
                        <div>
                          <Label>Plan</Label>
                          <div className="mt-1">
                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                              {subscription.plan_id === 'pro-monthly' ? 'Pro - $29.99/month (Canceled)' : `${subscription.plan_id} (Canceled)`}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <Label>Status</Label>
                          <div className="mt-1">
                            <Badge variant="destructive">
                              Canceled
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <Label>Access Until</Label>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatDate(subscription.current_period_end)}
                          </p>
                        </div>
                        <div>
                          <Label>Next Billing</Label>
                          <p className="text-sm text-gray-600 mt-1">
                            No future charges
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-red-200">
                        <Button onClick={() => window.location.href = '/pricing'} className="bg-blue-600 hover:bg-blue-700">
                          Resubscribe to Pro
                        </Button>
                        <p className="text-xs text-red-600 mt-2">
                          You'll continue to have Pro access until {formatDate(subscription.current_period_end)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
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

          {/* Purchase History */}
          {hasActivePurchase && purchase && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <CardTitle>Resume Pack</CardTitle>
                </div>
                <CardDescription>
                  Your current resume access pack
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Pack Type</Label>
                      <div className="mt-1">
                        <Badge variant="outline">5-Resume Access Pack</Badge>
                      </div>
                    </div>
                    <div>
                      <Label>Resumes Remaining</Label>
                      <div className="mt-1">
                        <Badge variant={purchase.resumes_remaining > 0 ? "default" : "secondary"}>
                          {purchase.resumes_remaining} left
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label>Expires</Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(purchase.expires_at)}
                      </p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <div className="mt-1">
                        <Badge variant={purchase.status === 'succeeded' ? 'default' : 'destructive'}>
                          {purchase.status === 'succeeded' ? 'Active' : purchase.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500">
                      Need more resumes? You can purchase additional packs or upgrade to Pro for unlimited access.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Test Purchase - Development Only */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-600" />
                  <CardTitle className="text-orange-800">Development Testing</CardTitle>
                </div>
                <CardDescription className="text-orange-700">
                  Create a test purchase to test the 5-resume pack functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">Test $9.99 Resume Pack</h4>
                    <p className="text-sm text-orange-700 mb-3">
                      This will give you 5 resume access for 30 days to test the purchase functionality.
                    </p>
                    <Button
                      onClick={handleCreateTestPurchase}
                      disabled={isCreatingTestPurchase}
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-100"
                    >
                      {isCreatingTestPurchase ? "Creating..." : "Create Test Purchase"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Email Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <CardTitle>Email Preferences</CardTitle>
              </div>
              <CardDescription>
                Manage your email subscription and notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {isLoadingEmailPrefs ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading preferences...</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <Label className="text-base font-medium">Marketing Emails</Label>
                          <p className="text-sm text-gray-500">
                            Resume tips, career advice, and special offers
                          </p>
                        </div>
                        <Button
                          variant={emailPreferences.marketing_emails ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleUpdateEmailPreferences({
                            ...emailPreferences,
                            marketing_emails: !emailPreferences.marketing_emails
                          })}
                          disabled={isUpdatingEmailPrefs}
                        >
                          {emailPreferences.marketing_emails ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Subscribed
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4 mr-1" />
                              Unsubscribed
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <Label className="text-base font-medium">Product Updates</Label>
                          <p className="text-sm text-gray-500">
                            New features, improvements, and platform updates
                          </p>
                        </div>
                        <Button
                          variant={emailPreferences.product_updates ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleUpdateEmailPreferences({
                            ...emailPreferences,
                            product_updates: !emailPreferences.product_updates
                          })}
                          disabled={isUpdatingEmailPrefs}
                        >
                          {emailPreferences.product_updates ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Subscribed
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4 mr-1" />
                              Unsubscribed
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <Label className="text-base font-medium">Security Alerts</Label>
                          <p className="text-sm text-gray-500">
                            Important account security and login notifications
                          </p>
                        </div>
                        <Button
                          variant={emailPreferences.security_alerts ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleUpdateEmailPreferences({
                            ...emailPreferences,
                            security_alerts: !emailPreferences.security_alerts
                          })}
                          disabled={isUpdatingEmailPrefs}
                        >
                          {emailPreferences.security_alerts ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Subscribed
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4 mr-1" />
                              Unsubscribed
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Unsubscribe from All</Label>
                          <p className="text-sm text-gray-500">
                            Stop receiving all marketing and product emails (security alerts will remain active)
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleUnsubscribeAll}
                          disabled={isUpdatingEmailPrefs}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          {isUpdatingEmailPrefs ? "Updating..." : "Unsubscribe All"}
                        </Button>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">Email Delivery</h4>
                          <p className="text-sm text-blue-800">
                            Emails are sent to <strong>{user?.email}</strong>.
                            To change your email address, please update it through your authentication provider.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
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
                  <div className="space-y-3">
                    <Label>Help Center</Label>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => window.location.href = '/pricing#faq'}
                      >
                        View FAQ
                      </Button>
                    </div>
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

      {/* Cancellation Dialog */}
      <CancellationDialog
        open={showCancellationDialog}
        onOpenChange={setShowCancellationDialog}
        onConfirmCancel={handleCancelSubscription}
        subscription={subscription}
      />
    </div>
  );
};

export default Settings;