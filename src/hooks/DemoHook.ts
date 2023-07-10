import { useEffect, useRef, useState } from 'react';

function useInfiniteScroll(callback: any) {
  const handleScroll = (e: any) => {
    const scrollHeight = e.target.documentElement.scrollHeight;
    const currentHeight = Math.ceil(e.target.documentElement.scrollTop + window.innerHeight);
    if (currentHeight + 1 >= scrollHeight) {
      callback();
    }
  };

  useEffect(() => {
    // fetchData();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
}

export default useInfiniteScroll;
