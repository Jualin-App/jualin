'use client';
import React, { useRef } from "react";

function useHorizontalScroll(scrollRef, setShowLeft) {
  return {
    handleScrollRight: () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, offsetWidth } = scrollRef.current;
        if (scrollLeft + offsetWidth >= scrollWidth - 1) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
          setShowLeft && setShowLeft(false);
        } else {
          scrollRef.current.scrollBy({ left: offsetWidth, behavior: "smooth" });
          setTimeout(() => {
            if (setShowLeft && scrollRef.current.scrollLeft > 0) setShowLeft(true);
          }, 300);
        }
      }
    },
    handleScrollLeft: () => {
      if (scrollRef.current) {
        const { scrollLeft, offsetWidth } = scrollRef.current;
        if (scrollLeft <= 0) {
          scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth, behavior: "smooth" });
          setShowLeft && setShowLeft(true);
        } else {
          scrollRef.current.scrollBy({ left: -offsetWidth, behavior: "smooth" });
          setTimeout(() => {
            if (setShowLeft && scrollRef.current.scrollLeft <= 0) setShowLeft(false);
          }, 300);
        }
      }
    }
  };
}

export default useHorizontalScroll;