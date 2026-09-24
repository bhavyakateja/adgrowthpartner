"use client";

import {
  motion,
  useReducedMotion,
} from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: keyof typeof motion;
};

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();

  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      initial={
        reduced
          ? false
          : {
              opacity: 0,
              y: 24,
            }
      }
      whileInView={
        reduced
          ? undefined
          : {
              opacity: 1,
              y: 0,
            }
      }
      viewport={{
        once: true,
        margin: "-10% 0px",
      }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.32, 0.72, 0, 1],
      }}
      className={className}
    >
      {children}
    </Component>
  );
}