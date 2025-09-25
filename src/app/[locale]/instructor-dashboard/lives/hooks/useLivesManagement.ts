import { useState, useEffect, useCallback } from "react";
import { ILive } from "@/types";
import { axiosInstance } from "@/app/lib/utils";
import { AxiosError } from "axios";

interface LiveFormData {
  title: {
    en: string;
    ar: string;
  };
  link: string;
  date: string;
  instructor: string;
  package: string[];
}

interface UseLivesManagementProps {
  selectedDate: string;
  selectedCourse: string;
}

export const useLivesManagement = ({
  selectedDate,
  selectedCourse,
}: UseLivesManagementProps) => {
  const [lives, setLives] = useState<ILive[]>([]);
  const [filteredLives, setFilteredLives] = useState<ILive[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch lives
  const fetchLives = useCallback(async () => {
    try {
      setLoading(true);
      const searchParams = new URLSearchParams();
      if (selectedDate) searchParams.append("day", selectedDate);
      if (selectedCourse !== "all" && selectedCourse) {
        searchParams.append("package", selectedCourse);
      }

      const search = searchParams.toString();
      const response = await axiosInstance.get(
        `/lives/getAll${search ? "?" + search : ""}`
      );

      setLives(response.data.data || []);
      setFilteredLives(response.data.data || []);
    } catch (error) {
      console.error("Error fetching lives:", error);
      setLives([]);
      setFilteredLives([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedCourse]);

  // Delete live from state (for immediate UI update)
  const deleteLiveFromState = (liveId: string) => {
    setLives((prev) => prev.filter((live) => live._id !== liveId));
    setFilteredLives((prev) => prev.filter((live) => live._id !== liveId));
  };

  // Fetch single live for editing
  const fetchSingleLive = async (liveId: string): Promise<ILive | null> => {
    try {
      const response = await axiosInstance.get(`/lives/${liveId}`);
      return response?.data?.data || null;
    } catch (error) {
      console.error("Error fetching live:", error);
      const typedError = error as AxiosError<{ message: string }>;
      const errorMessage =
        typedError?.response?.data?.message || typedError?.message;
      console.error("Fetch error:", errorMessage);
      return null;
    }
  };

  // Create new live
  const createLive = async (liveData: LiveFormData): Promise<ILive | null> => {
    try {
      const response = await axiosInstance.post("/lives", liveData);
      return response?.data?.data || null;
    } catch (error) {
      console.error("Error creating live:", error);
      throw error;
    }
  };

  // Update existing live
  const updateLive = async (
    liveId: string,
    liveData: LiveFormData
  ): Promise<ILive | null> => {
    try {
      const response = await axiosInstance.put(`/lives/${liveId}`, liveData);
      return response?.data?.data || null;
    } catch (error) {
      console.error("Error updating live:", error);
      throw error;
    }
  };

  // Delete live
  const deleteLive = async (liveId: string): Promise<boolean> => {
    try {
      await axiosInstance.delete(`/lives/${liveId}`);
      return true;
    } catch (error) {
      console.error("Error deleting live:", error);
      throw error;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLives();
  }, [fetchLives]);

  return {
    lives,
    filteredLives,
    loading,
    fetchLives,
    deleteLiveFromState,
    fetchSingleLive,
    createLive,
    updateLive,
    deleteLive,
  };
};
