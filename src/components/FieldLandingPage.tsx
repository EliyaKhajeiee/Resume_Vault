import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { ResumeService } from "@/services/resumeService";
import type { Resume } from "@/lib/supabase";
import { toast } from "sonner";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { ResumeCarousel } from "@/components/ResumeCarousel";
import { TextResumeDisplay } from "@/components/TextResumeDisplay";
import { TopResumeModal } from "@/components/TopResumeModal";
import { resumeDataByField } from "@/data/resumeData";

interface FieldConfig {
  id: string;
  title: string;
  subtitle: string;
  pdfUrl: string;
  ctaText: string;
  targetGoal: string;
}

interface FieldLandingPageProps {
  config: FieldConfig;
}

const getCustomTitle = (fieldId: string): string => {
  const titles: Record<string, string> = {
    "general": "VIEW RESUMES",
    "swe": "VIEW RESUMES",
    "marketing": "VIEW RESUMES",
    "finance": "VIEW RESUMES",
    "consulting": "VIEW RESUMES",
    "private-equity": "VIEW RESUMES",
    "visa-sponsor": "VIEW RESUMES"
  };
  return titles[fieldId] || "VIEW RESUMES";
};

const getCustomDescription = (fieldId: string, targetGoal: string): string => {
  const descriptions: Record<string, string> = {
    "general": "Offers at **Google**, **Microsoft**, **Apple**, **Meta**, **Amazon**. Sign up or Sign in to unlock this proven resume.",
    "swe": "Offers at **Google**, **Microsoft**, **Apple**, **Meta**, **Uber**, **Airbnb**. Sign up or Sign in to unlock this proven **Tech** resume.",
    "marketing": "Offers at **TikTok**, **Meta**, **Snapchat**, **Google**, **Amazon**. Sign up or Sign in to unlock this proven **Marketing** resume.",
    "finance": "Offers at **Goldman Sachs**, **J.P. Morgan**, **Morgan Stanley**, **Citadel**, **BlackRock**. Sign up or Sign in to unlock this proven **Finance** resume.",
    "consulting": "Offers at **McKinsey**, **Bain**, **BCG**, **Deloitte**, **Accenture**. Sign up or Sign in to unlock this proven **Consulting** resume.",
    "private-equity": "Offers at **Sequoia**, **Andreessen Horowitz**, **KKR**, **Blackstone**, **TPG**. Sign up or Sign in to unlock this proven **Private Equity** resume.",
    "visa-sponsor": "Offers at **Microsoft**, **Amazon**, **Google**, **Meta**, **Apple**. Sign up or Sign in to unlock this proven resume."
  };
  return descriptions[fieldId] || `Sign up or Sign in to unlock this proven ${targetGoal} resume.`;
};

const getFieldCompanies = (fieldId: string): string[] => {
  const companies: Record<string, string[]> = {
    "general": ["Google", "Microsoft", "Apple", "Meta", "Amazon"],
    "swe": ["Google", "Microsoft", "Apple", "Meta", "Uber", "Airbnb"],
    "marketing": ["TikTok", "Meta", "Snapchat", "Google", "Amazon"],
    "finance": ["Goldman Sachs", "J.P. Morgan", "Morgan Stanley", "Citadel", "BlackRock"],
    "consulting": ["McKinsey", "Bain", "BCG", "Deloitte", "Accenture"],
    "private-equity": ["Sequoia", "Andreessen Horowitz", "KKR", "Blackstone", "TPG"],
    "visa-sponsor": ["Microsoft", "Amazon", "Google", "Meta", "Apple"]
  };
  return companies[fieldId] || ["Google", "Microsoft", "Apple", "Bain", "TikTok", "J.P. Morgan"];
};

const FieldLandingPage = ({ config }: FieldLandingPageProps) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { hasActiveSubscription, hasActivePurchase, loading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    // Only unlock if user has an active subscription or purchase
    const hasAccess = hasActiveSubscription || hasActivePurchase;

    if (isAuthenticated && hasAccess && !isUnlocked) {
      setIsUnlocked(true);
      toast.success("Resume unlocked! Welcome to Resume Proof! 🎉");
    } else if (isAuthenticated && !hasAccess && !subscriptionLoading) {
      // User is signed in but doesn't have access - redirect to pricing
      toast.info("Subscribe to unlock premium resumes!");
    }
  }, [isAuthenticated, hasActiveSubscription, hasActivePurchase, subscriptionLoading, isUnlocked]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Enhanced Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-lg shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-2 sm:gap-4">
              <img
                src="/logo.jpeg"
                alt="Resume Proof"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg ring-2 ring-blue-50"
              />
              <div>
                <button
                  onClick={() => navigate('/pricing')}
                  className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                >
                  Resume Proof
                </button>
                <div className="hidden sm:block text-xs text-gray-500 font-medium">See Real resumes that have worked</div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/resumes')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-1 sm:gap-2"
            >
              <span className="hidden sm:inline">{config.ctaText}</span>
              <span className="sm:hidden">Get Started</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Resume Display Section with Sidebar */}
      <div className="relative bg-gray-100 py-6 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left: Resume (takes more space) */}
          <div className="flex-1 flex justify-center">
            <TextResumeDisplay resumeData={resumeDataByField[config.id]} isUnlocked={isUnlocked} companies={getFieldCompanies(config.id)} />
          </div>

          {/* Right: Download Modal Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <TopResumeModal
              resumeTitle={config.title}
              companies={getFieldCompanies(config.id)}
            />
          </div>
        </div>

        {/* Center Signup Overlay - Only covers middle section */}
        {!isUnlocked && (
          <div className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none overflow-y-auto p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-10 max-w-lg w-full my-8 pointer-events-auto border-2 border-gray-200">
              <AuthDialog
                open={true}
                onOpenChange={() => {}}
                defaultTab="signup"
                customTitle={getCustomTitle(config.id)}
                customDescription={getCustomDescription(config.id, config.targetGoal)}
              />
            </div>
          </div>
        )}
      </div>


      {/* Resume Carousel */}
      <ResumeCarousel fieldId={config.id} />

    </div>
  );
};

export default FieldLandingPage;