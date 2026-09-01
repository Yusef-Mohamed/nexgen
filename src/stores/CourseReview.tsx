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

  setData: (newData) => {
    set((state) => ({ data: { ...state.data, ...newData } }));
  },
  setIdToEdit: (id) => set({ idToEdit: id }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  fetchReview: async (courseId, token) => {
    const { setData, setIdToEdit } = get();

    if (!token) return;

    set({ isLoading: true });

    try {
      const response = await axiosInstance.get("/reviews/myReview", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allReviews: IReview[] = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      const thisReview = allReviews.find((review) => {
        const reviewCourse = review.course as IReview["course"] | string;
        return typeof reviewCourse === "string"
          ? reviewCourse === courseId
          : reviewCourse?._id === courseId;
      });

      if (thisReview) {
        setIdToEdit(thisReview._id);
        setData({ title: thisReview.title, ratings: thisReview.ratings });
      } else {
        setIdToEdit("");
        setData({ title: "", ratings: 5 });
      }

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
      throw error;
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
      throw error;
    } finally {
      setIsLoading(false);
    }
  },
}));
