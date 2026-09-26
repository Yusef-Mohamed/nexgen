import axios from "axios";
import { API_URL } from "@/constants";

export type PublicCurriculumLesson = {
  title: string;
  lessonDuration: number | null;
  order: number | null;
  type: "live" | "recorded" | null;
};

export type PublicCurriculumSection = {
  section: string;
  order: number | null;
  lessons: PublicCurriculumLesson[];
};

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid public curriculum response");
  }
  return value as Record<string, unknown>;
}

function optionalNumber(value: unknown): number | null {
  if (value === null) return null;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error("Invalid public curriculum number");
  }
  return value;
}

// The server owns disclosure protection. Client allowlisting also avoids
// retaining unexpected fields if the API contract changes.
export function normalizePublicCurriculum(value: unknown): PublicCurriculumSection[] {
  const response = record(value);
  if (response.schemaVersion !== 1 || response.previewOnly !== true || !Array.isArray(response.data)) {
    throw new Error("Unsupported public curriculum response");
  }
  return response.data.map((value) => {
    const section = record(value);
    if (typeof section.section !== "string" || !Array.isArray(section.lessons)) {
      throw new Error("Invalid public curriculum section");
    }
    return {
      section: section.section,
      order: optionalNumber(section.order),
      lessons: section.lessons.map((value): PublicCurriculumLesson => {
        const lesson = record(value);
        if (typeof lesson.title !== "string" ||
            (lesson.type !== "live" && lesson.type !== "recorded" && lesson.type !== null)) {
          throw new Error("Invalid public curriculum lesson");
        }
        return {
          title: lesson.title,
          lessonDuration: optionalNumber(lesson.lessonDuration),
          order: optionalNumber(lesson.order),
          type: lesson.type,
        };
      }),
    };
  });
}

export async function getPublicCurriculum(identifier: string, locale: "en" | "ar", signal?: AbortSignal) {
  const id = identifier.trim();
  if (!id) throw new Error("A course identifier is required");
  // This public request deliberately avoids the authenticated cookie interceptor.
  const response = await axios.get<unknown>(
    API_URL.replace(/\/+$/, "") + "/lessons/sectionLessons/" + encodeURIComponent(id) + "/public",
    { signal, timeout: 15000, withCredentials: false, headers: { "Accept-Language": locale } },
  );
  return normalizePublicCurriculum(response.data);
}
