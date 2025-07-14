import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import StructuredData from './StructuredData';

const AiHubSEO = ({ title, description }) => {
  const defaultTitle = 'AI Property Hub | Makini Realtors';
  const defaultDescription = 'Use our AI-powered tools to find the perfect property, analyze market trends, and make informed real estate decisions.';
  
  return (
    <>
      <Helmet>
        <title>{title || defaultTitle}</title>
        <meta name="description" content={description || defaultDescription} />
        <meta name="keywords" content="AI real estate, property analysis, market trends, real estate AI, property recommendations" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://Anzia Electronics .vercel.app/ai-property-hub" />
        <meta property="og:title" content={title || defaultTitle} />
        <meta property="og:description" content={description || defaultDescription} />
        <meta property="og:image" content="https://Anzia Electronics .vercel.app/ai-hub-preview.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title || defaultTitle} />
        <meta name="twitter:description" content={description || defaultDescription} />
      </Helmet>
      
      <StructuredData type="aiHub" />
    </>
  );
};

AiHubSEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
};

export default AiHubSEO;

