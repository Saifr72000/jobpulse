import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { allOrders, statusConfig, formatNOK } from "../../../data/orders";
import type { OrderStatus } from "../../../data/orders";

const STATUS_FILTERS = ["all", "pending", "processing", "shipped", "delivered", "cancelled"] as const;

export default function MyOrders() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const filtered = allOrders.filter((o) =>
    statusFilter === "all" ? true : o.status === statusFilter
  );

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto">

      {/* Orders Card */}
      <div className="bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-4">

        {/* Topbar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-[32px] font-bold text-black">Orders</h2>
          <div className="flex items-center gap-2 flex-wrap">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-1.5 rounded-[40px] text-sm border cursor-pointer transition-colors ${
                  statusFilter === s
                    ? "bg-black text-white border-black"
                    : "bg-white text-text border-[#e5e7eb] hover:border-black"
                }`}
              >
                {s === "all" ? "All" : statusConfig[s].label}
              </button>
            ))}
          </div>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_40px] gap-4 px-4 text-sm text-text-muted font-medium">
          <span>Order</span>
          <span>Campaign</span>
          <span>Date</span>
          <span>Status</span>
          <span>Amount</span>
          <span />
        </div>

        {/* Rows */}
        <div className="flex flex-col divide-y divide-background">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-[#9ca3af]">No orders found.</div>
          ) : (
            filtered.map((order) => {
              const sc = statusConfig[order.status];
              return (
                <div
                  key={order.id}
                  className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_40px] gap-4 items-center px-4 py-4 cursor-pointer hover:bg-[#f9fafb] rounded-xl transition-colors"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-medium text-black truncate">{order.id}</span>
                    <span className="text-xs text-text-muted truncate">{order.client}</span>
                  </div>

                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm text-black truncate">{order.campaignName}</span>
                    <span className="text-xs text-text-muted truncate">
                      {order.channels.slice(0, 2).join(", ")}
                      {order.channels.length > 2 ? ` +${order.channels.length - 2}` : ""}
                    </span>
                  </div>

                  <span className="text-sm text-text">{order.date}</span>

                  <span className={`inline-flex items-center px-3 py-1 rounded-[40px] text-xs font-medium w-fit ${sc.cls}`}>
                    {sc.label}
                  </span>

                  <span className="text-sm font-medium text-black">{formatNOK(order.rawAmount)}</span>

                  <button
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-background hover:bg-border transition-colors border-0 cursor-pointer shrink-0"
                    aria-label="View order details"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/orders/${order.id}`);
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
  );
}
