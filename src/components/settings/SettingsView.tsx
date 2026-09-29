import React, { useState } from 'react';
import { UserSettings, CitationStyle, UserProfile } from '../../types';
import {
  Settings,
  Database,
  Sliders,
  Cpu,
  Shield,
  Users,
  Save,
  CheckCircle2,
  Trash2,
  RefreshCw,
  User,
  Pencil
} from 'lucide-react';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onResetWorkspace: () => void;
  userProfile?: UserProfile;
  onOpenProfileModal?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetWorkspace,
  userProfile,
  onOpenProfileModal
}) => {
  const [form, setForm] = useState<UserSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px' }}>
      {/* Workspace & Collection Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Database size={18} color="var(--primary-blue)" />
            <span>Workspace & Active Collection</span>
          </div>
        </div>

        <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Workspace Display Name</label>
            <input
              type="text"
              value={form.workspaceName}
              onChange={(e) => setForm({ ...form, workspaceName: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Active Document Collection</label>
            <select
              value={form.activeCollection}
              onChange={(e) => setForm({ ...form, activeCollection: e.target.value })}
              className="form-select"
            >
              <option value="col-academic-papers">Academic Papers & Benchmarks</option>
              <option value="col-clinical-trials">Clinical Trial Audit & Standards</option>
              <option value="col-governance">Institutional Governance & Policy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Model & Ingestion Pipelines Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Cpu size={18} color="var(--primary-blue)" />
            <span>Vector & Extraction Models</span>
          </div>
        </div>

        <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Embedding Model</label>
            <select
              value={form.embeddingModel}
              onChange={(e) => setForm({ ...form, embeddingModel: e.target.value })}
              className="form-select"
            >
              <option value="text-embedding-3-large (1536-dim)">text-embedding-3-large (1536-dim, high-fidelity)</option>
              <option value="bge-large-en-v1.5 (1024-dim)">bge-large-en-v1.5 (1024-dim, academic SOTA)</option>
              <option value="scibert-scivocab-uncased (768-dim)">SciBERT-scivocab-uncased (768-dim, biomedical)</option>
            </select>
            <div style={{ fontSize: '11px', color: 'var(--muted-text)', marginTop: '4px' }}>
              Used for dense cosine similarity retrieval of document passages.
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Entity & Triplet Extractor</label>
            <select
              value={form.entityExtractionModel}
              onChange={(e) => setForm({ ...form, entityExtractionModel: e.target.value })}
              className="form-select"
            >
              <option value="gemini-1.5-pro / gpt-4o structured extraction">Gemini 1.5 Pro / GPT-4o Structured Parser</option>
              <option value="claude-3-5-sonnet-academic">Claude 3.5 Sonnet (Schema-Constrained)</option>
              <option value="biomedical-ner-t5-large">BioNER-T5-Large (Self-Hosted Model)</option>
            </select>
            <div style={{ fontSize: '11px', color: 'var(--muted-text)', marginTop: '4px' }}>
              Extracts typed entities, relationships, confidence, and source quotes.
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Chunk Size (Tokens): {form.chunkSize}</label>
            <input
              type="range"
              min="256"
              max="1024"
              step="64"
              value={form.chunkSize}
              onChange={(e) => setForm({ ...form, chunkSize: Number(e.target.value) })}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted-text)' }}>
              <span>256 tokens</span>
              <span>512 (Recommended)</span>
              <span>1024 tokens</span>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Chunk Overlap: {form.chunkOverlap} Tokens</label>
            <input
              type="range"
              min="16"
              max="128"
              step="16"
              value={form.chunkOverlap}
              onChange={(e) => setForm({ ...form, chunkOverlap: Number(e.target.value) })}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted-text)' }}>
              <span>16 tokens</span>
              <span>64 tokens</span>
              <span>128 tokens</span>
            </div>
          </div>
        </div>
      </div>

      {/* Graph Traversal & Citations Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Sliders size={18} color="var(--primary-blue)" />
            <span>Graph Traversal & Citation Formatting</span>
          </div>
        </div>

        <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">
              Relationship Confidence Threshold: {(form.relationConfidenceThreshold * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.50"
              max="0.95"
              step="0.05"
              value={form.relationConfidenceThreshold}
              onChange={(e) => setForm({ ...form, relationConfidenceThreshold: Number(e.target.value) })}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ fontSize: '11px', color: 'var(--muted-text)', marginTop: '4px' }}>
              Edges with confidence below this threshold are pruned from multi-hop paths.
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Citation Style</label>
            <select
              value={form.citationStyle}
              onChange={(e) => setForm({ ...form, citationStyle: e.target.value as CitationStyle })}
              className="form-select"
            >
              <option value="Numeric">Numeric [1], [2] (Recommended)</option>
              <option value="APA">APA Style (Chen et al., 2024)</option>
              <option value="IEEE">IEEE Reference Numbering</option>
              <option value="Nature">Nature Superscript Style</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Default Graph Traversal Hops</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {([1, 2, 3] as const).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setForm({ ...form, traversalDepthDefault: d })}
                  className={`btn btn-sm ${form.traversalDepthDefault === d ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                >
                  {d} Hop{d > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Data Retention (Days)</label>
            <input
              type="number"
              value={form.dataRetentionDays}
              onChange={(e) => setForm({ ...form, dataRetentionDays: Number(e.target.value) })}
              className="form-input"
              min="30"
              max="365"
            />
          </div>
        </div>
      </div>

      {/* Team Access & Reset Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Users size={18} color="var(--primary-blue)" />
            <span>Team Access & Danger Zone</span>
          </div>
        </div>

        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--surface-bg)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: userProfile?.avatarColor || 'linear-gradient(135deg, var(--primary-navy) 0%, var(--primary-blue) 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '15px'
                }}
              >
                {userProfile?.initials || 'ME'}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{userProfile?.name || 'Lead Investigator'}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary-blue)', background: 'var(--pale-blue-bg)', padding: '1px 6px', borderRadius: '4px' }}>
                    {userProfile?.role || 'Researcher'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted-text)', marginTop: '2px' }}>
                  {userProfile?.email || 'user@research.org'} • Full Read, Write, Vector Indexing Permissions
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-concept">Workspace Owner</span>
              {onOpenProfileModal && (
                <button
                  type="button"
                  onClick={onOpenProfileModal}
                  className="btn btn-outline btn-sm"
                  style={{ gap: '6px' }}
                >
                  <Pencil size={13} />
                  <span>Edit Identity</span>
                </button>
              )}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--destructive-red)' }}>
                Reset Workspace Knowledge Index
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--muted-text)' }}>
                Re-seeds the default academic collection, restoring 6 papers, 26 entities, and 44 graph triplets.
              </div>
            </div>
            <button
              type="button"
              onClick={onResetWorkspace}
              className="btn btn-destructive btn-sm"
            >
              <RefreshCw size={13} />
              <span>Reset to Seed Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
        {savedSuccess && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2ECC71', fontSize: '13px', fontWeight: 600 }}>
            <CheckCircle2 size={16} />
            <span>Settings saved successfully</span>
          </div>
        )}
        <button type="submit" className="btn btn-primary">
          <Save size={16} />
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
};
