import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import {
  User,
  X,
  Check,
  Save,
  Palette,
  Briefcase,
  Mail,
  Sparkles
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

const colorThemes = [
  { name: 'Navy & Blue', gradient: 'linear-gradient(135deg, #003366 0%, #006699 100%)', text: '#FFFFFF' },
  { name: 'Teal & Emerald', gradient: 'linear-gradient(135deg, #0D9488 0%, #10B981 100%)', text: '#FFFFFF' },
  { name: 'Indigo & Violet', gradient: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', text: '#FFFFFF' },
  { name: 'Amber & Bronze', gradient: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)', text: '#FFFFFF' },
  { name: 'Slate & Graphite', gradient: 'linear-gradient(135deg, #334155 0%, #475569 100%)', text: '#FFFFFF' }
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile
}) => {
  const [name, setName] = useState(currentProfile.name);
  const [role, setRole] = useState(currentProfile.role);
  const [email, setEmail] = useState(currentProfile.email);
  const [initials, setInitials] = useState(currentProfile.initials);
  const [avatarColor, setAvatarColor] = useState(currentProfile.avatarColor || colorThemes[0].gradient);

  useEffect(() => {
    setName(currentProfile.name);
    setRole(currentProfile.role);
    setEmail(currentProfile.email);
    setInitials(currentProfile.initials);
    setAvatarColor(currentProfile.avatarColor || colorThemes[0].gradient);
  }, [currentProfile, isOpen]);

  if (!isOpen) return null;

  // Auto-generate initials when name changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    const parts = newName.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      setInitials(`${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase());
    } else if (parts.length === 1 && parts[0].length > 0) {
      setInitials(parts[0].slice(0, 2).toUpperCase());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveProfile({
      id: currentProfile.id || `usr-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Researcher',
      email: email.trim() || 'user@research.org',
      initials: initials.trim() || 'ME',
      avatarColor
    });
    onClose();
  };

  const applyPreset = (presetName: string, presetRole: string, presetEmail: string) => {
    setName(presetName);
    setRole(presetRole);
    setEmail(presetEmail);
    const parts = presetName.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      setInitials(`${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase());
    } else if (parts.length === 1) {
      setInitials(parts[0].slice(0, 2).toUpperCase());
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ width: '560px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="var(--primary-blue)" />
            <span style={{ fontWeight: 800, fontSize: '16px', color: 'var(--primary-navy)' }}>
              Customize Your Research Profile
            </span>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '4px' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ fontSize: '13px', color: 'var(--secondary-text)' }}>
              Set your own identity and credentials. Your name and role will be credited on research dossiers, saved investigations, audit logs, and in the user interface.
            </div>

            {/* Avatar Preview */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: 'var(--surface-bg)',
                borderRadius: '8px',
                border: '1px solid var(--border-light)'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: avatarColor,
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  flexShrink: 0
                }}
              >
                {initials || 'U'}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--primary-navy)' }}>
                  {name || 'Your Name'}
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--primary-blue)', fontWeight: 600 }}>
                  {role || 'Your Role'}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted-text)' }}>
                  {email || 'your.email@organization.org'}
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="form-label" style={{ fontSize: '11.5px', color: 'var(--muted-text)', marginBottom: '4px' }}>
                Quick Presets:
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => applyPreset('Bhuvan Shankar', 'Lead Research Analyst', 'bhuvan@research.org')}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '11.5px', padding: '3px 9px' }}
                >
                  <Sparkles size={12} color="var(--primary-blue)" />
                  <span>Bhuvan Shankar (Analyst)</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('Dr. Maya Chen', 'Lead Investigator', 'm.chen@openresearch.org')}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '11.5px', padding: '3px 9px' }}
                >
                  <span>Dr. Maya Chen (Demo)</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('Alex Mercer', 'Principal Knowledge Engineer', 'alex.mercer@corp.internal')}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '11.5px', padding: '3px 9px' }}
                >
                  <span>Alex Mercer (Engineer)</span>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Bhuvan Shankar"
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Professional Role / Title</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Research Analyst"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.org"
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Avatar Initials</label>
                <input
                  type="text"
                  value={initials}
                  onChange={(e) => setInitials(e.target.value.toUpperCase().slice(0, 3))}
                  className="form-input"
                  maxLength={3}
                  style={{ textTransform: 'uppercase', textAlign: 'center', fontWeight: 700 }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Color Theme</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', height: '38px' }}>
                  {colorThemes.map((theme, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatarColor(theme.gradient)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: theme.gradient,
                        border: avatarColor === theme.gradient ? '2px solid var(--primary-navy)' : '1px solid rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF'
                      }}
                      title={theme.name}
                    >
                      {avatarColor === theme.gradient && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              <Save size={14} />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
