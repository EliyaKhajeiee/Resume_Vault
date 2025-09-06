import { supabase } from '@/lib/supabase'
import type { Resume } from '@/lib/supabase'

export interface SearchFilters {
  company?: string
  role?: string
  industry?: string
  experienceLevel?: string
  searchQuery?: string
  featured?: boolean
}

export interface AddResumeData {
  title: string
  company: string
  role: string
  industry: string
  experience_level: string
  description?: string
  tags: string[]
  is_featured: boolean
  file_url?: string
}

export class ResumeService {
  /**
   * Upload file to Supabase Storage
   */
  static async uploadResumeFile(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      console.log('Starting file upload:', file.name, file.type, file.size);
      
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        return { 
          success: false, 
          error: 'Invalid file type. Please upload PDF, DOC, DOCX, or TXT files only.' 
        };
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return { 
          success: false, 
          error: 'File size too large. Please upload files smaller than 10MB.' 
        };
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      console.log('Uploading file with name:', fileName);

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading file:', error);
        // Handle specific error cases
        if (error.message.includes('Bucket not found') || error.message.includes('bucket')) {
          return { success: false, error: 'Storage not properly configured. Please run the database migrations first.' };
        }
        return { success: false, error: `Upload failed: ${error.message}` };
      }

      console.log('File uploaded successfully');

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      console.log('Public URL:', publicUrl);

      return { success: true, url: publicUrl };
    } catch (error) {
      console.error('Unexpected error uploading file:', error);
      return { success: false, error: `An unexpected error occurred during upload: ${error}` };
    }
  }

  /**
   * Validate URL format
   */
  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Search resumes with filters
   */
  static async searchResumes(filters: SearchFilters = {}): Promise<{ data: Resume[] | null; error?: string }> {
    try {
      let query = supabase
        .from('resumes')
        .select('*')
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.company) {
        query = query.ilike('company', `%${filters.company}%`)
      }
      if (filters.role) {
        query = query.ilike('role', `%${filters.role}%`)
      }
      if (filters.industry) {
        query = query.ilike('industry', `%${filters.industry}%`)
      }
      if (filters.experienceLevel) {
        query = query.eq('experience_level', filters.experienceLevel)
      }
      if (filters.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%,company.ilike.%${filters.searchQuery}%,role.ilike.%${filters.searchQuery}%`)
      }
      if (filters.featured !== undefined) {
        query = query.eq('is_featured', filters.featured)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error searching resumes:', error)
        return { data: null, error: 'Failed to search resumes' }
      }

      return { data }
    } catch (error) {
      console.error('Unexpected error searching resumes:', error)
      return { data: null, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Add a new resume with file upload support
   */
  static async addResume(resumeData: AddResumeData, file?: File): Promise<{ success: boolean; data?: Resume; error?: string }> {
    try {
      let fileUrl = resumeData.file_url;

      // Handle file upload if provided
      if (file) {
        console.log('Processing file upload for resume...');
        const uploadResult = await this.uploadResumeFile(file);
        if (!uploadResult.success) {
          return { success: false, error: uploadResult.error };
        }
        fileUrl = uploadResult.url;
      }

      // Validate URL if provided as string
      if (fileUrl && !file && !this.validateUrl(fileUrl)) {
        return { success: false, error: 'Invalid URL format. Please provide a valid URL.' };
      }

      // Validate required fields
      if (!resumeData.title?.trim()) {
        return { success: false, error: 'Title is required' };
      }
      if (!resumeData.company?.trim()) {
        return { success: false, error: 'Company is required' };
      }
      if (!resumeData.role?.trim()) {
        return { success: false, error: 'Role is required' };
      }
      if (!resumeData.industry?.trim()) {
        return { success: false, error: 'Industry is required' };
      }

      const { data, error } = await supabase
        .from('resumes')
        .insert([{
          title: resumeData.title.trim(),
          company: resumeData.company.trim(),
          role: resumeData.role.trim(),
          industry: resumeData.industry.trim(),
          experience_level: resumeData.experience_level,
          description: resumeData.description?.trim() || null,
          tags: resumeData.tags || [],
          is_featured: resumeData.is_featured || false,
          file_url: fileUrl || null,
          view_count: 0
        }])
        .select()
        .single()

      if (error) {
        console.error('Error adding resume:', error)
        return { success: false, error: 'Failed to add resume. Please check all required fields.' }
      }

      console.log('Resume added successfully:', data)
      return { success: true, data }
    } catch (error) {
      console.error('Unexpected error adding resume:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Delete a resume and its associated file
   */
  static async deleteResume(resumeId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // First get the resume to check if it has a file
      const { data: resume } = await supabase
        .from('resumes')
        .select('file_url')
        .eq('id', resumeId)
        .single();

      // Delete the file from storage if it exists and was uploaded to our storage
      if (resume?.file_url && resume.file_url.includes('supabase')) {
        const fileName = resume.file_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('resumes')
            .remove([fileName]);
        }
      }

      // Delete the resume record
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId)

      if (error) {
        console.error('Error deleting resume:', error)
        return { success: false, error: 'Failed to delete resume' }
      }

      return { success: true }
    } catch (error) {
      console.error('Unexpected error deleting resume:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Update a resume
   */
  static async updateResume(resumeId: string, resumeData: Partial<AddResumeData>, file?: File): Promise<{ success: boolean; data?: Resume; error?: string }> {
    try {
      const updateData = { ...resumeData };

      // Handle file upload if provided
      if (file) {
        const uploadResult = await this.uploadResumeFile(file);
        if (!uploadResult.success) {
          return { success: false, error: uploadResult.error };
        }
        updateData.file_url = uploadResult.url;
      }

      // Validate URL if provided as string
      if (updateData.file_url && !file && !this.validateUrl(updateData.file_url)) {
        return { success: false, error: 'Invalid URL format. Please provide a valid URL.' };
      }

      const { data, error } = await supabase
        .from('resumes')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', resumeId)
        .select()
        .single()

      if (error) {
        console.error('Error updating resume:', error)
        return { success: false, error: 'Failed to update resume' }
      }

      console.log('Resume updated successfully:', data)
      return { success: true, data }
    } catch (error) {
      console.error('Unexpected error updating resume:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Get featured resumes
   */
  static async getFeaturedResumes(): Promise<{ data: Resume[] | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('is_featured', true)
        .order('view_count', { ascending: false })
        .limit(6)

      if (error) {
        console.error('Error fetching featured resumes:', error)
        return { data: null, error: 'Failed to fetch featured resumes' }
      }

      return { data }
    } catch (error) {
      console.error('Unexpected error fetching featured resumes:', error)
      return { data: null, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Get unique filter values
   */
  static async getFilterOptions(): Promise<{
    companies: string[]
    roles: string[]
    industries: string[]
    experienceLevels: string[]
  }> {
    try {
      const { data } = await supabase
        .from('resumes')
        .select('company, role, industry, experience_level')

      if (!data) return { companies: [], roles: [], industries: [], experienceLevels: [] }

      const companies = [...new Set(data.map(r => r.company))].filter(Boolean).sort()
      const roles = [...new Set(data.map(r => r.role))].filter(Boolean).sort()
      const industries = [...new Set(data.map(r => r.industry))].filter(Boolean).sort()
      const experienceLevels = [...new Set(data.map(r => r.experience_level))].filter(Boolean).sort()

      return { companies, roles, industries, experienceLevels }
    } catch (error) {
      console.error('Error fetching filter options:', error)
      return { companies: [], roles: [], industries: [], experienceLevels: [] }
    }
  }

  /**
   * Increment view count for a resume
   */
  static async incrementViewCount(resumeId: string): Promise<void> {
    try {
      // First get current view count
      const { data: currentData } = await supabase
        .from('resumes')
        .select('view_count')
        .eq('id', resumeId)
        .single()

      if (currentData) {
        // Increment the view count
        await supabase
          .from('resumes')
          .update({ view_count: (currentData.view_count || 0) + 1 })
          .eq('id', resumeId)
      }
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  /**
   * Get resume by ID
   */
  static async getResumeById(resumeId: string): Promise<{ data: Resume | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', resumeId)
        .single()

      if (error) {
        console.error('Error fetching resume:', error)
        return { data: null, error: 'Failed to fetch resume' }
      }

      return { data }
    } catch (error) {
      console.error('Unexpected error fetching resume:', error)
      return { data: null, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Toggle featured status of a resume
   */
  static async toggleFeatured(resumeId: string, isFeatured: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('resumes')
        .update({ 
          is_featured: isFeatured,
          updated_at: new Date().toISOString()
        })
        .eq('id', resumeId)

      if (error) {
        console.error('Error toggling featured status:', error)
        return { success: false, error: 'Failed to update featured status' }
      }

      return { success: true }
    } catch (error) {
      console.error('Unexpected error toggling featured status:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Get resume statistics
   */
  static async getResumeStats(): Promise<{
    total: number
    featured: number
    totalViews: number
    byCompany: { [key: string]: number }
    byIndustry: { [key: string]: number }
  }> {
    try {
      const { data } = await supabase
        .from('resumes')
        .select('company, industry, is_featured, view_count')

      if (!data) return {
        total: 0,
        featured: 0,
        totalViews: 0,
        byCompany: {},
        byIndustry: {}
      }

      const total = data.length
      const featured = data.filter(r => r.is_featured).length
      const totalViews = data.reduce((sum, r) => sum + (r.view_count || 0), 0)
      
      const byCompany: { [key: string]: number } = {}
      const byIndustry: { [key: string]: number } = {}

      data.forEach(resume => {
        if (resume.company) {
          byCompany[resume.company] = (byCompany[resume.company] || 0) + 1
        }
        if (resume.industry) {
          byIndustry[resume.industry] = (byIndustry[resume.industry] || 0) + 1
        }
      })

      return { total, featured, totalViews, byCompany, byIndustry }
    } catch (error) {
      console.error('Error fetching resume stats:', error)
      return {
        total: 0,
        featured: 0,
        totalViews: 0,
        byCompany: {},
        byIndustry: {}
      }
    }
  }
}