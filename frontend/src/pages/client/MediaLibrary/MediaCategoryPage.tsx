import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { MediaCard, type MediaFile } from "../../../components/MediaCard/MediaCard";
import { MediaLightbox } from "../../../components/MediaLightbox/MediaLightbox";
import { Loader } from "../../../components/Loader/Loader";
import Icon from "../../../components/Icon/Icon";
import { getMediaByFolder, uploadFiles, deleteMedia, type MediaItem } from "../../../api/media";

import ArrowUpRightIcon from "../../../assets/icons/arrow-up-right.svg?react";
import ArchiveIcon from "../../../assets/icons/archive.svg?react";
import "./MediaLibrary.scss";

const PAGE_LIMIT = 20;

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

export default function MediaCategoryPage() {
  const { folderId } = useParams<{ folderId: string }>();
  const location = useLocation();

  const folderName: string =
    (location.state as { folderName?: string })?.folderName ?? "Media";

  const [files, setFiles] = useState<MediaFile[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);

  // Tracks whether a file is being dragged anywhere over the browser window.
  const [isWindowDragActive, setIsWindowDragActive] = useState(false);
  // Counter guards against spurious dragleave events fired on child elements.
  const dragCounterRef = useRef(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(
    async (pageNum: number, replace: boolean) => {
      if (!folderId) return;
      const result = await getMediaByFolder(folderId, pageNum, PAGE_LIMIT);
      const mapped = result.data.map(toMediaFile);
      setFiles((prev) => (replace ? mapped : [...prev, ...mapped]));
      setTotalPages(result.pagination.totalPages);
    },
    [folderId]
  );

  useEffect(() => {
    setLoading(true);
    setPage(1);
    setFiles([]);
    fetchMedia(1, true)
      .catch(() => setError("Failed to load files. Please try again."))
      .finally(() => setLoading(false));
  }, [fetchMedia]);

  // Window-level drag detection — fires the moment a file enters the browser
  // from the OS, before it's over any specific element.
  useEffect(() => {
    if (uploading) return;

    const onDragEnter = (e: DragEvent) => {
      if (!e.dataTransfer?.types.includes("Files")) return;
      dragCounterRef.current++;
      if (dragCounterRef.current === 1) setIsWindowDragActive(true);
    };

    const onDragLeave = () => {
      dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
      if (dragCounterRef.current === 0) setIsWindowDragActive(false);
    };

    // Prevent the browser's default "open file" behaviour and reset state.
    const onDrop = () => {
      dragCounterRef.current = 0;
      setIsWindowDragActive(false);
    };

    const onDragOver = (e: DragEvent) => e.preventDefault();

    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    window.addEventListener("dragover", onDragOver);

    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
      window.removeEventListener("dragover", onDragOver);
    };
  }, [uploading]);

  const handleUploadFiles = useCallback(
    async (selected: File[]) => {
      if (!selected.length) return;
      setIsWindowDragActive(false);
      dragCounterRef.current = 0;
      setUploading(true);
      try {
        await uploadFiles(selected, folderId);
        setLoading(true);
        await fetchMedia(1, true);
        setPage(1);
      } catch {
        setError("Upload failed. Please check the file type and size (max 5 MB).");
      } finally {
        setLoading(false);
        setUploading(false);
      }
    },
    [folderId, fetchMedia]
  );

  // react-dropzone is attached only to the overlay — it handles validation and
  // calls handleUploadFiles with the accepted files.
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleUploadFiles,
    accept: ACCEPTED_TYPES,
    noClick: true,
    noKeyboard: true,
    disabled: uploading,
  });

  const handleLoadMore = async () => {
    const next = page + 1;
    setLoadingMore(true);
    await fetchMedia(next, false);
    setPage(next);
    setLoadingMore(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = "";
    handleUploadFiles(selected);
  };

  const handleDelete = async (fileId: string) => {
    try {
      await deleteMedia(fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch {
      setError("Failed to delete the file. Please try again.");
    }
  };

  return (
    <div className="media-library">
      {/* Full-page drop overlay — hidden until a file is dragged over the window */}
      <div
        className={`media-library__drop-overlay${isWindowDragActive ? " media-library__drop-overlay--active" : ""}`}
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
          <button className="media-library__error-dismiss" onClick={() => setError(null)}>
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
                onDelete={handleDelete}
                onPreview={setPreviewFile}
              />
            ))}
          </div>

          {page < totalPages && (
            <div className="media-library__load-more">
              <button
                className="media-library__load-more-btn"
                onClick={handleLoadMore}
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
