"use client";

import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Bot,
  BookOpen,
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

const copy = {
  en: {
    button: "AI assistant",
    title: "Nexgen AI",
    subtitle: "Ask about courses, services, and learning paths.",
    greeting:
      "Hi, I am Nexgen Academy's assistant. Tell me what you want to learn and I will point you to the best options.",
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
      return;
    }
    setActiveChatId(localStorage.getItem(GUEST_CHAT_STORAGE_KEY));
  }, [isLoggedIn]);

  const requestMessages = useMemo(
    () =>
      messages
        .filter((message) => message.content !== text.greeting)
        .slice(-8)
        .map(({ role, content }) => ({ role, content })),
    [messages, text.greeting],
  );

  const loadSessions = async () => {
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
  };

  useEffect(() => {
    if (!open || !isLoggedIn) return;
    loadSessions();
  }, [open, isLoggedIn]);

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
      if (typeof window !== "undefined") {
        localStorage.removeItem(GUEST_CHAT_STORAGE_KEY);
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
      const response = (await axiosInstance.post("/ai-chat", {
        chatId: activeChatId,
        messages: [
          ...requestMessages,
          {
            role: userMessage.role,
            content: userMessage.content,
          },
        ],
      })) as AiChatResponse;

      const responseChatId = response.data.data.chatId;
      if (responseChatId) {
        setActiveChatId(responseChatId);
        if (!isLoggedIn && typeof window !== "undefined") {
          localStorage.setItem(GUEST_CHAT_STORAGE_KEY, responseChatId);
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
          if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
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
            "absolute bottom-16 end-0 z-50 flex h-[min(34rem,calc(100vh-8rem))] w-[calc(100vw-2rem)] max-w-[24rem] flex-col overflow-hidden",
            "rounded-2xl border border-primary/15 bg-clear-ground shadow-2xl shadow-primary/15",
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-primary/10 bg-primary px-4 py-3 text-clear-ground">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-clear-ground/15">
                <Bot className="size-5" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold">{text.title}</h2>
                <p className="truncate text-xs text-clear-ground/80">
                  {text.subtitle}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-clear-ground/85 transition hover:bg-clear-ground/15 hover:text-clear-ground"
              aria-label="Close AI chat"
            >
              <X className="size-4" />
            </button>
          </div>

          {isLoggedIn && (
            <div className="flex items-center gap-2 border-b border-primary/10 bg-clear-ground px-3 py-2">
              <select
                value={activeChatId || ""}
                disabled={sessionsLoading || isBusy}
                onChange={(event) => openSession(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-primary/15 bg-background px-2 py-2 text-xs text-text-1 outline-none focus:border-primary"
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
                className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/15 text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={text.newChat}
              >
                <Plus className="size-4" />
              </button>
            </div>
          )}

          <div
            ref={panelRef}
            className="flex-1 space-y-3 overflow-y-auto px-3 py-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-line break-words rounded-2xl px-3 py-2 text-sm leading-6",
                    message.role === "user"
                      ? "rounded-ee-sm bg-primary text-clear-ground"
                      : "rounded-es-sm bg-muted text-text-1",
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-es-sm bg-muted px-3 py-2 text-sm text-text-2">
                  <Loader2 className="size-4 animate-spin" />
                  {text.thinking}
                </div>
              </div>
            )}

            {recommendations.length > 0 && (
              <div className="space-y-2 rounded-2xl border border-primary/10 bg-primary/5 p-3">
                <h3 className="text-xs font-bold uppercase text-primary">
                  {text.recommendations}
                </h3>
                {recommendations.map((item) => {
                  const Icon = getRecommendationIcon(item.type);
                  return (
                    <Link
                      key={`${item.type}-${item.id}`}
                      href={getRecommendationHref(locale, item)}
                      className="block rounded-xl border border-primary/10 bg-clear-ground p-3 transition hover:border-primary/35 hover:shadow-md"
                    >
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Icon className="size-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-bold text-text-1">
                              {item.title}
                            </span>
                            <span className="shrink-0 rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-semibold text-secondary">
                              {text[item.type]}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-2">
                            {item.reason}
                          </p>
                          <span className="mt-2 inline-flex text-xs font-semibold text-primary">
                            {text.open}
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
                className="block rounded-2xl border border-sky-200 bg-sky-50 p-3 text-sky-900 transition hover:border-sky-300 hover:bg-sky-100"
              >
                <div className="flex items-center gap-2">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white">
                    <FaTelegramPlane className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">
                      {handoff.label || text.telegramFallback}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-sky-700">
                      {text.telegramDescription}
                    </p>
                  </div>
                  <ExternalLink className="size-4 shrink-0" />
                </div>
              </a>
            )}
          </div>

          <form
            onSubmit={submitMessage}
            className="border-t border-primary/10 bg-clear-ground p-3"
          >
            {error && <p className="mb-2 text-xs text-destructive">{error}</p>}
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  if (error) setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder={text.placeholder}
                rows={2}
                className="min-h-11 flex-1 resize-none rounded-xl border border-primary/15 bg-background px-3 py-2 text-sm text-text-1 outline-none transition placeholder:text-text-3 focus:border-primary"
              />
              <button
                type="submit"
                disabled={isBusy}
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-clear-ground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={text.send}
              >
                {isBusy ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Send className="size-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative flex size-12 items-center justify-center rounded-full bg-primary text-clear-ground shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:bg-primary/90"
        aria-label={text.button}
      >
        <Bot className="z-10 size-6" />
        {!open && (
          <span className="absolute inset-0 rounded-full bg-primary opacity-40 animate-ping" />
        )}
      </button>
    </div>
  );
}
