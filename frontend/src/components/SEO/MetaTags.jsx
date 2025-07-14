import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const MetaTags = ({ 
  title, 
  description, 
  keywords, 
  ogImage, 
  ogType = 'website',
  canonicalUrl
}) => {
  // Base URL for the site
  const siteUrl = 'https://Anzia Electronics .vercel.app';
  
  // Create canonical URL
  const canonical = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;
  
  // Default image if none provided
  const image = ogImage || `${siteUrl}/logo.svg`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical Link */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

MetaTags.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  keywords: PropTypes.string,
  ogImage: PropTypes.string,
  ogType: PropTypes.string,
  canonicalUrl: PropTypes.string
};

export default MetaTags;

