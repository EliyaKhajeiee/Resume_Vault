import { useAuth } from "@/hooks/useAuth";
import { Download, Lock } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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

interface ResumeData {
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

interface TextResumeDisplayProps {
  resumeData: ResumeData;
  isUnlocked?: boolean;
}

export const TextResumeDisplay = ({ resumeData, isUnlocked = false }: TextResumeDisplayProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleDownload = () => {
    if (!isAuthenticated) {
      toast.error("Please sign up to download resumes");
      return;
    }
    // For now, redirect to pricing since download is paywalled
    navigate('/pricing');
    toast.info("Upgrade to download this resume");
  };

  return (
    <div className="w-full flex justify-center relative">
      {/* Blur overlay when not unlocked */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-10 rounded-lg" />
      )}

      {/* Paper-like Resume Container */}
      <div className="bg-white shadow-2xl max-w-[8.5in] w-full mx-2 sm:mx-4 rounded-lg" style={{ aspectRatio: '8.5 / 11' }}>
        <div className="px-6 sm:px-12 lg:px-16 py-8 sm:py-10 lg:py-12 h-full overflow-auto">
        {/* Resume Header */}
        <div className="border-b-2 border-gray-900 pb-4 sm:pb-6 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 blur-md select-none">
            {resumeData.name.toUpperCase()}
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 mb-3 break-words">
            {resumeData.location} • {resumeData.phone} • <span className="blur-md select-none">{resumeData.email}</span> • <span className="blur-md select-none">{resumeData.linkedin}</span>
          </p>
        </div>

        {/* Professional Summary */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 uppercase border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {resumeData.summary}
          </p>
        </div>

        {/* Experience */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 uppercase border-b border-gray-300 pb-1">
            Experience
          </h2>

          {resumeData.experience.map((exp, idx) => (
            <div key={idx} className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                <div className="mb-1 sm:mb-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">{exp.title}</h3>
                  <p className="text-sm sm:text-base text-gray-700 font-semibold">{exp.company}</p>
                </div>
                <p className="text-xs sm:text-base text-gray-600 font-semibold">{exp.dates}</p>
              </div>
              <ul className="list-disc ml-4 sm:ml-5 text-xs sm:text-sm text-gray-700 space-y-1 sm:space-y-2">
                {exp.bullets.map((bullet, bidx) => (
                  <li key={bidx}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 uppercase border-b border-gray-300 pb-1">
            Education
          </h2>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
            <div className="mb-1 sm:mb-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">{resumeData.education.degree}</h3>
              <p className="text-sm sm:text-base text-gray-700 font-semibold">{resumeData.education.school}</p>
              <p className="text-xs sm:text-sm text-gray-600">{resumeData.education.details}</p>
            </div>
            <p className="text-xs sm:text-base text-gray-600 font-semibold">{resumeData.education.dates}</p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 uppercase border-b border-gray-300 pb-1">
            Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-xs sm:text-sm text-gray-700"><strong>Technical:</strong> {resumeData.skills.technical}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-700"><strong>Other:</strong> {resumeData.skills.other}</p>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-gray-200">
          <button
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base lg:text-lg"
          >
            {isAuthenticated ? (
              <>
                <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="hidden sm:inline">Upgrade to Download This Resume</span>
                <span className="sm:hidden">Upgrade to Download</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="hidden sm:inline">Sign Up to Download This Resume</span>
                <span className="sm:hidden">Sign Up to Download</span>
              </>
            )}
          </button>
          <p className="text-center text-gray-500 text-xs sm:text-sm mt-3 sm:mt-4 px-2">
            Get unlimited access to all resume templates with our premium plan
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};
