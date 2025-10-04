import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ResumeService } from "@/services/resumeService";
import type { Resume } from "@/lib/supabase";
import { toast } from "sonner";
import { AuthDialog } from "@/components/auth/AuthDialog";

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

const FieldLandingPage = ({ config }: FieldLandingPageProps) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isUnlocked) {
      setIsUnlocked(true);
      toast.success("Resume unlocked! Welcome to Resume Proof! 🎉");
    }
  }, [isAuthenticated, isUnlocked]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Enhanced Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-lg shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <img
                src="/logo.jpeg"
                alt="Resume Proof"
                className="w-12 h-12 rounded-full shadow-lg ring-2 ring-blue-50"
              />
              <div>
                <button
                  onClick={() => navigate('/pricing')}
                  className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                >
                  Resume Proof
                </button>
                <div className="text-xs text-gray-500 font-medium">Professional Resume Templates</div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/pricing')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <span>{config.ctaText}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* PDF Resume Background - Full Width */}
      <div className="relative">
        <iframe
          src={`${config.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&zoom=120`}
          className="w-full border-0"
            style={{
              height: '400vh',
              display: 'block'
            }}
            scrolling="no"
          />

      {/* Blur overlay for bottom half */}
      {!isUnlocked && (
        <div
          className="absolute bottom-0 left-0 right-0 bg-white/60 backdrop-blur-md"
          style={{ height: '50%' }}
        />
      )}

      {/* Center Signup Overlay - Fixed Position */}
      {!isUnlocked && (
        <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 pointer-events-auto border">
            <AuthDialog
              open={true}
              onOpenChange={() => {}}
              defaultTab="signup"
              customTitle="SIGN IN TO SEE YOUR FREE RESUME"
              customDescription="Create an account or sign in to unlock this resume and see exactly how top professionals structure their resumes."
            />
          </div>
        </div>
      )}
    </div>

      {/* Tilted Cards - Left Side */}
      <div className="fixed left-8 top-1/4 z-10">
        <div className="bg-white rounded-xl shadow-lg p-6 w-72 transform -rotate-3 hover:rotate-0 transition-transform duration-300" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
          <div className="flex items-start gap-4 mb-5">
            <span className="text-red-500 text-xl font-bold">✕</span>
            <div>
              <div className="text-gray-600 text-sm font-medium mb-2 tracking-wide uppercase">Before Resume Proof</div>
              <div className="text-gray-900 text-2xl font-bold mb-2 tracking-tight">0 Job Offers</div>
              <div className="text-gray-500 text-sm font-medium">📍 100+ Applications Sent</div>
              <div className="mt-4">
                <span className="bg-red-500 text-white text-xs font-semibold px-3 py-2 rounded-lg tracking-wide">😞 No Success</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 border-t border-gray-100 pt-5">
            <span className="text-green-500 text-xl font-bold">✓</span>
            <div>
              <div className="text-gray-600 text-sm font-medium mb-2 tracking-wide uppercase">After Resume Proof</div>
              <div className="text-gray-900 text-2xl font-bold mb-2 tracking-tight">5 Job Offers</div>
              <div className="text-gray-500 text-sm font-medium">📍 3 Weeks Later</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tilted Cards - Right Side */}
      <div className="fixed right-8 top-1/3 z-10">
        <div className="bg-white rounded-xl shadow-lg p-6 w-72 transform rotate-2 hover:rotate-0 transition-transform duration-300" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
          <div className="flex items-start gap-4 mb-5">
            <span className="text-red-500 text-xl font-bold">✕</span>
            <div>
              <div className="text-gray-600 text-sm font-medium mb-2 tracking-wide uppercase">Generic Resume</div>
              <div className="text-gray-900 text-2xl font-bold mb-2 tracking-tight">2% Response Rate</div>
              <div className="text-gray-500 text-sm font-medium">📍 Outdated Template</div>
              <div className="mt-4">
                <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-2 rounded-lg tracking-wide">📉 Poor Results</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 border-t border-gray-100 pt-5">
            <span className="text-green-500 text-xl font-bold">✓</span>
            <div>
              <div className="text-gray-600 text-sm font-medium mb-2 tracking-wide uppercase">Resume Proof Template</div>
              <div className="text-gray-900 text-2xl font-bold mb-2 tracking-tight">85% Response Rate</div>
              <div className="text-gray-500 text-sm font-medium">📍 Professional Design</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FieldLandingPage;