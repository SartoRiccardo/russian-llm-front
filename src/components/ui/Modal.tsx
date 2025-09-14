import { useEffect, useState } from 'react';

interface IModalProps {
  show: boolean;
  children: React.ReactNode;
  onShow?: () => void;
  onShown?: () => void;
  onHide?: () => void;
  onUnmount?: () => void;
}

/**
 * A generic modal component with proper animations and event handling.
 */
export default function Modal({
  show,
  children,
  onShow,
  onShown,
  onHide,
  onUnmount,
}: IModalProps) {
  const [mounted, setMounted] = useState(show);
  const [animating, setAnimating] = useState(show);

  useEffect(() => {
    if (animating) return;

    if (show && !mounted) {
      if (onShow) onShow();
      setMounted(true);
      setAnimating(true);
    } else if (!show && mounted) {
      setAnimating(true);
    }
  }, [show, mounted, animating, onShow]);

  return !mounted ? null : (
    <div
      data-cy="modal"
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
        show ? 'animate-fade-in' : 'animate-fade-out'
      }`}
      onClick={onHide}
      onAnimationEnd={() => {
        setAnimating(false);
        if (show) {
          if (onShown) onShown();
        } else {
          if (onUnmount) onUnmount();
          setMounted(false);
        }
      }}
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-lg ${
          show ? 'slide-up' : 'slide-down'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
