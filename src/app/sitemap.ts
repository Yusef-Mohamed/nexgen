import { MetadataRoute } from "next";
import { API_URL } from "@/constants";
import { IBlog, ICourse, IPackage, ICoursePackage } from "../types";
import axios from "axios";

const BASE_URL = "https://nexgen-academy.com";

// Static pages for SEO
const staticPages = [
  // Main pages
  "",
  "about",
  "contact",
  "courses",
  "blogs",
  // "instructor",
  // Legal pages
  "privacy-policy",
  "terms-of-services",
  "return-and-refund-policy",
  // Auth pages (optional but good for SEO)
  "sign-in",
  "sign-up",
  "forgot-password",
];

// Helper to create axios instance for sitemap
const createAxiosInstance = () => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      "Accept-Language": "en",
    },
  });
};

// Fetch courses
const getCourses = async (): Promise<ICourse[]> => {
  try {
    const axiosInstance = createAxiosInstance();
    const res = await axiosInstance.get("/courses?status=active&limit=1000");
    return res.data.data || [];
  } catch (e) {
    console.error("Error fetching courses for sitemap:", e);
    return [];
  }
};

// Fetch blogs
const getBlogs = async (): Promise<IBlog[]> => {
  try {
    const axiosInstance = createAxiosInstance();
    const res = await axiosInstance.get("/articals?status=active&limit=1000");
    return res.data.data || [];
  } catch (e) {
    console.error("Error fetching blogs for sitemap:", e);
    return [];
  }
};

// Fetch services (packages)
const getServices = async (): Promise<IPackage[]> => {
  try {
    const axiosInstance = createAxiosInstance();
    const res = await axiosInstance.get("/packages?status=active&limit=1000");
    return res.data.data || [];
  } catch (e) {
    console.error("Error fetching services for sitemap:", e);
    return [];
  }
};

// Fetch learning paths (course packages)
const getLearningPaths = async (): Promise<ICoursePackage[]> => {
  try {
    const axiosInstance = createAxiosInstance();
    const res = await axiosInstance.get(
      "/coursePackages?status=active&limit=1000"
    );
    return res.data.data || [];
  } catch (e) {
    console.error("Error fetching learning paths for sitemap:", e);
    return [];
  }
};

// Generate URL for a path with locale
const getUrl = (locale: string, path: string): string => {
  if (path === "") {
    return `${BASE_URL}/${locale}`;
  }
  return `${BASE_URL}/${locale}/${path}`;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ["en", "ar"];
  const now = new Date();

  // Fetch dynamic data
  const [courses, blogs, services, learningPaths] = await Promise.all([
    getCourses(),
    getBlogs(),
    getServices(),
    getLearningPaths(),
  ]);

  const sitemapEntries: MetadataRoute.Sitemap = [];
  // Add static pages for each locale
  for (const locale of locales) {
    for (const page of staticPages) {
      const priority =
        page === "" ? 1.0 : page === "courses" || page === "about" ? 0.9 : 0.8;
      const changeFrequency =
        page === "" ? "daily" : page === "blogs" ? "daily" : "weekly";

      sitemapEntries.push({
        url: getUrl(locale, page),
        lastModified: now,
        changeFrequency,
        priority,
      });
    }

    for (const course of courses) {
      const slug = course.slug || course._id;
      sitemapEntries.push({
        url: getUrl(locale, `courses/${slug}`),
        lastModified: course.updatedAt ? new Date(course.updatedAt) : now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    // Add dynamic blog pages
    for (const blog of blogs) {
      sitemapEntries.push({
        url: getUrl(locale, `blogs/${blog._id}`),
        lastModified: blog.updatedAt ? new Date(blog.updatedAt) : now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    // Add dynamic service pages
    for (const service of services) {
      const slug = service.slug || service._id;
      sitemapEntries.push({
        url: getUrl(locale, `services/${slug}`),
        lastModified: service.updatedAt ? new Date(service.updatedAt) : now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    // Add dynamic learning path pages
    for (const learningPath of learningPaths) {
      const slug = learningPath.slug || learningPath._id;
      sitemapEntries.push({
        url: getUrl(locale, `learning-paths/${slug}`),
        lastModified: learningPath.updatedAt
          ? new Date(learningPath.updatedAt)
          : now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return sitemapEntries;
}
