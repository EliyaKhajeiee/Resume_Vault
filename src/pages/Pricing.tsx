import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { SUBSCRIPTION_PLANS } from "@/services/stripeService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const { isAuthenticated } = useAuth();
  const { hasActiveSubscription, createCheckoutSession } = useSubscription();
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    if (hasActiveSubscription) {
      toast.info("You already have an active subscription");
      return;
    }

    try {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan) {
        toast.error("Plan not found");
        return;
      }

      await createCheckoutSession(plan.stripePriceId);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error("Failed to start checkout process");
    }
  };
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Try our service with limited access",
      features: [
        "View 1 resume example",
        "Basic search functionality",
        "Community access",
        "Email support"
      ],
      cta: "Get started free",
      popular: false
    },
    {
      name: "Resume Pack",
      price: "$9.99",
      period: "one-time",
      description: "Get access to 5 premium resumes",
      features: [
        "Access to 5 premium resumes",
        "Download in PDF format",
        "Basic search and filters",
        "30-day access period"
      ],
      cta: "Buy now",
      popular: true
    },
    {
      name: "Pro",
      price: "$29.99",
      period: "month",
      description: "Unlimited access to all resumes",
      features: [
        "Unlimited resume access",
        "Advanced search and filters",
        "Download in multiple formats",
        "Priority support",
        "Resume review checklist",
        "Industry-specific templates"
      ],
      cta: "Subscribe now",
      popular: false
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "Bulk deals for universities, schools, and organizations",
      features: [
        "Everything in Pro",
        "Team collaboration tools",
        "Custom branding",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced analytics",
        "Volume discounts"
      ],
      cta: "Contact sales",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. You'll continue to have access to Pro features until the end of your billing period."
    },
    {
      question: "Are the resume examples real?",
      answer: "Absolutely! Every resume in our database is from a real person who successfully landed a job at the company listed."
    },
    {
      question: "How often do you add new resumes?",
      answer: "We add new resume examples weekly, ensuring our database stays current with the latest hiring trends."
    },
    {
      question: "Can I download the resumes?",
      answer: "Pro subscribers can download resumes in multiple formats including PDF, Word, and our custom templates."
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <div className="mb-4">
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full">
              💼 Pricing Plans
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
            Choose your <span className="text-blue-600">career path</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Start free with 1 resume view, get 5 resumes for $9.99, or unlimited access for $29.99/month.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>✅ No hidden fees</span>
            <span>•</span>
            <span>✅ Cancel anytime</span>
            <span>•</span>
            <span>✅ 7-day money back guarantee</span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'border-blue-500 shadow-2xl scale-105 bg-gradient-to-b from-blue-50 to-white' 
                  : 'border-gray-200 hover:shadow-xl hover:border-blue-200'
              }`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className={`text-4xl font-bold ${plan.popular ? 'text-blue-600' : ''}`}>
                      {plan.price}
                    </span>
                    {plan.period !== "contact us" && (
                      <span className="text-gray-500">/{plan.period}</span>
                    )}
                  </div>
                  <CardDescription className="mt-4 text-base">{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full font-semibold py-3 transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg' 
                        : 'border-2 hover:border-blue-500 hover:text-blue-600'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => {
                      if (plan.name === 'Free') {
                        navigate('/resumes');
                      } else if (plan.name === 'Resume Pack') {
                        handleSubscribe('access-pack');
                      } else if (plan.name === 'Pro') {
                        handleSubscribe('pro-monthly');
                      } else if (plan.name === 'Enterprise') {
                        navigate('/contact');
                      }
                    }}
                    disabled={plan.name === 'Pro' && hasActiveSubscription}
                  >
                    {plan.name === 'Pro' && hasActiveSubscription ? '✅ Current Plan' : plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-6">Compare Plans</h2>
            <p className="text-xl text-gray-600">
              See what's included in each plan
            </p>
          </div>

          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold">Features</th>
                    <th className="text-center py-4 px-6 font-semibold">Free</th>
                    <th className="text-center py-4 px-6 font-semibold">Resume Pack</th>
                    <th className="text-center py-4 px-6 font-semibold">Pro</th>
                    <th className="text-center py-4 px-6 font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { feature: "Resume Examples", free: "1", pack: "5", pro: "Unlimited", enterprise: "Unlimited" },
                    { feature: "Search & Filters", free: "Basic", pack: "Basic", pro: "Advanced", enterprise: "Advanced" },
                    { feature: "Download Formats", free: "❌", pack: "PDF", pro: "PDF, Word, Templates", enterprise: "All formats" },
                    { feature: "Priority Support", free: "❌", pack: "❌", pro: "✅", enterprise: "✅" },
                    { feature: "Team Collaboration", free: "❌", pack: "❌", pro: "❌", enterprise: "✅" },
                    { feature: "Volume Discounts", free: "❌", pack: "❌", pro: "❌", enterprise: "✅" },
                    { feature: "Access Period", free: "Forever", pack: "30 days", pro: "Monthly billing", enterprise: "Custom" },
                  ].map((row, index) => (
                    <tr key={index}>
                      <td className="py-4 px-6 font-medium">{row.feature}</td>
                      <td className="py-4 px-6 text-center">{row.free}</td>
                      <td className="py-4 px-6 text-center">{row.pack}</td>
                      <td className="py-4 px-6 text-center">{row.pro}</td>
                      <td className="py-4 px-6 text-center">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-semibold text-black mb-4">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <div className="mb-6">
            <span className="bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full">
              🚀 Ready to take action?
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to land your dream job?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've used Resume Proof to advance their careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 font-semibold text-lg shadow-lg"
              onClick={() => handleSubscribe('pro-monthly')}
              disabled={hasActiveSubscription}
            >
              {hasActiveSubscription ? '✅ Current Plan' : '💼 Subscribe now'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-blue-600 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 font-semibold text-lg"
              onClick={() => navigate('/resumes')}
            >
              👀 View examples
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Auth Dialog */}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        defaultTab="signup"
      />
    </div>
  );
};

export default Pricing;