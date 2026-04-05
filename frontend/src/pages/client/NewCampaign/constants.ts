import linkedinLogo from "../../../assets/logos/linkedin1.svg";
import facebookLogo from "../../../assets/logos/facebook1.svg";
import googleLogo from "../../../assets/logos/google1.svg";
import snapchatLogo from "../../../assets/logos/snapchat1.svg";
import instagramLogo from "../../../assets/logos/instagram1.svg";
import xLogo from "../../../assets/logos/x1.svg";
import youtubeLogo from "../../../assets/logos/youtube1.svg";
import metaLogo from "../../../assets/logos/meta.svg";
import tiktokLogo from "../../../assets/logos/tiktok1.svg";
import type { Step } from "./types";

export const LOGO_MAP: Record<string, string> = {
  Meta: metaLogo,
  Tiktok: tiktokLogo,
  LinkedIn: linkedinLogo,
  Facebook: facebookLogo,
  Google: googleLogo,
  Snapchat: snapchatLogo,
  Instagram: instagramLogo,
  X: xLogo,
  YouTube: youtubeLogo,
};

export const STEP_META: Record<Step, { title: string; subtitle: string }> = {
  1: { title: "New campaign", subtitle: "Choose your campaign setup" },
  2: {
    title: "Customize your package plan",
    subtitle: "Choose your desired channels and add ons",
  },
  3: {
    title: "Campaign details",
    subtitle:
      "Help us understand your campaign goals and audience so we can deliver the best possible results",
  },
  4: { title: "Payment", subtitle: "Select your preferred payment method" },
};
