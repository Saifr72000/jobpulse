import type { MediaItem } from "../api/media";
import type { MediaFile } from "../components/MediaCard/MediaCard";

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function toMediaFile(item: MediaItem): MediaFile {
  return {
    id: item._id,
    name: item.originalFilename,
    size: formatSize(item.size),
    url: item.url,
    mimetype: item.mimetype,
  };
}
