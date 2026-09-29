import React from 'react';
import {
  Document,
  GraphNode,
  GraphEdge,
  SavedInvestigation
} from '../../types';
import {
  FileText,
  Layers,
  Share2,
  GitFork,
  Upload,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Cpu,
  Activity,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { InteractiveGraphCanvas } from '../graph/InteractiveGraphCanvas';

interface DashboardViewProps {
  documents: Document[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  savedInvestigations: SavedInvestigation[];
  onUploadClick: () => void;
  onAskClick: (presetQuestion?: string) => void;
  onViewDoc: (doc: Document) => void;
  onViewGraph: () => void;
  workspaceName: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  documents,
  nodes,
  edges,
  savedInvestigations,
  onUploadClick,
  onAskClick,
  onViewDoc,
  onViewGraph,
  workspaceName
}) => {
  const totalChunks = documents.reduce((acc, d) => acc + d.chunksCount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner Greeting */}
      <div
        style={{
          background: 'linear-gradient(135deg, #003366 0%, #004D80 50%, #006699 100%)',
          color: '#FFFFFF',
          borderRadius: '12px',
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        <div>
          <div
            style={{
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--soft-blue)',
              fontWeight: 600,
              marginBottom: '6px'
            }}
          >
            Enterprise Knowledge Workspace
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
            {workspaceName}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--light-blue-gray)', maxWidth: '640px', lineHeight: 1.4 }}>
            Multi-hop scientific intelligence combining dense vector similarity with knowledge-graph traversal. Discover hidden evidentiary connections across your indexed literature.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
          <button
            onClick={onUploadClick}
            className="btn btn-secondary"
            style={{ background: '#FFFFFF', color: 'var(--primary-navy)' }}
          >
            <Upload size={16} />
            <span>Upload Documents</span>
          </button>
          <button
            onClick={() => onAskClick()}
            className="btn btn-primary"
            style={{ background: 'var(--interactive-blue)', borderColor: 'var(--interactive-blue)' }}
          >
            <Sparkles size={16} />
            <span>Ask a Question</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stat-card-grid">
        <div className="stat-card stat-navy">
          <div>
            <div className="stat-label">Total Documents</div>
            <div className="stat-value">{documents.length}</div>
            <div className="stat-subtext">
              <CheckCircle2 size={12} color="#2ECC71" />
              <span>All 6 indexed & ready</span>
            </div>
          </div>
          <div className="stat-icon-wrapper">
            <FileText size={22} />
          </div>
        </div>

        <div className="stat-card stat-blue">
          <div>
            <div className="stat-label">Indexed Chunks</div>
            <div className="stat-value">{totalChunks}</div>
            <div className="stat-subtext">
              <Layers size={12} color="var(--primary-blue)" />
              <span>1536-dim vector embeddings</span>
            </div>
          </div>
          <div className="stat-icon-wrapper">
            <Layers size={22} />
          </div>
        </div>

        <div className="stat-card stat-green">
          <div>
            <div className="stat-label">Entities Extracted</div>
            <div className="stat-value">{nodes.length}</div>
            <div className="stat-subtext">
              <Share2 size={12} color="var(--muted-green-dark)" />
              <span>Methods, datasets & authors</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ color: 'var(--muted-green-dark)' }}>
            <Share2 size={22} />
          </div>
        </div>

        <div className="stat-card stat-soft">
          <div>
            <div className="stat-label">Relationships Mapped</div>
            <div className="stat-value">{edges.length}</div>
            <div className="stat-subtext">
              <GitFork size={12} color="var(--primary-blue)" />
              <span>Avg confidence: 97.4%</span>
            </div>
          </div>
          <div className="stat-icon-wrapper">
            <GitFork size={22} />
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 0.95fr)', gap: '24px' }}>
        {/* Left Column: Recent Documents & Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Recent Documents Table Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <FileText size={18} color="var(--primary-blue)" />
                <span>Recent Documents</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                {documents.length} sources indexed
              </span>
            </div>

            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Title & Type</th>
                    <th>Uploaded</th>
                    <th>Pages</th>
                    <th>Entities</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.slice(0, 5).map(doc => (
                    <tr key={doc.id} onClick={() => onViewDoc(doc)}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--primary-navy)', fontSize: '13px' }}>
                          {doc.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--muted-text)', marginTop: '2px' }}>
                          {doc.authors.join(', ')} • {doc.year}
                        </div>
                      </td>
                      <td style={{ fontSize: '12.5px', color: 'var(--secondary-text)' }}>
                        {doc.uploadDate}
                      </td>
                      <td style={{ fontSize: '12.5px' }}>{doc.pageCount} pp</td>
                      <td>
                        <span className="badge badge-concept">
                          {doc.entitiesCount} entities
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-status-ready">
                          Ready
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Research Questions Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Sparkles size={18} color="var(--primary-blue)" />
                <span>Recent Research Questions</span>
              </div>
            </div>

            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px 20px' }}>
              {savedInvestigations.map(inv => (
                <div
                  key={inv.id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '8px',
                    background: 'var(--pale-blue-bg)',
                    border: '1px solid var(--light-blue-gray)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--primary-navy)' }}>
                      {inv.title}
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        background: '#FFFFFF',
                        border: '1px solid var(--border-gray)',
                        borderRadius: '4px',
                        color: 'var(--primary-blue)',
                        fontWeight: 600
                      }}
                    >
                      {inv.answerResult.diagnostics.graphPathsTraversed} Graph Hops
                    </span>
                  </div>

                  <div style={{ fontSize: '12.5px', color: 'var(--secondary-text)', fontStyle: 'italic' }}>
                    "{inv.question}"
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {inv.tags.map(t => (
                        <span key={t} style={{ fontSize: '10.5px', color: 'var(--primary-blue)', background: '#FFFFFF', padding: '1px 6px', borderRadius: '3px' }}>
                          #{t}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => onAskClick(inv.question)}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '3px 8px', fontSize: '11.5px' }}
                    >
                      <span>Re-run Investigation</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mini Graph Preview & System Health */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Knowledge Graph Activity Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Share2 size={18} color="var(--primary-blue)" />
                <span>Knowledge Graph Preview</span>
              </div>
              <button onClick={onViewGraph} className="btn btn-outline btn-sm">
                <span>Open Full Explorer</span>
                <ArrowRight size={12} />
              </button>
            </div>

            <div style={{ padding: '12px' }}>
              <InteractiveGraphCanvas
                nodes={nodes.slice(0, 14)}
                edges={edges.slice(0, 16)}
                isCompact={true}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', fontSize: '11.5px', color: 'var(--muted-text)' }}>
                <span>Showing core cluster ({nodes.length} total nodes)</span>
                <span>Click & drag nodes to explore</span>
              </div>
            </div>
          </div>

          {/* System Health Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Activity size={18} color="#2ECC71" />
                <span>System Pipeline Health</span>
              </div>
              <span className="badge badge-status-ready">Operational</span>
            </div>

            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileCheck size={16} color="var(--primary-blue)" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary-navy)' }}>
                      Document Upload & Chunking Pipeline
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--muted-text)' }}>
                      Structured text parsing & metadata preserved
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#2ECC71' }}>100% OK</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Cpu size={16} color="var(--primary-blue)" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary-navy)' }}>
                      Dense Vector Embeddings
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--muted-text)' }}>
                      text-embedding-3-large (1536-dim)
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#2ECC71' }}>Active</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Share2 size={16} color="var(--primary-blue)" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary-navy)' }}>
                      LLM Triplet Extraction
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--muted-text)' }}>
                      44 typed edges with evidence snippets
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#2ECC71' }}>Active</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Activity size={16} color="var(--primary-blue)" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary-navy)' }}>
                      Hybrid GraphRAG Latency
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--muted-text)' }}>
                      Avg query response: ~210ms
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#2ECC71' }}>Optimal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
