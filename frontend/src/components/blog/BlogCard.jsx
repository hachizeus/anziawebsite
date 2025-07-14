import BookmarkIcon from '../../../public/images/32px-Bookmark-solid.png';
import ShareIcon from '../../../public/images/32px-Noun_Project_Share_icon_3282968.png';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Tag, ExternalLink, ChevronRight } from '../utils/icons.jsx';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { 
    duration: 0.4,
    ease: "easeInOut"
  }
};

const BlogCard = ({ post, category }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: post.link
        });
        toast.success("Post shared successfully!");
      } else {
        await navigator.clipboard.writeText(post.link);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error("Unable to share post");
    }
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    
    if (!isBookmarked) {
      toast.success(`Saved "${post.title}" to your reading list`);
    } else {
      toast.info(`Removed "${post.title}" from your reading list`);
    }
  };

  const handleReadMore = () => {
    window.open(post.link, '_blank', 'noopener,noreferrer');
  };

  const estimatedReadTime = Math.ceil(post.excerpt.split(' ').length / 200);
  const displayCategory = post.category || category || "Real Estate";

  return (
    <motion.div
      className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleReadMore}
    >
      <div className="relative overflow-hidden aspect-w-16 aspect-h-9">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'}`} />
        
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1.5 bg-primary-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-full shadow-sm">
            {displayCategory}
          </span>
        </div>
        
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-0 left-0 right-0 p-4 flex justify-center"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReadMore();
                }}
                className="px-4 py-2 bg-white/90 backdrop-blur-sm text-primary-600 rounded-full flex items-center gap-2 hover:bg-primary-600 hover:text-white transition-colors duration-300 font-medium text-sm shadow-lg"
              >
                Read Full Article <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-4 right-4 flex flex-col gap-3">
          <motion.button
            whileTap={pulseAnimation}
            onClick={handleBookmark}
            className={`p-2 backdrop-blur-sm rounded-full shadow-lg 
              ${isBookmarked 
                ? 'bg-primary-600 text-white' 
                : 'bg-white/80 text-gray-700 hover:bg-primary-50'
              } transition-colors duration-200`}
          >
            <img 
              src={BookmarkIcon} 
              alt="Bookmark" 
              className={`w-4 h-4 ${isBookmarked ? 'opacity-100' : 'opacity-70'}`}
            />
          </motion.button>
          
          <motion.button
            whileTap={pulseAnimation}
            onClick={handleShare}
            className="p-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full hover:bg-primary-50 transition-colors duration-200 shadow-lg"
          >
            <img 
              src={ShareIcon} 
              alt="Share" 
              className="w-4 h-4"
            />
          </motion.button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs mb-3">
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary-500" />
            {post.date}
          </div>
          <div className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-primary-500" />
            {estimatedReadTime} min read
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReadMore();
            }}
            className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium transition-colors text-sm"
          >
            Continue Reading
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>

          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Tag className="w-3 h-3 text-gray-400" />
            <span>{post.tags?.[0] || "Property"}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    category: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  category: PropTypes.string
};

export default BlogCard;


