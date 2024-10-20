import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatingContainerProps {
  children: ReactNode;
  animation: "fade" | "slideDown" | "slideUp" | "slideLeft" | "slideRight";
  duration?: number;
  className?: string;
}

const animations = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
  },
};

export default function AnimatingContainer({
  children,
  animation = "fade",
  duration = 0.5,
  className = "",
}: AnimatingContainerProps) {
  return (
    <motion.div
      initial={animations[animation].initial}
      animate={animations[animation].animate}
      transition={{ duration }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
