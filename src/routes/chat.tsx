import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { conversations, chatMessages, type ChatMessage, type ChatConversation } from "@/lib/mock-data";
import { PageShell } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Loader2, Sparkles } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat — The Exchange" },
      { name: "description", content: "Message your engineering skill exchange partners" },
    ],
  }),
  component: ChatPage,
});

async function streamChatReply({
  messages,
  characterName,
  onDelta,
  onDone,
  onError,
}: {
  messages: { role: string; content: string }[];
  characterName: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  try {
    const resp = await fetch(`${SUPABASE_URL}/functions/v1/chat-reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ messages, characterName }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: "Failed to get reply" }));
      onError(err.error || "Something went wrong");
      return;
    }
    if (!resp.body) { onError("No response body"); return; }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIdx: number;
      while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, newlineIdx);
        buffer = buffer.slice(newlineIdx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") { onDone(); return; }
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch { /* partial JSON, wait for more */ }
      }
    }
    onDone();
  } catch (e) {
    onError(e instanceof Error ? e.message : "Network error");
  }
}

function ConversationList({ active, onSelect }: { active: ChatConversation | null; onSelect: (c: ChatConversation) => void }) {
  return (
    <ul className="divide-y divide-border">
      {conversations.map(convo => {
        const isActive = active?.id === convo.id;
        return (
          <li key={convo.id}>
            <button
              onClick={() => onSelect(convo)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                isActive ? "bg-primary/5" : "hover:bg-muted/50"
              }`}
            >
              <div className="relative shrink-0">
                <img src={convo.user.avatar} alt={convo.user.name} className="h-10 w-10 rounded-full object-cover" />
                {convo.user.isOnline && (
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">{convo.user.name}</p>
                  <span className="shrink-0 text-[10px] text-muted-foreground">{convo.timestamp}</span>
                </div>
                <p className="truncate text-[11px] text-primary">{convo.user.specialty}</p>
                <p className="truncate text-xs text-muted-foreground">{convo.lastMessage}</p>
              </div>
              {convo.unread > 0 && (
                <Badge className="h-5 min-w-5 rounded-full px-1.5 text-[10px]">{convo.unread}</Badge>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function ChatThread({ convo, onBack }: { convo: ChatConversation; onBack: () => void }) {
  const [allMessages, setAllMessages] = useState<Record<string, ChatMessage[]>>(chatMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const convoMessages = allMessages[convo.id] || [];

  useEffect(() => { scrollToBottom(); }, [convoMessages.length, scrollToBottom]);

  const sendMessage = async () => {
    if (!newMessage.trim() || isTyping) return;
    const userText = newMessage.trim();
    setNewMessage("");

    const userMsg: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: "u1",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };

    setAllMessages(prev => ({ ...prev, [convo.id]: [...(prev[convo.id] || []), userMsg] }));
    setIsTyping(true);

    const history = [...convoMessages, userMsg];
    const aiMessages = history.map(m => ({
      role: m.senderId === "u1" ? "user" : "assistant",
      content: m.text,
    }));

    const replyId = `m${Date.now() + 1}`;
    let replyText = "";
    setAllMessages(prev => ({
      ...prev,
      [convo.id]: [...(prev[convo.id] || []), {
        id: replyId, senderId: "u2", text: "",
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      }],
    }));

    await streamChatReply({
      messages: aiMessages,
      characterName: convo.user.name,
      onDelta: (chunk) => {
        replyText += chunk;
        setAllMessages(prev => ({
          ...prev,
          [convo.id]: prev[convo.id].map(m => m.id === replyId ? { ...m, text: replyText } : m),
        }));
      },
      onDone: () => setIsTyping(false),
      onError: (error) => {
        setAllMessages(prev => ({
          ...prev,
          [convo.id]: prev[convo.id].map(m =>
            m.id === replyId ? { ...m, text: `Couldn't reach the network right now. (${error})` } : m
          ),
        }));
        setIsTyping(false);
      },
    });
  };

  return (
    <div className="flex h-[calc(100vh-180px)] flex-col md:h-[calc(100vh-200px)]">
      {/* Thread header */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <button onClick={onBack} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <img src={convo.user.avatar} alt={convo.user.name} className="h-9 w-9 rounded-full object-cover" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{convo.user.name}</p>
          <p className="text-[11px] text-primary">{convo.user.specialty}</p>
        </div>
        <Badge variant="outline" className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700">
          <Sparkles className="h-3 w-3" /> AI persona
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto bg-background px-4 py-4">
        {convoMessages.map(msg => {
          const isMine = msg.senderId === "u1";
          return (
            <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`flex max-w-[80%] gap-2 ${isMine ? "flex-row-reverse" : ""}`}>
                {!isMine && <img src={convo.user.avatar} alt="" className="mt-auto h-6 w-6 rounded-full object-cover" />}
                <div>
                  <div className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    isMine
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "border border-border bg-card text-card-foreground rounded-bl-sm"
                  }`}>
                    {msg.text || (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" /> typing…
                      </span>
                    )}
                  </div>
                  <p className={`mt-1 text-[10px] text-muted-foreground ${isMine ? "text-right" : ""}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={`Ask ${convo.user.name.split(" ")[0]} anything technical…`}
            disabled={isTyping}
          />
          <Button onClick={sendMessage} disabled={isTyping || !newMessage.trim()} size="icon">
            {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ChatPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedConvo, setSelectedConvo] = useState<ChatConversation | null>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <PageShell>
      <div className="mb-4">
        <p className="eyebrow">Messages</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Conversations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Each contact replies as their real engineering persona — ask technical questions and they answer in their domain.
        </p>
      </div>

      <Card className="overflow-hidden border-border shadow-none">
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr]">
          {/* Conversation list */}
          <div className={`border-r border-border ${selectedConvo ? "hidden md:block" : ""}`}>
            <ConversationList active={selectedConvo} onSelect={setSelectedConvo} />
          </div>

          {/* Thread */}
          <div className={`${!selectedConvo ? "hidden md:flex md:items-center md:justify-center" : ""}`}>
            {selectedConvo ? (
              <ChatThread convo={selectedConvo} onBack={() => setSelectedConvo(null)} />
            ) : (
              <div className="p-12 text-center text-sm text-muted-foreground">
                Select a conversation to start chatting.
              </div>
            )}
          </div>
        </div>
      </Card>
    </PageShell>
  );
}
