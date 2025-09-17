import { axiosInstance } from "@/app/lib/utils";
import { IReview } from "@/types";
import { create } from "zustand";

interface CourseReviewState {
  data: {
    title: string;
    ratings: number;
  };
  idToEdit: string;
  isLoading: boolean;
  lastFetched: number | null;
  setData: (newData: Partial<{ title: string; ratings: number }>) => void;
  setIdToEdit: (id: string) => void;
  setIsLoading: (loading: boolean) => void;
  fetchReview: (courseId: string, token: string) => Promise<void>;
  submitReview: (courseId: string, token: string) => Promise<void>;
  deleteReview: (token: string) => Promise<void>;
}

export const useCourseReviewStore = create<CourseReviewState>((set, get) => ({
  data: { title: "", ratings: 5 },
  idToEdit: "",
  isLoading: false,
  lastFetched: null,

  setData: (newData) => {
    set((state) => ({ data: { ...state.data, ...newData } }));
  },
  setIdToEdit: (id) => set({ idToEdit: id }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  fetchReview: async (courseId, token) => {
    const { lastFetched, setData, setIdToEdit } = get();

    if (!token) return;

    const now = Date.now();
    const shouldRefetch = !lastFetched || now - lastFetched > 5 * 60 * 1000;

    if (!shouldRefetch) {
      return;
    }

    set({ isLoading: true });

    try {
      const response = await axiosInstance.get("/reviews/myReviews", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allReviews = response.data.data as IReview[];
      const thisReview = allReviews.find(
        (review) => review.course?._id === courseId
      );

      if (thisReview) {
        setIdToEdit(thisReview._id);
        setData({ title: thisReview.title, ratings: thisReview.ratings });
      } else {
        setIdToEdit("");
        setData({ title: "", ratings: 5 });
      }

      set({ lastFetched: now });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  submitReview: async (courseId, token) => {
    const { data, idToEdit, setIsLoading, setIdToEdit } = get();

    if (!token) return;

    setIsLoading(true);

    try {
      if (idToEdit) {
        await axiosInstance.put(
          `/reviews/${idToEdit}`,
          { ...data, course: courseId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        const response = await axiosInstance.post(
          `/reviews`,
          { ...data, course: courseId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIdToEdit(response.data.data._id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  },

  deleteReview: async (token) => {
    const { idToEdit, setIsLoading, setIdToEdit, setData } = get();

    if (!token || !idToEdit) return;

    setIsLoading(true);

    try {
      await axiosInstance.delete(`/reviews/${idToEdit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIdToEdit("");
      setData({ title: "", ratings: 5 });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  },
}));
