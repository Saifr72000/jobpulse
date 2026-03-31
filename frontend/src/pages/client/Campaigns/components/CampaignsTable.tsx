import { useNavigate } from "react-router-dom";
import { Loader } from "../../../../components/Loader/Loader";
import "./CampaignsTable.scss";

export interface Campaign {
  _id: string;
  campaignName?: string;
  status: string;
  createdAt: string;
  channels?: string[];
  totalAmount?: number;
}

interface CampaignsTableProps {
  campaigns: Campaign[];
  loading: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
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

function formatStatus(status: string) {
  if (!status) return "—";
  switch (status.toLowerCase()) {
    case "pending":
      return "Pending";
    case "in-progress":
    case "in_progress":
      return "Active";
    case "completed":
      return "Completed";
    case "awaiting-payment":
      return "Awaiting payment";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

export function CampaignsTable({ campaigns, loading }: CampaignsTableProps) {
  const navigate = useNavigate();

  return (
    <div className="campaigns-table">
      <div className="campaigns-table__head">
        <span>Campaign</span>
        <span>Status</span>
        <span>Date</span>
        <span>Channels</span>
        <span>Total</span>
      </div>

      {loading ? (
        <Loader />
      ) : campaigns.length === 0 ? (
        <div className="campaigns-table__empty">No campaigns found.</div>
      ) : (
        campaigns.map((campaign) => (
          <div
            key={campaign._id}
            className="campaigns-table__row"
            onClick={() => navigate(`/campaigns/${campaign._id}`)}
          >
            <span className="campaigns-table__name">
              {campaign.campaignName ?? "Untitled campaign"}
            </span>
            <span className="campaigns-table__status">
              {formatStatus(campaign.status)}
            </span>
            <span className="campaigns-table__cell">
              {formatDate(campaign.createdAt)}
            </span>
            <span className="campaigns-table__cell">
              {channelLabel(campaign.channels)}
            </span>
            <span className="campaigns-table__cell">
              {formatNOK(campaign.totalAmount)}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
