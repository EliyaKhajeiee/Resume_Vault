import { Users, Target, Award, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const About = () => {
  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      bio: "Former Google PM with 8+ years helping professionals land dream jobs.",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Product",
      bio: "Ex-Meta engineer passionate about building tools that accelerate careers.",
      image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
    },
    {
      name: "Emily Johnson",
      role: "Head of Content",
      bio: "Career coach and resume expert who's helped 1000+ professionals.",
      image: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
    },
    {
      name: "David Kim",
      role: "Head of Engineering",
      bio: "Former Netflix engineer building the future of career development.",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
    }
  ];

  const values = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Mission-Driven",
      description: "We're on a mission to democratize access to career opportunities by sharing what actually works."
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Community-First",
      description: "Our community of successful professionals shares their knowledge to help others succeed."
    },
    {
      icon: <Award className="w-8 h-8 text-purple-600" />,
      title: "Quality-Focused",
      description: "Every resume in our database is verified and has led to actual job offers at top companies."
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Impact-Oriented",
      description: "We measure success by the careers we've helped advance and the dreams we've helped achieve."
    }
  ];

  const stats = [
    { number: "500+", label: "Resume Examples" },
    { number: "50K+", label: "Happy Users" },
    { number: "200+", label: "Companies Represented" },
    { number: "95%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-black mb-6">
            We're democratizing access to career success
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Resume Proof was born from a simple belief: everyone deserves access to the career insights that can change their life.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="prose prose-lg mx-auto">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">Our Story</h2>
            
            <div className="space-y-6 text-gray-600">
              <p>
                It started with a frustrating realization. Despite having strong qualifications, many talented professionals were struggling to land interviews at top companies. The problem wasn't their skills—it was how they presented them.
              </p>
              
              <p>
                Our founder, Sarah Chen, experienced this firsthand. After years of helping friends and colleagues improve their resumes, she noticed a pattern: the most successful applications followed specific formats and highlighted certain types of achievements.
              </p>
              
              <p>
                But this knowledge was scattered and hard to access. The best resume examples were hidden in private networks, shared only among insiders at top companies. This created an unfair advantage for those with the right connections.
              </p>
              
              <p>
                That's when we decided to change the game. We started collecting real resume examples from successful candidates at Google, Meta, Apple, McKinsey, Goldman Sachs, and hundreds of other top companies. Every resume in our database led to an actual job offer.
              </p>
              
              <p>
                Today, Resume Proof is the world's largest collection of proven resume examples, helping thousands of professionals land their dream jobs every month.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-none shadow-lg">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-6">Our Impact</h2>
            <p className="text-xl text-gray-600">
              The numbers that drive us forward
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600">
              The people behind Resume Proof
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center border-none shadow-lg">
                <CardHeader>
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to advance your career?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've used Resume Proof to land their dream jobs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/resumes">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4">
                Browse Resume Examples
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;