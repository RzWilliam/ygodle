import React from "react";
import { motion } from "framer-motion";

const HomePageFooter: React.FC = () => {
  const footerVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.8
      }
    }
  };

  return (
    <motion.div 
      className="mt-12 text-center"
      variants={footerVariants}
    >
      <p className="text-gray-400 text-sm">
        Track your progress and start collecting! You can also filter what you've already uncovered!
      </p>
    </motion.div>
  );
};

export default HomePageFooter;
