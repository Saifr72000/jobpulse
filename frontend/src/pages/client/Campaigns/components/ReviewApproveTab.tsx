import { useState, useEffect, useRef } from "react";
import { patchOrderStatus, type IOrder } from "../../../../api/orders";
import {
  getCreativesByOrder,
  approveCreative,
  type ICreative,
} from "../../../../api/creatives";
import {
  getCommentsByOrder,
  postComment,
  type IComment,
} from "../../../../api/comments";
import Icon from "../../../../components/Icon/Icon";
import { CreativePreview } from "./CreativePreview";
import ClockIcon from "../../../../assets/icons/clock.svg?react";
import SendIcon from "../../../../assets/icons/send.svg?react";
import CheckWhiteIcon from "../../../../assets/icons/check-white.svg?react";
import "./ReviewApproveTab.scss";

interface ReviewApproveTabProps {
  order: IOrder;
  onOrderUpdated?: (order: IOrder) => void;
}

function authorInitials(firstName: string, lastName: string) {
  const a = firstName?.charAt(0) ?? "";
  const b = lastName?.charAt(0) ?? "";
  return `${a}${b}`.toUpperCase() || "?";
}

function formatCommentTime(iso: string) {
  return new Date(iso).toLocaleString("nb-NO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ReviewApproveTab({
  order,
  onOrderUpdated,
}: ReviewApproveTabProps) {
  const [creatives, setCreatives] = useState<ICreative[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [comments, setComments] = useState<IComment[]>([]);
  const [feedback, setFeedback] = useState("");
  const [loadingCreatives, setLoadingCreatives] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [approving, setApproving] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoadingCreatives(true);
    getCreativesByOrder(order._id)
      .then((data) => {
        setCreatives(data);
        setActiveIndex(0);
      })
      .finally(() => setLoadingCreatives(false));
  }, [order._id]);

  useEffect(() => {
    setLoadingComments(true);
    getCommentsByOrder(order._id)
      .then((res) => setComments(res.comments))
      .finally(() => setLoadingComments(false));
  }, [order._id]);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [comments]);

  const activeCreative: ICreative | undefined = creatives[activeIndex];
  const isCompleted = order.status === "completed";
  const awaitingPayment = order.status === "awaiting-payment";
  /** Live campaign: no client approval UI */
  const isCampaignActive = order.status === "active";

  const handleSendFeedback = async () => {
    if (awaitingPayment) return;
    const trimmed = feedback.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    try {
      const newComment = await postComment(order._id, trimmed, "client");
      setComments((prev) => [...prev, newComment]);
      setFeedback("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (awaitingPayment || isCampaignActive) return;
    if (approving) return;
    setApproving(true);
    try {
      if (activeCreative?.status === "pending") {
        const updated = await approveCreative(activeCreative._id);
        setCreatives((prev) =>
          prev.map((c) => (c._id === updated._id ? updated : c)),
        );
        return;
      }
      if (order.status === "pending" && onOrderUpdated) {
        const updatedOrder = await patchOrderStatus(order._id, "in-progress");
        onOrderUpdated(updatedOrder);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApproving(false);
    }
  };

  const clientApproved =
    activeCreative?.status === "approved" ||
    (order.status !== "pending" && order.status !== "awaiting-payment");

  const waitingCopy = awaitingPayment
    ? "Payment is required before you can approve this campaign or send feedback."
    : clientApproved
      ? "Campaign approved."
      : "Waiting for your review. Approve or request changes on new version";

  return (
    <div className="review-approve-tab">
      {awaitingPayment && (
        <div className="review-awaiting-payment-alert" role="alert">
          <strong>Awaiting payment</strong>
          <p>
            This campaign is on hold until payment is completed. Finish checkout
            (or use the payment method you chose when ordering) before reviewing
            or approving.
          </p>
        </div>
      )}

      <div className="review-layout">
      <div className="creative-area">
        {loadingCreatives ? (
          <div className="creative-placeholder">
            <span>Loading...</span>
          </div>
        ) : (
          <CreativePreview
            creative={activeCreative ?? null}
            order={order}
            showMeta={false}
          />
        )}

        {creatives.length > 1 && (
          <div className="dots" role="tablist" aria-label="Creative versions">
            {creatives.map((c, i) => (
              <button
                key={c._id}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                className={`dot${i === activeIndex ? " active" : ""}`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="feedback-panel card">
        <h2 className="feedback-panel__title">Feedback</h2>

        {!isCompleted && !isCampaignActive && (
          <div
            className={`review-status-banner${awaitingPayment ? " review-status-banner--warning" : ""}`}
            role="status"
          >
            <Icon svg={ClockIcon} size={20} />
            <span>{waitingCopy}</span>
          </div>
        )}

        <div className="comment-thread" ref={threadRef}>
          {loadingComments ? (
            <p className="comment-thread__empty">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="comment-thread__empty">No messages yet.</p>
          ) : (
            comments.map((c) => (
              <div key={c._id} className={`comment comment--${c.role}`}>
                <div className="comment__avatar" aria-hidden>
                  {authorInitials(c.author.firstName, c.author.lastName)}
                </div>
                <div className="comment__body">
                  <p className="comment__meta">
                    <span className="comment__name">
                      {c.author.firstName} {c.author.lastName}
                    </span>
                    <span className="comment__time">
                      {formatCommentTime(c.createdAt)}
                    </span>
                  </p>
                  <p className="comment__message">{c.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {!isCompleted && (
          <>
            <textarea
              className="feedback-textarea"
              placeholder="Write your feedback on the campaign..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={submitting || awaitingPayment}
              rows={4}
            />

            <button
              type="button"
              className="btn-send"
              onClick={handleSendFeedback}
              disabled={submitting || !feedback.trim() || awaitingPayment}
            >
              <Icon svg={SendIcon} size={18} />
              {submitting ? "Sending..." : "Send feedback"}
            </button>

            {!isCampaignActive && (
              <>
                <button
                  type="button"
                  className="btn-approve"
                  onClick={handleApprove}
                  disabled={approving || awaitingPayment}
                >
                  <Icon svg={CheckWhiteIcon} size={18} />
                  {approving ? "Approving..." : "Approve campaign"}
                </button>

                {clientApproved && (
                  <div className="approved-notice">Campaign approved</div>
                )}
              </>
            )}
          </>
        )}

        {isCompleted && (
          <p className="completed-notice">This campaign has been completed.</p>
        )}
      </div>
      </div>
    </div>
  );
}
