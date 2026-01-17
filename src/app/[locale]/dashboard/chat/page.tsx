
import { ChatLayout } from "./components/ChatLayout";
import { Metadata } from "next";
import { getMetadataChatPage } from "@/getMetaData";
export async function generateMetadata(
  props: {
    params: Promise<{ locale: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  return getMetadataChatPage({ params });
}
const ChatPage = async (
  props: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ selectedChat?: string }>;
  }
) => {
  const searchParams = await props.searchParams;

  const {
    selectedChat
  } = searchParams;

  const params = await props.params;

  const {
    locale
  } = params;

  

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
