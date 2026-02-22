export interface Exercise {
  id: string;
  name: string;
  type: 'Strength' | 'Cardio' | 'HIIT' | 'Flexibility';
  muscleGroup?: string;
  equipment?: string;
  videoUrl?: string;
  instructions?: string;
  defaultSets?: number;
  defaultReps?: string;
  defaultWeight?: string;
  defaultRest?: number; // seconds
}

export interface WorkoutSetLog {
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutExerciseLog {
  exerciseId: string;
  sets: WorkoutSetLog[];
}

export interface WorkoutSession {
  id: string;
  title: string;
  type: 'Strength' | 'Cardio' | 'HIIT' | 'Flexibility';
  duration: number; // seconds
  date: string; // ISO string
  exercises: WorkoutExerciseLog[];
  status: 'completed' | 'in_progress';
}

export interface WorkoutPlan {
  id: string;
  title: string;
  type: 'Strength' | 'Cardio' | 'HIIT' | 'Flexibility';
  duration: string; // display string e.g. "45 min"
  intensity: 'Low' | 'Medium' | 'High';
  exercises: Exercise[];
}
