import Icon from "../../../components/Icon/Icon";
import FileIcon from "../../../assets/icons/file.svg?react";
import VideoIcon from "../../../assets/icons/video.svg?react";
import BriefcaseIcon from "../../../assets/icons/briefcase.svg?react";

export function getAddonIcon(addonTitle: string): React.ReactNode {
  const title = addonTitle.toLowerCase();
  if (title.includes("lead")) {
    return <Icon svg={FileIcon} size={15} />;
  }
  if (title.includes("video")) {
    return <Icon svg={VideoIcon} size={15} />;
  }
  return <Icon svg={BriefcaseIcon} size={15} />;
}
