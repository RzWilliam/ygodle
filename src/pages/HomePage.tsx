import React from "react";
import { motion } from "framer-motion";
import GameModeSelection from "../components/GameModeSelection";
import HomePageFooter from "../components/HomePageFooter";

const HomePage: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="text-white flex flex-col items-center justify-center px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <GameModeSelection />
      <HomePageFooter />
    </motion.div>
  );
};

export default HomePage;
