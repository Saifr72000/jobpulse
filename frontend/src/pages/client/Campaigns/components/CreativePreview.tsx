import type { ICreative } from "../../../../api/creatives";
import type { IOrder } from "../../../../api/orders";
import { getCreativeEmbed } from "./reviewUtils";
import defaultHeroImage from "../../../../assets/images/campaign-default-preview.png";
import "./CreativePreview.scss";

interface CreativePreviewProps {
  creative: ICreative | null;
  order?: Pick<IOrder, "campaignName" | "companyName">;
  showMeta?: boolean;
}

export function CreativePreview({
  creative,
  order,
  showMeta = true,
}: CreativePreviewProps) {
  const embed = creative?.url ? getCreativeEmbed(creative.url) : null;
  const isVideo = embed?.type === "youtube" || embed?.type === "vimeo";

  const useDefaultHero =
    !isVideo && !(embed?.type === "image" && Boolean(creative?.url));

  const heroImageSrc =
    useDefaultHero || !creative?.url ? defaultHeroImage : creative.url!;

  const headline =
    creative?.headline?.trim() ||
    order?.campaignName ||
    "Campaign preview";

  const subline =
    creative?.subline?.trim() ||
    (useDefaultHero ? "Make a difference where it truly matters" : undefined);

  if (isVideo && creative && embed?.embedUrl) {
    return (
      <div className="creative-preview creative-preview--video">
        <iframe
          src={embed.embedUrl}
          className="creative-preview__iframe"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={creative.headline}
        />
        {showMeta && (
          <p className="creative-preview__meta">
            Uploaded by {creative.uploadedBy.firstName}{" "}
            {creative.uploadedBy.lastName}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="creative-preview creative-preview--hero">
      <div className="creative-preview__hero" aria-label={headline}>
        <img
          src={heroImageSrc}
          alt=""
          className={`creative-preview__hero-img${useDefaultHero ? " creative-preview__hero-img--default-crop" : ""}`}
          decoding="async"
        />
        {order?.companyName ? (
          <div className="creative-preview__brand">{order.companyName}</div>
        ) : null}
        <div className="creative-preview__overlay-card">
          <p className="creative-preview__overlay-headline">{headline}</p>
          {subline ? (
            <p className="creative-preview__overlay-subline">{subline}</p>
          ) : null}
          {creative?.url && embed?.type === "external" ? (
            <a
              href={creative.url}
              target="_blank"
              rel="noopener noreferrer"
              className="creative-preview__overlay-link"
            >
              Open preview →
            </a>
          ) : null}
        </div>
      </div>
      {showMeta && creative ? (
        <p className="creative-preview__meta">
          Uploaded by {creative.uploadedBy.firstName}{" "}
          {creative.uploadedBy.lastName}
        </p>
      ) : null}
    </div>
  );
}
