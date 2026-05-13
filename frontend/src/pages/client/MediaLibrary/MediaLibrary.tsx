import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FunctionComponent, SVGProps } from "react";
import { useAuth } from "../../../context";
import { getFoldersByCompany, type Folder } from "../../../api/folders";
import Icon from "../../../components/Icon/Icon";
import { Loader } from "../../../components/Loader/Loader";

import MediaIcon from "../../../assets/icons/media.svg?react";
import VideoIcon from "../../../assets/icons/video.svg?react";
import BrandingIcon from "../../../assets/icons/branding.svg?react";
import ArchiveIcon from "../../../assets/icons/archive.svg?react";
import ArrowUpRightIcon from "../../../assets/icons/arrow-up-right.svg?react";
import "./MediaLibrary.scss";

type SvgComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

function getFolderIcon(name: string): SvgComponent {
  const lower = name.toLowerCase();
  if (
    lower.includes("picture") ||
    lower.includes("image") ||
    lower.includes("photo")
  )
    return MediaIcon;
  if (lower.includes("video") || lower.includes("film")) return VideoIcon;
  if (lower.includes("brand") || lower.includes("logo")) return BrandingIcon;
  return ArchiveIcon;
}

function getFolderSubtext(name: string): string {
  const lower = name.toLowerCase();
  if (
    lower.includes("picture") ||
    lower.includes("image") ||
    lower.includes("photo")
  ) {
    return "Photos and images for your campaigns";
  }
  if (lower.includes("video") || lower.includes("film")) {
    return "Video content for ads and campaigns";
  }
  if (lower.includes("brand") || lower.includes("logo")) {
    return "Logo, brand assets and guidelines";
  }
  return "Files for your campaigns";
}

export default function MediaLibrary() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const companyId = user?.company?.id;
    if (!companyId) return;

    setLoading(true);
    getFoldersByCompany(companyId)
      .then(setFolders)
      .catch(() => setError("Failed to load folders. Please try again."))
      .finally(() => setLoading(false));
  }, [user?.company?.id]);

  return (
    <div className="media-library">
      <div className="page-header">
        <h2>Media library</h2>
        <p className="subheading">Manage and organize your media assets</p>
      </div>

      {loading && <Loader />}

      {!loading && error && (
        <div className="media-library__state">
          <p className="body-2 text-muted">{error}</p>
        </div>
      )}

      {!loading && !error && folders.length === 0 && (
        <div className="media-library__empty">
          <div className="media-library__empty-icon">
            <Icon svg={ArchiveIcon} size={20} />
          </div>
          <p className="body-1">No folders yet</p>
          <p className="body-3 text-muted">
            Folders will appear here once they are created by your
            administrator.
          </p>
        </div>
      )}

      {!loading && !error && folders.length > 0 && (
        <div className="media-library__grid">
          {folders.map((folder) => (
            <div
              key={folder._id}
              className="media-category-card"
              onClick={() =>
                navigate(`/media-library/${folder._id}`, {
                  state: { folderName: folder.name },
                })
              }
            >
              <div className="media-category-card__top">
                <div className="media-category-card__icon-wrap">
                  <Icon svg={getFolderIcon(folder.name)} size={24} />
                </div>
                <div className="media-category-card__copy">
                  <h4>{folder.name}</h4>
                  <p className="media-category-card__sub text-ash">
                    {getFolderSubtext(folder.name)}
                  </p>
                </div>
              </div>
              <button
                className="media-category-card__arrow"
                aria-label={`Open ${folder.name}`}
              >
                <Icon svg={ArrowUpRightIcon} size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
