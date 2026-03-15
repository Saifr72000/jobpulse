import type { FormState, Product, Channel, Package, Addon } from "../types";
import { LOGO_MAP } from "../constants";
import {
  calculatePackagePrice,
  calculateChannelCost,
  calculateAddonsCost,
  calculateSubtotal,
  calculateVat,
} from "../utils";
import "./OrderSummary.scss";

interface OrderSummaryProps {
  form: FormState;
  showVat: boolean;
  channels: Product[];
  packages: Product[];
  addons: Product[];
}

export function OrderSummary({
  form,
  showVat,
  channels,
  packages,
  addons,
}: OrderSummaryProps) {
  const pkg = packages.find((p) =>
    p.title.toLowerCase().includes(form.selectedPackage || ""),
  );
  const selChannels = channels.filter((c) =>
    form.selectedChannels.some(
      (sc) => c.title.toLowerCase() === sc.toLowerCase(),
    ),
  );
  const selAddons = addons.filter((a) =>
    form.selectedAddons.some((sa) =>
      a.title.toLowerCase().includes(sa.toLowerCase()),
    ),
  );

  const subtotal = calculateSubtotal(form, channels, packages, addons);
  const vat = calculateVat(subtotal);

  return (
    <aside className="order-summary">
      <h4>Order summary</h4>
      <p className="order-summary__plan-label">
        {pkg ? pkg.title : "Custom plan"}
      </p>

      <hr className="order-summary__divider" />

      <p className="order-summary__section-label">Channels:</p>
      {form.planType === "package" && selChannels.length === 0 ? (
        <div className="order-summary__row">
          <span>Included in package</span>
          <span>0 kr</span>
        </div>
      ) : (
        selChannels.map((ch) => (
          <div key={ch._id} className="order-summary__row">
            <span className="order-summary__channel-name">
              <img
                src={LOGO_MAP[ch.title] || ch.logo}
                alt={ch.title}
                className="order-summary__channel-logo"
              />
              {ch.title}
            </span>
            <span>
              {form.planType === "package"
                ? "0 kr"
                : `${ch.price.toLocaleString("nb-NO")} kr`}
            </span>
          </div>
        ))
      )}

      <hr className="order-summary__divider" />

      <p className="order-summary__section-label">Add-ons:</p>
      {selAddons.length === 0 ? (
        <div className="order-summary__row">
          <span>No add-ons</span>
          <span>0 kr</span>
        </div>
      ) : (
        selAddons.map((a) => (
          <div key={a._id} className="order-summary__row">
            <span className="order-summary__addon-name">
              <span className="addon-dot" />
              {a.title}
            </span>
            <span>{a.price.toLocaleString("nb-NO")} kr</span>
          </div>
        ))
      )}

      <hr className="order-summary__divider" />

      {showVat && (
        <div className="order-summary__row">
          <span>VAT (25%)</span>
          <span>{vat.toLocaleString("nb-NO")} kr</span>
        </div>
      )}

      <div className="order-summary__row order-summary__row--total">
        <span>Total:</span>
        <span>
          {(showVat ? subtotal + vat : subtotal).toLocaleString("nb-NO")} kr
        </span>
      </div>
    </aside>
  );
}
