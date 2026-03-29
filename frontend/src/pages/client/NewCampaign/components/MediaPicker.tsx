import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../../context";
import { getFoldersByCompany, type Folder } from "../../../../api/folders";
import { getMediaByFolder, type MediaItem } from "../../../../api/media";
import { formatSize } from "../../../../utils/media";
import { MediaLightbox } from "../../../../components/MediaLightbox/MediaLightbox";
import type { MediaFile } from "../../../../components/MediaCard/MediaCard";
import Icon from "../../../../components/Icon/Icon";
import ArchiveIcon from "../../../../assets/icons/archive.svg?react";
import MediaIcon from "../../../../assets/icons/media.svg?react";
import CheckIcon from "../../../../assets/icons/check-white.svg?react";
import EyeIcon from "../../../../assets/icons/eye.svg?react";
import "./MediaPicker.scss";

interface MediaPickerProps {
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
  multiple?: boolean;
}

export function MediaPicker({
  selectedIds,
  onSelect,
  multiple = false,
}: MediaPickerProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);

  const toMediaFile = (item: MediaItem): MediaFile => ({
    id: item._id,
    name: item.originalFilename,
    size: formatSize(item.size),
    url: item.url,
    mimetype: item.mimetype,
  });

  useEffect(() => {
    const companyId = user?.company?.id;
    if (!companyId) return;
    getFoldersByCompany(companyId).then((data) => {
      setFolders(data);
      if (data.length > 0) setActiveFolderId(data[0]._id);
    });
  }, [user?.company?.id]);

  useEffect(() => {
    if (!activeFolderId) return;
    setLoading(true);
    getMediaByFolder(activeFolderId)
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, [activeFolderId]);

  const handleOpen = () => {
    setPending(selectedIds);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    onSelect(pending);
    setOpen(false);
  };

  const toggleItem = (id: string) => {
    if (multiple) {
      setPending((prev) =>
        prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
      );
    } else {
      setPending((prev) => (prev[0] === id ? [] : [id]));
    }
  };

  const isImage = (item: MediaItem) => item.mimetype.startsWith("image/");

  const triggerLabel =
    selectedIds.length === 0
      ? "Browse media library"
      : `${selectedIds.length} file${selectedIds.length > 1 ? "s" : ""} selected — Change`;

  return (
    <>
      <button
        type="button"
        className="media-picker__trigger"
        onClick={handleOpen}
      >
        <Icon svg={ArchiveIcon} size={16} />
        {triggerLabel}
      </button>

      {open &&
        createPortal(
          <div className="media-picker-modal">
            <div
              className="media-picker-modal__backdrop"
              onClick={handleCancel}
            />
            <div className="media-picker-modal__dialog">
              <div className="media-picker-modal__header">
                <h4>Media Library</h4>
                <button
                  type="button"
                  className="media-picker-modal__close"
                  onClick={handleCancel}
                >
                  ✕
                </button>
              </div>

              <div className="media-picker-modal__body">
                <aside className="media-picker-modal__sidebar">
                  <p className="media-picker-modal__sidebar-label">Folders</p>
                  {folders.length === 0 && (
                    <p className="body-3 text-muted">No folders found.</p>
                  )}
                  {folders.map((folder) => (
                    <button
                      key={folder._id}
                      type="button"
                      className={`media-picker-modal__folder${activeFolderId === folder._id ? " media-picker-modal__folder--active" : ""}`}
                      onClick={() => setActiveFolderId(folder._id)}
                    >
                      <Icon svg={ArchiveIcon} size={18} />
                      <span>{folder.name}</span>
                    </button>
                  ))}
                </aside>

                <div className="media-picker-modal__content">
                  {!activeFolderId && (
                    <div className="media-picker-modal__empty">
                      <Icon svg={ArchiveIcon} size={32} />
                      <p className="body-2">Select a folder to browse files</p>
                    </div>
                  )}

                  {activeFolderId && loading && (
                    <div className="media-picker-modal__empty">
                      <p className="body-3 text-muted">Loading...</p>
                    </div>
                  )}

                  {activeFolderId && !loading && items.length === 0 && (
                    <div className="media-picker-modal__empty">
                      <p className="body-3 text-muted">
                        No files in this folder.
                      </p>
                    </div>
                  )}

                  {!loading && items.length > 0 && (
                    <div className="media-picker-modal__grid">
                      {items.map((item) => {
                        const selected = pending.includes(item._id);
                        return (
                          <div
                            key={item._id}
                            className={`media-picker-modal__tile${selected ? " media-picker-modal__tile--selected" : ""}`}
                            onClick={() => toggleItem(item._id)}
                          >
                            {isImage(item) ? (
                              <img
                                src={item.url}
                                alt={item.originalFilename}
                                className="media-picker-modal__thumb"
                              />
                            ) : (
                              <div className="media-picker-modal__thumb media-picker-modal__thumb--placeholder">
                                <Icon svg={MediaIcon} size={32} />
                              </div>
                            )}

                            {selected && (
                              <div className="media-picker-modal__check">
                                <Icon svg={CheckIcon} size={12} />
                              </div>
                            )}

                            <button
                              type="button"
                              className="media-picker-modal__preview-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewFile(toMediaFile(item));
                              }}
                            >
                              <Icon svg={EyeIcon} size={14} />
                            </button>

                            <span className="media-picker-modal__tile-name">
                              {item.originalFilename}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="media-picker-modal__footer">
                <span className="body-3 text-muted">
                  {pending.length > 0
                    ? `${pending.length} file${pending.length > 1 ? "s" : ""} selected`
                    : "No files selected"}
                </span>
                <div className="media-picker-modal__actions">
                  <button
                    type="button"
                    className="media-picker-modal__btn-cancel"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="media-picker-modal__btn-confirm"
                    onClick={handleConfirm}
                    disabled={pending.length === 0}
                  >
                    {multiple
                      ? `Select${pending.length > 0 ? ` ${pending.length}` : ""} files`
                      : "Select file"}
                  </button>
                </div>
              </div>
            </div>

            {previewFile && (
              <MediaLightbox
                file={previewFile}
                onClose={() => setPreviewFile(null)}
              />
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
