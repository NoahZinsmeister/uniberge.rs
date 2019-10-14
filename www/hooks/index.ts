import { useState, useEffect, useRef } from 'react'

// adapted from https://usehooks.com/useDebounce/
export function useDefaultedDebounce<T>(value: T, delay: number, defaultValue: T): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cancel the timeout if value changes (also on delay change or unmount)
    // This is how we prevent debounced value from updating if value is changed ...
    // ... within the delay period. Timeout gets cleared and restarted.
    return () => {
      clearTimeout(handler)
      setDebouncedValue(defaultValue)
    }
  }, [value, delay, defaultValue]) // Only re-call effect if value or delay or defaultValue changes

  return debouncedValue
}
