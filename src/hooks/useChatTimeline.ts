"use client";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { isAxiosError } from 'axios';
import { axiosInstance } from '@/app/lib/utils';
import { useAuth } from '@/components/auth-provider';
import { useChatStore } from '@/stores/ChatStore';
import { timelines, type WireMessage } from '@/lib/chat-timeline-cache';
import { ChatTimeline, type TimelinePage } from '@/lib/chat-timeline-core';
import type { IChat, IUser } from '@/types';
import { markChatTiming, getChatTimings, recordChatRequest } from '@/lib/chat-timeline-timing';
if (process.env.NEXT_PUBLIC_CHAT_TIMING === 'true' && typeof window !== 'undefined') Object.assign(window, { getChatTimings });

export function useChatTimeline(chatId: string, target?: string) {
  const { user, token } = useAuth();
  const account = user?._id || '';
  const [active, setActive] = useState(true);
  const timeline = useMemo(() => {
    const transport = () => ({
      page: async (params: { around?: string; before?: string; after?: string }, signal: AbortSignal) => {
        markChatTiming(chatId, 'request');
        const started = performance.now();
        const page = (await axiosInstance.get<TimelinePage<WireMessage>>(`/chats/${chatId}/timeline`, { params, signal, headers: { Authorization: `Bearer ${token}` } })).data;
        recordChatRequest(params.around ? 'around' : params.before ? 'before' : params.after ? 'after' : 'latest', started);
        markChatTiming(chatId, 'response'); return page;
      },
      sync: async (known: { id: string; version: number }[], latest: boolean, signal: AbortSignal) => {
        const started = performance.now();
        const result = (await axiosInstance.post<{ data: WireMessage[]; removedIds: string[]; latest: TimelinePage<WireMessage> | null }>(`/chats/${chatId}/timeline/sync`, { known, latest }, { signal, headers: { Authorization: `Bearer ${token}` } })).data;
        recordChatRequest('sync', started); return result;
      },
      accessDenied: (error: unknown) => isAxiosError(error) && ([401, 403, 405, 406, 407].includes(error.response?.status || 0) || error.response?.data?.code === 'CHAT_NOT_FOUND'),
    });
    return typeof window === 'undefined' ? new ChatTimeline(transport()) : timelines.get(`${account}:${chatId}`, transport);
  }, [account, chatId, token]);
  const subscribe = useCallback((listener: () => void) => active ? timeline.subscribe(listener) : () => {}, [active, timeline]);
  const state = useSyncExternalStore(subscribe, timeline.getSnapshot, timeline.getSnapshot);
  useEffect(() => { if (active && account && token && chatId) { markChatTiming(chatId, 'navigation'); void timeline.open(target); } }, [active, account, chatId, token, target, timeline]);
  useEffect(() => {
    const visibility = () => {
      const foreground = document.visibilityState === 'visible';
      setActive(foreground);
      if (!foreground) timeline.invalidate(false);
      else if (navigator.onLine) void timeline.revalidate();
    };
    const reconnect = () => void timeline.revalidate();
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('online', reconnect);
    const poll = setInterval(() => {
      if (document.visibilityState === 'visible' && navigator.onLine && !useChatStore.getState().socket?.connected) void timeline.revalidate();
    }, 10000);
    return () => { clearInterval(poll); document.removeEventListener('visibilitychange', visibility); window.removeEventListener('online', reconnect); };
  }, [timeline]);
  const chat = useMemo(() => {
    if (!state.summary) return null;
    const summary = state.summary;
    const people = (summary.participants || []) as { user: IUser; isAdmin: boolean }[];
    return { ...summary, participants: people.map(p => ({ user: p.user._id, userDetails: p.user, isAdmin: p.isAdmin, _id: p.user._id })) } as unknown as IChat;
  }, [state.summary]);
  return { timeline, state, chat, active };
}
