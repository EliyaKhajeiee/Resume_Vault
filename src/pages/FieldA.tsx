import FieldLandingPage from "@/components/FieldLandingPage";

const FieldA = () => {
  const config = {
    id: "general",
    title: "Land Your Dream Job",
    subtitle: "See how top professionals structure their resumes",
    pdfUrl: "https://zixhrdbcwidxicgqxygu.supabase.co/storage/v1/object/public/resumes/1759279647977-g3o7z6dxpou.pdf",
    ctaText: "Want to view more resumes to land YOUR specific goal?",
    targetGoal: "High-Impact"
  };

  return <FieldLandingPage config={config} />;
};

export default FieldA;