import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function HeroHeading() {
  const words = [
    "Web Experiences",
    "Mobile Apps",
    "Real-time Systems",
    "Scalable APIs",
    "Interactive Products",
  ];
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const word = words[index];

  useEffect(() => {
    let isMounted = true;

    const typeWord = () => {
      let charIndex = 0;
      const typeChar = () => {
        if (!isMounted) return;
        if (charIndex < word.length) {
          setDisplayedText(word.slice(0, charIndex + 1));
          charIndex++;
          setTimeout(typeChar, 60);
        } else {
          setTimeout(backspaceWord, 1500);
        }
      };
      typeChar();
    };

    const backspaceWord = () => {
      let charIndex = word.length;
      const deleteChar = () => {
        if (!isMounted) return;
        if (charIndex > 0) {
          charIndex--;
          setDisplayedText(word.slice(0, charIndex));
          setTimeout(deleteChar, 60);
        } else {
          setIndex((prev) => (prev + 1) % words.length);
        }
      };
      deleteChar();
    };

    typeWord();

    return () => {
      isMounted = false;
    };
  }, [word, words.length]);

  return (
    <motion.h1
      className="hero-heading"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0 }}
    >
      <span className="hero-heading-regular">Code Amazing</span>
      <br />
      <span className="hero-heading-accent">
        &gt;{""}
        <AnimatePresence mode="wait">
          <span key={index}>
            {displayedText}
            <span className="hero-cursor">|</span>
          </span>
        </AnimatePresence>
      </span>
    </motion.h1>
  );
}
