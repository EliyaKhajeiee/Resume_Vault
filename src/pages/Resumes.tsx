import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Download, Star, ExternalLink, Lock, CreditCard, Building2, Briefcase, GraduationCap, Calendar, MapPin, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFiltersComponent from "@/components/SearchFilters";
import CompanyLogo from "@/components/CompanyLogo";
import { ResumeService, type SearchFilters } from "@/services/resumeService";
import type { Resume } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";

const Resumes = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'featured'>('recent');
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  
  const { user, isAuthenticated } = useAuth();
  const { hasActiveSubscription, hasActivePurchase, canAccessResume, canDownloadResume, recordResumeAccess } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Handle URL parameters for filters
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    const companyParam = urlParams.get('company');
    const industryParam = urlParams.get('industry');
    const experienceParam = urlParams.get('experience');

    const urlFilters: SearchFilters = {};
    if (roleParam) urlFilters.role = roleParam;
    if (companyParam) urlFilters.company = companyParam;
    if (industryParam) urlFilters.industry = industryParam;
    if (experienceParam) urlFilters.experienceLevel = experienceParam;

    // Set filters and search will be triggered by the filters useEffect
    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }
    // Note: If no URL params, the filters useEffect will handle the initial search
  }, []);

  useEffect(() => {
    // Only search if we have filters or if this is a subsequent filter change
    searchResumes();
  }, [filters]);

  const searchResumes = async () => {
    setLoading(true);
    try {
      const result = await ResumeService.searchResumes(filters);
      if (result.data) {
        const sortedData = [...result.data];
        
        // Apply sorting
        switch (sortBy) {
          case 'popular':
            sortedData.sort((a, b) => b.view_count - a.view_count);
            break;
          case 'featured':
            sortedData.sort((a, b) => {
              if (a.is_featured && !b.is_featured) return -1;
              if (!a.is_featured && b.is_featured) return 1;
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
            break;
          case 'recent':
          default:
            sortedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            break;
        }
        
        setResumes(sortedData);
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

  const handleViewResume = async (resume: Resume) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to view resumes");
      navigate('/pricing'); // Redirect to pricing/signup
      return;
    }

    console.log('🎯 Checking access - hasActivePurchase:', hasActivePurchase);
    console.log('🎯 Checking access - hasActiveSubscription:', hasActiveSubscription);

    // Check access permissions without consuming any uses
    if (hasActiveSubscription) {
      console.log('✅ SUBSCRIPTION ACCESS - Unlimited access granted');
    } else if (hasActivePurchase) {
      console.log('📦 PURCHASE ACCESS - Paid pack access granted');
    } else {
      // Free user - check if they have access available
      console.log('🆓 FREE USER - Checking access limit...');
      const access = await canAccessResume(resume.id, resume.is_featured);
      console.log('🎯 Access check result:', access);

      if (!access.canAccess) {
        console.log('❌ Access denied with reason:', access.reason);
        console.log('❌ SHOWING UPGRADE DIALOG - This is why you see upgrade message');
        if (access.reason === 'limit_reached') {
          toast.error("🔒 You're out of resumes! Upgrade to Pro for unlimited access to 500+ elite resumes that actually landed jobs!");
        } else {
          toast.error("🚀 Unlock unlimited resume access with Pro - see exactly what gets you hired!");
        }
        setShowUpgradeDialog(true);
        return;
      }
    }

    console.log('✅ Access granted! Opening resume modal...');

    // Open the modal first
    setSelectedResume(resume);
    setIsViewDialogOpen(true);

    // Debug: Force check modal state after React updates
    setTimeout(() => {
      console.log('🔍 Modal Debug - isViewDialogOpen:', true);
      console.log('🔍 Modal Debug - selectedResume:', resume.title);
      console.log('🔍 Modal should be visible now');
    }, 100);

    // IMPORTANT: Only record access AFTER modal opens successfully
    // This ensures the user actually gets to see the resume before consuming their free use
    if (!hasActiveSubscription && !hasActivePurchase) {
      console.log('📝 Recording free user access...');
      recordResumeAccess(resume.id).catch(error => {
        console.log('⚠️ Access recording failed:', error);
      });
    } else if (hasActivePurchase) {
      console.log('📦 Recording purchase pack usage...');
      recordResumeAccess(resume.id).catch(error => {
        console.log('⚠️ Purchase recording failed:', error);
      });
    }

    // Increment view count in background too
    ResumeService.incrementViewCount(resume.id).then(() => {
      console.log('✅ View count incremented in background');
    }).catch(error => {
      console.log('⚠️ Background view count failed:', error);
    });
    
    // Update the view count in the local state
    setResumes(prev => prev.map(r => 
      r.id === resume.id ? { ...r, view_count: r.view_count + 1 } : r
    ));
  };

  const handleDownloadResume = async (resume: Resume) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to download resumes");
      navigate('/pricing');
      return;
    }

    console.log('✅ DOWNLOAD ACCESS GRANTED - No additional checks needed');

    if (resume.file_url) {
      window.open(resume.file_url, '_blank');
      toast.success("Opening resume file...");
    } else {
      toast.info("This resume doesn't have a downloadable file yet.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSortButtonText = () => {
    switch (sortBy) {
      case 'popular': return 'Most Popular';
      case 'featured': return 'Featured First';
      case 'recent':
      default: return 'Most Recent';
    }
  };

  const cycleSortBy = () => {
    const sortOptions: ('recent' | 'popular' | 'featured')[] = ['recent', 'popular', 'featured'];
    const currentIndex = sortOptions.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex]);
    // Trigger a re-search to apply the new sorting
    setTimeout(() => searchResumes(), 0);
  };

  // Note: Sorting is handled within searchResumes() function based on sortBy state
  // No need for a separate useEffect on sortBy since it would cause unnecessary re-searches

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Resume Examples</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover proven resume examples from successful candidates at top companies.
            Filter by company, role, industry, and experience level to find the perfect template for your career.
          </p>
        </div>

        {/* Search and Filters */}
        <SearchFiltersComponent
          onFiltersChange={setFilters}
          initialFilters={filters}
          className="mb-8"
        />

        {/* Results Header */}
        <div className="mb-6 flex justify-between items-center">
          <div className="text-gray-600">
            {loading ? "Loading..." : `${resumes.length} resume${resumes.length !== 1 ? 's' : ''} found`}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={cycleSortBy}>
              Sort by: {getSortButtonText()}
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
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                      {resume.title}
                    </CardTitle>
                    {resume.is_featured && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 flex-shrink-0 ml-2">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm flex items-center gap-2">
                    <CompanyLogo company={resume.company} size="sm" />
                    {resume.company}
                    <span className="text-gray-400">•</span>
                    <Briefcase className="w-3 h-3 text-gray-500" />
                    {resume.role}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {resume.industry}
                      </Badge>
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
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
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(resume.created_at)}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => handleViewResume(resume)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Resume
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
            <Button variant="outline" size="lg" disabled>
              Load more resumes (Coming Soon)
            </Button>
          </div>
        )}
      </div>

      {/* Resume View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedResume?.title}
              {selectedResume?.is_featured && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedResume?.company} • {selectedResume?.role} • {selectedResume?.industry}
            </DialogDescription>
          </DialogHeader>
          
          {selectedResume && (
            <div className="space-y-6">
              {/* Resume Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">Experience Level</h4>
                  <Badge variant="outline">{selectedResume.experience_level}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">Views</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <Eye className="w-4 h-4 mr-1" />
                    {selectedResume.view_count}
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedResume.description && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedResume.description}</p>
                </div>
              )}

              {/* Tags */}
              {selectedResume.tags && selectedResume.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Skills & Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedResume.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                {selectedResume.file_url ? (
                  <Button 
                    onClick={() => handleDownloadResume(selectedResume)}
                    className="flex-1"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Resume
                  </Button>
                ) : (
                  <Button disabled className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    File Not Available
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
              </div>

              {/* Metadata */}
              <div className="text-xs text-gray-500 pt-2 border-t">
                Added on {formatDate(selectedResume.created_at)}
                {selectedResume.updated_at !== selectedResume.created_at && (
                  <> • Updated on {formatDate(selectedResume.updated_at)}</>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-600" />
              You're out of resumes!
            </DialogTitle>
            <DialogDescription>
              Upgrade to Pro for unlimited access to 500+ elite resumes that actually landed jobs!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">With Pro you get:</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Unlimited access to all resumes</li>
                <li>• Download resumes from top companies</li>
                <li>• Advanced search and filters</li>
                <li>• Featured resumes from high earners</li>
                <li>• Cancel anytime</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowUpgradeDialog(false);
                  navigate('/pricing');
                }}
                className="flex-1"
              >
                Upgrade to Pro
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowUpgradeDialog(false)}
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Resumes;