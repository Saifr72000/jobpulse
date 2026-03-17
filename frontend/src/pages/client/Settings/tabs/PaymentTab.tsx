import { useState } from "react";
import { BuyValueCardModal } from "../modals/BuyValueCardModal";

interface ValueCard {
  id: string;
  name: string;
  price: number;
  balance: number;
}

const VALUE_CARDS: ValueCard[] = [
  { id: "vc-100", name: "Value 100 000", price: 90000, balance: 100000 },
  { id: "vc-250", name: "Value 250 000", price: 222500, balance: 250000 },
  { id: "vc-400", name: "Value 400 000", price: 352000, balance: 400000 },
  { id: "vc-650", name: "Value 650 000", price: 565500, balance: 650000 },
];

const MOCK_ACTIVE_CARD = {
  name: "Value 250 000",
  purchaseDate: "15.01.26",
  remaining: 187400,
};

const MOCK_FRAMEWORK = {
  status: "Active",
  discount: "20% on all services",
  commitPeriod: "2 years",
  period: "01.02.25 – 01.02.26",
};

function formatCurrency(n: number) {
  return n.toLocaleString("nb-NO") + " kr";
}

export function PaymentTab() {
  const [modalCard, setModalCard] = useState<ValueCard | null>(null);

  return (
    <>
      {/* Value Cards */}
      <div className="settings-card">
        <div className="settings-card__header">
          <div className="settings-card__title-group">
            <h4>Value card</h4>
            <p className="body-3 text-muted">
              Purchase a value card to get more balance than what you pay
            </p>
          </div>
        </div>

        <div className="value-cards">
          {VALUE_CARDS.map((card) => (
            <div key={card.id} className="value-card">
              <h4>{card.name}</h4>
              <div className="value-card__rows">
                <div className="value-card__row">
                  <span className="body-3 text-muted">Price</span>
                  <span className="body-3">{formatCurrency(card.price)}</span>
                </div>
                <div className="value-card__row">
                  <span className="body-3 text-muted">Balance</span>
                  <span className="body-3">{formatCurrency(card.balance)}</span>
                </div>
              </div>
              <button className="btn-violet" onClick={() => setModalCard(card)}>
                Buy value card
              </button>
            </div>
          ))}
        </div>

        {/* Active Card Panel */}
        <div className="active-card">
          <div className="active-card__info">
            <h4>{MOCK_ACTIVE_CARD.name}</h4>
            <p className="body-3 text-muted">Purchased on {MOCK_ACTIVE_CARD.purchaseDate}</p>
          </div>
          <div className="active-card__balance">
            <span className="body-3 text-muted">Remaining balance</span>
            <span className="active-card__amount body-1">
              {formatCurrency(MOCK_ACTIVE_CARD.remaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Framework Agreement */}
      <div className="settings-card">
        <div className="settings-card__header">
          <div className="settings-card__title-group">
            <h4>Framework agreement</h4>
            <p className="body-3 text-muted">
              A framework agreement gives your company a fixed discount on all services in exchange
              for a 2-year commitment to JobPulse as your supplier.
            </p>
          </div>
        </div>

        <div className="framework-agreement">
          <h4>Current framework agreement</h4>
          <div className="framework-agreement__rows">
            <div className="framework-agreement__row">
              <span className="body-3 text-muted">Status</span>
              <span className="body-3">{MOCK_FRAMEWORK.status}</span>
            </div>
            <div className="framework-agreement__row">
              <span className="body-3 text-muted">Discount</span>
              <span className="body-3">{MOCK_FRAMEWORK.discount}</span>
            </div>
            <div className="framework-agreement__row">
              <span className="body-3 text-muted">Commit period</span>
              <span className="body-3">{MOCK_FRAMEWORK.commitPeriod}</span>
            </div>
            <div className="framework-agreement__row">
              <span className="body-3 text-muted">Period</span>
              <span className="body-3">{MOCK_FRAMEWORK.period}</span>
            </div>
          </div>
        </div>
      </div>

      {modalCard && (
        <BuyValueCardModal card={modalCard} onClose={() => setModalCard(null)} />
      )}
    </>
  );
}
