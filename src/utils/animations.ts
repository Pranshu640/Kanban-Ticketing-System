import type { Variants, Transition } from 'framer-motion';

// Common animation variants
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    } as Transition
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    } as Transition
  }
};

export const fadeInDown: Variants = {
  hidden: { 
    opacity: 0, 
    y: -20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    } as Transition
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    } as Transition
  }
};

export const fadeInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    } as Transition
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    } as Transition
  }
};

export const fadeInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 20 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    } as Transition
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    } as Transition
  }
};

export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    } as Transition
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    } as Transition
  }
};

export const slideInUp: Variants = {
  hidden: { 
    y: "100%",
    opacity: 0
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300
    } as Transition
  },
  exit: { 
    y: "100%",
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    } as Transition
  }
};

export const slideInDown: Variants = {
  hidden: { 
    y: "-100%",
    opacity: 0
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300
    } as Transition
  },
  exit: { 
    y: "-100%",
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    } as Transition
  }
};

// Stagger animation for lists
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    } as Transition
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    } as Transition
  }
};

export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    } as Transition
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    } as Transition
  }
};

// Hover and tap animations
export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2 } as Transition
};

export const tapScale = {
  scale: 0.98,
  transition: { duration: 0.1 } as Transition
};

export const hoverLift = {
  y: -2,
  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
  transition: { duration: 0.2 } as Transition
};

// Loading animations
export const pulse: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    } as Transition
  }
};

export const spin: Variants = {
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    } as Transition
  }
};

export const bounce: Variants = {
  bounce: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut"
    } as Transition
  }
};

// Modal animations
export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 } as Transition
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 } as Transition
  }
};

export const modalContent: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: -50
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300
    } as Transition
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    y: -50,
    transition: {
      duration: 0.2
    } as Transition
  }
};

// Drag animations
export const dragConstraints = {
  top: -5,
  left: -5,
  right: 5,
  bottom: 5,
};

export const dragTransition = {
  bounceStiffness: 300,
  bounceDamping: 20
};

// Toast animations
export const toastSlideIn: Variants = {
  hidden: { 
    x: "100%",
    opacity: 0
  },
  visible: { 
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300
    } as Transition
  },
  exit: { 
    x: "100%",
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    } as Transition
  }
};

// Page transition animations
export const pageTransition: Variants = {
  hidden: { 
    opacity: 0,
    x: -20
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    } as Transition
  },
  exit: { 
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    } as Transition
  }
};

// Utility functions
export const getStaggerDelay = (index: number, baseDelay: number = 0.1): number => {
  return baseDelay * index;
};

export const createCustomVariant = (
  initial: any,
  animate: any,
  exit?: any,
  transition?: Transition
): Variants => ({
  hidden: initial,
  visible: {
    ...animate,
    transition: transition || { duration: 0.3, ease: "easeOut" } as Transition
  },
  ...(exit && {
    exit: {
      ...exit,
      transition: transition || { duration: 0.2, ease: "easeIn" } as Transition
    }
  })
});