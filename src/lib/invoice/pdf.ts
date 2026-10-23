import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb, type RGB } from "pdf-lib";
import { INVOICE_BANK, INVOICE_COMPANY, INVOICE_TYPES } from "@/data/invoice";
import { amountInWords, formatInvoiceDate, formatMoney } from "./format";
import {
  SHIPMENT_FIELDS,
  filledItems,
  invoiceTotal,
  lineAmount,
  parseAmount,
  type InvoiceData,
  type Party,
} from "./types";

// Layout measured from the original WPS Sheets template (A4, points, y from the top).
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const LEFT = 54;
const RIGHT = 538;
const MID = 265; // splits Bill To / Ship To and the info grid halves
const SIGN_SPLIT = 337; // splits the declaration from the space left for stamp and signature
const INFO_COLS = [LEFT, 101, MID, 388, RIGHT];
const SHIPMENT_COLS = [LEFT, 128, MID, 388, RIGHT];
const ITEM_COLS = [LEFT, 75, MID, 337, 388, 460, RIGHT];
const TOP = 72;
const BOTTOM = 800;
const CONTINUED_TOP = 48;

const NAVY = rgb(31 / 255, 56 / 255, 100 / 255);
const BLUE = rgb(46 / 255, 117 / 255, 182 / 255);
const LIGHT = rgb(214 / 255, 228 / 255, 247 / 255);
const LABEL_BG = rgb(235 / 255, 243 / 255, 251 / 255);
const WHITE = rgb(1, 1, 1);
const BLACK = rgb(0, 0, 0);
const LINK = rgb(5 / 255, 99 / 255, 193 / 255);

const BODY = 7;
const SMALL = 4.6;
const PAD = 1.8;
const LINE_H = 8.6;

type Fonts = { regular: PDFFont; bold: PDFFont; italic: PDFFont; boldItalic: PDFFont };
type Align = "left" | "center" | "right";
type TextStyle = { font?: PDFFont; size?: number; color?: RGB; align?: Align };
type Run = { text: string; font: PDFFont; size: number };

class InvoiceCanvas {
  page!: PDFPage;
  y = TOP;
  private charset: Set<number>;

  constructor(
    private pdf: PDFDocument,
    readonly fonts: Fonts,
  ) {
    this.charset = new Set(fonts.regular.getCharacterSet());
    this.addPage(TOP);
  }

  addPage(top: number) {
    this.page = this.pdf.addPage([PAGE_W, PAGE_H]);
    this.y = top;
  }

  /** Starts a new page if `height` does not fit; returns true when it did. */
  ensure(height: number) {
    if (this.y + height <= BOTTOM) return false;
    this.addPage(CONTINUED_TOP);
    return true;
  }

  // The standard PDF fonts only cover WinAnsi; swap anything else so drawing never throws.
  clean(text: string) {
    return Array.from(text.replace(/\r\n?/g, "\n").replace(/\t/g, " ").replace(/₹/g, "Rs."))
      .map((char) => (char === "\n" || this.charset.has(char.codePointAt(0)!) ? char : "?"))
      .join("");
  }

  width(text: string, font: PDFFont, size: number) {
    return font.widthOfTextAtSize(text, size);
  }

  box(x0: number, x1: number, height: number, fill?: RGB) {
    this.page.drawRectangle({
      x: x0,
      y: PAGE_H - this.y - height,
      width: x1 - x0,
      height,
      color: fill,
      borderColor: BLACK,
      borderWidth: 0.5,
    });
  }

  gap(height: number) {
    this.y += height;
  }

  text(text: string, x: number, baseline: number, font: PDFFont, size: number, color: RGB = BLACK) {
    if (!text) return;
    this.page.drawText(text, { x, y: PAGE_H - baseline, font, size, color });
  }

  /** Wraps on spaces (and explicit newlines) to fit `maxWidth`. */
  wrap(text: string, font: PDFFont, size: number, maxWidth: number) {
    const lines: string[] = [];
    for (const paragraph of this.clean(text).split(/\r?\n/)) {
      let line = "";
      for (const word of paragraph.split(/\s+/).filter(Boolean)) {
        const candidate = line ? `${line} ${word}` : word;
        if (!line || this.width(candidate, font, size) <= maxWidth) {
          line = candidate;
        } else {
          lines.push(line);
          line = word;
        }
      }
      lines.push(line);
    }
    return lines;
  }

  /** Shrinks the font down to a floor, then truncates, so single-line cells never overflow. */
  fit(text: string, font: PDFFont, size: number, maxWidth: number) {
    let value = this.clean(text).replace(/\s*\n\s*/g, ", ");
    let current = size;
    while (current > 5 && this.width(value, font, current) > maxWidth) current -= 0.25;
    if (this.width(value, font, current) > maxWidth) {
      while (value.length > 1 && this.width(`${value}...`, font, current) > maxWidth) value = value.slice(0, -1);
      value = `${value}...`;
    }
    return { value, size: current };
  }

  xFor(align: Align, x0: number, x1: number, lineWidth: number) {
    if (align === "center") return (x0 + x1 - lineWidth) / 2;
    if (align === "right") return x1 - PAD - lineWidth;
    return x0 + PAD;
  }

  /** One line of text vertically centred in the current row between x0 and x1. */
  cell(text: string, x0: number, x1: number, height: number, style: TextStyle = {}) {
    const font = style.font ?? this.fonts.regular;
    const fitted = this.fit(text, font, style.size ?? BODY, x1 - x0 - PAD * 2);
    const lineWidth = this.width(fitted.value, font, fitted.size);
    const baseline = this.y + height / 2 + fitted.size * 0.36;
    this.text(fitted.value, this.xFor(style.align ?? "left", x0, x1, lineWidth), baseline, font, fitted.size, style.color);
  }

  /** Several lines, vertically centred in the current row. */
  lines(lines: string[], x0: number, x1: number, height: number, style: TextStyle = {}, lineHeight = LINE_H) {
    const font = style.font ?? this.fonts.regular;
    const size = style.size ?? BODY;
    const first = this.y + (height - lines.length * lineHeight) / 2 + lineHeight / 2 + size * 0.36;
    lines.forEach((line, index) => {
      const x = this.xFor(style.align ?? "left", x0, x1, this.width(line, font, size));
      this.text(line, x, first + index * lineHeight, font, size, style.color);
    });
  }

  /** Wraps mixed-size runs (description + small details) into centred lines. */
  wrapRuns(runs: Run[], maxWidth: number) {
    type Word = { text: string; font: PDFFont; size: number; width: number; space: number };
    const words: Word[] = [];
    for (const run of runs) {
      for (const text of this.clean(run.text).split(/\s+/).filter(Boolean)) {
        words.push({
          text,
          font: run.font,
          size: run.size,
          width: this.width(text, run.font, run.size),
          space: this.width(" ", run.font, run.size),
        });
      }
    }

    const lines: { words: Word[]; width: number }[] = [];
    let current: { words: Word[]; width: number } = { words: [], width: 0 };
    for (const word of words) {
      const added = current.words.length ? word.space + word.width : word.width;
      if (current.words.length && current.width + added > maxWidth) {
        lines.push(current);
        current = { words: [word], width: word.width };
      } else {
        current.words.push(word);
        current.width += added;
      }
    }
    if (current.words.length) lines.push(current);
    return lines;
  }
}

function sectionBar(canvas: InvoiceCanvas, title: string, height: number, fill: RGB, size: number) {
  canvas.box(LEFT, RIGHT, height, fill);
  canvas.cell(title, LEFT, RIGHT, height, { font: canvas.fonts.bold, size, color: WHITE, align: "center" });
  canvas.gap(height);
}

function labelGrid(canvas: InvoiceCanvas, rows: [string, string, string, string][], cols = INFO_COLS) {
  const { bold } = canvas.fonts;
  for (const [label1, value1, label2, value2] of rows) {
    const height = 12;
    canvas.ensure(height);
    canvas.box(cols[0], cols[1], height, LABEL_BG);
    canvas.box(cols[1], cols[2], height);
    canvas.box(cols[2], cols[3], height, LABEL_BG);
    canvas.box(cols[3], cols[4], height);
    canvas.cell(label1, cols[0], cols[1], height, { font: bold });
    canvas.cell(value1, cols[1], cols[2], height);
    canvas.cell(label2, cols[2], cols[3], height, { font: bold });
    canvas.cell(value2, cols[3], cols[4], height);
    canvas.gap(height);
  }
}

function partyLines(canvas: InvoiceCanvas, party: Party) {
  const { regular } = canvas.fonts;
  const maxWidth = MID - LEFT - PAD * 2;
  const lines = [
    ...canvas.wrap(party.address, regular, BODY, maxWidth).filter(Boolean),
    ...(party.email.trim() ? canvas.wrap(`Email: ${party.email.trim()}`, regular, BODY, maxWidth) : []),
  ];
  return [canvas.clean(party.name.trim()), ...lines];
}

function partySection(canvas: InvoiceCanvas, billTo: Party, shipTo: Party) {
  const { bold, regular } = canvas.fonts;
  const bill = partyLines(canvas, billTo);
  const ship = partyLines(canvas, shipTo);
  const rowCount = Math.max(5, bill.length, ship.length);
  const rowH = 10;

  canvas.ensure(9.5 + rowCount * rowH);
  canvas.box(LEFT, MID, 9.5, BLUE);
  canvas.box(MID, RIGHT, 9.5, BLUE);
  canvas.cell("BILL TO", LEFT, MID, 9.5, { font: bold, color: WHITE, align: "center" });
  canvas.cell("SHIP TO", MID, RIGHT, 9.5, { font: bold, color: WHITE, align: "center" });
  canvas.gap(9.5);

  for (let row = 0; row < rowCount; row++) {
    canvas.box(LEFT, MID, rowH);
    canvas.box(MID, RIGHT, rowH);
    const font = row === 0 ? bold : regular;
    canvas.cell(bill[row] ?? "", LEFT, MID, rowH, { font });
    canvas.cell(ship[row] ?? "", MID, RIGHT, rowH, { font });
    canvas.gap(rowH);
  }
}

function itemHeader(canvas: InvoiceCanvas, currency: string) {
  const headers = ["SR", "Description of Goods", "HSN Code", "Qty", `Rate (${currency})`, `Amount (${currency})`];
  const height = 13.5;
  headers.forEach((header, index) => {
    canvas.box(ITEM_COLS[index], ITEM_COLS[index + 1], height, NAVY);
    canvas.cell(header, ITEM_COLS[index], ITEM_COLS[index + 1], height, {
      font: canvas.fonts.bold,
      color: WHITE,
      align: "center",
    });
  });
  canvas.gap(height);
}

function itemsSection(canvas: InvoiceCanvas, data: InvoiceData, invoiceNo: string) {
  const { regular, bold } = canvas.fonts;
  const items = filledItems(data.items);
  itemHeader(canvas, data.currency);

  items.forEach((item, index) => {
    const runs: Run[] = [{ text: item.description, font: regular, size: BODY }];
    if (item.details.trim()) runs.push({ text: `(${item.details.trim()})`, font: regular, size: SMALL });
    const descLines = canvas.wrapRuns(runs, ITEM_COLS[2] - ITEM_COLS[1] - PAD * 2);
    const height = Math.max(12, descLines.length * LINE_H + 3.4);

    if (canvas.ensure(height)) {
      canvas.cell(`${invoiceNo} (continued)`, LEFT, RIGHT, 12, { font: bold });
      canvas.gap(14);
      itemHeader(canvas, data.currency);
    }

    for (let col = 0; col < ITEM_COLS.length - 1; col++) canvas.box(ITEM_COLS[col], ITEM_COLS[col + 1], height);

    const centre = { align: "center" as const };
    canvas.cell(String(index + 1), ITEM_COLS[0], ITEM_COLS[1], height, centre);
    canvas.cell(item.hsn.trim() || "-", ITEM_COLS[2], ITEM_COLS[3], height, centre);
    canvas.cell(item.qty.trim(), ITEM_COLS[3], ITEM_COLS[4], height, centre);
    canvas.cell(formatMoney(parseAmount(item.rate), 3), ITEM_COLS[4], ITEM_COLS[5], height, centre);
    canvas.cell(formatMoney(lineAmount(item)), ITEM_COLS[5], ITEM_COLS[6], height, centre);

    const top = canvas.y + (height - descLines.length * LINE_H) / 2;
    descLines.forEach((line, lineIndex) => {
      let x = (ITEM_COLS[1] + ITEM_COLS[2] - line.width) / 2;
      const baseline = top + lineIndex * LINE_H + LINE_H / 2 + BODY * 0.36;
      // Draw consecutive same-style words as one string so the font's own spacing is kept.
      let segment = line.words[0];
      let segmentText = segment.text;
      const flush = () => {
        canvas.text(segmentText, x, baseline, segment.font, segment.size);
        x += canvas.width(segmentText, segment.font, segment.size);
      };
      line.words.slice(1).forEach((word) => {
        if (word.font === segment.font && word.size === segment.size) {
          segmentText += ` ${word.text}`;
        } else {
          flush();
          x += Math.max(word.space, canvas.width(" ", segment.font, segment.size));
          segment = word;
          segmentText = word.text;
        }
      });
      flush();
    });
    canvas.gap(height);
  });

  const total = invoiceTotal(data.items);
  canvas.ensure(24);
  canvas.box(LEFT, ITEM_COLS[5], 12, LABEL_BG);
  canvas.box(ITEM_COLS[5], RIGHT, 12);
  canvas.cell("GRAND TOTAL", LEFT, ITEM_COLS[5], 12, { font: bold, size: 7.8, align: "right" });
  canvas.cell(formatMoney(total), ITEM_COLS[5], RIGHT, 12, { font: bold, size: 7.8, align: "right" });
  canvas.gap(12);

  canvas.box(LEFT, RIGHT, 12, LIGHT);
  canvas.cell(`Amount in Words: ${amountInWords(total, data.currency)}`, LEFT, RIGHT, 12, {
    font: canvas.fonts.boldItalic,
    align: "center",
  });
  canvas.gap(12);
}

function bankSection(canvas: InvoiceCanvas) {
  const { bold, regular } = canvas.fonts;
  const labelWidth = INFO_COLS[1] - LEFT - PAD * 2;
  const rows = INVOICE_BANK.map((row) => {
    const labelLines = canvas.wrap(row.label, bold, BODY, labelWidth);
    const valueLines = canvas.wrap(row.value, regular, BODY, RIGHT - INFO_COLS[1] - PAD * 2);
    const link = "link" in row && row.link;
    const height = link ? 18 : Math.max(10, Math.max(labelLines.length, valueLines.length) * 10.5);
    return { labelLines, valueLines, link, height };
  });

  canvas.ensure(9.5 + rows.reduce((sum, row) => sum + row.height, 0));
  sectionBar(canvas, "BANK DETAILS", 9.5, BLUE, BODY);

  for (const row of rows) {
    canvas.box(LEFT, INFO_COLS[1], row.height, LABEL_BG);
    canvas.box(INFO_COLS[1], RIGHT, row.height);
    canvas.lines(row.labelLines, LEFT, INFO_COLS[1], row.height, { font: bold }, 10.5);
    if (row.link) {
      const size = 9;
      const value = row.valueLines[0];
      const baseline = canvas.y + row.height / 2 + size * 0.36;
      const x = INFO_COLS[1] + PAD;
      canvas.text(value, x, baseline, regular, size, LINK);
      canvas.page.drawLine({
        start: { x, y: PAGE_H - baseline - 1.2 },
        end: { x: x + canvas.width(value, regular, size), y: PAGE_H - baseline - 1.2 },
        thickness: 0.5,
        color: LINK,
      });
    } else {
      canvas.lines(row.valueLines, INFO_COLS[1], RIGHT, row.height, {}, 10.5);
    }
    canvas.gap(row.height);
  }
}

function signatureSection(canvas: InvoiceCanvas, declaration: string) {
  const { bold, italic } = canvas.fonts;
  const blockH = 72;
  canvas.ensure(blockH + 40);

  canvas.box(LEFT, SIGN_SPLIT, blockH);
  canvas.box(SIGN_SPLIT, RIGHT, blockH);
  const declLines = canvas.wrap(declaration, italic, 6.2, SIGN_SPLIT - LEFT - PAD * 2);
  canvas.lines(declLines, LEFT, SIGN_SPLIT, blockH, { font: italic, size: 6.2 }, 9.6);
  // Right-hand box is left blank for the company stamp and signature.
  canvas.gap(blockH);

  const footer = [
    { text: INVOICE_COMPANY.signatoryName, font: bold },
    { text: "", font: bold },
    { text: "", font: bold },
    { text: "Authorised Signatory", font: italic },
  ];
  for (const row of footer) {
    canvas.box(LEFT, SIGN_SPLIT, 10);
    canvas.box(SIGN_SPLIT, RIGHT, 10);
    canvas.cell(row.text, SIGN_SPLIT, RIGHT, 10, { font: row.font, align: "center" });
    canvas.gap(10);
  }
}

/** Renders a proforma or commercial invoice in the IntraTrade template and returns the PDF bytes. */
export async function renderInvoicePdf(data: InvoiceData, invoiceNo: string) {
  const pdf = await PDFDocument.create();
  const meta = INVOICE_TYPES[data.type];
  pdf.setTitle(`${meta.label} ${invoiceNo}`);
  pdf.setAuthor(INVOICE_COMPANY.signatoryName.replace(/^For /, ""));
  pdf.setCreator("ITPLSourcing invoices");

  const fonts: Fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    italic: await pdf.embedFont(StandardFonts.HelveticaOblique),
    boldItalic: await pdf.embedFont(StandardFonts.HelveticaBoldOblique),
  };
  const canvas = new InvoiceCanvas(pdf, fonts);

  // Company header
  canvas.box(LEFT, RIGHT, 24.5, NAVY);
  canvas.cell(INVOICE_COMPANY.name, LEFT, RIGHT, 24.5, { font: fonts.bold, size: 12.5, color: WHITE, align: "center" });
  canvas.gap(24.5);
  canvas.box(LEFT, RIGHT, 24, LIGHT);
  canvas.cell(INVOICE_COMPANY.addressLine, LEFT, RIGHT, 24, { font: fonts.italic, size: 6.2, align: "center" });
  canvas.gap(24);
  canvas.gap(5);
  sectionBar(canvas, meta.title, 19, BLUE, 11);
  canvas.gap(4.5);

  const date = formatInvoiceDate(data.invoiceDate);
  if (data.type === "PI") {
    labelGrid(canvas, [
      ["Invoice No.", invoiceNo, "Invoice Date", date],
      ["PO", data.po, "Payment Terms", data.paymentTerms],
      ["IEC No.", data.iecNo, "Country of Origin", data.countryOfOrigin],
      ["LUT Ref", data.lutRef, "Country of Destination", data.countryOfDestination],
    ]);
  } else {
    labelGrid(canvas, [
      ["Invoice No.", invoiceNo, "Invoice Date", date],
      ["PI Ref", data.piReference, "Payment Terms", data.paymentTerms],
      ["PO", data.po, "Incoterms", data.shipment.incoterms],
      ["IEC No.", data.iecNo, "Country of Origin", data.countryOfOrigin],
      ["LUT Ref", data.lutRef, "Country of Destination", data.countryOfDestination],
    ]);
  }
  canvas.gap(6.5);

  partySection(canvas, data.billTo, data.shipToSameAsBillTo ? data.billTo : data.shipTo);
  canvas.gap(6);

  if (data.type === "CI") {
    const fields = SHIPMENT_FIELDS.filter((field) => field.key !== "incoterms" && data.shipment[field.key].trim());
    if (fields.length) {
      const rows: [string, string, string, string][] = [];
      for (let i = 0; i < fields.length; i += 2) {
        const [a, b] = [fields[i], fields[i + 1]];
        rows.push([a.label, data.shipment[a.key], b?.label ?? "", b ? data.shipment[b.key] : ""]);
      }
      canvas.ensure(9.5 + rows.length * 12);
      sectionBar(canvas, "SHIPMENT DETAILS", 9.5, BLUE, BODY);
      labelGrid(canvas, rows, SHIPMENT_COLS);
      canvas.gap(6);
    }
  }

  itemsSection(canvas, data, invoiceNo);
  canvas.gap(6.5);
  bankSection(canvas);
  canvas.gap(6);
  signatureSection(canvas, data.declaration);

  return pdf.save();
}
