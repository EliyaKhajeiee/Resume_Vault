import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Mail, ArrowRight, Star, Users, FileText, TrendingUp, Briefcase, Code, Database, BarChart3, Brain, Settings, UserCheck, Eye, Megaphone, DollarSign, PiggyBank, X, Search, Bot, Calendar, Download, GraduationCap, Trophy, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { EmailService } from "@/services/emailService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompanyLogos from "@/components/CompanyLogos";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const Index = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const { isAuthenticated } = useAuth();

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
      name: "Software Engineer",
      icon: <Code className="w-6 h-6 text-blue-600" />,
      href: "/resumes?role=Software%20Engineer",
      companyLogos: [
        "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
        "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
      ]
    },
    {
      name: "Product Manager",
      icon: <Briefcase className="w-6 h-6 text-blue-600" />,
      href: "/resumes?role=Product%20Manager",
      companyLogos: [
        "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
        "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
      ]
    },
    {
      name: "Data Scientist",
      icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
      href: "/resumes?role=Data%20Scientist",
      companyLogos: [
        "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg"
      ]
    },
    {
      name: "Machine Learning",
      icon: <Brain className="w-6 h-6 text-blue-600" />,
      href: "/resumes?role=Machine%20Learning%20Engineer",
      companyLogos: [
        "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg"
      ]
    },
    {
      name: "Consultant",
      icon: <Users className="w-6 h-6 text-blue-600" />,
      href: "/resumes?role=Consultant",
      companyLogos: [
        "/mckinsey-clean.png",
        "https://upload.wikimedia.org/wikipedia/commons/3/3e/BCG_Logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg"
      ]
    },
    {
      name: "Marketing",
      icon: <Megaphone className="w-6 h-6 text-blue-600" />,
      href: "/resumes?role=Marketing",
      companyLogos: [
        "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
      ]
    },
    {
      name: "Finance",
      icon: <DollarSign className="w-6 h-6 text-blue-600" />,
      href: "/resumes?role=Finance",
      companyLogos: [
        "https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg",
        "https://upload.wikimedia.org/wikipedia/commons/1/1e/JPMorgan_Chase_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/d/da/BlackRock_logo.svg"
      ]
    },
    {
      name: "Investment Banking",
      icon: <PiggyBank className="w-6 h-6 text-blue-600" />,
      href: "/resumes?role=Investment%20Banking",
      companyLogos: [
        "https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg",
        "https://upload.wikimedia.org/wikipedia/commons/1/1e/JPMorgan_Chase_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/d/da/BlackRock_logo.svg"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Kelan L.",
      role: "Software Engineer at Google",
      content: "I was applying to 200+ roles and I didn't know why I wasn't getting interviews. I used ResumeProof to land my role at Google, the resume examples were spot on.",
      rating: 5
    },
    {
      name: "Rod R.",
      role: "Product Manager at BlackRock",
      content: "Seeing PM resumes from actual BlackRock hires gave me the insight as to what works and helped me change mine, and I got the interview.",
      rating: 5
    },
    {
      name: "Nathan L.",
      role: "Consultant at Citadel",
      content: "I kept getting rejected from consulting firms and didn't know why. ResumeProof showed me how top-tier resumes are structured — I updated mine and finally landed interviews at Citadel.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Copy */}
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
                Stop guessing. <br />
                <span className="text-blue-600">Use resumes that actually worked.</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Your resume is the biggest blocker between you and your next interview. ResumeProof gives you access to 500+ real resumes that landed jobs at Google, JPMorgan, Citadel, and more, so you can learn exactly what works.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Link to="/resumes">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl">
                    Browse Proven Resumes
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-xl"
                  onClick={() => setShowAuthDialog(true)}
                >
                  Join Free Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {!isAuthenticated && (
                <p className="text-lg text-blue-600 font-medium mb-8">
                  <button
                    onClick={() => setShowAuthDialog(true)}
                    className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-4 hover:decoration-blue-800 transition-colors"
                  >
                    Sign in to get your free resume!
                  </button>
                </p>
              )}
            </div>

            {/* Right Side - Resume Visual */}
            <div className="relative">
              <div className="grid grid-cols-1 gap-8">
                {/* Bad Resume */}
                <div className="relative transform rotate-1">
                  <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-red-200 text-xs">
                    <div className="space-y-2">
                      <div className="text-center">
                        <h3 className="font-bold text-sm">John Smith</h3>
                        <p className="text-gray-500 text-xs">johnsmith@email.com</p>
                      </div>

                      <div className="pt-1">
                        <h4 className="font-semibold text-xs mb-1">OBJECTIVE</h4>
                        <p className="text-gray-700 leading-tight">Looking for a job to use my skills...</p>
                      </div>

                      <div className="pt-1">
                        <h4 className="font-semibold text-xs mb-1">EXPERIENCE</h4>
                        <div>
                          <p className="font-medium">Various Jobs <span className="text-gray-500">2018-2023</span></p>
                          <p className="text-gray-700 leading-tight">• Did many things</p>
                          <p className="text-gray-700 leading-tight">• Worked with people</p>
                        </div>
                      </div>

                      <div className="pt-1">
                        <h4 className="font-semibold text-xs mb-1">SKILLS</h4>
                        <p className="text-gray-700 leading-tight">Microsoft Office, team player</p>
                      </div>
                    </div>
                    {/* Rejected Stamp */}
                    <div className="absolute -top-4 -right-4 bg-red-500 text-white px-3 py-1 rounded-full transform rotate-12 shadow-lg">
                      <div className="flex items-center gap-1 font-bold text-xs">
                        <X className="w-3 h-3" />
                        REJECTED
                      </div>
                    </div>
                  </div>
                </div>

                {/* Good Resume */}
                <div className="relative transform -rotate-1 -mt-4">
                  <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-green-200 text-xs">
                    <div className="space-y-2">
                      <div className="text-center border-b pb-1">
                        <h3 className="font-bold text-sm text-blue-900">John Doe</h3>
                        <p className="text-gray-500 text-xs">john.doe@gmail.com | LinkedIn</p>
                      </div>

                      <div className="pt-1">
                        <h4 className="font-bold text-xs text-blue-900">SOFTWARE ENGINEER</h4>
                        <p className="text-gray-700 leading-tight">3+ years building web apps. Increased user engagement 40%.</p>
                      </div>

                      <div className="pt-1">
                        <h4 className="font-bold text-xs mb-1 text-blue-900">EXPERIENCE</h4>
                        <div>
                          <p className="font-semibold">Software Engineer | TechCorp <span className="text-gray-500">2021-2023</span></p>
                          <p className="text-gray-700 leading-tight">• Built React app serving 10K+ users</p>
                          <p className="text-gray-700 leading-tight">• Reduced load time 60%</p>
                        </div>
                      </div>

                      <div className="pt-1">
                        <h4 className="font-bold text-xs mb-1 text-blue-900">SKILLS</h4>
                        <p className="text-gray-700 leading-tight">JavaScript, React, Node.js, AWS</p>
                      </div>

                      {/* Company Logos Section */}
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500 text-center mb-2">Got offers from:</p>
                        <div className="grid grid-cols-2 gap-1">
                          <div className="bg-gray-50 rounded px-1 py-1 flex items-center justify-center">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg"
                              alt="Tesla"
                              className="h-3 w-3 object-contain"
                            />
                          </div>
                          <div className="bg-gray-50 rounded px-1 py-1 flex items-center justify-center">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                              alt="Google"
                              className="h-2 w-auto max-w-8 object-contain"
                            />
                          </div>
                          <div className="bg-gray-50 rounded px-1 py-1 flex items-center justify-center">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg"
                              alt="Microsoft"
                              className="h-2 w-auto max-w-8 object-contain"
                            />
                          </div>
                          <div className="bg-gray-50 rounded px-1 py-1 flex items-center justify-center">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/d/da/BlackRock_logo.svg"
                              alt="BlackRock"
                              className="h-2 w-auto max-w-8 object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Hired Stamp */}
                    <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full transform -rotate-12 shadow-lg">
                      <div className="flex items-center gap-1 font-bold text-xs">
                        <Check className="w-3 h-3" />
                        HIRED
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Industry Grid Section */}
          <div className="text-center mt-20 mb-8">
            <h2 className="text-3xl font-bold text-black mb-4">Proof across every industry.</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              No matter where you're applying: Wall Street, FAANG, consulting, or quant trading, ResumeProof shows you what a successful resume looks like.
            </p>
          </div>

          {/* Role Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 max-w-6xl mx-auto justify-items-center">
            {roleCategories.map((role, index) => (
              <Link key={role.name} to={role.href} className="block">
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:scale-105 cursor-pointer">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      {role.icon}
                    </div>
                    <h3 className="font-medium text-sm text-gray-900 mb-2">{role.name}</h3>
                    {/* Company Logos */}
                    <div className="flex justify-center gap-1 mb-1">
                      {role.companyLogos.slice(0, 3).map((logo, logoIndex) => (
                        <div key={logoIndex} className="w-4 h-4 flex items-center justify-center">
                          <img
                            src={logo}
                            alt={`Company ${logoIndex + 1}`}
                            className="max-w-full max-h-full object-contain opacity-60"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Company Logos */}
      <CompanyLogos />

      {/* User Cards Section */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-6">No matter your background, we got you covered</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🎓</span>
                <h3 className="text-xl font-bold">Ambitious Underdog</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                No Ivy degree? No problem, see how students without Ivy degrees still broke into top firms.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🏆</span>
                <h3 className="text-xl font-bold">Stressed Striver</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Target-school? Great internships? Still not getting interviews? Compare your resume against ones that landed Google APM & JPMorgan IB offers.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🔄</span>
                <h3 className="text-xl font-bold">Career Switcher</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Thinking of pivoting from bio, psych, or math into tech or consulting? Explore resumes from people who made the same leap and got hired.
              </p>
            </div>
          </div>
        </div>
      </section>

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

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              A system, not just a file dump.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ResumeProof isn't just templates — it's a living library that evolves as hiring trends change.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Browse & Filter</h3>
                <p className="text-gray-600 text-sm">500+ proven resumes by role, company, and industry</p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Insights</h3>
                <p className="text-gray-600 text-sm">Short breakdowns explaining why each resume worked</p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Monthly Resume Drops</h3>
                <p className="text-gray-600 text-sm">Fresh examples & hiring trend reports</p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Save Favorites & Download</h3>
                <p className="text-gray-600 text-sm">Build your own success playbook</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link to="/resumes">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
              >
                See the Vault →
              </Button>
            </Link>
          </div>
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

      <Footer />

      {/* Auth Dialog */}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        defaultTab="signin"
      />
    </div>
  );
};

export default Index;