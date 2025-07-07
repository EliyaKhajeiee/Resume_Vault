/*
  # Add sample resume data

  1. Sample Data
    - Add sample resumes with proper metadata
    - Include various companies, roles, and industries
    - Set up proper tags and descriptions

  2. Data Structure
    - Company: Google, Meta, Apple, Microsoft, Amazon, Netflix, etc.
    - Role: Software Engineer, Product Manager, Data Scientist, etc.
    - Industry: Technology, Finance, Consulting, etc.
    - Experience Level: Entry-level, Mid-level, Senior, Staff+
*/

-- Insert sample resume data
INSERT INTO resumes (title, company, role, industry, experience_level, description, tags, is_featured) VALUES
  ('Senior Software Engineer Resume - Google', 'Google', 'Software Engineer', 'Technology', 'Senior', 'Proven resume that landed a senior SWE role at Google. Highlights distributed systems experience and leadership skills.', ARRAY['python', 'java', 'distributed-systems', 'leadership'], true),
  
  ('Product Manager Resume - Meta', 'Meta', 'Product Manager', 'Technology', 'Mid-level', 'Successful PM resume for Meta focusing on user growth and data-driven decision making.', ARRAY['product-strategy', 'analytics', 'user-growth', 'sql'], true),
  
  ('Data Scientist Resume - Netflix', 'Netflix', 'Data Scientist', 'Technology', 'Mid-level', 'Data science resume that secured a role at Netflix. Emphasizes machine learning and recommendation systems.', ARRAY['machine-learning', 'python', 'sql', 'recommendation-systems'], false),
  
  ('Software Engineer Resume - Apple', 'Apple', 'Software Engineer', 'Technology', 'Mid-level', 'iOS focused software engineer resume for Apple. Highlights mobile development and Swift expertise.', ARRAY['swift', 'ios', 'mobile-development', 'objective-c'], true),
  
  ('Engineering Manager Resume - Microsoft', 'Microsoft', 'Engineering Manager', 'Technology', 'Senior', 'Engineering leadership resume for Microsoft Azure team. Shows progression from IC to management.', ARRAY['leadership', 'azure', 'team-management', 'cloud'], false),
  
  ('Data Engineer Resume - Amazon', 'Amazon', 'Data Engineer', 'Technology', 'Mid-level', 'Big data focused resume for Amazon. Emphasizes AWS services and large-scale data processing.', ARRAY['aws', 'spark', 'kafka', 'big-data'], false),
  
  ('ML Engineer Resume - Tesla', 'Tesla', 'ML Engineer', 'Automotive', 'Senior', 'Machine learning engineer resume for Tesla Autopilot team. Focuses on computer vision and autonomous systems.', ARRAY['computer-vision', 'pytorch', 'autonomous-systems', 'python'], true),
  
  ('Consultant Resume - McKinsey', 'McKinsey & Company', 'Management Consultant', 'Consulting', 'Mid-level', 'Strategy consulting resume for McKinsey. Highlights case study experience and client impact.', ARRAY['strategy', 'case-studies', 'client-management', 'analytics'], false),
  
  ('Investment Banking Resume - Goldman Sachs', 'Goldman Sachs', 'Investment Banking Analyst', 'Finance', 'Entry-level', 'IB analyst resume for Goldman Sachs. Shows strong financial modeling and deal experience.', ARRAY['financial-modeling', 'valuation', 'excel', 'powerpoint'], false),
  
  ('TPM Resume - Stripe', 'Stripe', 'Technical Program Manager', 'Technology', 'Senior', 'Technical program manager resume for Stripe payments infrastructure. Shows cross-functional leadership.', ARRAY['program-management', 'payments', 'cross-functional', 'agile'], false),
  
  ('Product Designer Resume - Airbnb', 'Airbnb', 'Product Designer', 'Technology', 'Mid-level', 'UX/UI design resume for Airbnb. Emphasizes user research and design systems experience.', ARRAY['ux-design', 'user-research', 'figma', 'design-systems'], false),
  
  ('DevOps Engineer Resume - Uber', 'Uber', 'DevOps Engineer', 'Technology', 'Mid-level', 'Site reliability and DevOps resume for Uber. Focuses on infrastructure automation and monitoring.', ARRAY['kubernetes', 'terraform', 'monitoring', 'ci-cd'], false),
  
  ('Quantitative Analyst Resume - Two Sigma', 'Two Sigma', 'Quantitative Analyst', 'Finance', 'Mid-level', 'Quant resume for hedge fund. Highlights mathematical modeling and algorithmic trading experience.', ARRAY['quantitative-analysis', 'python', 'statistics', 'trading'], false),
  
  ('Security Engineer Resume - Palantir', 'Palantir', 'Security Engineer', 'Technology', 'Senior', 'Cybersecurity engineer resume for Palantir. Shows expertise in threat detection and security architecture.', ARRAY['cybersecurity', 'threat-detection', 'security-architecture', 'incident-response'], false),
  
  ('Research Scientist Resume - OpenAI', 'OpenAI', 'Research Scientist', 'Technology', 'Senior', 'AI research scientist resume for OpenAI. Emphasizes publications and cutting-edge ML research.', ARRAY['ai-research', 'deep-learning', 'publications', 'pytorch'], true);

-- Add some view counts to make it realistic
UPDATE resumes SET view_count = floor(random() * 1000 + 100);

-- Update some resumes to have higher view counts for featured ones
UPDATE resumes SET view_count = floor(random() * 2000 + 500) WHERE is_featured = true;