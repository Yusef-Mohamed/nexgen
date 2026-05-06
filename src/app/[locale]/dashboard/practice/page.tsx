import DisplayPosts from "./components/DisplayPosts";

const Dashboard = async (props: { params: Promise<{ locale: string }> }) => {
  const params = await props.params;

  const { locale } = params;

  return (
    <main
      style={{
        minHeight: "calc(100vh - 76px)",
      }}
      className="flex flex-col px-2 py-6 lg:px-6 sm:px-4 bg-dash-ground"
    >
      <DisplayPosts />
    </main>
  );
};

export default Dashboard;
