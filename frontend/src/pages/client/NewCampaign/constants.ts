import linkedinLogo from "../../../assets/logos/linkedin.png";
import facebookLogo from "../../../assets/logos/facebook.png";
import googleLogo from "../../../assets/logos/google.png";
import snapchatLogo from "../../../assets/logos/snapchat.png";
import instagramLogo from "../../../assets/logos/instagram.png";
import xLogo from "../../../assets/logos/x.png";
import youtubeLogo from "../../../assets/logos/youtube.png";
import type { Step } from "./types";

export const LOGO_MAP: Record<string, string> = {
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
