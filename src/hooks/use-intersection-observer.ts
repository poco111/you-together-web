import { useEffect } from 'react';

interface UseIntersectionObserverProps {
  targetId: string;
  onIntersect: () => void;
  enabled: boolean;
  threshold?: number;
}

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
