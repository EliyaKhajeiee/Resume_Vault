-- Create interview_questions table
CREATE TABLE IF NOT EXISTS interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('behavioral', 'technical', 'case_study')),
  question TEXT NOT NULL,
  answer TEXT,
  tips TEXT[],
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  tags TEXT[],
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_interview_questions_company ON interview_questions(company);
CREATE INDEX IF NOT EXISTS idx_interview_questions_role ON interview_questions(role);
CREATE INDEX IF NOT EXISTS idx_interview_questions_type ON interview_questions(type);
CREATE INDEX IF NOT EXISTS idx_interview_questions_featured ON interview_questions(is_featured);

-- Enable Row Level Security
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Everyone can read interview questions
CREATE POLICY "Interview questions are viewable by everyone"
  ON interview_questions FOR SELECT
  USING (true);

-- Only authenticated users can insert (for admin functionality later)
CREATE POLICY "Authenticated users can insert interview questions"
  ON interview_questions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update interview questions"
  ON interview_questions FOR UPDATE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_interview_questions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_interview_questions_updated_at
  BEFORE UPDATE ON interview_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_interview_questions_updated_at();

-- Insert some sample data
INSERT INTO interview_questions (company, role, type, question, answer, tips, difficulty, tags, is_featured) VALUES
  ('Google', 'Software Engineer', 'behavioral', 'Tell me about a time when you had to work with a difficult team member.', 'Use the STAR method: Situation, Task, Action, Result. Focus on how you maintained professionalism and found a collaborative solution.', ARRAY['Use STAR method', 'Focus on positive outcome', 'Show emotional intelligence', 'Demonstrate conflict resolution skills'], 'medium', ARRAY['teamwork', 'conflict resolution', 'communication'], true),

  ('Google', 'Software Engineer', 'technical', 'How would you design a URL shortener like bit.ly?', 'Key components: 1) Hash function for URL to short code mapping, 2) Database to store mappings, 3) Redirect service, 4) Analytics tracking. Consider scalability, collision handling, and custom short URLs.', ARRAY['Discuss database choice (SQL vs NoSQL)', 'Consider caching strategy', 'Address scalability concerns', 'Mention load balancing'], 'hard', ARRAY['system design', 'scalability', 'databases'], true),

  ('McKinsey', 'Consultant', 'case_study', 'A retail client is experiencing declining profits. How would you approach this problem?', 'Framework: 1) Clarify the problem (timeframe, geography, product lines), 2) Structure analysis (Revenue vs Costs), 3) Analyze each component, 4) Develop hypothesis, 5) Recommend solution with implementation plan.', ARRAY['Start with clarifying questions', 'Use structured framework (profitability = revenue - costs)', 'Quantify impact of each factor', 'Prioritize high-impact recommendations'], 'hard', ARRAY['profitability', 'framework', 'business strategy'], true),

  ('Goldman Sachs', 'Investment Banking Analyst', 'technical', 'Walk me through a DCF valuation.', 'DCF (Discounted Cash Flow): 1) Project free cash flows (5-10 years), 2) Calculate terminal value, 3) Determine WACC (discount rate), 4) Discount all cash flows to present value, 5) Sum to get enterprise value, 6) Subtract net debt to get equity value.', ARRAY['Know the formula for FCF', 'Understand WACC components', 'Explain terminal value methods', 'Be comfortable with the math'], 'medium', ARRAY['valuation', 'finance', 'DCF', 'modeling'], true),

  ('Meta', 'Product Manager', 'behavioral', 'How would you prioritize features for Instagram Stories?', 'Framework: 1) Clarify goals (engagement, retention, revenue), 2) Identify user segments, 3) Gather data on user needs, 4) Score features (Impact vs Effort), 5) Consider technical constraints, 6) Create roadmap with rationale.', ARRAY['Align with company goals', 'Use data to support decisions', 'Consider multiple stakeholders', 'Explain trade-offs clearly'], 'medium', ARRAY['product strategy', 'prioritization', 'frameworks'], true),

  ('Amazon', 'Software Engineer', 'behavioral', 'Tell me about a time you failed.', 'Choose a real failure with meaningful lessons. Structure: 1) What was the situation, 2) What went wrong and why, 3) What you learned, 4) How you applied those learnings, 5) Demonstrate growth mindset.', ARRAY['Be genuine and specific', 'Take ownership', 'Focus on learnings', 'Show how you improved'], 'easy', ARRAY['growth mindset', 'self-awareness', 'learning'], false),

  ('Microsoft', 'Software Engineer', 'technical', 'Design a parking lot system.', 'Components: 1) Different vehicle types (car, motorcycle, bus), 2) Different spot sizes, 3) Multiple levels, 4) Entry/exit points, 5) Payment system. Use OOP principles: classes for Vehicle, ParkingSpot, Level, ParkingLot.', ARRAY['Define classes and relationships', 'Consider edge cases', 'Discuss concurrency handling', 'Think about scalability'], 'medium', ARRAY['object-oriented design', 'system design', 'OOP'], false),

  ('BCG', 'Consultant', 'case_study', 'Should our client enter the electric vehicle market?', 'Framework: 1) Market attractiveness (size, growth, competition), 2) Client capabilities (resources, technology, brand), 3) Financial projections (investment needed, potential returns), 4) Risks and mitigation, 5) Recommendation with implementation plan.', ARRAY['Start with market sizing', 'Analyze competitive landscape', 'Assess client strengths/weaknesses', 'Quantify financial impact'], 'hard', ARRAY['market entry', 'strategy', 'frameworks'], false);
