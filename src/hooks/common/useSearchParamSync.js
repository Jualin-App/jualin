import { useEffect, useState, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from './useDebounce';
import { DEBOUNCE_DELAYS } from '@/constants/animations';

/**
 * Hook to sync input value with URL search params
 * @param {Object} options - Configuration options
 * @param {string} options.paramName - URL parameter name (default: 'q')
 * @param {number} options.debounceDelay - Debounce delay in ms
 * @param {Function} options.onParamChange - Callback when param changes
 */
export const useSearchParamSync = (options = {}) => {
  const {
    paramName = 'q',
    debounceDelay = DEBOUNCE_DELAYS.SEARCH,
    onParamChange,
  } = options;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialValue = useMemo(
    () => searchParams.get(paramName) || '',
    [searchParams, paramName]
  );

  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const debouncedValue = useDebounce(value, debounceDelay);

  useEffect(() => {
    if (!isFocused) {
      setValue(initialValue);
    }
  }, [initialValue, isFocused]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmedValue = debouncedValue.trim();
    const currentValue = params.get(paramName) || '';

    if (trimmedValue) {
      params.set(paramName, trimmedValue);
    } else {
      params.delete(paramName);
    }

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;

    if (trimmedValue !== currentValue) {
      router.replace(url);
      onParamChange?.(trimmedValue);
    }
  }, [debouncedValue, pathname, router, searchParams, paramName, onParamChange]);

  return {
    value,
    setValue,
    debouncedValue,
    isFocused,
    setIsFocused,
  };
};
