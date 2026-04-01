import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import api from "../api/axios";
import { createCheckoutSession } from "../api/checkout";
import {
  calculateSubtotal,
  calculateVat,
  buildLineItems,
  canContinueStep2,
} from "../pages/client/NewCampaign/utils";
import type {
  Step,
  FormState,
  Product,
} from "../pages/client/NewCampaign/types";

const INITIAL_FORM: FormState = {
  planType: null,
  selectedPackage: null,
  selectedChannels: [],
  selectedAddons: [],
  campaignName: "",
  imageOption: "",
  imageUploadFiles: [],
  selectedImageMediaIds: [],
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
};

interface NewCampaignContextValue {
  step: Step;
  next: () => void;
  back: () => void;
  canContinue: boolean;
  form: FormState;
  updateForm: (updates: Partial<FormState>) => void;
  channels: Product[];
  packages: Product[];
  addons: Product[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
  submitError: string | null;
  handleSubmit: () => Promise<void>;
  showSuccess: boolean;
  setShowSuccess: (v: boolean) => void;
}

const NewCampaignContext = createContext<NewCampaignContextValue | undefined>(
  undefined,
);

export function NewCampaignProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<Step>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [channels, setChannels] = useState<Product[]>([]);
  const [packages, setPackages] = useState<Product[]>([]);
  const [addons, setAddons] = useState<Product[]>([]);

  const [form, setForm] = useState<FormState>(INITIAL_FORM);

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
      } catch {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const updateForm = (updates: Partial<FormState>) =>
    setForm((prev) => ({ ...prev, ...updates }));

  const next = () => {
    if (step < 4) setStep((s) => (s + 1) as Step);
  };

  const back = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const subtotal = calculateSubtotal(form, channels, packages, addons);
      const vatRate = 0.25;
      const vatAmount = calculateVat(subtotal);
      const totalAmount = subtotal + vatAmount;
      const lineItems = buildLineItems(form, channels, packages, addons);

      const body = {
        orderType: form.planType ?? "custom",
        package: form.selectedPackage ?? undefined,
        channels: form.selectedChannels,
        addons: form.selectedAddons,
        lineItems,
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
        subtotal,
        vatRate,
        vatAmount,
        totalAmount,
      };
      if (form.paymentMethod === "card-payment") {
        const { url } = await createCheckoutSession(body);
        window.location.href = url;
      } else {
        await api.post("/orders", body);
        setShowSuccess(true);
      }
    } catch {
      setSubmitError("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <NewCampaignContext.Provider
      value={{
        step,
        next,
        back,
        canContinue: step === 2 ? canContinueStep2(form) : true,
        form,
        updateForm,
        channels,
        packages,
        addons,
        loading,
        error,
        submitting,
        submitError,
        handleSubmit,
        showSuccess,
        setShowSuccess,
      }}
    >
      {children}
    </NewCampaignContext.Provider>
  );
}

export function useNewCampaign() {
  const ctx = useContext(NewCampaignContext);
  if (!ctx)
    throw new Error("useNewCampaign must be used within NewCampaignProvider");
  return ctx;
}
