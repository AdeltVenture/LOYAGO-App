import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Phone, Info, X, Bot } from "lucide-react";
import { streamChat } from "../lib/anthropic";
import { useMessages } from "../hooks/useMessages";
import type { Contract } from "../data/contracts";

const SUGGESTIONS = [
  "Bin ich ausreichend versichert?",
  "Wie kann ich Beiträge sparen?",
  "Was bedeutet mein Optimierungsbedarf?",
  "Brauche ich weitere Versicherungen?",
];

function buildSystemPrompt(contracts: Contract[], firstName: string): string {
  const contractList = contracts.map((c) => {
    const lines = [
      `## ${c.name} (${c.insurer})`,
      `- Versicherungsschein-Nr.: ${c.policyNumber || "–"}`,
      `- Jahresbeitrag: ${c.annualPremium.toFixed(2)} €`,
      `- Monatsbeitrag: ${c.monthlyPremium.toFixed(2)} €`,
      `- Vertragsbeginn: ${c.startDate || "–"}`,
      `- Nächste Verlängerung: ${c.renewalDate || "–"}`,
      `- Kündigungsfrist: ${c.cancellationPeriod || "nicht hinterlegt"}`,
      `- Deckungsumfang: ${c.coverage || "–"}`,
      `- Deckungsdetails: ${c.coverageDetails || "nicht hinterlegt"}`,
      `- Selbstbehalt: ${c.deductible || "–"}`,
      `- Status: ${c.status}`,
    ];
    if (c.notes) lines.push(`- Hinweise: ${c.notes}`);
    if (c.optimization) lines.push(`- Optimierungspotenzial: ${c.optimization.saving} Ersparnis – ${c.optimization.detail}`);
    return lines.join("\n");
  }).join("\n\n");

  return `Du bist ein persönlicher Versicherungsberater von LOYAGO und hilfst ${firstName} bei allen Fragen rund um seine Versicherungen. Du kennst seine aktuellen Verträge genau und gibst konkrete, hilfreiche Empfehlungen.

Aktuelle Verträge von ${firstName}:

${contractList}

Verhaltensgrundsätze:
- Antworte immer auf Deutsch, freundlich und professionell (Sie-Form)
- Sei konkret und beziehe dich auf die echten Vertragsdaten (Vertragsnummern, Beträge, Daten)
- Halte Antworten kurz (3-5 Sätze) – das ist ein Chat, kein Bericht
- Bei komplexen Themen empfiehl ein Telefonat
- Empfehle nie Produkte außerhalb des LOYAGO-Portfolios
- Weise bei komplexen oder verbindlichen Fragen immer auf das persönliche Beratungsgespräch hin
- Du bist ein KI-Assistent – sei transparent wenn du direkt danach gefragt wirst`;
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
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [chatError, setChatError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, streamingText]);

  // Abort ongoing request when chat closes
  useEffect(() => () => { abortRef.current?.abort(); }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;
    const trimmed = text.trim();
    setInput("");
    setIsTyping(true);
    setStreamingText("");
    setChatError(null);

    const history = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: trimmed },
    ];

    saveMessage("user", trimmed).catch(console.error);

    abortRef.current = new AbortController();

    try {
      const fullResponse = await streamChat(
        history,
        buildSystemPrompt(contracts, firstName),
        (chunk) => setStreamingText(chunk),
        abortRef.current.signal
      );
      setStreamingText("");
      saveMessage("assistant", fullResponse).catch(console.error);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("Chat error:", err);
      setChatError("Antwort konnte nicht geladen werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.");
    } finally {
      setIsTyping(false);
      abortRef.current = null;
    }
  }, [messages, contracts, firstName, isTyping, saveMessage]);

  const showWelcome = !loading && messages.length === 0;

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="fixed inset-x-0 top-0 z-50 flex flex-col"
      style={{ background: "#f4f8fe", maxWidth: "430px", marginInline: "auto", height: "100dvh" }}
    >
      {/* Header — always visible, pinned top like WhatsApp */}
      <div className="flex-shrink-0"
        style={{ background: "rgba(244,248,254,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
        <div className="flex items-center gap-3 px-4 pt-12 pb-3">
          <button onClick={onBack} className="flex items-center justify-center rounded-xl"
            style={{ width: 38, height: 38, background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <ArrowLeft size={18} color="#1a1f3a" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <img src={`${import.meta.env.BASE_URL}expert.jpg`} alt="LOYAGO-Experte"
                className="rounded-full object-cover object-top" style={{ width: 40, height: 40 }} />
              <div className="absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white flex items-center justify-center"
                style={{ width: 16, height: 16, background: "#6366f1" }}>
                <Bot size={8} color="white" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold" style={{ color: "#1a1f3a" }}>LOYAGO KI-Assistent</p>
                <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                  style={{ background: "#ede9fe", color: "#6366f1", fontSize: "9px", letterSpacing: "0.03em" }}>KI</span>
              </div>
              <p className="text-xs" style={{ color: "#94a3b8" }}>Erste Orientierung · unverbindlich</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowDisclaimer(v => !v)}
              className="flex items-center justify-center rounded-xl"
              style={{ width: 34, height: 34, background: showDisclaimer ? "#ede9fe" : "white", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <Info size={15} color={showDisclaimer ? "#6366f1" : "#94a3b8"} />
            </button>
            <button onClick={onCall} className="flex items-center justify-center rounded-xl"
              style={{ width: 34, height: 34, background: "linear-gradient(135deg, #cbdafb 0%, #a8c0f8 100%)" }}>
              <Phone size={15} color="#1a1f3a" />
            </button>
          </div>
        </div>

        {/* Disclaimer banner — collapsible */}
        <AnimatePresence>
          {showDisclaimer && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: "hidden" }}
            >
              <div className="mx-4 mb-3 rounded-2xl px-4 py-3 flex gap-3"
                style={{ background: "#ede9fe", border: "1px solid #c4b5fd" }}>
                <Bot size={15} color="#6366f1" style={{ flexShrink: 0, marginTop: 1 }} />
                <div className="flex-1">
                  <p className="text-xs leading-relaxed" style={{ color: "#4c1d95" }}>
                    Dieser Chat wird von einer <strong>künstlichen Intelligenz</strong> beantwortet und dient der <strong>ersten, unverbindlichen Orientierung</strong>. Für verbindliche Auskünfte und persönliche Beratung sprechen Sie direkt mit einem LOYAGO-Experten.
                  </p>
                  <button onClick={onCall}
                    className="mt-2 flex items-center gap-1.5 text-xs font-semibold"
                    style={{ color: "#6366f1" }}>
                    <Phone size={11} />
                    Jetzt echten Experten anrufen
                  </button>
                </div>
                <button onClick={() => setShowDisclaimer(false)}>
                  <X size={14} color="#8b5cf6" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {/* Welcome message (first time) */}
        {showWelcome && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex justify-start items-end gap-2">
            <img src={`${import.meta.env.BASE_URL}expert.jpg`} alt="Experte"
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
              <img src={`${import.meta.env.BASE_URL}expert.jpg`} alt="Experte"
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
              <img src={`${import.meta.env.BASE_URL}expert.jpg`} alt="Experte"
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

        {/* Error notice */}
        <AnimatePresence>
          {chatError && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-2xl px-4 py-3 text-xs flex items-start gap-2"
              style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b" }}>
              <span style={{ flexShrink: 0 }}>⚠️</span>
              <span>{chatError}</span>
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

      {/* Input — flex-shrink-0 so it stays at bottom when keyboard opens */}
      <div className="flex-shrink-0 px-4 pt-3 pb-4" style={{ background: "rgba(244,248,254,0.97)", backdropFilter: "blur(12px)", paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
        <div className="flex items-end gap-2 px-4 py-2 rounded-2xl"
          style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="Schreiben Sie eine Nachricht …"
            rows={1}
            className="flex-1 resize-none outline-none text-sm bg-transparent py-1"
            style={{ color: "#1a1f3a", lineHeight: "1.5", height: "24px", maxHeight: "120px" }}
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
