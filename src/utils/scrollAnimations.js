import { useEffect, useRef, useState } from 'react';

// Custom hook for scroll-triggered animations
export const useScrollAnimation = (options = {}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => observer.unobserve(element);
  }, [threshold, rootMargin, triggerOnce, delay]);

  return [elementRef, isVisible];
};

// Custom hook for stagger animations
export const useStaggerAnimation = (itemCount, staggerDelay = 100) => {
  const containerRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState(new Set());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate items with stagger effect
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setVisibleItems(prev => new Set([...prev, i]));
            }, i * staggerDelay);
          }
          observer.unobserve(container);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(container);

    return () => observer.unobserve(container);
  }, [itemCount, staggerDelay]);

  return [containerRef, visibleItems];
};

// Custom hook for counter animations
export const useCounterAnimation = (endValue, duration = 2000, startWhenVisible = true) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    if (!startWhenVisible) {
      animateCounter();
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounter();
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.5
      }
    );

    observer.observe(element);

    return () => observer.unobserve(element);
  }, [endValue, duration, isVisible, startWhenVisible]);

  const animateCounter = () => {
    const startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * endValue);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  };

  return [elementRef, count];
};

// Animation class names for CSS transitions
export const ANIMATION_CLASSES = {
  // Slide animations
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',
  slideInUp: 'animate-slide-in-up',
  slideInDown: 'animate-slide-in-down',
  
  // Fade animations
  fadeIn: 'animate-fade-in',
  fadeInUp: 'animate-fade-in-up',
  fadeInDown: 'animate-fade-in-down',
  fadeInLeft: 'animate-fade-in-left',
  fadeInRight: 'animate-fade-in-right',
  
  // Scale animations
  scaleIn: 'animate-scale-in',
  scaleInUp: 'animate-scale-in-up',
  
  // Rotation animations
  rotateIn: 'animate-rotate-in',
  
  // Special effects
  bounce: 'animate-bounce-in',
  elastic: 'animate-elastic-in',
  
  // Stagger classes
  staggerItem: 'animate-stagger-item'
};

// Animation timing utilities
export const ANIMATION_DELAYS = {
  none: 0,
  short: 100,
  medium: 200,
  long: 300,
  extraLong: 500
};

// Utility function to get animation class with visibility state
export const getAnimationClass = (animationType, isVisible, customClass = '') => {
  const baseClass = ANIMATION_CLASSES[animationType] || ANIMATION_CLASSES.fadeInUp;
  const visibilityClass = isVisible ? 'animate-visible' : 'animate-hidden';
  return `${baseClass} ${visibilityClass} ${customClass}`.trim();
};

// Higher-order component helper (returns class names instead of JSX)
export const getScrollAnimationProps = (Component, animationType = 'fadeInUp', options = {}) => {
  // This is a helper function that returns the necessary props
  // Usage: const { ref, className } = getScrollAnimationProps('fadeInUp', options);
  return {
    useHook: () => useScrollAnimation(options),
    getClassName: (isVisible) => getAnimationClass(animationType, isVisible)
  };
};

// Utility for scroll-triggered reveal animations
export const useScrollReveal = (elements = [], options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    staggerDelay = 100
  } = options;

  useEffect(() => {
    const observers = elements.map((element, index) => {
      if (!element.current) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-visible');
              entry.target.classList.remove('animate-hidden');
            }, index * staggerDelay);
            observer.unobserve(entry.target);
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(element.current);
      return observer;
    });

    return () => {
      observers.forEach(observer => {
        if (observer) observer.disconnect();
      });
    };
  }, [elements, threshold, rootMargin, staggerDelay]);
};

// Predefined animation configurations
export const ANIMATION_CONFIGS = {
  hero: {
    threshold: 0.2,
    rootMargin: '0px',
    triggerOnce: true,
    delay: 0
  },
  card: {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true,
    delay: 0
  },
  section: {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    triggerOnce: true,
    delay: 0
  },
  stats: {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true,
    delay: 200
  }
};