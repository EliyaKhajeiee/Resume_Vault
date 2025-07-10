import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFiltersComponent from "@/components/SearchFilters";
import { ResumeService, type SearchFilters } from "@/services/resumeService";
import type { Resume } from "@/lib/supabase";
import { toast } from "sonner";

const Resumes = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    searchResumes();
  }, [filters]);

  const searchResumes = async () => {
    setLoading(true);
    try {
      const result = await ResumeService.searchResumes(filters);
      if (result.data) {
        setResumes(result.data);
      } else {
        toast.error(result.error || "Failed to load resumes");
      }
    } catch (error) {
      console.error("Error searching resumes:", error);
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleViewResume = async (resumeId: string) => {
    await ResumeService.incrementViewCount(resumeId);
    // Here you would typically open the resume in a modal or new page
    toast.info("Resume viewing functionality coming soon!");
  };

  const handleDownloadResume = (resume: Resume) => {
    if (resume.file_url) {
      window.open(resume.file_url, '_blank');
    } else {
      toast.info("Download functionality coming soon!");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Resume Examples</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Discover proven resume examples from successful candidates at top companies. 
            Filter by company, role, industry, and experience level to find the perfect template for your career.
          </p>
        </div>

        {/* Search and Filters */}
        <SearchFiltersComponent 
          onFiltersChange={setFilters}
          className="mb-8"
        />

        {/* Results */}
        <div className="mb-6 flex justify-between items-center">
          <div className="text-gray-600">
            {loading ? "Loading..." : `${resumes.length} resume${resumes.length !== 1 ? 's' : ''} found`}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Sort by: Most Recent
            </Button>
          </div>
        </div>

        {/* Resume Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search filters or search terms to find more results.
            </p>
            <Button onClick={() => setFilters({})}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card key={resume.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {resume.title}
                    </CardTitle>
                    {resume.is_featured && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    {resume.company} • {resume.role}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {resume.industry}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {resume.experience_level}
                      </Badge>
                    </div>
                    
                    {resume.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {resume.description}
                      </p>
                    )}

                    {resume.tags && resume.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {resume.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {resume.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{resume.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <Eye className="w-3 h-3 mr-1" />
                        {resume.view_count} views
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(resume.created_at)}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewResume(resume.id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownloadResume(resume)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More */}
        {resumes.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load more resumes
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Resumes;