import React, { useState } from 'react';
import { Users, MapPin, MessageCircle, UserPlus, Shield, Bell, Send, X, Edit2 } from 'lucide-react';
import { SocialService } from '../services/socialService';
import { UserProfile, Post, BuddyRequest } from '../types/social';
import { formatDistanceToNow } from 'date-fns';

export const SocialPage = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'buddies' | 'messages'>('feed');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isBuddyMode, setIsBuddyMode] = useState(false);
  const [buddyActivity, setBuddyActivity] = useState('');
  const [isEditingGym, setIsEditingGym] = useState(false);
  const [gymName, setGymName] = useState(SocialService.getCurrentGym().name);
  
  const gym = SocialService.getCurrentGym();
  const posts = SocialService.getFeed();
  const buddyRequests = SocialService.getBuddyRequests();
  const currentUser = SocialService.getUserProfile();

  const handleCheckInToggle = () => {
    const newState = SocialService.toggleCheckIn(isCheckedIn);
    setIsCheckedIn(newState);
    if (!newState) {
        setIsBuddyMode(false); // Auto-disable buddy mode on checkout
    }
  };

  const handleUpdateGym = () => {
    if (gymName.trim()) {
        SocialService.updateGym(gymName, 'Custom Location');
        setIsEditingGym(false);
    }
  };

  const handleBuddyToggle = () => {
    if (!isCheckedIn) {
        alert("You must check in to the gym first!");
        return;
    }
    if (!isBuddyMode) {
        // Show modal or prompt for activity
        const activity = prompt("What do you need a buddy for? (e.g., Spotter, Cardio)");
        if (activity) {
            setBuddyActivity(activity);
            setIsBuddyMode(true);
            SocialService.toggleBuddyMode(true, activity);
        }
    } else {
        setIsBuddyMode(false);
        setBuddyActivity('');
        SocialService.toggleBuddyMode(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 pt-28 px-6 bg-[#FAFAFA]">
      
      {/* Header & Gym Status */}
      <div className="flex justify-between items-start mb-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Community</h1>
            {isEditingGym ? (
                <div className="flex items-center gap-2 mt-1">
                    <input 
                        type="text" 
                        value={gymName}
                        onChange={(e) => setGymName(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                        autoFocus
                    />
                    <button onClick={handleUpdateGym} className="text-xs bg-black text-white px-2 py-1 rounded">Save</button>
                    <button onClick={() => setIsEditingGym(false)} className="text-xs text-gray-500">Cancel</button>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 group cursor-pointer" onClick={() => setIsEditingGym(true)}>
                    <MapPin size={14} />
                    <span>{gym.name}</span>
                    <Edit2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            )}
        </div>
        <button 
            onClick={handleCheckInToggle}
            className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all ${
                isCheckedIn 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
        >
            {isCheckedIn ? 'Checked In' : 'Check In'}
        </button>
      </div>

      {/* Buddy Mode Status Card */}
      {isCheckedIn && (
        <div className={`p-4 rounded-2xl border mb-6 transition-all ${
            isBuddyMode 
            ? 'bg-blue-50 border-blue-200 shadow-sm' 
            : 'bg-white border-gray-100'
        }`}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isBuddyMode ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                        <UserPlus size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm">Buddy Mode</h3>
                        <p className="text-xs text-gray-500">
                            {isBuddyMode ? `Looking for: ${buddyActivity}` : 'Find a partner or spotter'}
                        </p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isBuddyMode} onChange={handleBuddyToggle} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
            onClick={() => setActiveTab('feed')}
            className={`flex-1 pb-3 text-sm font-bold text-center transition-colors ${activeTab === 'feed' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400'}`}
        >
            Gym Feed
        </button>
        <button 
            onClick={() => setActiveTab('buddies')}
            className={`flex-1 pb-3 text-sm font-bold text-center transition-colors ${activeTab === 'buddies' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400'}`}
        >
            Buddies
        </button>
        <button 
            onClick={() => setActiveTab('messages')}
            className={`flex-1 pb-3 text-sm font-bold text-center transition-colors ${activeTab === 'messages' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400'}`}
        >
            Messages
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {activeTab === 'feed' && (
            <div className="space-y-4">
                {/* Create Post Input */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-3">
                    <img src={currentUser.avatar} className="w-10 h-10 rounded-full object-cover" alt="Me" />
                    <input 
                        type="text" 
                        placeholder={`What's happening at ${gym.name}?`}
                        className="flex-1 bg-gray-50 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                </div>

                {posts.map(post => (
                    <div key={post.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <img src={post.userAvatar} className="w-10 h-10 rounded-full object-cover" alt={post.userName} />
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">{post.userName}</h4>
                                <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(post.timestamp))} ago</span>
                            </div>
                            {post.type === 'achievement' && (
                                <span className="ml-auto bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                    <Shield size={10} /> Achievement
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">{post.content}</p>
                        <div className="flex items-center gap-4 text-gray-400 text-xs font-bold">
                            <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                                <span>❤️</span> {post.likes}
                            </button>
                            <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                                <MessageCircle size={14} /> {post.comments}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'buddies' && (
            <div className="space-y-4">
                {!isCheckedIn ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 border-dashed">
                        <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="font-bold text-gray-900 mb-2">Check In Required</h3>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto mb-6">
                            You need to check in to {gym.name} to see who is looking for a buddy.
                        </p>
                        <button 
                            onClick={handleCheckInToggle}
                            className="px-6 py-3 bg-black text-white rounded-xl text-sm font-bold shadow-lg"
                        >
                            Check In Now
                        </button>
                    </div>
                ) : (
                    <>
                        {buddyRequests.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                No active buddy requests right now.
                            </div>
                        ) : (
                            buddyRequests.map(req => (
                                <div key={req.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <img src={req.userAvatar} className="w-12 h-12 rounded-full object-cover" alt={req.userName} />
                                            <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">{req.userName}</h4>
                                            <p className="text-xs text-blue-600 font-medium">{req.activity}</p>
                                            <span className="text-[10px] text-gray-400">Active {req.time}</span>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold shadow-md hover:scale-105 transition-transform">
                                        Connect
                                    </button>
                                </div>
                            ))
                        )}
                    </>
                )}
            </div>
        )}

        {activeTab === 'messages' && (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle size={24} className="text-gray-400" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">No Messages Yet</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                    Connect with a buddy to start a conversation. Messages are private and secure.
                </p>
            </div>
        )}
      </div>
    </div>
  );
};
