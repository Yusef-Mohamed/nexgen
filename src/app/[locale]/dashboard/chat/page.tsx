import { ChatLayout } from "./components/ChatLayout";
import { Metadata } from "next";
import { getMetadataChatPage } from "@/getMetaData";
import DashboardContainer from "../components/DashboardContainer";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  return getMetadataChatPage({ params });
}
const ChatPage = async (props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ selectedChat?: string }>;
}) => {
  const searchParams = await props.searchParams;

  const { selectedChat } = searchParams;

  return (
    <main className="flex h-[calc(100vh-76px)] flex-col !bg-transparent px-3 py-4 sm:px-5 lg:px-6">
      <DashboardContainer className="min-h-0 flex-1">
        <ChatLayout selectedChat={selectedChat} />
      </DashboardContainer>
    </main>
  );
};

export default ChatPage;
