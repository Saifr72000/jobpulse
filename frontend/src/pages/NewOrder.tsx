import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import "./NewOrder.css";

// ─── Types ──────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4 | 5;
type PlanType = "custom" | "package" | null;
type PackageId = "basic" | "medium" | "deluxe" | null;
type PaymentMethod = "value-card" | "card" | "invoice";

interface FormState {
  planType: PlanType;
  selectedPackage: PackageId;
  selectedChannels: string[];
  selectedAddons: string[];
  campaignName: string;
  logoOption: "media-library" | "upload" | "";
  brandGuidelinesOption: "media-library" | "upload" | "none" | "";
  targetAudience: string;
  additionalNotes: string;
  paymentMethod: PaymentMethod;
}

// ─── SVG icons ───────────────────────────────────────────────────────────────

const IconBox = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect
      x="1"
      y="1"
      width="16"
      height="16"
      rx="3"
      stroke="#424241"
      strokeWidth="1.5"
      fill="none"
    />
    <rect x="4" y="4" width="4" height="4" rx="1" fill="#424241" />
    <rect x="10" y="4" width="4" height="4" rx="1" fill="#d0d0d0" />
    <rect x="4" y="10" width="4" height="4" rx="1" fill="#d0d0d0" />
    <rect x="10" y="10" width="4" height="4" rx="1" fill="#d0d0d0" />
  </svg>
);

const IconStar = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M9 2l1.8 4.6 4.9.4-3.7 3.2 1.1 4.8L9 12.4l-4.1 2.6 1.1-4.8L2.3 7l4.9-.4L9 2z"
      fill="#424241"
    />
  </svg>
);

const IconCrown = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2 14h14v2H2zM2 12l3-7 4 4 4-6 3 9H2z" fill="#424241" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const CHANNELS = [
  {
    id: "linkedin",
    label: "LinkedIn",
    description: "Professional network targeting",
    bg: "#0A66C2",
    color: "#fff",
    abbr: "in",
  },
  {
    id: "facebook",
    label: "Facebook",
    description: "Broad audience reach",
    bg: "#1877F2",
    color: "#fff",
    abbr: "f",
  },
  {
    id: "google",
    label: "Google",
    description: "Broad audience reach",
    bg: "#f1f4f8",
    color: "#424241",
    abbr: "G",
  },
  {
    id: "snapchat",
    label: "Snapchat",
    description: "Reaching gen Z and young adults",
    bg: "#FFFC00",
    color: "#1a1a1a",
    abbr: "S",
  },
  {
    id: "instagram",
    label: "Instagram",
    description: "Visual storytelling",
    bg: "#E1306C",
    color: "#fff",
    abbr: "IG",
  },
  {
    id: "x",
    label: "X",
    description: "Real time engagement",
    bg: "#000",
    color: "#fff",
    abbr: "X",
  },
];

const PACKAGES = [
  {
    id: "basic" as PackageId,
    label: "Basic package",
    Icon: IconBox,
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
    Icon: IconStar,
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
    Icon: IconCrown,
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
    color: "#52c41a",
  },
  {
    id: "video-campaign",
    label: "Video Campaign",
    description:
      "Engage candidates with dynamic video content across platforms",
    price: 3800,
    color: "#1677ff",
  },
  {
    id: "linkedin-job-posting",
    label: "LinkedIn Job posting",
    description:
      "Official job listing on LinkedIn's job board with applicant tracking",
    price: 4200,
    color: "#0A66C2",
  },
  {
    id: "image-ad-production",
    label: "Image ad production",
    description:
      "Create professionally designed static ad visuals for your campaign",
    price: 3800,
    color: "#52c41a",
  },
  {
    id: "upload-own-image",
    label: "Upload your own image",
    description:
      "Use your own image and choose between direct publishing or professional review",
    price: 3800,
    color: "#1677ff",
  },
  {
    id: "upload-own-video",
    label: "Upload your own video",
    description:
      "Use your own video content with optional review before publishing",
    price: 3800,
    color: "#0A66C2",
  },
  {
    id: "creative-review",
    label: "Creative review & approval",
    description:
      "Ensure your uploaded content meets platform and quality standards",
    price: 500,
    color: "#52c41a",
  },
  {
    id: "extended-distribution",
    label: "Extended distribution",
    description:
      "Expand campaign reach by activating additional distribution channels",
    price: 3800,
    color: "#1677ff",
  },
  {
    id: "website-publishing",
    label: "Website publishing",
    description: "Publish campaign content directly on your company website",
    price: 4200,
    color: "#0A66C2",
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

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  onNavigate: (page: string) => void;
}

export default function NewOrder({ onNavigate }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [form, setForm] = useState<FormState>({
    planType: null,
    selectedPackage: null,
    selectedChannels: [],
    selectedAddons: [],
    campaignName: "",
    logoOption: "",
    brandGuidelinesOption: "",
    targetAudience: "",
    additionalNotes: "",
    paymentMethod: "value-card",
  });

  // ── Progress ──────────────────────────────────────────────────────────────────

  const STEP_PROGRESS: Record<Step, number> = {
    1: 20,
    2: 40,
    3: 60,
    4: 80,
    5: 100,
  };

  // ── Costs ─────────────────────────────────────────────────────────────────────

  function calcPackagePrice(): number {
    if (form.planType === "package" && form.selectedPackage) {
      return PACKAGES.find((p) => p.id === form.selectedPackage)?.price ?? 0;
    }
    return 0;
  }

  function calcChannelCost(): number {
    if (form.planType === "package") return 0;
    return form.selectedChannels.reduce(
      (s, id) => s + (CHANNEL_PRICES[id] ?? 0),
      0,
    );
  }

  function calcAddonsCost(): number {
    return form.selectedAddons.reduce((s, id) => {
      return s + (ADDONS.find((a) => a.id === id)?.price ?? 0);
    }, 0);
  }

  function calcSubtotal(): number {
    return calcPackagePrice() + calcChannelCost() + calcAddonsCost();
  }

  function calcVat(): number {
    return Math.round(calcSubtotal() * 0.25);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────────

  function toggleChannel(id: string) {
    setForm((f) => ({
      ...f,
      selectedChannels: f.selectedChannels.includes(id)
        ? f.selectedChannels.filter((c) => c !== id)
        : [...f.selectedChannels, id],
    }));
  }

  function toggleAddon(id: string) {
    setForm((f) => ({
      ...f,
      selectedAddons: f.selectedAddons.includes(id)
        ? f.selectedAddons.filter((a) => a !== id)
        : [...f.selectedAddons, id],
    }));
  }

  function selectPackage(id: PackageId) {
    setForm((f) => ({
      ...f,
      planType: "package",
      selectedPackage: id,
      selectedChannels: [],
    }));
  }

  // ── Navigation ────────────────────────────────────────────────────────────────

  const next = () => step < 5 && setStep((s) => (s + 1) as Step);
  const back = () => step > 1 && setStep((s) => (s - 1) as Step);

  // ── Reusable: channel item ────────────────────────────────────────────────────

  function ChannelItem({
    ch,
    checked,
    onToggle,
  }: {
    ch: (typeof CHANNELS)[0];
    checked: boolean;
    onToggle: () => void;
  }) {
    return (
      <div
        className={`no-channel-item${checked ? " checked" : ""}`}
        onClick={onToggle}
      >
        <span
          className="no-channel-icon"
          style={{
            background: ch.bg,
            color: ch.color,
            border: ch.bg === "#f1f4f8" ? "1px solid #ddd" : "none",
          }}
        >
          {ch.abbr}
        </span>
        <span className="no-channel-info">
          <span className="no-channel-name">{ch.label}</span>
          <span className="no-channel-desc">{ch.description}</span>
        </span>
        <span className={`no-checkbox${checked ? " checked" : ""}`}></span>
      </div>
    );
  }

  // ── Step 1 ────────────────────────────────────────────────────────────────────

  function renderStep1() {
    const pkg = form.selectedPackage
      ? PACKAGES.find((p) => p.id === form.selectedPackage)
      : null;
    const hasSelection =
      pkg !== null ||
      (form.planType === "custom" && form.selectedChannels.length > 0);

    return (
      <div className="no-step1-content">
        <div className="no-plan-panels">
          {/* ── Custom made plan ── */}
          <div className="no-plan-card">
            <h2 className="no-plan-title">Custom made plan</h2>
            <p className="no-plan-subtitle">
              Choose your prefered channels for your campaign:
            </p>
            <div className="no-channel-list">
              {CHANNELS.map((ch) => (
                <ChannelItem
                  key={ch.id}
                  ch={ch}
                  checked={
                    form.planType === "custom" &&
                    form.selectedChannels.includes(ch.id)
                  }
                  onToggle={() => {
                    setForm((f) => ({
                      ...f,
                      planType: "custom",
                      selectedPackage: null,
                      selectedChannels: f.selectedChannels.includes(ch.id)
                        ? f.selectedChannels.filter((c) => c !== ch.id)
                        : [...f.selectedChannels, ch.id],
                    }));
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── Package plan ── */}
          <div className="no-plan-card">
            <h2 className="no-plan-title">Package plan</h2>
            <p className="no-plan-subtitle">
              Reach more candidates with bundeled channel packages:
            </p>
            <div className="no-package-list">
              {PACKAGES.map((p) => {
                const selected = form.selectedPackage === p.id;
                const Icon = p.Icon;
                return (
                  <div
                    key={p.id as string}
                    className={`no-package-item${selected ? " selected" : ""}`}
                    onClick={() => selectPackage(p.id)}
                  >
                    {p.popular && (
                      <span className="no-popular-badge">✦ Most popular</span>
                    )}
                    <div className="no-package-header">
                      <span className="no-package-icon">
                        <Icon />
                      </span>
                      <span className="no-package-label">{p.label}</span>
                      <span
                        className={`no-radio${selected ? " selected" : ""}`}
                      ></span>
                    </div>
                    <ul className="no-package-features">
                      {p.features.map((f) => (
                        <li key={f}>
                          <span className="no-check">✓</span>
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

        {/* CTA appears only once something is selected */}
        {hasSelection && (
          <div className="no-step1-cta">
            <button className="no-btn-primary" onClick={next}>
              {pkg
                ? `Continue with ${pkg.label.toLowerCase()}`
                : "Continue with custom plan"}{" "}
              &rarr;
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Step 2 ────────────────────────────────────────────────────────────────────

  function renderStep2() {
    return (
      <div className="no-step2-layout">
        <div className="no-step2-main">
          {/* Select channels */}
          <div className="no-section-card">
            <h2 className="no-section-title">Select channels</h2>
            <p className="no-section-sub">
              Choose your prefered channels for your campaign
            </p>
            <div className="no-channels-grid">
              {CHANNELS.map((ch) => (
                <ChannelItem
                  key={ch.id}
                  ch={ch}
                  checked={form.selectedChannels.includes(ch.id)}
                  onToggle={() => toggleChannel(ch.id)}
                />
              ))}
            </div>
          </div>

          {/* Campaign add-ons */}
          <div className="no-section-card">
            <h2 className="no-section-title">Campaign add-ons</h2>
            <p className="no-section-sub">
              Boost your campaigns with optional add ons to increase your reach
            </p>
            <div className="no-addons-grid">
              {ADDONS.map((addon) => {
                const checked = form.selectedAddons.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    className={`no-addon-item${checked ? " checked" : ""}`}
                    onClick={() => toggleAddon(addon.id)}
                  >
                    <div className="no-addon-top">
                      <span
                        className="no-addon-icon"
                        style={{ background: addon.color }}
                      ></span>
                      <span className="no-addon-name">{addon.label}</span>
                      <span
                        className={`no-checkbox${checked ? " checked" : ""}`}
                      ></span>
                    </div>
                    <p className="no-addon-desc">{addon.description}</p>
                    <p className="no-addon-price">
                      {addon.price.toLocaleString("nb-NO")} kr
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {renderOrderSummary()}
      </div>
    );
  }

  // ── Step 3 ────────────────────────────────────────────────────────────────────

  function renderStep3() {
    const logoOpts = [
      {
        value: "media-library" as const,
        label: "Already uploaded in media library",
      },
      { value: "upload" as const, label: "Upload logo now" },
    ];
    const guideOpts = [
      {
        value: "media-library" as const,
        label: "Already uploaded in media library",
      },
      { value: "upload" as const, label: "Upload brand guide now" },
      { value: "none" as const, label: "We don't have brand guidelines" },
    ];

    return (
      <div className="no-step3-content">
        <div className="no-section-card">
          <h2 className="no-section-title">Campaign name</h2>
          <p className="no-section-sub">Give your campaign a memorable name</p>
          <input
            className="no-text-input"
            type="text"
            placeholder="E.g., Summer 2026 hiring campaign"
            value={form.campaignName}
            onChange={(e) =>
              setForm((f) => ({ ...f, campaignName: e.target.value }))
            }
          />
        </div>

        <div className="no-section-card">
          <h2 className="no-section-title">Brand assets</h2>
          <p className="no-section-sub">
            Help us stay on-brand with your visual identity
          </p>

          <h3 className="no-subsection-title">Company logo</h3>
          <div className="no-radio-group">
            {logoOpts.map((opt) => (
              <div
                key={opt.value}
                className={`no-radio-item${form.logoOption === opt.value ? " selected" : ""}`}
                onClick={() =>
                  setForm((f) => ({ ...f, logoOption: opt.value }))
                }
              >
                <span
                  className={`no-radio${form.logoOption === opt.value ? " selected" : ""}`}
                ></span>
                {opt.label}
              </div>
            ))}
          </div>

          <h3 className="no-subsection-title" style={{ marginTop: "22px" }}>
            Brand guidelines
          </h3>
          <div className="no-radio-group">
            {guideOpts.map((opt) => (
              <div
                key={opt.value}
                className={`no-radio-item${form.brandGuidelinesOption === opt.value ? " selected" : ""}`}
                onClick={() =>
                  setForm((f) => ({ ...f, brandGuidelinesOption: opt.value }))
                }
              >
                <span
                  className={`no-radio${form.brandGuidelinesOption === opt.value ? " selected" : ""}`}
                ></span>
                {opt.label}
              </div>
            ))}
          </div>
        </div>

        <div className="no-section-card">
          <h2 className="no-section-title">Target audience</h2>
          <p className="no-section-sub">
            Describe who you want to reach with this campaign. Be as specific as
            possible about skills, experience level, location and any other
            relevant criteria
          </p>
          <textarea
            className="no-textarea"
            placeholder="E.g., We are looking for qualified child welfare professionals with experience in case management..."
            value={form.targetAudience}
            onChange={(e) =>
              setForm((f) => ({ ...f, targetAudience: e.target.value }))
            }
            rows={5}
          />
        </div>

        <div className="no-section-card">
          <h2 className="no-section-title">Additional notes</h2>
          <p className="no-section-sub">Anything else we should know?</p>
          <textarea
            className="no-textarea"
            placeholder="E.g., Key selling points, specific messaging you'd like included, deadlines..."
            value={form.additionalNotes}
            onChange={(e) =>
              setForm((f) => ({ ...f, additionalNotes: e.target.value }))
            }
            rows={4}
          />
        </div>
      </div>
    );
  }

  // ── Step 4: Review ────────────────────────────────────────────────────────────

  function renderStep4() {
    const pkg = PACKAGES.find((p) => p.id === form.selectedPackage);
    const selectedChannels = CHANNELS.filter((c) =>
      form.selectedChannels.includes(c.id),
    );
    const selectedAddons = ADDONS.filter((a) =>
      form.selectedAddons.includes(a.id),
    );

    return (
      <div className="no-step4-content">
        <div className="no-section-card">
          <h2 className="no-section-title">Plan</h2>
          {form.planType === "package" && pkg ? (
            <div className="no-review-row">
              <span className="no-review-label">{pkg.label}</span>
              <span className="no-review-value">
                {pkg.price.toLocaleString("nb-NO")} kr
              </span>
            </div>
          ) : (
            <p className="no-review-empty">Custom plan</p>
          )}
        </div>

        <div className="no-section-card">
          <h2 className="no-section-title">Channels</h2>
          {selectedChannels.length === 0 ? (
            <p className="no-review-empty">Included in package</p>
          ) : (
            selectedChannels.map((ch) => (
              <div key={ch.id} className="no-review-row">
                <span className="no-review-label">{ch.label}</span>
                <span className="no-review-value">
                  {(CHANNEL_PRICES[ch.id] ?? 0).toLocaleString("nb-NO")} kr
                </span>
              </div>
            ))
          )}
        </div>

        <div className="no-section-card">
          <h2 className="no-section-title">Add-ons</h2>
          {selectedAddons.length === 0 ? (
            <p className="no-review-empty">No add-ons selected</p>
          ) : (
            selectedAddons.map((a) => (
              <div key={a.id} className="no-review-row">
                <span className="no-review-label">{a.label}</span>
                <span className="no-review-value">
                  {a.price.toLocaleString("nb-NO")} kr
                </span>
              </div>
            ))
          )}
        </div>

        {form.campaignName && (
          <div className="no-section-card">
            <h2 className="no-section-title">Campaign details</h2>
            {form.campaignName && (
              <div className="no-review-row">
                <span className="no-review-label">Campaign name</span>
                <span className="no-review-value">{form.campaignName}</span>
              </div>
            )}
            {form.targetAudience && (
              <div className="no-review-detail">
                <p className="no-review-label">Target audience</p>
                <p className="no-review-text">{form.targetAudience}</p>
              </div>
            )}
            {form.additionalNotes && (
              <div className="no-review-detail">
                <p className="no-review-label">Additional notes</p>
                <p className="no-review-text">{form.additionalNotes}</p>
              </div>
            )}
          </div>
        )}

        <div className="no-section-card no-review-total-card">
          <div className="no-review-total">
            <span>Subtotal</span>
            <span>{calcSubtotal().toLocaleString("nb-NO")} kr</span>
          </div>
          <div className="no-review-total">
            <span>VAT (25%)</span>
            <span>{calcVat().toLocaleString("nb-NO")} kr</span>
          </div>
          <div className="no-review-total grand">
            <span>Total</span>
            <span>
              {(calcSubtotal() + calcVat()).toLocaleString("nb-NO")} kr
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 5 ────────────────────────────────────────────────────────────────────

  function renderStep5() {
    const PAYMENT_METHODS: Array<{
      id: PaymentMethod;
      label: string;
      desc: string;
      extra?: React.ReactNode;
    }> = [
      {
        id: "value-card",
        label: "Value card",
        desc: "Pay by using your prepaid value card balance",
        extra: (
          <span className="no-balance-badge">
            Current balance on value card: 42 500 kr
          </span>
        ),
      },
      {
        id: "card",
        label: "Card payment",
        desc: "Pay securely with your debit og credit card",
      },
      {
        id: "invoice",
        label: "Invoice",
        desc: "Receive an invoice whi 30 days due date",
      },
    ];

    return (
      <div className="no-step5-layout">
        <div className="no-step5-main">
          <div className="no-section-card">
            <h2 className="no-section-title">Payment method</h2>
            <div className="no-payment-list">
              {PAYMENT_METHODS.map((pm) => {
                const sel = form.paymentMethod === pm.id;
                return (
                  <div
                    key={pm.id}
                    className={`no-payment-item${sel ? " selected" : ""}`}
                    onClick={() =>
                      setForm((f) => ({ ...f, paymentMethod: pm.id }))
                    }
                  >
                    <div className="no-payment-row">
                      <div className="no-payment-text">
                        <span className="no-payment-label">{pm.label}</span>
                        <span className="no-payment-desc">{pm.desc}</span>
                        {pm.extra}
                      </div>
                      <span
                        className={`no-radio${sel ? " selected" : ""}`}
                      ></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {renderOrderSummary()}
      </div>
    );
  }

  // ── Order summary sidebar ─────────────────────────────────────────────────────

  function renderOrderSummary() {
    const pkg = PACKAGES.find((p) => p.id === form.selectedPackage);
    const selChannels = CHANNELS.filter((c) =>
      form.selectedChannels.includes(c.id),
    );
    const selAddons = ADDONS.filter((a) => form.selectedAddons.includes(a.id));
    const subtotal = calcSubtotal();
    const vat = calcVat();

    return (
      <aside className="no-order-summary">
        <h3 className="no-summary-title">Order summary</h3>

        {pkg && <p className="no-summary-pkg">{pkg.label}</p>}

        {pkg && (
          <div className="no-summary-row">
            <span>{pkg.label}</span>
            <span>{pkg.price.toLocaleString("nb-NO")} kr</span>
          </div>
        )}

        {(selChannels.length > 0 || form.planType === "package") && (
          <>
            <p className="no-summary-section-label">Channels:</p>
            {form.planType === "package" && selChannels.length === 0 ? (
              <div className="no-summary-row muted">
                <span>Included in package</span>
                <span>0 kr</span>
              </div>
            ) : (
              selChannels.map((ch) => (
                <div key={ch.id} className="no-summary-row">
                  <span className="no-summary-channel">
                    <span
                      className="no-summary-dot"
                      style={{
                        background: ch.bg === "#f1f4f8" ? "#4285F4" : ch.bg,
                      }}
                    ></span>
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
          </>
        )}

        {selAddons.length > 0 && (
          <>
            <p className="no-summary-section-label">Add-ons:</p>
            {selAddons.map((a) => (
              <div key={a.id} className="no-summary-row">
                <span className="no-summary-channel">
                  <span
                    className="no-summary-dot"
                    style={{ background: a.color }}
                  ></span>
                  {a.label}
                </span>
                <span>{a.price.toLocaleString("nb-NO")} kr</span>
              </div>
            ))}
          </>
        )}

        {subtotal > 0 && (
          <>
            <div className="no-summary-row vat">
              <span>VAT (25%)</span>
              <span>{vat.toLocaleString("nb-NO")} kr</span>
            </div>
            <hr className="no-summary-divider" />
            <div className="no-summary-row total">
              <span>Total</span>
              <span>{(subtotal + vat).toLocaleString("nb-NO")} kr</span>
            </div>
          </>
        )}
      </aside>
    );
  }

  // ── Confirmation modal ────────────────────────────────────────────────────────

  function renderConfirmationModal() {
    return (
      <div
        className="no-modal-overlay"
        onClick={() => setShowConfirmation(false)}
      >
        <div className="no-modal" onClick={(e) => e.stopPropagation()}>
          <button
            className="no-modal-close"
            onClick={() => setShowConfirmation(false)}
          >
            ✕
          </button>
          <div className="no-modal-icon">
            <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
              <circle
                cx="34"
                cy="34"
                r="32"
                stroke="#bef853"
                strokeWidth="3"
                fill="none"
              />
              <path
                d="M22 34l9 9 16-18"
                stroke="#bef853"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="no-modal-title">Order confirmed</h2>
          <p className="no-modal-text">
            Your campaign order has been successfully placed.
            <br />
            Our team will recieve your details and get started right away.
            <br />
            You'll receive a confirmation email shortly.
          </p>
          <button
            className="no-btn-primary no-modal-cta"
            onClick={() => {
              setShowConfirmation(false);
              onNavigate("my-orders");
            }}
          >
            View your order
          </button>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  const STEP_META: Record<Step, { title: string; subtitle: string }> = {
    1: { title: "New Order", subtitle: "Choose your campaign setup" },
    2: {
      title: "Customize your package plan",
      subtitle: "Choose your desired channels and add ons",
    },
    3: {
      title: "Campaign details",
      subtitle:
        "Help us understand your campaign goals and audience so we can deliver the best possible results",
    },
    4: {
      title: "Review your order",
      subtitle: "Check everything looks right before proceeding to payment",
    },
    5: { title: "Payment", subtitle: "Select your preferred payment method" },
  };

  const { title, subtitle } = STEP_META[step];
  const progress = STEP_PROGRESS[step];

  return (
    <div className="no-layout">
      <Sidebar activePage="new-order" onNavigate={onNavigate} />

      <div className="no-main">
        {/* Page header */}
        <h1 className="no-page-title">{title}</h1>
        <p className="no-page-subtitle">{subtitle}</p>

        {/* Progress bar */}
        <div className="no-progress-wrap">
          <div className="no-step-pill" style={{ left: `${progress}%` }}>
            Step {step}
          </div>
          <div className="no-progress-bar">
            <div
              className="no-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step content */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}

        {/* Bottom nav */}
        {step > 1 && (
          <div className="no-bottom-nav">
            <button className="no-btn-back" onClick={back}>
              &lsaquo; {step === 5 ? "Back to review" : "Back"}
            </button>
            {step < 5 ? (
              <button className="no-btn-primary" onClick={next}>
                Continue &rarr;
              </button>
            ) : (
              <button
                className="no-btn-primary"
                onClick={() => setShowConfirmation(true)}
              >
                Place order
              </button>
            )}
          </div>
        )}
      </div>

      {showConfirmation && renderConfirmationModal()}
    </div>
  );
}
