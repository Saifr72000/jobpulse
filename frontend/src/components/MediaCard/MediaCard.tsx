import Icon from "../Icon/Icon";
import MediaIcon from "../../assets/icons/media.svg?react";
import VideoIcon from "../../assets/icons/video.svg?react";
import FileIcon from "../../assets/icons/file.svg?react";
import "./MediaCard.scss";

export interface MediaFile {
  id: string;
  name: string;
  size: string;
  url?: string;
  mimetype?: string;
}

type FileType = "image" | "video" | "pdf" | "other";

function getFileType(name: string): FileType {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
  if (["mp4", "mov", "avi", "webm", "mkv"].includes(ext)) return "video";
  if (ext === "pdf") return "pdf";
  return "other";
}

function getExtension(name: string): string {
  return name.split(".").pop()?.toUpperCase() ?? "FILE";
}

interface MediaCardProps {
  file: MediaFile;
  onDelete?: (id: string) => void;
  onPreview?: (file: MediaFile) => void;
}

export function MediaCard({ file, onDelete, onPreview }: MediaCardProps) {
  const fileType = getFileType(file.name);

  return (
    <div
      className="media-card"
      onClick={() => onPreview?.(file)}
      style={{ cursor: onPreview ? "pointer" : undefined }}
    >
      <div className="media-card__preview">
        {fileType === "image" && file.url ? (
          <img className="media-card__image" src={file.url} alt={file.name} />
        ) : fileType === "image" ? (
          <Icon svg={MediaIcon} size={40} />
        ) : fileType === "video" && file.url ? (
          <video className="media-card__video" src={file.url} />
        ) : fileType === "video" ? (
          <Icon svg={VideoIcon} size={40} />
        ) : fileType === "pdf" ? (
          <div className="media-card__filetype">
            <Icon svg={FileIcon} size={32} />
            <span className="body-3">PDF</span>
          </div>
        ) : (
          <div className="media-card__filetype">
            <Icon svg={FileIcon} size={32} />
            <span className="body-3">.{getExtension(file.name)}</span>
          </div>
        )}
      </div>
      <div className="media-card__info">
        <span className="media-card__name body-2">{file.name}</span>
        <div className="media-card__meta">
          <span className="body-3 text-muted">{file.size}</span>
          {onDelete && (
            <button
              className="media-card__delete"
              aria-label={`Delete ${file.name}`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(file.id);
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
