import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export function useCms() {
  const [cms, setCms] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get('/cms/public')
      .then((res) => {
        if (!mounted) return;
        setCms(res.data.data);
      })
      .catch(() => {
        if (!mounted) return;
        setCms(null);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { cms, loading };
}
