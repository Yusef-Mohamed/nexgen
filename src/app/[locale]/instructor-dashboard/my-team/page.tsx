import MyTeamClient from "./components/MyTeamClient";

export default function MyTeamPage() {
  return (
    <main
      style={{
        minHeight: "calc(100vh - 76px)",
      }}
      className="w-full max-w-full bg-background px-2 py-6 overflow-hidden lg:px-6 sm:px-4"
    >
      <MyTeamClient />
    </main>
  );
}
