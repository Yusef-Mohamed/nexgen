import { Metadata } from "next";
import BlogFormClient from "../components/BlogFormClient";

export const metadata: Metadata = {
  title: "Blog Form",
  description: "Create or edit blog post",
};

const BlogFormPage = () => {
  return <BlogFormClient />;
};

export default BlogFormPage;
