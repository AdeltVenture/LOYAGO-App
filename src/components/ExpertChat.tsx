import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Phone, Paperclip, Smile } from "lucide-react";

interface Message {
  id: string;
  from: "user" | "expert";
  text: string;
  time: string;
  status?: "sent" | "read";
}

const suggestions = [
  "Bin ich ausreichend versichert?",
  "Wie kann ich Beiträge sparen?",
  "Was ist bei meiner KFZ-Versicherung abgedeckt?",
  "Brauche ich eine Berufsunfähigkeitsversicherung?",
];

const initialMessages: Message[] = [
  {
    id: "1",
    from: "expert",
    text: "Hallo! 👋 Ich bin Ihr persönlicher Versicherungsexperte. Wie kann ich Ihnen heute helfen?",
    time: "09:41",
  },
  {
    id: "2",
    from: "expert",
    text: "Sie können mir gerne Fragen zu Ihren Verträgen stellen oder ich analysiere gemeinsam mit Ihnen Ihren Versicherungsschutz.",
    time: "09:41",
  },
];

interface ExpertChatProps {
  onBack: () => void;
  onCall: () => void;
}

function getTime() {
  return new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

export default function ExpertChat({ onBack, onCall }: ExpertChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      from: "user",
      text: text.trim(),
      time: getTime(),
      status: "sent",
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const reply = getAutoReply(text.trim());
      setMessages((m) => [
        ...m,
        { id: (Date.now() + 1).toString(), from: "expert", text: reply, time: getTime() },
      ]);
    }, 1500);
  }

  function getAutoReply(text: string): string {
    const t = text.toLowerCase();
    if (t.includes("versichert") || t.includes("ausreichend"))
      return "Basierend auf Ihrer aktuellen Situation sehe ich, dass Sie gut aufgestellt sind. Einen kleinen Handlungsbedarf sehe ich jedoch bei Ihrer Hausratversicherung – die Versicherungssumme scheint nicht mehr aktuell zu sein. Darf ich dazu mehr erklären?";
    if (t.includes("spar") || t.includes("beitrag"))
      return "Es gibt gute Möglichkeiten, Beiträge zu optimieren. Bei Ihrer KFZ-Versicherung könnte z.B. eine Erhöhung der Selbstbeteiligung den Beitrag reduzieren. Soll ich das für Sie analysieren?";
    if (t.includes("kfz") || t.includes("auto"))
      return "Ihre KFZ-Versicherung bei R+V deckt Vollkasko inkl. Schutzbrief Europa ab. Selbstbeteiligung: 300 €. Der Vertrag läuft bis Juli 2025 – ein guter Zeitpunkt für einen Vergleich!";
    if (t.includes("berufsunf") || t.includes("bu"))
      return "Eine Berufsunfähigkeitsversicherung ist eine der wichtigsten Versicherungen überhaupt. Glücklicherweise haben Sie bereits eine bei der Hannoversche Leben abgeschlossen. Haben Sie Fragen zu Ihrem bestehenden Vertrag?";
    return "Vielen Dank für Ihre Frage! Ich schaue das gerne für Sie durch. Für eine detaillierte Analyse empfehle ich ein kurzes Gespräch. Soll ich einen Termin für Sie vorschlagen?";
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
        style={{
          background: "rgba(244,248,254,0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          onClick={onBack}
          className="flex items-center justify-center rounded-xl"
          style={{ width: 38, height: 38, background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
        >
          <ArrowLeft size={18} style={{ color: "#1a1f3a" }} />
        </button>

        <div className="flex items-center gap-3 flex-1">
          {/* Avatar */}
          <div className="relative">
            <div
              className="rounded-full flex items-center justify-center text-white font-bold text-sm"
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
              style={{ width: 12, height: 12, background: "#22c55e" }}
            />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "#1a1f3a" }}>
              LOYAGO Experte
            </p>
            <p className="text-xs" style={{ color: "#22c55e" }}>
              Online – antwortet sofort
            </p>
          </div>
        </div>

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
                  ? {
                      background: "#1a1f3a",
                      color: "white",
                      borderBottomRightRadius: 4,
                    }
                  : {
                      background: "white",
                      color: "#1a1f3a",
                      borderBottomLeftRadius: 4,
                      boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                    }
              }
            >
              <p>{msg.text}</p>
              <p
                className="text-right mt-1"
                style={{
                  fontSize: "10px",
                  opacity: 0.5,
                  color: msg.from === "user" ? "white" : "#1a1f3a",
                }}
              >
                {msg.time}
                {msg.from === "user" && msg.status === "sent" && " ✓"}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start items-end gap-2"
            >
              <div
                className="rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  width: 28,
                  height: 28,
                  background: "linear-gradient(135deg, #cbdafb 0%, #7ba3f5 100%)",
                  color: "#1a1f3a",
                }}
              >
                L
              </div>
              <div
                className="rounded-2xl px-4 py-3 flex gap-1.5 items-center"
                style={{ background: "white", borderBottomLeftRadius: 4 }}
              >
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
            className="flex-1 resize-none outline-none text-sm bg-transparent py-1"
            style={{ color: "#1a1f3a", maxHeight: "100px", lineHeight: "1.5" }}
          />
          <button>
            <Smile size={18} style={{ color: "#94a3b8" }} />
          </button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{
              width: 36,
              height: 36,
              background: input.trim() ? "linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%)" : "#e2e8f0",
              transition: "background 0.2s",
            }}
          >
            <Send size={15} style={{ color: input.trim() ? "white" : "#94a3b8" }} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
