import { useState } from "react";
import type { IOrder } from "../../../../api/orders";
import "./ReviewApproveTab.scss";

interface ReviewApproveTabProps {
  order: IOrder;
}

const VERSIONS = ["V1", "V2", "V3"] as const;
type Version = (typeof VERSIONS)[number];

export function ReviewApproveTab({ order: _order }: ReviewApproveTabProps) {
  const [activeVersion, setActiveVersion] = useState<Version>("V1");
  const [feedback, setFeedback] = useState("");

  const activeIndex = VERSIONS.indexOf(activeVersion);

  return (
    <div className="review-layout">
      {/* Left: Creative preview */}
      <div className="creative-area">
        <div className="creative-area__header">
          <div className="version-btns">
            {VERSIONS.map((v) => (
              <button
                key={v}
                type="button"
                className={`version-btn${activeVersion === v ? " active" : ""}`}
                onClick={() => setActiveVersion(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="creative-placeholder">
          Creative preview will appear here
        </div>

        <div className="dots">
          {VERSIONS.map((v, i) => (
            <span
              key={v}
              className={`dot${i === activeIndex ? " active" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* Right: Feedback panel */}
      <div className="feedback-panel card">
        <div className="status-pill">Waiting for your review</div>

        <div className="feedback-section">
          <p className="feedback-label">Your feedback</p>
          <textarea
            className="feedback-textarea"
            placeholder="Write your feedback on the campaign..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <button type="button" className="btn-send">
          Send feedback
        </button>
        <button type="button" className="btn-approve">
          Approve campaign
        </button>
      </div>
    </div>
  );
}
