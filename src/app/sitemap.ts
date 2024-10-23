import { MetadataRoute } from "next";
import { IBlog, ICourse } from "../types";
import { axiosInstance, getUrlFromPath } from "@/lib/utils";
const pages = [
  "contact",
  "about",
  "blogs",
  "chat",
  "courses",
  "dashboard",
  "dashboard/analytics",
  "dashboard/community",
  "dashboard/lives",
  "dashboard/marketing",
  "dashboard/marketing/team",
  "dashboard/practice",
  "dashboard/profile",
  "dashboard/settings",
  "forgot-password",
  "reset-code",
  "reset-password",
  "sign-in",
  "sign-up",
  "terms-of-service",
];

const getProducts = async () => {
  try {
    const res = await axiosInstance.get("/courses");
    return res.data.data as ICourse[];
  } catch (e) {
    return [];
  }
};
const getBlogs = async () => {
  try {
    const res = await axiosInstance.get("/blogs");
    return res.data.data;
  } catch (e) {
    return [];
  }
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = (await getProducts()) as ICourse[];
  const blogs = (await getBlogs()) as IBlog[];
  const productsEntries = [
    ...products.map((product) => "courses/" + product._id),
    ...products.map((product) => "courses/" + product._id + "/placement-exam"),
    ...products.map((product) => "learn/" + product._id),
  ];
  const blogsEntries = blogs.map((blog) => "blogs/" + blog._id);
  const allPages = [...pages, ...productsEntries, ...blogsEntries];
  const enLocales = allPages.map((page) => {
    return {
      url: getUrlFromPath("/" + "en" + "/" + page),
    };
  });
  const arLocales = allPages.map((page) => {
    return {
      url: getUrlFromPath("/" + "ar" + "/" + page),
    };
  });

  return [...arLocales, ...enLocales];
}
