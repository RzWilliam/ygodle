import React from "react";
import { motion } from "framer-motion";
import Back from "../assets/card_back.png";
import Front from "../assets/kuriboh.webp";

const RotateCard: React.FC = () => {
  return (
    <div
      className="h-32 relative flex items-center justify-center flex-col gap-4 text-white"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative w-24 h-32"
        animate={{ rotateY: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front */}
        <motion.img
          src={Front}
          alt="Kuriboh"
          className="absolute w-full h-full object-contain rounded-lg shadow-lg"
          style={{ backfaceVisibility: "hidden" }}
        />

        {/* Back */}
        <motion.img
          src={Back}
          alt="Card Back"
          className="absolute w-full h-full object-contain rounded-lg shadow-lg"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        />
      </motion.div>
    </div>
  );
};

export default RotateCard;
