import PropTypes from 'prop-types';

const BlogStructuredData = ({ post, url }) => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: 'Makini Realtors',
      url: 'https://Anzia Electronics .vercel.app'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Makini Realtors',
      logo: {
        '@type': 'ImageObject',
        url: 'https://Anzia Electronics .vercel.app/logo.svg'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

BlogStructuredData.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired
  }).isRequired,
  url: PropTypes.string.isRequired
};

export default BlogStructuredData;

