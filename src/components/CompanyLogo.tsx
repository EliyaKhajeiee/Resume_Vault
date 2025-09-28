import { useState } from 'react';
import { Building2 } from 'lucide-react';

interface CompanyLogoProps {
  company: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CompanyLogo = ({ company, size = 'sm', className = '' }: CompanyLogoProps) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const getLogoUrl = (companyName: string): string => {
    const logoMap: { [key: string]: string } = {
      // Tech Companies
      'Google': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/google.svg',
      'Meta': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/meta.svg',
      'Apple': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/apple.svg',
      'Amazon': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/amazon.svg',
      'Microsoft': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/microsoft.svg',
      'Netflix': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/netflix.svg',
      'OpenAI': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/openai.svg',
      'Tesla': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tesla.svg',
      'SpaceX': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/spacex.svg',
      'NVIDIA': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/nvidia.svg',

      // Finance & Banking
      'BlackRock': 'https://logo.clearbit.com/blackrock.com',
      'Goldman Sachs': 'https://logo.clearbit.com/goldmansachs.com',
      'Morgan Stanley': 'https://logo.clearbit.com/morganstanley.com',
      'JP Morgan': 'https://logo.clearbit.com/jpmorgan.com',
      'Citadel': 'https://logo.clearbit.com/citadel.com',
      'Two Sigma': 'https://logo.clearbit.com/twosigma.com',
      'Jane Street': 'https://logo.clearbit.com/janestreet.com',
      'Bridgewater': 'https://logo.clearbit.com/bridgewater.com',

      // Consulting
      'McKinsey': 'https://logo.clearbit.com/mckinsey.com',
      'BCG': 'https://logo.clearbit.com/bcg.com',
      'Bain': 'https://logo.clearbit.com/bain.com',
    };

    return logoMap[companyName] || `https://logo.clearbit.com/${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
  };

  if (imageError) {
    return <Building2 className={`${sizeClasses[size]} ${className} text-gray-500`} />;
  }

  return (
    <img
      src={getLogoUrl(company)}
      alt={`${company} logo`}
      className={`${sizeClasses[size]} ${className} object-contain`}
      onError={() => setImageError(true)}
    />
  );
};

export default CompanyLogo;