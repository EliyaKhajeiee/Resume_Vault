import FieldLandingPage from "@/components/FieldLandingPage";

const FieldE = () => {
  const config = {
    id: "consulting",
    title: "Land Consulting Roles",
    subtitle: "See how MBB consultants showcase their experience",
    pdfUrl: "https://zixhrdbcwidxicgqxygu.supabase.co/storage/v1/object/public/resumes/1758570946516-qpi8fke2ub.pdf",
    ctaText: "Want to view more resumes to land YOUR next consulting role?",
    targetGoal: "Consulting"
  };

  return <FieldLandingPage config={config} />;
};

export default FieldE;