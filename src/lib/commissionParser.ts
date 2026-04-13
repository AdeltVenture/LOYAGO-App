/**
 * commissionParser.ts
 *
 * Extracts text from a PDF file using pdfjs-dist, then uses the existing
 * Supabase/Claude chat function to parse unstructured commission text into
 * structured CommissionEntry objects.
 */

import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { streamChat } from './anthropic';

// Point PDF.js at the local worker bundle (served by Vite)
GlobalWorkerOptions.workerSrc = workerSrc;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CommissionEntry {
  vertragsnummer: string;
  kundennummer: string;
  kundenname: string;
  betrag: number;       // Ist-Provision in EUR
  periode: string;      // "YYYY-MM"  e.g. "2024-03"
  produkt: string;
}

// ─── PDF text extraction ──────────────────────────────────────────────────────

export async function extractPdfText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;

  let fullText = '';
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    // Concatenate items; insert newline when y-position changes notably
    let prevY: number | null = null;
    let line = '';
    for (const item of content.items) {
      if ('str' in item) {
        const textItem = item as { str: string; transform: number[] };
        const y = Math.round(textItem.transform[5]);
        if (prevY !== null && Math.abs(y - prevY) > 2) {
          fullText += line.trimEnd() + '\n';
          line = '';
        }
        line += textItem.str + ' ';
        prevY = y;
      }
    }
    fullText += line.trimEnd() + '\n\n';
  }

  return fullText.trim();
}

// ─── AI-powered structured parsing ───────────────────────────────────────────

const SYSTEM_PROMPT = `Du bist Spezialist für Versicherungs-Provisionsabrechnungen.
Analysiere den übergebenen Abrechnungstext und extrahiere ALLE Provisionseinträge.
Gib ausschließlich ein valides JSON-Array zurück – ohne Präambel, Kommentare oder Codeblöcke.
Jedes Element hat genau diese Felder:
{
  "vertragsnummer": "string",
  "kundennummer":   "string",
  "kundenname":     "string",
  "betrag":         number,
  "periode":        "YYYY-MM",
  "produkt":        "string"
}
Fehlende Werte als leeren String "" oder 0 zurückgeben, niemals null.
Das Feld "betrag" ist eine Dezimalzahl (z.B. 125.50), kein String.
Das Feld "periode" ist das Abrechnungsmonat im Format YYYY-MM.`;

export async function parseCommissionPdf(
  pdfText: string,
  onProgress: (rawChunk: string) => void
): Promise<CommissionEntry[]> {
  // Supabase edge function accepts max ~32 KB; trim to 14 000 chars to stay safe
  const truncated = pdfText.length > 14_000
    ? pdfText.slice(0, 14_000) + '\n[... Text gekürzt]'
    : pdfText;

  let rawResult = '';

  await streamChat(
    [{ role: 'user', content: `Provisionsabrechnung:\n\n${truncated}` }],
    SYSTEM_PROMPT,
    (chunk) => {
      rawResult = chunk;
      onProgress(chunk);
    }
  );

  // Extract the JSON array from the response (handles leading/trailing prose)
  const match = rawResult.match(/\[[\s\S]*\]/);
  if (!match) {
    throw new Error(
      'KI-Antwort enthält kein JSON-Array. Rohtext:\n' + rawResult.slice(0, 300)
    );
  }

  const entries = JSON.parse(match[0]) as CommissionEntry[];

  // Normalise numeric betrag field (Claude sometimes returns strings)
  return entries.map((e) => ({
    ...e,
    betrag: Number(e.betrag) || 0,
    vertragsnummer: String(e.vertragsnummer ?? '').trim(),
    kundennummer: String(e.kundennummer ?? '').trim(),
    kundenname: String(e.kundenname ?? '').trim(),
    periode: String(e.periode ?? '').trim(),
    produkt: String(e.produkt ?? '').trim(),
  }));
}
