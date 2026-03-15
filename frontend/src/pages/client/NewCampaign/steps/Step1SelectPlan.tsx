import type { FormState, Product, Package } from "../types";
import { PACKAGE_METADATA, LOGO_MAP } from "../constants";
import { canContinueStep1 } from "../utils";
import { ChannelRow } from "../../../../components/Channel/ChannelRow";
import { PackageOption } from "../components/PackageOption";
import "./Step1SelectPlan.scss";

interface Step1SelectPlanProps {
  form: FormState;
  channels: Product[];
  packages: Product[];
  packageIcons: Record<string, React.ReactNode>;
  onFormChange: (updates: Partial<FormState>) => void;
  onNext: () => void;
}

export function Step1SelectPlan({
  form,
  channels,
  packages,
  packageIcons,
  onFormChange,
  onNext,
}: Step1SelectPlanProps) {
  const handleChannelToggle = (channelTitle: string) => {
    const channelTitleLower = channelTitle.toLowerCase();
    onFormChange({
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
    onFormChange({
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
    return packageIcons[pkgId] || null;
  };

  const isPackagePopular = (pkgTitle: string) => {
    return pkgTitle.toLowerCase().includes("medium");
  };

  const enrichPackageWithMetadata = (pkg: Product): Package => {
    const metadata = PACKAGE_METADATA[pkg.title] || {};
    return {
      ...pkg,
      channelLimit: metadata.channelLimit,
      features: metadata.features,
    };
  };

  return (
    <>
      <div className="step1">
        <div className="order-card">
          <h4>Custom made plan</h4>
          <p className="subheading">
            Choose your prefered channels for your campaign:
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
          <p className="subheading">
            Reach more candidates with bundled channel packages:
          </p>
          <div className="step1__package-list">
            {packages.map((pkg) => {
              const enrichedPkg = enrichPackageWithMetadata(pkg);
              const pkgId = pkg.title.toLowerCase().includes("basic")
                ? "basic"
                : pkg.title.toLowerCase().includes("medium")
                  ? "medium"
                  : "deluxe";
              const selected = form.selectedPackage === pkgId;
              return (
                <PackageOption
                  key={pkg._id}
                  package={enrichedPkg}
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
          <button className="step-nav__continue" onClick={onNext}>
            Continue
          </button>
        </div>
      )}
    </>
  );
}
