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

// 🔴 IMPORTANT: Use PRODUCTION webhook (not webhook-test)
const N8N_WEBHOOK = "http://103.49.131.205:5678/webhook/figmenta-chat";

/* ---------------- HELPERS ---------------- */

// ✅ STABLE SESSION ID
function getSessionId() {
  let id = localStorage.getItem("figmenta_session");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("figmenta_session", id);
  }
  return id;
}

// ✅ SEND MESSAGE TO n8n (FIXED JSON HANDLING)
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
    console.error("n8n error:", res.status);
    throw new Error("Failed to connect to n8n");
  }

  const data = await res.json();

  return data.reply ?? "Sorry — I’m having trouble connecting right now.";
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

  /* ---------- expose open / close ---------- */

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  /* ---------- auto scroll ---------- */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /* ---------- focus input ---------- */

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  /* ---------- ESC close ---------- */

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  /* ---------- SEND MESSAGE ---------- */

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const text = input.trim();

    // push user message immediately
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsLoading(true);

    try {
      const reply = await sendToN8n(text);

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
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
    }
  }, [input, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm"
          />

          {/* Chat window */}
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="pointer-events-auto w-full max-w-[560px] h-full max-h-[640px] flex flex-col bg-[hsl(270_30%_5%)] border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
            >
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
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
                  <div className="text-purple-300/60 text-sm">Thinking…</div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
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
