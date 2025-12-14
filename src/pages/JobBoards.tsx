import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Star, Check, GraduationCap, Code, DollarSign, BarChart3, Globe, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { jobBoards, categories, type JobBoard } from "@/data/jobBoards";

const JobBoards = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filteredBoards, setFilteredBoards] = useState<JobBoard[]>(jobBoards);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredBoards(jobBoards);
    } else {
      setFilteredBoards(jobBoards.filter(board => board.category === selectedCategory));
    }
  }, [selectedCategory]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'University':
        return <GraduationCap className="h-4 w-4" />;
      case 'Tech':
        return <Code className="h-4 w-4" />;
      case 'Finance':
        return <DollarSign className="h-4 w-4" />;
      case 'Consulting':
        return <BarChart3 className="h-4 w-4" />;
      case 'Remote':
        return <Globe className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'University':
        return 'bg-blue-100 text-blue-800';
      case 'Tech':
        return 'bg-purple-100 text-purple-800';
      case 'Finance':
        return 'bg-green-100 text-green-800';
      case 'Consulting':
        return 'bg-orange-100 text-orange-800';
      case 'Remote':
        return 'bg-cyan-100 text-cyan-800';
      case 'Product':
        return 'bg-pink-100 text-pink-800';
      case 'Design':
        return 'bg-rose-100 text-rose-800';
      case 'Data Science':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const featuredBoards = filteredBoards.filter(board => board.featured);
  const regularBoards = filteredBoards.filter(board => !board.featured);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white border-b">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Job Boards & Application Platforms
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Curated list of the best platforms to find and apply to opportunities at top companies. From student-focused platforms like Handshake to specialized boards for tech, finance, and consulting.
            </p>
          </div>

          {/* Category Filter */}
          <div className="max-w-md mx-auto">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Filter by Category
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Boards */}
      {featuredBoards.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-yellow-50 to-white border-b">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <Star className="h-6 w-6 text-yellow-600 fill-yellow-600" />
              <h2 className="text-3xl font-bold text-black">Featured Platforms</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBoards.map((board) => (
                <Card
                  key={board.id}
                  className="hover:shadow-xl transition-all duration-200 group border-2 border-yellow-200 bg-white"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-2xl text-black mb-2">{board.name}</CardTitle>
                        <Badge className={getCategoryColor(board.category)}>
                          {getCategoryIcon(board.category)}
                          <span className="ml-1">{board.category}</span>
                        </Badge>
                      </div>
                      <Badge variant="default" className="bg-yellow-500 text-white">
                        <Star className="h-3 w-3 fill-white" />
                      </Badge>
                    </div>

                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      {board.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Target Audience */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-semibold text-blue-900 mb-1">Best For:</p>
                      <p className="text-sm text-blue-800">{board.targetAudience}</p>
                    </div>

                    {/* Benefits */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Key Benefits:</p>
                      <ul className="space-y-1">
                        {board.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Visit Button */}
                    <Button
                      asChild
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      size="lg"
                    >
                      <a
                        href={board.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        Visit Platform
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Other Boards */}
      {regularBoards.length > 0 && (
        <section className="py-12">
          <div className="container max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-black mb-8">
              {selectedCategory === "All" ? "More Platforms" : `${selectedCategory} Platforms`}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularBoards.map((board) => (
                <Card
                  key={board.id}
                  className="hover:shadow-lg transition-all duration-200 group border-2 hover:border-blue-300"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-black mb-2">{board.name}</CardTitle>
                      <Badge className={getCategoryColor(board.category)}>
                        {getCategoryIcon(board.category)}
                        <span className="ml-1">{board.category}</span>
                      </Badge>
                    </div>

                    <CardDescription className="text-gray-600 leading-relaxed">
                      {board.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Target Audience */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Best For:</p>
                      <p className="text-sm text-gray-600">{board.targetAudience}</p>
                    </div>

                    {/* Benefits */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Key Benefits:</p>
                      <ul className="space-y-1">
                        {board.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Visit Button */}
                    <Button
                      asChild
                      variant="outline"
                      className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors"
                      size="lg"
                    >
                      <a
                        href={board.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        Visit Platform
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {filteredBoards.length === 0 && (
        <section className="py-12">
          <div className="container max-w-7xl mx-auto px-4 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No job boards found in this category.</p>
            <Button
              variant="outline"
              onClick={() => setSelectedCategory("All")}
              className="mt-4"
            >
              View All Platforms
            </Button>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default JobBoards;
