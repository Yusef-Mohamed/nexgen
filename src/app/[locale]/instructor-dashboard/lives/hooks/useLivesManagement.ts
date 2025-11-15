import { useState, useEffect, useCallback, useMemo } from "react";
import { ILive } from "@/types";
import { axiosInstance } from "@/app/lib/utils";
import { AxiosError } from "axios";
import { format } from "date-fns";

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
  const [loading, setLoading] = useState(true);

  // Fetch all lives once with limit=1000
  const fetchLives = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/lives/getAll?limit=1000`);
      setLives(response.data.data || []);
    } catch (error) {
      console.error("Error fetching lives:", error);
      setLives([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Client-side filtering based on selectedDate and selectedCourse
  const filteredLives = useMemo(() => {
    let filtered = [...lives];

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(
        (live) => format(new Date(live.date), "yyyy-MM-dd") === selectedDate
      );
    }

    // Filter by course
    if (selectedCourse && selectedCourse !== "all") {
      filtered = filtered.filter((live) =>
        live.package.some((pkg) => pkg._id === selectedCourse)
      );
    }

    return filtered;
  }, [lives, selectedDate, selectedCourse]);

  // Delete live from state (for immediate UI update)
  const deleteLiveFromState = (liveId: string) => {
    setLives((prev) => prev.filter((live) => live._id !== liveId));
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

  // Initial fetch on mount only
  useEffect(() => {
    fetchLives();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
