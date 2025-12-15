import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MessageSquare, Lightbulb, Star, Search, Building2, Briefcase, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompanyLogo from "@/components/CompanyLogo";
import { InterviewService, type InterviewFilters, type InterviewQuestion } from "@/services/interviewService";
import { toast } from "sonner";

const InterviewQuestions = () => {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<InterviewFilters>({});
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    searchQuestions();
  }, [filters]);

  const searchQuestions = async () => {
    setLoading(true);
    try {
      const result = await InterviewService.searchQuestions(filters);
      if (result.data) {
        // Sort by featured first, then by creation date
        const sortedData = [...result.data].sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setQuestions(sortedData);
      } else {
        toast.error(result.error || "Failed to load interview questions");
      }
    } catch (error) {
      console.error("Error searching interview questions:", error);
      toast.error("Failed to load interview questions");
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuestion = (question: InterviewQuestion) => {
    setSelectedQuestion(question);
    setIsViewDialogOpen(true);
    InterviewService.incrementViewCount(question.id);
  };

  const handleFiltersChange = (newFilters: Partial<InterviewFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, searchQuery }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  const filterOptions = InterviewService.getFilterOptions();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'behavioral':
        return <MessageSquare className="h-4 w-4" />;
      case 'technical':
        return <Lightbulb className="h-4 w-4" />;
      case 'case_study':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'behavioral':
        return 'bg-blue-100 text-blue-800';
      case 'technical':
        return 'bg-purple-100 text-purple-800';
      case 'case_study':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white border-b">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Interview Questions
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Real interview questions from top companies. Master behavioral, technical, and case study questions to ace your next interview.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button onClick={handleSearch} size="lg" className="bg-blue-600 hover:bg-blue-700">
                Search
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Company Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Company
                </label>
                <Select value={filters.company || "all"} onValueChange={(value) => handleFiltersChange({ company: value === "all" ? undefined : value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Companies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {filterOptions.companies.map((company) => (
                      <SelectItem key={company} value={company}>{company}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Role Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Role
                </label>
                <Select value={filters.role || "all"} onValueChange={(value) => handleFiltersChange({ role: value === "all" ? undefined : value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {filterOptions.roles.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Type
                </label>
                <Select value={filters.type || "all"} onValueChange={(value) => handleFiltersChange({ type: value === "all" ? undefined : value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {filterOptions.types.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Difficulty
                </label>
                <Select value={filters.difficulty || "all"} onValueChange={(value) => handleFiltersChange({ difficulty: value === "all" ? undefined : value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {filterOptions.difficulties.map((diff) => (
                      <SelectItem key={diff.value} value={diff.value}>{diff.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters */}
            {Object.keys(filters).length > 0 && (
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="container max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No questions found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing <strong>{questions.length}</strong> question{questions.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {questions.map((question) => (
                  <Card
                    key={question.id}
                    className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 hover:border-blue-300"
                    onClick={() => handleViewQuestion(question)}
                  >
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <CompanyLogo company={question.company} size="sm" />
                        {question.is_featured && (
                          <Badge variant="default" className="bg-yellow-500 text-white">
                            <Star className="h-3 w-3 mr-1 fill-white" />
                            Featured
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2">
                        <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
                          {question.company} - {question.role}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getTypeColor(question.type)}>
                            {getTypeIcon(question.type)}
                            <span className="ml-1 capitalize">{question.type.replace('_', ' ')}</span>
                          </Badge>
                          <Badge className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-gray-700 line-clamp-3 mb-4">
                        {question.question}
                      </p>

                      {question.tags && question.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {question.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />

      {/* Question Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedQuestion && (
            <>
              <DialogHeader className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      {selectedQuestion.company} - {selectedQuestion.role}
                    </DialogTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getTypeColor(selectedQuestion.type)}>
                        {getTypeIcon(selectedQuestion.type)}
                        <span className="ml-1 capitalize">{selectedQuestion.type.replace('_', ' ')}</span>
                      </Badge>
                      <Badge className={getDifficultyColor(selectedQuestion.difficulty)}>
                        {selectedQuestion.difficulty}
                      </Badge>
                      {selectedQuestion.is_featured && (
                        <Badge variant="default" className="bg-yellow-500 text-white">
                          <Star className="h-3 w-3 mr-1 fill-white" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CompanyLogo company={selectedQuestion.company} size="md" />
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Question */}
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2 uppercase tracking-wide">Question</h3>
                  <p className="text-lg text-gray-900 font-medium">{selectedQuestion.question}</p>
                </div>

                {/* Answer */}
                {selectedQuestion.answer && (
                  <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
                    <h3 className="text-sm font-semibold text-green-900 mb-3 uppercase tracking-wide">Suggested Answer Approach</h3>
                    <p className="text-gray-800 leading-relaxed whitespace-pre-line">{selectedQuestion.answer}</p>
                  </div>
                )}

                {/* Tips */}
                {selectedQuestion.tips && selectedQuestion.tips.length > 0 && (
                  <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-600">
                    <h3 className="text-sm font-semibold text-yellow-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Pro Tips
                    </h3>
                    <ul className="space-y-2">
                      {selectedQuestion.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-800">
                          <span className="text-yellow-600 font-bold mt-1">•</span>
                          <span className="flex-1">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                {selectedQuestion.tags && selectedQuestion.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Related Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedQuestion.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InterviewQuestions;
