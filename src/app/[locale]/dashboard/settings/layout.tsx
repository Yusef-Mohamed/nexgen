
import Sidebar from "./components/Sidebar";

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }>
) {
  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

  

  return (
    <main
      style={{
        minHeight: "calc(100vh - 76px)",
      }}
      className="flex flex-col items-start gap-6 px-2 py-6 sm:gap-8 lg:gap-10 xl:flex-row lg:px-6 sm:px-4"
    >
      <Sidebar />
      <div className="flex-1 w-full p-5 bg-clear-ground lg:p-10 md:p-8 sm:p-6 cardShadow rounded-xl">
        {children}
      </div>
    </main>
  );
}
