import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../../components/Loader/Loader";
import type { Step } from "./types";
import {
  NewCampaignProvider,
  useNewCampaign,
} from "../../../context/NewCampaignContext";
import { Step1SelectPlan } from "./steps/Step1SelectPlan";
import { Step2CustomizePackage } from "./steps/Step2CustomizePackage";
import { Step3CampaignDetails } from "./steps/Step3CampaignDetails";
import { Step4Payment } from "./steps/Step4Payment";
import { SuccessModal } from "./components/SuccessModal";
import "./NewCampaign.scss";

function NewCampaignInner() {
  const navigate = useNavigate();
  const {
    step,
    next,
    back,
    canContinue,
    loading,
    error,
    submitting,
    submitError,
    handleSubmit,
    showSuccess,
    setShowSuccess,
  } = useNewCampaign();

  const STEP_HEADER: Record<Step, { title: string; subtitle: string }> = {
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

  const { title, subtitle } = STEP_HEADER[step];

  return (
    <div className="new-order">
      <div className="page-header">
        <h2>{title}</h2>
        <p className="subheading">{subtitle}</p>
      </div>

      <div className="step-indicator">
        {([1, 2, 3, 4] as Step[]).map((stepNum, index) => (
          <Fragment key={stepNum}>
            <div
              className={`step-indicator__dot${stepNum <= step ? " step-indicator__dot--active" : ""}`}
            >
              <span>{stepNum}</span>
            </div>
            {index < 3 && (
              <div
                className={`step-indicator__line${step > stepNum ? " step-indicator__line--active" : ""}`}
              />
            )}
          </Fragment>
        ))}
      </div>

      {loading && <Loader />}

      {error && <p className="body-3 text-muted">{error}</p>}

      {!loading && !error && (
        <>
          {step === 1 && <Step1SelectPlan />}
          {step === 2 && <Step2CustomizePackage />}
          {step === 3 && <Step3CampaignDetails />}
          {step === 4 && <Step4Payment />}

          {step > 1 && (
            <div className="step-nav">
              <button className="step-nav__back" onClick={back}>
                {step === 4 ? "← Back to review" : "← Back"}
              </button>
              {step < 4 ? (
                <button
                  className="step-nav__continue"
                  onClick={next}
                  disabled={!canContinue}
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

          {submitError && <p className="body-3 text-muted">{submitError}</p>}
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

export default function NewCampaign() {
  return (
    <NewCampaignProvider>
      <NewCampaignInner />
    </NewCampaignProvider>
  );
}
