import { WorkoutSession, WorkoutPlan, Exercise } from '../types/fitness';

const HISTORY_KEY = 'fit_track_workout_history';
const ACTIVE_WORKOUT_KEY = 'fit_track_active_workout';

// Mock Data for "Offline" Database
export const EXERCISE_DATABASE: Exercise[] = [
  {
    id: '1',
    name: 'Barbell Bench Press',
    type: 'Strength',
    muscleGroup: 'Chest',
    equipment: 'Barbell, Bench',
    videoUrl: 'https://picsum.photos/seed/bench/800/600',
    instructions: 'Lie on the bench with your eyes under the bar. Grip the bar slightly wider than shoulder-width. Lower the bar to your mid-chest, then press up explosively.',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultWeight: '135',
    defaultRest: 90
  },
  {
    id: '2',
    name: 'Incline Dumbbell Press',
    type: 'Strength',
    muscleGroup: 'Chest',
    equipment: 'Dumbbells, Adjustable Bench',
    videoUrl: 'https://picsum.photos/seed/incline/800/600',
    instructions: 'Set bench to 30-45 degrees. Press dumbbells up and slightly in, focusing on the upper chest.',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultWeight: '50',
    defaultRest: 60
  },
  {
    id: '3',
    name: 'Cable Flys',
    type: 'Strength',
    muscleGroup: 'Chest',
    equipment: 'Cable Machine',
    videoUrl: 'https://picsum.photos/seed/flys/800/600',
    instructions: 'Stand in the center of the cable machine. Pull handles together in front of your chest with a slight bend in elbows.',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultWeight: '25',
    defaultRest: 60
  },
  {
    id: '4',
    name: 'Skullcrushers',
    type: 'Strength',
    muscleGroup: 'Triceps',
    equipment: 'EZ Bar, Bench',
    videoUrl: 'https://picsum.photos/seed/skull/800/600',
    instructions: 'Lie back. Extend arms straight up. Bend elbows to lower bar to forehead. Extend back up.',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultWeight: '60',
    defaultRest: 60
  },
  {
    id: '5',
    name: 'HIIT Sprints',
    type: 'HIIT',
    muscleGroup: 'Full Body',
    equipment: 'Treadmill / Track',
    videoUrl: 'https://picsum.photos/seed/sprint/800/600',
    instructions: 'Sprint at 90% effort for 30 seconds, rest for 30 seconds. Repeat.',
    defaultSets: 10,
    defaultReps: '30s',
    defaultWeight: '0',
    defaultRest: 30
  }
];

export const WorkoutService = {
  getHistory: (): WorkoutSession[] => {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load history", e);
      return [];
    }
  },

  saveSession: (session: WorkoutSession) => {
    const history = WorkoutService.getHistory();
    history.unshift(session); // Add to beginning
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  },

  getActiveSession: (): WorkoutSession | null => {
    try {
      const data = localStorage.getItem(ACTIVE_WORKOUT_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  saveActiveSession: (session: WorkoutSession) => {
    localStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(session));
  },

  clearActiveSession: () => {
    localStorage.removeItem(ACTIVE_WORKOUT_KEY);
  },

  updateSession: (updatedSession: WorkoutSession) => {
    const history = WorkoutService.getHistory();
    const index = history.findIndex(s => s.id === updatedSession.id);
    if (index !== -1) {
      history[index] = updatedSession;
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
  },

  getExerciseById: (id: string): Exercise | undefined => {
    return EXERCISE_DATABASE.find(e => e.id === id);
  },

  // Mock plan generator
  getRecommendedPlan: (): WorkoutPlan => {
    return {
      id: 'push_day_1',
      title: 'Push Day: Chest & Tris',
      type: 'Strength',
      duration: '45 min',
      intensity: 'High',
      exercises: [
        EXERCISE_DATABASE[0],
        EXERCISE_DATABASE[1],
        EXERCISE_DATABASE[2],
        EXERCISE_DATABASE[3]
      ]
    };
  }
};
