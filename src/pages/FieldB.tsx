import FieldLandingPage from "@/components/FieldLandingPage";

const FieldB = () => {
  const config = {
    id: "swe",
    title: "Break Into Big Tech",
    subtitle: "See how FAANG engineers structure their resumes",
    pdfUrl: "https://zixhrdbcwidxicgqxygu.supabase.co/storage/v1/object/public/resumes/1758567533114-mrm12bv2m2i.pdf",
    ctaText: "Want to view more resumes to land YOUR next SWE role?",
    targetGoal: "Software Engineering"
  };

  return <FieldLandingPage config={config} />;
};

export default FieldB;