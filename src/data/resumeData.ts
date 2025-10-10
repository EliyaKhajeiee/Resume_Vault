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
    name: "Business Student",
    location: "Berkeley, CA",
    phone: "(555) 234-5678",
    email: "student@email.com",
    linkedin: "linkedin.com/in/student",
    summary: "Business Administration student with internship experience in project management and operations. Strong analytical and communication skills with hands-on experience in data analysis, client management, and cross-functional collaboration. Proven ability to deliver results in fast-paced environments.",
    experience: [
      {
        title: "Program Management Intern",
        company: "Tech Solutions Inc.",
        dates: "Summer 2024",
        bullets: [
          "Supported cross-functional team delivering client projects, contributing to 30% efficiency improvement",
          "Analyzed client satisfaction data and created reports for senior leadership",
          "Managed communications with 10+ clients, maintaining high satisfaction scores",
          "Created data visualizations in Tableau that informed strategic decision-making"
        ]
      },
      {
        title: "Operations Intern",
        company: "Innovation Corp",
        dates: "Summer 2023",
        bullets: [
          "Assisted in coordinating product launch logistics across 3 departments",
          "Implemented process improvements that reduced task completion time by 15%",
          "Built relationships with stakeholders across marketing, engineering, and sales teams"
        ]
      },
      {
        title: "Business Analyst Intern",
        company: "Consulting Firm",
        dates: "Summer 2022",
        bullets: [
          "Conducted market research and competitive analysis for client presentations",
          "Created financial models and forecasts using Excel and Python",
          "Presented findings to team leads and contributed to client deliverables"
        ]
      }
    ],
    education: {
      degree: "Bachelor of Science in Business Administration",
      school: "University of California, Berkeley",
      details: "GPA: 3.8/4.0 • Dean's List • Business Analytics Certificate",
      dates: "Expected May 2025"
    },
    skills: {
      technical: "Excel, SQL, Python, Tableau, PowerPoint, Jira, Asana",
      other: "Project Management, Stakeholder Communication, Team Leadership, Data Analysis"
    }
  },
  "swe": {
    name: "Student Name",
    location: "Cambridge, MA",
    phone: "(555) 987-6543",
    email: "student@email.com",
    linkedin: "linkedin.com/in/student",
    summary: "Computer Science student at Harvard with internship experience at Meta, Google, and NASA. Strong foundation in data structures, algorithms, and full-stack development. Built scalable backend systems, optimized performance, and created end-to-end features used by millions.",
    experience: [
      {
        title: "Software Engineer Intern",
        company: "Meta",
        dates: "May 2024 - August 2024",
        bullets: [
          "Developed and optimized backend services for user data processing using Python, improving response time by 30%",
          "Collaborated on privacy-preserving API supporting 500,000+ active users",
          "Created automated testing pipelines using CI/CD tools, reducing manual QA workload by 40%"
        ]
      },
      {
        title: "Software Engineer Intern",
        company: "Google",
        dates: "May 2023 - August 2023",
        bullets: [
          "Designed cloud-based microservice architecture for real-time analytics, improving data processing by 40%",
          "Built end-to-end features using React and Flask, launching beta product with 15% increase in retention",
          "Optimized API performance, reducing latency by 50% through query optimization and caching"
        ]
      },
      {
        title: "Software Engineer Intern",
        company: "NASA",
        dates: "May 2022 - August 2022",
        bullets: [
          "Developed Python simulation tool modeling spacecraft trajectories, reducing simulation time by 20%",
          "Built data visualization dashboard for mission telemetry providing real-time analytics to mission control"
        ]
      }
    ],
    education: {
      degree: "Bachelor of Arts in Computer Science",
      school: "Harvard University",
      details: "Relevant Coursework: Data Structures & Algorithms, Compilers, Operating Systems, Computer Architecture",
      dates: "August 2022 - May 2026"
    },
    skills: {
      technical: "Python, C++, JavaScript, HTML/CSS, SQL, Java, R, React, Flask, Node.js, TensorFlow",
      other: "Git, Docker, Kubernetes, CI/CD (Jenkins), PostgreSQL, MySQL, GPT-2/3, TensorFlow, Keras"
    }
  },
  "marketing": {
    name: "Marketing Student",
    location: "Los Angeles, CA",
    phone: "(555) 456-7890",
    email: "marketing.student@email.com",
    linkedin: "linkedin.com/in/marketingstudent",
    summary: "Marketing student with internship experience in digital marketing, social media, and content strategy. Strong analytical skills with hands-on experience managing campaigns, analyzing metrics, and creating engaging content. Passionate about data-driven marketing and brand development.",
    experience: [
      {
        title: "Marketing Intern",
        company: "TikTok",
        dates: "Summer 2024",
        bullets: [
          "Supported influencer marketing campaign that reached 10M+ users and drove 50K app installs",
          "Analyzed social media engagement metrics and created weekly performance reports",
          "Assisted in managing content calendar across multiple social platforms",
          "Researched competitor strategies and presented insights to marketing team"
        ]
      },
      {
        title: "Digital Marketing Intern",
        company: "Snapchat",
        dates: "Summer 2023",
        bullets: [
          "Created social media content that generated 5M+ impressions across platforms",
          "Assisted in optimizing paid social campaigns, contributing to 20% improvement in CTR",
          "Built analytics dashboards in Google Analytics to track campaign performance",
          "Collaborated with product team on go-to-market strategy for new feature launch"
        ]
      },
      {
        title: "Social Media Intern",
        company: "E-commerce Startup",
        dates: "Summer 2022",
        bullets: [
          "Managed Instagram and TikTok accounts, growing followers by 40% in 3 months",
          "Created content calendar and scheduled 100+ posts using Hootsuite",
          "Conducted A/B testing on ad copy and creatives, improving engagement by 25%"
        ]
      }
    ],
    education: {
      degree: "Bachelor of Arts in Marketing",
      school: "University of Southern California",
      details: "GPA: 3.7/4.0 • Marketing Club President • Digital Marketing Certificate",
      dates: "Expected May 2025"
    },
    skills: {
      technical: "Google Analytics, Facebook Ads, HubSpot, Salesforce, SEO/SEM, A/B Testing, Hootsuite, Canva",
      other: "Content Strategy, Brand Development, Campaign Management, Data Analysis, Social Media Marketing"
    }
  },
  "finance": {
    name: "Finance Graduate",
    location: "Miami, FL",
    phone: "(555) 321-9876",
    email: "finance.grad@email.com",
    linkedin: "linkedin.com/in/financegrad",
    summary: "Finance graduate with experience in wealth management, credit analysis, and strategic cost analysis. Strong analytical skills with expertise in financial modeling, portfolio management, and risk assessment. FINRA licenses: SIE, Series 66, Series 7 (in progress).",
    experience: [
      {
        title: "Product Control Analyst",
        company: "Bank (Wealth Management Division)",
        dates: "Dec 2022 - Present",
        bullets: [
          "Created automated spreadsheets to analyze portfolio's risk, return and liquidity",
          "Performed monthly portfolio performance analyses, examining top contributors, detractors, and risk factors",
          "Streamlined financial models with automated Excel using Bloomberg Query Language, Pivot Tables, XLOOKUP, and SUMIF",
          "Managed portfolios ensuring appropriate risk levels while monitoring performance and mandate limits",
          "Conducted financial analyses utilizing DCF, COMPS, and NPV to evaluate investment opportunities"
        ]
      },
      {
        title: "Credit Analyst (Intern)",
        company: "Bank",
        dates: "May 2022 - Aug 2022",
        bullets: [
          "Performed cash flow analysis to determine borrowers' ability to repay loans",
          "Utilized industry benchmarks to assess creditworthiness and credit score criteria",
          "Analyzed financial statements, cash flows, and other indicators to evaluate credit risk",
          "Collaborated with sales, underwriting, and risk management for effective credit risk management"
        ]
      },
      {
        title: "Strategic Cost Analyst",
        company: "X Corporation",
        dates: "Jan 2019 - Dec 2021",
        bullets: [
          "Analyzed financial implications of 6 pre-construction land investment projects, resulting in 4 successful investments",
          "Assisted in creating financial statements including balance sheet, income statement, and cash flow statement",
          "Conducted project analyses incorporating cost assessment and revenue projections"
        ]
      }
    ],
    education: {
      degree: "Bachelor of Science in Finance",
      school: "University",
      details: "Relevant Coursework: Financial Modeling, Accounting, Financial Markets, Financial Analysis, Statistics, Security Analysis",
      dates: "Graduated December 2022"
    },
    skills: {
      technical: "Excel, PowerPoint, Microsoft Office Suite, Salesforce, Bloomberg Terminal, Bloomberg Query (BQL), Regression Analysis, Tableau",
      other: "Asset Management, Risk Mitigation, Investment and Capital Markets, Financial Models, Risk Analysis, Market Analysis, FINRA: SIE, Series 66, Series 7 (IP)"
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
    name: "Finance Student",
    location: "San Francisco, CA",
    phone: "(555) 789-0123",
    email: "pe.student@email.com",
    linkedin: "linkedin.com/in/pestudent",
    summary: "Business student with internship experience in venture capital and private equity. Strong analytical skills with hands-on experience in financial modeling, due diligence, and market research. Passionate about startups, investing, and supporting high-growth companies.",
    experience: [
      {
        title: "Private Equity Intern",
        company: "Sequoia Capital",
        dates: "Summer 2024",
        bullets: [
          "Sourced and evaluated 50+ early-stage startups, creating investment memos for partners",
          "Conducted financial and market analysis to support Series A/B investment decisions",
          "Supported 3 portfolio companies with research on competitive landscape and growth strategies",
          "Built financial models projecting revenue growth for SaaS and marketplace businesses"
        ]
      },
      {
        title: "Venture Capital Intern",
        company: "Andreessen Horowitz",
        dates: "Summer 2023",
        bullets: [
          "Performed due diligence on 60+ startups across fintech, SaaS, and consumer sectors",
          "Created market sizing models and competitive analysis for investment committee presentations",
          "Coordinated deal flow tracking and updated CRM with startup pipeline data",
          "Attended pitch meetings and took detailed notes for investment team"
        ]
      },
      {
        title: "Investment Banking Analyst Intern",
        company: "Boutique Investment Bank",
        dates: "Summer 2022",
        bullets: [
          "Built financial models (DCF, LBO, comps) for M&A transactions in tech sector",
          "Conducted industry research and created pitch materials for client presentations",
          "Assisted in due diligence process for $200M acquisition"
        ]
      }
    ],
    education: {
      degree: "Bachelor of Science in Business Administration",
      school: "UC Berkeley, Haas School of Business",
      details: "GPA: 3.9/4.0 • High Distinction • Entrepreneurship Certificate",
      dates: "Expected May 2025"
    },
    skills: {
      technical: "Excel, Financial Modeling, PitchBook, Crunchbase, SQL, Startup Valuation, PowerPoint",
      other: "Due Diligence, Market Research, Deal Sourcing, Portfolio Analysis, Investment Memos"
    }
  },
  "visa-sponsor": {
    name: "International Student",
    location: "New York, NY",
    phone: "(555) 012-3456",
    email: "intl.student@email.com",
    linkedin: "linkedin.com/in/intlstudent",
    summary: "Data Science graduate student (F-1 visa) with internship experience in machine learning and analytics. Strong technical skills in Python, SQL, and ML frameworks. Seeking full-time opportunities with H1B sponsorship. Experienced in building predictive models and data pipelines.",
    experience: [
      {
        title: "Data Science Intern",
        company: "Microsoft",
        dates: "Summer 2024",
        bullets: [
          "Built recommendation engine prototype using Python and TensorFlow, improving engagement by 15%",
          "Developed A/B testing analysis framework to evaluate product feature performance",
          "Created automated data pipeline that reduced manual processing time by 40%",
          "Presented findings to senior data scientists and product managers"
        ]
      },
      {
        title: "Data Analyst Intern",
        company: "Amazon",
        dates: "Summer 2023",
        bullets: [
          "Created demand forecasting model using Python and scikit-learn, improving accuracy by 18%",
          "Built customer segmentation analysis using clustering algorithms for marketing team",
          "Developed Tableau dashboards tracking key business metrics for leadership",
          "Collaborated with engineering team to implement data quality checks"
        ]
      },
      {
        title: "Machine Learning Research Assistant",
        company: "Columbia University",
        dates: "Sept 2023 - Present",
        bullets: [
          "Conducting research on NLP models for sentiment analysis under faculty advisor",
          "Built data preprocessing pipeline for 1M+ text samples using Python",
          "Presented research findings at university symposium"
        ]
      }
    ],
    education: {
      degree: "Master of Science in Data Science",
      school: "Columbia University",
      details: "GPA: 3.8/4.0 • Machine Learning Specialization • Dean's List • F-1 Student (OPT/H1B eligible)",
      dates: "Expected May 2025"
    },
    skills: {
      technical: "Python, R, SQL, TensorFlow, PyTorch, Scikit-learn, AWS, Tableau, Spark, Pandas, NumPy",
      other: "Machine Learning, Statistical Analysis, A/B Testing, Data Visualization, NLP"
    }
  }
};
