import React from 'react';
import { StatisticsPage } from './Statistics'; // Reuse the existing component logic but wrap it
import { TrendingUp, Target, Award } from 'lucide-react';

export const ProgressPage = () => {
  // We can reuse the StatisticsPage content but maybe add a header specific to "Progress"
  return (
    <div className="h-full pt-20">
       <StatisticsPage />
    </div>
  );
};
