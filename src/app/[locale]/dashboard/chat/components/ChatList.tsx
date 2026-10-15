import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { VariableSizeList, type ListChildComponentProps, type ListOnItemsRenderedProps } from 'react-window';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useChatTimeline } from '@/hooks/useChatTimeline';
import type { WireMessage } from '@/lib/chat-timeline-cache';
import { useAuth } from '@/components/auth-provider';
import { useChatStore } from '@/stores/ChatStore';
import MessageCard, { MessageCardSkeleton } from '@/components/cards/MessageCard';
import { Button } from '@/components/ui/button';
import { axiosInstance } from '@/app/lib/utils';
import { safetyCopy } from '@/lib/safety-contract';
import { markChatTiming } from '@/lib/chat-timeline-timing';
import ChatTopbar from './ChatTopbar';
import ChatBottombar from './ChatBottomBar';

type RowData = { rows: WireMessage[]; userId: string; locale: string; target?: string; measure: (id: string, height: number) => void };
const sameGroup = (a?: WireMessage, b?: WireMessage) => Boolean(a && b && a.sender?._id === b.sender?._id && new Date(a.createdAt).toDateString() === new Date(b.createdAt).toDateString() && Math.abs(Date.parse(a.createdAt) - Date.parse(b.createdAt)) <= 120000);
const Row = memo(function Row({ index, style, data }: ListChildComponentProps<RowData>) {
  const ref = useRef<HTMLDivElement>(null);
  const measureRow = data.measure;
  const message = data.rows[index], previous = data.rows[index - 1], next = data.rows[index + 1];
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => measureRow(message._id, Math.ceil(element.getBoundingClientRect().height));
    const observer = new ResizeObserver(measure);
    observer.observe(element); measure();
    return () => observer.disconnect();
  }, [measureRow, message._id]);
  const newDay = !previous || new Date(previous.createdAt).toDateString() !== new Date(message.createdAt).toDateString();
  return <div style={style}>
    <div ref={ref} data-message-id={message._id} className={message._id === data.target ? 'rounded-xl bg-primary/15 ring-2 ring-inset ring-primary/40' : ''}>
      {newDay ? <p dir="ltr" className="py-4 text-center text-xs text-text-3">{new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(message.createdAt)).replaceAll("/", "-")}</p> : null}
      <MessageCard message={message} isMine={message.sender?._id === data.userId} isFirst={!sameGroup(previous, message)} isLast={!sameGroup(message, next)} />
    </div>
  </div>;
});
export function ChatList({ chatId }: { chatId: string }) {
  const params = useSearchParams(), locale = useLocale(), { user, token } = useAuth();
  const target = params.get('messageId') || undefined;
  const { timeline, state, chat, active } = useChatTimeline(chatId, target);
  const rows = state.rows;
  const common = safetyCopy[locale === 'ar' ? 'ar' : 'en'];
  const loadingMessagesLabel = locale === 'ar' ? 'جار تحميل الرسائل...' : 'Loading messages...';
  const latestLabel = locale === 'ar' ? '↓ أحدث الرسائل' : '↓ Latest';
  const list = useRef<VariableSizeList<RowData>>(null), outer = useRef<HTMLDivElement>(null), container = useRef<HTMLDivElement>(null);
  const sizes = useRef(new Map<string, number>()), rowsRef = useRef(rows);
  useLayoutEffect(() => { rowsRef.current = rows; }, [rows]);
  const [height, setHeight] = useState(500), [atBottom, setAtBottom] = useState(false);
  const [farFromLatest, setFarFromLatest] = useState(false);
  const onItemsRendered = useCallback(({ visibleStopIndex }: ListOnItemsRenderedProps) => {
    // Badge visibility must not change the exact live-end/read-receipt boundary.
    setFarFromLatest(rows.length - 1 - visibleStopIndex >= 20);
  }, [rows.length]);
  const follow = useRef(!target && !timeline.anchor), positioned = useRef<string | null>(null), initialized = useRef(false);
  const readerMoved = useRef(false), viewportHeight = useRef(height);
  useLayoutEffect(() => { viewportHeight.current = height; }, [height]);
  const frame = useRef<number | null>(null);
  const settleFrame = useRef<number | null>(null), restoring = useRef(false);
  const observeRef = useRef<() => void>(() => {});
  const rowSize = useCallback((index: number) => sizes.current.get(rowsRef.current[index]?._id) || 120, []);
  const markFirstMessage = useCallback(() => {
    const current = timeline.getSnapshot(), viewport = outer.current;
    if (!viewport || current.loading || !current.valid) return;
    const nodes = Array.from(viewport.querySelectorAll<HTMLElement>('[data-message-id]'));
    const bounds = viewport.getBoundingClientRect();
    if (nodes.some(node => (!target || node.dataset.messageId === target) && node.getBoundingClientRect().bottom > bounds.top && node.getBoundingClientRect().top < bounds.bottom)) markChatTiming(chatId, 'first-message', nodes.length);
  }, [timeline, target, chatId]);
  const offsetOf = useCallback((index: number) => {
    let offset = 0; for (let i = 0; i < index; i++) offset += rowSize(i); return offset;
  }, [rowSize]);
  const restore = useCallback(() => {
    restoring.current = true;
    if (settleFrame.current !== null) cancelAnimationFrame(settleFrame.current);
    const current = timeline.getSnapshot();
    if (target && !readerMoved.current) {
      const index = rowsRef.current.findIndex(row => row._id === target);
      if (index >= 0) timeline.setAnchor({ id: target, offset: viewportHeight.current / 2 - rowSize(index) / 2 });
    }
    if (follow.current && !current.hasNewer) list.current?.scrollToItem(rowsRef.current.length - 1, 'end');
    else if (timeline.anchor) {
      const index = rowsRef.current.findIndex(row => row._id === timeline.anchor?.id);
      if (index >= 0) list.current?.scrollTo(Math.max(0, offsetOf(index) - timeline.anchor.offset));
    }
    // Row measurements can move a virtual list for several frames. Do not
    // replace the intended anchor with the temporary pre-measurement viewport.
    settleFrame.current = requestAnimationFrame(() => {
      settleFrame.current = requestAnimationFrame(() => {
        settleFrame.current = null; restoring.current = false; observeRef.current();
      });
    });
  }, [timeline, offsetOf, rowSize, target]);
  const measure = useCallback((id: string, size: number) => {
    markFirstMessage();
    if (size <= 0 || sizes.current.get(id) === size) return;
    sizes.current.set(id, size);
    const index = rowsRef.current.findIndex(row => row._id === id);
    if (index >= 0) list.current?.resetAfterIndex(index);
    if (frame.current === null) frame.current = requestAnimationFrame(() => { frame.current = null; restore(); });
  }, [restore, markFirstMessage]);
  useLayoutEffect(() => {
    if (!container.current) return;
    const observer = new ResizeObserver(entries => setHeight(Math.max(100, entries[0].contentRect.height)));
    observer.observe(container.current);
    return () => { observer.disconnect(); if (frame.current !== null) cancelAnimationFrame(frame.current); if (settleFrame.current !== null) cancelAnimationFrame(settleFrame.current); };
  }, []);
  useEffect(() => {
    const store = useChatStore.getState();
    store.setSelectedChatId(chatId);
    store.setThisChat(chat); store.setIsFetchingThisChat(!chat && state.loading);
  }, [chat, chatId, state.loading]);
  useLayoutEffect(() => {
    if (!rows.length) return;
    list.current?.resetAfterIndex(0);
    const ids = new Set(rows.map(row => row._id));
    for (const id of sizes.current.keys()) if (!ids.has(id)) sizes.current.delete(id);
    if (target && positioned.current !== target) {
      const index = rows.findIndex(row => row._id === target);
      if (index >= 0) {
        follow.current = false; readerMoved.current = false; timeline.setLiveEnd(false);
        timeline.setAnchor({ id: target, offset: height / 2 - rowSize(index) / 2 });
        positioned.current = target; initialized.current = true;
      }
    } else if (!initialized.current) {
      initialized.current = true;
      if (!timeline.anchor && !state.hasNewer) follow.current = true;
    }
    restore();
  }, [rows, target, timeline, height, rowSize, restore, state.hasNewer]);
  const observeScroll = useCallback(() => {
    const element = outer.current;
    if (!element || !initialized.current || restoring.current) return;
    markFirstMessage();
    const snapshot = timeline.getSnapshot();
    const distance = element.scrollHeight - element.scrollTop - element.clientHeight;
    const bottom = distance < 24 && !snapshot.hasNewer;
    follow.current = bottom; timeline.setLiveEnd(bottom); setAtBottom(bottom);
    const top = element.getBoundingClientRect().top;
    const visible = Array.from(element.querySelectorAll<HTMLElement>('[data-message-id]')).find(node => node.getBoundingClientRect().bottom > top);
    if (visible && (!target || readerMoved.current)) timeline.setAnchor({ id: visible.dataset.messageId!, offset: visible.getBoundingClientRect().top - top });
    if (element.scrollTop < element.clientHeight && !snapshot.olderError) void timeline.olderPage();
    else if (distance < element.clientHeight && !snapshot.newerError) void timeline.newerPage();
  }, [timeline, target, markFirstMessage]);
  useLayoutEffect(() => { observeRef.current = observeScroll; }, [observeScroll]);
  const clearTarget = useCallback(() => {
    const url = new URL(window.location.href); url.searchParams.delete('messageId');
    window.history.replaceState(null, '', url.pathname + url.search);
    positioned.current = null;
  }, []);
  const jumpLatest = useCallback(async () => {
    follow.current = true; readerMoved.current = true; initialized.current = true; clearTarget();
    await timeline.jumpLatest();
    requestAnimationFrame(() => { list.current?.scrollToItem(timeline.getSnapshot().rows.length - 1, 'end'); observeScroll(); });
  }, [timeline, clearTarget, observeScroll]);
  const onSent = useCallback((message: WireMessage) => {
    follow.current = true; readerMoved.current = true; clearTarget(); timeline.sent(message);
  }, [clearTarget, timeline]);
  const last = rows.at(-1)?._id, lastRead = useRef<string | null>(null);
  useEffect(() => {
    if (!active || !atBottom || !state.valid || state.hasNewer || state.loading || !last || lastRead.current === last) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      void axiosInstance.put(`/chats/mobile/${chatId}/read`, { messageId: last }, { signal: controller.signal, headers: { Authorization: `Bearer ${token}` } })
        .then(() => { lastRead.current = last; }).catch(() => {});
    }, 200);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [active, atBottom, state.valid, state.hasNewer, state.loading, chatId, token, last]);
  const data = useMemo<RowData>(() => ({ rows, userId: user?._id || '', locale, target, measure }), [rows, user?._id, locale, target, measure]);
  useEffect(() => {
    if (!rows.length) return;
    const frame = requestAnimationFrame(markFirstMessage);
    return () => cancelAnimationFrame(frame);
  }, [rows, state.loading, markFirstMessage]);
  return <>
    <ChatTopbar />
    <div ref={container} className="relative min-h-0 flex-1" onWheelCapture={() => { readerMoved.current = true; }} onTouchMoveCapture={() => { readerMoved.current = true; }} onKeyDownCapture={event => { if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(event.key)) readerMoved.current = true; }} onPointerDownCapture={event => { if (event.target === outer.current) readerMoved.current = true; }}>
      {rows.length ? <VariableSizeList ref={list} outerRef={outer} width="100%" height={height} itemCount={rows.length} itemSize={rowSize} estimatedItemSize={120} itemData={data} itemKey={(index, value) => value.rows[index]._id} overscanCount={5} onItemsRendered={onItemsRendered} onScroll={({ scrollUpdateWasRequested }) => { if (!scrollUpdateWasRequested) observeScroll(); }} style={{ overflowAnchor: 'none' }}>{Row}</VariableSizeList> :
        <div className="h-full overflow-hidden p-4">{state.loading || !state.valid ? Array.from({ length: 5 }, (_, i) => <MessageCardSkeleton key={i} isMine={i % 2 === 0} />) : state.error ? <p role="alert" className="p-5 text-center">{common.unavailable}</p> : null}</div>}
      {state.error ? <div className="absolute inset-x-0 top-0 flex justify-center gap-2 bg-background/95 p-2" role="alert"><span>{common.unavailable}</span><Button variant="outline" onClick={() => void timeline.retry()}>{common.retry}</Button>{target ? <Button onClick={() => void jumpLatest()}>{latestLabel}</Button> : null}</div> : null}
      {state.olderLoading || state.olderError ? <div className="absolute inset-x-0 top-0 flex justify-center">{state.olderError ? <Button onClick={() => void timeline.olderPage()}>{common.retry}</Button> : <span className="rounded-full bg-background px-3 py-1 text-xs" role="status">{loadingMessagesLabel}</span>}</div> : null}
      {state.newerLoading || state.newerError ? <div className="absolute inset-x-0 bottom-14 flex justify-center">{state.newerError ? <Button onClick={() => void timeline.newerPage()}>{common.retry}</Button> : <span className="rounded-full bg-background px-3 py-1 text-xs" role="status">{loadingMessagesLabel}</span>}</div> : null}
      {rows.length > 0 && !atBottom && (farFromLatest || state.hasNewer) ? <Button className="absolute bottom-3 end-4 rounded-full shadow-lg" onClick={() => void jumpLatest()}>{latestLabel}{state.hasNewer ? ' •' : ''}</Button> : null}
    </div>
    {chat ? <ChatBottombar disabled={!state.valid} onSent={onSent} onEdited={id => timeline.changed({ messageId: id, kind: 'editMessage' })} /> : null}
  </>;
}
