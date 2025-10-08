"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  // Split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const [currentWordIndex, setCurrentWordIndex] = React.useState(0);
  const [currentCharIndex, setCurrentCharIndex] = React.useState(0);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentCharIndex < wordsArray[currentWordIndex].text.length) {
        setCurrentCharIndex(currentCharIndex + 1);
      } else if (currentWordIndex < wordsArray.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        setCurrentCharIndex(0);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [currentWordIndex, currentCharIndex, wordsArray]);

  const renderWords = () => {
    return (
      <div>
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline">
              {word.text.map((char, index) => (
                <span
                  key={`char-${index}`}
                  className={cn(`dark:text-white text-black `, word.className, {
                    "opacity-100":
                      idx < currentWordIndex ||
                      (idx === currentWordIndex && index <= currentCharIndex),
                    "opacity-0":
                      idx > currentWordIndex ||
                      (idx === currentWordIndex && index > currentCharIndex),
                  })}
                >
                  {char}
                </span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div
      className={cn(
        "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center",
        className
      )}
    >
      <motion.div
        className="inline"
        initial={{
          width: "0%",
        }}
        whileInView={{
          width: "fit-content",
        }}
        transition={{
          duration: 2,
          ease: "linear",
          delay: 1,
        }}
      >
        <div className="lg:text-5xl md:text-3xl sm:text-xl text-base font-bold">
          {renderWords()}
        </div>
      </motion.div>
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-blue-500",
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
};
