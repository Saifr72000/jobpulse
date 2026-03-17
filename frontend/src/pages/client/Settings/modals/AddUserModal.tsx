import { useState } from "react";
import InputField from "../../../../components/InputField/InputField";
import api from "../../../../api/axios";

interface AddUserModalProps {
  companyId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddUserModal({ companyId, onClose, onSuccess }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post(`/companies/${companyId}/users`, formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      const message = err.response?.data?.error || err.response?.data?.message || "Failed to add user";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <div>
            <h3>Add user</h3>
            <p className="body-3 text-muted">
              Invite a new user to join your company
            </p>
          </div>
          <button className="modal__close h4" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal__card-form">
          <InputField
            label="First name"
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            disabled={loading}
          />
          <InputField
            label="Last name"
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            disabled={loading}
          />
          <InputField
            label="Email address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={loading}
          />
        </div>

        {error && (
          <p className="body-3" style={{ color: "var(--red)" }}>
            {error}
          </p>
        )}

        <button
          className="btn-midnight"
          onClick={handleSubmit}
          disabled={loading || !formData.firstName || !formData.lastName || !formData.email}
        >
          {loading ? "Adding user..." : "Add user"}
        </button>
      </div>
    </div>
  );
}
