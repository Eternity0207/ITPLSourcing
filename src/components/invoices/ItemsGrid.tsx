"use client";

import { useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { formatMoney } from "@/lib/invoice/format";
import { emptyItem, lineAmount, type LineItem } from "@/lib/invoice/types";

const COLUMNS: { key: keyof LineItem; label: string; className: string; numeric?: boolean; placeholder?: string }[] = [
  { key: "description", label: "Description of Goods", className: "w-[34%]", placeholder: "Product or charge" },
  { key: "details", label: "Details (small print)", className: "w-[26%]", placeholder: "Specs, optional" },
  { key: "hsn", label: "HSN Code", className: "w-24", placeholder: "-" },
  { key: "qty", label: "Qty", className: "w-16", numeric: true },
  { key: "rate", label: "Rate", className: "w-24", numeric: true },
];

type Props = {
  items: LineItem[];
  currency: string;
  onChange: (items: LineItem[]) => void;
};

/** Spreadsheet-like entry: Enter/arrows move between rows, and pasting cells copied from Excel fills the grid. */
export default function ItemsGrid({ items, currency, onChange }: Props) {
  const tableRef = useRef<HTMLTableElement>(null);

  function focusCell(row: number, col: number) {
    requestAnimationFrame(() => {
      tableRef.current?.querySelector<HTMLInputElement>(`input[data-row="${row}"][data-col="${col}"]`)?.focus();
    });
  }

  function update(row: number, key: keyof LineItem, value: string) {
    onChange(items.map((item, index) => (index === row ? { ...item, [key]: value } : item)));
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>, row: number, col: number) {
    if (event.key === "Enter" || (event.key === "ArrowDown" && !event.altKey)) {
      event.preventDefault();
      if (row === items.length - 1) onChange([...items, emptyItem()]);
      focusCell(row + 1, col);
    } else if (event.key === "ArrowUp" && row > 0) {
      event.preventDefault();
      focusCell(row - 1, col);
    }
  }

  function onPaste(event: React.ClipboardEvent<HTMLInputElement>, row: number, col: number) {
    const text = event.clipboardData.getData("text/plain");
    if (!text.includes("\t") && !text.includes("\n")) return;
    event.preventDefault();

    let rows = text.replace(/\r/g, "").replace(/\n$/, "").split("\n").map((line) => line.split("\t"));
    // Skip a copied header row.
    if (/^description/i.test(rows[0]?.[0]?.trim() ?? "")) rows = rows.slice(1);

    const next = items.slice();
    rows.forEach((cells, offset) => {
      const target = row + offset;
      if (!next[target]) next[target] = emptyItem();
      const item = { ...next[target] };
      cells.forEach((cell, cellOffset) => {
        const column = COLUMNS[col + cellOffset];
        if (column) item[column.key] = column.numeric ? cell.replace(/[^0-9.\-]/g, "") : cell.trim();
      });
      next[target] = item;
    });
    onChange(next);
  }

  function remove(row: number) {
    const next = items.filter((_, index) => index !== row);
    onChange(next.length ? next : [emptyItem()]);
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-slate-300">
        <table ref={tableRef} className="w-full min-w-[860px] table-fixed border-collapse text-sm">
          <thead>
            <tr className="bg-[#1F3864] text-left text-xs font-semibold uppercase tracking-wide text-white">
              <th className="w-10 px-2 py-2 text-center">SR</th>
              {COLUMNS.map((column) => (
                <th key={column.key} className={`px-2 py-2 ${column.className}`}>
                  {column.key === "rate" ? `Rate (${currency})` : column.label}
                </th>
              ))}
              <th className="w-28 px-2 py-2 text-right">Amount ({currency})</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {items.map((item, row) => (
              <tr key={row} className="border-t border-slate-200 odd:bg-white even:bg-slate-50">
                <td className="px-2 text-center text-slate-500">{row + 1}</td>
                {COLUMNS.map((column, col) => (
                  <td key={column.key} className="border-l border-slate-200 p-0">
                    <input
                      data-row={row}
                      data-col={col}
                      value={item[column.key]}
                      placeholder={column.placeholder}
                      inputMode={column.numeric ? "decimal" : undefined}
                      onChange={(event) => update(row, column.key, event.target.value)}
                      onKeyDown={(event) => onKeyDown(event, row, col)}
                      onPaste={(event) => onPaste(event, row, col)}
                      className={`w-full bg-transparent px-2 py-2 outline-none placeholder:text-slate-300 focus:bg-[#EBF3FB] ${
                        column.numeric ? "text-right tabular-nums" : ""
                      }`}
                    />
                  </td>
                ))}
                <td className="border-l border-slate-200 px-2 text-right tabular-nums text-slate-700">
                  {formatMoney(lineAmount(item))}
                </td>
                <td className="border-l border-slate-200 text-center">
                  <button
                    type="button"
                    onClick={() => remove(row)}
                    className="p-2 text-slate-400 hover:text-red-600"
                    aria-label={`Remove line ${row + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            onChange([...items, emptyItem()]);
            focusCell(items.length, 0);
          }}
          className="invoice-btn-secondary"
        >
          <Plus className="h-4 w-4" /> Add line
        </button>
        <p className="text-xs text-slate-500">Tip: copy rows from Excel and paste into any cell. Enter moves down.</p>
      </div>
    </div>
  );
}
