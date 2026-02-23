import { Snapshot } from '../types/snapshot';

const STORAGE_KEY = 'fit_track_snapshots';

export const SnapshotService = {
  getAll: (): Snapshot[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
    
    // Return mock data if empty
    const mockSnapshots: Snapshot[] = [
        {
            id: '1',
            date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            photos: { front: 'https://picsum.photos/seed/snap1/300/400', side: '', back: '' },
            metrics: { weight: 85, height: 180, bodyFat: 22, waist: 95, muscleMass: 35 }
        },
        {
            id: '2',
            date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            photos: { front: 'https://picsum.photos/seed/snap2/300/400', side: '', back: '' },
            metrics: { weight: 82, height: 180, bodyFat: 20, waist: 92, muscleMass: 36 }
        },
        {
            id: '3',
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            photos: { front: 'https://picsum.photos/seed/snap3/300/400', side: '', back: '' },
            metrics: { weight: 80, height: 180, bodyFat: 18, waist: 88, muscleMass: 37 }
        },
        {
            id: '4',
            date: new Date().toISOString(),
            photos: { front: 'https://picsum.photos/seed/snap4/300/400', side: '', back: '' },
            metrics: { weight: 78, height: 180, bodyFat: 16, waist: 85, muscleMass: 38 }
        }
    ];
    return mockSnapshots;
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
