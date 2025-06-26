import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmailService } from "@/services/emailService";
import type { EmailSignup } from "@/lib/supabase";
import { toast } from "sonner";
import { Mail, Users, Calendar, Download } from "lucide-react";

const Admin = () => {
  const [emails, setEmails] = useState<EmailSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadEmails();
    loadEmailCount();
  }, []);

  const loadEmails = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const loadEmailCount = async () => {
    try {
      const result = await EmailService.getEmailCount();
      setTotalCount(result.count);
    } catch (error) {
      console.error("Error loading email count:", error);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Signups Dashboard</h1>
          <p className="text-gray-600">Manage and view all email signups from your landing page</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount}</div>
              <p className="text-xs text-muted-foreground">
                All time signups
              </p>
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
              <p className="text-xs text-muted-foreground">
                Last 7 days
              </p>
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
              <p className="text-xs text-muted-foreground">
                Active subscribers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Email List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Email Signups</CardTitle>
                <CardDescription>
                  All email addresses collected from your landing page
                </CardDescription>
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
                        <Badge 
                          variant={email.status === 'active' ? 'default' : 'destructive'}
                        >
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
      </div>
    </div>
  );
};

export default Admin;