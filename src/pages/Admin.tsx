import { useState, useEffect, useCallback } from "react";
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
import { Mail, Users, Calendar, Download, Plus, Edit, Trash2, FileText, Eye, Star, Search, Filter, Upload, Link as LinkIcon } from "lucide-react";

// Form component outside main component to prevent re-renders
const ResumeFormFields = ({ 
  resumeForm, 
  onSubmit, 
  submitText, 
  uploadMethod,
  setUploadMethod,
  selectedFile,
  handleFileSelect,
  formatFileSize,
  isUploading,
  setIsAddResumeOpen,
  setIsEditResumeOpen,
  setEditingResume,
  resetForm,
  onInputChange
}: {
  resumeForm: {
    title: string;
    company: string;
    role: string;
    industry: string;
    experience_level: string;
    description: string;
    tags: string;
    is_featured: boolean;
  };
  onSubmit: (e: React.FormEvent) => void;
  submitText: string;
  uploadMethod: string;
  setUploadMethod: (method: string) => void;
  selectedFile: File | null;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatFileSize: (bytes?: number) => string;
  isUploading: boolean;
  setIsAddResumeOpen: (open: boolean) => void;
  setIsEditResumeOpen: (open: boolean) => void;
  setEditingResume: (resume: Resume | null) => void;
  resetForm: () => void;
  onInputChange: (field: string, value: string | boolean) => void;
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <Input
            value={resumeForm.title}
            onChange={(e) => onInputChange('title', e.target.value)}
            placeholder="e.g., Senior Software Engineer Resume - Google"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Company *</label>
          <Input
            value={resumeForm.company}
            onChange={(e) => onInputChange('company', e.target.value)}
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
            onChange={(e) => onInputChange('role', e.target.value)}
            placeholder="e.g., Software Engineer"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Industry *</label>
          <Input
            value={resumeForm.industry}
            onChange={(e) => onInputChange('industry', e.target.value)}
            placeholder="e.g., Technology"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Experience Level</label>
        <Select value={resumeForm.experience_level} onValueChange={(value) => onInputChange('experience_level', value)}>
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
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          value={resumeForm.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Brief description of what makes this resume successful..."
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
        <Input
          value={resumeForm.tags}
          onChange={(e) => onInputChange('tags', e.target.value)}
          placeholder="python, machine-learning, leadership"
        />
      </div>

      {/* File Upload Section */}
      <div className="space-y-4 border-t pt-4">
        <label className="block text-sm font-medium mb-2">Resume File</label>
        
        <div className="flex gap-2 mb-4">
          <Button
            type="button"
            variant={uploadMethod === 'url' ? 'default' : 'outline'}
            onClick={() => setUploadMethod('url')}
            size="sm"
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            URL
          </Button>
          <Button
            type="button"
            variant={uploadMethod === 'file' ? 'default' : 'outline'}
            onClick={() => setUploadMethod('file')}
            size="sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
        </div>

        {uploadMethod === 'url' ? (
          <Input
            value={resumeForm.file_url}
            onChange={(e) => onInputChange('file_url', e.target.value)}
            placeholder="https://example.com/resume.pdf"
            type="url"
          />
        ) : (
          <div>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {selectedFile && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </div>
            )}
            <div className="mt-2 text-xs text-gray-500">
              Supported formats: PDF, DOC, DOCX, TXT (max 10MB)
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          checked={resumeForm.is_featured}
          onChange={(e) => onInputChange('is_featured', e.target.checked)}
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
          disabled={isUploading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Processing..." : submitText}
        </Button>
      </div>
    </form>
  );
};

const Admin = () => {
  // Passcode protection
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [showPasscodeError, setShowPasscodeError] = useState(false);

  // Existing state
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
  const [companyFilter, setCompanyFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState<string>("all");
  
  // CSV upload state
  const [isCsvUploadOpen, setIsCsvUploadOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvUploadProgress, setCsvUploadProgress] = useState(0);
  const [isProcessingCsv, setIsProcessingCsv] = useState(false);

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

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [isUploading, setIsUploading] = useState(false);

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

  const loadFilterOptions = () => {
    try {
      const options = ResumeService.getFilterOptions();
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

    if (companyFilter && companyFilter !== "all") {
      filtered = filtered.filter(resume => resume.company === companyFilter);
    }

    if (industryFilter && industryFilter !== "all") {
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
    setSelectedFile(null);
    setUploadMethod('url');
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setResumeForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Passcode validation
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "1375") {
      setIsAuthenticated(true);
      setShowPasscodeError(false);
    } else {
      setShowPasscodeError(true);
      setPasscode("");
    }
  };

  // Single input change handler
  const handleFormInputChange = useCallback((field: string, value: string | boolean) => {
    setResumeForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // CSV upload functions
  const handleCsvFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const parseCsvFile = (csvText: string): Record<string, string>[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length >= headers.length) {
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        data.push(row);
      }
    }

    return data;
  };

  const processCsvUpload = async () => {
    if (!csvFile) return;

    setIsProcessingCsv(true);
    setCsvUploadProgress(0);

    try {
      const csvText = await csvFile.text();
      const csvData = parseCsvFile(csvText);
      
      if (csvData.length === 0) {
        toast.error('No valid data found in CSV file');
        return;
      }

      console.log('CSV Data:', csvData);
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < csvData.length; i++) {
        const row = csvData[i];
        
        try {
          // Map CSV columns to resume fields
          const resumeData = {
            title: row.title || row.Title || '',
            company: row.company || row.Company || '',
            role: row.role || row.Role || '',
            industry: row.industry || row.Industry || '',
            experience_level: row.experience_level || row.Experience_Level || row['Experience Level'] || 'Mid-level',
            description: row.description || row.Description || '',
            tags: row.tags ? row.tags.split(';').map((t: string) => t.trim()).filter((t: string) => t) : [],
            is_featured: row.is_featured === 'true' || row.Is_Featured === 'true' || row['Is Featured'] === 'true' || false,
            file_url: row.file_url || row.File_URL || row['File URL'] || ''
          };

          // Validate required fields
          if (!resumeData.title || !resumeData.company || !resumeData.role || !resumeData.industry) {
            console.warn(`Skipping row ${i + 1}: Missing required fields`);
            errorCount++;
            continue;
          }

          const result = await ResumeService.addResume(resumeData);
          
          if (result.success) {
            successCount++;
          } else {
            console.error(`Error adding resume ${i + 1}:`, result.error);
            errorCount++;
          }
        } catch (error) {
          console.error(`Error processing row ${i + 1}:`, error);
          errorCount++;
        }

        // Update progress
        setCsvUploadProgress(Math.round(((i + 1) / csvData.length) * 100));
      }

      toast.success(`CSV Upload Complete! ${successCount} added, ${errorCount} errors`);
      
      // Refresh the resumes list
      loadResumes();
      loadFilterOptions();
      
      // Close dialog and reset
      setIsCsvUploadOpen(false);
      setCsvFile(null);
      setCsvUploadProgress(0);

    } catch (error) {
      console.error('CSV processing error:', error);
      toast.error('Failed to process CSV file');
    } finally {
      setIsProcessingCsv(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload PDF, DOC, DOCX, or TXT files only.');
        return;
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error('File size too large. Please upload files smaller than 10MB.');
        return;
      }

      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const handleAddResume = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      console.log('Starting resume add process...');
      console.log('Form data:', resumeForm);
      console.log('Selected file:', selectedFile);
      console.log('Upload method:', uploadMethod);

      const tagsArray = resumeForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const result = await ResumeService.addResume({
        ...resumeForm,
        tags: tagsArray
      }, uploadMethod === 'file' ? selectedFile || undefined : undefined);

      if (result.success) {
        toast.success("Resume added successfully!");
        setIsAddResumeOpen(false);
        resetForm();
        loadResumes();
        loadFilterOptions();
      } else {
        console.error('Add resume failed:', result.error);
        toast.error(result.error || "Failed to add resume");
      }
    } catch (error) {
      console.error("Error adding resume:", error);
      toast.error("Failed to add resume");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResume) return;

    setIsUploading(true);

    try {
      const tagsArray = resumeForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const result = await ResumeService.updateResume(editingResume.id, {
        ...resumeForm,
        tags: tagsArray
      }, uploadMethod === 'file' ? selectedFile || undefined : undefined);

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
    } finally {
      setIsUploading(false);
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
    setUploadMethod('url');
    setSelectedFile(null);
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
    setCompanyFilter("all");
    setIndustryFilter("all");
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

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };


  // Show passcode screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Admin Access</CardTitle>
              <CardDescription className="text-center">
                Enter the passcode to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasscodeSubmit} className="space-y-4">
                <div>
                  <Input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter passcode"
                    className={showPasscodeError ? "border-red-500" : ""}
                  />
                  {showPasscodeError && (
                    <p className="text-red-500 text-sm mt-1">Invalid passcode</p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Access Admin
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                      <SelectItem value="all">All Companies</SelectItem>
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
                      <SelectItem value="all">All Industries</SelectItem>
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
                    <Dialog open={isCsvUploadOpen} onOpenChange={setIsCsvUploadOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          CSV Upload
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Mass Upload Resumes</DialogTitle>
                          <DialogDescription>
                            Upload a CSV file with resume data. Required columns: title, company, role, industry.
                            Optional: description, tags (semicolon-separated), experience_level, is_featured, file_url
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">CSV File</label>
                            <input
                              type="file"
                              accept=".csv"
                              onChange={handleCsvFileSelect}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {csvFile && (
                              <div className="mt-2 text-sm text-green-600">
                                Selected: {csvFile.name}
                              </div>
                            )}
                          </div>
                          
                          {isProcessingCsv && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Processing...</span>
                                <span>{csvUploadProgress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${csvUploadProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setIsCsvUploadOpen(false);
                                setCsvFile(null);
                                setCsvUploadProgress(0);
                              }}
                              disabled={isProcessingCsv}
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={processCsvUpload}
                              disabled={!csvFile || isProcessingCsv}
                            >
                              {isProcessingCsv ? "Processing..." : "Upload CSV"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
                            Add a new resume example to your database. You can either provide a URL or upload a file.
                          </DialogDescription>
                        </DialogHeader>
                        <ResumeFormFields 
                          resumeForm={resumeForm}
                          onSubmit={handleAddResume} 
                          submitText="Add Resume"
                          uploadMethod={uploadMethod}
                          setUploadMethod={setUploadMethod}
                          selectedFile={selectedFile}
                          handleFileSelect={handleFileSelect}
                          formatFileSize={formatFileSize}
                          isUploading={isUploading}
                          setIsAddResumeOpen={setIsAddResumeOpen}
                          setIsEditResumeOpen={setIsEditResumeOpen}
                          setEditingResume={setEditingResume}
                          resetForm={resetForm}
                          onInputChange={handleFormInputChange}
                        />
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
                        <TableHead>File</TableHead>
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
                          <TableCell>
                            {resume.file_url ? (
                              <div className="text-xs text-green-600">✓ Available</div>
                            ) : (
                              <div className="text-xs text-gray-400">No file</div>
                            )}
                          </TableCell>
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
                    Update the resume information. You can change the file by uploading a new one or providing a new URL.
                  </DialogDescription>
                </DialogHeader>
                <ResumeFormFields 
                  resumeForm={resumeForm}
                  onSubmit={handleEditResume} 
                  submitText="Update Resume"
                  uploadMethod={uploadMethod}
                  setUploadMethod={setUploadMethod}
                  selectedFile={selectedFile}
                  handleFileSelect={handleFileSelect}
                  formatFileSize={formatFileSize}
                  isUploading={isUploading}
                  setIsAddResumeOpen={setIsAddResumeOpen}
                  setIsEditResumeOpen={setIsEditResumeOpen}
                  setEditingResume={setEditingResume}
                  resetForm={resetForm}
                  onInputChange={handleFormInputChange}
                />
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;