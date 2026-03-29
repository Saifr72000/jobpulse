import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import Icon from "../../../components/Icon/Icon";
import { Loader } from "../../../components/Loader/Loader";
import type { Step, FormState, Product } from "./types";

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
import { calculateSubtotal, calculateVat, canContinueStep2 } from "./utils";
import { Step1SelectPlan } from "./steps/Step1SelectPlan";
import { Step2CustomizePackage } from "./steps/Step2CustomizePackage";
import { Step3CampaignDetails } from "./steps/Step3CampaignDetails";
import { Step4Payment } from "./steps/Step4Payment";
import { SuccessModal } from "./components/SuccessModal";
import BoxIcon from "../../../assets/icons/box.svg?react";
import StarIcon from "../../../assets/icons/star.svg?react";
import DiamondIcon from "../../../assets/icons/diamond.svg?react";
import FileIcon from "../../../assets/icons/file.svg?react";
import VideoIcon from "../../../assets/icons/video.svg?react";
import BriefcaseIcon from "../../../assets/icons/briefcase.svg?react";
import GiftIcon from "../../../assets/icons/gift.svg?react";
import CardIcon from "../../../assets/icons/card.svg?react";
import InvoiceIcon from "../../../assets/icons/invoice.svg?react";
import { colorPrimary, ash } from "../../../styles/colors.ts";
import "./NewCampaign.scss";

export default function NewCampaign() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [channels, setChannels] = useState<Product[]>([]);
  const [packages, setPackages] = useState<Product[]>([]);
  const [addons, setAddons] = useState<Product[]>([]);

  const [form, setForm] = useState<FormState>({
    planType: null,
    selectedPackage: null,
    selectedChannels: [],
    selectedAddons: [],
    campaignName: "",
    imageOption: "",
    imageUploadFiles: [],
    selectedImageMediaId: "",
    leadAdDesc: "",
    leadAdDescText: "",
    videoMaterials: "",
    videoUploadFiles: [],
    selectedVideoMediaIds: [],
    linkedinJobDesc: "",
    linkedinJobDescText: "",
    linkedinScreening: "",
    linkedinScreeningText: "",
    targetAudience: "",
    additionalNotes: "",
    paymentMethod: "value-card",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [channelsRes, packagesRes, addonsRes] = await Promise.all([
          api.get("/products/type/service"),
          api.get("/products/type/package"),
          api.get("/products/type/addon"),
        ]);
        setChannels(channelsRes.data);
        setPackages(packagesRes.data);
        setAddons(addonsRes.data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const updateForm = (updates: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const next = () => {
    if (step < 4) setStep((s) => (s + 1) as Step);
  };
  const back = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const subtotal = calculateSubtotal(form, channels, packages, addons);
      const vat = calculateVat(subtotal);
      const body = {
        orderType: form.planType ?? "custom",
        package: form.selectedPackage ?? undefined,
        channels: form.selectedChannels,
        addons: form.selectedAddons,
        campaignName: form.campaignName,
        assets: {
          imageOption: form.imageOption || "team-suggest",
          ...(form.selectedAddons.some((a) =>
            a.toLowerCase().includes("lead"),
          ) && {
            leadAdDescription: form.leadAdDesc || "team-create",
          }),
          ...(form.selectedAddons.some((a) =>
            a.toLowerCase().includes("video"),
          ) && {
            videoMaterials: form.videoMaterials || "upload",
          }),
          ...(form.selectedAddons.some((a) =>
            a.toLowerCase().includes("linkedin"),
          ) && {
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
      setShowSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  const PACKAGE_ICONS: Record<string, React.ReactNode> = {
    basic: <Icon svg={BoxIcon} size={15} color={colorPrimary} />,
    medium: <Icon svg={StarIcon} size={15} color={colorPrimary} />,
    deluxe: <Icon svg={DiamondIcon} size={15} color={colorPrimary} />,
  };

  const ADDON_ICONS: Record<string, React.ReactNode> = {
    "lead-ads": <Icon svg={FileIcon} size={15} color="white" />,
    "video-campaign": <Icon svg={VideoIcon} size={15} color="white" />,
    "linkedin-job-posting": (
      <Icon svg={BriefcaseIcon} size={15} color="white" />
    ),
  };

  const paymentMethodsConfig = [
    {
      id: "value-card" as const,
      label: "Value card",
      description: "Pay by using your prepaid value card balance",
      icon: <Icon svg={GiftIcon} size={20} color={ash} />,
      extra: (
        <span className="payment-card__balance-pill">
          Current balance on value card: <strong>42 500 kr</strong>
        </span>
      ),
    },
    {
      id: "card-payment" as const,
      label: "Card payment",
      description: "Pay securely with your debit or credit card",
      icon: <Icon svg={CardIcon} size={20} color={ash} />,
    },
    {
      id: "invoice" as const,
      label: "Invoice",
      description: "Receive an invoice with 30 days due date",
      icon: <Icon svg={InvoiceIcon} size={20} color={ash} />,
    },
  ];


  const { title, subtitle } = loading
    ? { title: "New Campaign", subtitle: "" }
    : STEP_META[step];
  const progress = loading ? 0 : STEP_PROGRESS[step];


  return (
    <div className="new-order">
      <div className="page-header">
        <h2>{title}</h2>
        {subtitle && <p className="subheading">{subtitle}</p>}
      </div>

      <div className="step-indicator">
        {([1, 2, 3, 4] as Step[]).map((stepNum, index) => (
          <Fragment key={stepNum}>
            <div className={`step-indicator__dot${stepNum <= step ? " step-indicator__dot--active" : ""}`}>
              <span>{stepNum}</span>
            </div>
            {index < 3 && (
              <div className={`step-indicator__line${step > stepNum ? " step-indicator__line--active" : ""}`} />
            )}
          </Fragment>
        ))}
      </div>

      {loading && <Loader />}

      {error && <p className="body-3 text-muted">{error}</p>}

      {!loading && !error && (
        <>
          {step === 1 && (
            <Step1SelectPlan
              form={form}
              channels={channels}
              packages={packages}
              packageIcons={PACKAGE_ICONS}
              onFormChange={updateForm}
              onNext={next}
            />
          )}
          {step === 2 && (
            <Step2CustomizePackage
              form={form}
              channels={channels}
              packages={packages}
              addons={addons}
              addonIcons={ADDON_ICONS}
              onFormChange={updateForm}
            />
          )}
          {step === 3 && (
            <Step3CampaignDetails form={form} onFormChange={updateForm} />
          )}
          {step === 4 && (
            <Step4Payment
              form={form}
              channels={channels}
              packages={packages}
              addons={addons}
              paymentMethodsConfig={paymentMethodsConfig}
              onFormChange={updateForm}
            />
          )}

          {step > 1 && (
            <div className="step-nav">
              <button className="step-nav__back" onClick={back}>
                {step === 4 ? "← Back to review" : "← Back"}
              </button>
              {step < 4 ? (
                <button
                  className="step-nav__continue"
                  onClick={next}
                  disabled={step === 2 && !canContinueStep2(form)}
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
        </>
      )}

      <SuccessModal
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        onNavigate={() => navigate("/campaigns")}
      />
    </div>
  );
}
