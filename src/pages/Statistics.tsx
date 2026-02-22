import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { day: 'Mon', kcal: 300 },
  { day: 'Tue', kcal: 450 },
  { day: 'Wed', kcal: 320 },
  { day: 'Thu', kcal: 600 },
  { day: 'Fri', kcal: 480 },
  { day: 'Sat', kcal: 380 },
  { day: 'Sun', kcal: 550 },
];

export const StatisticsPage = () => {
  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 px-6 bg-[#FAFAFA]">
      <div className="mb-6 pt-8">
        <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
        <p className="text-sm text-gray-500">Trends & Projections</p>
      </div>

      {/* Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex">
          <button className="px-6 py-2 text-xs font-medium text-gray-400">Daily</button>
          <button className="px-6 py-2 text-xs font-bold text-[#FF6B6B] bg-red-50 rounded-lg shadow-sm">Weekly</button>
          <button className="px-6 py-2 text-xs font-medium text-gray-400">Monthly</button>
        </div>
      </div>

      {/* Circular Progress */}
      <div className="flex justify-center mb-10">
        <div className="relative w-56 h-56">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle cx="112" cy="112" r="90" stroke="#F3F4F6" strokeWidth="12" fill="none" />
            {/* Progress Circle (66%) */}
            <circle 
              cx="112" 
              cy="112" 
              r="90" 
              stroke="#FF6B6B" 
              strokeWidth="12" 
              fill="none" 
              strokeDasharray={2 * Math.PI * 90}
              strokeDashoffset={2 * Math.PI * 90 * 0.33} 
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-400 font-medium mb-1">This week</span>
            <span className="text-5xl font-bold text-gray-900 mb-1">4/6</span>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Workouts</span>
          </div>
        </div>
      </div>

      {/* Calories Chart */}
      <section className="mb-8">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Calories</h2>
        
        <div className="h-48 w-full bg-white rounded-3xl border border-gray-100 p-4 shadow-sm relative overflow-hidden">
          {/* Custom Gradient Background for Chart Area */}
          <div className="absolute inset-0 bg-gradient-to-b from-white to-red-50/30"></div>
          
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorKcalRed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9CA3AF', fontSize: 10}} 
                dy={10} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                cursor={{ stroke: '#FF6B6B', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="kcal" 
                stroke="#FF6B6B" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorKcalRed)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Bottom Calendar Strip */}
      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">April, 2021</h2>
        <div className="flex justify-between">
          {[17, 18, 19, 20, 21, 22].map((date, idx) => (
             <div key={idx} className={`w-12 h-12 flex flex-col items-center justify-center rounded-xl border ${idx === 3 ? 'bg-[#FF6B6B] border-[#FF6B6B] text-white shadow-lg shadow-red-200' : 'bg-white border-gray-100 text-gray-500'}`}>
                <span className="text-sm font-bold">{date}</span>
             </div>
          ))}
        </div>
      </section>
    </div>
  );
};
