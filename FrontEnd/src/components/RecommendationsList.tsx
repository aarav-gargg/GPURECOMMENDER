import React from 'react';
import { Recommendation } from '../types';
import RecommendationCard from './RecommendationCard';

interface RecommendationsListProps {
  recommendations: Recommendation[];
  workloadType: 'training' | 'inference';
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({ 
  recommendations,
  workloadType 
}) => {
  // Sort recommendations by score
  const sortedRecommendations = [...recommendations].sort((a, b) => b.score - a.score);
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Recommended GPUs</h2>
      
      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Submit your workload requirements to see GPU recommendations.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRecommendations.map((recommendation, index) => (
            <RecommendationCard
              key={recommendation.model.id}
              recommendation={recommendation}
              isTopPick={index === 0}
              workloadType={workloadType}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsList;