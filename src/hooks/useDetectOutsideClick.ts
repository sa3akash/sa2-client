// import { useEffect } from 'react';

// export default function useClickOutSide(ref: any, fun: () => void) {
//   useEffect(() => {
//     let listner = (e: any) => {
//       if (!ref.current || ref.current.contains(e.target)) {
//         return;
//       }
//       fun();
//     };

//     document.addEventListener('mousedown', listner);
//     document.addEventListener('touchstart', listner);

//     return () => {
//       document.removeEventListener('mousedown', listner);
//       document.removeEventListener('touchstart', listner);
//     };
//   }, [fun, ref]);
// }

// ===============================================================

import { useEffect, useState } from 'react';

const useDetectOutsideClick = (ref: any, initialState: boolean) => {
  const [isActive, setIsActive] = useState<boolean>(initialState);

  useEffect(() => {
    const onClick = (event: any) => {
      if (ref.current !== null && !ref.current.contains(event.target)) {
        setIsActive(!isActive);
      }
    };

    if (isActive) {
      window.addEventListener('mousedown', onClick);
    }

    return () => {
      window.removeEventListener('mousedown', onClick);
    };
  }, [isActive, ref]);

  return [isActive, setIsActive] as const;
};

export default useDetectOutsideClick;
