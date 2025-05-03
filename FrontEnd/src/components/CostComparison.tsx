import React, { useState, useEffect, useRef } from 'react';
import { GPUModel, Recommendation } from '../types';

interface CostComparisonProps {
  recommendations: Recommendation[];
  workloadType: 'training' | 'inference';
}

const CostComparison: React.FC<CostComparisonProps> = ({ recommendations, workloadType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<'cost' | 'performance'>('cost');

  useEffect(() => {
    if (!canvasRef.current || recommendations.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sort recommendations based on active tab
    const sortedRecs = [...recommendations].sort((a, b) => {
      if (activeTab === 'cost') {
        return a.estimatedCost - b.estimatedCost;
      } else {
        return b.model.performance - a.model.performance;
      }
    });

    // Set dimensions
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = canvas.width - margin.left - margin.right;
    const height = canvas.height - margin.top - margin.bottom;

    // Calculate scales
    const barWidth = width / sortedRecs.length / 1.5;
    const barSpacing = width / sortedRecs.length;
    const maxCost = Math.max(...sortedRecs.map(r => r.estimatedCost)) * 1.1;
    const maxPerformance = Math.max(...sortedRecs.map(r => r.model.performance)) * 1.1;

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 2;
    // X axis
    ctx.moveTo(margin.left, canvas.height - margin.bottom);
    ctx.lineTo(canvas.width - margin.right, canvas.height - margin.bottom);
    // Y axis
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, canvas.height - margin.bottom);
    ctx.stroke();

    // Draw title
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#1F2937';
    ctx.textAlign = 'center';
    ctx.fillText(
      activeTab === 'cost' 
        ? `${workloadType === 'training' ? 'Training' : 'Inference'} Cost Comparison`
        : 'Performance Comparison', 
      canvas.width / 2, 
      margin.top / 2
    );

    // Draw bars
    sortedRecs.forEach((rec, i) => {
      const value = activeTab === 'cost' 
        ? rec.estimatedCost 
        : rec.model.performance;
      const maxValue = activeTab === 'cost' ? maxCost : maxPerformance;
      const barHeight = (value / maxValue) * height;
      const x = margin.left + i * barSpacing + barSpacing / 2 - barWidth / 2;
      const y = canvas.height - margin.bottom - barHeight;

      // Draw bar
      ctx.fillStyle = getBarColor(rec.model, i);
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw model name
      ctx.save();
      ctx.translate(x + barWidth / 2, canvas.height - margin.bottom + 10);
      ctx.rotate(Math.PI / 4);
      ctx.textAlign = 'left';
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#374151';
      ctx.fillText(`${rec.model.manufacturer} ${rec.model.name}`, 0, 0);
      ctx.restore();

      // Draw value on top of bar
      ctx.textAlign = 'center';
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#374151';
      const valueText = activeTab === 'cost' 
        ? `$${value.toFixed(2)}/hr` 
        : `${value}`;
      ctx.fillText(valueText, x + barWidth / 2, y - 5);
    });

    // Draw Y axis labels
    const yAxisSteps = 5;
    for (let i = 0; i <= yAxisSteps; i++) {
      const value = activeTab === 'cost' 
        ? (maxCost / yAxisSteps) * i 
        : (maxPerformance / yAxisSteps) * i;
      const y = canvas.height - margin.bottom - (height / yAxisSteps) * i;
      
      // Draw tick
      ctx.beginPath();
      ctx.moveTo(margin.left - 5, y);
      ctx.lineTo(margin.left, y);
      ctx.strokeStyle = '#6B7280';
      ctx.stroke();
      
      // Draw label
      ctx.textAlign = 'right';
      ctx.fillStyle = '#4B5563';
      ctx.font = '12px sans-serif';
      
      const label = activeTab === 'cost' 
        ? `$${value.toFixed(2)}` 
        : value.toFixed(0);
      ctx.fillText(label, margin.left - 10, y + 4);
    }

  }, [recommendations, activeTab, workloadType]);

  const getBarColor = (model: GPUModel, index: number): string => {
    const manufacturerColors: Record<string, string> = {
      'NVIDIA': '#76A9FA',
      'AMD': '#F87171',
      'Google': '#34D399',
      'Intel': '#A78BFA'
    };
    
    return manufacturerColors[model.manufacturer] || `hsl(${index * 45}, 70%, 60%)`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">GPU Comparison</h2>
      
      <div className="flex space-x-2 mb-4">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === 'cost'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          onClick={() => setActiveTab('cost')}
        >
          Cost
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === 'performance'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
      </div>

      <div className="w-full aspect-[16/9] bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="w-full h-full"
        />
      </div>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>* Performance is measured on a relative scale where higher is better</p>
        <p>* Costs are estimated hourly rates based on current market pricing</p>
      </div>
    </div>
  );
};

export default CostComparison;