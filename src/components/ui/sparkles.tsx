"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const SparklesCore = ({
  id,
  background,
  minSize,
  maxSize,
  particleDensity,
  className,
  particleColor,
}: {
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
}) => {
  const [particlesArray, setParticlesArray] = React.useState<any[]>([]);

  React.useEffect(() => {
    const initParticles = () => {
      const arr = [];
      for (let i = 0; i < (particleDensity || 120); i++) {
        arr.push({
          id: i,
          x: Math.random() * 400,
          y: Math.random() * 400,
          size: Math.random() * (maxSize || 3) + (minSize || 1),
        });
      }
      setParticlesArray(arr);
    };
    initParticles();
  }, [particleDensity, maxSize, minSize]);

  return (
    <div className={cn("relative", className)}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("absolute inset-0", className)}
        data-background={background || "transparent"}
      >
        <g>
          {particlesArray.map((particle) => (
            <motion.circle
              key={particle.id}
              cx={particle.x}
              cy={particle.y}
              r={particle.size}
              fill={particleColor || "#FFF"}
              initial={{
                opacity: 0,
                scale: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                repeatType: "loop",
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
