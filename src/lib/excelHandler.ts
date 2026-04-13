/**
 * excelHandler.ts
 *
 * Reads an Excel/CSV file using SheetJS, auto-detects the relevant columns
 * (Kundennummer, Vertragsnummer, Sollprovision, …), and can write a new
 * payment column back and download the updated workbook.
 */

import * as XLSX from 'xlsx';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ColumnMap {
  kundennummer: string;
  vertragsnummer: string;
  kundenname: string;
  sollprovision: string;
  /** Columns detected as containing monthly payment history */
  zahlungspalten: string[];
}

export interface CustomerRecord {
  /** 0-based index in the original sheet data (used to write back payments) */
  _idx: number;
  kundennummer: string;
  vertragsnummer: string;
  kundenname: string;
  sollprovision: number;
  /** Already-recorded payments keyed by column header */
  zahlungen: Record<string, number>;
  /** Raw original row for round-trip Excel export */
  _original: Record<string, unknown>;
}

export interface ExcelData {
  records: CustomerRecord[];
  columnMap: ColumnMap;
  headers: string[];
  workbook: XLSX.WorkBook;
  sheetName: string;
}

// ─── Column auto-detection ────────────────────────────────────────────────────

function normalize(s: string) {
  return s.toLowerCase().replace(/[\s\-_./]/g, '');
}

function findColumn(headers: string[], keywords: string[]): string {
  return (
    headers.find((h) => keywords.some((k) => normalize(h).includes(normalize(k)))) ?? ''
  );
}

const MONTH_PREFIXES = [
  'jan', 'feb', 'mär', 'mar', 'apr', 'mai', 'may', 'jun',
  'jul', 'aug', 'sep', 'okt', 'oct', 'nov', 'dez', 'dec',
];

function isPaymentColumn(header: string): boolean {
  const l = header.toLowerCase();
  // e.g. "Jan 2024", "2024-01", "202401"
  return /20\d\d/.test(header) || MONTH_PREFIXES.some((m) => l.startsWith(m));
}

function detectColumns(headers: string[]): ColumnMap {
  return {
    kundennummer: findColumn(headers, ['kundennummer', 'kundennr', 'kunden-nr', 'kundenid', 'customer_id', 'customernr']),
    vertragsnummer: findColumn(headers, ['vertragsnummer', 'vertragsnr', 'vertrags-nr', 'policennummer', 'policennr', 'policynr', 'contractnr', 'contract']),
    kundenname: findColumn(headers, ['name', 'kundenname', 'kunde', 'nachname', 'customer']),
    sollprovision: findColumn(headers, ['sollprovision', 'soll', 'provision', 'expected', 'erwartet', 'jahresprovision', 'monatsprovision']),
    zahlungspalten: headers.filter(isPaymentColumn),
  };
}

// ─── Main parse function ──────────────────────────────────────────────────────

export function parseExcel(file: File): Promise<ExcelData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
          defval: '',
          raw: true,
        });

        if (raw.length === 0) throw new Error('Die Excel-Datei enthält keine Daten.');

        const headers = Object.keys(raw[0]);
        const columnMap = detectColumns(headers);

        const records: CustomerRecord[] = raw.map((row, idx) => ({
          _idx: idx,
          kundennummer: String(row[columnMap.kundennummer] ?? '').trim(),
          vertragsnummer: String(row[columnMap.vertragsnummer] ?? '').trim(),
          kundenname: String(row[columnMap.kundenname] ?? '').trim(),
          sollprovision: Number(row[columnMap.sollprovision]) || 0,
          zahlungen: Object.fromEntries(
            columnMap.zahlungspalten
              .map((k) => [k, Number(row[k]) || 0] as [string, number])
              .filter(([, v]) => v > 0)
          ),
          _original: row,
        }));

        resolve({ records, columnMap, headers, workbook, sheetName });
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    };

    reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden.'));
    reader.readAsArrayBuffer(file);
  });
}

// ─── Export with new payment column ──────────────────────────────────────────

/**
 * Adds a payment column for `period` (e.g. "2024-03") to the workbook,
 * populates matched rows, and triggers a browser download.
 *
 * @param data       Parsed Excel data
 * @param period     Period label used as column header, e.g. "2024-03"
 * @param payments   Map<rowIdx, betrag>
 */
export function exportWithPayments(
  data: ExcelData,
  period: string,
  payments: Map<number, number>
): void {
  const { workbook, sheetName } = data;
  const sheet = workbook.Sheets[sheetName];
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

  const updated = raw.map((row, i) => ({
    ...row,
    [period]: payments.has(i) ? payments.get(i) : '',
  }));

  workbook.Sheets[sheetName] = XLSX.utils.json_to_sheet(updated);

  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `Provisionen_${period}_${date}.xlsx`);
}
