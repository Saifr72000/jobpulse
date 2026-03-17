import { useState, useEffect } from "react";
import { useAuth } from "../../../../context";
import InputField from "../../../../components/InputField/InputField";
import api from "../../../../api/axios";

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface CompanyForm {
  name: string;
  orgNumber: string;
  phone: string;
  website: string;
  address: string;
}

export function ProfileTab() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<ProfileForm>({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: "",
  });

  const [passwords, setPasswords] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [company, setCompany] = useState<CompanyForm>({
    name: user?.company?.name ?? "",
    orgNumber: "",
    phone: "",
    website: "",
    address: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingCompany, setSavingCompany] = useState(false);

  useEffect(() => {
    if (user?.company?.id) {
      api
        .get(`/companies/${user.company.id}`)
        .then(({ data }) => {
          setCompany({
            name: data.name ?? "",
            orgNumber: data.orgNumber ?? "",
            phone: data.phone ?? "",
            website: data.website ?? "",
            address: data.address ?? "",
          });
        })
        .catch(() => {});
    }
  }, [user]);

  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await api.put("/users/me", {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
      });
    } catch {
      // TODO: show error toast
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveCompany = async () => {
    if (!user?.company?.id) return;
    setSavingCompany(true);
    try {
      await api.put(`/companies/${user.company.id}`, company);
    } catch {
      // TODO: show error toast
    } finally {
      setSavingCompany(false);
    }
  };

  return (
    <>
      {/* Profile Information */}
      <div className="settings-card">
        <div className="settings-card__header">
          <div className="settings-card__title-group">
            <h4>Profile information</h4>
            <p className="body-3 text-muted">Update your personal details and profile picture</p>
          </div>
        </div>

        <div className="profile-avatar">
          <div className="profile-avatar__circle">
            <span className="body-2">{initials}</span>
          </div>
        </div>

        <div className="settings-form">
          <div className="settings-form__grid">
            <InputField
              label="First name"
              type="text"
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            />
            <InputField
              label="Last name"
              type="text"
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            />
            <InputField
              label="Email address"
              type="email"
              value={profile.email}
              disabled
            />
            <InputField
              label="Phone number"
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>

          <div className="settings-form__divider">
            <h4>Password</h4>
            <p className="body-3 text-muted">
              Update your password regularly to keep your account safe
            </p>
          </div>

          <div className="settings-form__grid">
            <div className="settings-form__full">
              <InputField
                label="Current password"
                type="password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, currentPassword: e.target.value })
                }
              />
            </div>
            <InputField
              label="New password"
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            />
            <InputField
              label="Confirm new password"
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
            />
          </div>
        </div>

        <div className="settings-card__actions">
          <button className="btn-primary" onClick={handleSaveProfile} disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      {/* Company Details */}
      <div className="settings-card">
        <div className="settings-card__header">
          <div className="settings-card__title-group">
            <h4>Company details</h4>
            <p className="body-3 text-muted">Information about your organization</p>
          </div>
        </div>

        <div className="settings-form">
          <div className="settings-form__grid">
            <InputField
              label="Company name"
              type="text"
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
            />
            <InputField
              label="Organization number"
              type="text"
              value={company.orgNumber}
              onChange={(e) => setCompany({ ...company, orgNumber: e.target.value })}
            />
            <InputField
              label="Phone number"
              type="tel"
              value={company.phone}
              onChange={(e) => setCompany({ ...company, phone: e.target.value })}
            />
            <InputField
              label="Website"
              type="url"
              value={company.website}
              onChange={(e) => setCompany({ ...company, website: e.target.value })}
            />
            <div className="settings-form__full">
              <InputField
                label="Address"
                type="text"
                value={company.address}
                onChange={(e) => setCompany({ ...company, address: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="settings-card__actions">
          <button className="btn-primary" onClick={handleSaveCompany} disabled={savingCompany}>
            {savingCompany ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      {/* Delete Account */}
      <div className="settings-card settings-card--danger">
        <div className="settings-card__header">
          <div className="settings-card__title-group">
            <h4 className="settings-card__title-danger">Delete account</h4>
            <p className="body-3 text-muted">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="settings-card__actions">
          <button className="btn-danger-outline" disabled>
            Delete account
          </button>
        </div>
      </div>
    </>
  );
}
