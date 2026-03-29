import { useState, useEffect, useCallback } from "react";
import { BuyValueCardModal } from "../modals/BuyValueCardModal";
import { VALUE_CARDS, type ValueCardTier } from "../../../../data/valueCards";
import { getValueCardAccount, type ValueCardAccountResponse } from "../../../../api/valueCards";

const MOCK_FRAMEWORK = {
  status: "Active",
  discount: "20% on all services",
  commitPeriod: "2 years",
  period: "01.02.25 - 01.02.26",
};

function formatCurrency(n: number) {
  return n.toLocaleString("nb-NO") + " kr";
}

function formatPurchaseDate(iso: string) {
  return new Date(iso).toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export function PaymentTab() {
  const [modalCard, setModalCard] = useState<ValueCardTier | null>(null);
  const [account, setAccount] = useState<ValueCardAccountResponse | null>(null);

  const loadAccount = useCallback(async () => {
    try {
      const data = await getValueCardAccount();
      setAccount(data);
    } catch {
      setAccount({ active: false });
    }
  }, []);

  useEffect(() => {
    void loadAccount();
  }, [loadAccount]);

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

        {account?.active && (
          <div className="active-card">
            <div className="active-card__info">
              <h4>{account.cardName}</h4>
              <p className="body-3 text-muted">
                Purchased on {formatPurchaseDate(account.purchasedAt)}
              </p>
            </div>
            <div className="active-card__balance">
              <span className="body-3 text-muted">Remaining balance</span>
              <span className="active-card__amount body-1">
                {formatCurrency(account.remainingBalance)}
              </span>
            </div>
          </div>
        )}
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
        <BuyValueCardModal
          card={modalCard}
          onClose={() => setModalCard(null)}
          onSuccess={() => {
            void loadAccount();
          }}
        />
      )}
    </>
  );
}
