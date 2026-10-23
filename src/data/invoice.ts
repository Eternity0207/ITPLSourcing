// Fixed company details printed on every proforma and commercial invoice.
// Fields that can change per invoice (IEC, LUT, declaration) are only the
// defaults the invoice form starts with.

export const INVOICE_COMPANY = {
  name: "INTRATRADE PRIVATE LIMITED",
  signatoryName: "For Intratrade Private Limited",
  addressLine:
    "36, Subhash Nagar, Opp. B.N. College, Udaipur 313001, Rajasthan, India  |  GST: 08AAICI4151M1Z9  |  Ph: +91-8105535577 / +91-8875515444",
  iecNo: "AAICI4151M",
  lutRef: "AD080526023271C",
};

export const INVOICE_BANK = [
  { label: "Veem ID", value: "nitesh@cimboxe.com", link: true },
  { label: "Bank Name", value: "ICICI Bank Limited" },
  { label: "Account", value: "Intratrade Private Limited" },
  { label: "Account", value: "694105601279" },
  { label: "IFSC Code", value: "ICIC0006941" },
  { label: "SWIFT Code", value: "ICICINBBCTS" },
  {
    label: "Bank Address",
    value: "ICICI Bank, Udaipur Sunderwas Main Road Branch,\nOstwal Plaza II , Sunderwas Main Road , Udaipur 313001",
  },
] as const;

export const INVOICE_DECLARATIONS = {
  PI: "Declaration: We hereby certify that the price and quantity mentioned in this invoice is true and correct and that all goods are of Indian origin.",
  CI: "Declaration: We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct. All goods are of Indian origin. Supply meant for export under LUT without payment of IGST.",
};

export const INVOICE_CURRENCIES = ["USD", "EUR", "GBP", "AUD", "CAD", "AED", "SGD", "INR"] as const;

export const INVOICE_TYPES = {
  PI: { title: "PROFORMA INVOICE", label: "Proforma Invoice", folder: "Proforma Invoices", slug: "proforma" },
  CI: { title: "COMMERCIAL INVOICE", label: "Commercial Invoice", folder: "Commercial Invoices", slug: "commercial" },
} as const;
