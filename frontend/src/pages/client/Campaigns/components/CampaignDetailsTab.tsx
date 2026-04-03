import type { IOrder } from "../../../../api/orders";
import { LOGO_MAP } from "../../NewCampaign/constants";
import { getAddonIcon } from "../../NewCampaign/addonIcons";
import Icon from "../../../../components/Icon/Icon";
import { OrderSummaryPanel } from "./OrderSummaryPanel";
import { MediaGallery } from "./MediaGallery";
import "./CampaignDetailsTab.scss";

function getChannelLogo(channel: string): string | undefined {
  const key = Object.keys(LOGO_MAP).find(
    (k) => k.toLowerCase() === channel.toLowerCase(),
  );
  return key ? LOGO_MAP[key] : undefined;
}

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
  const hasLeadAds = order.addons.some((a) => a.toLowerCase().includes("lead"));
  const hasVideo = order.addons.some((a) => a.toLowerCase().includes("video"));
  const hasLinkedIn = order.addons.some((a) =>
    a.toLowerCase().includes("linkedin"),
  );

  return (
    <div className="tab-layout">
      <div className="tab-main">
        {/* Card 1: Campaign overview */}
        <div className="card">
          <h4>Campaign overview</h4>

          <div className="overview-field">
            <span className="overview-field__label">Campaign name</span>
            <p className="body-3 text-muted">{order.campaignName}</p>
          </div>

          <div className="overview-field">
            <span className="overview-field__label">Selected channels</span>
            <div className="pills-row">
              {order.channels.length === 0 ? (
                <span className="text-muted">—</span>
              ) : (
                order.channels.map((ch) => {
                  const logo = getChannelLogo(ch);
                  return (
                    <span key={ch} className="pill">
                      {logo && (
                        <img src={logo} alt={ch} className="pill__logo" />
                      )}
                      {ch}
                    </span>
                  );
                })
              )}
            </div>
          </div>

          <div className="overview-field">
            <span className="overview-field__label">Add-ons</span>
            <div className="pills-row">
              {order.addons.length === 0 ? (
                <span className="text-muted">—</span>
              ) : (
                order.addons.map((addon) => (
                  <span key={addon} className="pill pill--addon">
                    <span className="pill__addon-icon">
                      <Icon svg={getAddonIcon(addon)} size={14} />
                    </span>
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

          <div className="assets-rows">
            <div className="overview-field">
              <p className="body-2">Campaign image</p>
              <span className="asset-chip">
                {IMAGE_OPTION_LABELS[order.assets.imageOption] ??
                  order.assets.imageOption}
              </span>
              {order.assets.imageMediaIds &&
                order.assets.imageMediaIds.length > 0 && (
                  <MediaGallery mediaIds={order.assets.imageMediaIds} />
                )}
            </div>

            {hasLeadAds && order.assets.leadAdDescription && (
              <div className="overview-field">
                <span className="body-2">Lead Ad job description</span>
                <span className="asset-chip">
                  {LEAD_AD_DESCRIPTION_LABELS[order.assets.leadAdDescription] ??
                    order.assets.leadAdDescription}
                </span>
                {order.assets.leadAdDescriptionText && (
                  <div className="readonly-block">
                    {order.assets.leadAdDescriptionText}
                  </div>
                )}
              </div>
            )}

            {hasVideo && order.assets.videoMaterials && (
              <div className="overview-field">
                <span className="body-2">Video materials</span>
                <span className="asset-chip">
                  {VIDEO_MATERIALS_LABELS[order.assets.videoMaterials] ??
                    order.assets.videoMaterials}
                </span>
                {order.assets.videoMediaIds &&
                  order.assets.videoMediaIds.length > 0 && (
                    <MediaGallery mediaIds={order.assets.videoMediaIds} />
                  )}
              </div>
            )}

            {hasLinkedIn && order.assets.linkedinJobDescription && (
              <div className="overview-field">
                <span className="body-2">LinkedIn job description</span>
                <span className="asset-chip">
                  {LINKEDIN_JD_LABELS[order.assets.linkedinJobDescription] ??
                    order.assets.linkedinJobDescription}
                </span>
                {order.assets.linkedinJobDescriptionText && (
                  <div className="readonly-block">
                    {order.assets.linkedinJobDescriptionText}
                  </div>
                )}
              </div>
            )}

            {hasLinkedIn && order.assets.linkedinScreeningQuestions && (
              <div className="overview-field">
                <p className="body-2">LinkedIn screening questions</p>
                <span className="asset-chip">
                  {LINKEDIN_SQ_LABELS[
                    order.assets.linkedinScreeningQuestions
                  ] ?? order.assets.linkedinScreeningQuestions}
                </span>
                {order.assets.linkedinScreeningQuestionsText && (
                  <div className="readonly-block">
                    {order.assets.linkedinScreeningQuestionsText}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card 3: Target audience + Additional notes */}
        <div className="card">
          <h4>Campaign brief</h4>

          <div className="brief-section">
            <p className="body-2">Target audience</p>
            <div className="readonly-block">{order.targetAudience || "—"}</div>
          </div>

          {order.additionalNotes && (
            <div className="brief-section">
              <p className="body-2">Additional notes</p>
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
