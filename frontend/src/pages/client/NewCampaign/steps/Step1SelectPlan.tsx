import Icon from "../../../../components/Icon/Icon";
import { LOGO_MAP } from "../constants";
import { canContinueStep1 } from "../utils";
import { useNewCampaign } from "../../../../context/NewCampaignContext";
import { ChannelRow } from "../../../../components/Channel/ChannelRow";
import { PackageOption } from "../components/PackageOption";
import BoxIcon from "../../../../assets/icons/box.svg?react";
import StarIcon from "../../../../assets/icons/star.svg?react";
import DiamondIcon from "../../../../assets/icons/diamond.svg?react";
import { colorPrimary } from "../../../../styles/colors.ts";
import "./Step1SelectPlan.scss";

export function Step1SelectPlan() {
  const { form, updateForm, channels, packages, next } = useNewCampaign();

  const PACKAGE_ICONS: Record<string, React.ReactNode> = {
    basic: <Icon svg={BoxIcon} size={15} color={colorPrimary} />,
    medium: <Icon svg={StarIcon} size={15} color={colorPrimary} />,
    deluxe: <Icon svg={DiamondIcon} size={15} color={colorPrimary} />,
  };

  const handleChannelToggle = (channelTitle: string) => {
    const channelTitleLower = channelTitle.toLowerCase();
    updateForm({
      planType: "custom",
      selectedPackage: null,
      selectedChannels: form.selectedChannels.includes(channelTitleLower)
        ? form.selectedChannels.filter((c) => c !== channelTitleLower)
        : [...form.selectedChannels, channelTitleLower],
    });
  };

  const handlePackageSelect = (pkgTitle: string) => {
    const pkgId = pkgTitle.toLowerCase().includes("basic")
      ? "basic"
      : pkgTitle.toLowerCase().includes("medium")
        ? "medium"
        : "deluxe";
    updateForm({
      planType: "package",
      selectedPackage: pkgId,
      selectedChannels: [],
    });
  };

  const getPackageIcon = (pkgTitle: string) => {
    const pkgId = pkgTitle.toLowerCase().includes("basic")
      ? "basic"
      : pkgTitle.toLowerCase().includes("medium")
        ? "medium"
        : "deluxe";
    return PACKAGE_ICONS[pkgId] || null;
  };

  const isPackagePopular = (pkgTitle: string) =>
    pkgTitle.toLowerCase().includes("medium");

  return (
    <>
      <div className="step1">
        <div className="order-card">
          <h4>Custom made plan</h4>
          <p className="body-2">
            Choose your prefered channels for your campaign
          </p>
          <div className="channel-list">
            {channels.map((ch) => (
              <ChannelRow
                key={ch._id}
                logo={LOGO_MAP[ch.title] || ch.logo || ""}
                name={ch.title}
                description={ch.description || ""}
                checked={
                  form.planType === "custom" &&
                  form.selectedChannels.includes(ch.title.toLowerCase())
                }
                onClick={() => handleChannelToggle(ch.title)}
              />
            ))}
          </div>
        </div>

        <div className="order-card">
          <h4>Package plan</h4>
          <p className="body-2">
            Reach more candidates with bundled channel packages
          </p>
          <div className="step1__package-list">
            {packages.map((pkg) => {
              const pkgId = pkg.title.toLowerCase().includes("basic")
                ? "basic"
                : pkg.title.toLowerCase().includes("medium")
                  ? "medium"
                  : "deluxe";
              const selected = form.selectedPackage === pkgId;
              return (
                <PackageOption
                  key={pkg._id}
                  package={pkg}
                  selected={selected}
                  popular={isPackagePopular(pkg.title)}
                  icon={getPackageIcon(pkg.title)}
                  onClick={() => handlePackageSelect(pkg.title)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {canContinueStep1(form) && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="step-nav__continue" onClick={next}>
            Continue
          </button>
        </div>
      )}
    </>
  );
}
