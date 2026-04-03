import type { IOrder } from "../../../../api/orders";
import { LOGO_MAP } from "../../NewCampaign/constants";
import { getAddonIcon } from "../../NewCampaign/addonIcons";
import Icon from "../../../../components/Icon/Icon";
import "./OrderSummaryPanel.scss";

interface OrderSummaryPanelProps {
  order: IOrder;
}

function formatNOK(amount: number): string {
  return `${amount.toLocaleString("nb-NO")} kr`;
}

function getChannelLogo(name: string): string | undefined {
  const key = Object.keys(LOGO_MAP).find(
    (k) => k.toLowerCase() === name.toLowerCase(),
  );
  return key ? LOGO_MAP[key] : undefined;
}

function getPlanLabel(order: IOrder): string {
  if (order.orderType === "package" && order.package) {
    const capitalised =
      order.package.charAt(0).toUpperCase() + order.package.slice(1);
    return `${capitalised} campaign package`;
  }
  return "Custom plan";
}

export function OrderSummaryPanel({ order }: OrderSummaryPanelProps) {
  const packageItem = order.lineItems?.find((i) => i.type === "package");
  const channelItems = order.lineItems?.filter((i) => i.type === "channel") ?? [];
  const addonItems = order.lineItems?.filter((i) => i.type === "addon") ?? [];

  const vatRate = order.vatRate ?? 0.25;
  const vatAmount = order.vatAmount ?? 0;
  const totalAmount = order.totalAmount ?? 0;

  return (
    <div className="summary-panel card">
      <h4>Order summary</h4>

      {packageItem && (
        <div className="summary-row summary-row--package">
          <span>{getPlanLabel(order)}</span>
          <span>{formatNOK(packageItem.price)}</span>
        </div>
      )}

      <hr className="summary-divider" />

      <p className="summary-section-title">Channels:</p>
      {channelItems.length === 0 ? (
        <div className="summary-row">
          <span>No channels</span>
          <span>—</span>
        </div>
      ) : (
        channelItems.map((item) => {
          const logo = getChannelLogo(item.name);
          return (
            <div key={item.name} className="summary-row">
              <span className="summary-row__name">
                {logo && (
                  <img src={logo} alt={item.name} className="summary-row__logo" />
                )}
                {item.name}
              </span>
              <span>{formatNOK(item.price)}</span>
            </div>
          );
        })
      )}

      <hr className="summary-divider" />

      <p className="summary-section-title">Add-ons:</p>
      {addonItems.length === 0 ? (
        <div className="summary-row">
          <span>No add-ons</span>
          <span>—</span>
        </div>
      ) : (
        addonItems.map((item) => (
          <div key={item.name} className="summary-row">
            <span className="summary-row__name">
              <span className="summary-row__addon-icon">
                <Icon svg={getAddonIcon(item.name)} size={14} />
              </span>
              {item.name}
            </span>
            <span>{formatNOK(item.price)}</span>
          </div>
        ))
      )}

      <hr className="summary-divider" />

      <div className="summary-row summary-row--vat">
        <span>VAT ({Math.round(vatRate * 100)}%)</span>
        <span>{formatNOK(vatAmount)}</span>
      </div>

      <div className="summary-row summary-row--total">
        <span>Total:</span>
        <span>{formatNOK(totalAmount)}</span>
      </div>

      <button className="btn-invoice" type="button" disabled>
        Download invoice
      </button>
    </div>
  );
}
