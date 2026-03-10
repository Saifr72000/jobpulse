import { useNavigate, useParams } from "react-router-dom";
import { allOrders, statusConfig, addonLabels, paymentLabels, formatNOK } from "../../../data/orders";
import type { OrderStatus, UploadedFile } from "../../../data/orders";

const STATUS_STEPS: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

function FileChip({ file }: { file: UploadedFile }) {
  const extColors: Record<string, string> = {
    pdf: "#ef4444", jpg: "#f59e0b", png: "#10b981", mp4: "#6366f1", docx: "#3b82f6",
  };
  return (
    <div className="flex items-center gap-3 border border-[#e5e7eb] rounded-xl p-3">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
        style={{ background: extColors[file.ext] ?? "#9ca3af" }}
      >
        {file.ext.toUpperCase()}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-medium text-black truncate">{file.name}</span>
        <span className="text-xs text-text-muted">{file.size}</span>
      </div>
      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-background hover:bg-border transition-colors border-0 cursor-pointer shrink-0" aria-label="Download">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 2v7m0 0L4.5 6.5M7 9l2.5-2.5M2 12h10" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

function ChoiceTag({ label }: { label: string }) {
  return <span className="inline-flex items-center px-3 py-1 bg-background text-text text-xs rounded-full">{label}</span>;
}

function Tag({ label, muted }: { label: string; muted?: boolean }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs rounded-full ${muted ? "bg-background text-[#9ca3af]" : "bg-background text-text"}`}>
      {label}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-text-muted font-medium uppercase tracking-wide mb-1">{children}</p>;
}

function TextBlock({ text }: { text: string }) {
  return <p className="text-sm text-text leading-relaxed">{text}</p>;
}

function StatusTracker({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6">
        <div className="flex items-center gap-3 text-[#9ca3af]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.25" stroke="#9ca3af" strokeWidth="1.5" />
            <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-sm">This order was cancelled</span>
        </div>
      </div>
    );
  }

  const currentIdx = STATUS_STEPS.indexOf(status);

  return (
    <div className="bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6">
      <div className="flex items-center">
        {STATUS_STEPS.map((s, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    isDone ? "bg-black text-white" : isCurrent ? "bg-black text-white ring-4 ring-black/10" : "bg-background text-[#9ca3af]"
                  }`}
                >
                  {isDone ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span className={`text-xs whitespace-nowrap ${isCurrent ? "font-medium text-black" : "text-text-muted"}`}>
                  {statusConfig[s].label}
                </span>
              </div>
              {idx < STATUS_STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 mb-5 ${isDone ? "bg-black" : "bg-[#e5e7eb]"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const order = allOrders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted">Order not found.</div>
    );
  }

  const sc = statusConfig[order.status];
  const hasLeadAd = order.addons.includes("lead-ad");
  const hasVideo = order.addons.includes("video-production");
  const hasLinkedIn = order.addons.includes("linkedin-job-posting");

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto">

      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <button
            className="flex items-center gap-1.5 text-sm text-text hover:text-black transition-colors border-0 bg-transparent cursor-pointer shrink-0"
            onClick={() => navigate("/orders")}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="#424241" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Orders
          </button>
          <div className="flex flex-col min-w-0">
            <h1 className="text-2xl font-bold text-black truncate">{order.campaignName}</h1>
            <span className="text-xs text-text-muted">{order.id}</span>
          </div>
        </div>
      </header>

      {/* Status Tracker */}
      <StatusTracker status={order.status} />

      {/* Main Grid */}
      <div className="flex gap-6 items-start">
        {/* Left Column */}
        <div className="flex-2 min-w-0 flex flex-col gap-6">

          {/* Campaign Overview */}
          <div className="bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-black">Campaign Overview</h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${sc.cls}`}>{sc.label}</span>
            </div>
            <p className="text-lg font-semibold text-black mb-4">{order.campaignName}</p>

            <div className="flex flex-col gap-4">
              <div>
                <SectionLabel>Plan</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  <Tag label={order.planType === "package" ? `${order.packageName} Package` : "Custom Plan"} />
                </div>
              </div>
              <div>
                <SectionLabel>Channels</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {order.channels.map((ch) => <Tag key={ch} label={ch} />)}
                </div>
              </div>
              {order.addons.length > 0 && (
                <div>
                  <SectionLabel>Add-ons</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {order.addons.map((a) => <Tag key={a} label={addonLabels[a]} />)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Assets & Media */}
          <div className="bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6">
            <h2 className="text-xl font-bold text-black mb-4">Assets & Media</h2>
            <div className="flex flex-col gap-5">
              <div>
                <SectionLabel>Campaign image</SectionLabel>
                {order.campaignImageChoice === "upload" && order.campaignImageFile ? (
                  <FileChip file={order.campaignImageFile} />
                ) : order.campaignImageChoice === "media-library" ? (
                  <ChoiceTag label="From media library" />
                ) : (
                  <ChoiceTag label="Team to suggest image" />
                )}
              </div>

              {order.applicationUrl && (
                <div>
                  <SectionLabel>Application URL</SectionLabel>
                  <a href={order.applicationUrl} className="text-sm text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    {order.applicationUrl}
                  </a>
                </div>
              )}

              {hasLeadAd && (
                <div className="border-t border-background pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <rect x="1" y="1" width="10" height="10" rx="2" stroke="#6b7280" strokeWidth="1.4" />
                      <path d="M4 6h4M6 4v4" stroke="#6b7280" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                    <span className="text-xs font-medium text-text-muted">Lead Ad</span>
                  </div>
                  <SectionLabel>Job description</SectionLabel>
                  {order.leadAdJDChoice === "team-creates" ? (
                    <ChoiceTag label="Team to create job description" />
                  ) : order.leadAdJDFile ? (
                    <FileChip file={order.leadAdJDFile} />
                  ) : order.leadAdJDContent ? (
                    <TextBlock text={order.leadAdJDContent} />
                  ) : null}
                </div>
              )}

              {hasVideo && (
                <div className="border-t border-background pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1.5 3.5h6a1 1 0 011 1v3a1 1 0 01-1 1h-6a1 1 0 01-1-1v-3a1 1 0 011-1z" stroke="#6b7280" strokeWidth="1.4" />
                      <path d="M8.5 5.2l2.5-1.5v4.6L8.5 6.8" stroke="#6b7280" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xs font-medium text-text-muted">Video Production</span>
                  </div>
                  <SectionLabel>Materials sourcing</SectionLabel>
                  {order.videoMaterialsChoice === "team-selects" ? (
                    <ChoiceTag label="Team to select from media library" />
                  ) : order.videoMaterialsChoice === "combine" ? (
                    <div className="flex flex-col gap-2">
                      <ChoiceTag label="Client uploads + team media library" />
                      {order.videoFiles?.map((f) => <FileChip key={f.name} file={f} />)}
                    </div>
                  ) : (
                    order.videoFiles?.map((f) => <FileChip key={f.name} file={f} />)
                  )}
                </div>
              )}

              {hasLinkedIn && (
                <div className="border-t border-background pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <rect x="1" y="1" width="10" height="10" rx="2" stroke="#6b7280" strokeWidth="1.4" />
                      <path d="M3.5 5v3M3.5 3.5v.01M5.5 8V6a1 1 0 012 0v2M5.5 6.5h2" stroke="#6b7280" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                    <span className="text-xs font-medium text-text-muted">LinkedIn Job Posting</span>
                  </div>
                  <SectionLabel>Job description</SectionLabel>
                  {order.linkedinJDChoice === "team-creates" ? (
                    <ChoiceTag label="Team to create job description" />
                  ) : order.linkedinJDContent ? (
                    <TextBlock text={order.linkedinJDContent} />
                  ) : null}
                  <div className="mt-3">
                    <SectionLabel>Screening questions</SectionLabel>
                    {order.screeningChoice === "team-creates" ? (
                      <ChoiceTag label="Team to create screening questions" />
                    ) : order.screeningQuestions ? (
                      <ol className="list-decimal list-inside text-sm text-text flex flex-col gap-1">
                        {order.screeningQuestions.map((q, i) => <li key={i}>{q}</li>)}
                      </ol>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Campaign Brief */}
          <div className="bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6">
            <h2 className="text-xl font-bold text-black mb-4">Campaign Brief</h2>
            <div className="flex flex-col gap-4">
              <div>
                <SectionLabel>Target audience</SectionLabel>
                <TextBlock text={order.targetAudience} />
              </div>
              {order.additionalNotes && (
                <div>
                  <SectionLabel>Additional notes</SectionLabel>
                  <TextBlock text={order.additionalNotes} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">

          {/* Order Summary */}
          <div className="bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6">
            <h2 className="text-xl font-bold text-black mb-4">Order Summary</h2>
            <div className="flex flex-col gap-2">
              {order.basePrice > 0 && (
                <div className="flex justify-between text-sm text-text">
                  <span>{order.packageName} Package</span>
                  <span>{formatNOK(order.basePrice)}</span>
                </div>
              )}
              {order.channelPrices.map((cp) => (
                <div key={cp.name} className="flex justify-between text-sm text-text pl-3">
                  <span>{cp.name}</span>
                  {cp.included ? <span className="text-[#9ca3af]">Included</span> : <span>{formatNOK(cp.price)}</span>}
                </div>
              ))}
              {order.addonPrices.map((ap) => (
                <div key={ap.name} className="flex justify-between text-sm text-text">
                  <span>{ap.name}</span>
                  <span>{formatNOK(ap.price)}</span>
                </div>
              ))}
              <div className="border-t border-[#e5e7eb] my-1" />
              <div className="flex justify-between text-sm text-text">
                <span>Subtotal</span><span>{formatNOK(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-text">
                <span>VAT (25%)</span><span>{formatNOK(order.vat)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-black border-t border-[#e5e7eb] pt-2 mt-1">
                <span>Total</span><span>{formatNOK(order.rawAmount)}</span>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-6">
            <h2 className="text-xl font-bold text-black mb-4">Order Details</h2>
            <div className="flex flex-col gap-3">
              {[
                { label: "Client", value: order.client },
                { label: "Ordered by", value: order.orderedBy },
                { label: "Date", value: order.date },
                { label: "Payment", value: paymentLabels[order.paymentMethod] },
                { label: "Order ID", value: order.id, mono: true },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4">
                  <span className="text-xs text-text-muted">{row.label}</span>
                  <span className={`text-sm text-black text-right ${row.mono ? "font-mono text-xs" : ""}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
