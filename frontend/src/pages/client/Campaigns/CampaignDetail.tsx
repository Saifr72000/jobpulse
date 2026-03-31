import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../../../api/orders";
import type { IOrder } from "../../../api/orders";
import { Loader } from "../../../components/Loader/Loader";
import Icon from "../../../components/Icon/Icon";
import { CampaignDetailsTab } from "./components/CampaignDetailsTab";
import { ReviewApproveTab } from "./components/ReviewApproveTab";
import { PerformanceCandidatesTab } from "./components/PerformanceCandidatesTab";
import LayoutLeftIcon from "../../../assets/icons/layout-left.svg?react";
import RefreshIcon from "../../../assets/icons/refresh.svg?react";
import BarChartIcon from "../../../assets/icons/bar-chart.svg?react";
import "./CampaignDetail.scss";

type ActiveTab = "details" | "review" | "performance";

function statusLabel(status: IOrder["status"]): string {
  switch (status) {
    case "awaiting-payment":
      return "Awaiting payment";
    case "pending":
      return "Pending";
    case "in-progress":
      return "Active";
    case "completed":
      return "Completed";
    default:
      return status;
  }
}

function statusModifier(status: IOrder["status"]): string {
  switch (status) {
    case "awaiting-payment":
      return "status-badge--awaiting-payment";
    case "pending":
      return "status-badge--pending";
    case "in-progress":
      return "status-badge--in-progress";
    case "completed":
      return "status-badge--completed";
    default:
      return "";
  }
}

export default function CampaignDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("details");

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    getOrderById(orderId)
      .then((data) => setOrder(data))
      .catch(() => setError("Could not load campaign. Please try again."))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="campaign-detail-loading">
        <Loader />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="campaign-detail-error">
        {error ?? "Campaign not found."}
      </div>
    );
  }

  return (
    <div className="campaign-detail page">
      {/* Back link */}
      <button
        type="button"
        className="back-link"
        onClick={() => navigate("/campaigns")}
      >
        ← Back to campaigns
      </button>

      {/* Page header */}
      <div className="campaign-header">
        <h2>{order.campaignName}</h2>
        <span className={`status-badge ${statusModifier(order.status)}`}>
          {statusLabel(order.status)}
        </span>
      </div>

      {/* Tab bar */}
      <div className="tab-bar" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "details"}
          className={`tab-btn${activeTab === "details" ? " active" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          <Icon svg={LayoutLeftIcon} size={16} />
          Campaign details
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "review"}
          className={`tab-btn${activeTab === "review" ? " active" : ""}`}
          onClick={() => setActiveTab("review")}
        >
          <Icon svg={RefreshIcon} size={16} />
          Review &amp; approve
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "performance"}
          className={`tab-btn${activeTab === "performance" ? " active" : ""}`}
          onClick={() => setActiveTab("performance")}
        >
          <Icon svg={BarChartIcon} size={16} />
          Performance &amp; candidates
        </button>
      </div>

      {/* Active tab content */}
      <div className="campaign-detail__tab-content">
        {activeTab === "details" && <CampaignDetailsTab order={order} />}
        {activeTab === "review" && <ReviewApproveTab order={order} />}
        {activeTab === "performance" && (
          <PerformanceCandidatesTab order={order} />
        )}
      </div>
    </div>
  );
}
