import { useState, useEffect } from "react";
import { useAuth } from "../../../../context";
import api from "../../../../api/axios";

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

  useEffect(() => {
    if (user?.company?.id) {
      api
        .get(`/companies/${user.company.id}/users`)
        .then(({ data }) => setUsers(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleRemove = async (userId: string) => {
    if (!user?.company?.id) return;
    try {
      await api.delete(`/companies/${user.company.id}/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      // TODO: show error toast
    }
  };

  const getInitials = (u: CompanyUser) =>
    `${u.firstName.charAt(0)}${u.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="settings-card">
      <div className="settings-card__header">
        <div className="settings-card__title-group">
          <h4>Users access</h4>
          <p className="body-3 text-muted">Manage who has access to your company account</p>
        </div>
        {/* TODO: implement add user flow */}
        <button className="btn-primary" disabled>
          + Add user
        </button>
      </div>

      {loading ? (
        <p className="body-3 text-muted">Loading...</p>
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
                  onClick={() => handleRemove(u.id)}
                >
                  Remove user
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
