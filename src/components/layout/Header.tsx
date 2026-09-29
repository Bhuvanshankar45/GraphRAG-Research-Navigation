import React from 'react';
import { ActiveTab } from './Sidebar';
import { Upload, Sparkles, Database, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onOpenUpload: () => void;
  onAskQuestion: () => void;
  collectionName: string;
  onOpenWorkspaceModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenUpload,
  onAskQuestion,
  collectionName,
  onOpenWorkspaceModal
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Research Overview & System Health';
      case 'documents':
        return 'Document Library & Extracted Knowledge';
      case 'graph':
        return 'Interactive Knowledge Graph Explorer';
      case 'research':
        return 'Ask Research — Hybrid GraphRAG Assistant';
      case 'saved':
        return 'Saved Investigations & Evidence Dossiers';
      case 'settings':
        return 'System Settings & Pipeline Configuration';
      default:
        return 'Research Navigator';
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="view-heading">{getTabTitle()}</h1>
        <button
          onClick={onOpenWorkspaceModal}
          className="breadcrumb-tag"
          style={{ cursor: 'pointer', border: '1px solid var(--border-gray)', background: 'var(--pale-blue-bg)' }}
          title="Click to switch workspace"
        >
          <Database size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
          <span>{collectionName}</span>
          <span style={{ fontSize: '10px', color: 'var(--primary-blue)', marginLeft: '4px', fontWeight: 700 }}>
            (Switch)
          </span>
        </button>
      </div>

      <div className="header-right">
        <div className="header-status-pill" title="GraphRAG index active and synchronized">
          <span className="status-indicator-dot" />
          <span>GraphRAG Engine Online</span>
        </div>

        <button onClick={onOpenUpload} className="btn btn-secondary btn-sm">
          <Upload size={14} />
          <span>Upload Docs</span>
        </button>

        <button onClick={onAskQuestion} className="btn btn-primary btn-sm">
          <Sparkles size={14} />
          <span>Ask Question</span>
        </button>
      </div>
    </header>
  );
};
