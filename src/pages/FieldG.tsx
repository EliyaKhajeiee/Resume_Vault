import FieldLandingPage from "@/components/FieldLandingPage";

const FieldG = () => {
  const config = {
    id: "visa-sponsor",
    title: "Get Visa Sponsorship",
    subtitle: "See how international professionals structure their resumes",
    pdfUrl: "https://zixhrdbcwidxicgqxygu.supabase.co/storage/v1/object/public/resumes/1756574916147-5m3xoivcub.pdf",
    ctaText: "Want to view more resumes to land YOUR visa sponsorship role?",
    targetGoal: "Visa Sponsorship"
  };

  return <FieldLandingPage config={config} />;
};

export default FieldG;