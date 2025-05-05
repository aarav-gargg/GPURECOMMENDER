import React from 'react';
import { Recommendation } from '../types';
import { CheckCircle, DollarSign, Clock, Zap } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
  isTopPick?: boolean;
  workloadType: 'training' | 'inference';
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendation, 
  isTopPick = false,
  workloadType
}) => {
  const { model, score, estimatedCost, estimatedTime, reasons } = recommendation;

  return (
    <div className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 ${
      isTopPick 
        ? 'border-2 border-purple-500 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20' 
        : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
    } hover:shadow-xl`}>
      
      {isTopPick && (
        <div className="absolute top-0 right-0">
          <div className="bg-purple-500 text-white text-xs font-bold py-1 px-3 transform rotate-45 translate-x-2 -translate-y-1">
            TOP PICK
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-xl text-gray-900 dark:text-white">
              {model.gpu_description}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {model.ram}GB RAM
            </p>
          </div>
          <div className="flex items-center bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
            <Zap size={14} className="mr-1" />
            Score: {score.toFixed(1)}
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <DollarSign size={16} className="mr-2 text-green-600 dark:text-green-400" />
            <span className="text-gray-700 dark:text-gray-300">
              ${estimatedCost.toFixed(2)} total
            </span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-2 text-blue-600 dark:text-blue-400" />
            <span className="text-gray-700 dark:text-gray-300">
              ~{estimatedTime.toFixed(1)}h
            </span>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
            Why this is a good match:
          </h4>
          <ul className="text-sm space-y-2">
            {reasons.map((reason, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle size={16} className="mr-2 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Optimized for {workloadType === 'training' ? 'Training' : 'Inference'}
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200">
            Select This GPU
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
