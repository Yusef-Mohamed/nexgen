"use client";

import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Bot,
  BookOpen,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Loader2,
  Plus,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt?: string;
};

type RecommendationType = "course" | "learningPath" | "service";

type Recommendation = {
  id: string;
  type: RecommendationType;
  title: string;
  slug: string;
  category?: string;
  price?: number;
  priceAfterDiscount?: number;
  reason: string;
};

type Handoff = {
  show: boolean;
  label: string;
  url: string;
  reason?: string;
};

type AiChatSession = {
  _id: string;
  title: string;
  summary?: string;
  recentMessages?: ChatMessage[];
  lastMessageAt?: string;
};

type AiChatResponse = {
  data: {
    data: {
      chatId: string;
      guestKey?: string;
      answer: string;
      recommendations: Recommendation[];
      handoff?: Handoff | null;
    };
  };
};

type AiChatSessionsResponse = {
  data: {
    data: AiChatSession[];
  };
};

type AiChatSessionResponse = {
  data: {
    data: AiChatSession;
  };
};

const GUEST_CHAT_STORAGE_KEY = "nexgenAiChatId";
const GUEST_CHAT_GUEST_KEY_STORAGE_KEY = "nexgenAiGuestKey";

const copy = {
  en: {
    button: "AI assistant",
    title: "Nexgen AI",
    subtitle: "Ask about courses, services, and learning paths.",
    greeting:
      "Hi, I am Nexgen Academy's assistant. Tell me what you want to learn, and I will ask a quick question to find the right fit.",
    placeholder: "I want to learn forex...",
    send: "Send",
    thinking: "Thinking...",
    recommendations: "Recommended for you",
    newChat: "New chat",
    newChatShort: "New chat",
    chatsLabel: "Chats",
    chatsHint: "Switch between your saved AI conversations.",
    selectChat: "Select a saved chat",
    currentChat: "Current chat",
    loadingChats: "Loading chats...",
    noSavedChats: "No saved chats yet",
    untitledChat: "Saved chat",
    previousChats: "Previous chats",
    telegramFallback: "Chat with us on Telegram",
    telegramDescription: "You can contact technical support on Telegram.",
    course: "Course",
    learningPath: "Learning path",
    service: "Service",
    open: "Open",
    error: "I could not answer right now. Please try again in a moment.",
    empty: "Type a message first.",
  },
  ar: {
    button: "المساعد الذكي",
    title: "مساعد Nexgen",
    subtitle: "اسأل عن الكورسات والخدمات ومسارات التعلم.",
    greeting:
      "أهلا بك، أنا مساعد Nexgen Academy. أخبرني ماذا تريد أن تتعلم وسأقترح عليك أفضل الخيارات.",
    placeholder: "أريد تعلم الفوركس...",
    send: "إرسال",
    thinking: "جاري التفكير...",
    recommendations: "اقتراحات مناسبة لك",
    newChat: "محادثة جديدة",
    newChatShort: "محادثة جديدة",
    chatsLabel: "المحادثات",
    chatsHint: "انتقل بين محادثاتك المحفوظة مع المساعد.",
    selectChat: "اختر محادثة محفوظة",
    currentChat: "المحادثة الحالية",
    loadingChats: "جاري تحميل المحادثات...",
    noSavedChats: "لا توجد محادثات محفوظة بعد",
    untitledChat: "محادثة محفوظة",
    previousChats: "المحادثات السابقة",
    telegramFallback: "فتح شات الدعم على تيليجرام",
    telegramDescription: "يمكنك التواصل مع الدعم الفني من التيليجرام",
    course: "كورس",
    learningPath: "مسار تعلم",
    service: "خدمة",
    open: "فتح",
    error: "لم أستطع الرد الآن. حاول مرة أخرى بعد قليل.",
    empty: "اكتب رسالة أولا.",
  },
};

const getRecommendationHref = (locale: string, item: Recommendation) => {
  const paths: Record<RecommendationType, string> = {
    course: "courses",
    learningPath: "learning-paths",
    service: "services",
  };

  return `/${locale}/${paths[item.type]}/${item.slug}`;
};

const getRecommendationIcon = (type: RecommendationType) => {
  if (type === "course") return GraduationCap;
  if (type === "learningPath") return BookOpen;
  return Sparkles;
};

const createMessage = (role: ChatRole, content: string): ChatMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  role,
  content,
});

export default function AiChatWidget() {
  const locale = useLocale();
  const { token } = useAuth();
  const language = locale === "ar" ? "ar" : "en";
  const text = copy[language];
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeGuestKey, setActiveGuestKey] = useState<string | null>(null);
  const [sessions, setSessions] = useState<AiChatSession[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("assistant", text.greeting),
  ]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [handoff, setHandoff] = useState<Handoff | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isBusy = loading || Boolean(typingMessageId);
  const isLoggedIn = Boolean(token);
  const starterPrompts = useMemo(
    () =>
      language === "ar"
        ? ["اقترح لي كورس مناسب", "ما أفضل مسار تعلم؟", "أحتاج تدريب شخصي"]
        : [
            "Find the right course",
            "Compare learning paths",
            "I need coaching",
          ],
    [language],
  );
  const showStarterPrompts =
    messages.length === 1 &&
    messages[0]?.role === "assistant" &&
    !loading &&
    !typingMessageId;
  const activeSessionIsListed = Boolean(
    activeChatId && sessions.some((session) => session._id === activeChatId),
  );
  const showCurrentChatFallback = Boolean(
    activeChatId && !activeSessionIsListed,
  );
  const chatSelectPlaceholder = sessionsLoading
    ? text.loadingChats
    : sessions.length > 0
      ? text.selectChat
      : text.noSavedChats;

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isLoggedIn) {
      setActiveChatId(null);
      setActiveGuestKey(null);
      return;
    }
    const storedChatId = localStorage.getItem(GUEST_CHAT_STORAGE_KEY);
    const storedGuestKey = localStorage.getItem(
      GUEST_CHAT_GUEST_KEY_STORAGE_KEY,
    );

    if (storedChatId && !storedGuestKey) {
      localStorage.removeItem(GUEST_CHAT_STORAGE_KEY);
      setActiveChatId(null);
      setActiveGuestKey(null);
      return;
    }

    setActiveChatId(storedChatId);
    setActiveGuestKey(storedGuestKey);
  }, [isLoggedIn]);

  const requestMessages = useMemo(
    () =>
      messages
        .filter((message) => message.content !== text.greeting)
        .slice(-8)
        .map(({ role, content }) => ({ role, content })),
    [messages, text.greeting],
  );

  const loadSessions = useCallback(async () => {
    if (!isLoggedIn) return;
    setSessionsLoading(true);
    try {
      const response = (await axiosInstance.get(
        "/ai-chat/sessions",
      )) as AiChatSessionsResponse;
      setSessions(response.data.data || []);
    } catch (err) {
      console.error("Failed to load AI chat sessions:", err);
    } finally {
      setSessionsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!open || !isLoggedIn) return;
    loadSessions();
  }, [open, isLoggedIn, loadSessions]);

  const resetChatState = () => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    typingIntervalRef.current = null;
    setTypingMessageId(null);
    setLoading(false);
    setInput("");
    setError("");
    setRecommendations([]);
    setHandoff(null);
    setMessages([createMessage("assistant", text.greeting)]);
  };

  const startNewChat = async () => {
    if (isBusy) return;
    resetChatState();

    if (!isLoggedIn) {
      setActiveChatId(null);
      setActiveGuestKey(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem(GUEST_CHAT_STORAGE_KEY);
        localStorage.removeItem(GUEST_CHAT_GUEST_KEY_STORAGE_KEY);
      }
      return;
    }

    try {
      const response = (await axiosInstance.post("/ai-chat/sessions", {
        title: text.newChat,
      })) as AiChatSessionResponse;
      setActiveChatId(response.data.data._id);
      await loadSessions();
    } catch (err) {
      console.error("Failed to create AI chat session:", err);
      setError(text.error);
    }
  };

  const openSession = async (chatId: string) => {
    if (!chatId || chatId === activeChatId || isBusy) return;
    setSessionsLoading(true);
    setError("");
    setRecommendations([]);
    setHandoff(null);
    try {
      const response = (await axiosInstance.get(
        `/ai-chat/sessions/${chatId}`,
      )) as AiChatSessionResponse;
      const sessionMessages = response.data.data.recentMessages || [];
      setActiveChatId(response.data.data._id);
      setMessages(
        sessionMessages.length > 0
          ? sessionMessages.map((message) =>
              createMessage(message.role, message.content),
            )
          : [createMessage("assistant", text.greeting)],
      );
    } catch (err) {
      console.error("Failed to open AI chat session:", err);
      setError(text.error);
    } finally {
      setSessionsLoading(false);
    }
  };

  const submitMessage = async (event?: FormEvent, promptOverride?: string) => {
    event?.preventDefault();
    const content = (promptOverride ?? input).trim();

    if (!content || isBusy) {
      if (!content) setError(text.empty);
      return;
    }

    const userMessage = createMessage("user", content);
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError("");
    setLoading(true);
    setRecommendations([]);
    setHandoff(null);

    try {
      const canContinueGuestChat = isLoggedIn || Boolean(activeGuestKey);
      const response = (await axiosInstance.post("/ai-chat", {
        chatId: canContinueGuestChat ? activeChatId : null,
        guestKey: !isLoggedIn ? activeGuestKey : undefined,
        messages: [
          ...requestMessages,
          {
            role: userMessage.role,
            content: userMessage.content,
          },
        ],
      })) as AiChatResponse;

      const responseChatId = response.data.data.chatId;
      const responseGuestKey = response.data.data.guestKey;
      if (responseChatId) {
        setActiveChatId(responseChatId);
        if (!isLoggedIn && typeof window !== "undefined") {
          localStorage.setItem(GUEST_CHAT_STORAGE_KEY, responseChatId);
        }
      }
      if (!isLoggedIn && responseGuestKey) {
        setActiveGuestKey(responseGuestKey);
        if (typeof window !== "undefined") {
          localStorage.setItem(
            GUEST_CHAT_GUEST_KEY_STORAGE_KEY,
            responseGuestKey,
          );
        }
      }

      const answer = response.data.data.answer;
      const assistantMessage = createMessage("assistant", "");
      const nextRecommendations = response.data.data.recommendations || [];
      const nextHandoff = response.data.data.handoff || null;
      let index = 0;

      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      setLoading(false);
      setTypingMessageId(assistantMessage.id);
      setMessages((current) => [...current, assistantMessage]);

      typingIntervalRef.current = setInterval(() => {
        index += 1;
        const nextContent = answer.slice(0, index);

        setMessages((current) =>
          current.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: nextContent }
              : message,
          ),
        );

        requestAnimationFrame(() => {
          panelRef.current?.scrollTo({
            top: panelRef.current.scrollHeight,
            behavior: "smooth",
          });
        });

        if (index >= answer.length) {
          if (typingIntervalRef.current)
            clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
          setTypingMessageId(null);
          setRecommendations(nextRecommendations);
          setHandoff(nextHandoff);
          if (isLoggedIn) loadSessions();
        }
      }, 18);
    } catch (err) {
      console.error("AI chat failed:", err);
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
      setTypingMessageId(null);
      setError(text.error);
      setMessages((current) => [
        ...current,
        createMessage("assistant", text.error),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  };

  return (
    <div className="relative pointer-events-auto">
      {open && (
        <div
          className={cn(
            "absolute bottom-16 end-0 z-50 flex h-[min(32rem,calc(100vh-6rem))] w-[calc(100vw-1.25rem)] max-w-[22.5rem] flex-col overflow-hidden",
            "rounded-3xl border border-primary/10 bg-clear-ground shadow-2xl shadow-text-1/10",
          )}
          role="dialog"
          aria-modal="false"
          aria-labelledby="nexgen-ai-chat-title"
        >
          <div className="border-b border-primary/10 bg-clear-ground px-4 py-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="size-5" />
                  <span className="absolute bottom-0 end-0 size-3 rounded-full border-2 border-clear-ground bg-green" />
                </span>
                <div className="min-w-0">
                  <h2
                    id="nexgen-ai-chat-title"
                    className="truncate text-sm font-bold text-text-1"
                  >
                    {text.title}
                  </h2>
                  <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-text-3">
                    <span className="size-1.5 rounded-full bg-green" />
                    <span className="truncate">{text.subtitle}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-text-3 transition hover:bg-muted hover:text-text-1"
                aria-label="Close AI chat"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {isLoggedIn && (
            <div className="border-b border-primary/10 bg-background/70 px-3 py-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <label
                    className="block text-xs font-bold text-text-1"
                    htmlFor="nexgen-ai-sessions"
                  >
                    {text.chatsLabel}
                  </label>
                  <p className="mt-0.5 truncate text-[11px] text-text-3">
                    {text.chatsHint}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={startNewChat}
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-primary/10 bg-clear-ground px-2.5 text-xs font-semibold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label={text.newChat}
                  title={text.newChat}
                >
                  <Plus className="size-3.5" />
                  <span>{text.newChatShort}</span>
                </button>
              </div>
              <select
                id="nexgen-ai-sessions"
                value={activeChatId || ""}
                disabled={
                  sessionsLoading ||
                  isBusy ||
                  (!activeChatId && sessions.length === 0)
                }
                onChange={(event) => openSession(event.target.value)}
                className="w-full min-w-0 rounded-xl border border-primary/10 bg-clear-ground px-3 py-2 text-xs font-medium text-text-1 outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={text.selectChat}
              >
                <option value="">{chatSelectPlaceholder}</option>
                {showCurrentChatFallback && (
                  <option value={activeChatId || ""}>{text.currentChat}</option>
                )}
                {sessions.map((session) => (
                  <option key={session._id} value={session._id}>
                    {session.title || text.untitledChat}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div
            ref={panelRef}
            className="flex-1 space-y-3 overflow-y-auto bg-background/70 px-4 py-4"
          >
            {messages.map((message) => {
              const isUser = message.role === "user";
              const isTypingMessage = typingMessageId === message.id;

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    isUser ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[84%] whitespace-pre-line break-words px-3.5 py-2.5 text-sm leading-6 shadow-sm",
                      isUser
                        ? "rounded-2xl rounded-ee-md bg-primary text-primary-foreground shadow-primary/15"
                        : "rounded-2xl rounded-es-md bg-clear-ground text-text-1",
                    )}
                  >
                    {message.content ? (
                      message.content
                    ) : isTypingMessage ? (
                      <span className="flex items-center gap-1.5 py-1">
                        <span className="size-1.5 animate-pulse rounded-full bg-current opacity-40" />
                        <span className="size-1.5 animate-pulse rounded-full bg-current opacity-50 [animation-delay:120ms]" />
                        <span className="size-1.5 animate-pulse rounded-full bg-current opacity-60 [animation-delay:240ms]" />
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-es-md bg-clear-ground px-3.5 py-2.5 text-sm text-text-2 shadow-sm">
                  <Loader2 className="size-4 animate-spin text-primary" />
                  {text.thinking}
                </div>
              </div>
            )}

            {showStarterPrompts && (
              <div className="flex flex-wrap gap-2 pt-1">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => submitMessage(undefined, prompt)}
                    className="rounded-full border border-primary/10 bg-clear-ground px-3 py-1.5 text-xs font-medium text-text-2 transition hover:border-primary/35 hover:text-primary"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {recommendations.length > 0 && (
              <div className="space-y-2 rounded-2xl border border-primary/10 bg-clear-ground p-3">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="size-3.5" />
                  </span>
                  <h3 className="text-xs font-bold uppercase text-text-1">
                    {text.recommendations}
                  </h3>
                </div>
                {recommendations.map((item) => {
                  const Icon = getRecommendationIcon(item.type);
                  return (
                    <Link
                      key={`${item.type}-${item.id}`}
                      href={getRecommendationHref(locale, item)}
                      className="group block rounded-xl border border-primary/10 bg-background/70 p-3 transition hover:border-primary/35"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="size-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-2">
                            <span className="min-w-0 flex-1 text-sm font-bold leading-5 text-text-1">
                              {item.title}
                            </span>
                            <span className="shrink-0 rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-semibold text-secondary">
                              {text[item.type]}
                            </span>
                          </div>
                          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-text-2">
                            {item.reason}
                          </p>
                          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                            {text.open}
                            <ChevronRight className="size-3.5 rtl:rotate-180" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {handoff?.show && (
              <a
                href={handoff.url}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-2xl border border-secondary/15 bg-clear-ground p-3 text-text-1 transition hover:border-secondary/35"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    <FaTelegramPlane className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">
                      {handoff.label || text.telegramFallback}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-text-2">
                      {text.telegramDescription}
                    </p>
                  </div>
                  <ExternalLink className="size-4 shrink-0 text-secondary transition-transform group-hover:-translate-y-0.5" />
                </div>
              </a>
            )}
          </div>

          <form
            onSubmit={submitMessage}
            className="border-t border-primary/10 bg-clear-ground p-3"
          >
            {error && (
              <p className="mb-2 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                {error}
              </p>
            )}
            <div className="flex items-end gap-2 rounded-2xl border border-primary/10 bg-background/80 p-2 transition focus-within:border-primary/40">
              <textarea
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  if (error) setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder={text.placeholder}
                rows={1}
                className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-text-1 outline-none placeholder:text-text-3"
              />
              <button
                type="submit"
                disabled={isBusy}
                className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={text.send}
              >
                {isBusy ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Send className="size-5 rtl:rotate-180" />
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "group relative flex size-14 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-1 hover:bg-primary/90",
          open && "bg-secondary shadow-secondary/25",
        )}
        aria-label={text.button}
      >
        <Bot className="relative z-10 size-6" />
        {!open && (
          <span className="absolute inset-0 rounded-full bg-primary opacity-30 animate-ping" />
        )}
      </button>
    </div>
  );
}
