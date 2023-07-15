import { useCallback, useEffect } from 'react';

const useScrollContainer = (containerRef, onScroll) => {
  //   const handleScroll = () => {
  //     if (
  //       containerRef.current.scrollTop + containerRef.current.clientHeight >=
  //       containerRef.current.scrollHeight
  //     ) {
  //       onScroll(); // Call the onScroll callback when reaching the bottom
  //     }
  //   };

  const handleScroll = useCallback(() => {
    if (containerRef.current.scrollTop + containerRef.current.clientHeight >= containerRef.current.scrollHeight) {
      onScroll(); // Call the onScroll callback when reaching the bottom
    }
  }, [containerRef, onScroll]);

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, handleScroll]);

  return [];
};

export default useScrollContainer;
