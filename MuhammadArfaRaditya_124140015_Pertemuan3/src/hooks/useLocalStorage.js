import { useEffect, useState } from 'react';

function readFromStorage(key, initialValue) {
  if (typeof window === 'undefined') {
    return initialValue;
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null) {
      return initialValue;
    }
    return JSON.parse(storedValue);
  } catch (error) {
    console.warn(`Data localStorage dengan key "${key}" tidak valid dan diabaikan.`, error);
    return initialValue;
  }
}

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readFromStorage(key, initialValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Gagal menyimpan data dengan key "${key}" ke localStorage.`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
