import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmailService } from "@/services/emailService";
import { ResumeService, type SearchFilters } from "@/services/resumeService";
import type { EmailSignup, Resume } from "@/lib/supabase";
import { toast } from "sonner";
import { Mail, Users, Calendar, Download, Plus, Edit, Trash2, FileText, Eye, Star, Search, Filter } from "lucide-react";

const Admin = () => {
  const [emails, setEmails] = useState<EmailSignup[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [filteredResumes, setFilteredResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEmailCount, setTotalEmailCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'emails' | 'resumes'>('resumes');
  const [isAddResumeOpen, setIsAddResumeOpen] = useState(false);
  const [isEditResumeOpen, setIsEditResumeOpen] = useState(false);
  const [editingResume, setEditingResume] = useState<Resume | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState<string>("all");

  // Form state for adding/editing resumes
  const [resumeForm, setResumeForm] = useState({
    title: '',
    company: '',
    role: '',
    industry: '',
    experience_level: 'Mid-level',
    description: '',
    tags: '',
    is_featured: false,
    file_url: ''
  });

  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    companies: [] as string[],
    industries: [] as string[]
  });

  useEffect(() => {
    if (activeTab === 'emails') {
      loadEmails();
      loadEmailCount();
    } else {
      loadResumes();
      loadFilterOptions();
    }
  }, [activeTab]);

  useEffect(() => {
    filterResumes();
  }, [resumes, searchQuery, companyFilter, industryFilter, featuredFilter]);

  const loadEmails = async () => {
    try {
      const result = await EmailService.getAllEmails();
      if (result.data) {
        setEmails(result.data);
      } else {
        toast.error(result.error || "Failed to load emails");
      }
    } catch (error) {
      console.error("Error loading emails:", error);
      toast.error("Failed to load emails");
    }
  };

  const loadEmailCount = async () => {
    try {
      const result = await EmailService.getEmailCount();
      setTotalEmailCount(result.count);
    } catch (error) {
      console.error("Error loading email count:", error);
    }
  };

  const loadResumes = async () => {
    setLoading(true);
    try {
      const result = await ResumeService.searchResumes();
      if (result.data) {
        setResumes(result.data);
      } else {
        toast.error(result.error || "Failed to load resumes");
      }
    } catch (error) {
      console.error("Error loading resumes:", error);
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const loadFilterOptions = async () => {
    try {
      const options = await ResumeService.getFilterOptions();
      setFilterOptions({
        companies: options.companies,
        industries: options.industries
      });
    } catch (error) {
      console.error("Error loading filter options:", error);
    }
  };

  const filterResumes = () => {
    let filtered = [...resumes];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resume => 
        resume.title.toLowerCase().includes(query) ||
        resume.company.toLowerCase().includes(query) ||
        resume.role.toLowerCase().includes(query) ||
        (resume.description && resume.description.toLowerCase().includes(query))
      );
    }

    if (companyFilter) {
      filtered = filtered.filter(resume => resume.company === companyFilter);
    }

    if (industryFilter) {
      filtered = filtered.filter(resume => resume.industry === industryFilter);
    }

    if (featuredFilter === "featured") {
      filtered = filtered.filter(resume => resume.is_featured);
    } else if (featuredFilter === "not-featured") {
      filtered = filtered.filter(resume => !resume.is_featured);
    }

    setFilteredResumes(filtered);
  };

  const resetForm = () => {
    setResumeForm({
      title: '',
      company: '',
      role: '',
      industry: '',
      experience_level: 'Mid-level',
      description: '',
      tags: '',
      is_featured: false,
      file_url: ''
    });
  };

  const handleAddResume = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tagsArray = resumeForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const result = await ResumeService.addResume({
        ...resumeForm,
        tags: tagsArray
      });

      if (result.success) {
        toast.success("Resume added successfully!");
        setIsAddResumeOpen(false);
        resetForm();
        loadResumes();
        loadFilterOptions();
      } else {
        toast.error(result.error || "Failed to add resume");
      }
    } catch (error) {
      console.error("Error adding resume:", error);
      toast.error("Failed to add resume");
    }
  };

  const handleEditResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResume) return;

    try {
      const tagsArray = resumeForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const result = await ResumeService.updateResume(editingResume.id, {
        ...resumeForm,
        tags: tagsArray
      });

      if (result.success) {
        toast.success("Resume updated successfully!");
        setIsEditResumeOpen(false);
        setEditingResume(null);
        resetForm();
        loadResumes();
        loadFilterOptions();
      } else {
        toast.error(result.error || "Failed to update resume");
      }
    } catch (error) {
      console.error("Error updating resume:", error);
      toast.error("Failed to update resume");
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    
    try {
      const result = await ResumeService.deleteResume(resumeId);
      if (result.success) {
        toast.success("Resume deleted successfully!");
        loadResumes();
        loadFilterOptions();
      } else {
        toast.error(result.error || "Failed to delete resume");
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume");
    }
  };

  const handleToggleFeatured = async (resumeId: string, currentFeatured: boolean) => {
    try {
      const result = await ResumeService.toggleFeatured(resumeId, !currentFeatured);
      if (result.success) {
        toast.success(`Resume ${!currentFeatured ? 'featured' : 'unfeatured'} successfully!`);
        loadResumes();
      } else {
        toast.error(result.error || "Failed to update featured status");
      }
    } catch (error) {
      console.error("Error toggling featured status:", error);
      toast.error("Failed to update featured status");
    }
  };

  const openEditDialog = (resume: Resume) => {
    setEditingResume(resume);
    setResumeForm({
      title: resume.title,
      company: resume.company,
      role: resume.role,
      industry: resume.industry,
      experience_level: resume.experience_level,
      description: resume.description || '',
      tags: resume.tags ? resume.tags.join(', ') : '',
      is_featured: resume.is_featured,
      file_url: resume.file_url || ''
    });
    setIsEditResumeOpen(true);
  };

  const exportEmails = () => {
    const csvContent = [
      ['Email', 'Source', 'Status', 'Created At'],
      ...emails.map(email => [
        email.email,
        email.source,
        email.status,
        new Date(email.created_at).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-signups-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success("Emails exported successfully!");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompanyFilter("");
    setIndustryFilter("");
    setFeaturedFilter("all");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ResumeFormFields = ({ onSubmit, submitText }: { onSubmit: (e: React.FormEvent) => void; submitText: string }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <Input
            value={resumeForm.title}
            onChange={(e) => setResumeForm({...resumeForm, title: e.target.value})}
            placeholder="e.g., Senior Software Engineer Resume - Google"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Company *</label>
          <Input
            value={resumeForm.company}
            onChange={(e) => setResumeForm({...resumeForm, company: e.target.value})}
            placeholder="e.g., Google"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Role *</label>
          <Input
            value={resumeForm.role}
            onChange={(e) => setResumeForm({...resumeForm, role: e.target.value})}
            placeholder="e.g., Software Engineer"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Industry *</label>
          <Input
            value={resumeForm.industry}
            onChange={(e) => setResumeForm({...resumeForm, industry: e.target.value})}
            placeholder="e.g., Technology"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Experience Level</label>
          <Select value={resumeForm.experience_level} onValueChange={(value) => setResumeForm({...resumeForm, experience_level: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Entry-level">Entry-level</SelectItem>
              <SelectItem value="Mid-level">Mid-level</SelectItem>
              <SelectItem value="Senior">Senior</SelectItem>
              <SelectItem value="Staff+">Staff+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">File URL (optional)</label>
          <Input
            value={resumeForm.file_url}
            onChange={(e) => setResumeForm({...resumeForm, file_url: e.target.value})}
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          value={resumeForm.description}
          onChange={(e) => setResumeForm({...resumeForm, description: e.target.value})}
          placeholder="Brief description of what makes this resume successful..."
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
        <Input
          value={resumeForm.tags}
          onChange={(e) => setResumeForm({...resumeForm, tags: e.target.value})}
          placeholder="python, machine-learning, leadership"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          checked={resumeForm.is_featured}
          onChange={(e) => setResumeForm({...resumeForm, is_featured: e.target.checked})}
        />
        <label htmlFor="featured" className="text-sm font-medium">
          Featured resume
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            setIsAddResumeOpen(false);
            setIsEditResumeOpen(false);
            setEditingResume(null);
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button type="submit">{submitText}</Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage email signups and resume database</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8">
          <Button
            variant={activeTab === 'emails' ? 'default' : 'outline'}
            onClick={() => setActiveTab('emails')}
            className="flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Email Signups
          </Button>
          <Button
            variant={activeTab === 'resumes' ? 'default' : 'outline'}
            onClick={() => setActiveTab('resumes')}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Resume Database
          </Button>
        </div>

        {activeTab === 'emails' && (
          <>
            {/* Email Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalEmailCount}</div>
                  <p className="text-xs text-muted-foreground">All time signups</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Signups</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {emails.filter(email => {
                      const emailDate = new Date(email.created_at);
                      const today = new Date();
                      const diffTime = Math.abs(today.getTime() - emailDate.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays <= 7;
                    }).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Last 7 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Status</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {emails.filter(email => email.status === 'active').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Active subscribers</p>
                </CardContent>
              </Card>
            </div>

            {/* Email List */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Email Signups</CardTitle>
                    <CardDescription>All email addresses collected from your landing page</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={loadEmails} variant="outline" disabled={loading}>
                      {loading ? "Loading..." : "Refresh"}
                    </Button>
                    <Button onClick={exportEmails} disabled={emails.length === 0}>
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading emails...</div>
                ) : emails.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No email signups yet. Share your landing page to start collecting emails!
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {emails.map((email) => (
                        <TableRow key={email.id}>
                          <TableCell className="font-medium">{email.email}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{email.source}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={email.status === 'active' ? 'default' : 'destructive'}>
                              {email.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(email.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'resumes' && (
          <>
            {/* Resume Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{resumes.length}</div>
                  <p className="text-xs text-muted-foreground">In database</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Featured</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {resumes.filter(resume => resume.is_featured).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Featured resumes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {resumes.reduce((sum, resume) => sum + resume.view_count, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">All time views</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Filtered Results</CardTitle>
                  <Filter className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{filteredResumes.length}</div>
                  <p className="text-xs text-muted-foreground">Current view</p>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Search & Filter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search resumes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={companyFilter} onValueChange={setCompanyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Companies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Companies</SelectItem>
                      {filterOptions.companies.map(company => (
                        <SelectItem key={company} value={company}>{company}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={industryFilter} onValueChange={setIndustryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Industries</SelectItem>
                      {filterOptions.industries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Featured Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Resumes</SelectItem>
                      <SelectItem value="featured">Featured Only</SelectItem>
                      <SelectItem value="not-featured">Not Featured</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Resume Management */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Resume Database</CardTitle>
                    <CardDescription>
                      Showing {filteredResumes.length} of {resumes.length} resumes
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={loadResumes} variant="outline" disabled={loading}>
                      {loading ? "Loading..." : "Refresh"}
                    </Button>
                    <Dialog open={isAddResumeOpen} onOpenChange={setIsAddResumeOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Resume
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add New Resume</DialogTitle>
                          <DialogDescription>
                            Add a new resume example to your database
                          </DialogDescription>
                        </DialogHeader>
                        <ResumeFormFields onSubmit={handleAddResume} submitText="Add Resume" />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading resumes...</div>
                ) : filteredResumes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {resumes.length === 0 
                      ? "No resumes in database yet. Add your first resume to get started!"
                      : "No resumes match your current filters. Try adjusting your search criteria."
                    }
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResumes.map((resume) => (
                        <TableRow key={resume.id}>
                          <TableCell className="font-medium max-w-xs">
                            <div className="truncate" title={resume.title}>
                              {resume.title}
                            </div>
                          </TableCell>
                          <TableCell>{resume.company}</TableCell>
                          <TableCell>{resume.role}</TableCell>
                          <TableCell>{resume.industry}</TableCell>
                          <TableCell>{resume.view_count}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {resume.is_featured && (
                                <Badge variant="default" className="bg-yellow-500">
                                  <Star className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                              <Badge variant="outline">
                                {resume.experience_level}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => openEditDialog(resume)}
                                title="Edit resume"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleToggleFeatured(resume.id, resume.is_featured)}
                                title={resume.is_featured ? "Remove from featured" : "Add to featured"}
                              >
                                <Star className={`w-4 h-4 ${resume.is_featured ? 'fill-current text-yellow-500' : ''}`} />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleDeleteResume(resume.id)}
                                title="Delete resume"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Edit Resume Dialog */}
            <Dialog open={isEditResumeOpen} onOpenChange={setIsEditResumeOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Resume</DialogTitle>
                  <DialogDescription>
                    Update the resume information
                  </DialogDescription>
                </DialogHeader>
                <ResumeFormFields onSubmit={handleEditResume} submitText="Update Resume" />
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;