"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface TextRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: any;
}

export default function TextReveal({
  children,
  delay = 0,
  className,
  as: Component = "span",
}: TextRevealProps) {
  return (
    <Component className={cn("inline-block", className)}>
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
        transition={{
          duration: 1.2,
          delay,
          ease: [0.22, 1, 0.36, 1], // Smooth cubic ease-out
        }}
      >
        {children}
      </motion.div>
    </Component>
  );
}
