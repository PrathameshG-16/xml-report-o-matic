
export const fadeIn = {
  initial: { 
    opacity: 0,
    y: 10
  },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const slideIn = {
  initial: { 
    opacity: 0,
    x: -20
  },
  animate: { 
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const scaleIn = {
  initial: { 
    opacity: 0,
    scale: 0.95
  },
  animate: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const shimmer = {
  animate: {
    background: ["hsl(0, 0%, 98%)", "hsl(0, 0%, 93%)", "hsl(0, 0%, 98%)"],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "mirror"
    }
  }
};
