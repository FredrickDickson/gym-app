import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Target, Award, Camera, ChevronRight, ArrowRight, Calendar } from 'lucide-react';
import { SnapshotService } from '../services/snapshotService';
import { Snapshot } from '../types/snapshot';
import { format, addDays, differenceInDays } from 'date-fns';

export const ProgressPage = () => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>(SnapshotService.getAll().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  const [activeMetric, setActiveMetric] = useState<'weight' | 'bodyFat' | 'waist' | 'muscleMass'>('weight');
  const [showComparison, setShowComparison] = useState(false);

  // Mock Target Data (should be in a service)
  const targets = {
    weight: 75, // kg
    bodyFat: 15, // %
    waist: 80, // cm
    muscleMass: 40 // kg
  };

  // Calculate Trends & Projections
  const projectionData = useMemo(() => {
    if (snapshots.length < 2) return [];

    const data = snapshots.map(s => ({
      date: new Date(s.date).getTime(),
      value: s.metrics[activeMetric] || 0,
      original: s
    }));

    // Simple Linear Regression
    const n = data.length;
    const sumX = data.reduce((acc, d) => acc + d.date, 0);
    const sumY = data.reduce((acc, d) => acc + d.value, 0);
    const sumXY = data.reduce((acc, d) => acc + d.date * d.value, 0);
    const sumXX = data.reduce((acc, d) => acc + d.date * d.date, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Project next 30 days
    const lastDate = data[data.length - 1].date;
    const projected = [];
    
    // Add historical data
    data.forEach(d => projected.push({ ...d, type: 'history' }));

    // Add projection
    for (let i = 1; i <= 30; i += 5) {
        const nextDate = addDays(lastDate, i).getTime();
        const nextValue = slope * nextDate + intercept;
        projected.push({
            date: nextDate,
            value: nextValue,
            type: 'projection'
        });
    }

    return projected;
  }, [snapshots, activeMetric]);

  const reachTargetDate = useMemo(() => {
    if (snapshots.length < 2) return null;
    
    // Re-calculate slope/intercept (duplicated for clarity, could be shared)
    const data = snapshots.map(s => ({
        date: new Date(s.date).getTime(),
        value: s.metrics[activeMetric] || 0
    }));
    const n = data.length;
    const sumX = data.reduce((acc, d) => acc + d.date, 0);
    const sumY = data.reduce((acc, d) => acc + d.value, 0);
    const sumXY = data.reduce((acc, d) => acc + d.date * d.value, 0);
    const sumXX = data.reduce((acc, d) => acc + d.date * d.date, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const targetVal = targets[activeMetric];
    const currentVal = data[data.length - 1].value;

    // If slope is moving away from target, return null
    if ((targetVal < currentVal && slope >= 0) || (targetVal > currentVal && slope <= 0)) {
        return null;
    }

    const targetTime = (targetVal - intercept) / slope;
    return new Date(targetTime);

  }, [snapshots, activeMetric]);

  const MetricCard = ({ id, label, value, unit, color }: any) => (
    <button 
        onClick={() => setActiveMetric(id)}
        className={`p-4 rounded-2xl border transition-all ${
            activeMetric === id 
            ? `bg-${color}-50 border-${color}-200 ring-2 ring-${color}-100` 
            : 'bg-white border-gray-100 hover:border-gray-200'
        }`}
    >
        <span className="text-xs font-bold text-gray-400 uppercase block mb-1">{label}</span>
        <span className={`text-xl font-bold text-gray-900`}>{value} <span className="text-xs text-gray-400">{unit}</span></span>
    </button>
  );

  const latestSnapshot = snapshots[snapshots.length - 1];
  const firstSnapshot = snapshots[0];

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 pt-28 px-6 bg-[#FAFAFA]">
      <div className="flex justify-between items-end mb-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
            <p className="text-sm text-gray-500">Track your transformation</p>
        </div>
        <button 
            onClick={() => setShowComparison(!showComparison)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-sm"
        >
            {showComparison ? 'View Charts' : 'Compare Photos'}
        </button>
      </div>

      {!showComparison ? (
        <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <MetricCard id="weight" label="Weight" value={latestSnapshot?.metrics.weight || '--'} unit="kg" color="blue" />
                <MetricCard id="bodyFat" label="Body Fat" value={latestSnapshot?.metrics.bodyFat || '--'} unit="%" color="orange" />
                <MetricCard id="waist" label="Waist" value={latestSnapshot?.metrics.waist || '--'} unit="cm" color="green" />
                <MetricCard id="muscleMass" label="Lean Mass" value={latestSnapshot?.metrics.muscleMass || '--'} unit="kg" color="purple" />
            </div>

            {/* Main Chart */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 capitalize">{activeMetric.replace(/([A-Z])/g, ' $1')} Trend</h3>
                    {reachTargetDate && (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            Target by {format(reachTargetDate, 'MMM d')}
                        </span>
                    )}
                </div>
                
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={projectionData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis 
                                dataKey="date" 
                                tickFormatter={(tick) => format(new Date(tick), 'MMM d')}
                                axisLine={false}
                                tickLine={false}
                                tick={{fontSize: 10, fill: '#9CA3AF'}}
                                minTickGap={30}
                            />
                            <YAxis 
                                domain={['auto', 'auto']} 
                                hide
                            />
                            <Tooltip 
                                labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                            />
                            <ReferenceLine y={targets[activeMetric]} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Target', position: 'right', fill: '#10B981', fontSize: 10 }} />
                            <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#3B82F6" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorValue)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-xl flex items-start gap-3">
                    <TrendingUp className="text-blue-500 shrink-0 mt-0.5" size={16} />
                    <p className="text-xs text-blue-700 leading-relaxed">
                        At your current rate of change, you are projected to reach your goal of <strong>{targets[activeMetric]}</strong> around <strong>{reachTargetDate ? format(reachTargetDate, 'MMMM d, yyyy') : '...'}</strong>. Keep it up!
                    </p>
                </div>
            </div>

            {/* Snapshot Gallery Preview */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Camera size={16} />
                        Recent Snapshots
                    </h2>
                    <button className="text-xs font-bold text-gray-400 flex items-center">
                        View All <ChevronRight size={12} />
                    </button>
                </div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4">
                    {snapshots.slice().reverse().map((snap) => (
                        <div key={snap.id} className="min-w-[100px] h-[140px] rounded-2xl overflow-hidden relative border border-gray-100 shadow-sm">
                            <img src={snap.photos.front} className="w-full h-full object-cover" alt="Snapshot" />
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                                <span className="text-[10px] font-bold text-white block">{format(new Date(snap.date), 'MMM d')}</span>
                                <span className="text-[10px] text-white/80">{snap.metrics.weight}kg</span>
                            </div>
                        </div>
                    ))}
                    <button className="min-w-[100px] h-[140px] rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                        <Camera size={24} className="mb-2" />
                        <span className="text-xs font-bold">Add New</span>
                    </button>
                </div>
            </section>
        </>
      ) : (
        <div className="flex flex-col h-full">
            {/* Comparison View */}
            <div className="flex-1 grid grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col">
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 aspect-[3/4] mb-3 relative">
                        <img src={firstSnapshot?.photos.front} className="w-full h-full object-cover" alt="Before" />
                        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur px-2 py-1 rounded-lg text-white text-xs font-bold">
                            Before
                        </div>
                    </div>
                    <div className="text-center">
                        <span className="block text-sm font-bold text-gray-900">{format(new Date(firstSnapshot?.date), 'MMM d, yyyy')}</span>
                        <span className="text-xs text-gray-500">{firstSnapshot?.metrics.weight}kg • {firstSnapshot?.metrics.bodyFat}% BF</span>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 aspect-[3/4] mb-3 relative">
                        <img src={latestSnapshot?.photos.front} className="w-full h-full object-cover" alt="After" />
                        <div className="absolute top-3 left-3 bg-[#FF6B6B] px-2 py-1 rounded-lg text-white text-xs font-bold shadow-lg">
                            After
                        </div>
                    </div>
                    <div className="text-center">
                        <span className="block text-sm font-bold text-gray-900">{format(new Date(latestSnapshot?.date), 'MMM d, yyyy')}</span>
                        <span className="text-xs text-gray-500">{latestSnapshot?.metrics.weight}kg • {latestSnapshot?.metrics.bodyFat}% BF</span>
                    </div>
                </div>
            </div>

            {/* Deltas */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Total Change</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Weight</span>
                        <span className="text-xl font-bold text-green-500">
                            {(latestSnapshot?.metrics.weight - firstSnapshot?.metrics.weight).toFixed(1)}kg
                        </span>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Body Fat</span>
                        <span className="text-xl font-bold text-green-500">
                            {(latestSnapshot?.metrics.bodyFat! - firstSnapshot?.metrics.bodyFat!).toFixed(1)}%
                        </span>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Waist</span>
                        <span className="text-xl font-bold text-green-500">
                            {(latestSnapshot?.metrics.waist! - firstSnapshot?.metrics.waist!).toFixed(1)}cm
                        </span>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
