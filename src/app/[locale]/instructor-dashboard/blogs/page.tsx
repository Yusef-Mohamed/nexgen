import { Metadata } from "next";
import InstructorBlogsClient from "./components/InstructorBlogsClient";

export const metadata: Metadata = {
  title: "My Blogs",
  description: "Manage your blog posts",
};

const InstructorBlogs = () => {
  return <InstructorBlogsClient />;
};

export default InstructorBlogs;
