export interface TargetProfile {
  id: string;
  name: string;
  metrics: {
    weight: number;
    bodyFat: number;
    muscleMass: number;
  };
  segments: {
    arms: number; // 0-100
    chest: number;
    waist: number;
    legs: number;
  };
}

export const DEFAULT_TARGETS: TargetProfile[] = [
  {
    id: 'athletic',
    name: 'Athletic',
    metrics: { weight: 185, bodyFat: 12, muscleMass: 80 },
    segments: { arms: 60, chest: 60, waist: 40, legs: 60 }
  },
  {
    id: 'lean',
    name: 'Lean',
    metrics: { weight: 170, bodyFat: 8, muscleMass: 70 },
    segments: { arms: 40, chest: 40, waist: 30, legs: 40 }
  },
  {
    id: 'strong',
    name: 'Bodybuilder',
    metrics: { weight: 210, bodyFat: 10, muscleMass: 95 },
    segments: { arms: 90, chest: 90, waist: 50, legs: 90 }
  }
];
