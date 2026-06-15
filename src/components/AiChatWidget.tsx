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
  MessageCircle,
  Plus,
  Send,
  Sparkles,
  UserRound,
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

  const submitMessage = async (event?: FormEvent) => {
    event?.preventDefault();
    const content = input.trim();

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
            "absolute bottom-20 end-0 z-50 flex h-[min(42rem,calc(100vh-7rem))] w-[calc(100vw-1.5rem)] max-w-[28rem] flex-col overflow-hidden",
            "rounded-[1.75rem] border border-primary/15 bg-clear-ground/95 cardShadow backdrop-blur-xl",
          )}
          role="dialog"
          aria-modal="false"
          aria-labelledby="nexgen-ai-chat-title"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -start-24 size-64 rounded-full bg-secondary/25 blur-[100px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-28 -end-20 size-72 rounded-full bg-primary/20 blur-[110px]"
          />

          <div className="relative border-b border-primary/10 bg-primary-faded/80 px-4 py-4">
            <div className="absolute inset-x-8 top-0 h-1 rounded-b-full bg-primary/80" />
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <span className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                  <Bot className="size-6" />
                  <span className="absolute -end-1 -top-1 size-4 rounded-full border-2 border-primary-faded bg-green" />
                </span>
                <div className="min-w-0 pt-0.5">
                  <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-clear-ground/80 px-2.5 py-1 text-[11px] font-semibold text-primary cardShadowSm">
                    <Sparkles className="size-3.5" />
                    <span>{text.button}</span>
                  </div>
                  <h2
                    id="nexgen-ai-chat-title"
                    className="truncate text-base font-bold text-text-1"
                  >
                    {text.title}
                  </h2>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-text-2">
                    {text.subtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/10 bg-clear-ground/80 text-text-2 transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary"
                aria-label="Close AI chat"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {isLoggedIn && (
            <div className="relative flex items-center gap-2 border-b border-primary/10 bg-clear-ground/90 px-3 py-3">
              <label className="sr-only" htmlFor="nexgen-ai-sessions">
                {text.previousChats}
              </label>
              <select
                id="nexgen-ai-sessions"
                value={activeChatId || ""}
                disabled={sessionsLoading || isBusy}
                onChange={(event) => openSession(event.target.value)}
                className="min-w-0 flex-1 rounded-2xl border border-primary/15 bg-background/80 px-3 py-2.5 text-xs font-medium text-text-1 outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={text.previousChats}
              >
                <option value="">{text.previousChats}</option>
                {sessions.map((session) => (
                  <option key={session._id} value={session._id}>
                    {session.title || text.previousChats}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={isBusy}
                onClick={startNewChat}
                className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary transition hover:-translate-y-0.5 hover:border-primary/35 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={text.newChat}
              >
                <Plus className="size-4" />
              </button>
            </div>
          )}

          <div
            ref={panelRef}
            className="relative flex-1 space-y-4 overflow-y-auto px-3 py-4 sm:px-4"
          >
            {messages.map((message) => {
              const isUser = message.role === "user";
              const isTypingMessage = typingMessageId === message.id;

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-end gap-2",
                    isUser ? "justify-end" : "justify-start",
                  )}
                >
                  {!isUser && (
                    <span className="mb-1 flex size-8 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      <Bot className="size-4" />
                    </span>
                  )}
                  <div
                    className={cn(
                      "max-w-[82%] whitespace-pre-line break-words rounded-2xl px-3.5 py-2.5 text-sm leading-6 shadow-sm",
                      isUser
                        ? "rounded-ee-md bg-primary text-primary-foreground shadow-primary/15"
                        : "rounded-es-md border border-primary/10 bg-clear-ground text-text-1",
                    )}
                  >
                    {message.content ? (
                      message.content
                    ) : isTypingMessage ? (
                      <span className="flex items-center gap-1.5 py-1">
                        <span className="size-1.5 rounded-full bg-current opacity-40 animate-pulse" />
                        <span className="size-1.5 rounded-full bg-current opacity-50 animate-pulse [animation-delay:120ms]" />
                        <span className="size-1.5 rounded-full bg-current opacity-60 animate-pulse [animation-delay:240ms]" />
                      </span>
                    ) : null}
                  </div>
                  {isUser && (
                    <span className="mb-1 flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <UserRound className="size-4" />
                    </span>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-end gap-2">
                <span className="mb-1 flex size-8 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <Bot className="size-4" />
                </span>
                <div className="flex items-center gap-2 rounded-2xl rounded-es-md border border-primary/10 bg-clear-ground px-3.5 py-2.5 text-sm text-text-2 shadow-sm">
                  <Loader2 className="size-4 animate-spin text-primary" />
                  {text.thinking}
                </div>
              </div>
            )}

            {recommendations.length > 0 && (
              <div className="space-y-3 rounded-2xl border border-primary/15 bg-primary-faded/70 p-3">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Sparkles className="size-4" />
                  </span>
                  <h3 className="text-sm font-bold text-text-1">
                    {text.recommendations}
                  </h3>
                </div>
                {recommendations.map((item) => {
                  const Icon = getRecommendationIcon(item.type);
                  return (
                    <Link
                      key={`${item.type}-${item.id}`}
                      href={getRecommendationHref(locale, item)}
                      className="group block rounded-2xl border border-primary/10 bg-clear-ground/90 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg hover:shadow-text-1/10"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="size-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-2">
                            <span className="min-w-0 flex-1 text-sm font-bold leading-5 text-text-1">
                              {item.title}
                            </span>
                            <span className="shrink-0 rounded-full border border-secondary/20 bg-secondary/10 px-2 py-0.5 text-[10px] font-semibold text-secondary">
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
                className="group block rounded-2xl border border-secondary/20 bg-secondary/10 p-3 text-text-1 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/35 hover:bg-secondary/15"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                    <FaTelegramPlane className="size-5" />
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
            className="relative border-t border-primary/10 bg-clear-ground/95 p-3"
          >
            {error && (
              <p className="mb-2 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                {error}
              </p>
            )}
            <div className="flex items-end gap-2 rounded-2xl border border-primary/15 bg-background/80 p-2 transition focus-within:border-primary/45">
              <MessageCircle className="mb-2.5 size-4 shrink-0 text-text-3" />
              <textarea
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  if (error) setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder={text.placeholder}
                rows={2}
                className="min-h-11 flex-1 resize-none bg-transparent px-1 py-2 text-sm text-text-1 outline-none placeholder:text-text-3"
              />
              <button
                type="submit"
                disabled={isBusy}
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
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
          "group relative flex min-h-14 items-center gap-3 overflow-hidden rounded-2xl border border-primary/20 bg-clear-ground/95 px-3 py-2 text-start cardShadowSm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40",
          open && "border-primary/35 bg-primary-faded",
        )}
        aria-label={text.button}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -end-8 -top-8 size-20 rounded-full bg-secondary/20 blur-2xl transition group-hover:bg-primary/25"
        />
        <span className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
          <Bot className="size-5" />
          {!open && (
            <span className="absolute inset-0 rounded-xl bg-primary opacity-30 animate-ping" />
          )}
        </span>
        <span className="relative hidden min-w-0 sm:block">
          <span className="block text-sm font-bold leading-none text-text-1">
            {text.title}
          </span>
          <span className="mt-1 block max-w-36 truncate text-xs text-text-3">
            {text.button}
          </span>
        </span>
      </button>
    </div>
  );
}
