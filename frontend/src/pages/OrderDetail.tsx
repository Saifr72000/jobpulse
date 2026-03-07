import { Sidebar } from "../components/Sidebar";
import {
  allOrders,
  statusConfig,
  addonLabels,
  paymentLabels,
  formatNOK,
} from "../data/orders";
import type { OrderStatus, UploadedFile } from "../data/orders";
import "./OrderDetail.css";

const imgExpandArrow =
  "https://www.figma.com/api/mcp/asset/7e0bef5b-dc3c-477e-b67a-249b385d0a20";

const STATUS_STEPS: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
];

/* ── Small helpers ── */

function FileChip({ file }: { file: UploadedFile }) {
  const extColors: Record<string, string> = {
    pdf: "#ef4444",
    jpg: "#f59e0b",
    png: "#10b981",
    mp4: "#6366f1",
    docx: "#3b82f6",
  };
  return (
    <div className="od-file-chip">
      <div
        className="od-file-ext"
        style={{ background: extColors[file.ext] ?? "#9ca3af" }}
      >
        {file.ext.toUpperCase()}
      </div>
      <div className="od-file-info">
        <span className="od-file-name">{file.name}</span>
        <span className="od-file-size">{file.size}</span>
      </div>
      <button className="od-file-dl" aria-label="Download">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 2v7m0 0L4.5 6.5M7 9l2.5-2.5M2 12h10"
            stroke="#6b7280"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

function ChoiceTag({ label }: { label: string }) {
  return <span className="od-choice-tag">{label}</span>;
}

function Tag({ label, muted }: { label: string; muted?: boolean }) {
  return (
    <span className={`od-tag${muted ? " od-tag--muted" : ""}`}>{label}</span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="od-section-label">{children}</p>;
}

function TextBlock({ text }: { text: string }) {
  return <p className="od-text-block">{text}</p>;
}

/* ── Status tracker ── */

function StatusTracker({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="od-tracker-card">
        <div className="od-cancelled-notice">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.25" stroke="#9ca3af" strokeWidth="1.5" />
            <path
              d="M5.5 5.5l5 5M10.5 5.5l-5 5"
              stroke="#9ca3af"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span>This order was cancelled</span>
        </div>
      </div>
    );
  }

  const currentIdx = STATUS_STEPS.indexOf(status);

  return (
    <div className="od-tracker-card">
      <div className="od-tracker">
        {STATUS_STEPS.map((step, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div key={step} className="od-tracker-item">
              <div className="od-step-wrap">
                <div
                  className={`od-step-dot${isDone ? " od-step-dot--done" : ""}${isCurrent ? " od-step-dot--current" : ""}`}
                >
                  {isDone ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span
                  className={`od-step-label${isCurrent ? " od-step-label--current" : ""}`}
                >
                  {statusConfig[step].label}
                </span>
              </div>
              {idx < STATUS_STEPS.length - 1 && (
                <div
                  className={`od-step-line${isDone ? " od-step-line--done" : ""}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main page ── */

interface Props {
  orderId: string;
  onNavigate: (page: string) => void;
}

export default function OrderDetail({ orderId, onNavigate }: Props) {
  const order = allOrders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="od-page">
        <Sidebar activePage="my-orders" onNavigate={onNavigate} />
        <div className="od-content">
          <p style={{ padding: 40, color: "#9ca3af" }}>Order not found.</p>
        </div>
      </div>
    );
  }

  const sc = statusConfig[order.status];
  const hasLeadAd = order.addons.includes("lead-ad");
  const hasVideo = order.addons.includes("video-production");
  const hasLinkedIn = order.addons.includes("linkedin-job-posting");

  return (
    <div className="od-page">
      <Sidebar activePage="my-orders" onNavigate={onNavigate} />

      <div className="od-content">
        {/* Header */}
        <header className="od-header">
          <div className="od-header-left">
            <button
              className="od-back-btn"
              onClick={() => onNavigate("my-orders")}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M9 2L4 7l5 5"
                  stroke="#424241"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Orders
            </button>
            <div className="od-header-title">
              <h1 className="od-title">{order.campaignName}</h1>
              <span className="od-order-id-sub">{order.id}</span>
            </div>
          </div>
          <div className="od-user-profile">
            <div className="od-user-avatar">JD</div>
            <div className="od-user-info">
              <span className="od-user-name">John Doe</span>
              <span className="od-user-role">Customer</span>
            </div>
            <img src={imgExpandArrow} alt="" className="od-expand-arrow" />
          </div>
        </header>

        {/* Status tracker */}
        <StatusTracker status={order.status} />

        {/* Main grid */}
        <div className="od-grid">
          {/* ── Left column ── */}
          <div className="od-left-col">
            {/* Campaign overview */}
            <div className="od-card">
              <div className="od-card-head">
                <h2>Campaign Overview</h2>
                <span className={`od-status-badge ${sc.cls}`}>{sc.label}</span>
              </div>
              <div className="od-card-body">
                <div className="od-overview-name">{order.campaignName}</div>

                <div className="od-overview-row">
                  <SectionLabel>Plan</SectionLabel>
                  <div className="od-tags-row">
                    <Tag
                      label={
                        order.planType === "package"
                          ? `${order.packageName} Package`
                          : "Custom Plan"
                      }
                    />
                  </div>
                </div>

                <div className="od-overview-row">
                  <SectionLabel>Channels</SectionLabel>
                  <div className="od-tags-row">
                    {order.channels.map((ch) => (
                      <Tag key={ch} label={ch} />
                    ))}
                  </div>
                </div>

                {order.addons.length > 0 && (
                  <div className="od-overview-row">
                    <SectionLabel>Add-ons</SectionLabel>
                    <div className="od-tags-row">
                      {order.addons.map((a) => (
                        <Tag key={a} label={addonLabels[a]} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Assets & Media */}
            <div className="od-card">
              <div className="od-card-head">
                <h2>Assets & Media</h2>
              </div>
              <div className="od-card-body od-assets-body">
                {/* Campaign image */}
                <div className="od-asset-section">
                  <SectionLabel>Campaign image</SectionLabel>
                  {order.campaignImageChoice === "upload" &&
                  order.campaignImageFile ? (
                    <FileChip file={order.campaignImageFile} />
                  ) : order.campaignImageChoice === "media-library" ? (
                    <ChoiceTag label="From media library" />
                  ) : (
                    <ChoiceTag label="Team to suggest image" />
                  )}
                </div>

                {/* Application URL */}
                {order.applicationUrl && (
                  <div className="od-asset-section">
                    <SectionLabel>Application URL</SectionLabel>
                    <a
                      href={order.applicationUrl}
                      className="od-url-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {order.applicationUrl}
                    </a>
                  </div>
                )}

                {/* Lead Ad */}
                {hasLeadAd && (
                  <div className="od-asset-section od-asset-section--addon">
                    <div className="od-addon-header">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <rect
                          x="1"
                          y="1"
                          width="10"
                          height="10"
                          rx="2"
                          stroke="#6b7280"
                          strokeWidth="1.4"
                        />
                        <path
                          d="M4 6h4M6 4v4"
                          stroke="#6b7280"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="od-addon-label">Lead Ad</span>
                    </div>
                    <SectionLabel>Job description</SectionLabel>
                    {order.leadAdJDChoice === "team-creates" ? (
                      <ChoiceTag label="Team to create job description" />
                    ) : order.leadAdJDFile ? (
                      <FileChip file={order.leadAdJDFile} />
                    ) : (
                      order.leadAdJDContent && (
                        <TextBlock text={order.leadAdJDContent} />
                      )
                    )}
                  </div>
                )}

                {/* Video Production */}
                {hasVideo && (
                  <div className="od-asset-section od-asset-section--addon">
                    <div className="od-addon-header">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M1.5 3.5h6a1 1 0 011 1v3a1 1 0 01-1 1h-6a1 1 0 01-1-1v-3a1 1 0 011-1z"
                          stroke="#6b7280"
                          strokeWidth="1.4"
                        />
                        <path
                          d="M8.5 5.2l2.5-1.5v4.6L8.5 6.8"
                          stroke="#6b7280"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="od-addon-label">Video Production</span>
                    </div>
                    <SectionLabel>Materials sourcing</SectionLabel>
                    {order.videoMaterialsChoice === "team-selects" ? (
                      <ChoiceTag label="Team to select from media library" />
                    ) : order.videoMaterialsChoice === "combine" ? (
                      <>
                        <ChoiceTag label="Client uploads + team media library" />
                        {order.videoFiles?.map((f) => (
                          <FileChip key={f.name} file={f} />
                        ))}
                      </>
                    ) : (
                      order.videoFiles?.map((f) => (
                        <FileChip key={f.name} file={f} />
                      ))
                    )}
                  </div>
                )}

                {/* LinkedIn Job Posting */}
                {hasLinkedIn && (
                  <div className="od-asset-section od-asset-section--addon">
                    <div className="od-addon-header">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <rect
                          x="1"
                          y="1"
                          width="10"
                          height="10"
                          rx="2"
                          stroke="#6b7280"
                          strokeWidth="1.4"
                        />
                        <path
                          d="M3.5 5v3M3.5 3.5v.01M5.5 8V6a1 1 0 012 0v2M5.5 6.5h2"
                          stroke="#6b7280"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="od-addon-label">
                        LinkedIn Job Posting
                      </span>
                    </div>

                    <SectionLabel>Job description</SectionLabel>
                    {order.linkedinJDChoice === "team-creates" ? (
                      <ChoiceTag label="Team to create job description" />
                    ) : (
                      order.linkedinJDContent && (
                        <TextBlock text={order.linkedinJDContent} />
                      )
                    )}

                    <SectionLabel>Screening questions</SectionLabel>
                    {order.screeningChoice === "team-creates" ? (
                      <ChoiceTag label="Team to create screening questions" />
                    ) : (
                      order.screeningQuestions && (
                        <ol className="od-questions-list">
                          {order.screeningQuestions.map((q, i) => (
                            <li key={i}>{q}</li>
                          ))}
                        </ol>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Campaign Brief */}
            <div className="od-card od-brief-card">
              <div className="od-card-head">
                <h2>Campaign Brief</h2>
              </div>
              <div className="od-card-body">
                <div className="od-brief-section">
                  <SectionLabel>Target audience</SectionLabel>
                  <TextBlock text={order.targetAudience} />
                </div>
                {order.additionalNotes && (
                  <div className="od-brief-section">
                    <SectionLabel>Additional notes</SectionLabel>
                    <TextBlock text={order.additionalNotes} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="od-right-col">
            {/* Order summary */}
            <div className="od-card od-summary-card">
              <div className="od-card-head">
                <h2>Order Summary</h2>
              </div>
              <div className="od-summary-lines">
                {order.basePrice > 0 && (
                  <div className="od-summary-line">
                    <span>
                      {order.packageName} Package
                    </span>
                    <span>{formatNOK(order.basePrice)}</span>
                  </div>
                )}
                {order.channelPrices.map((cp) => (
                  <div key={cp.name} className="od-summary-line od-summary-line--channel">
                    <span className="od-summary-channel-name">{cp.name}</span>
                    {cp.included ? (
                      <span className="od-summary-included">Included</span>
                    ) : (
                      <span>{formatNOK(cp.price)}</span>
                    )}
                  </div>
                ))}
                {order.addonPrices.map((ap) => (
                  <div key={ap.name} className="od-summary-line">
                    <span>{ap.name}</span>
                    <span>{formatNOK(ap.price)}</span>
                  </div>
                ))}
                <div className="od-summary-divider" />
                <div className="od-summary-line od-summary-line--sub">
                  <span>Subtotal</span>
                  <span>{formatNOK(order.subtotal)}</span>
                </div>
                <div className="od-summary-line od-summary-line--sub">
                  <span>VAT (25%)</span>
                  <span>{formatNOK(order.vat)}</span>
                </div>
                <div className="od-summary-total">
                  <span>Total</span>
                  <span>{formatNOK(order.rawAmount)}</span>
                </div>
              </div>
            </div>

            {/* Order details */}
            <div className="od-card od-meta-card">
              <div className="od-card-head">
                <h2>Order Details</h2>
              </div>
              <div className="od-meta-rows">
                <div className="od-meta-row">
                  <span className="od-meta-label">Client</span>
                  <span className="od-meta-value">{order.client}</span>
                </div>
                <div className="od-meta-row">
                  <span className="od-meta-label">Ordered by</span>
                  <span className="od-meta-value">{order.orderedBy}</span>
                </div>
                <div className="od-meta-row">
                  <span className="od-meta-label">Date</span>
                  <span className="od-meta-value">{order.date}</span>
                </div>
                <div className="od-meta-row">
                  <span className="od-meta-label">Payment</span>
                  <span className="od-meta-value">
                    {paymentLabels[order.paymentMethod]}
                  </span>
                </div>
                <div className="od-meta-row">
                  <span className="od-meta-label">Order ID</span>
                  <span className="od-meta-value od-meta-id">{order.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
