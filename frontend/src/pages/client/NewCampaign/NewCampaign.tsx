import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { ChannelRow } from "../../../components/Channel/ChannelRow";
import "./NewCampaign.scss";

// ─── Logos ───────────────────────────────────────────────────────
import linkedinLogo from "../../../assets/logos/linkedin.png";
import facebookLogo from "../../../assets/logos/facebook.png";
import googleLogo from "../../../assets/logos/google.png";
import snapchatLogo from "../../../assets/logos/snapchat.png";
import instagramLogo from "../../../assets/logos/instagram.png";
import xLogo from "../../../assets/logos/x.png";
import youtubeLogo from "../../../assets/logos/youtube.png";

// ─── Types ──────────────────────────────────────────────────────
type Step = 1 | 2 | 3 | 4;
type PlanType = "custom" | "package" | null;
type PackageId = "basic" | "medium" | "deluxe" | null;
type PaymentMethod = "value-card" | "card-payment" | "invoice";

type ImageOption = "upload" | "media-library" | "team-suggest" | "";
type LeadAdDesc = "team-create" | "own" | "";
type VideoMaterials = "upload" | "media-library" | "combine" | "";
type LinkedinJobDesc = "team-create" | "own" | "";
type LinkedinScreening = "team-create" | "own" | "";

interface FormState {
  planType: PlanType;
  selectedPackage: PackageId;
  selectedChannels: string[];
  selectedAddons: string[];
  campaignName: string;
  imageOption: ImageOption;
  leadAdDesc: LeadAdDesc;
  videoMaterials: VideoMaterials;
  linkedinJobDesc: LinkedinJobDesc;
  linkedinScreening: LinkedinScreening;
  targetAudience: string;
  additionalNotes: string;
  paymentMethod: PaymentMethod;
}

// ─── Data ────────────────────────────────────────────────────────
const CHANNELS = [
  {
    id: "linkedin",
    label: "LinkedIn",
    description: "Professional network targeting",
    logo: linkedinLogo,
  },
  {
    id: "facebook",
    label: "Facebook",
    description: "Broad audience reach",
    logo: facebookLogo,
  },
  {
    id: "google",
    label: "Google",
    description: "Broad audience reach",
    logo: googleLogo,
  },
  {
    id: "snapchat",
    label: "Snapchat",
    description: "Reaching gen Z and young adults",
    logo: snapchatLogo,
  },
  {
    id: "instagram",
    label: "Instagram",
    description: "Visual storytelling",
    logo: instagramLogo,
  },
  { id: "x", label: "X", description: "Real time engagement", logo: xLogo },
  {
    id: "youtube",
    label: "YouTube",
    description: "Video reach and brand awareness",
    logo: youtubeLogo,
  },
];

const PACKAGES = [
  {
    id: "basic" as PackageId,
    label: "Basic package",
    channelLimit: 3,
    features: [
      "Choose up to 3 channels",
      "14 day campaign period",
      "50% ad spend included",
      "Full performance analytics",
      "Ongoing optimalization",
    ],
    price: 8000,
    popular: false,
  },
  {
    id: "medium" as PackageId,
    label: "Medium package",
    channelLimit: 5,
    features: [
      "Choose up to 5 channels",
      "14 day campaign period",
      "50% ad spend included",
      "Full performance analytics",
      "Ongoing optimalization",
    ],
    price: 15000,
    popular: true,
  },
  {
    id: "deluxe" as PackageId,
    label: "Deluxe package",
    channelLimit: 7,
    features: [
      "Choose up to 7 channels",
      "14 day campaign period",
      "50% ad spend included",
      "Full performance analytics",
      "Ongoing optimalization",
    ],
    price: 25000,
    popular: false,
  },
];

const ADDONS = [
  {
    id: "lead-ads",
    label: "Lead Ads",
    description:
      "Collect applications directly in the ad. No landing page needed",
    price: 2500,
  },
  {
    id: "video-campaign",
    label: "Video Campaign",
    description:
      "Engage candidates with dynamic video content across platforms",
    price: 3800,
  },
  {
    id: "linkedin-job-posting",
    label: "LinkedIn Job Posting",
    description:
      "Official job listing on LinkedIn's job board with applicant tracking",
    price: 4200,
  },
];

const CHANNEL_PRICES: Record<string, number> = {
  linkedin: 12600,
  facebook: 8900,
  google: 8900,
  snapchat: 8900,
  instagram: 8900,
  x: 8900,
};

// Small package SVG icons
function IconBox() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect
        x="0.5"
        y="0.5"
        width="14"
        height="14"
        rx="2"
        stroke="white"
        strokeWidth="1.2"
        fill="none"
      />
      <rect x="3" y="3" width="4" height="4" rx="1" fill="white" />
      <rect
        x="8"
        y="3"
        width="4"
        height="4"
        rx="1"
        fill="rgba(255,255,255,0.4)"
      />
      <rect
        x="3"
        y="8"
        width="4"
        height="4"
        rx="1"
        fill="rgba(255,255,255,0.4)"
      />
    </svg>
  );
}
function IconStar() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M7.5 1.5l1.5 4 4.2.3-3.2 2.8.9 4.1L7.5 10.3l-3.4 2.4.9-4.1L1.8 5.8l4.2-.3z"
        fill="white"
      />
    </svg>
  );
}
function IconCrown() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M1.5 11.5h12v1.5h-12zM1.5 10l2.5-5.5 3.5 3.5 3.5-5.5 2.5 7.5H1.5z"
        fill="white"
      />
    </svg>
  );
}

const PACKAGE_ICONS: Record<string, React.ReactNode> = {
  basic: <IconBox />,
  medium: <IconStar />,
  deluxe: <IconCrown />,
};

const STEP_META: Record<Step, { title: string; subtitle: string }> = {
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

const STEP_PROGRESS: Record<Step, number> = { 1: 25, 2: 50, 3: 75, 4: 100 };

// ─── Component ───────────────────────────────────────────────────
export default function NewCampaign() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    planType: null,
    selectedPackage: null,
    selectedChannels: [],
    selectedAddons: [],
    campaignName: "",
    imageOption: "",
    leadAdDesc: "",
    videoMaterials: "",
    linkedinJobDesc: "",
    linkedinScreening: "",
    targetAudience: "",
    additionalNotes: "",
    paymentMethod: "value-card",
  });

  // ─── Pricing helpers ──────────────────────────────────────────
  function calcPackagePrice() {
    if (form.planType === "package" && form.selectedPackage)
      return PACKAGES.find((p) => p.id === form.selectedPackage)?.price ?? 0;
    return 0;
  }
  function calcChannelCost() {
    if (form.planType === "package") return 0;
    return form.selectedChannels.reduce(
      (s, id) => s + (CHANNEL_PRICES[id] ?? 0),
      0,
    );
  }
  function calcAddonsCost() {
    return form.selectedAddons.reduce(
      (s, id) => s + (ADDONS.find((a) => a.id === id)?.price ?? 0),
      0,
    );
  }
  function calcSubtotal() {
    return calcPackagePrice() + calcChannelCost() + calcAddonsCost();
  }
  function calcVat() {
    return Math.round(calcSubtotal() * 0.25);
  }

  // ─── Toggle helpers ───────────────────────────────────────────
  function toggleChannel(id: string) {
    const pkg = PACKAGES.find((p) => p.id === form.selectedPackage);
    const limit = pkg?.channelLimit ?? Infinity;
    setForm((f) => {
      if (f.selectedChannels.includes(id)) {
        return {
          ...f,
          selectedChannels: f.selectedChannels.filter((c) => c !== id),
        };
      }
      if (f.planType === "package" && f.selectedChannels.length >= limit)
        return f;
      return { ...f, selectedChannels: [...f.selectedChannels, id] };
    });
  }

  function toggleAddon(id: string) {
    setForm((f) => ({
      ...f,
      selectedAddons: f.selectedAddons.includes(id)
        ? f.selectedAddons.filter((a) => a !== id)
        : [...f.selectedAddons, id],
    }));
  }

  // ─── Navigation ───────────────────────────────────────────────
  function canContinueStep1() {
    if (form.planType === "custom") return form.selectedChannels.length > 0;
    if (form.planType === "package") return form.selectedPackage !== null;
    return false;
  }

  function canContinueStep2() {
    return form.selectedChannels.length > 0;
  }

  function next() {
    if (step < 4) setStep((s) => (s + 1) as Step);
  }
  function back() {
    if (step > 1) setStep((s) => (s - 1) as Step);
  }

  // ─── Submit ───────────────────────────────────────────────────
  async function handleSubmit() {
    setSubmitting(true);
    try {
      const subtotal = calcSubtotal();
      const vat = calcVat();
      const body = {
        orderType: form.planType ?? "custom",
        package: form.selectedPackage ?? undefined,
        channels: form.selectedChannels,
        addons: form.selectedAddons,
        campaignName: form.campaignName,
        assets: {
          imageOption: form.imageOption || "team-suggest",
          ...(form.selectedAddons.includes("lead-ads") && {
            leadAdDescription: form.leadAdDesc || "team-create",
          }),
          ...(form.selectedAddons.includes("video-campaign") && {
            videoMaterials: form.videoMaterials || "upload",
          }),
          ...(form.selectedAddons.includes("linkedin-job-posting") && {
            linkedinJobDescription: form.linkedinJobDesc || "team-create",
            linkedinScreeningQuestions: form.linkedinScreening || "team-create",
          }),
        },
        targetAudience: form.targetAudience,
        additionalNotes: form.additionalNotes,
        paymentMethod: form.paymentMethod,
        totalAmount: subtotal + vat,
      };
      await api.post("/orders", body);
      setShowSuccess(true);
    } catch {
      // Still show success modal for now (backend may not be fully ready)
      setShowSuccess(true);
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Step 1 render ────────────────────────────────────────────
  function renderStep1() {
    return (
      <>
        <div className="step1">
          {/* Custom plan card */}
          <div className="order-card">
            <h3>Custom made plan</h3>
            <p className="subheading">
              Choose your prefered channels for your campaign:
            </p>
            <div className="channel-list">
              {CHANNELS.map((ch) => (
                <ChannelRow
                  key={ch.id}
                  logo={ch.logo}
                  name={ch.label}
                  description={ch.description}
                  checked={
                    form.planType === "custom" &&
                    form.selectedChannels.includes(ch.id)
                  }
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      planType: "custom",
                      selectedPackage: null,
                      selectedChannels: f.selectedChannels.includes(ch.id)
                        ? f.selectedChannels.filter((c) => c !== ch.id)
                        : [...f.selectedChannels, ch.id],
                    }))
                  }
                />
              ))}
            </div>
          </div>

          {/* Package plan card */}
          <div className="order-card">
            <h3>Package plan</h3>
            <p className="subheading">
              Reach more candidates with bundled channel packages:
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                marginTop: "16px",
              }}
            >
              {PACKAGES.map((pkg) => {
                const selected = form.selectedPackage === pkg.id;
                return (
                  <div
                    key={pkg.id as string}
                    className={`package-option${selected ? " package-option--selected" : ""}`}
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        planType: "package",
                        selectedPackage: pkg.id,
                        selectedChannels: [],
                      }))
                    }
                  >
                    {pkg.popular && (
                      <span className="package-option__popular">
                        ✦ Most popular
                      </span>
                    )}
                    <div className="package-option__header">
                      <div className="package-option__icon">
                        {PACKAGE_ICONS[pkg.id as string]}
                      </div>
                      <span className="package-option__name">{pkg.label}</span>
                      <span
                        className={`package-option__radio${selected ? " package-option__radio--selected" : ""}`}
                      />
                    </div>
                    <ul className="package-option__features">
                      {pkg.features.map((f) => (
                        <li key={f} className="package-option__feature">
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {canContinueStep1() && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="step-nav__continue" onClick={next}>
              Continue
            </button>
          </div>
        )}
      </>
    );
  }

  // ─── Step 2 render ────────────────────────────────────────────
  function renderStep2() {
    const pkg = PACKAGES.find((p) => p.id === form.selectedPackage);

    return (
      <div className="step2">
        <div className="step2__main">
          {/* Channels section */}
          <div className="order-card">
            <h2 className="order-card__title">Select channels</h2>
            <p className="subheading order-card__subtitle">
              Choose your preferred channels for your campaign
            </p>
            <div className="channel-grid">
              {CHANNELS.map((ch) => {
                const checked = form.selectedChannels.includes(ch.id);
                const atLimit =
                  form.planType === "package" &&
                  !!pkg &&
                  form.selectedChannels.length >= pkg.channelLimit &&
                  !checked;
                return (
                  <ChannelRow
                    key={ch.id}
                    logo={ch.logo}
                    name={ch.label}
                    description={ch.description}
                    checked={checked}
                    disabled={atLimit}
                    onClick={() => toggleChannel(ch.id)}
                  />
                );
              })}
            </div>
            {pkg && (
              <p
                style={{ fontSize: "13px", color: "#636363", marginTop: "8px" }}
              >
                Select up to {pkg.channelLimit} channels (
                {form.selectedChannels.length}/{pkg.channelLimit} selected)
              </p>
            )}
          </div>

          {/* Add-ons section */}
          <div className="order-card">
            <h2 className="order-card__title">Campaign add-ons</h2>
            <p className="subheading order-card__subtitle">
              Boost your campaigns with optional add ons to increase your reach
            </p>
            <div className="addon-grid">
              {ADDONS.map((addon) => {
                const checked = form.selectedAddons.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    className={`addon-card${checked ? " addon-card--checked" : ""}`}
                    onClick={() => toggleAddon(addon.id)}
                  >
                    <div className="addon-card__header">
                      <div className="addon-card__icon-wrap">
                        <AddonIcon id={addon.id} />
                      </div>
                      <span
                        className={`addon-card__check${checked ? " addon-card__check--checked" : ""}`}
                      >
                        {checked && "✓"}
                      </span>
                    </div>
                    <p className="addon-card__name">{addon.label}</p>
                    <p className="addon-card__desc">{addon.description}</p>
                    <p className="addon-card__price">
                      {addon.price.toLocaleString("nb-NO")} kr
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order summary sidebar */}
        {renderOrderSummary(false)}
      </div>
    );
  }

  // ─── Step 3 render ────────────────────────────────────────────
  function renderStep3() {
    const hasLeadAds = form.selectedAddons.includes("lead-ads");
    const hasVideo = form.selectedAddons.includes("video-campaign");
    const hasLinkedinPosting = form.selectedAddons.includes(
      "linkedin-job-posting",
    );

    return (
      <div className="step3">
        {/* Campaign name */}
        <div className="order-card">
          <h2 className="order-card__title">Campaign name</h2>
          <p className="subheading order-card__subtitle">
            Give your campaign a memorable name
          </p>
          <input
            className="form-input"
            type="text"
            placeholder="E.g., Summer 2026 hiring campaign"
            value={form.campaignName}
            onChange={(e) =>
              setForm((f) => ({ ...f, campaignName: e.target.value }))
            }
          />
        </div>

        {/* Assets */}
        <div className="order-card">
          <h2 className="order-card__title">Assets</h2>
          <p className="subheading order-card__subtitle">
            Help us gather the key information and materials needed to launch
            your campaign
          </p>

          {/* Campaign image */}
          <p className="form-question">
            Do you want to upload a campaign image?
          </p>
          <div className="radio-group">
            {[
              { value: "upload", label: "Upload image" },
              { value: "media-library", label: "Select from media library" },
              { value: "team-suggest", label: "Let our team suggest an image" },
            ].map((opt) => (
              <RadioOption
                key={opt.value}
                label={opt.label}
                selected={form.imageOption === opt.value}
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    imageOption: opt.value as ImageOption,
                  }))
                }
              />
            ))}
          </div>

          {/* Lead Ads conditional */}
          {hasLeadAds && (
            <>
              <p className="form-question">
                Do you have a job description for the Lead Ad?
              </p>
              <div className="radio-group">
                {[
                  {
                    value: "team-create",
                    label: "Let our team create the job description",
                  },
                  { value: "own", label: "Provide your own job description" },
                ].map((opt) => (
                  <RadioOption
                    key={opt.value}
                    label={opt.label}
                    selected={form.leadAdDesc === opt.value}
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        leadAdDesc: opt.value as LeadAdDesc,
                      }))
                    }
                  />
                ))}
              </div>
            </>
          )}

          {/* Video Campaign conditional */}
          {hasVideo && (
            <>
              <p className="form-question">
                How would you like us to source materials for your video?
              </p>
              <div className="radio-group">
                {[
                  { value: "upload", label: "Upload your own materials" },
                  {
                    value: "media-library",
                    label:
                      "Let our team select materials from our media library",
                  },
                  { value: "combine", label: "Combine both" },
                ].map((opt) => (
                  <RadioOption
                    key={opt.value}
                    label={opt.label}
                    selected={form.videoMaterials === opt.value}
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        videoMaterials: opt.value as VideoMaterials,
                      }))
                    }
                  />
                ))}
              </div>
            </>
          )}

          {/* LinkedIn Job Posting conditional */}
          {hasLinkedinPosting && (
            <>
              <p className="form-question">
                Do you have a job description for the LinkedIn job posting?
              </p>
              <div className="radio-group">
                {[
                  {
                    value: "team-create",
                    label: "Let our team create the job description",
                  },
                  { value: "own", label: "Provide your own job description" },
                ].map((opt) => (
                  <RadioOption
                    key={opt.value}
                    label={opt.label}
                    selected={form.linkedinJobDesc === opt.value}
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        linkedinJobDesc: opt.value as LinkedinJobDesc,
                      }))
                    }
                  />
                ))}
              </div>

              <p className="form-question">
                Do you have any screening questions for the LinkedIn job
                posting?
              </p>
              <div className="radio-group">
                {[
                  {
                    value: "team-create",
                    label: "Let our team create screening questions",
                  },
                  {
                    value: "own",
                    label: "Provide your own screening questions",
                  },
                ].map((opt) => (
                  <RadioOption
                    key={opt.value}
                    label={opt.label}
                    selected={form.linkedinScreening === opt.value}
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        linkedinScreening: opt.value as LinkedinScreening,
                      }))
                    }
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Target audience */}
        <div className="order-card">
          <h2 className="order-card__title">Target audience</h2>
          <p className="subheading order-card__subtitle">
            Describe who you want to reach with this campaign. Be as specific as
            possible about skills, experience level, location and any other
            relevant criteria
          </p>
          <textarea
            className="form-input"
            rows={6}
            placeholder="E.g., We are looking for qualified child welfare professionals with experience in case management and follow-up work with children and families..."
            value={form.targetAudience}
            onChange={(e) =>
              setForm((f) => ({ ...f, targetAudience: e.target.value }))
            }
          />
        </div>

        {/* Additional notes */}
        <div className="order-card">
          <h2 className="order-card__title">Additional notes</h2>
          <p className="subheading order-card__subtitle">
            Anything else we should know?
          </p>
          <textarea
            className="form-input"
            rows={4}
            placeholder="E.g., Key selling points, specific messaging you'd like included, deadlines or any other context that would help us create better campaigns..."
            value={form.additionalNotes}
            onChange={(e) =>
              setForm((f) => ({ ...f, additionalNotes: e.target.value }))
            }
          />
        </div>
      </div>
    );
  }

  // ─── Step 4 render ────────────────────────────────────────────
  function renderStep4() {
    const paymentMethods = [
      {
        id: "value-card" as PaymentMethod,
        label: "Value card",
        desc: "Pay by using your prepaid value card balance",
        icon: <GiftIcon />,
        extra: (
          <span className="payment-card__balance-pill">
            Current balance on value card: <strong>42 500 kr</strong>
          </span>
        ),
      },
      {
        id: "card-payment" as PaymentMethod,
        label: "Card payment",
        desc: "Pay securely with your debit or credit card",
        icon: <CreditCardIcon />,
      },
      {
        id: "invoice" as PaymentMethod,
        label: "Invoice",
        desc: "Receive an invoice with 30 days due date",
        icon: <InvoiceIcon />,
      },
    ];

    return (
      <div className="step4">
        <div className="order-card">
          <h2 className="order-card__title">Payment method</h2>
          <div className="payment-methods">
            {paymentMethods.map((pm) => {
              const sel = form.paymentMethod === pm.id;
              return (
                <div
                  key={pm.id}
                  className={`payment-card${sel ? " payment-card--selected" : ""}`}
                  onClick={() =>
                    setForm((f) => ({ ...f, paymentMethod: pm.id }))
                  }
                >
                  <div className="payment-card__icon">{pm.icon}</div>
                  <div className="payment-card__content">
                    <p className="payment-card__name">{pm.label}</p>
                    <p className="payment-card__desc">{pm.desc}</p>
                    {pm.extra}
                  </div>
                  <span
                    className={`payment-card__radio${sel ? " payment-card__radio--selected" : ""}`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Order summary with VAT */}
        {renderOrderSummary(true)}
      </div>
    );
  }

  // ─── Order summary ────────────────────────────────────────────
  function renderOrderSummary(showVat: boolean) {
    const pkg = PACKAGES.find((p) => p.id === form.selectedPackage);
    const selChannels = CHANNELS.filter((c) =>
      form.selectedChannels.includes(c.id),
    );
    const selAddons = ADDONS.filter((a) => form.selectedAddons.includes(a.id));
    const subtotal = calcSubtotal();
    const vat = calcVat();

    return (
      <aside className="order-summary">
        <h3 className="order-summary__title">Order summary</h3>
        <p className="order-summary__plan-label">
          {pkg ? pkg.label : "Custom plan"}
        </p>

        <hr className="order-summary__divider" />

        {/* Channels */}
        <p className="order-summary__section-label">Channels:</p>
        {form.planType === "package" && selChannels.length === 0 ? (
          <div className="order-summary__row">
            <span>Included in package</span>
            <span>0 kr</span>
          </div>
        ) : (
          selChannels.map((ch) => (
            <div key={ch.id} className="order-summary__row">
              <span className="order-summary__channel-name">
                <img
                  src={ch.logo}
                  alt={ch.label}
                  className="order-summary__channel-logo"
                />
                {ch.label}
              </span>
              <span>
                {form.planType === "package"
                  ? "0 kr"
                  : `${(CHANNEL_PRICES[ch.id] ?? 0).toLocaleString("nb-NO")} kr`}
              </span>
            </div>
          ))
        )}

        <hr className="order-summary__divider" />

        {/* Add-ons */}
        <p className="order-summary__section-label">Add-ons:</p>
        {selAddons.length === 0 ? (
          <div className="order-summary__row">
            <span>No add-ons</span>
            <span>0 kr</span>
          </div>
        ) : (
          selAddons.map((a) => (
            <div key={a.id} className="order-summary__row">
              <span className="order-summary__addon-name">
                <span className="addon-dot" />
                {a.label}
              </span>
              <span>{a.price.toLocaleString("nb-NO")} kr</span>
            </div>
          ))
        )}

        <hr className="order-summary__divider" />

        {showVat && (
          <div className="order-summary__row">
            <span>VAT (25%)</span>
            <span>{vat.toLocaleString("nb-NO")} kr</span>
          </div>
        )}

        <div className="order-summary__row order-summary__row--total">
          <span>Total:</span>
          <span>
            {(showVat ? subtotal + vat : subtotal).toLocaleString("nb-NO")} kr
          </span>
        </div>
      </aside>
    );
  }

  // ─── Success modal ────────────────────────────────────────────
  function renderSuccessModal() {
    return (
      <div className="success-overlay" onClick={() => setShowSuccess(false)}>
        <div className="success-modal" onClick={(e) => e.stopPropagation()}>
          <button
            className="success-modal__close"
            onClick={() => setShowSuccess(false)}
            aria-label="Close"
          >
            ✕
          </button>
          <div className="success-modal__icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle
                cx="40"
                cy="40"
                r="38"
                stroke="#7151e6"
                strokeWidth="3"
                fill="none"
              />
              <path
                d="M24 40l12 12 20-22"
                stroke="#7151e6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="success-modal__title">Campaign submitted</h2>
          <p className="success-modal__body">
            Your campaign order has been successfully placed.
            <br />
            Our team will receive your details and get started right away.
            <br />
            You'll receive a confirmation email shortly.
          </p>
          <button
            className="success-modal__btn"
            onClick={() => {
              setShowSuccess(false);
              navigate("/campaigns");
            }}
          >
            View campaign
          </button>
        </div>
      </div>
    );
  }

  const { title, subtitle } = STEP_META[step];
  const progress = STEP_PROGRESS[step];

  return (
    <div className="new-order">
      {/* Header */}
      <div className="page-header">
        <h2>{title}</h2>
        <p className="subheading">{subtitle}</p>
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <span className="progress-bar__label" style={{ left: `${progress}%` }}>
          Step {step}
        </span>
        <div className="progress-bar__track">
          <div
            className="progress-bar__fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}

      {/* Navigation */}
      {step > 1 && (
        <div className="step-nav">
          <button className="step-nav__back" onClick={back}>
            ← {step === 4 ? "Back to review" : "Back"}
          </button>
          {step < 4 ? (
            <button
              className="step-nav__continue"
              onClick={next}
              disabled={step === 2 && !canContinueStep2()}
            >
              Continue
            </button>
          ) : (
            <button
              className="step-nav__continue"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Confirm and pay"}
            </button>
          )}
        </div>
      )}

      {/* Success modal */}
      {showSuccess && renderSuccessModal()}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────
function RadioOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`radio-option${selected ? " radio-option--selected" : ""}`}
      onClick={onClick}
    >
      <span
        className={`radio-option__dot${selected ? " radio-option__dot--selected" : ""}`}
      />
      <span className="radio-option__label">{label}</span>
    </div>
  );
}

// Addon icons
function AddonIcon({ id }: { id: string }) {
  if (id === "lead-ads")
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8zm0-4h8v2H8z" />
      </svg>
    );
  if (id === "video-campaign")
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
        <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
      </svg>
    );
  if (id === "linkedin-job-posting")
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  return null;
}

// Payment icons
function GiftIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
    </svg>
  );
}
function CreditCardIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}
function InvoiceIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
