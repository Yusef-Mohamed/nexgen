import { unstable_setRequestLocale } from "next-intl/server";
import { ChatLayout } from "./components/ChatLayout";
import { Metadata } from "next";
import { getMetadataChatPage } from "@/getMetaData";
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return getMetadataChatPage({ params });
}
const ChatPage = async ({
  params: { locale },
  searchParams: { selectedChat },
}: {
  params: { locale: string };
  searchParams: { selectedChat?: string };
}) => {
  unstable_setRequestLocale(locale);

  return (
    <main
      style={{
        maxHeight: "calc(100vh - 76px)",
        height: "calc(100vh - 76px)",
      }}
      className="flex flex-col h-screen bg-dash-ground px-2 py-6 lg:px-6 sm:px-4"
    >
      <ChatLayout selectedChat={selectedChat} />
    </main>
  );
};

export default ChatPage;
