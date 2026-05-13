import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const WHATSAPP = "97472021636";
const GREETING: Msg = {
  role: "assistant",
  content: "Hi! I'm Sarah from Serenity ECDEM Global Limited. How can I help you today?",
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-support`;

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const waLink = (text?: string) =>
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text || "Hi, I have a question about your nursing recruitment services.")}`;

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setErrored(false);

    const userMsg: Msg = { role: "user", content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last !== GREETING && prev.length > history.length) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: history.filter((m) => m !== GREETING).map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!resp.ok || !resp.body) {
        setErrored(true);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              resp.status === 429
                ? "I'm getting a lot of messages right now. Please try again in a moment, or message us on WhatsApp."
                : "Sorry, I'm not available at the moment. Please send your question to our team on WhatsApp and we'll reply right away.",
          },
        ]);
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsert(content);
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      setErrored(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm not available right now. Please send your question to our team on WhatsApp and we'll get back to you shortly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className={cn(
          "fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center transition-transform hover:scale-105",
          open && "rotate-90",
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && (
          <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background animate-pulse" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm h-[70vh] max-h-[560px] rounded-2xl bg-background border border-border shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 bg-primary text-primary-foreground">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center font-semibold">
                S
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold leading-tight">Sarah · Support</p>
              <p className="text-xs opacity-90">Serenity ECDEM Global Limited · Online</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap break-words",
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-background border border-border rounded-bl-sm",
                )}
              >
                {m.content || <span className="opacity-60">…</span>}
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role === "user" && (
              <div className="bg-background border border-border rounded-2xl rounded-bl-sm px-3.5 py-2 text-sm w-fit">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            {errored && (
              <a
                href={waLink(input || [...messages].reverse().find((m) => m.role === "user")?.content)}
                target="_blank"
                rel="noreferrer"
                className="block text-center text-sm font-medium bg-green-600 text-white rounded-xl px-3 py-2 hover:bg-green-700"
              >
                Continue on WhatsApp →
              </a>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border bg-background">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Type your message…"
                disabled={loading}
                className="flex-1"
              />
              <Button onClick={send} disabled={loading || !input.trim()} size="icon" aria-label="Send">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <a
              href={waLink()}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block text-center text-xs text-muted-foreground hover:text-primary"
            >
              Prefer WhatsApp? Chat with us at +974 7202 1636
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
