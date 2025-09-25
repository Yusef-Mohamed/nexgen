import { Metadata } from "next";
import InstructorLivesClient from "./components/InstructorLivesClient";

export const metadata: Metadata = {
  title: "Instructor Lives",
  description: "Manage your live sessions",
};

const InstructorLives = () => {
  return <InstructorLivesClient />;
};

export default InstructorLives;
