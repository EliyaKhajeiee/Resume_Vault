import { useNavigate } from "react-router-dom";

interface ResumeCard {
  category: string;
  title: string;
  company: string;
  description: string;
  borderColor: string;
  bgColor: string;
  logo: string;
}

const resumesByField: Record<string, ResumeCard[]> = {
  "general": [
    { category: "CONSULTING", title: "Strategy Analyst", company: "McKinsey", description: "Structured format for top-tier consulting offers.", borderColor: "border-indigo-300", bgColor: "bg-indigo-50", logo: "https://logo.clearbit.com/mckinsey.com" },
    { category: "SWE", title: "Software Engineer Intern", company: "Apple", description: "Hardware and low-level system contributions.", borderColor: "border-blue-300", bgColor: "bg-blue-50", logo: "https://logo.clearbit.com/apple.com" },
    { category: "TECH", title: "Associate Product Manager", company: "Salesforce", description: "Cloud experience and customer-centric results.", borderColor: "border-cyan-300", bgColor: "bg-cyan-50", logo: "https://logo.clearbit.com/salesforce.com" },
    { category: "FINANCE", title: "Investment Banking Analyst", company: "Goldman Sachs", description: "Quantitative skills and deal exposure.", borderColor: "border-emerald-300", bgColor: "bg-emerald-50", logo: "https://logo.clearbit.com/gs.com" },
    { category: "MARKETING", title: "Marketing Manager", company: "TikTok", description: "Viral content metrics and campaign performance.", borderColor: "border-pink-300", bgColor: "bg-pink-50", logo: "https://logo.clearbit.com/tiktok.com" }
  ],
  "swe": [
    { category: "FRONTEND", title: "Frontend Engineer", company: "Meta", description: "Building responsive user interfaces.", borderColor: "border-blue-300", bgColor: "bg-blue-50", logo: "https://logo.clearbit.com/meta.com" },
    { category: "BACKEND", title: "Backend Engineer", company: "Google", description: "Scalable APIs and microservices.", borderColor: "border-green-300", bgColor: "bg-green-50", logo: "https://www.google.com/favicon.ico" },
    { category: "FULL STACK", title: "Full Stack Developer", company: "Amazon", description: "End-to-end web application development.", borderColor: "border-purple-300", bgColor: "bg-purple-50", logo: "https://logo.clearbit.com/amazon.com" },
    { category: "MOBILE", title: "iOS Engineer", company: "Apple", description: "Native mobile app development.", borderColor: "border-cyan-300", bgColor: "bg-cyan-50", logo: "https://logo.clearbit.com/apple.com" },
    { category: "DEVOPS", title: "DevOps Engineer", company: "Microsoft", description: "CI/CD and cloud infrastructure.", borderColor: "border-orange-300", bgColor: "bg-orange-50", logo: "https://logo.clearbit.com/microsoft.com" }
  ],
  "marketing": [
    { category: "DIGITAL MARKETING", title: "Performance Marketing Manager", company: "Google", description: "PPC, SEO, and paid acquisition.", borderColor: "border-blue-300", bgColor: "bg-blue-50", logo: "https://www.google.com/favicon.ico" },
    { category: "BRAND MARKETING", title: "Brand Manager", company: "Nike", description: "Brand strategy and positioning.", borderColor: "border-pink-300", bgColor: "bg-pink-50", logo: "https://logo.clearbit.com/nike.com" },
    { category: "CONTENT", title: "Content Marketing Lead", company: "Netflix", description: "Content strategy and storytelling.", borderColor: "border-purple-300", bgColor: "bg-purple-50", logo: "https://logo.clearbit.com/netflix.com" },
    { category: "GROWTH", title: "Growth Marketing Manager", company: "Uber", description: "User acquisition and retention.", borderColor: "border-green-300", bgColor: "bg-green-50", logo: "https://logo.clearbit.com/uber.com" },
    { category: "ANALYTICS", title: "Marketing Analyst", company: "Meta", description: "Data-driven marketing insights.", borderColor: "border-orange-300", bgColor: "bg-orange-50", logo: "https://logo.clearbit.com/meta.com" }
  ],
  "finance": [
    { category: "INVESTMENT BANKING", title: "M&A Analyst", company: "J.P. Morgan", description: "Mergers and acquisitions advisory.", borderColor: "border-emerald-300", bgColor: "bg-emerald-50", logo: "https://logo.clearbit.com/jpmorgan.com" },
    { category: "SALES & TRADING", title: "Equity Trader", company: "Goldman Sachs", description: "Trading equities and derivatives.", borderColor: "border-blue-300", bgColor: "bg-blue-50", logo: "https://logo.clearbit.com/gs.com" },
    { category: "QUANT", title: "Quantitative Analyst", company: "Citadel", description: "Algorithmic trading strategies.", borderColor: "border-purple-300", bgColor: "bg-purple-50", logo: "https://logo.clearbit.com/citadel.com" },
    { category: "ASSET MANAGEMENT", title: "Portfolio Manager", company: "BlackRock", description: "Investment portfolio management.", borderColor: "border-green-300", bgColor: "bg-green-50", logo: "https://logo.clearbit.com/blackrock.com" },
    { category: "CORPORATE FINANCE", title: "Finance Analyst", company: "Morgan Stanley", description: "Financial planning and analysis.", borderColor: "border-indigo-300", bgColor: "bg-indigo-50", logo: "https://logo.clearbit.com/morganstanley.com" }
  ],
  "consulting": [
    { category: "STRATEGY", title: "Strategy Consultant", company: "McKinsey", description: "Corporate and business strategy.", borderColor: "border-indigo-300", bgColor: "bg-indigo-50", logo: "https://logo.clearbit.com/mckinsey.com" },
    { category: "OPERATIONS", title: "Operations Consultant", company: "Bain", description: "Process optimization and efficiency.", borderColor: "border-green-300", bgColor: "bg-green-50", logo: "https://logo.clearbit.com/bain.com" },
    { category: "TECH CONSULTING", title: "Technology Consultant", company: "Accenture", description: "IT strategy and implementation.", borderColor: "border-blue-300", bgColor: "bg-blue-50", logo: "https://logo.clearbit.com/accenture.com" },
    { category: "MANAGEMENT", title: "Management Consultant", company: "BCG", description: "Organizational transformation.", borderColor: "border-purple-300", bgColor: "bg-purple-50", logo: "https://logo.clearbit.com/bcg.com" },
    { category: "DIGITAL", title: "Digital Transformation Lead", company: "Deloitte", description: "Digital strategy and innovation.", borderColor: "border-cyan-300", bgColor: "bg-cyan-50", logo: "https://logo.clearbit.com/deloitte.com" }
  ],
  "private-equity": [
    { category: "VENTURE CAPITAL", title: "VC Investor", company: "Andreessen Horowitz", description: "Early-stage startup investing.", borderColor: "border-green-300", bgColor: "bg-green-50", logo: "https://logo.clearbit.com/a16z.com" },
    { category: "GROWTH EQUITY", title: "Growth Equity Associate", company: "Accel", description: "Late-stage growth investments.", borderColor: "border-blue-300", bgColor: "bg-blue-50", logo: "https://logo.clearbit.com/accel.com" },
    { category: "BUYOUT", title: "Buyout Analyst", company: "KKR", description: "LBO modeling and execution.", borderColor: "border-purple-300", bgColor: "bg-purple-50", logo: "https://logo.clearbit.com/kkr.com" },
    { category: "CREDIT", title: "Private Credit Analyst", company: "Blackstone", description: "Private debt and lending.", borderColor: "border-indigo-300", bgColor: "bg-indigo-50", logo: "https://logo.clearbit.com/blackstone.com" },
    { category: "REAL ESTATE PE", title: "Real Estate Associate", company: "TPG", description: "Commercial real estate investing.", borderColor: "border-orange-300", bgColor: "bg-orange-50", logo: "https://logo.clearbit.com/tpg.com" }
  ],
  "visa-sponsor": [
    { category: "TECH", title: "Data Scientist", company: "Microsoft", description: "ML models with H1B sponsorship.", borderColor: "border-cyan-300", bgColor: "bg-cyan-50", logo: "https://logo.clearbit.com/microsoft.com" },
    { category: "TECH", title: "Software Engineer", company: "Amazon", description: "Backend engineering with visa support.", borderColor: "border-orange-300", bgColor: "bg-orange-50", logo: "https://logo.clearbit.com/amazon.com" },
    { category: "TECH", title: "Cloud Engineer", company: "Google", description: "Infrastructure with sponsorship.", borderColor: "border-blue-300", bgColor: "bg-blue-50", logo: "https://www.google.com/favicon.ico" },
    { category: "TECH", title: "Research Scientist", company: "Meta", description: "AI research with visa sponsorship.", borderColor: "border-indigo-300", bgColor: "bg-indigo-50", logo: "https://logo.clearbit.com/meta.com" },
    { category: "TECH", title: "Hardware Engineer", company: "Apple", description: "Hardware design with H1B.", borderColor: "border-gray-300", bgColor: "bg-gray-50", logo: "https://logo.clearbit.com/apple.com" }
  ]
};

interface ResumeCarouselProps {
  fieldId?: string;
}

export const ResumeCarousel = ({ fieldId = "general" }: ResumeCarouselProps) => {
  const navigate = useNavigate();
  const resumes = resumesByField[fieldId] || resumesByField["general"];

  return (
    <div className="w-full bg-gray-50 py-10 sm:py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Other resumes people viewed:
          </h2>
        </div>

        {/* All Cards Grid - Static */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12">
          {resumes.map((card, idx) => (
            <div
              key={idx}
              onClick={() => navigate('/resumes')}
              className={`bg-white border-2 ${card.borderColor} ${card.bgColor} rounded-lg p-4 sm:p-5 lg:p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer`}
            >
              {/* Logo */}
              <div className="mb-3 sm:mb-4 flex justify-center items-center h-10 sm:h-12">
                <img
                  src={card.logo}
                  alt={card.company}
                  className="h-8 sm:h-10 lg:h-12 w-auto max-w-[60px] sm:max-w-[80px] object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>

              {/* Category */}
              <div className="text-[10px] sm:text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 sm:mb-3">
                {card.category}
              </div>

              {/* Title */}
              <h3 className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2">
                {card.title}
              </h3>

              {/* Company */}
              <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                @ {card.company}
              </p>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-3">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Browse More Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/resumes')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-10 lg:px-12 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <span className="hidden sm:inline">Browse More Than 500+ Resumes</span>
            <span className="sm:hidden">Browse 500+ Resumes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
