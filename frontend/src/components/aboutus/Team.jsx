import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TeamMember from "./Teammember";
import { teamMembers } from "../../assets/data/teammemberdata";
import { X } from '../utils/icons.jsx';

// Team Member Modal Component
const TeamMemberModal = ({ member, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 20 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-12 h-12 rounded-full object-cover object-top mr-4" 
              />
              <div>
                <h3 className="text-xl font-bold dark:text-white">{member.name}</h3>
                <p className="text-primary-600 text-sm">{member.position}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="prose prose-sm md:prose-base max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {member.bio}
            </p>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default function Team() {
  const [selectedMember, setSelectedMember] = useState(null);
  
  const openModal = (member) => {
    setSelectedMember(member);
  };
  
  const closeModal = () => {
    setSelectedMember(null);
  };
  
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 dark:text-white">Meet Our Team</h2>
          <div className="w-24 h-1 bg-primary-600 mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            The passionate individuals behind Anzia Electronics 's success
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className="transform transition-all duration-300"
            >
              <TeamMember 
                name={member.name}
                position={member.position}
                bio={member.fullBio || member.bio}
                image={member.image}
                social={member.social}
                onReadMore={() => openModal({
                  name: member.name,
                  position: member.position,
                  bio: member.fullBio || member.bio,
                  image: member.image,
                  social: member.social
                })}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Team Member Modal */}
        {selectedMember && (
          <TeamMemberModal 
            member={selectedMember} 
            isOpen={!!selectedMember} 
            onClose={closeModal} 
          />
        )}
      </div>
    </section>
  );
}


