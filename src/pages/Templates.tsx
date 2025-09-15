import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Templates = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Tech", "Finance", "Consulting", "Product", "Design"];

  const templates = [
    {
      id: 1,
      name: "Google Software Engineer",
      category: "Tech",
      description: "Clean, technical resume template used by successful Google SWE candidates",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop",
      downloads: 2847,
      rating: 4.9,
      featured: true
    },
    {
      id: 2,
      name: "McKinsey Consultant",
      category: "Consulting",
      description: "Professional consulting template with emphasis on impact and results",
      image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop",
      downloads: 1923,
      rating: 4.8,
      featured: true
    },
    {
      id: 3,
      name: "Meta Product Manager",
      category: "Product",
      description: "Product-focused template highlighting user impact and growth metrics",
      image: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop",
      downloads: 1654,
      rating: 4.7,
      featured: false
    },
    {
      id: 4,
      name: "Goldman Sachs Analyst",
      category: "Finance",
      description: "Finance industry template with focus on quantitative achievements",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop",
      downloads: 1432,
      rating: 4.6,
      featured: false
    },
    {
      id: 5,
      name: "Apple Design Lead",
      category: "Design",
      description: "Creative template showcasing design thinking and user experience",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop",
      downloads: 1287,
      rating: 4.8,
      featured: false
    },
    {
      id: 6,
      name: "Netflix Data Scientist",
      category: "Tech",
      description: "Data-focused template emphasizing ML projects and statistical analysis",
      image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop",
      downloads: 1156,
      rating: 4.7,
      featured: true
    }
  ];

  const filteredTemplates = selectedCategory === "All" 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-black mb-6">
            Resume Templates
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional resume templates based on real resumes that landed jobs at top companies. Download and customize for your industry.
          </p>
        </div>
      </section>

      <div className="container max-w-7xl mx-auto px-4 py-16">
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Professional Templates</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">100K+</div>
              <div className="text-gray-600">Downloads</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <img 
                  src={template.image} 
                  alt={template.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {template.featured && (
                  <Badge className="absolute top-3 left-3 bg-yellow-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <Button size="sm" variant="secondary">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="outline" className="mt-2">
                      {template.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      {template.rating}
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {template.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-500">
                    {template.downloads.toLocaleString()} downloads
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="icon" className="hover:bg-gray-100">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-black mb-4">
                Need More Templates?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Upgrade to Pro to access our full library of 500+ resume examples and templates from top companies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/pricing">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Upgrade to Pro
                  </Button>
                </Link>
                <Link to="/resumes">
                  <Button variant="outline" size="lg">
                    Browse All Examples
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Templates;