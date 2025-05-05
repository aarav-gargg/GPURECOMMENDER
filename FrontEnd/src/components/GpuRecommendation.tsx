import React, { useState } from "react";
import WorkloadForm from "../components/WorkloadForm";
import RecommendationsList from "../components/RecommendationsList";
import { Recommendation, WorkloadRequirements } from "../types";

const GpuRecommendationPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [workloadType, setWorkloadType] = useState<"training" | "inference">("training");
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (requirements: WorkloadRequirements) => {
    setLoading(true);
    setWorkloadType(requirements.workloadType); // Needed to pass to RecommendationsList

    try {
      const response = await fetch("https://gpurecommender.onrender.com/api/recommendations/gpu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requirements),
      });

      if (!response.ok) throw new Error("Failed to fetch recommendations");

      const data: Recommendation[] = await response.json();
      setRecommendations(data);
    } catch (err) {
      console.error("Error:", err);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAiAssist = async (description: string) => {
    try {
      const res = await fetch("/api/ai-assist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      const filledRequirements: WorkloadRequirements = await res.json();
      await handleFormSubmit(filledRequirements);
    } catch (err) {
      console.error("AI assist failed:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <WorkloadForm onSubmit={handleFormSubmit} onAiAssist={handleAiAssist} />

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-300">Loading recommendations...</p>
      ) : (
        <RecommendationsList recommendations={recommendations} workloadType={workloadType} />
      )}
    </div>
  );
};

export default GpuRecommendationPage;
