import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const IconBox = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="1" width="16" height="16" rx="3" stroke="#424241" strokeWidth="1.5" fill="none" />
    <rect x="4" y="4" width="4" height="4" rx="1" fill="#424241" />
    <rect x="10" y="4" width="4" height="4" rx="1" fill="#d0d0d0" />
    <rect x="4" y="10" width="4" height="4" rx="1" fill="#d0d0d0" />
    <rect x="10" y="10" width="4" height="4" rx="1" fill="#d0d0d0" />
  </svg>
);

const IconStar = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 2l1.8 4.6 4.9.4-3.7 3.2 1.1 4.8L9 12.4l-4.1 2.6 1.1-4.8L2.3 7l4.9-.4L9 2z" fill="#424241" />
  </svg>
);

const IconCrown = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2 14h14v2H2zM2 12l3-7 4 4 4-6 3 9H2z" fill="#424241" />
  </svg>
);

const CHANNELS = [
  { id: "linkedin", label: "LinkedIn", description: "Professional network targeting", bg: "#0A66C2", color: "#fff", abbr: "in" },
  { id: "facebook", label: "Facebook", description: "Broad audience reach", bg: "#1877F2", color: "#fff", abbr: "f" },
  { id: "google", label: "Google", description: "Broad audience reach", bg: "#f1f4f8", color: "#424241", abbr: "G" },
  { id: "snapchat", label: "Snapchat", description: "Reaching gen Z and young adults", bg: "#FFFC00", color: "#1a1a1a", abbr: "S" },
  { id: "instagram", label: "Instagram", description: "Visual storytelling", bg: "#E1306C", color: "#fff", abbr: "IG" },
  { id: "x", label: "X", description: "Real time engagement", bg: "#000", color: "#fff", abbr: "X" },
];

const PACKAGES = [
  {
    id: "basic" as PackageId,
    label: "Basic package",
    Icon: IconBox,
    features: ["Choose up to 3 channels", "14 day campaign period", "50% ad spend included", "Full performance analytics", "Ongoing optimalization"],
    price: 8000,
    popular: false,
  },
  {
    id: "medium" as PackageId,
    label: "Medium package",
    Icon: IconStar,
    features: ["Choose up to 5 channels", "14 day campaign period", "50% ad spend included", "Full performance analytics", "Ongoing optimalization"],
    price: 15000,
    popular: true,
  },
  {
    id: "deluxe" as PackageId,
    label: "Deluxe package",
    Icon: IconCrown,
    features: ["Choose up to 7 channels", "14 day campaign period", "50% ad spend included", "Full performance analytics", "Ongoing optimalization"],
    price: 25000,
    popular: false,
  },
];

const ADDONS = [
  { id: "lead-ads", label: "Lead Ads", description: "Collect applications directly in the ad. No landing page needed", price: 2500, color: "#52c41a" },
  { id: "video-campaign", label: "Video Campaign", description: "Engage candidates with dynamic video content across platforms", price: 3800, color: "#1677ff" },
  { id: "linkedin-job-posting", label: "LinkedIn Job posting", description: "Official job listing on LinkedIn's job board with applicant tracking", price: 4200, color: "#0A66C2" },
  { id: "image-ad-production", label: "Image ad production", description: "Create professionally designed static ad visuals for your campaign", price: 3800, color: "#52c41a" },
  { id: "upload-own-image", label: "Upload your own image", description: "Use your own image and choose between direct publishing or professional review", price: 3800, color: "#1677ff" },
  { id: "upload-own-video", label: "Upload your own video", description: "Use your own video content with optional review before publishing", price: 3800, color: "#0A66C2" },
  { id: "creative-review", label: "Creative review & approval", description: "Ensure your uploaded content meets platform and quality standards", price: 500, color: "#52c41a" },
  { id: "extended-distribution", label: "Extended distribution", description: "Expand campaign reach by activating additional distribution channels", price: 3800, color: "#1677ff" },
  { id: "website-publishing", label: "Website publishing", description: "Publish campaign content directly on your company website", price: 4200, color: "#0A66C2" },
];

const CHANNEL_PRICES: Record<string, number> = {
  linkedin: 12600, facebook: 8900, google: 8900, snapchat: 8900, instagram: 8900, x: 8900,
};

const STEP_PROGRESS: Record<Step, number> = { 1: 20, 2: 40, 3: 60, 4: 80, 5: 100 };

const STEP_META: Record<Step, { title: string; subtitle: string }> = {
  1: { title: "New Order", subtitle: "Choose your campaign setup" },
  2: { title: "Customize your package plan", subtitle: "Choose your desired channels and add ons" },
  3: { title: "Campaign details", subtitle: "Help us understand your campaign goals and audience so we can deliver the best possible results" },
  4: { title: "Review your order", subtitle: "Check everything looks right before proceeding to payment" },
  5: { title: "Payment", subtitle: "Select your preferred payment method" },
};

export default function NewOrder() {
  const navigate = useNavigate();
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

  function calcPackagePrice() {
    if (form.planType === "package" && form.selectedPackage)
      return PACKAGES.find((p) => p.id === form.selectedPackage)?.price ?? 0;
    return 0;
  }
  function calcChannelCost() {
    if (form.planType === "package") return 0;
    return form.selectedChannels.reduce((s, id) => s + (CHANNEL_PRICES[id] ?? 0), 0);
  }
  function calcAddonsCost() {
    return form.selectedAddons.reduce((s, id) => s + (ADDONS.find((a) => a.id === id)?.price ?? 0), 0);
  }
  function calcSubtotal() { return calcPackagePrice() + calcChannelCost() + calcAddonsCost(); }
  function calcVat() { return Math.round(calcSubtotal() * 0.25); }

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
    setForm((f) => ({ ...f, planType: "package", selectedPackage: id, selectedChannels: [] }));
  }

  const next = () => step < 5 && setStep((s) => (s + 1) as Step);
  const back = () => step > 1 && setStep((s) => (s - 1) as Step);

  function ChannelItem({ ch, checked, onToggle }: { ch: (typeof CHANNELS)[0]; checked: boolean; onToggle: () => void }) {
    return (
      <div
        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${checked ? "border-black bg-[#f9f9f9]" : "border-[#e5e7eb] hover:border-black"}`}
        onClick={onToggle}
      >
        <span
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: ch.bg, color: ch.color, border: ch.bg === "#f1f4f8" ? "1px solid #ddd" : "none" }}
        >
          {ch.abbr}
        </span>
        <span className="flex flex-col flex-1 min-w-0">
          <span className="text-sm font-medium text-black">{ch.label}</span>
          <span className="text-xs text-text-muted">{ch.description}</span>
        </span>
        <span className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 text-xs ${checked ? "bg-black border-black text-white" : "border-[#d0d0d0]"}`}>
          {checked && "✓"}
        </span>
      </div>
    );
  }

  function renderStep1() {
    const pkg = form.selectedPackage ? PACKAGES.find((p) => p.id === form.selectedPackage) : null;
    const hasSelection = pkg !== null || (form.planType === "custom" && form.selectedChannels.length > 0);

    return (
      <div className="flex flex-col gap-6">
        <div className="flex gap-6">
          {/* Custom Plan */}
          <div className="flex-1 bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6">
            <h2 className="text-2xl font-bold text-black">Custom made plan</h2>
            <p className="text-base text-text mt-1">Choose your prefered channels for your campaign:</p>
            <div className="flex flex-col gap-2 mt-4">
              {CHANNELS.map((ch) => (
                <ChannelItem
                  key={ch.id}
                  ch={ch}
                  checked={form.planType === "custom" && form.selectedChannels.includes(ch.id)}
                  onToggle={() => setForm((f) => ({
                    ...f,
                    planType: "custom",
                    selectedPackage: null,
                    selectedChannels: f.selectedChannels.includes(ch.id)
                      ? f.selectedChannels.filter((c) => c !== ch.id)
                      : [...f.selectedChannels, ch.id],
                  }))}
                />
              ))}
            </div>
          </div>

          {/* Package Plan */}
          <div className="flex-1 bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6">
            <h2 className="text-2xl font-bold text-black">Package plan</h2>
            <p className="text-base text-text mt-1">Reach more candidates with bundeled channel packages:</p>
            <div className="flex flex-col gap-3 mt-4">
              {PACKAGES.map((p) => {
                const selected = form.selectedPackage === p.id;
                const Icon = p.Icon;
                return (
                  <div
                    key={p.id as string}
                    className={`relative border rounded-xl p-4 cursor-pointer transition-colors ${selected ? "border-black" : "border-[#e5e7eb] hover:border-black"}`}
                    onClick={() => selectPackage(p.id)}
                  >
                    {p.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#bef853] text-black text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap">
                        ✦ Most popular
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="shrink-0"><Icon /></span>
                      <span className="text-sm font-medium text-black flex-1">{p.label}</span>
                      <span className={`w-5 h-5 rounded-full border-2 shrink-0 ${selected ? "bg-black border-black" : "border-[#d0d0d0]"}`} />
                    </div>
                    <ul className="mt-3 flex flex-col gap-1">
                      {p.features.map((f) => (
                        <li key={f} className="text-xs text-text flex items-center gap-2">
                          <span className="text-black font-bold">✓</span>{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {hasSelection && (
          <div className="flex justify-end">
            <button className="bg-black text-white rounded-[40px] px-7 py-3 text-base font-bold cursor-pointer transition-colors hover:bg-[#333] border-0" onClick={next}>
              {pkg ? `Continue with ${pkg.label.toLowerCase()}` : "Continue with custom plan"} →
            </button>
          </div>
        )}
      </div>
    );
  }

  function renderStep2() {
    return (
      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <div className="bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6">
            <h2 className="text-2xl font-bold text-black">Select channels</h2>
            <p className="text-base text-text mt-1">Choose your prefered channels for your campaign</p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {CHANNELS.map((ch) => (
                <ChannelItem key={ch.id} ch={ch} checked={form.selectedChannels.includes(ch.id)} onToggle={() => toggleChannel(ch.id)} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6">
            <h2 className="text-2xl font-bold text-black">Campaign add-ons</h2>
            <p className="text-base text-text mt-1">Boost your campaigns with optional add ons to increase your reach</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {ADDONS.map((addon) => {
                const checked = form.selectedAddons.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    className={`border rounded-xl p-4 cursor-pointer transition-colors flex flex-col gap-2 ${checked ? "border-black" : "border-[#e5e7eb] hover:border-black"}`}
                    onClick={() => toggleAddon(addon.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ background: addon.color }} />
                      <span className="text-sm font-medium text-black flex-1">{addon.label}</span>
                      <span className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 text-xs ${checked ? "bg-black border-black text-white" : "border-[#d0d0d0]"}`}>
                        {checked && "✓"}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted">{addon.description}</p>
                    <p className="text-xs font-medium text-black">{addon.price.toLocaleString("nb-NO")} kr</p>
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

  function renderStep3() {
    const logoOpts = [
      { value: "media-library" as const, label: "Already uploaded in media library" },
      { value: "upload" as const, label: "Upload logo now" },
    ];
    const guideOpts = [
      { value: "media-library" as const, label: "Already uploaded in media library" },
      { value: "upload" as const, label: "Upload brand guide now" },
      { value: "none" as const, label: "We don't have brand guidelines" },
    ];

    return (
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6">
          <h2 className="text-2xl font-bold text-black">Campaign name</h2>
          <p className="text-base text-text mt-1">Give your campaign a memorable name</p>
          <input
            className="mt-4 w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-sm text-black placeholder-[#9ca3af] focus:outline-none focus:border-black transition-colors"
            type="text"
            placeholder="E.g., Summer 2026 hiring campaign"
            value={form.campaignName}
            onChange={(e) => setForm((f) => ({ ...f, campaignName: e.target.value }))}
          />
        </div>

        <div className="bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6">
          <h2 className="text-2xl font-bold text-black">Brand assets</h2>
          <p className="text-base text-text mt-1">Help us stay on-brand with your visual identity</p>

          <h3 className="text-base font-semibold text-black mt-5">Company logo</h3>
          <div className="flex flex-col gap-2 mt-2">
            {logoOpts.map((opt) => (
              <div
                key={opt.value}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${form.logoOption === opt.value ? "border-black" : "border-[#e5e7eb] hover:border-black"}`}
                onClick={() => setForm((f) => ({ ...f, logoOption: opt.value }))}
              >
                <span className={`w-5 h-5 rounded-full border-2 shrink-0 ${form.logoOption === opt.value ? "bg-black border-black" : "border-[#d0d0d0]"}`} />
                <span className="text-sm text-black">{opt.label}</span>
              </div>
            ))}
          </div>

          <h3 className="text-base font-semibold text-black mt-5">Brand guidelines</h3>
          <div className="flex flex-col gap-2 mt-2">
            {guideOpts.map((opt) => (
              <div
                key={opt.value}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${form.brandGuidelinesOption === opt.value ? "border-black" : "border-[#e5e7eb] hover:border-black"}`}
                onClick={() => setForm((f) => ({ ...f, brandGuidelinesOption: opt.value }))}
              >
                <span className={`w-5 h-5 rounded-full border-2 shrink-0 ${form.brandGuidelinesOption === opt.value ? "bg-black border-black" : "border-[#d0d0d0]"}`} />
                <span className="text-sm text-black">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6">
          <h2 className="text-2xl font-bold text-black">Target audience</h2>
          <p className="text-base text-text mt-1">Describe who you want to reach with this campaign.</p>
          <textarea
            className="mt-4 w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-sm text-black placeholder-[#9ca3af] focus:outline-none focus:border-black transition-colors resize-none"
            placeholder="E.g., We are looking for qualified child welfare professionals with experience in case management..."
            value={form.targetAudience}
            onChange={(e) => setForm((f) => ({ ...f, targetAudience: e.target.value }))}
            rows={5}
          />
        </div>

        <div className="bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6">
          <h2 className="text-2xl font-bold text-black">Additional notes</h2>
          <p className="text-base text-text mt-1">Anything else we should know?</p>
          <textarea
            className="mt-4 w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-sm text-black placeholder-[#9ca3af] focus:outline-none focus:border-black transition-colors resize-none"
            placeholder="E.g., Key selling points, specific messaging you'd like included, deadlines..."
            value={form.additionalNotes}
            onChange={(e) => setForm((f) => ({ ...f, additionalNotes: e.target.value }))}
            rows={4}
          />
        </div>
      </div>
    );
  }

  function renderStep4() {
    const pkg = PACKAGES.find((p) => p.id === form.selectedPackage);
    const selectedChannels = CHANNELS.filter((c) => form.selectedChannels.includes(c.id));
    const selectedAddons = ADDONS.filter((a) => form.selectedAddons.includes(a.id));

    return (
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6">
          <h2 className="text-2xl font-bold text-black">Plan</h2>
          {form.planType === "package" && pkg ? (
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-black">{pkg.label}</span>
              <span className="text-sm font-medium text-black">{pkg.price.toLocaleString("nb-NO")} kr</span>
            </div>
          ) : (
            <p className="text-sm text-[#9ca3af] mt-3">Custom plan</p>
          )}
        </div>

        <div className="bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6">
          <h2 className="text-2xl font-bold text-black">Channels</h2>
          {selectedChannels.length === 0 ? (
            <p className="text-sm text-[#9ca3af] mt-3">Included in package</p>
          ) : (
            <div className="flex flex-col gap-2 mt-3">
              {selectedChannels.map((ch) => (
                <div key={ch.id} className="flex items-center justify-between">
                  <span className="text-sm text-black">{ch.label}</span>
                  <span className="text-sm font-medium text-black">{(CHANNEL_PRICES[ch.id] ?? 0).toLocaleString("nb-NO")} kr</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6">
          <h2 className="text-2xl font-bold text-black">Add-ons</h2>
          {selectedAddons.length === 0 ? (
            <p className="text-sm text-[#9ca3af] mt-3">No add-ons selected</p>
          ) : (
            <div className="flex flex-col gap-2 mt-3">
              {selectedAddons.map((a) => (
                <div key={a.id} className="flex items-center justify-between">
                  <span className="text-sm text-black">{a.label}</span>
                  <span className="text-sm font-medium text-black">{a.price.toLocaleString("nb-NO")} kr</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {form.campaignName && (
          <div className="bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-black">Campaign details</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Campaign name</span>
              <span className="text-sm text-black">{form.campaignName}</span>
            </div>
            {form.targetAudience && (
              <div className="flex flex-col gap-1">
                <p className="text-sm text-text-muted">Target audience</p>
                <p className="text-sm text-black">{form.targetAudience}</p>
              </div>
            )}
            {form.additionalNotes && (
              <div className="flex flex-col gap-1">
                <p className="text-sm text-text-muted">Additional notes</p>
                <p className="text-sm text-black">{form.additionalNotes}</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm text-text">
            <span>Subtotal</span><span>{calcSubtotal().toLocaleString("nb-NO")} kr</span>
          </div>
          <div className="flex items-center justify-between text-sm text-text">
            <span>VAT (25%)</span><span>{calcVat().toLocaleString("nb-NO")} kr</span>
          </div>
          <div className="flex items-center justify-between text-base font-bold text-black border-t border-[#e5e7eb] pt-3">
            <span>Total</span><span>{(calcSubtotal() + calcVat()).toLocaleString("nb-NO")} kr</span>
          </div>
        </div>
      </div>
    );
  }

  function renderStep5() {
    const PAYMENT_METHODS: Array<{ id: PaymentMethod; label: string; desc: string; extra?: React.ReactNode }> = [
      {
        id: "value-card",
        label: "Value card",
        desc: "Pay by using your prepaid value card balance",
        extra: <span className="text-sm text-text bg-background px-3 py-1 rounded-lg mt-2 inline-block">Current balance on value card: 42 500 kr</span>,
      },
      { id: "card", label: "Card payment", desc: "Pay securely with your debit og credit card" },
      { id: "invoice", label: "Invoice", desc: "Receive an invoice with 30 days due date" },
    ];

    return (
      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6">
            <h2 className="text-2xl font-bold text-black">Payment method</h2>
            <div className="flex flex-col gap-3 mt-4">
              {PAYMENT_METHODS.map((pm) => {
                const sel = form.paymentMethod === pm.id;
                return (
                  <div
                    key={pm.id}
                    className={`border rounded-xl p-4 cursor-pointer transition-colors ${sel ? "border-black" : "border-[#e5e7eb] hover:border-black"}`}
                    onClick={() => setForm((f) => ({ ...f, paymentMethod: pm.id }))}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-black">{pm.label}</p>
                        <p className="text-xs text-text-muted mt-0.5">{pm.desc}</p>
                        {pm.extra}
                      </div>
                      <span className={`w-5 h-5 rounded-full border-2 shrink-0 ${sel ? "bg-black border-black" : "border-[#d0d0d0]"}`} />
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

  function renderOrderSummary() {
    const pkg = PACKAGES.find((p) => p.id === form.selectedPackage);
    const selChannels = CHANNELS.filter((c) => form.selectedChannels.includes(c.id));
    const selAddons = ADDONS.filter((a) => form.selectedAddons.includes(a.id));
    const subtotal = calcSubtotal();
    const vat = calcVat();

    return (
      <aside className="w-72 shrink-0 bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6 self-start sticky top-0">
        <h3 className="text-lg font-bold text-black">Order summary</h3>

        {pkg && <p className="text-sm text-text-muted mt-2">{pkg.label}</p>}
        {pkg && (
          <div className="flex justify-between text-sm text-black mt-1">
            <span>{pkg.label}</span>
            <span>{pkg.price.toLocaleString("nb-NO")} kr</span>
          </div>
        )}

        {(selChannels.length > 0 || form.planType === "package") && (
          <div className="mt-3">
            <p className="text-xs text-text-muted font-medium uppercase tracking-wide mb-1">Channels:</p>
            {form.planType === "package" && selChannels.length === 0 ? (
              <div className="flex justify-between text-sm text-[#9ca3af]">
                <span>Included in package</span><span>0 kr</span>
              </div>
            ) : (
              selChannels.map((ch) => (
                <div key={ch.id} className="flex justify-between text-sm text-black">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: ch.bg === "#f1f4f8" ? "#4285F4" : ch.bg }} />
                    {ch.label}
                  </span>
                  <span>{form.planType === "package" ? "0 kr" : `${(CHANNEL_PRICES[ch.id] ?? 0).toLocaleString("nb-NO")} kr`}</span>
                </div>
              ))
            )}
          </div>
        )}

        {selAddons.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-text-muted font-medium uppercase tracking-wide mb-1">Add-ons:</p>
            {selAddons.map((a) => (
              <div key={a.id} className="flex justify-between text-sm text-black">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                  {a.label}
                </span>
                <span>{a.price.toLocaleString("nb-NO")} kr</span>
              </div>
            ))}
          </div>
        )}

        {subtotal > 0 && (
          <div className="mt-3 flex flex-col gap-1 border-t border-[#e5e7eb] pt-3">
            <div className="flex justify-between text-sm text-text">
              <span>VAT (25%)</span><span>{vat.toLocaleString("nb-NO")} kr</span>
            </div>
            <div className="flex justify-between text-base font-bold text-black">
              <span>Total</span><span>{(subtotal + vat).toLocaleString("nb-NO")} kr</span>
            </div>
          </div>
        )}
      </aside>
    );
  }

  function renderConfirmationModal() {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowConfirmation(false)}>
        <div className="bg-white rounded-[20px] p-8 max-w-md w-full mx-4 relative flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
          <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-text-muted hover:text-black transition-colors border-0 bg-transparent cursor-pointer" onClick={() => setShowConfirmation(false)}>
            ✕
          </button>
          <div>
            <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
              <circle cx="34" cy="34" r="32" stroke="#bef853" strokeWidth="3" fill="none" />
              <path d="M22 34l9 9 16-18" stroke="#bef853" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-black">Order confirmed</h2>
          <p className="text-base text-text text-center">
            Your campaign order has been successfully placed.<br />
            Our team will recieve your details and get started right away.<br />
            You'll receive a confirmation email shortly.
          </p>
          <button
            className="bg-black text-white rounded-[40px] px-7 py-3 text-base font-bold cursor-pointer transition-colors hover:bg-[#333] border-0 w-full"
            onClick={() => { setShowConfirmation(false); navigate("/orders"); }}
          >
            View your order
          </button>
        </div>
      </div>
    );
  }

  const { title, subtitle } = STEP_META[step];
  const progress = STEP_PROGRESS[step];

  return (
    <div className="flex-1 min-w-0 overflow-y-auto flex flex-col gap-6">
        <div>
          <h1 className="text-[40px] font-bold text-black leading-tight">{title}</h1>
          <p className="text-[20px] text-text mt-1">{subtitle}</p>
        </div>

        {/* Progress bar */}
        <div className="relative pt-8">
          <div
            className="absolute top-0 transform -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded-full"
            style={{ left: `${progress}%` }}
          >
            Step {step}
          </div>
          <div className="h-2 bg-[#e5e7eb] rounded-full w-full">
            <div className="h-full bg-black rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}

        {step > 1 && (
          <div className="flex items-center justify-between mt-2">
            <button className="bg-white text-text border border-[#e5e7eb] rounded-[40px] px-7 py-3 text-base cursor-pointer transition-colors hover:bg-background" onClick={back}>
              ‹ {step === 5 ? "Back to review" : "Back"}
            </button>
            {step < 5 ? (
              <button className="bg-black text-white rounded-[40px] px-7 py-3 text-base font-bold cursor-pointer transition-colors hover:bg-[#333] border-0" onClick={next}>
                Continue →
              </button>
            ) : (
              <button className="bg-black text-white rounded-[40px] px-7 py-3 text-base font-bold cursor-pointer transition-colors hover:bg-[#333] border-0" onClick={() => setShowConfirmation(true)}>
                Place order
              </button>
            )}
          </div>
        )}

      {showConfirmation && renderConfirmationModal()}
    </div>
  );
}
