import { useEffect } from 'react';

/**
 * Custom hook that runs a function only once when the component mounts.
 * It's a wrapper around useEffect with an empty dependency array.
 *
 * @param effect The function to run on mount.
 */
export const useOnMount = (effect: () => void | (() => void)) => {
  useEffect(effect, []); // eslint-disable-line react-hooks/exhaustive-deps
};
