"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const wordsArray = words.split(" ");
  const [currentWordIndex, setCurrentWordIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (currentWordIndex < wordsArray.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
      }
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [currentWordIndex, wordsArray.length, duration]);

  const renderWords = () => {
    return (
      <motion.div className={cn("", className)}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className={cn(
                "dark:text-white text-black opacity-0",
                idx <= currentWordIndex ? "opacity-100" : "opacity-0"
              )}
              initial={{
                opacity: 0,
                filter: filter ? "blur(10px)" : "none",
              }}
              animate={{
                opacity: idx <= currentWordIndex ? 1 : 0,
                filter: idx <= currentWordIndex ? "blur(0px)" : "blur(10px)",
              }}
              transition={{
                duration: duration,
                ease: "easeInOut",
                delay: idx * 0.1,
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="dark:text-white text-black leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
