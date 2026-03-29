import { useEffect, useState } from "react";
import { useAuth } from "../../../../context";
import { getFoldersByCompany, type Folder } from "../../../../api/folders";
import { getMediaByFolder, type MediaItem } from "../../../../api/media";
import Icon from "../../../../components/Icon/Icon";
import ArchiveIcon from "../../../../assets/icons/archive.svg?react";
import MediaIcon from "../../../../assets/icons/media.svg?react";
import CheckIcon from "../../../../assets/icons/check-white.svg?react";
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
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const companyId = user?.company?.id;
    if (!companyId) return;
    getFoldersByCompany(companyId).then(setFolders);
  }, [user?.company?.id]);

  useEffect(() => {
    if (!activeFolderId) return;
    setLoading(true);
    getMediaByFolder(activeFolderId)
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, [activeFolderId]);

  const toggleItem = (id: string) => {
    if (multiple) {
      onSelect(
        selectedIds.includes(id)
          ? selectedIds.filter((s) => s !== id)
          : [...selectedIds, id],
      );
    } else {
      onSelect(selectedIds[0] === id ? [] : [id]);
    }
  };

  const isImage = (item: MediaItem) => item.mimetype.startsWith("image/");

  return (
    <div className="media-picker">
      {!activeFolderId ? (
        <>
          {folders.length === 0 && (
            <p className="body-3 text-muted">
              No folders found in your media library.
            </p>
          )}
          <div className="media-picker__folders">
            {folders.map((folder) => (
              <button
                key={folder._id}
                type="button"
                className="media-picker__folder"
                onClick={() => setActiveFolderId(folder._id)}
              >
                <Icon svg={ArchiveIcon} size={16} />
                <span>{folder.name}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="media-picker__browser">
          <button
            type="button"
            className="media-picker__back"
            onClick={() => {
              setActiveFolderId(null);
              setItems([]);
            }}
          >
            ← Back to folders
          </button>

          {loading && (
            <p className="body-3 text-muted">Loading...</p>
          )}

          {!loading && items.length === 0 && (
            <p className="body-3 text-muted">No files in this folder.</p>
          )}

          {!loading && items.length > 0 && (
            <div className="media-picker__grid">
              {items.map((item) => {
                const selected = selectedIds.includes(item._id);
                return (
                  <div
                    key={item._id}
                    className={`media-picker__tile${selected ? " media-picker__tile--selected" : ""}`}
                    onClick={() => toggleItem(item._id)}
                  >
                    {isImage(item) ? (
                      <img
                        src={item.url}
                        alt={item.originalFilename}
                        className="media-picker__thumb"
                      />
                    ) : (
                      <div className="media-picker__thumb media-picker__thumb--placeholder">
                        <Icon svg={MediaIcon} size={20} />
                      </div>
                    )}
                    {selected && (
                      <div className="media-picker__check">
                        <Icon svg={CheckIcon} size={12} />
                      </div>
                    )}
                    <span className="media-picker__tile-name">
                      {item.originalFilename}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
