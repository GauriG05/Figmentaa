import {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

/* ---------------- TYPES ---------------- */

type Message = {
  role: "user" | "assistant";
  content: string;
};

export type FigAgentHandle = {
  open: () => void;
  close: () => void;
};

/* ---------------- CONFIG ---------------- */

const N8N_WEBHOOK = import.meta.env.VITE_N8N_WEBHOOK;

/* ---------------- SESSION (FIXED) ---------------- */

// ✅ NEW SESSION PER PAGE LOAD
let sessionId: string | null = null;

function getSessionId() {
  if (!sessionId) {
    sessionId = crypto.randomUUID();
  }
  return sessionId;
}

/* ---------------- API ---------------- */

async function sendToN8n(message: string): Promise<string> {
  const res = await fetch(N8N_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: getSessionId(),
      user_message: message,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to connect to n8n");
  }

  const data = await res.json();

  if (Array.isArray(data) && data[0]?.output) {
    return data[0].output;
  }

  if (data.reply) {
    return data.reply;
  }

  return "Sorry — I’m having trouble connecting right now.";
}

/* ---------------- COMPONENT ---------------- */

const FigAgent = forwardRef<FigAgentHandle>((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "I'm Fig1, Figmenta’s AI assistant. I can help you understand our services or connect you with our team. What brings you here today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* expose open / close */

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  /* auto scroll */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /* focus input on open */

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  /* 🔥 GLOBAL KEYBOARD LISTENER */

  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.key === "Escape") return;
      if (document.activeElement === inputRef.current) return;

      if (e.key.length === 1 || e.key === "Backspace") {
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () =>
      window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen]);

  /* ESC close */

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  /* SEND MESSAGE */

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const text = input.trim();

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsLoading(true);

    try {
      const reply = await sendToN8n(text);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry — I’m having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [input, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* UI */

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="pointer-events-auto w-full max-w-[560px] h-full max-h-[640px] flex flex-col bg-[hsl(270_30%_5%)] border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
            >
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 scrollbar-hide">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-5 py-3.5 rounded-xl text-sm ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white"
                          : "bg-white/5 text-white/85"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="text-purple-300/60 text-sm">
                    Thinking…
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="px-5 py-5 border-t border-white/10">
                <div className="flex items-center gap-3 bg-white/5 rounded-xl px-5 py-3">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message…"
                    disabled={isLoading}
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="text-purple-400 hover:text-purple-300 disabled:opacity-30 transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
});

FigAgent.displayName = "FigAgent";
export default FigAgent;
