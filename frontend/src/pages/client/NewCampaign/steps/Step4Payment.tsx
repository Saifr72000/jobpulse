import type { FormState, Product, PaymentMethod } from "../types";
import { PaymentMethodCard } from "../components/PaymentMethodCard";
import { OrderSummary } from "../components/OrderSummary";
import "./Step4Payment.scss";

interface PaymentMethodOption {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: React.ReactNode;
  extra?: React.ReactNode;
}

interface Step4PaymentProps {
  form: FormState;
  channels: Product[];
  packages: Product[];
  addons: Product[];
  paymentMethodsConfig: PaymentMethodOption[];
  onFormChange: (updates: Partial<FormState>) => void;
}

export function Step4Payment({
  form,
  channels,
  packages,
  addons,
  paymentMethodsConfig,
  onFormChange,
}: Step4PaymentProps) {
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
              extra={pm.extra}
              onClick={() => onFormChange({ paymentMethod: pm.id })}
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
