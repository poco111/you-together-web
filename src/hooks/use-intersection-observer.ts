import { useEffect } from 'react';

interface UseIntersectionObserverProps {
  targetId: string;
  onIntersect: () => void;
  enabled: boolean;
  threshold?: number;
}

// 인터섹션 옵저버 로직 추상화해서 커스텀 훅으로 뺌
// 무한 스크롤말고는 딱히 쓸 곳 없을듯
// gpt 드리븐이라 원리 궁금하면 api 뜯어봐야 될듯

export const useIntersectionObserver = ({
  targetId,
  onIntersect,
  enabled = true,
  threshold = 1.0,
}: UseIntersectionObserverProps) => {
  useEffect(() => {
    if (!enabled) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        }),
      { threshold }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [targetId, onIntersect, enabled, threshold]);
};
