import { useEffect, useRef } from 'react';

interface ILoaderProps {
  onVisible: () => void;
  children: React.ReactNode;
}

/**
 * A loader component that triggers a callback when it becomes visible.
 */
export default function Loader({ onVisible, children }: ILoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const visible = useRef<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !visible.current) {
          onVisible();
          visible.current = true;
        }
        if (!entries[0].isIntersecting) {
          visible.current = false;
        }
      },
      { threshold: 1.0 },
    );

    const currentRef = loaderRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [onVisible]);

  return (
    <div ref={loaderRef} data-cy="loader">
      {children}
    </div>
  );
}
