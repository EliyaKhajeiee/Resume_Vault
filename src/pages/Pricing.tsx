import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with resume examples",
      features: [
        "Access to 50 resume examples",
        "Basic search and filters",
        "Community access",
        "Email support"
      ],
      cta: "Get started for free",
      popular: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "month",
      description: "Everything you need to land your dream job",
      features: [
        "Access to 500+ resume examples",
        "Advanced search and filters",
        "AI-powered insights",
        "Download in multiple formats",
        "Priority support",
        "Resume review checklist",
        "Industry-specific templates"
      ],
      cta: "Start free trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team collaboration tools",
        "Custom branding",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced analytics"
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
      question: "Do you offer a free trial?",
      answer: "Yes! We offer a 7-day free trial for our Pro plan. No credit card required to start."
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
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee. If you're not satisfied, we'll provide a full refund."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-black mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Choose the plan that's right for you. Start free and upgrade as you grow.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200'}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period !== "contact us" && (
                      <span className="text-gray-500">/{plan.period}</span>
                    )}
                  </div>
                  <CardDescription className="mt-4">{plan.description}</CardDescription>
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
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
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
                    <th className="text-center py-4 px-6 font-semibold">Pro</th>
                    <th className="text-center py-4 px-6 font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { feature: "Resume Examples", free: "50", pro: "500+", enterprise: "500+" },
                    { feature: "Search & Filters", free: "Basic", pro: "Advanced", enterprise: "Advanced" },
                    { feature: "Download Formats", free: "PDF", pro: "PDF, Word, Templates", enterprise: "All formats" },
                    { feature: "AI Insights", free: "❌", pro: "✅", enterprise: "✅" },
                    { feature: "Priority Support", free: "❌", pro: "✅", enterprise: "✅" },
                    { feature: "Team Collaboration", free: "❌", pro: "❌", enterprise: "✅" },
                  ].map((row, index) => (
                    <tr key={index}>
                      <td className="py-4 px-6 font-medium">{row.feature}</td>
                      <td className="py-4 px-6 text-center">{row.free}</td>
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
      <section className="py-20">
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
      <section className="py-20 bg-blue-600">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to land your dream job?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've used Resume Proof to advance their careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4">
              Start free trial
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4">
              View examples
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;