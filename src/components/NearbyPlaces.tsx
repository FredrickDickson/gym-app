import React, { useState } from 'react';
import { MapPin, Search, ExternalLink, Loader2 } from 'lucide-react';
import { LocationService, PlaceResult } from '../services/locationService';

interface NearbyPlacesProps {
  type: 'gym' | 'food';
}

export const NearbyPlaces: React.FC<NearbyPlacesProps> = ({ type }) => {
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
    
    if (!apiKey) {
        alert("API Key missing");
        setLoading(false);
        return;
    }

    const query = type === 'gym' 
        ? "Find the best rated gyms nearby with heavy weights" 
        : "Find healthy restaurants nearby with high protein options";

    const results = await LocationService.findNearbyPlaces(query, apiKey);
    setPlaces(results);
    setLoading(false);
    setSearched(true);
  };

  if (!searched && !loading) {
    return (
        <button 
            onClick={handleSearch}
            className="w-full py-3 bg-white border border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
            <MapPin size={16} className="text-[#FF6B6B]" />
            {type === 'gym' ? 'Find Nearby Gyms' : 'Find Healthy Food'}
        </button>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <MapPin size={16} className="text-[#FF6B6B]" />
                {type === 'gym' ? 'Nearby Gyms' : 'Healthy Spots'}
            </h3>
            {loading && <Loader2 size={16} className="animate-spin text-gray-400" />}
        </div>

        {places.length === 0 && !loading ? (
            <div className="text-center py-4 text-gray-400 text-xs">
                No places found nearby.
            </div>
        ) : (
            <div className="space-y-3">
                {places.map((place, i) => (
                    <a 
                        key={i} 
                        href={place.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                    >
                        <div className="flex justify-between items-start">
                            <span className="font-bold text-sm text-gray-900 line-clamp-1">{place.title}</span>
                            <ExternalLink size={12} className="text-gray-400 group-hover:text-black" />
                        </div>
                        <span className="text-xs text-blue-500 mt-1 block">View on Maps</span>
                    </a>
                ))}
            </div>
        )}
    </div>
  );
};
