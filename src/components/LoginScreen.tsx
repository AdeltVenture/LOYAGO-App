import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import CloudBackground from "./CloudBackground";
import { supabase } from "../lib/supabase";

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Bitte E-Mail und Passwort eingeben.");
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError("E-Mail oder Passwort ist nicht korrekt.");
      setLoading(false);
    } else {
      onLogin();
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
      redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
    });
    // Always show success (security best practice – don't reveal if email exists)
    setForgotSent(true);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3 }}
      style={{ maxWidth: 430, margin: "0 auto" }}
    >
      <CloudBackground />

      <div className="relative z-10 flex flex-col flex-1 px-5" style={{ paddingTop: "max(env(safe-area-inset-top), 52px)" }}>
        {/* Wordmark */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <span
            className="font-black tracking-tight"
            style={{ fontSize: "32px", color: "#1a1f3a", letterSpacing: "-1px" }}
          >
            LOYAGO
          </span>
          <p className="text-sm mt-1" style={{ color: "#3d4a6a", opacity: 0.75 }}>
            Ihr persönliches Versicherungscockpit
          </p>
        </motion.div>

        {/* Login card */}
        <motion.div
          className="rounded-3xl p-6"
          style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)", boxShadow: "0 8px 32px rgba(26,31,58,0.12)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
        >
          <h2 className="font-bold text-lg mb-1" style={{ color: "#1a1f3a" }}>Willkommen zurück</h2>
          <p className="text-sm mb-5" style={{ color: "#64748b" }}>Bitte melden Sie sich an.</p>

          <form onSubmit={handleLogin} noValidate>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>
                E-Mail-Adresse
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-0 bottom-0 flex items-center pointer-events-none">
                  <Mail size={16} color="#94a3b8" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  placeholder="ihre@email.de"
                  autoComplete="email"
                  className="w-full rounded-2xl text-sm outline-none transition-all"
                  style={{
                    paddingLeft: 40, paddingRight: 16, paddingTop: 13, paddingBottom: 13,
                    background: "#f4f8fe",
                    border: "1.5px solid #e2e8f0",
                    color: "#1a1f3a",
                  }}
                  onFocus={e => (e.target.style.borderColor = "#4a6da8")}
                  onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-2">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>
                Passwort
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-0 bottom-0 flex items-center pointer-events-none">
                  <Lock size={16} color="#94a3b8" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-2xl text-sm outline-none transition-all"
                  style={{
                    paddingLeft: 40, paddingRight: 48, paddingTop: 13, paddingBottom: 13,
                    background: "#f4f8fe",
                    border: "1.5px solid #e2e8f0",
                    color: "#1a1f3a",
                  }}
                  onFocus={e => (e.target.style.borderColor = "#4a6da8")}
                  onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-0 bottom-0 flex items-center"
                  tabIndex={-1}
                >
                  {showPassword
                    ? <EyeOff size={17} color="#94a3b8" />
                    : <Eye size={17} color="#94a3b8" />
                  }
                </button>
              </div>
            </div>

            {/* Passwort vergessen */}
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => { setShowForgot(true); setForgotEmail(email); setForgotSent(false); }}
                className="text-xs font-semibold"
                style={{ color: "#4a6da8" }}
              >
                Passwort vergessen?
              </button>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-2xl px-4 py-3 mb-4"
                  style={{ background: "#fee2e2" }}
                >
                  <AlertCircle size={15} color="#dc2626" />
                  <p className="text-sm" style={{ color: "#dc2626" }}>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center py-4 rounded-2xl font-bold text-sm"
              style={{
                background: loading ? "#94a3b8" : "#1a1f3a",
                color: "white",
                transition: "background 0.2s",
              }}
            >
              {loading ? (
                <motion.div
                  className="w-5 h-5 rounded-full border-2 border-white"
                  style={{ borderTopColor: "transparent" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                "Anmelden"
              )}
            </motion.button>
          </form>
        </motion.div>

        <p className="text-center text-xs mt-6" style={{ color: "#94a3b8" }}>
          Geschützt durch 256-Bit-SSL-Verschlüsselung
        </p>
      </div>

      {/* Passwort vergessen sheet */}
      <AnimatePresence>
        {showForgot && (
          <>
            <motion.div
              className="fixed inset-0 z-60"
              style={{ background: "rgba(26,31,58,0.4)", backdropFilter: "blur(4px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!loading) setShowForgot(false); }}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-70 rounded-t-3xl p-6 pb-10"
              style={{ background: "white", maxWidth: 430, margin: "0 auto", boxShadow: "0 -4px 32px rgba(26,31,58,0.12)" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
            >
              {forgotSent ? (
                <motion.div
                  className="flex flex-col items-center py-4"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center justify-center rounded-full mb-4"
                    style={{ width: 60, height: 60, background: "#dcfce7" }}>
                    <CheckCircle size={28} color="#16a34a" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-center" style={{ color: "#1a1f3a" }}>
                    E-Mail versendet
                  </h3>
                  <p className="text-sm text-center mb-6" style={{ color: "#64748b", lineHeight: 1.6 }}>
                    Falls ein Konto mit dieser Adresse existiert, erhalten Sie in Kürze eine E-Mail mit einem Link zum Zurücksetzen Ihres Passworts.
                  </p>
                  <button
                    onClick={() => setShowForgot(false)}
                    className="w-full py-4 rounded-2xl font-bold text-sm"
                    style={{ background: "#1a1f3a", color: "white" }}
                  >
                    Verstanden
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                      style={{ width: 40, height: 40, background: "#eaeff8" }}>
                      <Lock size={18} color="#4a6da8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base" style={{ color: "#1a1f3a" }}>Passwort zurücksetzen</h3>
                      <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
                        Wir senden Ihnen einen Reset-Link per E-Mail.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleForgot} noValidate>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>
                      E-Mail-Adresse
                    </label>
                    <div className="relative mb-5">
                      <div className="absolute left-3.5 top-0 bottom-0 flex items-center pointer-events-none">
                        <Mail size={16} color="#94a3b8" />
                      </div>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        placeholder="ihre@email.de"
                        autoComplete="email"
                        className="w-full rounded-2xl text-sm outline-none"
                        style={{
                          paddingLeft: 40, paddingRight: 16, paddingTop: 13, paddingBottom: 13,
                          background: "#f4f8fe",
                          border: "1.5px solid #e2e8f0",
                          color: "#1a1f3a",
                        }}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowForgot(false)}
                        className="flex-1 py-3.5 rounded-2xl font-semibold text-sm"
                        style={{ background: "#f1f5f9", color: "#64748b" }}
                      >
                        Abbrechen
                      </button>
                      <motion.button
                        type="submit"
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 py-3.5 rounded-2xl font-bold text-sm"
                        style={{ background: "#1a1f3a", color: "white" }}
                      >
                        Link senden
                      </motion.button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
