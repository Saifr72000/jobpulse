import { useMyOrders } from '../../hooks/useMyOrders';
import { formatDateShort } from '../../utils/date';
import type { Order, OrderStatus } from '../../api/orders';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function OrderRow({ order }: { order: Order }) {
  return (
    <tr className="border-b border-[#E5E7EB] last:border-b-0">
      <td className="py-4 pr-4 text-[14px] font-medium text-black">
        {order._id.slice(-8).toUpperCase()}
      </td>
      <td className="py-4 pr-4 text-[14px] text-[#424241]">
        {order.companyName}
      </td>
      <td className="py-4 pr-4 text-[14px] text-[#424241]">
        {formatDateShort(order.createdAt)}
      </td>
      <td className="py-4 pr-4">
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-[12px] font-medium ${
            order.status === 'delivered'
              ? 'bg-[#D1FAE5] text-[#065F46]'
              : order.status === 'cancelled'
                ? 'bg-[#FEE2E2] text-[#991B1B]'
                : order.status === 'shipped' || order.status === 'processing'
                  ? 'bg-[#DBEAFE] text-[#1E40AF]'
                  : 'bg-[#FEF3C7] text-[#92400E]'
          }`}
        >
          {STATUS_LABELS[order.status]}
        </span>
      </td>
      <td className="py-4 text-[14px] font-medium text-black">
        {formatCurrency(order.totalAmount)}
      </td>
    </tr>
  );
}

export function MyOrdersList() {
  const { orders, loading, error, refetch } = useMyOrders();

  if (loading) {
    return (
      <div className="font-['Helvetica'] flex items-center justify-center rounded-[20px] bg-white p-12 shadow-[0px_0px_15px_rgba(0,0,0,0.05)]">
        <p className="text-[15px] text-[#424241]">Loading orders…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-['Helvetica'] rounded-[20px] bg-white p-6 shadow-[0px_0px_15px_rgba(0,0,0,0.05)]">
        <p className="mb-3 text-[15px] text-[#991B1B]">{error}</p>
        <button
          type="button"
          onClick={refetch}
          className="rounded-[10px] bg-black px-4 py-2 text-[14px] font-medium text-white hover:bg-[#333]"
        >
          Try again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="font-['Helvetica'] flex items-center justify-center rounded-[20px] bg-white p-12 shadow-[0px_0px_15px_rgba(0,0,0,0.05)]">
        <p className="text-[15px] text-[#424241]">You have no orders yet.</p>
      </div>
    );
  }

  return (
    <div className="font-['Helvetica'] overflow-hidden rounded-[20px] bg-white px-6 shadow-[0px_0px_15px_rgba(0,0,0,0.05)]">
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
            <th className="py-3 pr-4 text-left text-[12px] font-semibold uppercase tracking-wide text-[#6B7280]">
              Order ID
            </th>
            <th className="py-3 pr-4 text-left text-[12px] font-semibold uppercase tracking-wide text-[#6B7280]">
              Company
            </th>
            <th className="py-3 pr-4 text-left text-[12px] font-semibold uppercase tracking-wide text-[#6B7280]">
              Date
            </th>
            <th className="py-3 pr-4 text-left text-[12px] font-semibold uppercase tracking-wide text-[#6B7280]">
              Status
            </th>
            <th className="py-3 text-left text-[12px] font-semibold uppercase tracking-wide text-[#6B7280]">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow key={order._id} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
