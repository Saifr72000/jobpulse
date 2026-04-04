import { useEffect, useState } from "react";
import { getMediaById, type MediaItem } from "../../../../api/media";
import { MediaLightbox } from "../../../../components/MediaLightbox/MediaLightbox";
import type { MediaFile } from "../../../../components/MediaCard/MediaCard";
import "./MediaGallery.scss";

interface MediaGalleryProps {
  mediaIds: string[];
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function toMediaFile(item: MediaItem): MediaFile {
  return {
    id: item._id,
    name: item.originalFilename,
    size: formatSize(item.size),
    url: item.url,
    mimetype: item.mimetype,
  };
}

export function MediaGallery({ mediaIds }: MediaGalleryProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<MediaFile | null>(null);

  useEffect(() => {
    if (mediaIds.length === 0) return;
    setLoading(true);
    setError(null);
    Promise.all(mediaIds.map((id) => getMediaById(id)))
      .then(setItems)
      .catch((err) => {
        console.error("[MediaGallery] Failed to load media:", err);
        setError("Failed to load media files.");
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaIds.join(",")]);

  if (loading) {
    return <p className="media-gallery__status">Loading files...</p>;
  }

  if (error) {
    return <p className="media-gallery__status media-gallery__status--error">{error}</p>;
  }

  if (items.length === 0) return null;

  return (
    <>
      <div className="media-gallery">
        {items.map((item) =>
          item.mimetype.startsWith("image/") ? (
            <button
              key={item._id}
              className="media-gallery__thumb"
              onClick={() => setPreview(toMediaFile(item))}
              aria-label={`Preview ${item.originalFilename}`}
            >
              <img src={item.url} alt={item.originalFilename} />
            </button>
          ) : (
            <button
              key={item._id}
              className="media-gallery__file"
              onClick={() => setPreview(toMediaFile(item))}
              aria-label={`Preview ${item.originalFilename}`}
            >
              <span className="media-gallery__file-icon">&#128196;</span>
              <span className="media-gallery__file-name">{item.originalFilename}</span>
            </button>
          )
        )}
      </div>

      {preview && (
        <MediaLightbox file={preview} onClose={() => setPreview(null)} />
      )}
    </>
  );
}
