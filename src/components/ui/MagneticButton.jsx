import { motion } from "framer-motion";
import { useRef, useState } from "react";

export const MagneticButton = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Atur kekuatan magnet (0.3 = 30% pergerakan kursor)
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 20, mass: 0.5 }}
      className={`bg-ios-blue text-white px-6 py-3 rounded-full font-medium cursor-pointer ${className}`}
    >
      <motion.span 
        className="block"
        transition={{ type: "spring", stiffness: 350, damping: 20 }}
        animate={{ x: position.x * 0.5, y: position.y * 0.5 }} // Teks bergerak lebih sedikit
      >
        {children}
      </motion.span>
    </motion.button>
  );
};