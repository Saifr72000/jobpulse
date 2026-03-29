import { useState, useEffect } from "react";
import { useAuth } from "../../../../context";
import api from "../../../../api/axios";
import { AddUserModal } from "../modals/AddUserModal";
import { Loader } from "../../../../components/Loader/Loader";

interface CompanyUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export function UsersTab() {
  const { user } = useAuth();
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userToRemove, setUserToRemove] = useState<CompanyUser | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    if (user?.company?.id) {
      setLoading(true);
      try {
        const { data } = await api.get(`/companies/${user.company.id}/users`);
        setUsers(data.map((u: any) => ({ ...u, id: u._id ?? u.id })));
      } catch (error) {
        console.error("Failed to fetch users:", error);
        // TODO: show error toast
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const handleRemoveClick = (userToRemove: CompanyUser) => {
    setUserToRemove(userToRemove);
  };

  const handleConfirmRemove = async () => {
    if (!user?.company?.id || !userToRemove) return;

    try {
      await api.delete(
        `/companies/${user.company.id}/users/${userToRemove.id}`,
      );
      setUsers((prev) => prev.filter((u) => u.id !== userToRemove.id));
      setUserToRemove(null);
      // TODO: show success toast
    } catch (error) {
      console.error("Failed to remove user:", error);
      // TODO: show error toast
    }
  };

  const handleCancelRemove = () => {
    setUserToRemove(null);
  };

  const handleAddUserSuccess = () => {
    fetchUsers();
  };

  const getInitials = (u: CompanyUser) =>
    `${u.firstName.charAt(0)}${u.lastName.charAt(0)}`.toUpperCase();

  return (
    <>
      <div className="settings-card">
        <div className="settings-card__header">
          <div className="settings-card__title-group">
            <h4>Users access</h4>
            <p className="body-3 text-muted">
              Manage who has access to your company account
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            + Add user
          </button>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="users-list">
            {users.length === 0 && (
              <p className="body-3 text-muted">No users found.</p>
            )}
            {users.map((u) => (
              <div key={u.id} className="users-list__row">
                <div className="users-list__avatar">
                  <span className="body-3">{getInitials(u)}</span>
                </div>
                <div className="users-list__info">
                  <span className="body-2">
                    {u.firstName} {u.lastName}
                  </span>
                  <span className="body-3 text-muted">{u.email}</span>
                </div>
                {u.id !== user?.id && (
                  <button
                    className="btn-danger-outline"
                    onClick={() => handleRemoveClick(u)}
                  >
                    Remove user
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && user?.company?.id && (
        <AddUserModal
          companyId={user.company.id}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddUserSuccess}
        />
      )}

      {userToRemove && (
        <div className="modal-overlay" onClick={handleCancelRemove}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <div>
                <h3>Remove user</h3>
                <p className="body-3 text-muted">
                  Are you sure you want to remove {userToRemove.firstName}{" "}
                  {userToRemove.lastName}?
                </p>
              </div>
              <button
                className="modal__close h4"
                onClick={handleCancelRemove}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button className="btn-primary" onClick={handleCancelRemove}>
                Cancel
              </button>
              <button
                className="btn-danger-outline"
                onClick={handleConfirmRemove}
              >
                Remove user
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
