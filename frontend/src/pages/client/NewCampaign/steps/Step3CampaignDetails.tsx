import type {
  FormState,
  ImageOption,
  LeadAdDesc,
  VideoMaterials,
  LinkedinJobDesc,
  LinkedinScreening,
} from "../types";
import { RadioOption } from "../components/RadioOption";
import "./Step3CampaignDetails.scss";

interface Step3CampaignDetailsProps {
  form: FormState;
  onFormChange: (updates: Partial<FormState>) => void;
}

export function Step3CampaignDetails({
  form,
  onFormChange,
}: Step3CampaignDetailsProps) {
  const hasLeadAds = form.selectedAddons.some((a) =>
    a.toLowerCase().includes("lead"),
  );
  const hasVideo = form.selectedAddons.some((a) =>
    a.toLowerCase().includes("video"),
  );
  const hasLinkedinPosting = form.selectedAddons.some((a) =>
    a.toLowerCase().includes("linkedin"),
  );

  return (
    <div className="step3">
      <div className="order-card">
        <h4>Campaign name</h4>
        <p className="body-2">Give your campaign a memorable name</p>
        <input
          className="form-input"
          type="text"
          placeholder="E.g., Summer 2026 hiring campaign"
          value={form.campaignName}
          onChange={(e) => onFormChange({ campaignName: e.target.value })}
        />
      </div>

      <div className="order-card">
        <h4>Assets</h4>
        <p className="body-2">
          Help us gather the key information and materials needed to launch your
          campaign
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
                onFormChange({ imageOption: opt.value as ImageOption })
              }
            />
          ))}
        </div>

        {hasLeadAds && (
          <>
            <p className="body-2">
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
                    onFormChange({ leadAdDesc: opt.value as LeadAdDesc })
                  }
                />
              ))}
            </div>
          </>
        )}

        {hasVideo && (
          <>
            <p className="body-2">
              How would you like us to source materials for your video?
            </p>
            <div className="radio-group">
              {[
                { value: "upload", label: "Upload your own materials" },
                {
                  value: "media-library",
                  label: "Let our team select materials from our media library",
                },
                { value: "combine", label: "Combine both" },
              ].map((opt) => (
                <RadioOption
                  key={opt.value}
                  label={opt.label}
                  selected={form.videoMaterials === opt.value}
                  onClick={() =>
                    onFormChange({
                      videoMaterials: opt.value as VideoMaterials,
                    })
                  }
                />
              ))}
            </div>
          </>
        )}

        {hasLinkedinPosting && (
          <>
            <p className="body-2">
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
                    onFormChange({
                      linkedinJobDesc: opt.value as LinkedinJobDesc,
                    })
                  }
                />
              ))}
            </div>

            <p className="body-2">
              Do you have any screening questions for the LinkedIn job posting?
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
                    onFormChange({
                      linkedinScreening: opt.value as LinkedinScreening,
                    })
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="order-card">
        <h4>Target audience</h4>
        <p className="body-2">
          Describe who you want to reach with this campaign. Be as specific as
          possible about skills, experience level, location and any other
          relevant criteria
        </p>
        <textarea
          className="form-input"
          rows={6}
          placeholder="E.g., We are looking for qualified child welfare professionals with experience in case management and follow-up work with children and families..."
          value={form.targetAudience}
          onChange={(e) => onFormChange({ targetAudience: e.target.value })}
        />
      </div>

      <div className="order-card">
        <h4>Additional notes</h4>
        <p className="body-2">Anything else we should know?</p>
        <textarea
          className="form-input"
          rows={4}
          placeholder="E.g., Key selling points, specific messaging you'd like included, deadlines or any other context that would help us create better campaigns..."
          value={form.additionalNotes}
          onChange={(e) => onFormChange({ additionalNotes: e.target.value })}
        />
      </div>
    </div>
  );
}
