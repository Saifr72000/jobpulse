import type { IOrder } from "../../../../api/orders";
import "./OrderSummaryPanel.scss";

interface OrderSummaryPanelProps {
  order: IOrder;
}

const ADDON_LABELS: Record<string, string> = {
  "lead-ads": "Lead Ads",
  "video-campaign": "Video Campaign",
  "linkedin-job-posting": "LinkedIn Job Posting",
};

function formatNOK(amount: number): string {
  return amount.toLocaleString("nb-NO", { style: "currency", currency: "NOK" });
}

function getPlanLabel(order: IOrder): string {
  if (order.orderType === "package" && order.package) {
    const capitalised =
      order.package.charAt(0).toUpperCase() + order.package.slice(1);
    return `${capitalised} plan`;
  }
  return "Custom plan";
}

export function OrderSummaryPanel({ order }: OrderSummaryPanelProps) {
  const vat = order.totalAmount - order.totalAmount / 1.25;

  return (
    <div className="summary-panel card">
      <h4>{getPlanLabel(order)}</h4>

      <p className="summary-section-title">Channels:</p>
      {order.channels.length === 0 ? (
        <div className="summary-row">
          <span>No channels</span>
          <span>0 kr</span>
        </div>
      ) : (
        order.channels.map((ch) => (
          <div key={ch} className="summary-row">
            <span>{ch}</span>
            <span>0 kr</span>
          </div>
        ))
      )}

      <hr className="divider" />

      <p className="summary-section-title">Add-ons:</p>
      {order.addons.length === 0 ? (
        <div className="summary-row">
          <span>No add-ons</span>
          <span>0 kr</span>
        </div>
      ) : (
        order.addons.map((addon) => (
          <div key={addon} className="summary-row">
            <span>{ADDON_LABELS[addon] ?? addon}</span>
            <span>0 kr</span>
          </div>
        ))
      )}

      <hr className="divider" />

      <div className="summary-vat">
        <span>VAT (25%)</span>
        <span>{formatNOK(vat)}</span>
      </div>
      <div className="summary-total">
        <span>Total</span>
        <span>{formatNOK(order.totalAmount)}</span>
      </div>

      <button className="btn-invoice" type="button" disabled>
        Download invoice
      </button>
    </div>
  );
}
