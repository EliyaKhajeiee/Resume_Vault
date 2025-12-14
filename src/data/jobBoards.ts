export interface JobBoard {
  id: string
  name: string
  category: string
  description: string
  url: string
  logo?: string
  targetAudience: string
  featured: boolean
  benefits: string[]
}

export const jobBoards: JobBoard[] = [
  // University & Students
  {
    id: 'handshake',
    name: 'Handshake',
    category: 'University',
    description: 'The #1 job platform for college students and recent graduates. Connect with 750,000+ employers actively recruiting on campus.',
    url: 'https://joinhandshake.com',
    targetAudience: 'Students & Recent Graduates',
    featured: true,
    benefits: [
      'Direct access to university recruiting',
      'Internship and entry-level focus',
      'Career fair integration',
      'Alumni network connections'
    ]
  },
  {
    id: 'simplicity',
    name: 'Simplicity',
    category: 'University',
    description: 'University career services platform used by top schools. Access exclusive opportunities from employers recruiting at your school.',
    url: 'https://www.simplicity.com',
    targetAudience: 'College Students',
    featured: false,
    benefits: [
      'School-specific job postings',
      'Career services integration',
      'On-campus recruiting',
      'Exclusive student opportunities'
    ]
  },

  // Tech & Startups
  {
    id: 'linkedin',
    name: 'LinkedIn Jobs',
    category: 'Tech',
    description: 'The world\'s largest professional network with millions of job postings. Leverage your connections and get referred by employees.',
    url: 'https://www.linkedin.com/jobs',
    targetAudience: 'All Professionals',
    featured: true,
    benefits: [
      'Largest professional network',
      'Employee referrals',
      'Company insights',
      'Easy Apply feature'
    ]
  },
  {
    id: 'wellfound',
    name: 'Wellfound (AngelList)',
    category: 'Tech',
    description: 'Premier platform for startup jobs. Browse 130,000+ startup jobs at the world\'s best startups and apply directly to founders.',
    url: 'https://wellfound.com',
    targetAudience: 'Tech & Startup Professionals',
    featured: true,
    benefits: [
      'Direct access to founders',
      'Startup equity information',
      'Remote-friendly positions',
      'High-growth companies'
    ]
  },
  {
    id: 'hired',
    name: 'Hired',
    category: 'Tech',
    description: 'Reverse job marketplace where companies apply to you. Create a profile and receive interview requests from top tech companies.',
    url: 'https://hired.com',
    targetAudience: 'Software Engineers & Tech',
    featured: false,
    benefits: [
      'Companies apply to you',
      'Salary transparency',
      'Dedicated talent advocate',
      'Curated opportunities'
    ]
  },
  {
    id: 'ycombinator',
    name: 'Y Combinator Jobs',
    category: 'Tech',
    description: 'Job board featuring positions at Y Combinator-backed startups. Join some of the world\'s most innovative early-stage companies.',
    url: 'https://www.ycombinator.com/jobs',
    targetAudience: 'Startup Enthusiasts',
    featured: false,
    benefits: [
      'YC-backed companies only',
      'High potential startups',
      'Direct founder contact',
      'Equity opportunities'
    ]
  },

  // Finance & Investment Banking
  {
    id: 'efinancialcareers',
    name: 'eFinancialCareers',
    category: 'Finance',
    description: 'The leading job board for finance and banking professionals. Find investment banking, trading, and finance roles globally.',
    url: 'https://www.efinancialcareers.com',
    targetAudience: 'Finance Professionals',
    featured: true,
    benefits: [
      'Finance-specific roles',
      'Global opportunities',
      'Industry insights',
      'Salary benchmarking'
    ]
  },
  {
    id: 'wallstreetoasis',
    name: 'Wall Street Oasis',
    category: 'Finance',
    description: 'Community-driven platform for finance careers. Access exclusive job postings and connect with finance professionals.',
    url: 'https://www.wallstreetoasis.com/jobs',
    targetAudience: 'Finance & IB Professionals',
    featured: false,
    benefits: [
      'Finance community',
      'Company reviews',
      'Interview guides',
      'Networking forums'
    ]
  },
  {
    id: 'mergersandinquisitions',
    name: 'Mergers & Inquisitions',
    category: 'Finance',
    description: 'Premier resource for investment banking careers. Job board focused on IB, PE, and corporate finance opportunities.',
    url: 'https://www.mergersandinquisitions.com',
    targetAudience: 'Investment Banking Professionals',
    featured: false,
    benefits: [
      'IB-focused opportunities',
      'Career guides',
      'Interview prep resources',
      'Industry insights'
    ]
  },

  // Consulting
  {
    id: 'managementconsulted',
    name: 'Management Consulted',
    category: 'Consulting',
    description: 'The go-to resource for consulting careers. Job board featuring MBB and boutique consulting firm opportunities.',
    url: 'https://managementconsulted.com/consulting-jobs',
    targetAudience: 'Consulting Professionals',
    featured: true,
    benefits: [
      'Consulting-specific roles',
      'MBB opportunities',
      'Case interview prep',
      'Industry insights'
    ]
  },
  {
    id: 'vault',
    name: 'Vault',
    category: 'Consulting',
    description: 'Career intelligence platform with job listings from top consulting firms. Research companies and find the right fit.',
    url: 'https://www.vault.com/industries/consulting',
    targetAudience: 'Consulting & Professional Services',
    featured: false,
    benefits: [
      'Company rankings',
      'Employee reviews',
      'Industry guides',
      'Top firm access'
    ]
  },

  // General Job Boards
  {
    id: 'indeed',
    name: 'Indeed',
    category: 'General',
    description: 'The world\'s #1 job site with millions of listings. Comprehensive search across all industries and experience levels.',
    url: 'https://www.indeed.com',
    targetAudience: 'All Job Seekers',
    featured: false,
    benefits: [
      'Largest job inventory',
      'Salary insights',
      'Company reviews',
      'Resume builder'
    ]
  },
  {
    id: 'glassdoor',
    name: 'Glassdoor',
    category: 'General',
    description: 'Search millions of jobs with insider company reviews, salary data, and interview insights from current employees.',
    url: 'https://www.glassdoor.com',
    targetAudience: 'All Job Seekers',
    featured: false,
    benefits: [
      'Company reviews',
      'Salary transparency',
      'Interview insights',
      'Culture ratings'
    ]
  },

  // Remote Work
  {
    id: 'remote',
    name: 'Remote.co',
    category: 'Remote',
    description: 'Curated remote job listings from companies with strong remote work cultures. Find legitimate work-from-anywhere opportunities.',
    url: 'https://remote.co/remote-jobs',
    targetAudience: 'Remote Workers',
    featured: false,
    benefits: [
      '100% remote positions',
      'Vetted companies',
      'Global opportunities',
      'Remote work resources'
    ]
  },
  {
    id: 'weworkremotely',
    name: 'We Work Remotely',
    category: 'Remote',
    description: 'The largest remote work community with 4.5M+ visitors. Find remote jobs in programming, design, marketing, and more.',
    url: 'https://weworkremotely.com',
    targetAudience: 'Remote Job Seekers',
    featured: true,
    benefits: [
      'Fully remote jobs only',
      'Tech-focused',
      'No spam postings',
      'Large community'
    ]
  },

  // Product & Design
  {
    id: 'productboard',
    name: 'Product Hunt Jobs',
    category: 'Product',
    description: 'Job board from the Product Hunt community. Find product management and growth roles at innovative tech companies.',
    url: 'https://www.producthunt.com/jobs',
    targetAudience: 'Product Managers',
    featured: false,
    benefits: [
      'Product-focused roles',
      'Innovative companies',
      'Community-driven',
      'Startup opportunities'
    ]
  },
  {
    id: 'dribbble',
    name: 'Dribbble Jobs',
    category: 'Design',
    description: 'Premium design job board from Dribbble. Connect with top companies looking for talented designers and creatives.',
    url: 'https://dribbble.com/jobs',
    targetAudience: 'Designers & Creatives',
    featured: false,
    benefits: [
      'Design-specific roles',
      'Portfolio integration',
      'Creative companies',
      'Freelance opportunities'
    ]
  },

  // Data & AI
  {
    id: 'kaggle',
    name: 'Kaggle Jobs',
    category: 'Data Science',
    description: 'Data science job board from Google\'s Kaggle platform. Find ML, AI, and data science roles at leading tech companies.',
    url: 'https://www.kaggle.com/jobs',
    targetAudience: 'Data Scientists & ML Engineers',
    featured: false,
    benefits: [
      'Data science focus',
      'ML/AI opportunities',
      'Community connections',
      'Competition winners'
    ]
  }
];

export const categories = [
  'All',
  'University',
  'Tech',
  'Finance',
  'Consulting',
  'General',
  'Remote',
  'Product',
  'Design',
  'Data Science'
];
