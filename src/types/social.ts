export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  primaryGoal: string;
  gymId?: string; // Current gym they are checked into
  isOnline: boolean;
  isLookingForBuddy: boolean;
  buddyActivity?: string; // e.g., "Spotter for Bench Press", "Cardio Partner"
}

export interface GymGroup {
  id: string;
  name: string;
  location: string;
  memberCount: number;
  activeMembers: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  type: 'achievement' | 'challenge' | 'general';
  likes: number;
  comments: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface BuddyRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  activity: string;
  time: string;
  status: 'open' | 'accepted' | 'expired';
}
