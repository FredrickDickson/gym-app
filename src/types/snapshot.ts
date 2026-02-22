export interface Snapshot {
  id: string;
  date: string; // ISO string
  photos: {
    front: string; // Base64 or URL
    side: string;
    back: string;
  };
  metrics: {
    weight: number;
    height: number; // in cm or inches based on preference, storing raw number for now
    bodyFat?: number;
    muscleMass?: number;
    chest?: number;
    waist?: number;
    hips?: number;
    thighs?: number;
    biceps?: number;
  };
}
