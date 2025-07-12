"use client";

import { useState, useEffect } from "react";
import type { Question } from "@/types";
import { questionsApi } from "@/lib/api";

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await questionsApi.getQuestions();
      setQuestions(data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return {
    questions,
    loading,
    refreshQuestions: fetchQuestions,
  };
}
