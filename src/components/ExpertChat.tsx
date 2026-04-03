import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Phone } from "lucide-react";
import { anthropic } from "../lib/anthropic";
import { useMessages } from "../hooks/useMessages";
import type { Contract } from "../data/contracts";

const SUGGESTIONS = [
  "Bin ich ausreichend versichert?",
  "Wie kann ich Beiträge sparen?",
  "Was bedeutet mein Optimierungsbedarf?",
  "Brauche ich weitere Versicherungen?",
];

function buildSystemPrompt(contracts: Contract[], firstName: string): string {
  const contractList = contracts.map((c) =>
    `- ${c.name} (${c.insurer}): ${c.annualPremium.toFixed(2)} €/Jahr, Status: ${c.status}${c.optimization ? `, Optimierungsbedarf: ${c.optimization.saving} Ersparnis möglich` : ""}`
  ).join("\n");

  return `Du bist ein persönlicher Versicherungsberater von LOYAGO und hilfst ${firstName} bei allen Fragen rund um seine Versicherungen. Du kennst seine aktuellen Verträge genau und gibst konkrete, hilfreiche Empfehlungen.

Aktuelle Verträge von ${firstName}:
${contractList}

Verhaltensgrundsätze:
- Antworte immer auf Deutsch, freundlich und professionell (Sie-Form)
- Sei konkret und beziehe dich auf die echten Vertragsdaten
- Halte Antworten kurz (3-5 Sätze) – das ist ein Chat, kein Bericht
- Bei komplexen Themen empfiehl ein Telefonat
- Empfehle nie Produkte außerhalb des LOYAGO-Portfolios
- Du bist kein Chatbot – stelle dich nicht als KI vor`;
}

function getTime() {
  return new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

interface ExpertChatProps {
  onBack: () => void;
  onCall: () => void;
  contracts?: Contract[];
  firstName?: string;
}

export default function ExpertChat({ onBack, onCall, contracts = [], firstName = "Marco" }: ExpertChatProps) {
  const { messages, loading, saveMessage } = useMessages();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, streamingText]);

  async function sendMessage(text: string) {
    if (!text.trim() || isTyping) return;
    setInput("");
    setIsTyping(true);
    setStreamingText("");

    await saveMessage("user", text.trim());

    try {
      const history = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: text.trim() },
      ];

      let fullResponse = "";

      const stream = anthropic.messages.stream({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: buildSystemPrompt(contracts, firstName),
        messages: history,
      });

      for await (const chunk of stream) {
        if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
          fullResponse += chunk.delta.text;
          setStreamingText(fullResponse);
        }
      }

      setStreamingText("");
      await saveMessage("assistant", fullResponse);
    } catch (err) {
      await saveMessage("assistant", "Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen Sie uns an.");
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  }

  const showWelcome = !loading && messages.length === 0;

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "#f4f8fe", maxWidth: "430px", marginInline: "auto" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4"
        style={{ background: "rgba(244,248,254,0.95)", backdropFilter: "blur(12px)" }}>
        <button onClick={onBack} className="flex items-center justify-center rounded-xl"
          style={{ width: 38, height: 38, background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <ArrowLeft size={18} color="#1a1f3a" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <img src="/LOYAGO-App/expert.jpg" alt="LOYAGO-Experte"
              className="rounded-full object-cover object-top" style={{ width: 40, height: 40 }} />
            <div className="absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white"
              style={{ width: 12, height: 12, background: "#22c55e" }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "#1a1f3a" }}>Ihr LOYAGO-Experte</p>
            <p className="text-xs" style={{ color: "#22c55e" }}>Online – antwortet sofort</p>
          </div>
        </div>
        <button onClick={onCall} className="flex items-center justify-center rounded-xl"
          style={{ width: 38, height: 38, background: "linear-gradient(135deg, #cbdafb 0%, #a8c0f8 100%)" }}>
          <Phone size={17} color="#1a1f3a" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {/* Welcome message (first time) */}
        {showWelcome && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex justify-start items-end gap-2">
            <img src="/LOYAGO-App/expert.jpg" alt="Experte"
              className="rounded-full object-cover object-top flex-shrink-0 mb-1" style={{ width: 28, height: 28 }} />
            <div className="max-w-xs rounded-2xl px-4 py-3 text-sm leading-relaxed"
              style={{ background: "white", color: "#1a1f3a", borderBottomLeftRadius: 4, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
              <p>Hallo {firstName}! Ich bin Ihr persönlicher Versicherungsexperte. Wie kann ich Ihnen heute helfen?</p>
              <p className="text-right mt-1" style={{ fontSize: "10px", opacity: 0.5 }}>{getTime()}</p>
            </div>
          </motion.div>
        )}

        {/* Persisted messages */}
        {messages.map((msg) => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start items-end gap-2"}`}>
            {msg.role === "assistant" && (
              <img src="/LOYAGO-App/expert.jpg" alt="Experte"
                className="rounded-full object-cover object-top flex-shrink-0 mb-1" style={{ width: 28, height: 28 }} />
            )}
            <div className="max-w-xs rounded-2xl px-4 py-3 text-sm leading-relaxed"
              style={msg.role === "user"
                ? { background: "#1a1f3a", color: "white", borderBottomRightRadius: 4 }
                : { background: "white", color: "#1a1f3a", borderBottomLeftRadius: 4, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }
              }>
              <p style={{ whiteSpace: "pre-wrap" }}>{msg.content}</p>
              <p className="text-right mt-1" style={{ fontSize: "10px", opacity: 0.5, color: msg.role === "user" ? "white" : "#1a1f3a" }}>
                {new Date(msg.createdAt).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                {msg.role === "user" && " ✓"}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Streaming response */}
        <AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex justify-start items-end gap-2">
              <img src="/LOYAGO-App/expert.jpg" alt="Experte"
                className="rounded-full object-cover object-top flex-shrink-0 mb-1" style={{ width: 28, height: 28 }} />
              <div className="max-w-xs rounded-2xl px-4 py-3 text-sm leading-relaxed"
                style={{ background: "white", color: "#1a1f3a", borderBottomLeftRadius: 4, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
                {streamingText ? (
                  <p style={{ whiteSpace: "pre-wrap" }}>{streamingText}</p>
                ) : (
                  <div className="flex gap-1.5 items-center py-0.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i} className="rounded-full"
                        style={{ width: 6, height: 6, background: "#94a3b8" }}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {showWelcome && (
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => sendMessage(s)}
                className="flex-shrink-0 text-xs px-3 py-2 rounded-xl font-medium"
                style={{ background: "white", color: "#3b82f6", border: "1.5px solid #cbdafb", whiteSpace: "nowrap" }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-8 pt-3" style={{ background: "rgba(244,248,254,0.95)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-end gap-2 px-4 py-2 rounded-2xl"
          style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="Schreiben Sie eine Nachricht …"
            rows={1}
            className="flex-1 resize-none outline-none text-sm bg-transparent py-1"
            style={{ color: "#1a1f3a", maxHeight: "100px", lineHeight: "1.5" }}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{
              width: 36, height: 36,
              background: input.trim() && !isTyping ? "linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%)" : "#e2e8f0",
              transition: "background 0.2s",
            }}>
            <Send size={15} style={{ color: input.trim() && !isTyping ? "white" : "#94a3b8" }} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
