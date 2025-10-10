interface Experience {
  title: string;
  company: string;
  dates: string;
  bullets: string[];
}

interface Education {
  degree: string;
  school: string;
  details: string;
  dates: string;
}

export interface ResumeData {
  name: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  summary: string;
  experience: Experience[];
  education: Education;
  skills: {
    technical: string;
    other: string;
  };
}

export const resumeDataByField: Record<string, ResumeData> = {
  "general": {
    name: "Sarah Mitchell",
    location: "New York, NY",
    phone: "(555) 234-5678",
    email: "sarah.mitchell@email.com",
    linkedin: "linkedin.com/in/sarahmitchell",
    summary: "Results-driven professional with 5+ years of experience delivering high-impact solutions across multiple industries. Proven track record of exceeding targets and driving strategic initiatives. Strong analytical and communication skills with experience leading cross-functional teams.",
    experience: [
      {
        title: "Senior Program Manager",
        company: "Tech Solutions Inc.",
        dates: "2021 - Present",
        bullets: [
          "Led cross-functional team of 12 to deliver $3M+ project, achieving 30% efficiency gain",
          "Developed strategic framework that increased client satisfaction scores by 45%",
          "Managed portfolio of 20+ high-value clients, resulting in 98% retention rate",
          "Created data-driven insights that informed C-suite decision-making processes"
        ]
      },
      {
        title: "Program Manager",
        company: "Innovation Corp",
        dates: "2019 - 2021",
        bullets: [
          "Coordinated product launches that generated $5M in first-year revenue",
          "Implemented agile methodologies that reduced project delivery time by 25%",
          "Built stakeholder relationships across 5 departments to ensure alignment"
        ]
      }
    ],
    education: {
      degree: "Bachelor of Science in Business Administration",
      school: "University of California, Berkeley",
      details: "GPA: 3.8/4.0 • Dean's List • Business Analytics Certificate",
      dates: "2015 - 2019"
    },
    skills: {
      technical: "Excel, SQL, Python, Tableau, PowerPoint, Jira, Asana",
      other: "Project Management, Stakeholder Communication, Team Leadership"
    }
  },
  "swe": {
    name: "Alex Chen",
    location: "San Francisco, CA",
    phone: "(555) 987-6543",
    email: "alex.chen@email.com",
    linkedin: "linkedin.com/in/alexchen",
    summary: "Software Engineer with 4+ years of experience building scalable systems at top tech companies. Expertise in full-stack development, distributed systems, and cloud infrastructure. Shipped features used by millions of users at Google, Uber, and Meta.",
    experience: [
      {
        title: "Software Engineer II",
        company: "Google",
        dates: "2022 - Present",
        bullets: [
          "Built real-time data pipeline processing 10M+ events/day using Java and GCP",
          "Reduced API latency by 40% through caching optimization and query improvements",
          "Led design review for critical infrastructure serving 50M+ daily active users",
          "Mentored 3 junior engineers on system design and code quality best practices"
        ]
      },
      {
        title: "Software Engineer",
        company: "Uber",
        dates: "2020 - 2022",
        bullets: [
          "Developed microservices for rider app using Python, React, and Kubernetes",
          "Improved app performance by 35% through frontend optimization and lazy loading",
          "Implemented A/B testing framework that enabled data-driven product decisions",
          "Collaborated with ML team to integrate recommendation engine into main app"
        ]
      }
    ],
    education: {
      degree: "Bachelor of Science in Computer Science",
      school: "Stanford University",
      details: "GPA: 3.9/4.0 • ACM Programming Team • AI/ML Specialization",
      dates: "2016 - 2020"
    },
    skills: {
      technical: "Python, Java, JavaScript, React, Node.js, SQL, AWS, GCP, Kubernetes, Docker",
      other: "System Design, Agile Development, Code Review, Technical Leadership"
    }
  },
  "marketing": {
    name: "Jessica Rodriguez",
    location: "Los Angeles, CA",
    phone: "(555) 456-7890",
    email: "jessica.rodriguez@email.com",
    linkedin: "linkedin.com/in/jessicarodriguez",
    summary: "Creative marketing professional with 6+ years driving growth through data-driven campaigns. Expertise in digital marketing, content strategy, and brand development. Proven ability to scale user acquisition while maintaining strong ROI metrics.",
    experience: [
      {
        title: "Senior Marketing Manager",
        company: "TikTok",
        dates: "2021 - Present",
        bullets: [
          "Launched influencer campaign that reached 50M+ users and drove 200K app installs",
          "Increased organic social engagement by 85% through content optimization strategy",
          "Managed $2M annual marketing budget across paid social, content, and partnerships",
          "Developed brand guidelines adopted across 15+ international markets"
        ]
      },
      {
        title: "Marketing Manager",
        company: "Snapchat",
        dates: "2019 - 2021",
        bullets: [
          "Created viral marketing campaign that generated 100M impressions in 2 weeks",
          "Optimized paid acquisition funnel, reducing CAC by 30% while scaling spend",
          "Built analytics dashboard tracking ROI across 10+ marketing channels",
          "Collaborated with product team to launch 3 new features with go-to-market strategy"
        ]
      }
    ],
    education: {
      degree: "Bachelor of Arts in Marketing",
      school: "University of Southern California",
      details: "GPA: 3.7/4.0 • Marketing Club President • Digital Marketing Certificate",
      dates: "2015 - 2019"
    },
    skills: {
      technical: "Google Analytics, Facebook Ads, HubSpot, Salesforce, SEO/SEM, A/B Testing",
      other: "Content Strategy, Brand Development, Campaign Management, Data Analysis"
    }
  },
  "finance": {
    name: "Michael Zhang",
    location: "New York, NY",
    phone: "(555) 321-9876",
    email: "michael.zhang@email.com",
    linkedin: "linkedin.com/in/michaelzhang",
    summary: "Investment Banking Analyst with 3+ years of experience in M&A, capital markets, and financial modeling. Executed $5B+ in deal volume across technology and healthcare sectors. Strong quantitative skills with expertise in valuation and deal structuring.",
    experience: [
      {
        title: "Investment Banking Analyst",
        company: "Goldman Sachs",
        dates: "2021 - Present",
        bullets: [
          "Executed 8 M&A transactions totaling $3.5B in enterprise value across tech sector",
          "Built comprehensive financial models for DCF, LBO, and merger analysis",
          "Prepared pitch books and investment memos for C-suite client presentations",
          "Conducted due diligence on $500M acquisition, identifying key risk factors"
        ]
      },
      {
        title: "Investment Banking Summer Analyst",
        company: "JP Morgan",
        dates: "Summer 2020",
        bullets: [
          "Supported $1.2B healthcare M&A deal through financial analysis and modeling",
          "Created industry comparable analysis for tech company valuations",
          "Assisted in preparation of S-1 filing for $400M IPO"
        ]
      }
    ],
    education: {
      degree: "Bachelor of Science in Finance",
      school: "Wharton School, University of Pennsylvania",
      details: "GPA: 3.9/4.0 • Summa Cum Laude • Finance Club VP",
      dates: "2017 - 2021"
    },
    skills: {
      technical: "Excel (VBA), Bloomberg Terminal, Capital IQ, FactSet, PowerPoint, Financial Modeling",
      other: "Valuation Analysis, M&A, Due Diligence, Client Presentations, CFA Level 1"
    }
  },
  "consulting": {
    name: "Candidate Name",
    location: "Chicago, IL",
    phone: "(555) 654-3210",
    email: "candidate@email.com",
    linkedin: "linkedin.com/in/candidate",
    summary: "Finance graduate with consulting experience across strategy, operations, and tax advisory. Experience working with Fortune 500 clients in BFSI, Construction, Pharmaceuticals, and Renewable Energy sectors. Strong analytical skills with expertise in financial modeling, process optimization, and cross-functional collaboration.",
    experience: [
      {
        title: "Senior Consultant - Strategy (Business Consulting)",
        company: "KPMG Assurance and Consulting Services LLP",
        dates: "March 2021 - June 2023",
        bullets: [
          "Developed financial models for capital projects ($100M+), supporting strategic decision-making",
          "Implemented cost optimization strategies, resulting in 5-7% cost reductions across large capital projects",
          "Delivered comprehensive feasibility & sensitivity analysis and Quality of Earnings reports",
          "Orchestrated PMO support for global projects in India, Brazil, and Croatia",
          "Cross-functional collaboration to implement projects aligned with client requirements"
        ]
      },
      {
        title: "Senior Consultant - Indirect Tax and Regulatory Services",
        company: "Ernst & Young LLP",
        dates: "October 2016 - February 2021",
        bullets: [
          "Performed impact analysis and process mapping to ensure compliance with VAT/GST",
          "Executed Tax Due Diligence for M&A in BFSI Sector, evaluating tax positions and risk exposure",
          "Authored two industry representations to Ministry of Finance advocating for tax reforms",
          "Led tax transformation projects leveraging technology solutions for compliance"
        ]
      },
      {
        title: "Graduate Consultant - Business Practicum",
        company: "Ravinia Capital LLC (via University of Illinois)",
        dates: "August 2024 - December 2024",
        bullets: [
          "Led stakeholder interviews with industry professionals and city officials",
          "Conducted financial and economic analysis for comprehensive development strategy",
          "Performed market research and feasibility studies analyzing ROI potential"
        ]
      }
    ],
    education: {
      degree: "Master of Science in Finance (STEM)",
      school: "University of Illinois at Urbana Champaign - Gies College of Business",
      details: "CGPA: 3.8/4.0 • Corporate Finance Specialization • CPA Eligible",
      dates: "2023 - 2024"
    },
    skills: {
      technical: "MS Office (Excel, PowerPoint), Financial Modeling, Bloomberg, CapitalIQ, SAP, Financial Reporting, US GAAP",
      other: "Project Management, Financial Due Diligence, Internal Audit, Tax Technology, Risk Advisory, Leadership"
    }
  },
  "private-equity": {
    name: "David Park",
    location: "San Francisco, CA",
    phone: "(555) 789-0123",
    email: "david.park@email.com",
    linkedin: "linkedin.com/in/davidpark",
    summary: "Private Equity Associate with 3+ years of experience in venture capital and growth equity. Invested in 12 startups with 3 successful exits. Strong background in financial modeling, due diligence, and supporting portfolio companies through rapid scaling.",
    experience: [
      {
        title: "Private Equity Associate",
        company: "Sequoia Capital",
        dates: "2022 - Present",
        bullets: [
          "Sourced and evaluated 150+ early-stage startups, leading to 5 investments totaling $30M",
          "Conducted deep-dive financial and market analysis for Series A/B investment decisions",
          "Supported 8 portfolio companies with strategic initiatives, hiring, and fundraising",
          "Built financial models projecting growth trajectories for SaaS and marketplace businesses"
        ]
      },
      {
        title: "Investment Analyst",
        company: "Andreessen Horowitz",
        dates: "2020 - 2022",
        bullets: [
          "Performed due diligence on 200+ startups across fintech, SaaS, and consumer sectors",
          "Created market sizing models and competitive landscape analysis for investment memos",
          "Coordinated with legal and finance teams to execute 4 investment deals"
        ]
      }
    ],
    education: {
      degree: "Bachelor of Science in Business Administration",
      school: "UC Berkeley, Haas School of Business",
      details: "GPA: 3.9/4.0 • High Distinction • Entrepreneurship Certificate",
      dates: "2016 - 2020"
    },
    skills: {
      technical: "Excel, Financial Modeling, PitchBook, Crunchbase, SQL, Startup Valuation",
      other: "Due Diligence, Market Research, Deal Sourcing, Portfolio Management"
    }
  },
  "visa-sponsor": {
    name: "Priya Sharma",
    location: "Seattle, WA",
    phone: "(555) 012-3456",
    email: "priya.sharma@email.com",
    linkedin: "linkedin.com/in/priyasharma",
    summary: "Data Scientist with 5+ years of experience building ML models and analytics platforms. International professional successfully navigating H1B sponsorship process. Expertise in Python, machine learning, and translating business problems into technical solutions.",
    experience: [
      {
        title: "Senior Data Scientist",
        company: "Microsoft",
        dates: "2021 - Present",
        bullets: [
          "Built recommendation engine using ML that increased user engagement by 28%",
          "Developed A/B testing framework used by 15+ product teams across organization",
          "Led data science initiative that automated manual processes, saving 500 hours/month",
          "Mentored 2 junior data scientists on ML best practices and model deployment"
        ]
      },
      {
        title: "Data Scientist",
        company: "Amazon",
        dates: "2019 - 2021",
        bullets: [
          "Created demand forecasting model that improved inventory accuracy by 22%",
          "Built customer segmentation analysis used to personalize marketing campaigns",
          "Developed dashboards tracking KPIs for $50M business unit",
          "Collaborated with engineering to deploy ML models into production systems"
        ]
      }
    ],
    education: {
      degree: "Master of Science in Data Science",
      school: "Columbia University",
      details: "GPA: 3.8/4.0 • Machine Learning Specialization • Dean's List",
      dates: "2017 - 2019"
    },
    skills: {
      technical: "Python, R, SQL, TensorFlow, PyTorch, Scikit-learn, AWS, Tableau, Spark",
      other: "Machine Learning, Statistical Analysis, A/B Testing, Data Visualization"
    }
  }
};
