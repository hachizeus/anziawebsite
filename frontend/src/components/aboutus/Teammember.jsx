import PropTypes from 'prop-types';
import { Linkedin, Twitter, Instagram, ArrowRight } from '../utils/icons.jsx';
import { motion } from 'framer-motion';

const TeamMember = ({ name, position, bio, image, social, onReadMore }) => {
  // Display a shortened version of the bio
  const shortBio = bio.length > 120 ? `${bio.substring(0, 120)}...` : bio;
  
  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all w-full max-w-sm mx-auto">
        <div className="flex flex-col items-center">
          <img
            src={image}
            alt={name}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full mb-3 md:mb-4 object-cover object-top"
          />
          <h3 className="text-lg md:text-xl font-semibold text-center mb-1 dark:text-white">{name}</h3>
          <p className="text-primary-600 text-xs md:text-sm text-center mb-2 md:mb-3">{position}</p>
          
          <div className="text-gray-600 dark:text-gray-300 text-sm md:text-base text-center mb-3 md:mb-4">
            <p>{shortBio}</p>
          </div>
          
          {bio.length > 120 && (
            <motion.button 
              onClick={() => onReadMore({ name, position, bio, image, social })}
              className="inline-flex items-center text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors mb-4"
              whileHover={{ x: 5 }}
            >
              Read more <ArrowRight className="ml-2 h-4 w-4" />
            </motion.button>
          )}
          
          <div className="flex justify-center space-x-4">
            {social.linkedin && (
              <a href={social.linkedin} className="text-gray-400 hover:text-blue-600 transition-colors">
                <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            )}
            {social.twitter && (
              <a href={social.twitter} className="text-gray-400 hover:text-blue-600 transition-colors">
                <Twitter className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            )}
            {social.instagram && (
              <a href={social.instagram} className="text-gray-400 hover:text-blue-600 transition-colors">
                <Instagram className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

TeamMember.propTypes = {
  name: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  social: PropTypes.shape({
    linkedin: PropTypes.string,
    twitter: PropTypes.string,
    instagram: PropTypes.string
  }).isRequired,
  onReadMore: PropTypes.func.isRequired
};

export default TeamMember;


