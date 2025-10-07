import { useNavigate } from "react-router-dom";
import { Download, ArrowRight } from "lucide-react";

interface TopResumeModalProps {
  resumeTitle: string;
  companies: string[];
}

export const TopResumeModal = ({ resumeTitle, companies }: TopResumeModalProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-24">
      {/* Main Title */}
      <div className="mb-4 sm:mb-5">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 leading-tight">Make this format yours</h2>
        <p className="text-gray-600 text-xs sm:text-sm">Download this resume template</p>
      </div>

      {/* Download Button */}
      <div className="mb-4 sm:mb-5">
        <button
          onClick={() => navigate('/pricing')}
          className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm"
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Download (PDF/Word)</span>
        </button>
      </div>

      {/* Explore Full Vault */}
      <div className="mb-4 sm:mb-5 border-t border-gray-200 pt-4 sm:pt-5">
        <p className="text-gray-700 font-semibold mb-2 text-xs sm:text-sm">Explore the vault:</p>
        <button
          onClick={() => navigate('/resumes')}
          className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 transition-colors text-xs sm:text-sm"
        >
          <span>Browse more resumes</span>
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

      {/* Companies */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-5">
        <p className="text-gray-700 font-semibold mb-2 sm:mb-3 text-xs">Landed offers at:</p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {companies.map((company, idx) => (
            <span
              key={idx}
              className="bg-white border border-gray-300 text-gray-800 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md font-medium text-xs"
            >
              {company}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 sm:p-4">
        <p className="text-gray-700 text-xs leading-relaxed">
          Users who explored our resumes received{" "}
          <span className="font-bold text-green-700">63% more interviews</span>
        </p>
      </div>
    </div>
  );
};
