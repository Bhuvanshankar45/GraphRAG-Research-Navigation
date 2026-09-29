import React, { useState, useRef } from 'react';
import {
  Document,
  DocumentChunk,
  Entity,
  Relationship,
  ProcessingStatus
} from '../../types';
import { parseUploadedFile } from '../../services/documentParser';
import {
  Upload,
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Layers,
  Share2,
  GitFork,
  X,
  FileUp,
  Tag,
  BookOpen,
  Calendar,
  User,
  Sparkles,
  ChevronRight,
  FolderOpen,
  ClipboardPen,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';

interface DocumentLibraryViewProps {
  documents: Document[];
  chunks: DocumentChunk[];
  entities: Entity[];
  relationships: Relationship[];
  onUploadFile: (newDoc: Document, newChunks: DocumentChunk[], newEntities: Entity[], newRels: Relationship[]) => void;
  selectedDoc: Document | null;
  setSelectedDoc: (doc: Document | null) => void;
}

export const DocumentLibraryView: React.FC<DocumentLibraryViewProps> = ({
  documents,
  chunks,
  entities,
  relationships,
  onUploadFile,
  selectedDoc,
  setSelectedDoc
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeTabInDrawer, setActiveTabInDrawer] = useState<'metadata' | 'text' | 'chunks' | 'entities' | 'relations'>('metadata');

  // Real File Input & Drag State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Ingestion Pipeline Modal State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState<ProcessingStatus>('Uploaded');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentUploadingFileName, setCurrentUploadingFileName] = useState('');
  const [pipelineLog, setPipelineLog] = useState<string[]>([]);

  // Paste Text Modal State
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pastedTitle, setPastedTitle] = useState('');
  const [pastedText, setPastedText] = useState('');

  // Filtered documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase())) ||
      doc.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'ALL' || doc.fileType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || doc.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Chunks, Entities, and Relationships for selected document
  const docChunks = selectedDoc ? chunks.filter(c => c.docId === selectedDoc.id) : [];
  const docEntities = selectedDoc ? entities.filter(e => e.sourceDocIds.includes(selectedDoc.id)) : [];
  const docRelations = selectedDoc ? relationships.filter(r => r.sourceDocId === selectedDoc.id) : [];

  /**
   * Process a real uploaded file
   */
  const processRealFile = async (file: File) => {
    setCurrentUploadingFileName(file.name);
    setIsUploading(true);
    setUploadProgress(15);
    setUploadStage('Uploaded');
    setPipelineLog([`Received file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`]);

    try {
      setTimeout(() => {
        setUploadStage('Extracting');
        setUploadProgress(35);
        setPipelineLog(prev => [...prev, `Parsing document content & extracting textual body...`]);
      }, 500);

      setTimeout(() => {
        setUploadStage('Chunking');
        setUploadProgress(60);
        setPipelineLog(prev => [...prev, `Segmenting into semantically coherent passages with 64-token overlap...`]);
      }, 1100);

      setTimeout(() => {
        setUploadStage('Embedding');
        setUploadProgress(80);
        setPipelineLog(prev => [...prev, `Generating 1536-dimensional dense vector embeddings...`]);
      }, 1700);

      setTimeout(() => {
        setUploadStage('Graph Extraction');
        setUploadProgress(95);
        setPipelineLog(prev => [...prev, `Extracting entities, concepts & relational triplets...`]);
      }, 2300);

      // Complete parsing
      const result = await parseUploadedFile(file);

      setTimeout(() => {
        setUploadStage('Ready');
        setUploadProgress(100);
        setPipelineLog(prev => [
          ...prev,
          `Successfully indexed ${result.chunks.length} chunks, ${result.entities.length} entities, and ${result.relationships.length} graph edges!`
        ]);

        onUploadFile(result.document, result.chunks, result.entities, result.relationships);

        setTimeout(() => {
          setIsUploading(false);
          setSelectedDoc(result.document);
        }, 800);
      }, 2900);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processRealFile(files[0]);
    }
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processRealFile(files[0]);
    }
  };

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;

    const fileName = `${pastedTitle.trim() || 'Custom_Research_Note'}.txt`;
    const blob = new Blob([pastedText], { type: 'text/plain' });
    const file = new File([blob], fileName, { type: 'text/plain' });

    setIsPasteModalOpen(false);
    setPastedTitle('');
    setPastedText('');
    await processRealFile(file);
  };

  // Preset sample upload helper
  const handleSimulateUpload = (sampleChoice: number) => {
    const sampleFiles = [
      {
        name: 'Contrastive_Representation_Learning_Molecular_Graphs.pdf',
        text: `CONTRASTIVE REPRESENTATION LEARNING ON MOLECULAR KNOWLEDGE GRAPHS
Julian Vance, Maya Chen (2024)

Abstract:
Molecular graphs present distinct structural challenges for standard vector retrievers. We introduce MolGraph-Contrast, achieving 94.1% accuracy on bioactivity prediction benchmarks across complex chemical literature.

1. Methodology
We formulate self-supervised contrastive learning objectives over chemical knowledge graphs to predict bioactive molecule interactions and integrate with GraphRAG multi-hop retrieval.`
      },
      {
        name: 'Federated_Evidence_Extraction_Health_Systems.pdf',
        text: `FEDERATED EVIDENCE EXTRACTION FOR MULTI-CENTER HEALTH SYSTEMS
Elena Rostova, Clinical AI Working Group, 2024

Abstract:
Sharing medical records directly violates privacy standards. We propose a decentralized triplet extraction protocol compliant with HIPAA and GCP Standard 4.2 guidelines.

2. Benchmark & Compliance
Federated Triplet Extractor resolves privacy-preserving graph navigation across distributed hospital databases while providing cryptographic audit trails.`
      }
    ][sampleChoice];

    const blob = new Blob([sampleFiles.text], { type: 'text/plain' });
    const file = new File([blob], sampleFiles.name, { type: 'text/plain' });
    processRealFile(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hidden native file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".pdf,.docx,.doc,.txt,.md,.csv,.json"
        style={{ display: 'none' }}
      />

      {/* Upload Zone Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Upload size={18} color="var(--primary-blue)" />
            <span>Document Upload & Indexing Hub</span>
          </div>
          <span style={{ fontSize: '12.5px', color: 'var(--muted-text)' }}>
            PDF, DOCX, TXT, Markdown, CSV, JSON supported • Direct File & Drag Drop
          </span>
        </div>

        <div className="card-body">
          <div
            className={`dropzone-box ${isDragOver ? 'drag-active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: isDragOver ? 'var(--light-blue-gray)' : 'var(--pale-blue-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-blue)',
                transition: 'transform 0.2s ease'
              }}
            >
              <FileUp size={28} />
            </div>

            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary-navy)' }}>
                {isDragOver ? 'Release File to Begin Indexing' : 'Drag & Drop Your Research Files Here, or Browse'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--secondary-text)', marginTop: '4px' }}>
                Upload your own research papers, PDF reports, notes, or CSV datasets. The system will parse text, split chunks, extract entities, and build relational graph triplets.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="btn btn-primary btn-sm"
                style={{ gap: '6px' }}
              >
                <FolderOpen size={14} />
                <span>Choose File from Computer</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPasteModalOpen(true);
                }}
                className="btn btn-secondary btn-sm"
                style={{ gap: '6px' }}
              >
                <ClipboardPen size={14} />
                <span>Paste Text / Note</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSimulateUpload(0);
                }}
                className="btn btn-outline btn-sm"
              >
                <Sparkles size={13} color="var(--primary-blue)" />
                <span>Load Sample: Molecular Graph Paper</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSimulateUpload(1);
                }}
                className="btn btn-outline btn-sm"
              >
                <Sparkles size={13} color="var(--primary-blue)" />
                <span>Load Sample: Federated Health AI</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-text)' }}
            />
            <input
              type="text"
              placeholder="Search by title, author, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px' }}
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-select"
            style={{ width: '140px' }}
          >
            <option value="ALL">All Types</option>
            <option value="PDF">PDF</option>
            <option value="DOCX">DOCX</option>
            <option value="TXT">TXT</option>
            <option value="MD">Markdown</option>
            <option value="CSV">CSV</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: '150px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="Ready">Ready</option>
            <option value="Embedding">Embedding</option>
            <option value="Extracting">Extracting</option>
          </select>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--secondary-text)', fontWeight: 500 }}>
          Showing <strong>{filteredDocs.length}</strong> of <strong>{documents.length}</strong> indexed documents
        </div>
      </div>

      {/* Documents Table */}
      <div className="card">
        <div className="table-container" style={{ border: 'none' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Document Title</th>
                <th>Authors & Year</th>
                <th>Format</th>
                <th>Chunks</th>
                <th>Entities</th>
                <th>Relations</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map(doc => (
                <tr key={doc.id} onClick={() => setSelectedDoc(doc)}>
                  <td style={{ maxWidth: '340px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary-navy)', fontSize: '13.5px', lineHeight: 1.3 }}>
                      {doc.title}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                      {doc.tags.slice(0, 3).map(t => (
                        <span key={t} style={{ fontSize: '10.5px', background: 'var(--pale-blue-bg)', color: 'var(--primary-blue)', padding: '1px 6px', borderRadius: '4px', border: '1px solid var(--light-blue-gray)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontSize: '12.5px', color: 'var(--secondary-text)' }}>
                    <div>{doc.authors.join(', ')}</div>
                    <div style={{ color: 'var(--muted-text)', fontSize: '11.5px' }}>{doc.year}</div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, padding: '2px 6px', background: '#F1F5F9', borderRadius: '4px' }}>
                      {doc.fileType}
                    </span>
                  </td>
                  <td style={{ fontSize: '13px', fontWeight: 600 }}>{doc.chunksCount}</td>
                  <td>
                    <span className="badge badge-concept">
                      {doc.entitiesCount}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-dataset">
                      {doc.relationsCount}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-status-ready">
                      <CheckCircle2 size={11} style={{ marginRight: '3px' }} />
                      {doc.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedDoc(doc); }}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '4px 8px' }}
                    >
                      <Eye size={13} />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real Ingestion Pipeline Progress Modal */}
      {isUploading && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ width: '540px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={18} color="var(--primary-blue)" />
                <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--primary-navy)' }}>
                  GraphRAG Processing & Indexing Pipeline
                </span>
              </div>
            </div>

            <div className="modal-body" style={{ padding: '28px 24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '4px' }}>
                  Processing: <span style={{ color: 'var(--primary-blue)' }}>{currentUploadingFileName}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--secondary-text)' }}>
                  Current Stage: <strong>{uploadStage}...</strong>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                <div
                  style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--primary-navy) 0%, var(--interactive-blue) 100%)',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>

              {/* Pipeline Stage Indicators */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted-text)', marginBottom: '20px' }}>
                <span style={{ color: uploadProgress >= 15 ? 'var(--primary-blue)' : undefined, fontWeight: uploadProgress >= 15 ? 700 : 400 }}>
                  1. Upload
                </span>
                <span style={{ color: uploadProgress >= 35 ? 'var(--primary-blue)' : undefined, fontWeight: uploadProgress >= 35 ? 700 : 400 }}>
                  2. Extract
                </span>
                <span style={{ color: uploadProgress >= 60 ? 'var(--primary-blue)' : undefined, fontWeight: uploadProgress >= 60 ? 700 : 400 }}>
                  3. Chunk
                </span>
                <span style={{ color: uploadProgress >= 80 ? 'var(--primary-blue)' : undefined, fontWeight: uploadProgress >= 80 ? 700 : 400 }}>
                  4. Embed
                </span>
                <span style={{ color: uploadProgress >= 95 ? 'var(--primary-blue)' : undefined, fontWeight: uploadProgress >= 95 ? 700 : 400 }}>
                  5. Graph
                </span>
                <span style={{ color: uploadProgress >= 100 ? '#2ECC71' : undefined, fontWeight: uploadProgress >= 100 ? 800 : 400 }}>
                  ✓ Ready
                </span>
              </div>

              {/* Live Ingestion Logs */}
              <div
                style={{
                  background: '#F8FAFD',
                  border: '1px solid var(--border-light)',
                  borderRadius: '6px',
                  padding: '12px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11.5px',
                  color: 'var(--dark-text)',
                  maxHeight: '130px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                {pipelineLog.map((log, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--primary-blue)' }}>➔</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paste Document Text Modal */}
      {isPasteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPasteModalOpen(false)}>
          <div className="modal-dialog" style={{ width: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClipboardPen size={18} color="var(--primary-blue)" />
                <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--primary-navy)' }}>
                  Paste Text or Research Notes to Index
                </span>
              </div>
              <button onClick={() => setIsPasteModalOpen(false)} className="btn-ghost" style={{ padding: '4px' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handlePasteSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Document or Note Title</label>
                  <input
                    type="text"
                    value={pastedTitle}
                    onChange={(e) => setPastedTitle(e.target.value)}
                    placeholder="e.g. Clinical Trial Evaluation Notes or Paper Abstract"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Text Content</label>
                  <textarea
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste full text, abstract, claims, or research paragraphs here..."
                    className="form-textarea"
                    style={{ minHeight: '180px', fontFamily: 'var(--font-sans)', fontSize: '13px' }}
                    required
                  />
                  <div style={{ fontSize: '11px', color: 'var(--muted-text)', marginTop: '4px' }}>
                    The engine will automatically split this into semantic vector chunks and extract entities and relationships.
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsPasteModalOpen(false)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Upload size={14} />
                  <span>Upload & Index Document</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Right-Side Document Details Drawer */}
      {selectedDoc && (
        <div className="drawer-overlay" onClick={() => setSelectedDoc(null)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div style={{ overflow: 'hidden' }}>
                <span className="badge badge-document" style={{ marginBottom: '6px' }}>
                  {selectedDoc.fileType} Document
                </span>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--primary-navy)', lineHeight: 1.3 }}>
                  {selectedDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="btn-ghost"
                style={{ padding: '6px', borderRadius: '50%' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', padding: '0 16px', background: '#F8FAFD' }}>
              {(['metadata', 'text', 'chunks', 'entities', 'relations'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTabInDrawer(tab)}
                  style={{
                    padding: '10px 14px',
                    fontSize: '12.5px',
                    fontWeight: activeTabInDrawer === tab ? 700 : 500,
                    color: activeTabInDrawer === tab ? 'var(--primary-navy)' : 'var(--secondary-text)',
                    border: 'none',
                    borderBottom: activeTabInDrawer === tab ? '2.5px solid var(--primary-blue)' : '2.5px solid transparent',
                    background: 'transparent',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="drawer-content">
              {activeTabInDrawer === 'metadata' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div className="stat-label">Summary Abstract</div>
                    <p style={{ fontSize: '13px', color: 'var(--dark-text)', lineHeight: 1.5, background: 'var(--pale-blue-bg)', padding: '12px', borderRadius: '6px', border: '1px solid var(--light-blue-gray)' }}>
                      {selectedDoc.summary}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ padding: '10px', background: 'var(--surface-bg)', borderRadius: '6px' }}>
                      <div className="stat-label">Authors</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary-navy)' }}>
                        {selectedDoc.authors.join(', ')}
                      </div>
                    </div>
                    <div style={{ padding: '10px', background: 'var(--surface-bg)', borderRadius: '6px' }}>
                      <div className="stat-label">Year Published</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary-navy)' }}>
                        {selectedDoc.year}
                      </div>
                    </div>
                    <div style={{ padding: '10px', background: 'var(--surface-bg)', borderRadius: '6px' }}>
                      <div className="stat-label">Page Count</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary-navy)' }}>
                        {selectedDoc.pageCount} pages ({selectedDoc.fileSize})
                      </div>
                    </div>
                    <div style={{ padding: '10px', background: 'var(--surface-bg)', borderRadius: '6px' }}>
                      <div className="stat-label">Status</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#2ECC71' }}>
                        {selectedDoc.status}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="stat-label">Topic Tags</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {selectedDoc.tags.map(t => (
                        <span key={t} className="badge badge-concept">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTabInDrawer === 'text' && (
                <div>
                  <div className="stat-label" style={{ marginBottom: '8px' }}>Extracted Clean Text</div>
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
                      lineHeight: 1.6,
                      maxHeight: '480px',
                      overflowY: 'auto'
                    }}
                  >
                    {selectedDoc.extractedText}
                  </pre>
                </div>
              )}

              {activeTabInDrawer === 'chunks' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ fontSize: '12.5px', color: 'var(--muted-text)' }}>
                    Total {docChunks.length} vector chunks indexed for semantic similarity:
                  </div>
                  {docChunks.map(chunk => (
                    <div
                      key={chunk.id}
                      style={{
                        padding: '12px 14px',
                        background: '#FAFBFD',
                        borderRadius: '6px',
                        border: '1px solid var(--border-light)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--primary-blue)', fontWeight: 600 }}>
                        <span>Chunk #{chunk.chunkIndex} (Page {chunk.pageNumber})</span>
                        <span>{chunk.tokenCount} tokens</span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: 'var(--dark-text)', lineHeight: 1.4 }}>
                        "{chunk.text}"
                      </div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                        {chunk.entities.map(e => (
                          <span key={e} style={{ fontSize: '10.5px', background: 'var(--pale-blue-bg)', padding: '1px 6px', borderRadius: '3px', color: 'var(--primary-navy)' }}>
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTabInDrawer === 'entities' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12.5px', color: 'var(--muted-text)' }}>
                    {docEntities.length} entities extracted from this document:
                  </div>
                  {docEntities.map(ent => (
                    <div
                      key={ent.id}
                      style={{
                        padding: '12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-light)',
                        background: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--primary-navy)' }}>
                          {ent.name}
                        </span>
                        <span className="badge badge-concept">
                          {ent.type}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--secondary-text)' }}>
                        {ent.description}
                      </p>
                      <div style={{ fontSize: '11px', color: 'var(--muted-text)' }}>
                        Confidence: {(ent.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTabInDrawer === 'relations' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12.5px', color: 'var(--muted-text)' }}>
                    {docRelations.length} structured relationships extracted:
                  </div>
                  {docRelations.map(rel => {
                    const sourceEnt = entities.find(e => e.id === rel.sourceId);
                    const targetEnt = entities.find(e => e.id === rel.targetId);

                    return (
                      <div
                        key={rel.id}
                        style={{
                          padding: '12px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-light)',
                          background: 'var(--pale-blue-bg)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--primary-navy)' }}>
                          <span>{sourceEnt?.name || rel.sourceId}</span>
                          <span style={{ color: 'var(--primary-blue)', background: '#FFFFFF', padding: '1px 6px', borderRadius: '4px', border: '1px dashed var(--interactive-blue)' }}>
                            {rel.relationType}
                          </span>
                          <span>{targetEnt?.name || rel.targetId}</span>
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--secondary-text)', fontStyle: 'italic' }}>
                          "{rel.evidenceText}"
                        </div>
                        <div style={{ fontSize: '10.5px', color: 'var(--muted-text)' }}>
                          Reference: {rel.pageRef} • Confidence: {(rel.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="drawer-footer">
              <button onClick={() => setSelectedDoc(null)} className="btn btn-outline btn-sm">
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
