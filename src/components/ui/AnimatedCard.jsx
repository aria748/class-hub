import { motion } from "framer-motion";

export const AnimatedCard = ({ children, className = "" }) => {
  return (
    <motion.div
      whileHover={{ 
        y: -5, 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.05)" 
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`glass rounded-ios-lg p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};