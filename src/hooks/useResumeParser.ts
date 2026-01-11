"use client";

import { useState, useCallback } from 'react';
import type { ParsedResume } from '@/lib/resumeParser';

export function useResumeParser() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ParsedResume | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parseResume = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/parse', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Failed to parse resume');
        setIsLoading(false);
        return { success: false, error: json.error };
      }
      setData(json.data ?? null);
      setIsLoading(false);
      return { success: true, data: json.data };
    } catch (err: any) {
      setError(err?.message ?? String(err));
      setIsLoading(false);
      return { success: false, error: err?.message };
    }
  }, []);

  return { isLoading, data, error, parseResume };
}
