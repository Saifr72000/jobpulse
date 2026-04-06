import api from "./axios";

export interface IOrderAssets {
  imageOption: string;
  imageMediaIds?: string[];
  leadAdDescription?: string;
  leadAdDescriptionText?: string;
  videoMaterials?: string;
  videoMediaIds?: string[];
  linkedinJobDescription?: string;
  linkedinJobDescriptionText?: string;
  linkedinScreeningQuestions?: string;
  linkedinScreeningQuestionsText?: string;
}

export interface ILineItem {
  type: "package" | "channel" | "addon";
  name: string;
  price: number;
}

export interface IPlatformCampaign {
  platform: string;
  externalCampaignId: string;
  adAccountId?: string;
  startDate?: string;
  endDate?: string;
  campaignStatus?: "active" | "paused" | "completed" | "draft";
}

export interface IOrder {
  _id: string;
  campaignName: string;
  companyName: string;
  orgNumber: string;
  status: "awaiting-payment" | "pending" | "in-progress" | "completed";
  orderType: "custom" | "package";
  package?: "basic" | "medium" | "deluxe";
  channels: string[];
  addons: string[];
  lineItems: ILineItem[];
  assets: IOrderAssets;
  targetAudience: string;
  additionalNotes?: string;
  paymentMethod: string;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  orderedBy: { firstName: string; lastName: string; email: string };
  platformCampaigns?: IPlatformCampaign[];
  createdAt: string;
}

export const getOrderById = async (id: string): Promise<IOrder> => {
  const res = await api.get<IOrder>(`/orders/${id}`);
  return res.data;
};

export const downloadInvoice = async (order: IOrder): Promise<void> => {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const L = 50;
  const R = 545;
  const W = R - L;

  const formatNOK = (n: number) => `${n.toLocaleString("nb-NO")} kr`;
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("nb-NO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  // ── Header ──────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold").setFontSize(24).setTextColor(0, 0, 0);
  doc.text("INVOICE", L, 70);

  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(100, 100, 100);
  doc.text(`Date: ${formatDate(order.createdAt)}`, L, 92);

  // ── Divider ──────────────────────────────────────────────────────────────
  doc.setDrawColor(220, 220, 220).setLineWidth(0.5).line(L, 112, R, 112);

  // ── From / To row ────────────────────────────────────────────────────────
  const col2 = 300;

  doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(0, 0, 0);
  doc.text("FROM", L, 130);
  doc.text("BILL TO", col2, 130);

  doc.setFont("helvetica", "normal").setTextColor(50, 50, 50);
  doc.text("En Lys Fremtid AS", L, 146);
  doc.text("Org. number: 925777978", L, 160);
  doc.text("post@enlysfremtid.no", L, 174);

  doc.text(order.companyName || "—", col2, 146);
  doc.text(`Org. number: ${order.orgNumber || "—"}`, col2, 160);

  if (order.orderedBy) {
    doc.text(
      `${order.orderedBy.firstName} ${order.orderedBy.lastName}`,
      col2,
      174,
    );
    doc.text(order.orderedBy.email, col2, 188);
  }

  // ── Campaign ──────────────────────────────────────────────────────────────
  doc.setDrawColor(220, 220, 220).line(L, 210, R, 210);

  doc.setFont("helvetica", "bold").setTextColor(0, 0, 0);
  doc.text("CAMPAIGN", L, 228);

  doc.setFont("helvetica", "normal").setTextColor(50, 50, 50);
  doc.text(order.campaignName, L, 244);

  // ── Line items ──────────────────────────────────────────────────────────────
  doc.setDrawColor(220, 220, 220).line(L, 264, R, 264);

  doc.setFont("helvetica", "bold").setTextColor(0, 0, 0);
  doc.text("DESCRIPTION", L, 282);
  doc.text("AMOUNT", R, 282, { align: "right" });

  doc.setDrawColor(220, 220, 220).line(L, 296, R, 296);

  let y = 312;
  doc.setFont("helvetica", "normal").setTextColor(50, 50, 50);

  for (const item of order.lineItems ?? []) {
    const label =
      item.name.charAt(0).toUpperCase() + item.name.slice(1);
    doc.text(label, L, y);
    doc.text(formatNOK(item.price), R, y, { align: "right" });
    y += 20;
  }

  // ── Totals ──────────────────────────────────────────────────────────────
  y += 8;
  doc.setDrawColor(220, 220, 220).line(L, y, R, y);
  y += 16;

  const vatPct = Math.round((order.vatRate ?? 0.25) * 100);

  doc.text("Subtotal", 350, y);
  doc.text(formatNOK(order.subtotal ?? 0), R, y, { align: "right" });
  y += 18;

  doc.text(`VAT (${vatPct}%)`, 350, y);
  doc.text(formatNOK(order.vatAmount ?? 0), R, y, { align: "right" });
  y += 18;

  doc.setDrawColor(0, 0, 0).line(350, y, R, y);
  y += 12;

  doc.setFont("helvetica", "bold").setTextColor(0, 0, 0);
  doc.text("Total", 350, y);
  doc.text(formatNOK(order.totalAmount ?? 0), R, y, { align: "right" });

  // ── Footer ──────────────────────────────────────────────────────────────
  doc
    .setFont("helvetica", "normal")
    .setFontSize(9)
    .setTextColor(150, 150, 150);
  doc.text("Generated by JobPulse", L + W / 2, 800, { align: "center" });

  doc.save(`invoice-${order._id}.pdf`);
};
