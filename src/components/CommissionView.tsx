/**
 * CommissionView.tsx
 *
 * Full-screen overlay for commission controlling.
 *
 * Workflow:
 *   1. Upload PDF  → text extracted, Claude parses entries
 *   2. Upload Excel → customer records loaded
 *   3. Reconciliation table shown automatically once both files are loaded
 *   4. Download updated Excel with new payment column
 */

import { useState, useCallback, useRef, type DragEvent } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Upload, FileText, Table2, CheckCircle2, AlertTriangle,
  XCircle, Download, TrendingUp, TrendingDown, Minus,
  ChevronDown, RefreshCw, Info,
} from 'lucide-react';

import { extractPdfText, parseCommissionPdf, type CommissionEntry } from '../lib/commissionParser';
import { parseExcel, exportWithPayments, type ExcelData } from '../lib/excelHandler';
import { reconcile, getSummary, type MatchResult, type MatchStatus } from '../lib/commissionMatcher';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });

const STATUS_CONFIG: Record<
  MatchStatus,
  { label: string; color: string; bg: string; border: string; Icon: typeof CheckCircle2 }
> = {
  exact: {
    label: 'Abgeglichen',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    Icon: CheckCircle2,
  },
  partial: {
    label: 'Kundennr.',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    Icon: AlertTriangle,
  },
  unmatched_pdf: {
    label: 'Neu / unbekannt',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    Icon: Info,
  },
  unmatched_excel: {
    label: 'Ausstehend',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    Icon: XCircle,
  },
};

type FilterKey = 'all' | MatchStatus;

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div
      className="rounded-2xl px-4 py-3"
      style={{ background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
    >
      <p className="text-xs font-medium mb-1" style={{ color: '#94a3b8' }}>
        {label}
      </p>
      <p className="font-bold text-lg leading-tight" style={{ color: accent ?? '#1a1f3a' }}>
        {value}
      </p>
      {sub && (
        <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>
          {sub}
        </p>
      )}
    </div>
  );
}

type LoadStatus = 'idle' | 'working' | 'done' | 'error';

function DropZone({
  label,
  icon,
  accept,
  status,
  statusText,
  onFile,
  inputRef,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  accept: string;
  status: LoadStatus;
  statusText: string;
  onFile: (f: File) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  children?: React.ReactNode;
}) {
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }

  const borderColor =
    status === 'done'
      ? '#22c55e'
      : status === 'error'
      ? '#ef4444'
      : dragging
      ? '#4a6da8'
      : '#e2e8f0';

  const bgColor = dragging ? '#eff6ff' : 'white';

  return (
    <div
      className="rounded-2xl p-4 transition-colors cursor-pointer select-none"
      style={{
        background: bgColor,
        border: `2px dashed ${borderColor}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ''; }}
      />

      <div className="flex items-start gap-3">
        <div
          className="rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ width: 40, height: 40, background: '#eaeff8' }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: '#1a1f3a' }}>
            {label}
          </p>

          <div className="flex items-center gap-1.5 mt-0.5">
            {status === 'working' && (
              <RefreshCw size={11} className="animate-spin" style={{ color: '#4a6da8' }} />
            )}
            {status === 'done' && <CheckCircle2 size={11} style={{ color: '#22c55e' }} />}
            {status === 'error' && <XCircle size={11} style={{ color: '#ef4444' }} />}
            {status === 'idle' && <Upload size={11} style={{ color: '#94a3b8' }} />}
            <p
              className="text-xs"
              style={{
                color: status === 'done' ? '#16a34a' : status === 'error' ? '#dc2626' : '#94a3b8',
              }}
            >
              {statusText}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

function ResultRow({ result }: { result: MatchResult }) {
  const cfg = STATUS_CONFIG[result.status];
  const { Icon } = cfg;

  const kundennr = result.customer?.kundennummer || result.pdfEntry?.kundennummer || '–';
  const name = result.customer?.kundenname || result.pdfEntry?.kundenname || '–';
  const vertragsnr = result.customer?.vertragsnummer || result.pdfEntry?.vertragsnummer || '–';
  const produkt = result.customer?.produkt || result.pdfEntry?.produkt || '–';
  const periode = result.pdfEntry?.periode ?? '–';

  const deltaColor =
    result.delta > 0.005
      ? '#16a34a'
      : result.delta < -0.005
      ? '#dc2626'
      : '#64748b';

  return (
    <div
      className="grid items-center px-4 py-3 border-b text-sm"
      style={{
        gridTemplateColumns: '150px 1fr 1fr 80px 80px 80px',
        gap: '8px',
        borderColor: '#f1f5f9',
      }}
    >
      {/* Status badge */}
      <div
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold w-fit"
        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
      >
        <Icon size={11} />
        {cfg.label}
      </div>

      {/* Customer */}
      <div className="min-w-0">
        <p className="font-medium truncate" style={{ color: '#1a1f3a' }}>
          {kundennr}
        </p>
        <p className="text-xs truncate" style={{ color: '#94a3b8' }}>
          {name}
        </p>
      </div>

      {/* Contract */}
      <div className="min-w-0">
        <p className="font-medium truncate" style={{ color: '#1a1f3a' }}>
          {vertragsnr}
        </p>
        <p className="text-xs truncate" style={{ color: '#94a3b8' }}>
          {produkt !== '–' ? produkt : periode}
        </p>
      </div>

      {/* Soll */}
      <p className="text-right tabular-nums text-xs" style={{ color: '#64748b' }}>
        {result.sollProvision > 0 ? fmt(result.sollProvision) : '–'}
      </p>

      {/* Ist */}
      <p className="text-right tabular-nums text-xs font-medium" style={{ color: '#1a1f3a' }}>
        {result.istProvision > 0 ? fmt(result.istProvision) : '–'}
      </p>

      {/* Delta */}
      <div className="flex items-center justify-end gap-0.5 tabular-nums text-xs font-semibold" style={{ color: deltaColor }}>
        {result.delta > 0.005 ? (
          <TrendingUp size={11} />
        ) : result.delta < -0.005 ? (
          <TrendingDown size={11} />
        ) : (
          <Minus size={11} />
        )}
        {result.sollProvision > 0 || result.istProvision > 0 ? fmt(Math.abs(result.delta)) : '–'}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
}

export default function CommissionView({ onBack }: Props) {
  // PDF state
  const [pdfStatus, setPdfStatus] = useState<LoadStatus>('idle');
  const [pdfStatusText, setPdfStatusText] = useState('PDF hier ablegen oder klicken');
  const [pdfEntries, setPdfEntries] = useState<CommissionEntry[] | null>(null);
  const [pdfRawText, setPdfRawText] = useState('');
  const [showRaw, setShowRaw] = useState(false);

  // Excel state
  const [xlsxStatus, setXlsxStatus] = useState<LoadStatus>('idle');
  const [xlsxStatusText, setXlsxStatusText] = useState('Excel hier ablegen oder klicken');
  const [excelData, setExcelData] = useState<ExcelData | null>(null);

  // Reconciliation
  const [matchResults, setMatchResults] = useState<MatchResult[] | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  // Error
  const [errorMsg, setErrorMsg] = useState('');

  const pdfRef = useRef<HTMLInputElement | null>(null);
  const xlsxRef = useRef<HTMLInputElement | null>(null);

  // ── PDF handler ────────────────────────────────────────────────────────────

  const handlePdf = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setErrorMsg('Bitte eine PDF-Datei auswählen.');
        return;
      }
      setErrorMsg('');
      setPdfStatus('working');
      setPdfStatusText('Text wird extrahiert…');
      setPdfEntries(null);
      setMatchResults(null);

      try {
        const text = await extractPdfText(file);
        setPdfRawText(text);
        setPdfStatusText('KI analysiert Abrechnung…');

        const entries = await parseCommissionPdf(text, (chunk) => {
          // Show last ~80 chars of the streaming response as progress hint
          const preview = chunk.slice(-80).replace(/\n/g, ' ');
          setPdfStatusText(`Analysiere… ${preview}`);
        });

        setPdfEntries(entries);
        setPdfStatus('done');
        setPdfStatusText(`${entries.length} Einträge erkannt`);

        // Auto-reconcile if Excel already loaded
        if (excelData) {
          setMatchResults(reconcile(entries, excelData.records));
        }
      } catch (err) {
        setPdfStatus('error');
        setPdfStatusText('Analyse fehlgeschlagen');
        setErrorMsg(err instanceof Error ? err.message : 'PDF konnte nicht verarbeitet werden.');
      }
    },
    [excelData]
  );

  // ── Excel handler ──────────────────────────────────────────────────────────

  const handleExcel = useCallback(
    async (file: File) => {
      if (!file.name.match(/\.(xlsx|xls|ods|csv)$/i)) {
        setErrorMsg('Bitte eine Excel-Datei (.xlsx, .xls, .ods oder .csv) auswählen.');
        return;
      }
      setErrorMsg('');
      setXlsxStatus('working');
      setXlsxStatusText('Wird gelesen…');
      setExcelData(null);
      setMatchResults(null);

      try {
        const data = await parseExcel(file);
        setExcelData(data);
        setXlsxStatus('done');
        setXlsxStatusText(`${data.records.length} Kunden geladen`);

        // Auto-reconcile if PDF already loaded
        if (pdfEntries) {
          setMatchResults(reconcile(pdfEntries, data.records));
        }
      } catch (err) {
        setXlsxStatus('error');
        setXlsxStatusText('Datei konnte nicht gelesen werden');
        setErrorMsg(err instanceof Error ? err.message : 'Excel-Datei fehlerhaft.');
      }
    },
    [pdfEntries]
  );

  // ── Export ─────────────────────────────────────────────────────────────────

  function handleExport() {
    if (!excelData || !matchResults) return;
    const period = pdfEntries?.[0]?.periode ?? new Date().toISOString().slice(0, 7);
    const payments = new Map<number, number>();
    for (const r of matchResults) {
      if (r.customer && r.istProvision > 0) {
        payments.set(r.customer._idx, r.istProvision);
      }
    }
    exportWithPayments(excelData, period, payments);
  }

  // ── Render helpers ─────────────────────────────────────────────────────────

  const summary = matchResults ? getSummary(matchResults) : null;

  const filtered = matchResults
    ? activeFilter === 'all'
      ? matchResults
      : matchResults.filter((r) => r.status === activeFilter)
    : [];

  const filterTabs: { key: FilterKey; label: string; count: number }[] = matchResults
    ? [
        { key: 'all', label: 'Alle', count: matchResults.length },
        { key: 'exact', label: 'Abgeglichen', count: summary!.exactCount },
        { key: 'partial', label: 'Teilweise', count: summary!.partialCount },
        { key: 'unmatched_excel', label: 'Ausstehend', count: summary!.unmatchedExcelCount },
        { key: 'unmatched_pdf', label: 'Unbekannt', count: summary!.unmatchedPdfCount },
      ]
    : [];

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: '#f4f8fe' }}
    >
      {/* ── Sticky header ── */}
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 pt-safe-top pb-4"
        style={{
          background: 'rgba(244,248,254,0.96)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0',
          paddingTop: 'max(env(safe-area-inset-top), 48px)',
        }}
      >
        <button
          onClick={onBack}
          className="p-2 rounded-xl flex-shrink-0"
          style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
        >
          <ArrowLeft size={18} color="#1a1f3a" />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="font-bold truncate" style={{ color: '#1a1f3a', fontSize: 18 }}>
            Provisionscontrolling
          </h1>
          <p className="text-xs" style={{ color: '#94a3b8' }}>
            PDF-Abrechnung ↔ Kundendatenbank
          </p>
        </div>

        {matchResults && (
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold flex-shrink-0"
            style={{ background: '#1a1f3a', color: 'white' }}
          >
            <Download size={14} />
            Excel speichern
          </button>
        )}
      </div>

      {/* ── Content ── */}
      <div className="px-4 py-5 mx-auto" style={{ maxWidth: 960 }}>
        {/* Error banner */}
        {errorMsg && (
          <div
            className="mb-4 px-4 py-3 rounded-2xl flex items-start gap-2 text-sm"
            style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }}
          >
            <XCircle size={15} className="flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ── Step 1 & 2: Import cards ── */}
        <div
          className="grid gap-3 mb-6"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
        >
          {/* PDF */}
          <DropZone
            label="Provisionsabrechnung (PDF)"
            icon={<FileText size={20} color="#4a6da8" />}
            accept=".pdf"
            status={pdfStatus}
            statusText={pdfStatusText}
            onFile={handlePdf}
            inputRef={pdfRef}
          >
            {pdfRawText && (
              <button
                className="mt-2 flex items-center gap-1 text-xs"
                style={{ color: '#94a3b8' }}
                onClick={(e) => { e.stopPropagation(); setShowRaw((v) => !v); }}
              >
                <ChevronDown
                  size={11}
                  style={{ transform: showRaw ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }}
                />
                Rohtext {showRaw ? 'ausblenden' : 'anzeigen'}
              </button>
            )}
          </DropZone>

          {/* Excel */}
          <DropZone
            label="Kundendatenbank (Excel)"
            icon={<Table2 size={20} color="#4a6da8" />}
            accept=".xlsx,.xls,.ods,.csv"
            status={xlsxStatus}
            statusText={xlsxStatusText}
            onFile={handleExcel}
            inputRef={xlsxRef}
          >
            {excelData && (
              <p className="mt-1.5 text-xs" style={{ color: '#94a3b8' }}>
                Erkannte Spalten:{' '}
                <span style={{ color: '#64748b' }}>
                  {[
                    excelData.columnMap.kundennummer,
                    excelData.columnMap.vertragsnummer,
                    excelData.columnMap.sollprovision,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </p>
            )}
          </DropZone>
        </div>

        {/* Raw PDF text */}
        {showRaw && pdfRawText && (
          <pre
            className="mb-5 p-4 rounded-2xl text-xs overflow-auto"
            style={{
              background: 'white',
              color: '#475569',
              fontFamily: 'monospace',
              maxHeight: 240,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            {pdfRawText}
          </pre>
        )}

        {/* ── Summary cards ── */}
        {summary && (
          <div
            className="grid gap-3 mb-6"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}
          >
            <SummaryCard
              label="Soll-Provision"
              value={fmt(summary.totalSoll)}
              sub={`${matchResults!.filter((r) => r.sollProvision > 0).length} Einträge`}
            />
            <SummaryCard
              label="Ist-Provision"
              value={fmt(summary.totalIst)}
              sub={`${matchResults!.filter((r) => r.istProvision > 0).length} bezahlt`}
            />
            <SummaryCard
              label="Differenz"
              value={(summary.delta >= 0 ? '+' : '') + fmt(summary.delta)}
              accent={summary.delta >= 0 ? '#16a34a' : '#dc2626'}
              sub={summary.delta >= 0 ? 'Überzahlung' : 'Fehlbetrag'}
            />
            <SummaryCard
              label="Match-Rate"
              value={`${(summary.matchRate * 100).toFixed(0)} %`}
              accent={
                summary.matchRate >= 0.9
                  ? '#16a34a'
                  : summary.matchRate >= 0.7
                  ? '#d97706'
                  : '#dc2626'
              }
              sub={`${summary.exactCount} exakt, ${summary.partialCount} teilw.`}
            />
          </div>
        )}

        {/* ── Reconciliation table ── */}
        {matchResults && (
          <>
            {/* Filter tabs */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {filterTabs.map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    background: activeFilter === key ? '#1a1f3a' : 'white',
                    color: activeFilter === key ? 'white' : '#64748b',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                >
                  {label}
                  <span
                    className="ml-1.5 px-1.5 py-0.5 rounded-lg text-xs"
                    style={{
                      background: activeFilter === key ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                    }}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {/* Table */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
            >
              {/* Header row */}
              <div
                className="grid px-4 py-2.5 text-xs font-semibold border-b"
                style={{
                  gridTemplateColumns: '150px 1fr 1fr 80px 80px 80px',
                  gap: '8px',
                  color: '#94a3b8',
                  borderColor: '#f1f5f9',
                }}
              >
                <span>Status</span>
                <span>Kundennr. / Name</span>
                <span>Vertragsnr. / Produkt</span>
                <span className="text-right">Soll</span>
                <span className="text-right">Ist</span>
                <span className="text-right">Delta</span>
              </div>

              {filtered.length === 0 ? (
                <p className="text-center py-10 text-sm" style={{ color: '#94a3b8' }}>
                  Keine Einträge in dieser Kategorie
                </p>
              ) : (
                filtered.map((result, i) => <ResultRow key={i} result={result} />)
              )}
            </div>

            {/* Hint */}
            <p className="mt-3 text-xs text-center" style={{ color: '#94a3b8' }}>
              "Excel speichern" fügt eine neue Spalte für den Abrechnungsmonat hinzu.
            </p>
          </>
        )}

        {/* Empty state */}
        {!matchResults && pdfStatus === 'idle' && xlsxStatus === 'idle' && (
          <div className="text-center py-12">
            <div
              className="inline-flex items-center justify-center rounded-2xl mb-4"
              style={{ width: 64, height: 64, background: '#eaeff8' }}
            >
              <TrendingUp size={28} color="#4a6da8" />
            </div>
            <p className="font-semibold mb-1" style={{ color: '#1a1f3a' }}>
              Provisionsabgleich starten
            </p>
            <p className="text-sm" style={{ color: '#94a3b8' }}>
              Lade die PDF-Abrechnung und deine Excel-Kundendatenbank hoch.
              <br />
              Der Abgleich startet automatisch.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
