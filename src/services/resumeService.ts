import { supabase } from '@/lib/supabase'
import type { Resume } from '@/lib/supabase'

export interface SearchFilters {
  company?: string
  role?: string
  industry?: string
  experienceLevel?: string
  searchQuery?: string
}

export class ResumeService {
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
        query = query.eq('company', filters.company)
      }
      if (filters.role) {
        query = query.eq('role', filters.role)
      }
      if (filters.industry) {
        query = query.eq('industry', filters.industry)
      }
      if (filters.experienceLevel) {
        query = query.eq('experience_level', filters.experienceLevel)
      }
      if (filters.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`)
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

      const companies = [...new Set(data.map(r => r.company))].sort()
      const roles = [...new Set(data.map(r => r.role))].sort()
      const industries = [...new Set(data.map(r => r.industry))].sort()
      const experienceLevels = [...new Set(data.map(r => r.experience_level))].sort()

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
      await supabase.rpc('increment_view_count', { resume_id: resumeId })
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }
}