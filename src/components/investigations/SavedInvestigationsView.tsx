import React, { useState } from 'react';
import { SavedInvestigation } from '../../types';
import {
  BookmarkCheck,
  Search,
  ExternalLink,
  Copy,
  Trash2,
  Download,
  Share2,
  Calendar,
  User,
  Sparkles,
  FileText,
  Tag,
  Check
} from 'lucide-react';

interface SavedInvestigationsViewProps {
  investigations: SavedInvestigation[];
  onOpenInvestigation: (inv: SavedInvestigation) => void;
  onDeleteInvestigation: (id: string) => void;
  onDuplicateInvestigation: (inv: SavedInvestigation) => void;
}

export const SavedInvestigationsView: React.FC<SavedInvestigationsViewProps> = ({
  investigations,
  onOpenInvestigation,
  onDeleteInvestigation,
  onDuplicateInvestigation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [exportModalInv, setExportModalInv] = useState<SavedInvestigation | null>(null);
  const [copiedExport, setCopiedExport] = useState(false);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(investigations.flatMap(inv => inv.tags))
  );

  const filtered = investigations.filter(inv => {
    const matchesSearch =
      inv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.answerResult.answerText.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag =
      selectedTag === 'ALL' || inv.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const getExportMarkdown = (inv: SavedInvestigation) => {
    return `# Investigation Report: ${inv.title}
**Date Generated:** ${inv.dateCreated}  
**Lead Investigator:** ${inv.savedBy}  
**Collection:** ${inv.collection}  
**Tags:** ${inv.tags.join(', ')}

---

## 1. Research Question
> ${inv.question}

## 2. Synthesized Grounded Answer
${inv.answerResult.answerText}

## 3. Reasoning Path
${inv.answerResult.reasoningPaths.map((p, i) => `${i + 1}. [${p.fromNodeType}] ${p.fromNodeName} --[${p.relationType}]--> [${p.toNodeType}] ${p.toNodeName} (Source: ${p.docTitle}, ${p.pageRef})`).join('\n')}

## 4. Supporting Evidence
${inv.answerResult.supportingEvidence.map(e => `### [${e.id}] ${e.docTitle} (${e.chunkRef})
> "${e.excerpt}"
*Relevance: ${e.relevanceExplanation} (Confidence: ${(e.confidence * 100).toFixed(0)}%)*
`).join('\n')}

---
*Exported from GraphRAG Research Navigator*
`;
  };

  const copyMarkdown = (inv: SavedInvestigation) => {
    const md = getExportMarkdown(inv);
    navigator.clipboard.writeText(md);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  const downloadFile = (inv: SavedInvestigation) => {
    const md = getExportMarkdown(inv);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${inv.title.replace(/\s+/g, '_').toLowerCase()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Search & Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          background: 'var(--white)',
          padding: '16px 20px',
          borderRadius: '8px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-text)' }}
            />
            <input
              type="text"
              placeholder="Search saved investigations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '34px', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted-text)', fontWeight: 600 }}>Filter by Tag:</span>
            <button
              onClick={() => setSelectedTag('ALL')}
              className={`btn btn-sm ${selectedTag === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '3px 8px', fontSize: '11px' }}
            >
              All ({investigations.length})
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`btn btn-sm ${selectedTag === tag ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '3px 8px', fontSize: '11px' }}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--secondary-text)', fontWeight: 600 }}>
          {filtered.length} Saved Dossier{filtered.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Investigations Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '20px'
        }}
      >
        {filtered.map(inv => (
          <div
            key={inv.id}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all var(--transition-fast)'
            }}
          >
            <div style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--primary-blue)',
                    background: 'var(--pale-blue-bg)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--light-blue-gray)'
                  }}
                >
                  {inv.collection}
                </span>

                <span style={{ fontSize: '11.5px', color: 'var(--muted-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} />
                  {inv.dateCreated}
                </span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary-navy)', lineHeight: 1.3, marginBottom: '8px' }}>
                {inv.title}
              </h3>

              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--secondary-text)',
                  fontStyle: 'italic',
                  background: 'var(--surface-bg)',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-light)',
                  marginBottom: '12px',
                  lineHeight: 1.4
                }}
              >
                "{inv.question}"
              </div>

              <p style={{ fontSize: '13px', color: 'var(--dark-text)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {inv.answerResult.answerText.replace(/[#*`>]/g, '')}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                {inv.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '11px',
                      background: 'var(--pale-blue-bg)',
                      color: 'var(--primary-blue)',
                      padding: '1px 7px',
                      borderRadius: '4px'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer with Metrics & Actions */}
            <div
              style={{
                padding: '12px 20px',
                background: '#FAFBFD',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--secondary-text)', fontWeight: 600 }}>
                <span>{inv.answerResult.supportingEvidence.length} Sources</span>
                <span>•</span>
                <span>{inv.answerResult.reasoningPaths.length} Hops</span>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setExportModalInv(inv)}
                  className="btn-ghost"
                  style={{ padding: '6px' }}
                  title="Export Markdown Report"
                >
                  <Download size={15} color="var(--primary-navy)" />
                </button>

                <button
                  onClick={() => onDuplicateInvestigation(inv)}
                  className="btn-ghost"
                  style={{ padding: '6px' }}
                  title="Duplicate Investigation"
                >
                  <Copy size={15} color="var(--primary-navy)" />
                </button>

                <button
                  onClick={() => onDeleteInvestigation(inv.id)}
                  className="btn-ghost"
                  style={{ padding: '6px' }}
                  title="Delete Investigation"
                >
                  <Trash2 size={15} color="var(--destructive-red)" />
                </button>

                <button
                  onClick={() => onOpenInvestigation(inv)}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '5px 12px', fontSize: '12px' }}
                >
                  <span>Open</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Export Report Modal */}
      {exportModalInv && (
        <div className="modal-overlay" onClick={() => setExportModalInv(null)}>
          <div className="modal-dialog" style={{ width: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={18} color="var(--primary-blue)" />
                <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--primary-navy)' }}>
                  Export Investigation Dossier
                </span>
              </div>
            </div>

            <div className="modal-body">
              <pre
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  whiteSpace: 'pre-wrap',
                  background: '#F8FAFD',
                  padding: '16px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-light)',
                  color: 'var(--dark-text)',
                  lineHeight: 1.5,
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}
              >
                {getExportMarkdown(exportModalInv)}
              </pre>
            </div>

            <div className="modal-footer">
              <button onClick={() => setExportModalInv(null)} className="btn btn-outline btn-sm">
                Close
              </button>
              <button onClick={() => copyMarkdown(exportModalInv)} className="btn btn-secondary btn-sm">
                {copiedExport ? <Check size={14} color="#2ECC71" /> : <Copy size={14} />}
                <span>{copiedExport ? 'Copied Markdown' : 'Copy Markdown'}</span>
              </button>
              <button onClick={() => downloadFile(exportModalInv)} className="btn btn-primary btn-sm">
                <Download size={14} />
                <span>Download .MD</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
