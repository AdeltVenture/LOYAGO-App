/**
 * commissionMatcher.ts
 *
 * Reconciles PDF commission entries against the Excel customer database.
 *
 * Matching priority:
 *   1. Exact Vertragsnummer match  → status "exact"   (high confidence)
 *   2. Exact Kundennummer match    → status "partial"  (medium confidence)
 *   3. No match found in Excel     → status "unmatched_pdf"
 *
 * Excel rows that were not claimed by any PDF entry get status "unmatched_excel"
 * (= expected payment did not arrive).
 */

import type { CommissionEntry } from './commissionParser';
import type { CustomerRecord } from './excelHandler';

// ─── Types ───────────────────────────────────────────────────────────────────

export type MatchStatus =
  | 'exact'           // Vertragsnummer matched
  | 'partial'         // Only Kundennummer matched
  | 'unmatched_pdf'   // In PDF but not in customer DB
  | 'unmatched_excel'; // In customer DB but no payment in PDF

export interface MatchResult {
  status: MatchStatus;
  pdfEntry?: CommissionEntry;
  customer?: CustomerRecord;
  sollProvision: number;  // From Excel (0 if unmatched_pdf)
  istProvision: number;   // From PDF   (0 if unmatched_excel)
  delta: number;          // istProvision - sollProvision
}

// ─── Summary helper ───────────────────────────────────────────────────────────

export interface ReconciliationSummary {
  totalSoll: number;
  totalIst: number;
  delta: number;
  matchRate: number;         // 0..1
  exactCount: number;
  partialCount: number;
  unmatchedPdfCount: number;
  unmatchedExcelCount: number;
}

export function getSummary(results: MatchResult[]): ReconciliationSummary {
  const exactCount = results.filter((r) => r.status === 'exact').length;
  const partialCount = results.filter((r) => r.status === 'partial').length;
  const unmatchedPdfCount = results.filter((r) => r.status === 'unmatched_pdf').length;
  const unmatchedExcelCount = results.filter((r) => r.status === 'unmatched_excel').length;

  const totalSoll = results.reduce((s, r) => s + r.sollProvision, 0);
  const totalIst  = results.reduce((s, r) => s + r.istProvision,  0);

  const matched = exactCount + partialCount;
  const total   = results.length;

  return {
    totalSoll,
    totalIst,
    delta: totalIst - totalSoll,
    matchRate: total > 0 ? matched / total : 0,
    exactCount,
    partialCount,
    unmatchedPdfCount,
    unmatchedExcelCount,
  };
}

// ─── Core matching ────────────────────────────────────────────────────────────

/** Strip non-alphanumeric characters for fuzzy key comparison */
function key(s: string): string {
  return s.replace(/[\s\-_.]/g, '').toLowerCase();
}

export function reconcile(
  pdfEntries: CommissionEntry[],
  customers: CustomerRecord[]
): MatchResult[] {
  const results: MatchResult[] = [];
  const claimedIdxs = new Set<number>();

  for (const entry of pdfEntries) {
    const entryVnr = key(entry.vertragsnummer);
    const entryKnr = key(entry.kundennummer);

    // 1. Vertragsnummer match (highest confidence)
    if (entryVnr) {
      const match = customers.find(
        (c) => key(c.vertragsnummer) === entryVnr
      );
      if (match) {
        claimedIdxs.add(match._idx);
        results.push(makeResult('exact', entry, match));
        continue;
      }
    }

    // 2. Kundennummer match
    if (entryKnr) {
      const match = customers.find(
        (c) => key(c.kundennummer) === entryKnr && !claimedIdxs.has(c._idx)
      );
      if (match) {
        claimedIdxs.add(match._idx);
        results.push(makeResult('partial', entry, match));
        continue;
      }
    }

    // 3. No match
    results.push({
      status: 'unmatched_pdf',
      pdfEntry: entry,
      sollProvision: 0,
      istProvision: entry.betrag,
      delta: entry.betrag,
    });
  }

  // Excel rows without a payment entry
  for (const customer of customers) {
    if (!claimedIdxs.has(customer._idx)) {
      results.push({
        status: 'unmatched_excel',
        customer,
        sollProvision: customer.sollprovision,
        istProvision: 0,
        delta: -customer.sollprovision,
      });
    }
  }

  return results;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function makeResult(
  status: 'exact' | 'partial',
  entry: CommissionEntry,
  customer: CustomerRecord
): MatchResult {
  return {
    status,
    pdfEntry: entry,
    customer,
    sollProvision: customer.sollprovision,
    istProvision: entry.betrag,
    delta: entry.betrag - customer.sollprovision,
  };
}
