import { Users, Target, Award, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


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
            We understand the job market is brutal
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            With years of experience in this industry, we've seen talented professionals apply to hundreds of jobs without success. We know the problem isn't your skills—it's your resume.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="prose prose-lg mx-auto">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">The Reality We're Solving</h2>

            <div className="space-y-6 text-gray-600">
              <p>
                We've heard the same story hundreds of times: "I applied to 300+ jobs and got 3 interviews." "I have all the qualifications but can't get past the screening." "I don't know what I'm doing wrong." Sound familiar?
              </p>

              <p>
                The truth is, the job market has become ruthlessly competitive. Hiring managers spend just 6 seconds scanning your resume. In that brief moment, your entire career gets judged. One formatting mistake, one unclear bullet point, one missing keyword—and you're out.
              </p>

              <p>
                Meanwhile, the most successful applications follow specific patterns that aren't taught in school or career centers. The best resume formats are hidden in private networks, shared only among insiders at top companies. This creates an unfair system where your network matters more than your talent.
              </p>

              <p>
                That's exactly what we're changing. With years of experience analyzing what actually works in today's market, we've built the world's largest database of proven resume examples. Every single resume in our collection led to an actual job offer at companies like Google, Meta, McKinsey, Goldman Sachs, and hundreds of others.
              </p>

              <p>
                We're not just another resume service. We're your competitive advantage. We've cracked the code on what hiring managers actually want to see, and we're sharing that intelligence with professionals who refuse to settle for rejections.
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

      {/* Why We're Different Section */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-6">Why We're Different</h2>
            <p className="text-xl text-gray-600">
              We don't just give you templates. We give you the exact resumes that won.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600">Real Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Every resume in our database led to an actual job offer. No theory, no guesswork—just proven success.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-green-600">Insider Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">See exactly how successful candidates presented their experience to land offers at the world's most competitive companies.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-600">Competitive Edge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Stop competing on equal terms. Get the unfair advantage that comes from knowing what actually works in today's market.</p>
              </CardContent>
            </Card>
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
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border-2 border-white px-8 py-4">
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