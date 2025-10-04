import FieldLandingPage from "@/components/FieldLandingPage";

const FieldF = () => {
  const config = {
    id: "private-equity",
    title: "Break Into Private Equity/Startups",
    subtitle: "See how top professionals structure their resumes",
    pdfUrl: "https://zixhrdbcwidxicgqxygu.supabase.co/storage/v1/object/public/resumes/1758547770408-dslaqswm99.pdf",
    ctaText: "Want to view more resumes to land YOUR next PE/startup role?",
    targetGoal: "Private Equity/Startup"
  };

  return <FieldLandingPage config={config} />;
};

export default FieldF;