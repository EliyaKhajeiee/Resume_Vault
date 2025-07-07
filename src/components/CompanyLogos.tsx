const CompanyLogos = () => {
  const companies = [
    { 
      name: "Google", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      alt: "Google logo"
    },
    { 
      name: "Meta", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
      alt: "Meta logo"
    },
    { 
      name: "Apple", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
      alt: "Apple logo"
    },
    { 
      name: "Microsoft", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
      alt: "Microsoft logo"
    },
    { 
      name: "Amazon", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      alt: "Amazon logo"
    },
    { 
      name: "Netflix", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
      alt: "Netflix logo"
    },
    { 
      name: "Tesla", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg",
      alt: "Tesla logo"
    },
    { 
      name: "McKinsey & Company", 
      logo: "https://logos-world.net/wp-content/uploads/2021/02/McKinsey-Company-Logo.png",
      alt: "McKinsey logo"
    },
    { 
      name: "Goldman Sachs", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg",
      alt: "Goldman Sachs logo"
    },
    { 
      name: "JPMorgan Chase", 
      logo: "https://logos-world.net/wp-content/uploads/2021/02/JPMorgan-Chase-Logo.png",
      alt: "JPMorgan logo"
    },
    { 
      name: "Stripe", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
      alt: "Stripe logo"
    },
    { 
      name: "Airbnb", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
      alt: "Airbnb logo"
    },
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
        
        {/* Animated scrolling banner */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll space-x-12 items-center">
            {[...companies, ...companies].map((company, index) => (
              <div key={`${company.name}-${index}`} className="flex-shrink-0 flex items-center justify-center h-16 w-40">
                <img 
                  src={company.logo} 
                  alt={company.alt}
                  className="max-h-12 max-w-full object-contain opacity-60 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default CompanyLogos;