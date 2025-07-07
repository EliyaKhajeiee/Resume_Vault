import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Mail, ArrowRight, Star, Users, FileText, TrendingUp, Briefcase, Code, Database, BarChart3, Brain, Settings } from "lucide-react";
import { toast } from "sonner";
import { EmailService } from "@/services/emailService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompanyLogos from "@/components/CompanyLogos";
import { Link } from "react-router-dom";

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

  const features = [
    {
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      title: "500+ Real Resume Examples",
      description: "Access hundreds of resumes that landed offers at top companies"
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Proven Success Stories",
      description: "Every resume in our database led to an actual job offer"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: "Smart Search & Filters",
      description: "Find resumes by company, role, industry, and experience level"
    }
  ];

  const roleCategories = [
    {
      name: "Product Management",
      icon: <Briefcase className="w-6 h-6 text-blue-600" />,
      href: "/resumes?role=Product%20Manager"
    },
    {
      name: "Engineering",
      icon: <Settings className="w-6 h-6 text-blue-600" />,
      href: "/resumes?role=Engineering%20Manager"
    },
    {
      name: "Software Engineering", 
      icon: <Code className="w-6 h-6 text-blue-600" />,
      href: "/resumes?role=Software%20Engineer"
    },
    {
      name: "Data Engineering",
      icon: <Database className="w-6 h-6 text-blue-600" />,
      href: "/resumes?role=Data%20Engineer"
    },
    {
      name: "Data Science",
      icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
      href: "/resumes?role=Data%20Scientist"
    },
    {
      name: "Machine Learning",
      icon: <Brain className="w-6 h-6 text-blue-600" />,
      href: "/resumes?role=ML%20Engineer"
    },
    {
      name: "TPM",
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      href: "/resumes?role=Technical%20Program%20Manager"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      content: "Found the perfect resume template that helped me land my dream job at Google. The examples were incredibly detailed and relevant.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Product Manager at Meta",
      content: "Resume Proof showed me exactly what top companies are looking for. Got 3 offers within 2 weeks of updating my resume.",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "Data Scientist at Netflix",
      content: "The industry-specific examples were game-changing. Finally understood how to present my experience effectively.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-8 leading-tight">
              Everything you need to <br />
              <span className="text-blue-600">ace your career</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Level up your career and land your next role with proven resume examples, smart search, and community insights.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/resumes">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl">
                  Browse Resumes
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold rounded-xl">
                Get started for free
              </Button>
            </div>

            {/* Role Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 max-w-5xl mx-auto mb-16">
              {roleCategories.map((role, index) => (
                <Link key={role.name} to={role.href} className="block">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:scale-105 cursor-pointer">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        {role.icon}
                      </div>
                      <h3 className="font-medium text-sm text-gray-900">{role.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company Logos */}
      <CompanyLogos />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-6">Why Resume Proof?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're building the ultimate resource for proven resume examples from top companies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Capture Section */}
      <section className="py-20 bg-blue-600">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Get early access to our resume database
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Be the first to access 500+ proven resume examples when we launch. No spam, just career gold.
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleEmailSubmit} className="max-w-lg mx-auto">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 pl-12 text-lg border-2 border-blue-500 focus:border-white rounded-xl bg-white"
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="h-14 px-8 bg-white text-blue-600 hover:bg-gray-100 rounded-xl text-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Get Early Access"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="max-w-lg mx-auto">
              <div className="bg-white/10 border border-white/20 rounded-xl p-8">
                <Check className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">You're in!</h3>
                <p className="text-blue-100 text-lg">
                  Thanks for joining! Stay tuned to crack your next interview with resumes that actually worked.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-6">Success Stories</h2>
            <p className="text-xl text-gray-600">
              See how Resume Proof helped professionals land their dream jobs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl border border-gray-200">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-3">500+</div>
              <div className="text-gray-600 text-lg">Successful Resumes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-3">200+</div>
              <div className="text-gray-600 text-lg">Top Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-3">95%</div>
              <div className="text-gray-600 text-lg">Interview Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-3">50K+</div>
              <div className="text-gray-600 text-lg">Happy Users</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;