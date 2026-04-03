import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ImagePlus, ChevronRight, X, CheckCircle, FileText } from "lucide-react";

interface StepPhotoUploadProps {
  onNext: () => void;
}

export default function StepPhotoUpload({ onNext }: StepPhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  }

  function clearPhoto() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  }

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
            Bitte fotografieren Sie Seite 1 Ihres Versicherungsscheins
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "#92400e", opacity: 0.85 }}>
            Darauf sind in der Regel Versicherer, Vertragsnummer, Versicherungsnehmer und Laufzeit zu finden. Rückseiten oder Anhänge sind nicht nötig.
          </p>
        </div>
      </div>

      {/* Photo preview or upload area */}
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative rounded-3xl overflow-hidden mb-5"
            style={{ aspectRatio: "3/4", background: "#e2e8f0" }}
          >
            <img
              src={preview}
              alt="Versicherungsschein"
              className="w-full h-full object-cover"
            />
            {/* Success overlay */}
            <div
              className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{ background: "rgba(22,163,74,0.9)", backdropFilter: "blur(8px)" }}
            >
              <CheckCircle size={13} color="white" />
              <span className="text-xs font-bold text-white">Foto hochgeladen</span>
            </div>
            {/* Delete button */}
            <button
              onClick={clearPhoto}
              className="absolute top-3 left-3 flex items-center justify-center rounded-full"
              style={{ width: 32, height: 32, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
            >
              <X size={15} color="white" />
            </button>
          </motion.div>
        ) : (
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
            {/* Camera button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => cameraRef.current?.click()}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="flex items-center justify-center rounded-2xl"
                style={{ width: 64, height: 64, background: "#1a1f3a" }}
              >
                <Camera size={28} color="white" />
              </div>
              <span className="text-sm font-bold" style={{ color: "#1a1f3a" }}>
                Foto aufnehmen
              </span>
            </motion.button>

            <div className="flex items-center gap-3 w-36">
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
              <span className="text-xs" style={{ color: "#94a3b8" }}>oder</span>
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            </div>

            {/* Gallery button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => galleryRef.current?.click()}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="flex items-center justify-center rounded-2xl"
                style={{ width: 64, height: 64, background: "#eaeff8" }}
              >
                <ImagePlus size={26} color="#4a6da8" />
              </div>
              <span className="text-sm font-semibold" style={{ color: "#4a6da8" }}>
                Aus Galerie wählen
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file inputs */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {/* CTA */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-sm font-bold"
        style={{
          background: preview ? "#1a1f3a" : "#94a3b8",
          color: "white",
          transition: "background 0.25s",
        }}
      >
        {preview ? "Weiter" : "Jetzt hochladen & fortfahren"}
        <ChevronRight size={17} />
      </motion.button>

      {!preview && (
        <button
          onClick={onNext}
          className="text-center text-xs mt-3 w-full"
          style={{ color: "#94a3b8" }}
        >
          Überspringen – später nachreichen
        </button>
      )}
    </motion.div>
  );
}
