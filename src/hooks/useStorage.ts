import {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(key).then(raw => {
      if (raw !== null) {
        try { setValue(JSON.parse(raw)); } catch {}
      }
      setLoaded(true);
    });
  }, [key]);

  const save = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue(prev => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        AsyncStorage.setItem(key, JSON.stringify(resolved));
        return resolved;
      });
    },
    [key],
  );

  return [value, save, loaded] as const;
}
