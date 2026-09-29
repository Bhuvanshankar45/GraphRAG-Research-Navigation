import React, { useState } from 'react';
import { Workspace } from '../../types';
import { WorkspaceBundle } from '../../data/multiWorkspaces';
import {
  Database,
  Check,
  Plus,
  X,
  FileText,
  Share2,
  FolderPlus,
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';

interface WorkspaceSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBundles: WorkspaceBundle[];
  activeWorkspaceId: string;
  onSelectWorkspace: (bundle: WorkspaceBundle) => void;
  onCreateWorkspace: (name: string, domain: string, description: string) => void;
}

export const WorkspaceSwitcherModal: React.FC<WorkspaceSwitcherModalProps> = ({
  isOpen,
  onClose,
  availableBundles,
  activeWorkspaceId,
  onSelectWorkspace,
  onCreateWorkspace
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDomain, setNewDomain] = useState('Custom Research');
  const [newDescription, setNewDescription] = useState('');

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateWorkspace(newTitle.trim(), newDomain, newDescription.trim() || 'Custom user research workspace.');
    setIsCreating(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ width: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={18} color="var(--primary-blue)" />
            <span style={{ fontWeight: 800, fontSize: '16px', color: 'var(--primary-navy)' }}>
              Select or Create Research Workspace
            </span>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '4px' }}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--secondary-text)' }}>
            Switch between domain-specific knowledge bases or create a dedicated workspace for your own documents. Each workspace maintains an isolated vector store and knowledge graph.
          </div>

          {!isCreating ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {availableBundles.map(bundle => {
                const ws = bundle.workspace;
                const isActive = ws.id === activeWorkspaceId;

                return (
                  <div
                    key={ws.id}
                    onClick={() => {
                      onSelectWorkspace(bundle);
                      onClose();
                    }}
                    style={{
                      padding: '16px 18px',
                      borderRadius: '8px',
                      border: isActive ? '2px solid var(--primary-blue)' : '1px solid var(--border-light)',
                      background: isActive ? 'var(--pale-blue-bg)' : 'var(--white)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all var(--transition-fast)',
                      boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
                    }}
                    className="workspace-card"
                  >
                    <div style={{ flex: 1, marginRight: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 800, fontSize: '14.5px', color: 'var(--primary-navy)' }}>
                          {ws.name}
                        </span>
                        <span className="badge badge-concept" style={{ fontSize: '10.5px' }}>
                          {ws.domain}
                        </span>
                        {isActive && (
                          <span
                            style={{
                              fontSize: '10.5px',
                              fontWeight: 700,
                              color: '#1E7E34',
                              background: '#EAF7EE',
                              padding: '1px 6px',
                              borderRadius: '4px'
                            }}
                          >
                            Active Workspace
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--secondary-text)', lineHeight: 1.35, marginBottom: '6px' }}>
                        {ws.description}
                      </p>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '11.5px', color: 'var(--muted-text)' }}>
                        <span><strong>{bundle.documents.length}</strong> Documents</span>
                        <span>•</span>
                        <span><strong>{bundle.entities.length}</strong> Entities</span>
                        <span>•</span>
                        <span><strong>{bundle.relationships.length}</strong> Relationships</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {isActive ? (
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: 'var(--primary-blue)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Check size={16} />
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                        >
                          Switch
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="btn btn-outline"
                style={{
                  padding: '14px',
                  borderStyle: 'dashed',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '6px',
                  color: 'var(--primary-navy)'
                }}
              >
                <Plus size={16} />
                <span>Create New Custom Research Workspace</span>
              </button>
            </div>
          ) : (
            /* Creation Form */
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Workspace Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Legal Contracts Intelligence, Q3 Failure Analysis..."
                  className="form-input"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Domain Category</label>
                <select
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="form-select"
                >
                  <option value="Custom Research">Custom General Research</option>
                  <option value="Product & Engineering">Product & Engineering</option>
                  <option value="Compliance & Legal">Compliance & Legal</option>
                  <option value="Finance & Markets">Finance & Market Reports</option>
                  <option value="Biomedical & Clinical">Biomedical & Clinical</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Mission</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the research goals or types of documents to be indexed..."
                  className="form-textarea"
                  style={{ minHeight: '70px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="btn btn-outline btn-sm"
                >
                  Back to List
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <FolderPlus size={14} />
                  <span>Create & Open Workspace</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
