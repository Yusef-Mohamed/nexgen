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
    <main className="relative flex h-[calc(100vh-76px)] flex-col overflow-hidden bg-background px-3 py-4 sm:px-5 lg:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 end-10 size-72 rounded-full bg-primary/10 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-72 start-4 size-64 rounded-full bg-secondary/10 blur-[100px]"
      />
      <DashboardContainer className="relative z-10 min-h-0 flex-1">
        <ChatLayout selectedChat={selectedChat} />
      </DashboardContainer>
    </main>
  );
};

export default ChatPage;
