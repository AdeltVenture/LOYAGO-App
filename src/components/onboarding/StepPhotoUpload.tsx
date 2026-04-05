import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ImagePlus, ChevronRight, X, CheckCircle, FileText, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface StepPhotoUploadProps {
  onNext: (documentUrl?: string) => void;
}

const ACCEPTED = "image/*,application/pdf";
const UPLOAD_TIMEOUT_MS = 30_000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms)
  );
  return Promise.race([promise, timeout]);
}

export default function StepPhotoUpload({ onNext }: StepPhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setError(null);
    setFileName(f.name);
    setFile(f);
    if (f.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(f));
    } else {
      // PDF or other — show name instead of image preview
      setPreview(null);
    }
    e.target.value = "";
  }

  function clearFile() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileName(null);
    setFile(null);
    setError(null);
  }

  async function handleNext() {
    if (!file) { onNext(); return; }

    // Proceed immediately — upload runs in the background
    setUploading(true);
    onNext(); // don't wait for upload

    supabase.auth.getSession().then(({ data: { session } }) => {
      const userId = session?.user?.id ?? "anon";
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/${Date.now()}.${ext}`;
      return supabase.storage.from("documents").upload(path, file, { upsert: true });
    }).then(({ error }) => {
      if (error) console.error("Background upload error:", error.message);
    }).catch((err) => {
      console.error("Background upload exception:", err);
    });
  }

  const hasFile = !!file;
  const isPdf = file?.type === "application/pdf" || file?.name.endsWith(".pdf");

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col pt-4"
    >
      {/* Instruction card */}
      <div
        className="rounded-3xl p-5 mb-5 flex items-start gap-3"
        style={{ background: "#fef9ec", border: "1.5px solid #fde68a" }}
      >
        <FileText size={18} style={{ color: "#d97706", marginTop: 1, flexShrink: 0 }} />
        <div>
          <p className="text-sm font-bold mb-1" style={{ color: "#92400e" }}>
            Bitte laden Sie Seite 1 Ihres Versicherungsscheins hoch
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "#92400e", opacity: 0.85 }}>
            Darauf sind in der Regel Versicherer, Vertragsnummer, Versicherungsnehmer und Laufzeit zu finden. Rückseiten oder Anhänge sind nicht nötig.
          </p>
        </div>
      </div>

      {/* Preview / upload area */}
      <AnimatePresence mode="wait">
        {preview ? (
          /* Image preview */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative rounded-3xl overflow-hidden mb-5"
            style={{ aspectRatio: "3/4", background: "#e2e8f0" }}
          >
            <img src={preview} alt="Versicherungsschein" className="w-full h-full object-cover" />
            <div
              className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{ background: "rgba(22,163,74,0.9)", backdropFilter: "blur(8px)" }}
            >
              <CheckCircle size={13} color="white" />
              <span className="text-xs font-bold text-white">Bereit</span>
            </div>
            <button
              onClick={clearFile}
              className="absolute top-3 left-3 flex items-center justify-center rounded-full"
              style={{ width: 32, height: 32, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
            >
              <X size={15} color="white" />
            </button>
          </motion.div>
        ) : isPdf && fileName ? (
          /* PDF selected — show file card instead of image preview */
          <motion.div
            key="pdf"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="flex items-center gap-4 rounded-3xl p-5 mb-5"
            style={{ background: "white", border: "2px solid #a8c0f8", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center justify-center rounded-2xl flex-shrink-0"
              style={{ width: 52, height: 52, background: "#eaeff8" }}>
              <FileText size={24} style={{ color: "#4a6da8" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "#1a1f3a" }}>{fileName}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <CheckCircle size={12} style={{ color: "#16a34a" }} />
                <span className="text-xs font-medium" style={{ color: "#16a34a" }}>PDF ausgewählt</span>
              </div>
            </div>
            <button onClick={clearFile}
              className="flex items-center justify-center rounded-full flex-shrink-0"
              style={{ width: 30, height: 30, background: "#f1f5f9" }}>
              <X size={15} style={{ color: "#64748b" }} />
            </button>
          </motion.div>
        ) : (
          /* Upload area */
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-3xl flex flex-col items-center justify-center mb-5 gap-5"
            style={{
              minHeight: 220,
              background: "white",
              border: "2px dashed #cbd5e1",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => cameraRef.current?.click()}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex items-center justify-center rounded-2xl"
                style={{ width: 64, height: 64, background: "#1a1f3a" }}>
                <Camera size={28} color="white" />
              </div>
              <span className="text-sm font-bold" style={{ color: "#1a1f3a" }}>Foto aufnehmen</span>
            </motion.button>

            <div className="flex items-center gap-3 w-36">
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
              <span className="text-xs" style={{ color: "#94a3b8" }}>oder</span>
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => galleryRef.current?.click()}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex items-center justify-center rounded-2xl"
                style={{ width: 64, height: 64, background: "#eaeff8" }}>
                <ImagePlus size={26} color="#4a6da8" />
              </div>
              <span className="text-sm font-semibold" style={{ color: "#4a6da8" }}>Datei auswählen</span>
            </motion.button>

            <p className="text-xs" style={{ color: "#cbd5e1" }}>Foto, PDF oder Scan</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file inputs — accept images AND PDFs */}
      <input ref={cameraRef} type="file" accept={ACCEPTED} capture="environment" className="hidden" onChange={handleFile} />
      <input ref={galleryRef} type="file" accept={ACCEPTED} className="hidden" onChange={handleFile} />

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 rounded-2xl px-4 py-3 mb-4 text-xs"
            style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b" }}
          >
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleNext}
        disabled={uploading}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-sm font-bold"
        style={{
          background: hasFile ? "#1a1f3a" : "#94a3b8",
          color: "white",
          transition: "background 0.25s",
        }}
      >
        {uploading
          ? <><Loader2 size={17} className="animate-spin" /> Wird hochgeladen …</>
          : <>{hasFile ? "Weiter" : "Datei auswählen & fortfahren"}<ChevronRight size={17} /></>
        }
      </motion.button>

      {/* Skip + retry-after-error */}
      {(!hasFile || error) && !uploading && (
        <button
          onClick={() => onNext()}
          className="text-center text-xs mt-3 w-full"
          style={{ color: "#94a3b8" }}
        >
          {error ? "Trotzdem fortfahren – Schein später nachreichen" : "Überspringen – später nachreichen"}
        </button>
      )}
    </motion.div>
  );
}
