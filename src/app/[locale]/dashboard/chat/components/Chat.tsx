import { useEffect } from 'react';
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import { useChatStore } from '@/stores/ChatStore';
import { useTranslations } from 'next-intl';
import { ChatList } from './ChatList';
import { cn } from '@/lib/utils';

export function Chat({ selectedChat }: { selectedChat?: string }) {
  const setSelectedChatId = useChatStore(state => state.setSelectedChatId);
  const text = useTranslations('chat');
  useEffect(() => { setSelectedChatId(selectedChat || ''); }, [selectedChat, setSelectedChatId]);
  return <div className={cn('relative z-10 flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-background/60', !selectedChat && 'max-xl:hidden')}>
    {selectedChat ? <ChatList key={selectedChat} chatId={selectedChat} /> :
      <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <HiOutlineChatBubbleLeftRight className="size-12 text-primary" />
        <h1 className="text-2xl font-black text-text-1">{text('selectChat')}</h1>
        <p className="text-sm text-text-3">{text('selectChatDescription')}</p>
      </div>}
  </div>;
}
