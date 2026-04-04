import type { ICreative } from "../../../../api/creatives";
import { getCreativeEmbed } from "./reviewUtils";
import "./CreativePreview.scss";

interface CreativePreviewProps {
  creative: ICreative;
}

export function CreativePreview({ creative }: CreativePreviewProps) {
  const embed = creative.url ? getCreativeEmbed(creative.url) : null;

  return (
    <div className="creative-preview">
      {embed?.type === "image" && (
        <img
          src={creative.url}
          alt={creative.headline}
          className="creative-preview__image"
        />
      )}

      {(embed?.type === "youtube" || embed?.type === "vimeo") && (
        <iframe
          src={embed.embedUrl}
          className="creative-preview__iframe"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={creative.headline}
        />
      )}

      {(embed?.type === "external" || !embed) && (
        <div className="creative-preview__card">
          <p className="creative-preview__headline">{creative.headline}</p>
          {creative.subline && (
            <p className="creative-preview__subline">{creative.subline}</p>
          )}
          {creative.url && (
            <a
              href={creative.url}
              target="_blank"
              rel="noopener noreferrer"
              className="creative-preview__link"
            >
              Open preview →
            </a>
          )}
        </div>
      )}

      <p className="creative-preview__meta">
        Uploaded by {creative.uploadedBy.firstName} {creative.uploadedBy.lastName}
      </p>
    </div>
  );
}
