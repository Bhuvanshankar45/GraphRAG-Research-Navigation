import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GraphNode, GraphEdge, EntityType } from '../../types';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';

interface InteractiveGraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId?: string | null;
  selectedEdgeId?: string | null;
  onSelectNode?: (node: GraphNode | null) => void;
  onSelectEdge?: (edge: GraphEdge | null) => void;
  isCompact?: boolean;
  highlightRetrievedOnly?: boolean;
}

// Colors according to visual direction:
export const getNodeColor = (type: EntityType): { fill: string; stroke: string; text: string } => {
  switch (type) {
    case 'Method':
    case 'Concept':
    case 'Technology':
      return { fill: '#006699', stroke: '#3399CC', text: '#FFFFFF' };
    case 'Document':
      return { fill: '#4B6584', stroke: '#A4B8D4', text: '#FFFFFF' };
    case 'Person':
      return { fill: '#3E7B54', stroke: '#BFD3C1', text: '#FFFFFF' };
    case 'Organization':
    case 'Dataset':
      return { fill: '#2374AB', stroke: '#66B3E3', text: '#FFFFFF' };
    case 'Policy':
      return { fill: '#8C5383', stroke: '#D7BDE2', text: '#FFFFFF' };
    case 'Event':
    case 'Topic':
    case 'Product':
      return { fill: '#2C82C9', stroke: '#A9CCE3', text: '#FFFFFF' };
    default:
      return { fill: '#003366', stroke: '#66B3E3', text: '#FFFFFF' };
  }
};

interface SimNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isDragging?: boolean;
}

export const InteractiveGraphCanvas: React.FC<InteractiveGraphCanvasProps> = ({
  nodes,
  edges,
  selectedNodeId,
  selectedEdgeId,
  onSelectNode,
  onSelectEdge,
  isCompact = false,
  highlightRetrievedOnly = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Transform state: pan & zoom
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [hoveredNode, setHoveredNode] = useState<SimNode | null>(null);

  // Simulation node positions map
  const simNodesRef = useRef<Map<string, SimNode>>(new Map());
  const isDraggingRef = useRef(false);
  const dragTargetRef = useRef<SimNode | null>(null);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const isPanningRef = useRef(false);
  const animFrameIdRef = useRef<number | null>(null);

  // Initialize or update node positions
  useEffect(() => {
    const width = containerRef.current?.clientWidth || (isCompact ? 500 : 800);
    const height = containerRef.current?.clientHeight || (isCompact ? 320 : 600);
    const centerX = width / 2;
    const centerY = height / 2;

    const currentMap = simNodesRef.current;
    const newMap = new Map<string, SimNode>();

    const count = nodes.length;
    nodes.forEach((n, i) => {
      const existing = currentMap.get(n.id);
      if (existing) {
        newMap.set(n.id, {
          ...n,
          x: existing.x,
          y: existing.y,
          vx: existing.vx * 0.5,
          vy: existing.vy * 0.5,
          radius: Math.max(16, Math.min(28, 14 + (n.degree || 2) * 1.5))
        });
      } else {
        // Distribute nicely in an orbital pattern initially
        const angle = (i / Math.max(1, count)) * 2 * Math.PI;
        const radiusDist = isCompact ? 110 + (i % 3) * 35 : 180 + (i % 4) * 45;
        newMap.set(n.id, {
          ...n,
          x: centerX + Math.cos(angle) * radiusDist + (Math.random() - 0.5) * 40,
          y: centerY + Math.sin(angle) * radiusDist + (Math.random() - 0.5) * 40,
          vx: 0,
          vy: 0,
          radius: Math.max(16, Math.min(28, 14 + (n.degree || 2) * 1.5))
        });
      }
    });

    simNodesRef.current = newMap;
  }, [nodes, isCompact]);

  // Force-directed simulation step
  const runSimulationStep = useCallback(() => {
    const nodeArray = Array.from(simNodesRef.current.values());
    if (nodeArray.length === 0) return;

    const width = containerRef.current?.clientWidth || 800;
    const height = containerRef.current?.clientHeight || 600;
    const centerX = width / 2;
    const centerY = height / 2;

    // Node-Node Repulsion (Coulomb-like)
    for (let i = 0; i < nodeArray.length; i++) {
      const nodeA = nodeArray[i];
      for (let j = i + 1; j < nodeArray.length; j++) {
        const nodeB = nodeArray[j];
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const distSq = dx * dx + dy * dy || 1;
        const dist = Math.sqrt(distSq);

        const minDist = nodeA.radius + nodeB.radius + 35;
        if (dist < 400) {
          const force = (dist < minDist ? 450 : 250) / distSq;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (!nodeA.isDragging) {
            nodeA.vx -= fx;
            nodeA.vy -= fy;
          }
          if (!nodeB.isDragging) {
            nodeB.vx += fx;
            nodeB.vy += fy;
          }
        }
      }

      // Center Gravity
      const cdx = centerX - nodeA.x;
      const cdy = centerY - nodeA.y;
      const cdist = Math.sqrt(cdx * cdx + cdy * cdy) || 1;
      const gravity = isCompact ? 0.04 : 0.02;
      if (!nodeA.isDragging) {
        nodeA.vx += (cdx / cdist) * cdist * gravity;
        nodeA.vy += (cdy / cdist) * cdist * gravity;
      }
    }

    // Edge Springs (Hooke's Law)
    const springLength = isCompact ? 90 : 130;
    const springStrength = 0.05;

    edges.forEach(edge => {
      const source = simNodesRef.current.get(edge.source);
      const target = simNodesRef.current.get(edge.target);
      if (!source || !target) return;

      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = (dist - springLength) * springStrength;

      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      if (!source.isDragging) {
        source.vx += fx;
        source.vy += fy;
      }
      if (!target.isDragging) {
        target.vx -= fx;
        target.vy -= fy;
      }
    });

    // Velocity update & damping
    const damping = 0.72;
    nodeArray.forEach(node => {
      if (!node.isDragging) {
        node.vx *= damping;
        node.vy *= damping;

        // Cap max velocity
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > 12) {
          node.vx = (node.vx / speed) * 12;
          node.vy = (node.vy / speed) * 12;
        }

        node.x += node.vx;
        node.y += node.vy;
      }
    });
  }, [edges, isCompact]);

  // Main Render Loop
  useEffect(() => {
    let active = true;

    const render = () => {
      if (!active) return;
      runSimulationStep();

      const canvas = canvasRef.current;
      if (canvas && containerRef.current) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const width = containerRef.current.clientWidth;
          const height = containerRef.current.clientHeight;
          const dpr = window.devicePixelRatio || 1;

          if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
          }

          ctx.save();
          ctx.scale(dpr, dpr);
          ctx.clearRect(0, 0, width, height);

          // Background subtle grid
          ctx.save();
          ctx.strokeStyle = '#EDF2F7';
          ctx.lineWidth = 1;
          const gridSize = 40 * transform.scale;
          const offsetX = transform.x % gridSize;
          const offsetY = transform.y % gridSize;

          ctx.beginPath();
          for (let x = offsetX; x < width; x += gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
          }
          for (let y = offsetY; y < height; y += gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
          }
          ctx.stroke();
          ctx.restore();

          // Apply Pan & Zoom Transform
          ctx.save();
          ctx.translate(transform.x, transform.y);
          ctx.scale(transform.scale, transform.scale);

          // Build neighbor lookup for active selection
          const connectedNodeIds = new Set<string>();
          if (selectedNodeId) {
            connectedNodeIds.add(selectedNodeId);
            edges.forEach(e => {
              if (e.source === selectedNodeId) connectedNodeIds.add(e.target);
              if (e.target === selectedNodeId) connectedNodeIds.add(e.source);
            });
          }

          // 1. Draw Edges
          edges.forEach(edge => {
            const source = simNodesRef.current.get(edge.source);
            const target = simNodesRef.current.get(edge.target);
            if (!source || !target) return;

            const isSelected = selectedEdgeId === edge.id;
            const isConnectedToSelectedNode =
              selectedNodeId && (edge.source === selectedNodeId || edge.target === selectedNodeId);

            const isDimmed =
              selectedNodeId && !isConnectedToSelectedNode && !isSelected;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(source.x, source.y);
            ctx.lineTo(target.x, target.y);

            if (isSelected) {
              ctx.strokeStyle = '#006699';
              ctx.lineWidth = 3;
            } else if (isConnectedToSelectedNode) {
              ctx.strokeStyle = '#3399CC';
              ctx.lineWidth = 2.5;
            } else if (edge.relationType === 'contradicts') {
              ctx.strokeStyle = isDimmed ? 'rgba(233, 69, 96, 0.2)' : 'rgba(233, 69, 96, 0.7)';
              ctx.lineWidth = 1.8;
              ctx.setLineDash([4, 4]);
            } else {
              ctx.strokeStyle = isDimmed ? 'rgba(164, 184, 212, 0.2)' : 'rgba(164, 184, 212, 0.75)';
              ctx.lineWidth = 1.5;
            }
            ctx.stroke();

            // Arrow head
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const arrowAngle = Math.atan2(dy, dx);
            const arrowSize = isSelected || isConnectedToSelectedNode ? 8 : 6;

            // Offset arrow just outside target node radius
            const arrowX = target.x - (dx / dist) * (target.radius + 3);
            const arrowY = target.y - (dy / dist) * (target.radius + 3);

            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(
              arrowX - arrowSize * Math.cos(arrowAngle - Math.PI / 6),
              arrowY - arrowSize * Math.sin(arrowAngle - Math.PI / 6)
            );
            ctx.lineTo(
              arrowX - arrowSize * Math.cos(arrowAngle + Math.PI / 6),
              arrowY - arrowSize * Math.sin(arrowAngle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fillStyle = ctx.strokeStyle;
            ctx.fill();

            // Edge relation text label (if not dimmed and scale permits)
            if (!isDimmed && transform.scale > 0.65) {
              const midX = (source.x + target.x) / 2;
              const midY = (source.y + target.y) / 2;

              ctx.font = '10px Inter, sans-serif';
              const text = edge.relationType.replace('_', ' ');
              const textMetrics = ctx.measureText(text);

              ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
              ctx.fillRect(
                midX - textMetrics.width / 2 - 3,
                midY - 7,
                textMetrics.width + 6,
                14
              );

              ctx.fillStyle = isConnectedToSelectedNode ? '#003366' : '#4B4B4D';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(text, midX, midY);
            }

            ctx.restore();
          });

          // 2. Draw Nodes
          simNodesRef.current.forEach(node => {
            const isSelected = selectedNodeId === node.id;
            const isConnected = connectedNodeIds.has(node.id);
            const isHovered = hoveredNode?.id === node.id;

            const isDimmed = selectedNodeId && !isSelected && !isConnected;

            const colors = getNodeColor(node.type);

            ctx.save();

            // Node Outer Glow / Highlight when selected or retrieved
            if (isSelected) {
              ctx.beginPath();
              ctx.arc(node.x, node.y, node.radius + 7, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(51, 153, 204, 0.3)';
              ctx.fill();

              ctx.beginPath();
              ctx.arc(node.x, node.y, node.radius + 3, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(0, 51, 102, 0.4)';
              ctx.fill();
            } else if (node.isRetrieved && highlightRetrievedOnly) {
              ctx.beginPath();
              ctx.arc(node.x, node.y, node.radius + 5, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(102, 179, 227, 0.25)';
              ctx.fill();
            }

            // Main Circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = isDimmed ? '#D9E3F0' : colors.fill;
            ctx.fill();

            ctx.lineWidth = isSelected ? 3 : 2;
            ctx.strokeStyle = isDimmed ? '#B8C7DA' : colors.stroke;
            ctx.stroke();

            // Node inner badge icon or initial
            ctx.font = `600 ${Math.max(10, node.radius * 0.75)}px Inter, sans-serif`;
            ctx.fillStyle = isDimmed ? '#9B9B9B' : colors.text;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const initial = node.type.charAt(0).toUpperCase();
            ctx.fillText(initial, node.x, node.y);

            // Node Name Label
            ctx.font = isSelected ? '600 12px Inter, sans-serif' : '500 11px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';

            const labelText = node.name.length > 22 ? `${node.name.slice(0, 20)}…` : node.name;
            const textMetrics = ctx.measureText(labelText);

            // Subtle label pill background
            ctx.fillStyle = isSelected ? 'rgba(0, 51, 102, 0.92)' : 'rgba(255, 255, 255, 0.9)';
            ctx.fillRect(
              node.x - textMetrics.width / 2 - 4,
              node.y + node.radius + 4,
              textMetrics.width + 8,
              16
            );

            ctx.fillStyle = isSelected ? '#FFFFFF' : (isDimmed ? '#9B9B9B' : '#2C3E50');
            ctx.fillText(labelText, node.x, node.y + node.radius + 6);

            ctx.restore();
          });

          ctx.restore(); // restore pan/zoom transform
          ctx.restore(); // restore dpr scale
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [edges, selectedNodeId, selectedEdgeId, transform, hoveredNode, runSimulationStep, highlightRetrievedOnly]);

  // Coordinate conversion helper
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>): { worldX: number; worldY: number; clientX: number; clientY: number } => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { worldX: 0, worldY: 0, clientX: 0, clientY: 0 };
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Convert screen coordinates to world coordinates
    const worldX = (clientX - transform.x) / transform.scale;
    const worldY = (clientY - transform.y) / transform.scale;

    return { worldX, worldY, clientX, clientY };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { worldX, worldY, clientX, clientY } = getCanvasCoords(e);

    // Check if clicked a node
    let clickedNode: SimNode | null = null;
    for (const node of simNodesRef.current.values()) {
      const dx = worldX - node.x;
      const dy = worldY - node.y;
      if (Math.sqrt(dx * dx + dy * dy) <= node.radius + 4) {
        clickedNode = node;
        break;
      }
    }

    if (clickedNode) {
      dragTargetRef.current = clickedNode;
      clickedNode.isDragging = true;
      isDraggingRef.current = true;
      dragStartPosRef.current = { x: clientX, y: clientY };
      onSelectNode?.(clickedNode);
    } else {
      // Check if clicked an edge
      let clickedEdge: GraphEdge | null = null;
      for (const edge of edges) {
        const source = simNodesRef.current.get(edge.source);
        const target = simNodesRef.current.get(edge.target);
        if (source && target) {
          // Distance from point to segment
          const d = distToSegment({ x: worldX, y: worldY }, source, target);
          if (d < 8) {
            clickedEdge = edge;
            break;
          }
        }
      }

      if (clickedEdge) {
        onSelectEdge?.(clickedEdge);
      } else {
        // Start Canvas Panning
        isPanningRef.current = true;
        panStartRef.current = { x: clientX - transform.x, y: clientY - transform.y };
        onSelectNode?.(null);
        onSelectEdge?.(null);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { worldX, worldY, clientX, clientY } = getCanvasCoords(e);

    if (isDraggingRef.current && dragTargetRef.current) {
      dragTargetRef.current.x = worldX;
      dragTargetRef.current.y = worldY;
      dragTargetRef.current.vx = 0;
      dragTargetRef.current.vy = 0;
      return;
    }

    if (isPanningRef.current) {
      setTransform(prev => ({
        ...prev,
        x: clientX - panStartRef.current.x,
        y: clientY - panStartRef.current.y
      }));
      return;
    }

    // Hover detection
    let hoverFound: SimNode | null = null;
    for (const node of simNodesRef.current.values()) {
      const dx = worldX - node.x;
      const dy = worldY - node.y;
      if (Math.sqrt(dx * dx + dy * dy) <= node.radius + 4) {
        hoverFound = node;
        break;
      }
    }
    setHoveredNode(hoverFound);
  };

  const handleMouseUp = () => {
    if (dragTargetRef.current) {
      dragTargetRef.current.isDragging = false;
      dragTargetRef.current = null;
    }
    isDraggingRef.current = false;
    isPanningRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = Math.min(2.5, Math.max(0.35, transform.scale * zoomFactor));

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setTransform(prev => ({
      scale: newScale,
      x: mouseX - (mouseX - prev.x) * (newScale / prev.scale),
      y: mouseY - (mouseY - prev.y) * (newScale / prev.scale)
    }));
  };

  const resetView = () => {
    const width = containerRef.current?.clientWidth || 800;
    const height = containerRef.current?.clientHeight || 600;

    setTransform({
      x: 0,
      y: 0,
      scale: isCompact ? 0.85 : 1
    });
  };

  const zoomIn = () => {
    setTransform(prev => ({ ...prev, scale: Math.min(2.5, prev.scale * 1.25) }));
  };

  const zoomOut = () => {
    setTransform(prev => ({ ...prev, scale: Math.max(0.35, prev.scale * 0.8) }));
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: isCompact ? '320px' : '100%',
        minHeight: isCompact ? '320px' : '520px',
        backgroundColor: '#FFFFFF',
        borderRadius: isCompact ? '8px' : '10px',
        overflow: 'hidden',
        border: '1px solid var(--border-light)'
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          cursor: isDraggingRef.current ? 'grabbing' : (hoveredNode ? 'pointer' : 'grab')
        }}
      />

      {/* Floating Toolbar */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          display: 'flex',
          gap: '6px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '4px',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-light)',
          zIndex: 10
        }}
      >
        <button
          onClick={zoomIn}
          title="Zoom In"
          className="btn-ghost"
          style={{ padding: '6px', borderRadius: '5px', cursor: 'pointer' }}
        >
          <ZoomIn size={16} color="var(--primary-navy)" />
        </button>
        <button
          onClick={zoomOut}
          title="Zoom Out"
          className="btn-ghost"
          style={{ padding: '6px', borderRadius: '5px', cursor: 'pointer' }}
        >
          <ZoomOut size={16} color="var(--primary-navy)" />
        </button>
        <button
          onClick={resetView}
          title="Fit & Reset View"
          className="btn-ghost"
          style={{ padding: '6px', borderRadius: '5px', cursor: 'pointer' }}
        >
          <RotateCcw size={16} color="var(--primary-navy)" />
        </button>
      </div>

      {/* Node Hover Tooltip Card */}
      {hoveredNode && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: 'rgba(0, 51, 102, 0.95)',
            color: '#FFFFFF',
            padding: '10px 14px',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-lg)',
            pointerEvents: 'none',
            maxWidth: '280px',
            zIndex: 20,
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'var(--soft-blue)'
              }}
            >
              {hoveredNode.type}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--muted-green)' }}>
              Confidence: {(hoveredNode.confidence * 100).toFixed(0)}%
            </span>
          </div>
          <div style={{ fontWeight: 700, fontSize: '13px', lineHeight: 1.2 }}>{hoveredNode.name}</div>
          <div style={{ fontSize: '11.5px', color: 'var(--light-blue-gray)', marginTop: '4px', lineHeight: 1.3 }}>
            {hoveredNode.description}
          </div>
        </div>
      )}
    </div>
  );
};

// Math helper for distance to line segment
function distToSegment(
  p: { x: number; y: number },
  v: { x: number; y: number },
  w: { x: number; y: number }
) {
  const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2;
  if (l2 === 0) return Math.sqrt((p.x - v.x) ** 2 + (p.y - v.y) ** 2);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.sqrt(
    (p.x - (v.x + t * (w.x - v.x))) ** 2 + (p.y - (v.y + t * (w.y - v.y))) ** 2
  );
}
