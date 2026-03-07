import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { allOrders, statusConfig, formatNOK } from "../data/orders";
import type { OrderStatus } from "../data/orders";
import "./MyOrders.css";

const imgExpandArrow =
  "https://www.figma.com/api/mcp/asset/7e0bef5b-dc3c-477e-b67a-249b385d0a20";

interface Props {
  onNavigate: (page: string) => void;
}

export default function MyOrders({ onNavigate }: Props) {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const filtered = allOrders.filter((o) =>
    statusFilter === "all" ? true : o.status === statusFilter
  );

  return (
    <div className="mo-page">
      <Sidebar activePage="my-orders" onNavigate={onNavigate} />

      <div className="mo-content">
        <header className="mo-header">
          <div className="mo-title-wrap" />
          <div className="mo-user-profile">
            <div className="mo-user-avatar">JD</div>
            <div className="mo-user-info">
              <span className="mo-user-name">John Doe</span>
              <span className="mo-user-role">Customer</span>
            </div>
            <img src={imgExpandArrow} alt="" className="mo-expand-arrow" />
          </div>
        </header>

        <div className="mo-orders-card">
          <div className="mo-topbar">
            <h2>Orders</h2>
            <div className="mo-topbar-controls">
              <div className="mo-filter-pills">
                {(
                  [
                    "all",
                    "pending",
                    "processing",
                    "shipped",
                    "delivered",
                    "cancelled",
                  ] as const
                ).map((s) => (
                  <button
                    key={s}
                    className={`mo-pill${statusFilter === s ? " mo-pill--active" : ""}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s === "all" ? "All" : statusConfig[s].label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mo-col-headers">
            <span>Order</span>
            <span>Campaign</span>
            <span>Date</span>
            <span>Status</span>
            <span>Amount</span>
            <span />
          </div>

          <div className="mo-rows">
            {filtered.length === 0 ? (
              <div className="mo-empty">No orders found.</div>
            ) : (
              filtered.map((order) => {
                const sc = statusConfig[order.status];
                return (
                  <div
                    key={order.id}
                    className="mo-row"
                    onClick={() => onNavigate(`order-detail:${order.id}`)}
                  >
                    <div className="mo-cell-order">
                      <span className="mo-order-id">{order.id}</span>
                      <span className="mo-order-client">{order.client}</span>
                    </div>

                    <div className="mo-cell-products">
                      <span className="mo-product-primary">
                        {order.campaignName}
                      </span>
                      <span className="mo-product-more">
                        {order.channels.slice(0, 2).join(", ")}
                        {order.channels.length > 2
                          ? ` +${order.channels.length - 2}`
                          : ""}
                      </span>
                    </div>

                    <span className="mo-cell-date">{order.date}</span>

                    <span className={`mo-status-badge ${sc.cls}`}>
                      {sc.label}
                    </span>

                    <span className="mo-cell-amount">
                      {formatNOK(order.rawAmount)}
                    </span>

                    <button
                      className="mo-row-btn"
                      aria-label="View order details"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(`order-detail:${order.id}`);
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M2 12L12 2M12 2H6M12 2V8"
                          stroke="#888"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
