import { useCallback, useEffect, useState } from "react";
import type { MediaFile } from "../MediaCard/MediaCard";
import Icon from "../Icon/Icon";
import FileIcon from "../../assets/icons/file.svg?react";
import "./MediaLightbox.scss";

const CLOSE_DURATION = 200;

function resolveFileType(file: MediaFile): "image" | "video" | "pdf" | "other" {
  if (file.mimetype) {
    if (file.mimetype.startsWith("image/")) return "image";
    if (file.mimetype.startsWith("video/")) return "video";
    if (file.mimetype === "application/pdf") return "pdf";
    return "other";
  }
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
  if (["mp4", "mov", "avi", "webm", "mkv"].includes(ext)) return "video";
  if (ext === "pdf") return "pdf";
  return "other";
}

interface MediaLightboxProps {
  file: MediaFile;
  onClose: () => void;
}

export function MediaLightbox({ file, onClose }: MediaLightboxProps) {
  const fileType = resolveFileType(file);
  const [closing, setClosing] = useState(false);

  const dismiss = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, CLOSE_DURATION);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [dismiss]);

  return (
    <div
      className={`media-lightbox${closing ? " media-lightbox--closing" : ""}`}
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
    >
      <div className="media-lightbox__content" onClick={(e) => e.stopPropagation()}>
        <button
          className="media-lightbox__close"
          onClick={dismiss}
          aria-label="Close preview"
        >
          &#x2715;
        </button>

        <div className="media-lightbox__media">
          {fileType === "image" && file.url ? (
            <img
              className="media-lightbox__image"
              src={file.url}
              alt={file.name}
            />
          ) : fileType === "video" && file.url ? (
            <video
              className="media-lightbox__video"
              src={file.url}
              controls
              autoPlay
            />
          ) : fileType === "pdf" && file.url ? (
            <iframe
              className="media-lightbox__pdf"
              src={file.url}
              title={file.name}
            />
          ) : (
            <div className="media-lightbox__fallback">
              <Icon svg={FileIcon} size={48} />
              <p className="body-2">Preview not available</p>
            </div>
          )}
        </div>

        <div className="media-lightbox__footer">
          <span className="body-2">{file.name}</span>
          <span className="body-3 text-muted">{file.size}</span>
        </div>
      </div>
    </div>
  );
}
