"use client";

import { motion } from "framer-motion";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  duration?: number;
}

export function FadeIn({ children, className, delay = 0, y = 24, x = 0, duration = 0.6 }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}
