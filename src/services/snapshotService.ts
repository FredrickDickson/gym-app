import { Snapshot } from '../types/snapshot';

const STORAGE_KEY = 'fit_track_snapshots';

export const SnapshotService = {
  getAll: (): Snapshot[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getLatest: (): Snapshot | null => {
    const snapshots = SnapshotService.getAll();
    if (snapshots.length === 0) return null;
    // Sort by date descending
    return snapshots.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  },

  add: (snapshot: Omit<Snapshot, 'id' | 'date'>): Snapshot => {
    const snapshots = SnapshotService.getAll();
    const newSnapshot: Snapshot = {
      ...snapshot,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    snapshots.push(newSnapshot);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots));
    return newSnapshot;
  },

  delete: (id: string) => {
    const snapshots = SnapshotService.getAll().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots));
  }
};
