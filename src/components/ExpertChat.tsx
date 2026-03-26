import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Phone, Paperclip, Key, X, AlertCircle } from "lucide-react";
import Anthropic from "@anthropic-ai/sdk";

const STORAGE_KEY = "loyago_claude_api_key";

const SYSTEM_PROMPT = `Du bist ein freundlicher, kompetenter Versicherungsexperte von LOYAGO – einer eingetragenen Mehrfachagentur (kein Makler).

Du hilfst Kunden bei Fragen zu ihren Versicherungsverträgen, gibst allgemeine Versicherungsratschläge und erklärst komplexe Versicherungsbegriffe verständlich.

Wichtige Informationen über LOYAGO:
- LOYAGO ist eine eingetragene Mehrfachagentur, KEIN Makler
- Kunden stellen einen unverbindlichen "Betreuungswunsch", keinen Maklerauftrag
- Der Betreuungswunsch ist kostenlos und unverbindlich
- LOYAGO betreut bestehende Verträge bei verschiedenen Versicherern

Verhaltensregeln:
- Antworte immer auf Deutsch
- Sei freundlich, klar und verständlich
- Halte Antworten prägnant (2-4 Sätze, außer bei komplexen Themen)
- Bei sehr spezifischen Vertragsfragen empfehle ein persönliches Gespräch
- Gib keine konkreten Tarifempfehlungen einzelner Anbieter (Beratungsrecht)
- Erkläre Versicherungsbegriffe einfach und ohne Fachchinesisch`;

interface Message {
  id: string;
  from: "user" | "expert";
  text: string;
  time: string;
  status?: "sent" | "read";
  streaming?: boolean;
}

interface ApiMessageParam {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "Bin ich ausreichend versichert?",
  "Wie kann ich Beiträge sparen?",
  "Was ist bei KFZ-Versicherung abgedeckt?",
  "Brauche ich eine Berufsunfähigkeitsversicherung?",
];

const initialMessages: Message[] = [
  {
    id: "1",
    from: "expert",
    text: "Hallo! 👋 Ich bin Ihr persönlicher Versicherungsexperte. Wie kann ich Ihnen heute helfen?",
    time: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
  },
  {
    id: "2",
    from: "expert",
    text: "Sie können mir gerne Fragen zu Ihren Verträgen stellen oder ich analysiere gemeinsam mit Ihnen Ihren Versicherungsschutz.",
    time: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
  },
];

interface ExpertChatProps {
  onBack: () => void;
  onCall: () => void;
}

function getTime() {
  return new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

function ApiKeySetup({ onSave }: { onSave: (key: string) => void }) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  function handleSave() {
    const trimmed = key.trim();
    if (!trimmed.startsWith("sk-ant-")) {
      setError("Ungültiger API-Key. Er beginnt mit 'sk-ant-...'");
      return;
    }
    localStorage.setItem(STORAGE_KEY, trimmed);
    onSave(trimmed);
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      <div
        className="flex items-center justify-center rounded-2xl mb-4"
        style={{ width: 64, height: 64, background: "linear-gradient(135deg, #cbdafb 0%, #7ba3f5 100%)" }}
      >
        <Key size={28} style={{ color: "#1a1f3a" }} />
      </div>
      <h3 className="font-bold text-lg mb-2" style={{ color: "#1a1f3a" }}>
        Anthropic API-Key eingeben
      </h3>
      <p className="text-sm mb-6" style={{ color: "#64748b" }}>
        Für echte KI-Antworten benötigen Sie einen API-Key von{" "}
        <span style={{ color: "#3b82f6" }}>console.anthropic.com</span>. Der Key wird nur lokal auf
        Ihrem Gerät gespeichert.
      </p>

      <input
        type="password"
        value={key}
        onChange={(e) => { setKey(e.target.value); setError(""); }}
        placeholder="sk-ant-api03-..."
        className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-3"
        style={{
          background: "white",
          border: "1.5px solid #e2e8f0",
          color: "#1a1f3a",
          fontFamily: "monospace",
        }}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
      />

      {error && (
        <div className="flex items-center gap-2 mb-3 text-xs" style={{ color: "#ef4444" }}>
          <AlertCircle size={13} />
          {error}
        </div>
      )}

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSave}
        disabled={!key.trim()}
        className="w-full py-3 rounded-xl font-semibold text-sm"
        style={{
          background: key.trim() ? "linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%)" : "#e2e8f0",
          color: key.trim() ? "white" : "#94a3b8",
        }}
      >
        Verbinden
      </motion.button>
    </div>
  );
}

export default function ExpertChat({ onBack, onCall }: ExpertChatProps) {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem(STORAGE_KEY) ?? "");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [apiError, setApiError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<ApiMessageParam[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming) return;
    setApiError("");

    const userMsg: Message = {
      id: Date.now().toString(),
      from: "user",
      text: text.trim(),
      time: getTime(),
      status: "sent",
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    historyRef.current.push({ role: "user", content: text.trim() });

    const streamingId = (Date.now() + 1).toString();
    setMessages((m) => [
      ...m,
      { id: streamingId, from: "expert", text: "", time: getTime(), streaming: true },
    ]);
    setIsStreaming(true);

    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

      const stream = client.messages.stream({
        model: "claude-opus-4-6",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: historyRef.current,
      });

      let fullText = "";

      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          fullText += event.delta.text;
          setMessages((m) =>
            m.map((msg) =>
              msg.id === streamingId ? { ...msg, text: fullText } : msg
            )
          );
        }
      }

      historyRef.current.push({ role: "assistant", content: fullText });

      setMessages((m) =>
        m.map((msg) =>
          msg.id === streamingId ? { ...msg, streaming: false } : msg
        )
      );
    } catch (err) {
      const message = err instanceof Anthropic.AuthenticationError
        ? "Ungültiger API-Key. Bitte neu eingeben."
        : err instanceof Anthropic.RateLimitError
        ? "Zu viele Anfragen. Bitte kurz warten."
        : "Verbindungsfehler. Bitte erneut versuchen.";

      setApiError(message);
      setMessages((m) => m.filter((msg) => msg.id !== streamingId));
      historyRef.current.pop();
    } finally {
      setIsStreaming(false);
    }
  }

  function clearApiKey() {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey("");
    historyRef.current = [];
  }

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "#f4f8fe" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 pt-12 pb-4"
        style={{ background: "rgba(244,248,254,0.95)", backdropFilter: "blur(12px)" }}
      >
        <button
          onClick={onBack}
          className="flex items-center justify-center rounded-xl"
          style={{ width: 38, height: 38, background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
        >
          <ArrowLeft size={18} style={{ color: "#1a1f3a" }} />
        </button>

        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div
              className="rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                width: 40,
                height: 40,
                background: "linear-gradient(135deg, #cbdafb 0%, #7ba3f5 100%)",
                color: "#1a1f3a",
              }}
            >
              LB
            </div>
            <div
              className="absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white"
              style={{ width: 12, height: 12, background: apiKey ? "#22c55e" : "#94a3b8" }}
            />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "#1a1f3a" }}>
              LOYAGO Experte
            </p>
            <p className="text-xs" style={{ color: apiKey ? "#22c55e" : "#94a3b8" }}>
              {apiKey ? (isStreaming ? "Tippt …" : "Online – KI-Assistent") : "API-Key erforderlich"}
            </p>
          </div>
        </div>

        {apiKey && (
          <button
            onClick={clearApiKey}
            className="flex items-center justify-center rounded-xl mr-1"
            style={{ width: 32, height: 32, background: "rgba(148,163,184,0.15)" }}
            title="API-Key entfernen"
          >
            <X size={14} style={{ color: "#94a3b8" }} />
          </button>
        )}

        <button
          onClick={onCall}
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 38,
            height: 38,
            background: "linear-gradient(135deg, #cbdafb 0%, #a8c0f8 100%)",
          }}
        >
          <Phone size={17} style={{ color: "#1a1f3a" }} />
        </button>
      </div>

      {/* Main content */}
      {!apiKey ? (
        <ApiKeySetup onSave={setApiKey} />
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.from === "expert" && (
                  <div
                    className="rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-auto mb-1 flex-shrink-0"
                    style={{
                      width: 28,
                      height: 28,
                      background: "linear-gradient(135deg, #cbdafb 0%, #7ba3f5 100%)",
                      color: "#1a1f3a",
                    }}
                  >
                    L
                  </div>
                )}
                <div
                  className="max-w-xs rounded-2xl px-4 py-3 text-sm leading-relaxed"
                  style={
                    msg.from === "user"
                      ? { background: "#1a1f3a", color: "white", borderBottomRightRadius: 4 }
                      : { background: "white", color: "#1a1f3a", borderBottomLeftRadius: 4, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }
                  }
                >
                  {msg.text ? (
                    <p style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>
                  ) : (
                    /* Typing dots while streaming starts */
                    <div className="flex gap-1.5 items-center py-0.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="rounded-full"
                          style={{ width: 6, height: 6, background: "#94a3b8" }}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  )}
                  {!msg.streaming && (
                    <p
                      className="text-right mt-1"
                      style={{
                        fontSize: "10px",
                        opacity: 0.5,
                        color: msg.from === "user" ? "white" : "#1a1f3a",
                      }}
                    >
                      {msg.time}
                      {msg.from === "user" && " ✓"}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* API error */}
            <AnimatePresence>
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl self-center text-xs"
                  style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca" }}
                >
                  <AlertCircle size={13} />
                  {apiError}
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="flex-shrink-0 text-xs px-3 py-2 rounded-xl font-medium"
                    style={{
                      background: "white",
                      color: "#3b82f6",
                      border: "1.5px solid #cbdafb",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div
            className="px-4 pb-8 pt-3"
            style={{ background: "rgba(244,248,254,0.95)", backdropFilter: "blur(12px)" }}
          >
            <div
              className="flex items-end gap-2 px-4 py-2 rounded-2xl"
              style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            >
              <button>
                <Paperclip size={18} style={{ color: "#94a3b8" }} />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder="Schreiben Sie eine Nachricht …"
                rows={1}
                disabled={isStreaming}
                className="flex-1 resize-none outline-none text-sm bg-transparent py-1"
                style={{ color: "#1a1f3a", maxHeight: "100px", lineHeight: "1.5" }}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isStreaming}
                className="flex items-center justify-center rounded-xl flex-shrink-0"
                style={{
                  width: 36,
                  height: 36,
                  background: input.trim() && !isStreaming
                    ? "linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%)"
                    : "#e2e8f0",
                  transition: "background 0.2s",
                }}
              >
                <Send size={15} style={{ color: input.trim() && !isStreaming ? "white" : "#94a3b8" }} />
              </motion.button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
