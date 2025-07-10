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
import { ResumeService } from "@/services/resumeService";
import type { EmailSignup, Resume } from "@/lib/supabase";
import { toast } from "sonner";
import { Mail, Users, Calendar, Download, Plus, Edit, Trash2, FileText, Eye } from "lucide-react";

const Admin = () => {
  const [emails, setEmails] = useState<EmailSignup[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEmailCount, setTotalEmailCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'emails' | 'resumes'>('emails');
  const [isAddResumeOpen, setIsAddResumeOpen] = useState(false);

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

  useEffect(() => {
    loadEmails();
    loadEmailCount();
    loadResumes();
  }, []);

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
        loadResumes();
      } else {
        toast.error(result.error || "Failed to add resume");
      }
    } catch (error) {
      console.error("Error adding resume:", error);
      toast.error("Failed to add resume");
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    
    try {
      const result = await ResumeService.deleteResume(resumeId);
      if (result.success) {
        toast.success("Resume deleted successfully!");
        loadResumes();
      } else {
        toast.error(result.error || "Failed to delete resume");
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume");
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  <Eye className="h-4 w-4 text-muted-foreground" />
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
            </div>

            {/* Resume Management */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Resume Database</CardTitle>
                    <CardDescription>Manage your collection of proven resume examples</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={loadResumes} variant="outline" disabled={loading}>
                      {loading ? "Loading..." : "Refresh"}
                    </Button>
                    <Dialog open={isAddResumeOpen} onOpenChange={setIsAddResumeOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Resume
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Add New Resume</DialogTitle>
                          <DialogDescription>
                            Add a new resume example to your database
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddResume} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Title</label>
                              <Input
                                value={resumeForm.title}
                                onChange={(e) => setResumeForm({...resumeForm, title: e.target.value})}
                                placeholder="e.g., Senior Software Engineer Resume - Google"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Company</label>
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
                              <label className="block text-sm font-medium mb-2">Role</label>
                              <Input
                                value={resumeForm.role}
                                onChange={(e) => setResumeForm({...resumeForm, role: e.target.value})}
                                placeholder="e.g., Software Engineer"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Industry</label>
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
                            <Button type="button" variant="outline" onClick={() => setIsAddResumeOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Add Resume</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading resumes...</div>
                ) : resumes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No resumes in database yet. Add your first resume to get started!
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
                        <TableHead>Featured</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resumes.map((resume) => (
                        <TableRow key={resume.id}>
                          <TableCell className="font-medium">{resume.title}</TableCell>
                          <TableCell>{resume.company}</TableCell>
                          <TableCell>{resume.role}</TableCell>
                          <TableCell>{resume.industry}</TableCell>
                          <TableCell>{resume.view_count}</TableCell>
                          <TableCell>
                            {resume.is_featured && <Badge>Featured</Badge>}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleDeleteResume(resume.id)}
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
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;