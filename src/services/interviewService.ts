import { supabase } from '@/lib/supabase'

export interface InterviewQuestion {
  id: string
  company: string
  role: string
  type: 'behavioral' | 'technical' | 'case_study'
  question: string
  answer?: string
  tips?: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  priority: 'very_high' | 'high' | 'medium' | 'low'
  tags: string[]
  is_featured: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export interface InterviewFilters {
  company?: string
  role?: string
  type?: string
  difficulty?: string
  searchQuery?: string
  featured?: boolean
}

export interface AddInterviewQuestionData {
  company: string
  role: string
  type: 'behavioral' | 'technical' | 'case_study'
  question: string
  answer?: string
  tips?: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  priority: 'very_high' | 'high' | 'medium' | 'low'
  tags: string[]
  is_featured: boolean
}

export class InterviewService {
  /**
   * Search interview questions with filters
   */
  static async searchQuestions(filters: InterviewFilters = {}): Promise<{ data: InterviewQuestion[] | null; error?: string }> {
    try {
      console.log('🔍 searchQuestions called with filters:', filters);

      let query = supabase
        .from('interview_questions')
        .select('*')
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.company) {
        console.log('🏢 Applying company filter:', filters.company);
        query = query.ilike('company', `%${filters.company}%`)
      }
      if (filters.role) {
        console.log('👷 Applying role filter:', filters.role);
        query = query.ilike('role', `%${filters.role}%`)
      }
      if (filters.type) {
        console.log('📝 Applying type filter:', filters.type);
        query = query.eq('type', filters.type)
      }
      if (filters.difficulty) {
        console.log('⚡ Applying difficulty filter:', filters.difficulty);
        query = query.eq('difficulty', filters.difficulty)
      }
      if (filters.searchQuery) {
        console.log('🔍 Applying search query:', filters.searchQuery);
        query = query.or(`question.ilike.%${filters.searchQuery}%,answer.ilike.%${filters.searchQuery}%,company.ilike.%${filters.searchQuery}%,role.ilike.%${filters.searchQuery}%`)
      }
      if (filters.featured !== undefined) {
        console.log('⭐ Applying featured filter:', filters.featured);
        query = query.eq('is_featured', filters.featured)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error searching interview questions:', error)
        return { data: null, error: 'Failed to search interview questions' }
      }

      console.log(`📊 Query returned ${data?.length || 0} results`);
      return { data }
    } catch (error) {
      console.error('Unexpected error searching interview questions:', error)
      return { data: null, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Get featured interview questions
   */
  static async getFeaturedQuestions(): Promise<{ data: InterviewQuestion[] | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('interview_questions')
        .select('*')
        .eq('is_featured', true)
        .order('view_count', { ascending: false })
        .limit(6)

      if (error) {
        console.error('Error fetching featured questions:', error)
        return { data: null, error: 'Failed to fetch featured questions' }
      }

      return { data }
    } catch (error) {
      console.error('Unexpected error fetching featured questions:', error)
      return { data: null, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Get curated filter values
   */
  static getFilterOptions(): {
    companies: string[]
    roles: string[]
    types: Array<{ value: string; label: string }>
    difficulties: Array<{ value: string; label: string }>
  } {
    // Same companies as resumes
    const techCompanies = [
      'Google', 'Meta', 'Amazon', 'Apple', 'Microsoft', 'Netflix',
      'Tesla', 'NVIDIA', 'OpenAI'
    ]

    const quantCompanies = ['Citadel', 'Jane Street', 'Two Sigma']

    const financeCompanies = [
      'Goldman Sachs', 'JPMorgan', 'Morgan Stanley', 'BlackRock',
      'Evercore'
    ]

    const consultingCompanies = [
      'McKinsey', 'BCG', 'Bain', 'Deloitte'
    ]

    const topCompanies = [
      ...techCompanies,
      ...quantCompanies,
      ...financeCompanies,
      ...consultingCompanies
    ].sort()

    const topRoles = [
      'Software Engineer', 'Product Manager', 'Data Scientist',
      'Machine Learning Engineer', 'Consultant', 'Marketing',
      'Finance', 'Investment Banking'
    ].sort()

    const types = [
      { value: 'behavioral', label: 'Behavioral' },
      { value: 'technical', label: 'Technical' },
      { value: 'case_study', label: 'Case Study' }
    ]

    const difficulties = [
      { value: 'easy', label: 'Easy' },
      { value: 'medium', label: 'Medium' },
      { value: 'hard', label: 'Hard' }
    ]

    return {
      companies: topCompanies,
      roles: topRoles,
      types,
      difficulties
    }
  }

  /**
   * Increment view count for a question
   */
  static async incrementViewCount(questionId: string): Promise<void> {
    try {
      const { data: currentData } = await supabase
        .from('interview_questions')
        .select('view_count')
        .eq('id', questionId)
        .single()

      if (currentData) {
        await supabase
          .from('interview_questions')
          .update({ view_count: (currentData.view_count || 0) + 1 })
          .eq('id', questionId)
      }
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  /**
   * Add a new interview question
   */
  static async addQuestion(questionData: AddInterviewQuestionData): Promise<{ success: boolean; data?: InterviewQuestion; error?: string }> {
    try {
      // Validate required fields
      if (!questionData.company?.trim()) {
        return { success: false, error: 'Company is required' };
      }
      if (!questionData.role?.trim()) {
        return { success: false, error: 'Role is required' };
      }
      if (!questionData.question?.trim()) {
        return { success: false, error: 'Question is required' };
      }

      const { data, error } = await supabase
        .from('interview_questions')
        .insert([{
          company: questionData.company.trim(),
          role: questionData.role.trim(),
          type: questionData.type,
          question: questionData.question.trim(),
          answer: questionData.answer?.trim() || null,
          tips: questionData.tips || [],
          difficulty: questionData.difficulty,
          tags: questionData.tags || [],
          is_featured: questionData.is_featured || false,
          view_count: 0
        }])
        .select()
        .single()

      if (error) {
        console.error('Error adding interview question:', error)
        return { success: false, error: 'Failed to add interview question' }
      }

      console.log('Interview question added successfully:', data)
      return { success: true, data }
    } catch (error) {
      console.error('Unexpected error adding interview question:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Get question by ID
   */
  static async getQuestionById(questionId: string): Promise<{ data: InterviewQuestion | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('interview_questions')
        .select('*')
        .eq('id', questionId)
        .single()

      if (error) {
        console.error('Error fetching question:', error)
        return { data: null, error: 'Failed to fetch question' }
      }

      return { data }
    } catch (error) {
      console.error('Unexpected error fetching question:', error)
      return { data: null, error: 'An unexpected error occurred' }
    }
  }
}
