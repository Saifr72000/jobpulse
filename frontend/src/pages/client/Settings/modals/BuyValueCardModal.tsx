import { useState } from "react";
import InputField from "../../../../components/InputField/InputField";

interface ValueCard {
  id: string;
  name: string;
  price: number;
  balance: number;
}

interface BuyValueCardModalProps {
  card: ValueCard;
  onClose: () => void;
}

type PaymentMethod = "card" | "invoice";

function formatCurrency(n: number) {
  return n.toLocaleString("nb-NO") + " kr";
}

export function BuyValueCardModal({ card, onClose }: BuyValueCardModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    expireDate: "",
    cvc: "",
    cardholderName: "",
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <div>
            <h3>Purchase {card.name}</h3>
            <p className="body-3 text-muted">
              Choose your preferred payment method to complete the purchase
            </p>
          </div>
          <button className="modal__close h4" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal__summary">
          <h4>Order summary</h4>
          <div className="summary-rows">
            <div className="summary-row">
              <span className="body-3 text-muted">{card.name}</span>
              <span className="body-3">{formatCurrency(card.price)}</span>
            </div>
            <div className="summary-row">
              <span className="body-3 text-muted">Balance you receive</span>
              <span className="body-3">{formatCurrency(card.balance)}</span>
            </div>
            <hr className="summary-divider" />
            <div className="summary-row">
              <span className="body-3">Total</span>
              <span className="body-3">{formatCurrency(card.price)}</span>
            </div>
          </div>
        </div>

        <div className="modal__payment">
          <div
            className={`payment-option${paymentMethod === "card" ? " payment-option--active" : ""}`}
            onClick={() => setPaymentMethod("card")}
          >
            <span className="payment-option__radio" />
            <div>
              <span className="body-2">Card payment</span>
              <p className="body-3 text-muted">Pay securely with your debit or credit card</p>
            </div>
          </div>
          <div
            className={`payment-option${paymentMethod === "invoice" ? " payment-option--active" : ""}`}
            onClick={() => setPaymentMethod("invoice")}
          >
            <span className="payment-option__radio" />
            <div>
              <span className="body-2">Invoice</span>
              <p className="body-3 text-muted">Receive an invoice with 30 days due date</p>
            </div>
          </div>
        </div>

        {paymentMethod === "card" && (
          <div className="modal__card-form">
            <InputField
              label="Card number"
              type="text"
              placeholder="1234 5678 9101 3456"
              value={cardForm.cardNumber}
              onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
            />
            <div className="modal__card-row">
              <InputField
                label="Expire date"
                type="text"
                placeholder="MM / YY"
                value={cardForm.expireDate}
                onChange={(e) => setCardForm({ ...cardForm, expireDate: e.target.value })}
              />
              <InputField
                label="CVC"
                type="text"
                placeholder="123"
                value={cardForm.cvc}
                onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value })}
              />
            </div>
            <InputField
              label="Cardholder name"
              type="text"
              placeholder="Full name on card"
              value={cardForm.cardholderName}
              onChange={(e) =>
                setCardForm({ ...cardForm, cardholderName: e.target.value })
              }
            />
          </div>
        )}

        {/* TODO: wire to payment API */}
        <button className="btn-midnight">Complete purchase</button>
      </div>
    </div>
  );
}
