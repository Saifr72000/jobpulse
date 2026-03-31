import type { IOrder } from "../../../../api/orders";
import { OrderSummaryPanel } from "./OrderSummaryPanel";
import "./CampaignDetailsTab.scss";

interface CampaignDetailsTabProps {
  order: IOrder;
}

const ADDON_LABELS: Record<string, string> = {
  "lead-ads": "Lead Ads",
  "video-campaign": "Video Campaign",
  "linkedin-job-posting": "LinkedIn Job Posting",
};

const IMAGE_OPTION_LABELS: Record<string, string> = {
  upload: "Upload image",
  "media-library": "Select from media library",
  "team-suggest": "Let our team suggest an image",
};

const LEAD_AD_DESCRIPTION_LABELS: Record<string, string> = {
  "team-create": "Let our team create the job description",
  own: "Provide your own job description",
};

const VIDEO_MATERIALS_LABELS: Record<string, string> = {
  upload: "Upload your own materials",
  "media-library": "Let our team select materials from our media library",
  combine: "Combine both",
};

const LINKEDIN_JD_LABELS: Record<string, string> = {
  "team-create": "Let our team create the job description",
  own: "Provide your own job description",
};

const LINKEDIN_SQ_LABELS: Record<string, string> = {
  "team-create": "Let our team create screening questions",
  own: "Provide your own screening questions",
};

export function CampaignDetailsTab({ order }: CampaignDetailsTabProps) {
  const hasLeadAds = order.addons.includes("lead-ads");
  const hasVideo = order.addons.includes("video-campaign");
  const hasLinkedIn = order.addons.includes("linkedin-job-posting");

  return (
    <div className="tab-layout">
      <div className="tab-main">

        {/* Card 1: Campaign overview */}
        <div className="card">
          <h4>Campaign overview</h4>

          <div className="overview-row">
            <span className="text-muted overview-row__label">Campaign name</span>
            <span>{order.campaignName}</span>
          </div>

          <div className="overview-row">
            <span className="text-muted overview-row__label">Channels</span>
            <div className="pills-row">
              {order.channels.length === 0 ? (
                <span className="text-muted">—</span>
              ) : (
                order.channels.map((ch) => (
                  <span key={ch} className="pill">
                    {ch}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="overview-row">
            <span className="text-muted overview-row__label">Add-ons</span>
            <div className="pills-row">
              {order.addons.length === 0 ? (
                <span className="text-muted">—</span>
              ) : (
                order.addons.map((addon) => (
                  <span key={addon} className="pill pill--addon">
                    {ADDON_LABELS[addon] ?? addon}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Assets */}
        <div className="card">
          <h4>Assets</h4>
          <p className="text-muted text-small">
            Key information and materials for your campaign
          </p>

          <div className="assets-rows">
            <div className="overview-row">
              <span className="text-muted overview-row__label">Campaign image</span>
              <span>
                {IMAGE_OPTION_LABELS[order.assets.imageOption] ??
                  order.assets.imageOption}
              </span>
            </div>

            {hasLeadAds && order.assets.leadAdDescription && (
              <div className="overview-row">
                <span className="text-muted overview-row__label">
                  Lead Ad job description
                </span>
                <span>
                  {LEAD_AD_DESCRIPTION_LABELS[order.assets.leadAdDescription] ??
                    order.assets.leadAdDescription}
                </span>
              </div>
            )}

            {hasVideo && order.assets.videoMaterials && (
              <div className="overview-row">
                <span className="text-muted overview-row__label">
                  Video materials
                </span>
                <span>
                  {VIDEO_MATERIALS_LABELS[order.assets.videoMaterials] ??
                    order.assets.videoMaterials}
                </span>
              </div>
            )}

            {hasLinkedIn && order.assets.linkedinJobDescription && (
              <div className="overview-row">
                <span className="text-muted overview-row__label">
                  LinkedIn job description
                </span>
                <span>
                  {LINKEDIN_JD_LABELS[order.assets.linkedinJobDescription] ??
                    order.assets.linkedinJobDescription}
                </span>
              </div>
            )}

            {hasLinkedIn && order.assets.linkedinScreeningQuestions && (
              <div className="overview-row">
                <span className="text-muted overview-row__label">
                  LinkedIn screening questions
                </span>
                <span>
                  {LINKEDIN_SQ_LABELS[order.assets.linkedinScreeningQuestions] ??
                    order.assets.linkedinScreeningQuestions}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Card 3: Target audience + Additional notes */}
        <div className="card">
          <h4>Campaign brief</h4>

          <div className="brief-section">
            <p className="text-muted text-small overview-row__label">
              Target audience
            </p>
            <div className="readonly-block">
              {order.targetAudience || "—"}
            </div>
          </div>

          {order.additionalNotes && (
            <div className="brief-section">
              <p className="text-muted text-small overview-row__label">
                Additional notes
              </p>
              <div className="readonly-block">{order.additionalNotes}</div>
            </div>
          )}
        </div>
      </div>

      <div className="tab-sidebar">
        <OrderSummaryPanel order={order} />
      </div>
    </div>
  );
}
