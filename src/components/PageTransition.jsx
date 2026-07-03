import { motion } from 'framer-motion';

const pageVariants = {
  initial:  { opacity: 0, y: 12, scale: 0.99 },
  animate:  { opacity: 1, y: 0,  scale: 1    },
  exit:     { opacity: 0, y: -8, scale: 0.99  },
};

const pageTransition = {
  duration: 0.22,
  ease: [0.25, 0.46, 0.45, 0.94],
};

const PageTransition = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={pageTransition}
    style={{ minHeight: '100%' }}
  >
    {children}
  </motion.div>
);

export default PageTransition;
