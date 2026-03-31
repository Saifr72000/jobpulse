import { LOGO_MAP } from "../constants";
import { useNewCampaign } from "../../../../context/NewCampaignContext";
import { ChannelRow } from "../../../../components/Channel/ChannelRow";
import { AddonCard } from "../components/AddonCard";
import { OrderSummary } from "../components/OrderSummary";
import { getAddonIcon } from "../addonIcons";
import "./Step2CustomizePackage.scss";

export function Step2CustomizePackage() {
  const { form, updateForm, channels, packages, addons } = useNewCampaign();

  const pkg = packages.find((p) =>
    p.title.toLowerCase().includes(form.selectedPackage || ""),
  );

  const toggleChannel = (channelTitle: string) => {
    const channelTitleLower = channelTitle.toLowerCase();
    updateForm({
      selectedChannels: form.selectedChannels.includes(channelTitleLower)
        ? form.selectedChannels.filter((c) => c !== channelTitleLower)
        : [...form.selectedChannels, channelTitleLower],
    });
  };

  const toggleAddon = (addonTitle: string) => {
    const addonTitleLower = addonTitle.toLowerCase();
    updateForm({
      selectedAddons: form.selectedAddons.some((a) =>
        a.toLowerCase().includes(addonTitleLower),
      )
        ? form.selectedAddons.filter(
            (a) => !a.toLowerCase().includes(addonTitleLower),
          )
        : [...form.selectedAddons, addonTitle],
    });
  };

  return (
    <div className="step2">
      <div className="step2__main">
        <div className="order-card">
          <h4>Select channels</h4>
          <p className="subheading">
            Choose your preferred channels for your campaign
          </p>
          <div className="channel-grid">
            {channels.map((ch) => {
              const checked = form.selectedChannels.includes(
                ch.title.toLowerCase(),
              );
              const atLimit =
                form.planType === "package" &&
                !!pkg?.channelLimit &&
                form.selectedChannels.length >= pkg.channelLimit &&
                !checked;
              return (
                <ChannelRow
                  key={ch._id}
                  logo={LOGO_MAP[ch.title] || ch.logo || ""}
                  name={ch.title}
                  description={ch.description || ""}
                  checked={checked}
                  disabled={atLimit}
                  onClick={() => toggleChannel(ch.title)}
                />
              );
            })}
          </div>
          {pkg?.channelLimit && (
            <p className="subheading" style={{ marginTop: "8px" }}>
              Select up to {pkg.channelLimit} channels (
              {form.selectedChannels.length}/{pkg.channelLimit} selected)
            </p>
          )}
        </div>

        <div className="order-card">
          <h4>Campaign add-ons</h4>
          <p className="subheading">
            Boost your campaigns with optional add ons to increase your reach
          </p>
          <div className="addon-grid">
            {addons.map((addon) => {
              const checked = form.selectedAddons.some((a) =>
                a.toLowerCase().includes(addon.title.toLowerCase()),
              );
              return (
                <AddonCard
                  key={addon._id}
                  addon={addon}
                  checked={checked}
                  icon={getAddonIcon(addon.title)}
                  onClick={() => toggleAddon(addon.title)}
                />
              );
            })}
          </div>
        </div>
      </div>

      <OrderSummary
        form={form}
        showVat={false}
        channels={channels}
        packages={packages}
        addons={addons}
      />
    </div>
  );
}
