import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, ArrowRight, BookOpen, Target, Lightbulb } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Guides = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Resume Writing", "Interview Prep", "Career Strategy", "Industry Specific"];

  const guides = [
    {
      id: 1,
      title: "The Complete Guide to Writing a Tech Resume",
      category: "Resume Writing",
      description: "Everything you need to know about crafting a resume that gets you hired at top tech companies.",
      readTime: "15 min read",
      author: "Nathan Lee",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
      featured: true,
      tags: ["Tech", "Resume", "FAANG"],
      link: "/guides/tech-resume"
    },
    {
      id: 2,
      title: "How to Quantify Your Impact on Your Resume",
      category: "Resume Writing",
      description: "Learn how to turn your accomplishments into compelling, measurable results that recruiters love.",
      readTime: "8 min read",
      author: "Eliya Khajeie",
      image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
      featured: true,
      tags: ["Metrics", "Impact", "Results"],
      link: "/guides/quantify-impact"
    },
    {
      id: 3,
      title: "Product Manager Resume Strategy Guide",
      category: "Industry Specific",
      description: "Specific strategies for PM resumes, including how to showcase product sense and leadership.",
      readTime: "12 min read",
      author: "Nathan Lee",
      image: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
      featured: false,
      tags: ["Product Management", "Leadership", "Strategy"],
      link: "/guides/product-manager"
    },
    {
      id: 4,
      title: "Consulting Resume Masterclass",
      category: "Industry Specific",
      description: "How to craft a consulting resume that demonstrates problem-solving and client impact.",
      readTime: "10 min read",
      author: "Eliya Khajeie",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
      featured: false,
      tags: ["Consulting", "Problem Solving", "McKinsey"],
      link: "/guides/consulting"
    },
    {
      id: 5,
      title: "ATS Optimization: Getting Past the Robots",
      category: "Resume Writing",
      description: "Master the art of ATS optimization without sacrificing readability and impact.",
      readTime: "7 min read",
      author: "Nathan Lee",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
      featured: true,
      tags: ["ATS", "Keywords", "Optimization"],
      link: "/guides/ats-optimization"
    },
    {
      id: 6,
      title: "Career Transition Resume Strategy",
      category: "Career Strategy",
      description: "How to position yourself when changing industries or roles.",
      readTime: "11 min read",
      author: "Eliya Khajeie",
      image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
      featured: false,
      tags: ["Career Change", "Transition", "Strategy"],
      link: "/guides/career-transition"
    }
  ];

  const filteredGuides = selectedCategory === "All" 
    ? guides 
    : guides.filter(guide => guide.category === selectedCategory);

  const featuredGuide = guides.find(guide => guide.featured);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-black mb-6">
            Career Guides
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Expert guides and strategies to help you craft the perfect resume and advance your career.
          </p>
        </div>
      </section>

      <div className="container max-w-7xl mx-auto px-4 py-16">
        {/* Featured Guide */}
        {featuredGuide && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-black mb-8">Featured Guide</h2>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={featuredGuide.image} 
                    alt={featuredGuide.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <Badge className="mb-4">{featuredGuide.category}</Badge>
                  <CardTitle className="text-2xl mb-4 hover:text-blue-600 transition-colors">
                    {featuredGuide.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mb-6 text-base">
                    {featuredGuide.description}
                  </CardDescription>
                  <div className="flex items-center text-sm text-gray-500 mb-6">
                    <User className="w-4 h-4 mr-2" />
                    <span className="mr-4">{featuredGuide.author}</span>
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{featuredGuide.readTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredGuide.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link to="/guides/tech-resume">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Read Guide
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-none shadow-md">
            <CardContent className="p-6">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-black mb-2">50+ Guides</div>
              <div className="text-gray-600">Comprehensive career resources</div>
            </CardContent>
          </Card>
          <Card className="text-center border-none shadow-md">
            <CardContent className="p-6">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-black mb-2">95% Success</div>
              <div className="text-gray-600">Of readers land interviews</div>
            </CardContent>
          </Card>
          <Card className="text-center border-none shadow-md">
            <CardContent className="p-6">
              <Lightbulb className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-black mb-2">Expert Tips</div>
              <div className="text-gray-600">From industry professionals</div>
            </CardContent>
          </Card>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGuides.map((guide) => (
            <Card key={guide.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={guide.image} 
                  alt={guide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2">
                  {guide.category}
                </Badge>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {guide.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {guide.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <User className="w-3 h-3 mr-1" />
                  <span className="mr-3">{guide.author}</span>
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{guide.readTime}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {guide.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link to={guide.link}>
                  <Button variant="outline" className="w-full">
                    Read Guide
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="text-center mt-16">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-black mb-4">
                Get Weekly Career Tips
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Subscribe to our newsletter for the latest career guides, resume tips, and industry insights delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Subscribe
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

export default Guides;