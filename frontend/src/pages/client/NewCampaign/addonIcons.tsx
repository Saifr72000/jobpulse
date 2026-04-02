import FileIcon from "../../../assets/icons/file.svg?react";
import VideoIcon from "../../../assets/icons/video.svg?react";
import BriefcaseIcon from "../../../assets/icons/briefcase.svg?react";
import type { FunctionComponent, SVGProps } from "react";

type SvgComponent = FunctionComponent<SVGProps<SVGSVGElement>>;
export function getAddonIcon(addonTitle: string): SvgComponent {
  const title = addonTitle.toLowerCase();
  if (title.includes("lead")) {
    return FileIcon;
  }
  if (title.includes("video")) {
    return VideoIcon;
  }
  return BriefcaseIcon;
}
