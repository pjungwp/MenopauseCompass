import { useCallback, useEffect, useState } from 'react';
import { getAllAttempts, getAllSessions, type Attempt, type SessionRecord } from '@/lib/storage';

export interface ProgressState {
  loading: boolean;
  error: string | null;
  attempts: Attempt[];
  sessions: SessionRecord[];
  reload: () => void;
}

/** Loads local practice history from IndexedDB with explicit loading/error states. */
export function useProgress(): ProgressState {
  const [state, setState] = useState<Omit<ProgressState, 'reload'>>({ loading: true, error: null, attempts: [], sessions: [] });
  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    Promise.all([getAllAttempts(), getAllSessions()])
      .then(([attempts, sessions]) => setState({ loading: false, error: null, attempts, sessions }))
      .catch((e: Error) =>
        setState({ loading: false, error: e?.message || 'Could not read saved progress on this device.', attempts: [], sessions: [] })
      );
  }, []);
  useEffect(load, [load]);
  return { ...state, reload: load };
}
