import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Blog = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const featuredPost = {
    title: "Why We Started Resume Proof: Leveling the Playing Field in a Tough Job Market",
    excerpt: "The story of how two founders decided to help students and professionals achieve their dreams through curated, proven resume examples.",
    author: "Nathan Lee & Eliya Khajeie",
    date: "Jan 15, 2025",
    readTime: "8 min read",
    category: "Company Story",
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop",
    content: `
      The job market in 2025 has been brutal. Despite having strong technical skills and impressive academic backgrounds, we watched countless talented individuals struggle to land interviews at top companies. The problem wasn't their qualifications—it was how they presented them.

      As an Associate Product Manager at Google, Nathan saw firsthand how certain resume formats and storytelling techniques consistently led to successful hires. Meanwhile, Eliya, running a software engineering firm serving multi-million dollar enterprises, noticed that the most successful candidates all seemed to follow similar patterns in their applications.

      But here's the thing: this knowledge was locked away in private networks. The best resume examples were shared only among insiders, creating an unfair advantage for those with the right connections.

      That's when we realized we had to act. We started collecting real resume examples from successful candidates—not theoretical templates, but actual resumes that led to job offers at Google, Meta, Apple, McKinsey, Goldman Sachs, and hundreds of other top companies.

      Every resume in our database is verified and has led to an actual job offer. We believe that with the right guidance and examples, anyone can achieve their career goals, regardless of their background or connections.

      Resume Proof isn't just a product—it's our mission to democratize access to career success and help the next generation of professionals achieve their dreams.
    `
  };

  const blogPosts = [
    {
      title: "The Ultimate Guide to Product Manager Resumes",
      excerpt: "Everything you need to know about crafting a PM resume that stands out.",
      author: "Nathan Lee",
      date: "Jan 12, 2025",
      readTime: "6 min read",
      category: "Product Management",
      image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop"
    },
    {
      title: "Software Engineering Resume Mistakes to Avoid",
      excerpt: "Common pitfalls that prevent engineers from getting interviews.",
      author: "Eliya Khajeie",
      date: "Jan 10, 2025",
      readTime: "5 min read",
      category: "Engineering",
      image: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop"
    },
    {
      title: "Data Science Resume Templates That Work",
      excerpt: "Proven templates and examples from successful data scientists.",
      author: "Nathan Lee",
      date: "Jan 8, 2025",
      readTime: "7 min read",
      category: "Data Science",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop"
    },
    {
      title: "How to Quantify Your Impact on Your Resume",
      excerpt: "Turn your accomplishments into compelling, measurable results.",
      author: "Eliya Khajeie",
      date: "Jan 5, 2025",
      readTime: "4 min read",
      category: "Career Tips",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop"
    },
    {
      title: "McKinsey Resume Format: What Consultants Need to Know",
      excerpt: "Inside look at what top consulting firms look for in resumes.",
      author: "Nathan Lee",
      date: "Jan 3, 2025",
      readTime: "6 min read",
      category: "Consulting",
      image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop"
    },
    {
      title: "Resume Keywords That Actually Matter in 2025",
      excerpt: "The latest insights on ATS optimization and keyword strategy.",
      author: "Eliya Khajeie",
      date: "Dec 30, 2024",
      readTime: "5 min read",
      category: "ATS Optimization",
      image: "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop"
    }
  ];

  const categories = [
    "All Posts",
    "Career Tips",
    "Engineering",
    "Product Management",
    "Data Science",
    "Consulting",
    "ATS Optimization",
    "Company Story"
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-black mb-6">
            Career Insights & Resume Tips
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Expert advice, industry insights, and proven strategies to help you land your dream job.
          </p>
        </div>
      </section>

      <div className="container max-w-7xl mx-auto px-4 py-16">
        {/* Featured Post */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-8">Featured Article</h2>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <Badge className="mb-4">{featuredPost.category}</Badge>
                <CardTitle className="text-2xl mb-4 hover:text-blue-600 transition-colors">
                  {featuredPost.title}
                </CardTitle>
                <CardDescription className="text-gray-600 mb-6 text-base">
                  {featuredPost.excerpt}
                </CardDescription>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <User className="w-4 h-4 mr-2" />
                  <span className="mr-4">{featuredPost.author}</span>
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="mr-4">{featuredPost.date}</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className="block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Newsletter Signup */}
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Stay Updated</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get the latest career tips and resume insights delivered to your inbox.
                </p>
                <Link to="/">
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    Subscribe
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-black">Latest Articles</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Most Recent
                </Button>
                <Button variant="outline" size="sm">
                  Most Popular
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts.map((post, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <Badge variant="outline" className="w-fit mb-2">
                      {post.category}
                    </Badge>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-xs text-gray-500">
                      <User className="w-3 h-3 mr-1" />
                      <span className="mr-3">{post.author}</span>
                      <Calendar className="w-3 h-3 mr-1" />
                      <span className="mr-3">{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">
            Ready to build your perfect resume?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse our collection of 500+ proven resume examples from top companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/resumes">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-4">
                Browse Resume Examples
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="px-8 py-4">
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

export default Blog;