import { Link } from "react-router-dom";

const Footer = () => {
  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Browse Resumes", href: "/resumes" },
        { name: "Featured", href: "/resumes?featured=true" },
        { name: "Pricing", href: "/pricing" },
        { name: "Templates", href: "/templates" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Careers", href: "/contact" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Guides", href: "/guides" },
        { name: "Interview Prep", href: "/interview-questions" },
        { name: "Job Boards", href: "/job-boards" },
        { name: "Templates", href: "/templates" },
        { name: "Support", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/privacy" },
        { name: "GDPR", href: "/privacy" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="font-bold text-xl mb-4 block">Resume Proof</Link>
            <p className="text-gray-400 text-sm mb-6">
              The definitive resource for proven resume examples from top companies.
            </p>
            {/* Contact info instead of social media */}
            <div className="text-gray-400 text-sm">
              <p>📧 reports@resumeproof.com</p>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; 2025 Resume Proof. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm">
              Terms
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;