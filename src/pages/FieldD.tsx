import FieldLandingPage from "@/components/FieldLandingPage";

const FieldD = () => {
  const config = {
    id: "finance",
    title: "Break Into Finance",
    subtitle: "See how Wall Street professionals structure their resumes",
    pdfUrl: "https://zixhrdbcwidxicgqxygu.supabase.co/storage/v1/object/public/resumes/1758570413192-553jg4knesk.pdf",
    ctaText: "Want to view more resumes to land YOUR next finance role?",
    targetGoal: "Finance"
  };

  return <FieldLandingPage config={config} />;
};

export default FieldD;