import Icon from "../../../../components/Icon/Icon";
import { useNewCampaign } from "../../../../context/NewCampaignContext";
import { PaymentMethodCard } from "../components/PaymentMethodCard";
import { OrderSummary } from "../components/OrderSummary";
import CardIcon from "../../../../assets/icons/card.svg?react";
import InvoiceIcon from "../../../../assets/icons/invoice.svg?react";
import { ash } from "../../../../styles/colors.ts";
import type { PaymentMethod } from "../types";
import "./Step4Payment.scss";

interface PaymentMethodOption {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: React.ReactNode;
}

export function Step4Payment() {
  const { form, updateForm, channels, packages, addons } = useNewCampaign();

  const paymentMethodsConfig: PaymentMethodOption[] = [
    {
      id: "card-payment",
      label: "Card payment",
      description: "Pay securely with your debit or credit card",
      icon: <Icon svg={CardIcon} size={20} color={ash} />,
    },
    {
      id: "invoice",
      label: "Invoice",
      description: "Receive an invoice with 30 days due date",
      icon: <Icon svg={InvoiceIcon} size={20} color={ash} />,
    },
  ];

  return (
    <div className="step4">
      <div className="order-card">
        <h4>Payment method</h4>
        <div className="payment-methods">
          {paymentMethodsConfig.map((pm) => (
            <PaymentMethodCard
              key={pm.id}
              method={pm.id}
              selected={form.paymentMethod === pm.id}
              icon={pm.icon}
              label={pm.label}
              description={pm.description}
              onClick={() => updateForm({ paymentMethod: pm.id })}
            />
          ))}
        </div>
      </div>

      <OrderSummary
        form={form}
        showVat={true}
        channels={channels}
        packages={packages}
        addons={addons}
      />
    </div>
  );
}
