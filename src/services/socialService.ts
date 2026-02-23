import { UserProfile, GymGroup, Post, Message, BuddyRequest } from '../types/social';

// Mock Data
const MOCK_USER: UserProfile = {
  id: 'current_user',
  name: 'Alex Fitness',
  avatar: 'https://picsum.photos/seed/alex/200',
  bio: 'Training for a marathon. Love HIIT.',
  fitnessLevel: 'Intermediate',
  primaryGoal: 'Endurance',
  isOnline: true,
  isLookingForBuddy: false
};

const MOCK_GYM: GymGroup = {
  id: 'gym_1',
  name: 'Iron Paradise Gym',
  location: 'Downtown',
  memberCount: 1240,
  activeMembers: 42
};

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    userId: 'user_2',
    userName: 'Sarah Connor',
    userAvatar: 'https://picsum.photos/seed/sarah/200',
    content: 'Just hit a new PR on deadlift! 225lbs! 🚀',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    type: 'achievement',
    likes: 24,
    comments: 5
  },
  {
    id: '2',
    userId: 'user_3',
    userName: 'Mike Ross',
    userAvatar: 'https://picsum.photos/seed/mike/200',
    content: 'Anyone up for a 5k run tomorrow morning?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    type: 'general',
    likes: 8,
    comments: 12
  }
];

const MOCK_BUDDY_REQUESTS: BuddyRequest[] = [
  {
    id: 'req_1',
    userId: 'user_4',
    userName: 'John Wick',
    userAvatar: 'https://picsum.photos/seed/john/200',
    activity: 'Spotter for Bench Press',
    time: 'Now',
    status: 'open'
  }
];

export const SocialService = {
  getUserProfile: (): UserProfile => {
    return MOCK_USER;
  },

  getCurrentGym: (): GymGroup => {
    return MOCK_GYM;
  },

  updateGym: (name: string, location: string): GymGroup => {
    MOCK_GYM.name = name;
    MOCK_GYM.location = location;
    return MOCK_GYM;
  },

  getFeed: (): Post[] => {
    return MOCK_POSTS;
  },

  getBuddyRequests: (): BuddyRequest[] => {
    return MOCK_BUDDY_REQUESTS;
  },

  toggleCheckIn: (isCheckedIn: boolean) => {
    // In a real app, this would update the backend
    console.log(`User checked ${isCheckedIn ? 'in' : 'out'}`);
    return !isCheckedIn;
  },

  toggleBuddyMode: (isLooking: boolean, activity?: string) => {
    console.log(`Buddy mode ${isLooking ? 'enabled' : 'disabled'} for ${activity}`);
    return !isLooking;
  },

  sendMessage: (receiverId: string, content: string) => {
    console.log(`Sending message to ${receiverId}: ${content}`);
  }
};
