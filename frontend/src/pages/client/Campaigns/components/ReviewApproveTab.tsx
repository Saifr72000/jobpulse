import { useState, useEffect, useRef } from "react";
import type { IOrder } from "../../../../api/orders";
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
import { CreativePreview } from "./CreativePreview";
import "./ReviewApproveTab.scss";

interface ReviewApproveTabProps {
  order: IOrder;
}

export function ReviewApproveTab({ order }: ReviewApproveTabProps) {
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

  // Scroll comment thread to bottom when new comments arrive
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [comments]);

  const activeCreative: ICreative | undefined = creatives[activeIndex];
  const isCompleted = order.status === "completed";

  const handleSendFeedback = async () => {
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
    if (!activeCreative || approving) return;
    setApproving(true);
    try {
      const updated = await approveCreative(activeCreative._id);
      setCreatives((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      );
    } finally {
      setApproving(false);
    }
  };

  const statusLabel = activeCreative?.status === "approved" ? "Approved" : "Waiting for your review";
  const statusClass = activeCreative?.status === "approved" ? "status-pill status-pill--approved" : "status-pill";

  return (
    <div className="review-layout">
      {/* Left: Creative preview */}
      <div className="creative-area">
        {creatives.length > 0 && (
          <div className="creative-area__header">
            <div className="version-btns">
              {creatives.map((c, i) => (
                <button
                  key={c._id}
                  type="button"
                  className={`version-btn${i === activeIndex ? " active" : ""}`}
                  onClick={() => setActiveIndex(i)}
                >
                  V{i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {loadingCreatives ? (
          <div className="creative-placeholder"><span>Loading...</span></div>
        ) : activeCreative ? (
          <CreativePreview creative={activeCreative} />
        ) : (
          <div className="creative-placeholder">
            <span>No creative uploaded yet — check back soon</span>
          </div>
        )}

        {creatives.length > 1 && (
          <div className="dots">
            {creatives.map((c, i) => (
              <span
                key={c._id}
                className={`dot${i === activeIndex ? " active" : ""}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right: Feedback panel */}
      <div className="feedback-panel card">
        <div className={statusClass}>{statusLabel}</div>

        {/* Comment thread */}
        {(loadingComments || comments.length > 0) && (
          <div className="comment-thread" ref={threadRef}>
            {loadingComments ? (
              <p className="comment-thread__empty">Loading comments...</p>
            ) : (
              comments.map((c) => (
                <div
                  key={c._id}
                  className={`comment comment--${c.role}`}
                >
                  <p className="comment__author">
                    {c.author.firstName} {c.author.lastName}
                    <span className="comment__role">{c.role}</span>
                  </p>
                  <p className="comment__message">{c.message}</p>
                </div>
              ))
            )}
          </div>
        )}

        {!isCompleted && (
          <>
            <div className="feedback-section">
              <p className="feedback-label">Your feedback</p>
              <textarea
                className="feedback-textarea"
                placeholder="Write your feedback on the campaign..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                disabled={submitting}
              />
            </div>

            <button
              type="button"
              className="btn-send"
              onClick={handleSendFeedback}
              disabled={submitting || !feedback.trim()}
            >
              {submitting ? "Sending..." : "Send feedback"}
            </button>

            {activeCreative && activeCreative.status !== "approved" && (
              <button
                type="button"
                className="btn-approve"
                onClick={handleApprove}
                disabled={approving}
              >
                {approving ? "Approving..." : "Approve campaign"}
              </button>
            )}

            {activeCreative?.status === "approved" && (
              <div className="approved-notice">Campaign approved</div>
            )}
          </>
        )}

        {isCompleted && (
          <p className="completed-notice">This campaign has been completed.</p>
        )}
      </div>
    </div>
  );
}
