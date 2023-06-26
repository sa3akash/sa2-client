import { useEffect, useRef } from 'react';

const useChatScrollToBottom = (prop: any) => {
  const scrollRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current?.scrollHeight - scrollRef.current?.clientHeight;
    }
  }, [prop]);

  return scrollRef;
};
export default useChatScrollToBottom;
