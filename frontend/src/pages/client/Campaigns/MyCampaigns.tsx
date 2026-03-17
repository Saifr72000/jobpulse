import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import "./MyCampaigns.scss";

// ─── Types ──────────────────────────────────────────────────────
interface Campaign {
  _id: string;
  campaignName?: string;
  status: string;
  createdAt: string;
  channels?: string[];
  totalAmount?: number;
}

const PAGE_SIZE = 20;

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatNOK(amount?: number) {
  if (!amount) return "—";
  return `${amount.toLocaleString("nb-NO")} NOK`;
}

function channelLabel(channels?: string[]) {
  if (!channels || channels.length === 0) return "—";
  if (channels.length === 1)
    return channels[0].charAt(0).toUpperCase() + channels[0].slice(1);
  return `${channels.length} channels`;
}

export default function MyOrders() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchCampaigns(page);
  }, [page]);

  async function fetchCampaigns(p: number) {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/orders/my-orders?page=${p}&limit=${PAGE_SIZE}`,
      );
      // Support both array response and paginated response shapes
      const list: Campaign[] = Array.isArray(data)
        ? data
        : (data.orders ?? data.data ?? []);
      setCampaigns(list);
      setHasMore(list.length === PAGE_SIZE);
    } catch {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="campaigns-page">
      {/* Header */}
      <div className="campaigns-page__header">
        <div className="page-header">
          <h2>Campaigns</h2>
          <p className="body-2">Access campaign details</p>
        </div>
        <button
          className="campaigns-page__new-btn"
          onClick={() => navigate("/orders/new")}
        >
          + New campaign
        </button>
      </div>

      {/* Table card */}
      <div className="campaigns-page__table-card">
        {/* Column headers */}
        <div className="campaigns-page__table-head">
          <span>Campaign</span>
          <span>Status</span>
          <span>Date</span>
          <span>Channels</span>
          <span>Total</span>
        </div>

        {loading ? (
          <div className="campaigns-page__loading">Loading campaigns...</div>
        ) : campaigns.length === 0 ? (
          <div className="campaigns-page__empty">No campaigns found.</div>
        ) : (
          campaigns.map((campaign) => (
            <div
              key={campaign._id}
              className="campaigns-page__table-row"
              onClick={() => navigate(`/campaigns/${campaign._id}`)}
            >
              <span className="campaigns-page__campaign-name">
                {campaign.campaignName ?? "Untitled campaign"}
              </span>
              <span className="campaigns-page__status">
                {formatStatus(campaign.status)}
              </span>
              <span className="campaigns-page__date">
                {formatDate(campaign.createdAt)}
              </span>
              <span className="campaigns-page__channels">
                {channelLabel(campaign.channels)}
              </span>
              <span className="campaigns-page__total">
                {formatNOK(campaign.totalAmount)}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {(hasMore || page > 1) && (
        <div className="campaigns-page__pagination">
          {page > 1 && (
            <button
              className="campaigns-page__next-btn"
              style={{
                marginRight: "8px",
                background: "transparent",
                color: "#424241",
                border: "1px solid rgba(66,66,65,0.3)",
              }}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
          )}
          <button
            className="campaigns-page__next-btn"
            disabled={!hasMore}
            onClick={() => setPage((p) => p + 1)}
          >
            Next page
          </button>
        </div>
      )}
    </div>
  );
}

function formatStatus(status: string) {
  if (!status) return "—";
  switch (status.toLowerCase()) {
    case "pending":
      return "Pending";
    case "in-progress":
    case "in_progress":
    case "processing":
      return "Active";
    case "completed":
    case "delivered":
      return "Completed";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
