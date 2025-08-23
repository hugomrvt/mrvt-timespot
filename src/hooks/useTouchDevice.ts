import { useState, useEffect } from 'react';

export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      // Multiple checks for touch device detection
      const hasTouch = 'ontouchstart' in window || 
                      navigator.maxTouchPoints > 0 ||
                      // @ts-expect-error - legacy IE/Edge property for touch support
                      navigator.msMaxTouchPoints > 0;
      
      // Additional check for mobile devices
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Check for small screen size
      const isSmallScreen = window.innerWidth <= 768;
      
      setIsTouchDevice(hasTouch || (isMobileUserAgent && isSmallScreen));
    };

    checkTouchDevice();
    
    // Re-check on window resize
    window.addEventListener('resize', checkTouchDevice);
    
    return () => {
      window.removeEventListener('resize', checkTouchDevice);
    };
  }, []);

  return isTouchDevice;
}