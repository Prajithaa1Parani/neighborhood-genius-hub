import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { conversations, chatMessages, type ChatMessage, type ChatConversation } from "@/lib/mock-data";
import { AppHeader, BottomNav } from "@/components/AppLayout";
import { ArrowLeft, Send, Phone, MoreVertical, Image, Loader2 } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat — The Exchange" },
      { name: "description", content: "Message your skill exchange partners" },
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

function ChatPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedConvo, setSelectedConvo] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(chatMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (selectedConvo) scrollToBottom();
  }, [messages, selectedConvo, scrollToBottom]);

  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConvo || isTyping) return;
    const userText = newMessage.trim();
    setNewMessage("");

    const userMsg: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: "u1",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };

    const convoId = selectedConvo.id;
    setMessages(prev => ({
      ...prev,
      [convoId]: [...(prev[convoId] || []), userMsg],
    }));

    setIsTyping(true);

    // Build conversation history for AI
    const currentMessages = [...(messages[convoId] || []), userMsg];
    const aiMessages = currentMessages.map(m => ({
      role: m.senderId === "u1" ? "user" : "assistant",
      content: m.text,
    }));

    // Create placeholder for streaming reply
    const replyId = `m${Date.now() + 1}`;
    let replyText = "";

    setMessages(prev => ({
      ...prev,
      [convoId]: [...(prev[convoId] || []), userMsg, {
        id: replyId,
        senderId: "u2",
        text: "",
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      }],
    }));

    await streamChatReply({
      messages: aiMessages,
      characterName: selectedConvo.user.name,
      onDelta: (chunk) => {
        replyText += chunk;
        setMessages(prev => ({
          ...prev,
          [convoId]: prev[convoId].map(m =>
            m.id === replyId ? { ...m, text: replyText } : m
          ),
        }));
      },
      onDone: () => setIsTyping(false),
      onError: (error) => {
        setMessages(prev => ({
          ...prev,
          [convoId]: prev[convoId].map(m =>
            m.id === replyId ? { ...m, text: `Sorry, I couldn't respond right now. (${error})` } : m
          ),
        }));
        setIsTyping(false);
      },
    });
  };

  if (selectedConvo) {
    const convoMessages = messages[selectedConvo.id] || [];
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <header className="sticky top-0 z-50 flex items-center justify-between bg-card border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedConvo(null)} className="text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <img src={selectedConvo.user.avatar} alt="" className="h-9 w-9 rounded-full" />
            <div>
              <p className="text-sm font-semibold text-foreground">{selectedConvo.user.name}</p>
              <p className={`text-[10px] font-medium ${isTyping ? "text-primary" : "text-stat-green"}`}>
                {isTyping ? "typing..." : selectedConvo.user.isOnline ? "ONLINE" : "OFFLINE"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Phone className="h-5 w-5" />
            <MoreVertical className="h-5 w-5" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <p className="text-center text-[10px] font-medium tracking-wider text-muted-foreground">TODAY</p>
          {convoMessages.map(msg => {
            const isMine = msg.senderId === "u1";
            return (
              <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] ${isMine ? "" : "flex items-end gap-2"}`}>
                  {!isMine && <img src={selectedConvo.user.avatar} alt="" className="h-7 w-7 rounded-full mb-5" />}
                  <div>
                    <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      isMine
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-card border border-border text-card-foreground rounded-bl-sm"
                    }`}>
                      {msg.text || (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Loader2 className="h-3 w-3 animate-spin" /> thinking...
                        </span>
                      )}
                    </div>
                    <p className={`mt-1 text-[10px] text-muted-foreground ${isMine ? "text-right" : ""}`}>
                      {msg.timestamp} {isMine && "✓✓"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="sticky bottom-0 border-t border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            <button className="text-muted-foreground">
              <Image className="h-5 w-5" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Type a message..."
              disabled={isTyping}
              className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-primary disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={isTyping || !newMessage.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
            >
              {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      <main className="mx-auto max-w-lg px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold text-foreground">Messages</h1>
        <div className="space-y-1">
          {conversations.map(convo => (
            <button
              key={convo.id}
              onClick={() => setSelectedConvo(convo)}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-muted"
            >
              <div className="relative">
                <img src={convo.user.avatar} alt={convo.user.name} className="h-12 w-12 rounded-full" />
                {convo.user.isOnline && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-stat-green" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{convo.user.name}</p>
                  <span className="text-[10px] text-muted-foreground">{convo.timestamp}</span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{convo.lastMessage}</p>
              </div>
              {convo.unread > 0 && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {convo.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
