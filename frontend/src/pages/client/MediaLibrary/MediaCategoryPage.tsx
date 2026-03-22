import { useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { MediaCard, type MediaFile } from "../../../components/MediaCard/MediaCard";
import { MediaLightbox } from "../../../components/MediaLightbox/MediaLightbox";
import { Loader } from "../../../components/Loader/Loader";
import Icon from "../../../components/Icon/Icon";
import { useMediaFolder } from "../../../hooks/useMediaFolder";
import { useMediaUpload } from "../../../hooks/useMediaUpload";
import { useWindowDragDrop } from "../../../hooks/useWindowDragDrop";

import ArrowUpRightIcon from "../../../assets/icons/arrow-up-right.svg?react";
import ArchiveIcon from "../../../assets/icons/archive.svg?react";
import "./MediaLibrary.scss";

const ACCEPTED_TYPES = {
  "image/jpeg": [],
  "image/png": [],
  "image/gif": [],
  "image/webp": [],
  "video/mp4": [],
  "video/quicktime": [],
  "video/webm": [],
  "application/pdf": [],
};

export default function MediaCategoryPage() {
  const { folderId } = useParams<{ folderId: string }>();
  const location = useLocation();
  const folderName = (location.state as { folderName?: string })?.folderName ?? "Media";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);

  const {
    files, loading, loadingMore, error: fetchError,
    hasMore, refresh, loadMore, remove, clearError: clearFetchError,
  } = useMediaFolder(folderId);

  const {
    uploading, error: uploadError,
    upload, clearError: clearUploadError,
  } = useMediaUpload(folderId, refresh);

  const isDragActive = useWindowDragDrop({ disabled: uploading });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: upload,
    accept: ACCEPTED_TYPES,
    noClick: true,
    noKeyboard: true,
    disabled: uploading,
  });

  const error = fetchError ?? uploadError;
  const clearError = () => { clearFetchError(); clearUploadError(); };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = "";
    upload(selected);
  };

  return (
    <div className="media-library">
      {/* Full-page drop overlay — hidden until a file is dragged over the window */}
      <div
        className={`media-library__drop-overlay${isDragActive ? " media-library__drop-overlay--active" : ""}`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="media-library__drop-box">
          <Icon svg={ArrowUpRightIcon} size={28} />
          <p className="body-1">Drop files to upload</p>
          <p className="body-3 text-muted">Images, videos and PDFs · max 5 MB</p>
        </div>
      </div>

      <div className="media-category-page__header">
        <div className="page-header">
          <h2>{folderName}</h2>
        </div>

        <button
          className="media-category-page__upload"
          onClick={handleUploadClick}
          disabled={uploading}
        >
          <Icon svg={ArrowUpRightIcon} size={16} />
          {uploading ? "Uploading…" : "Upload files"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/webm,application/pdf"
          style={{ display: "none" }}
          onChange={handleFilesSelected}
        />
      </div>

      {error && (
        <div className="media-library__error">
          <p className="body-3">{error}</p>
          <button className="media-library__error-dismiss" onClick={clearError}>
            Dismiss
          </button>
        </div>
      )}

      {loading && <Loader />}

      {!loading && files.length === 0 && (
        <div className="media-library__empty">
          <div className="media-library__empty-icon">
            <Icon svg={ArchiveIcon} size={20} />
          </div>
          <p className="body-1">No files here yet</p>
          <p className="body-3 text-muted">
            Upload files using the button above, or drag and drop them anywhere on this page.
          </p>
        </div>
      )}

      {!loading && files.length > 0 && (
        <>
          <div className="media-files-grid">
            {files.map((file) => (
              <MediaCard
                key={file.id}
                file={file}
                onDelete={remove}
                onPreview={setPreviewFile}
              />
            ))}
          </div>

          {hasMore && (
            <div className="media-library__load-more">
              <button
                className="media-library__load-more-btn"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </>
      )}

      {previewFile && (
        <MediaLightbox file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );
}
