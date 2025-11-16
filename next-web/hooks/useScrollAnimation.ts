'use client';

import { useEffect } from 'react';

/**
 * Custom hook to attach an Intersection Observer for scroll-triggered animations.
 * It looks for elements with the class 'animate-on-scroll' and applies 
 * the 'animate-fadeInUp' class when they enter the viewport.
 */
const useScrollAnimation = () => {
  useEffect(() => {
    // We only run this hook if the browser supports IntersectionObserver
    if ('IntersectionObserver' in window) {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Triggers when 10% of the element is visible
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Add the Tailwind animation class
            entry.target.classList.add('animate-fadeInUp');
            // Stop observing once animated
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      // Select all elements marked for animation
      const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
      
      elementsToAnimate.forEach((el: Element) => {
        // Set initial invisible state for animation
        const htmlEl = el as HTMLElement;
        htmlEl.style.opacity = '0';
        htmlEl.style.transform = 'translateY(20px)';
        observer.observe(el);
      });
      
      // Cleanup function to disconnect the observer when the component unmounts
      return () => observer.disconnect();
    } else {
      // Fallback for older browsers: show content immediately
      document.querySelectorAll('.animate-on-scroll').forEach((el: Element) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.opacity = '1';
        htmlEl.style.transform = 'none';
      });
    }
  }, []); // Run only once on mount
};

export default useScrollAnimation;