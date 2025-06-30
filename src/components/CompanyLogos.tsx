const CompanyLogos = () => {
  const companies = [
    { name: "Google", logo: "https://images.pexels.com/photos/2041627/pexels-photo-2041627.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
    { name: "Meta", logo: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
    { name: "Apple", logo: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
    { name: "Microsoft", logo: "https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
    { name: "Amazon", logo: "https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
    { name: "Netflix", logo: "https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
    { name: "Tesla", logo: "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
    { name: "McKinsey", logo: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
    { name: "Goldman Sachs", logo: "https://images.pexels.com/photos/3483098/pexels-photo-3483098.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
    { name: "JPMorgan", logo: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
    { name: "Stripe", logo: "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
    { name: "Airbnb", logo: "https://images.pexels.com/photos/1001965/pexels-photo-1001965.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Join a community of 500K+ candidates who've landed jobs at top companies
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Our resume examples have helped professionals get hired at the world's most competitive companies
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
          {companies.map((company) => (
            <div key={company.name} className="flex items-center justify-center">
              <div className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors">
                {company.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyLogos;