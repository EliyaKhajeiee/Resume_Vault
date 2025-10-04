import FieldLandingPage from "@/components/FieldLandingPage";

const FieldC = () => {
  const config = {
    id: "marketing",
    title: "Land Marketing Roles",
    subtitle: "See how top marketers showcase their impact",
    pdfUrl: "https://zixhrdbcwidxicgqxygu.supabase.co/storage/v1/object/public/resumes/1758223852635-yt8e24y5s3r.pdf",
    ctaText: "Want to view more resumes to land YOUR next marketing role?",
    targetGoal: "Marketing"
  };

  return <FieldLandingPage config={config} />;
};

export default FieldC;