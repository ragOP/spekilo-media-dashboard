import React from 'react';

// Mobile-optimized wrapper component for better touch interactions
const MobileOptimized = ({ children, className = "" }) => {
  return (
    <div className={`touch-manipulation select-none ${className}`}>
      {children}
    </div>
  );
};

// Hook for detecting mobile devices
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

export default MobileOptimized;
