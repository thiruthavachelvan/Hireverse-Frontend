import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// Geometric H Logo SVG
const HLogo = ({ size = 40, animated = false }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B6B" />
        <stop offset="50%" stopColor="#FF8FA3" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#logo-grad)" />
    <rect x="10" y="10" width="7" height="28" rx="3.5" fill="white" />
    <rect x="31" y="10" width="7" height="28" rx="3.5" fill="white" />
    <rect x="10" y="20.5" width="28" height="7" rx="3.5" fill="white" fillOpacity="0.9" />
  </svg>
);

const AppLoader = ({ onDone }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onDone, 400);
    }, 1800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="app-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #F8F8FC 0%, #F0EEFF 50%, #FFF0F5 100%)' }}
        >
          {/* Ambient blobs */}
          <div className="mesh-blob-1 animate-blob-1" style={{ top: '-10%', left: '-10%' }} />
          <div className="mesh-blob-2 animate-blob-2" style={{ bottom: '-10%', right: '-10%' }} />
          <div className="mesh-blob-3 animate-blob-3" style={{ top: '30%', right: '15%' }} />

          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <HLogo size={72} />
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <h1 className="text-3xl font-black tracking-tight gradient-text">HireVerse</h1>
              <p className="text-sm text-hv-muted mt-1 font-medium">One Platform. Every Career Journey.</p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-48 flex flex-col items-center gap-2"
            >
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.2, delay: 0.6, ease: 'easeInOut' }}
                  className="h-full rounded-full bg-gradient-primary"
                  style={{ background: 'linear-gradient(90deg, #FF6B6B, #8B5CF6)' }}
                />
              </div>
              <p className="text-xs text-hv-subtle font-medium">Preparing your Career Workspace...</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { HLogo };
export default AppLoader;
