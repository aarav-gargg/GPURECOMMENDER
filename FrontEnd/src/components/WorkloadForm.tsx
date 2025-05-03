import React, { useState } from 'react';
import { WorkloadRequirements } from '../types';
import { modelTypeOptions, datasetSizeOptions, regionOptions } from '../data/gpuModels';
import { MessageSquareText } from 'lucide-react';

interface WorkloadFormProps {
  onSubmit: (requirements: WorkloadRequirements) => void;
  onAiAssist: (description: string) => void;
}

const WorkloadForm: React.FC<WorkloadFormProps> = ({ onSubmit, onAiAssist }) => {
  const [requirements, setRequirements] = useState<WorkloadRequirements>({
    modelType: '',
    datasetSize: '',
    workloadType: 'training',
    region: '',
    maxBudget: 0,
    additionalRequirements: ''
  });

  const [aiDescription, setAiDescription] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRequirements(prev => ({
      ...prev,
      [name]: name === 'maxBudget' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(requirements);
  };

  const handleAiAssist = () => {
    if (aiDescription.trim()) {
      onAiAssist(aiDescription);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Workload Requirements</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="modelType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Model Type
            </label>
            <select
              id="modelType"
              name="modelType"
              value={requirements.modelType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="" disabled>Select model type</option>
              {modelTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="datasetSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Dataset Size
            </label>
            <select
              id="datasetSize"
              name="datasetSize"
              value={requirements.datasetSize}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="" disabled>Select dataset size</option>
              {datasetSizeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Workload Type
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="workloadType"
                  value="training"
                  checked={requirements.workloadType === 'training'}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Training</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="workloadType"
                  value="inference"
                  checked={requirements.workloadType === 'inference'}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Inference</span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Region
            </label>
            <select
              id="region"
              name="region"
              value={requirements.region}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="" disabled>Select region</option>
              {regionOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="maxBudget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Maximum Budget ($ per hour)
            </label>
            <input
              type="number"
              id="maxBudget"
              name="maxBudget"
              value={requirements.maxBudget || ''}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="additionalRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Additional Requirements
            </label>
            <textarea
              id="additionalRequirements"
              name="additionalRequirements"
              value={requirements.additionalRequirements}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            />
          </div>
        </div>

        <div className="pt-2">
          <button type="button" onClick={() => setShowAiInput(!showAiInput)} className="inline-flex items-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
            <MessageSquareText size={16} className="mr-1" />
            Not sure about the details? Let AI help you fill the form
          </button>
        </div>

        {showAiInput && (
          <div className="mt-4 p-4 bg-purple-50 dark:bg-gray-700 rounded-lg border border-purple-200 dark:border-gray-600">
            <label htmlFor="aiDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Describe your workload in plain language
            </label>
            <textarea
              id="aiDescription"
              value={aiDescription}
              onChange={(e) => setAiDescription(e.target.value)}
              rows={3}
              placeholder="Example: I want to fine-tune a BERT model on 50GB of text data for sentiment analysis. My budget is around $2 per hour."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none mb-3"
            />
            <button
              type="button"
              onClick={handleAiAssist}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
            >
              <MessageSquareText size={16} className="mr-2" />
              Auto-fill with AI
            </button>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Get Recommendations
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkloadForm;