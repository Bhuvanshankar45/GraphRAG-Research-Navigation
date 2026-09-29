import React, { useState, useMemo } from 'react';
import {
  GraphNode,
  GraphEdge,
  EntityType,
  RelationshipType,
  Document,
  DocumentChunk
} from '../../types';
import { InteractiveGraphCanvas, getNodeColor } from './InteractiveGraphCanvas';
import {
  Search,
  Filter,
  Sliders,
  Sparkles,
  Share2,
  X,
  FileText,
  Layers,
  ChevronRight,
  ExternalLink,
  Info,
  Maximize2,
  RotateCcw
} from 'lucide-react';

interface KnowledgeGraphViewProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  documents: Document[];
  chunks: DocumentChunk[];
  onAskAboutEntity: (entityName: string) => void;
  onViewDoc: (doc: Document) => void;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  nodes,
  edges,
  documents,
  chunks,
  onAskAboutEntity,
  onViewDoc
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntityType, setSelectedEntityType] = useState<string>('ALL');
  const [selectedRelationType, setSelectedRelationType] = useState<string>('ALL');
  const [minConfidence, setMinConfidence] = useState<number>(0.65);

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);

  // Filter nodes and edges
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const matchesSearch =
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        selectedEntityType === 'ALL' || node.type === selectedEntityType;

      const matchesConfidence = node.confidence >= minConfidence;

      return matchesSearch && matchesType && matchesConfidence;
    });
  }, [nodes, searchTerm, selectedEntityType, minConfidence]);

  const activeNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  const filteredEdges = useMemo(() => {
    return edges.filter(edge => {
      const endpointsValid =
        activeNodeIds.has(edge.source) && activeNodeIds.has(edge.target);

      const matchesRelType =
        selectedRelationType === 'ALL' || edge.relationType === selectedRelationType;

      const matchesConfidence = edge.confidence >= minConfidence;

      return endpointsValid && matchesRelType && matchesConfidence;
    });
  }, [edges, activeNodeIds, selectedRelationType, minConfidence]);

  // Entity categories breakdown for left panel
  const entityCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    nodes.forEach(n => {
      counts[n.type] = (counts[n.type] || 0) + 1;
    });
    return counts;
  }, [nodes]);

  // Details for selected node
  const selectedNodeConnectedEdges = useMemo(() => {
    if (!selectedNode) return [];
    return edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id);
  }, [selectedNode, edges]);

  const supportingDocs = useMemo(() => {
    if (!selectedNode) return [];
    return documents.filter(d => selectedNode.sourceDocIds.includes(d.id));
  }, [selectedNode, documents]);

  const associatedChunks = useMemo(() => {
    if (!selectedNode) return [];
    return chunks.filter(c => c.entities.some(e => e.toLowerCase() === selectedNode.name.toLowerCase()));
  }, [selectedNode, chunks]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: 'calc(100vh - 140px)' }}>
      {/* Top Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          background: 'var(--white)',
          padding: '12px 18px',
          borderRadius: '8px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '340px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-text)' }}
          />
          <input
            type="text"
            placeholder="Search entities, authors, datasets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '34px', fontSize: '12.5px', padding: '7px 12px 7px 34px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--secondary-text)' }}>Entity Type:</span>
          <select
            value={selectedEntityType}
            onChange={(e) => setSelectedEntityType(e.target.value)}
            className="form-select"
            style={{ width: '130px', fontSize: '12px', padding: '6px 10px' }}
          >
            <option value="ALL">All Categories</option>
            <option value="Method">Method</option>
            <option value="Dataset">Dataset</option>
            <option value="Document">Document</option>
            <option value="Person">Person</option>
            <option value="Organization">Organization</option>
            <option value="Task">Task</option>
            <option value="Policy">Policy</option>
            <option value="Concept">Concept</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--secondary-text)' }}>Relationship:</span>
          <select
            value={selectedRelationType}
            onChange={(e) => setSelectedRelationType(e.target.value)}
            className="form-select"
            style={{ width: '135px', fontSize: '12px', padding: '6px 10px' }}
          >
            <option value="ALL">All Relations</option>
            <option value="uses">uses</option>
            <option value="evaluates">evaluates</option>
            <option value="supports">supports</option>
            <option value="authored_by">authored by</option>
            <option value="improves">improves</option>
            <option value="governed_by">governed by</option>
            <option value="cites">cites</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '170px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--secondary-text)' }}>
            Min Conf: {(minConfidence * 100).toFixed(0)}%
          </span>
          <input
            type="range"
            min="0.50"
            max="0.99"
            step="0.05"
            value={minConfidence}
            onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
            style={{ width: '90px', cursor: 'pointer' }}
          />
        </div>

        <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--secondary-text)', fontWeight: 600 }}>
          {filteredNodes.length} Nodes • {filteredEdges.length} Edges
        </div>
      </div>

      {/* Main 3-Section Working Area: Left Panel, Center Canvas, Right Inspector */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, gap: '16px' }}>
        {/* Left Categories Panel */}
        <div
          style={{
            width: '220px',
            background: 'var(--white)',
            borderRadius: '8px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-xs)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            overflowY: 'auto'
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={15} color="var(--primary-blue)" />
            <span>Entity Categories</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              onClick={() => setSelectedEntityType('ALL')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                background: selectedEntityType === 'ALL' ? 'var(--pale-blue-bg)' : 'transparent',
                color: selectedEntityType === 'ALL' ? 'var(--primary-navy)' : 'var(--secondary-text)',
                fontWeight: selectedEntityType === 'ALL' ? 700 : 500,
                fontSize: '12.5px',
                cursor: 'pointer'
              }}
            >
              <span>All Entities</span>
              <span className="badge badge-document">{nodes.length}</span>
            </button>

            {Object.entries(entityCategories).map(([type, count]) => {
              const colors = getNodeColor(type as EntityType);
              const isSelected = selectedEntityType === type;

              return (
                <button
                  key={type}
                  onClick={() => setSelectedEntityType(isSelected ? 'ALL' : type)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: isSelected ? 'var(--pale-blue-bg)' : 'transparent',
                    color: isSelected ? 'var(--primary-navy)' : 'var(--secondary-text)',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        backgroundColor: colors.fill
                      }}
                    />
                    <span>{type}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--muted-text)', fontWeight: 600 }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '8px' }}>
              Legend Guide
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: 'var(--secondary-text)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#006699' }} />
                <span>Concept / Method</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4B6584' }} />
                <span>Document / Study</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3E7B54' }} />
                <span>Author / Person</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2374AB' }} />
                <span>Dataset / Lab</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Interactive Canvas */}
        <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
          <InteractiveGraphCanvas
            nodes={filteredNodes}
            edges={filteredEdges}
            selectedNodeId={selectedNode?.id}
            selectedEdgeId={selectedEdge?.id}
            onSelectNode={(node) => {
              setSelectedNode(node);
              setSelectedEdge(null);
            }}
            onSelectEdge={(edge) => {
              setSelectedEdge(edge);
              setSelectedNode(null);
            }}
          />
        </div>

        {/* Right Node & Edge Inspector Panel */}
        {selectedNode && (
          <div
            style={{
              width: '320px',
              background: 'var(--white)',
              borderRadius: '8px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <span className="badge badge-concept" style={{ marginBottom: '6px' }}>
                  {selectedNode.type}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary-navy)', lineHeight: 1.2 }}>
                  {selectedNode.name}
                </h3>
              </div>
              <button onClick={() => setSelectedNode(null)} className="btn-ghost" style={{ padding: '4px' }}>
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--secondary-text)', lineHeight: 1.4 }}>
              {selectedNode.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--pale-blue-bg)', borderRadius: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--primary-navy)', fontWeight: 600 }}>Confidence Score</span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary-blue)' }}>
                {(selectedNode.confidence * 100).toFixed(0)}%
              </span>
            </div>

            {/* Quick Action Button: Ask about this entity */}
            <button
              onClick={() => onAskAboutEntity(selectedNode.name)}
              className="btn btn-primary btn-sm"
              style={{ width: '100%', gap: '6px' }}
            >
              <Sparkles size={14} />
              <span>Ask About This Entity</span>
            </button>

            {/* Connected Entities */}
            <div>
              <div className="stat-label">Connected Graph Links ({selectedNodeConnectedEdges.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                {selectedNodeConnectedEdges.map(edge => {
                  const isSource = edge.source === selectedNode.id;
                  const otherId = isSource ? edge.target : edge.source;
                  const otherNode = nodes.find(n => n.id === otherId);

                  return (
                    <div
                      key={edge.id}
                      onClick={() => otherNode && setSelectedNode(otherNode)}
                      style={{
                        padding: '8px 10px',
                        background: 'var(--surface-bg)',
                        borderRadius: '6px',
                        border: '1px solid var(--border-light)',
                        cursor: 'pointer',
                        fontSize: '11.5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span style={{ color: 'var(--primary-blue)', fontWeight: 600, marginRight: '4px' }}>
                          {isSource ? '➔' : '🠔'} {edge.relationType.replace('_', ' ')}:
                        </span>
                        <span style={{ fontWeight: 600, color: 'var(--primary-navy)' }}>
                          {otherNode?.name || otherId}
                        </span>
                      </div>
                      <ChevronRight size={13} color="var(--muted-text)" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Supporting Publications */}
            {supportingDocs.length > 0 && (
              <div>
                <div className="stat-label">Supporting Publications ({supportingDocs.length})</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                  {supportingDocs.map(doc => (
                    <div
                      key={doc.id}
                      onClick={() => onViewDoc(doc)}
                      style={{
                        padding: '8px 10px',
                        background: 'var(--surface-bg)',
                        borderRadius: '6px',
                        border: '1px solid var(--border-light)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary-navy)', lineHeight: 1.2 }}>
                        {doc.title}
                      </div>
                      <div style={{ fontSize: '10.5px', color: 'var(--muted-text)', marginTop: '2px' }}>
                        {doc.authors.join(', ')} • {doc.year}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Edge Inspector Panel */}
        {selectedEdge && (
          <div
            style={{
              width: '320px',
              background: 'var(--white)',
              borderRadius: '8px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <span className="badge badge-dataset" style={{ marginBottom: '6px' }}>
                  Relationship Triplet
                </span>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary-navy)', lineHeight: 1.3 }}>
                  {nodes.find(n => n.id === selectedEdge.source)?.name}
                  <span style={{ color: 'var(--primary-blue)', margin: '0 6px' }}>
                    --[{selectedEdge.relationType.replace('_', ' ')}]--&gt;
                  </span>
                  {nodes.find(n => n.id === selectedEdge.target)?.name}
                </h3>
              </div>
              <button onClick={() => setSelectedEdge(null)} className="btn-ghost" style={{ padding: '4px' }}>
                <X size={16} />
              </button>
            </div>

            <div>
              <div className="stat-label">Source Evidence Excerpt</div>
              <div
                style={{
                  fontSize: '12.5px',
                  color: 'var(--dark-text)',
                  fontStyle: 'italic',
                  background: 'var(--pale-blue-bg)',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--light-blue-gray)',
                  lineHeight: 1.4
                }}
              >
                "{selectedEdge.evidenceText}"
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ padding: '8px', background: 'var(--surface-bg)', borderRadius: '6px' }}>
                <div className="stat-label">Confidence</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-blue)' }}>
                  {(selectedEdge.confidence * 100).toFixed(0)}%
                </div>
              </div>
              <div style={{ padding: '8px', background: 'var(--surface-bg)', borderRadius: '6px' }}>
                <div className="stat-label">Page Ref</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-navy)' }}>
                  {selectedEdge.pageRef}
                </div>
              </div>
            </div>

            <div>
              <div className="stat-label">Published In</div>
              <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--primary-navy)' }}>
                {selectedEdge.sourceDocTitle}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
