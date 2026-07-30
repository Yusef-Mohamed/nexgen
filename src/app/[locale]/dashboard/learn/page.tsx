import DashboardContainer from "../components/DashboardContainer";
import DisplayCourses from "./components/DisplayCourses";

const Dashboard = async () => {
  return (
    <main className="min-h-[calc(100vh-76px)] !bg-transparent px-3 py-6 sm:px-5 sm:py-8 lg:px-6">
      <DashboardContainer>
        <DisplayCourses />
      </DashboardContainer>
    </main>
  );
};

export default Dashboard;
