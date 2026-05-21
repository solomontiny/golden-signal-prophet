import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, Ticket, CheckCircle2, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import sarahAvatar from "@/assets/sarah-support.jpg";

type Msg = { role: "user" | "assistant"; content: string };

const WHATSAPP = "97472021636";
const GREETING: Msg = {
  role: "assistant",
  content: "Hi! I'm Sarah from Serenity ECDEM Global Limited. How can I help you today?",
};

// Support hours: Mon–Sat, 08:00–20:00 (local browser time)
const isAgentOnline = () => {
  const now = new Date();
  const day = now.getDay(); // 0 Sun, 6 Sat
  const hour = now.getHours();
  return day !== 0 && hour >= 8 && hour < 20;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-support`;

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);
  const [online, setOnline] = useState(isAgentOnline());
  const [ticket, setTicket] = useState({ name: "", email: "", subject: "", message: "" });
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketSent, setTicketSent] = useState(false);
  const [chatDark, setChatDark] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setOnline(isAgentOnline()), 60_000);
    return () => clearInterval(id);
  }, []);

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
          open ? "rotate-90" : "animate-bounce [animation-duration:2.5s]",
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && (
          <span
            className={cn(
              "absolute top-0 right-0 h-3 w-3 rounded-full ring-2 ring-background",
              online ? "bg-green-500 animate-pulse" : "bg-amber-500",
            )}
          />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className={cn(chatDark && "dark")}>
        <div className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm h-[70vh] max-h-[560px] rounded-2xl bg-background border border-border shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 bg-primary text-primary-foreground">
            <div className="relative">
              <img
                src={sarahAvatar}
                alt="Sarah, customer support representative"
                width={40}
                height={40}
                loading="lazy"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-foreground/30"
              />
              <span
                className={cn(
                  "absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-primary",
                  online ? "bg-green-500" : "bg-amber-500",
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold leading-tight">Sarah · Support</p>
              <p className="text-xs opacity-90 flex items-center gap-1.5">
                <span
                  className={cn(
                    "inline-block h-1.5 w-1.5 rounded-full",
                    online ? "bg-green-400" : "bg-amber-400",
                  )}
                />
                {online ? "Online · replies in minutes" : "Offline · leave us a ticket"}
              </p>
            </div>
            <button
              onClick={() => setChatDark((v) => !v)}
              aria-label={chatDark ? "Switch to light theme" : "Switch to dark theme"}
              title={chatDark ? "Light theme" : "Dark theme"}
              className="h-8 w-8 rounded-full flex items-center justify-center bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
            >
              {chatDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          {online ? (
            <>
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
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 bg-muted/30">
              {ticketSent ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-8">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                  <h3 className="font-semibold text-base">Ticket received</h3>
                  <p className="text-sm text-muted-foreground max-w-[260px]">
                    Thanks! Our team will reply to your email within one business day.
                  </p>
                  <a
                    href={waLink(ticket.message)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center justify-center text-sm font-medium bg-green-600 text-white rounded-xl px-4 py-2 hover:bg-green-700"
                  >
                    Need it urgent? WhatsApp us →
                  </a>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (ticketSubmitting) return;
                    const name = ticket.name.trim();
                    const email = ticket.email.trim();
                    const subject = ticket.subject.trim();
                    const message = ticket.message.trim();
                    if (!name || !email || !subject || !message) return;
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
                      return;
                    }
                    setTicketSubmitting(true);
                    const { error } = await supabase.from("support_tickets").insert({ name, email, subject, message });
                    setTicketSubmitting(false);
                    if (error) {
                      toast({ title: "Couldn't send ticket", description: error.message, variant: "destructive" });
                      return;
                    }
                    setTicketSent(true);
                  }}
                  className="space-y-3"
                >
                  <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3 text-xs text-amber-900 dark:text-amber-200">
                    <Ticket className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>We're offline right now. Leave a ticket and we'll email you back within one business day.</span>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="t-name" className="text-xs dark:text-white">Name</Label>
                    <Input id="t-name" required maxLength={100} value={ticket.name}
                      onChange={(e) => setTicket((t) => ({ ...t, name: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="t-email" className="text-xs dark:text-white">Email</Label>
                    <Input id="t-email" type="email" required maxLength={255} value={ticket.email}
                      onChange={(e) => setTicket((t) => ({ ...t, email: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="t-subject" className="text-xs dark:text-white">Subject</Label>
                    <Input id="t-subject" required maxLength={200} value={ticket.subject}
                      onChange={(e) => setTicket((t) => ({ ...t, subject: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="t-message" className="text-xs dark:text-white">Message</Label>
                    <Textarea id="t-message" required maxLength={5000} rows={4} value={ticket.message}
                      onChange={(e) => setTicket((t) => ({ ...t, message: e.target.value }))} />
                  </div>
                  <Button type="submit" className="w-full" disabled={ticketSubmitting}>
                    {ticketSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit ticket"}
                  </Button>
                  <a
                    href={waLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center text-xs text-muted-foreground hover:text-primary"
                  >
                    Or message us on WhatsApp →
                  </a>
                </form>
              )}
            </div>
          )}
        </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
