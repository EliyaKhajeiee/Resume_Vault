import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Lightbulb, Building2, Briefcase, Crown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { InterviewService, type InterviewFilters, type InterviewQuestion } from "@/services/interviewService";
import { StripeService } from "@/services/stripeService";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { AuthDialog } from "@/components/auth/AuthDialog";

const FREE_QUESTIONS_PER_ROLE = 5;

const InterviewQuestions = () => {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<InterviewFilters>({});
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const { hasActiveSubscription } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    searchQuestions();
  }, [filters, hasActiveSubscription]);

  const searchQuestions = async () => {
    setLoading(true);
    try {
      const result = await InterviewService.searchQuestions(filters);
      if (result.data) {
        // Sort by priority (very_high first), then by featured
        const priorityOrder = { very_high: 0, high: 1, medium: 2, low: 3 };
        const sortedData = [...result.data].sort((a, b) => {
          const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
          if (priorityDiff !== 0) return priorityDiff;
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return 0;
        });

        // Limit to 30 questions for non-Pro users
        const limitedData = hasActiveSubscription ? sortedData : sortedData.slice(0, 30);
        setQuestions(limitedData);
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

  const handleViewQuestion = async (question: InterviewQuestion) => {
    // Calculate if this question is locked based on position
    const rolePositions: Record<string, number> = {};
    let questionPosition = 0;

    for (const q of questions) {
      if (!rolePositions[q.role]) {
        rolePositions[q.role] = 0;
      }
      rolePositions[q.role]++;

      if (q.id === question.id) {
        questionPosition = rolePositions[q.role];
        break;
      }
    }

    const isLocked = !hasActiveSubscription && questionPosition > FREE_QUESTIONS_PER_ROLE;

    // If locked, redirect to pricing (or show auth dialog if not authenticated)
    if (isLocked) {
      if (!isAuthenticated) {
        setShowAuthDialog(true);
        return;
      }

      toast.error(
        `This question is locked. Upgrade to Pro for unlimited access to all ${question.role} questions!`,
        { duration: 5000 }
      );
      navigate("/pricing");
      return;
    }

    // Show auth dialog if not authenticated (for unlocked questions)
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    // Pro users get unlimited access
    if (hasActiveSubscription) {
      setSelectedQuestion(question);
      setIsViewDialogOpen(true);
      InterviewService.incrementViewCount(question.id);
      return;
    }

    // Free users can access unlocked questions (first 5 per role)
    try {
      // Record access for tracking purposes
      await StripeService.processInterviewAccess(user!.id, question.id, question.role);

      // Show the question
      setSelectedQuestion(question);
      setIsViewDialogOpen(true);
      InterviewService.incrementViewCount(question.id);
    } catch (error) {
      console.error("Error recording access:", error);
      toast.error("Failed to access question. Please try again.");
    }
  };

  const handleFiltersChange = (newFilters: Partial<InterviewFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const filterOptions = InterviewService.getFilterOptions();

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'very_high':
        return 'Very High';
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return priority;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'very_high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'behavioral':
        return 'Behavioral';
      case 'technical':
        return 'Technical';
      case 'case_study':
        return 'Case Study';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-blue-50 to-white border-b">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Interview Prep
            </h1>
            <p className="text-lg text-gray-600">
              Company-specific interview questions from real candidates. Master behavioral, technical, and case study questions to ace your interviews at top firms.
            </p>
          </div>

          {/* Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Lightbulb className="h-4 w-4" />
                  Question Type
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
            </div>
          </div>
        </div>
      </section>

      {/* Questions List */}
      <section className="py-12">
        <div className="container max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12">
              <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No questions found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              {/* Stats Bar */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600">
                  Showing <strong>{questions.length}</strong> question{questions.length !== 1 ? 's' : ''}
                  {!hasActiveSubscription && (() => {
                    // Count free vs locked questions
                    const rolePositions: Record<string, number> = {};
                    let freeCount = 0;
                    let lockedCount = 0;

                    questions.forEach(q => {
                      if (!rolePositions[q.role]) {
                        rolePositions[q.role] = 0;
                      }
                      rolePositions[q.role]++;

                      if (rolePositions[q.role] <= FREE_QUESTIONS_PER_ROLE) {
                        freeCount++;
                      } else {
                        lockedCount++;
                      }
                    });

                    return (
                      <span className="ml-2 text-sm">
                        ({freeCount} free, {lockedCount} locked <Lock className="inline h-3 w-3" />)
                      </span>
                    );
                  })()}
                </p>
                {!hasActiveSubscription && (
                  <Button
                    onClick={() => navigate("/pricing")}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade for Full Access
                  </Button>
                )}
              </div>

              {/* Questions Table */}
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Question
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Priority
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(() => {
                        // First pass: mark each question as free or locked based on role position
                        const rolePositions: Record<string, number> = {};
                        const questionsWithLockStatus = questions.map((question) => {
                          if (!rolePositions[question.role]) {
                            rolePositions[question.role] = 0;
                          }
                          rolePositions[question.role]++;

                          const positionInRole = rolePositions[question.role];
                          const isLocked = !hasActiveSubscription && positionInRole > FREE_QUESTIONS_PER_ROLE;

                          return { ...question, isLocked, positionInRole };
                        });

                        // Sort: free questions first, then locked questions
                        const sortedQuestions = [...questionsWithLockStatus].sort((a, b) => {
                          if (a.isLocked === b.isLocked) return 0;
                          return a.isLocked ? 1 : -1; // Free (false) comes before locked (true)
                        });

                        // Helper function to truncate locked question text
                        const getTruncatedQuestion = (text: string) => {
                          const words = text.split(' ');
                          if (words.length <= 3) return text + '...';
                          return words.slice(0, 3).join(' ') + '...';
                        };

                        return sortedQuestions.map((question) => {
                          const displayQuestion = question.isLocked
                            ? getTruncatedQuestion(question.question)
                            : question.question;

                          return (
                            <tr
                              key={question.id}
                              onClick={() => handleViewQuestion(question)}
                              className={`${
                                question.isLocked
                                  ? 'cursor-pointer opacity-60 bg-gray-50 hover:bg-gray-100'
                                  : 'cursor-pointer hover:bg-blue-50'
                              } transition-colors`}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  {question.isLocked && (
                                    <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                  )}
                                  <span className={`text-sm ${question.isLocked ? 'text-gray-500' : 'text-gray-900 font-medium'}`}>
                                    {displayQuestion}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700">
                                {question.company}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                  <Badge variant="outline" className="text-xs">
                                    {getTypeLabel(question.type)}
                                  </Badge>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge
                                  className={`text-xs border ${getPriorityColor(question.priority)}`}
                                  variant="outline"
                                >
                                  {getPriorityLabel(question.priority)}
                                </Badge>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Upgrade CTA */}
              {!hasActiveSubscription && (
                <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 text-center">
                  <Crown className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Unlock All Interview Questions</h3>
                  <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                    Free users get 5 questions per role. Upgrade to Pro for unlimited access to {questions.length}+ company-specific interview questions across all roles, complete answers, and pro tips from real candidates who got offers.
                  </p>
                  <Button
                    onClick={() => navigate("/pricing")}
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    Upgrade to Pro
                  </Button>
                </div>
              )}
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
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      {selectedQuestion.company} - {selectedQuestion.role}
                    </DialogTitle>
                    <Badge className={`${getPriorityColor(selectedQuestion.priority)} border`}>
                      {getPriorityLabel(selectedQuestion.priority)}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {getTypeLabel(selectedQuestion.type)}
                  </Badge>
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

      {/* Auth Dialog */}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        defaultTab="signup"
      />
    </div>
  );
};

export default InterviewQuestions;
