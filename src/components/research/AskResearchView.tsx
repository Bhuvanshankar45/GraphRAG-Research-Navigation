import React, { useState, useEffect, useRef } from 'react';
import {
  QueryConfig,
  AnswerResult,
  ReasoningStep,
  SupportingEvidence,
  GraphNode,
  Document
} from '../../types';
import { GraphRAGService } from '../../services/graphRagEngine';
import { InteractiveGraphCanvas } from '../graph/InteractiveGraphCanvas';
import { sampleQuestions } from '../../data/seedData';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Send,
  Sliders,
  ChevronDown,
  ChevronUp,
  Layers,
  Share2,
  Copy,
  Check,
  Download,
  BookmarkPlus,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Activity,
  ArrowRight,
  ExternalLink,
  Info,
  Maximize2,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';

interface AskResearchViewProps {
  graphRagService: GraphRAGService;
  onSaveInvestigation: (answer: AnswerResult, title: string, tags: string[]) => void;
  onOpenExplorerWithNodes: () => void;
  onViewDoc: (docId: string) => void;
  initialQuestion?: string;
  initialAnswer?: AnswerResult | null;
  sampleQuestionsList?: { question: string; category: string; description: string }[];
}

export const AskResearchView: React.FC<AskResearchViewProps> = ({
  graphRagService,
  onSaveInvestigation,
  onOpenExplorerWithNodes,
  onViewDoc,
  initialQuestion = '',
  initialAnswer = null,
  sampleQuestionsList
}) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Configuration options
  const [mode, setMode] = useState<'hybrid' | 'vector' | 'graph'>('hybrid');
  const [depth, setDepth] = useState<1 | 2 | 3>(3);
  const [maxSources, setMaxSources] = useState(5);
  const [prioritizeRecent, setPrioritizeRecent] = useState(true);
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [answerStyle, setAnswerStyle] = useState<'Concise' | 'Analytical' | 'Detailed'>('Analytical');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Current Answer
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(initialAnswer);

  // UI state
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState<'up' | 'down' | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [investigationTitle, setInvestigationTitle] = useState('');
  const [investigationTags, setInvestigationTags] = useState('BioASQ, GraphRAG, Authorship');

  // Follow-up input state
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpQuery, setFollowUpQuery] = useState('');

  // Selected step/node from reasoning path
  const [selectedEntityInfo, setSelectedEntityInfo] = useState<ReasoningStep | null>(null);

  // Handle incoming initialQuestion or initialAnswer
  useEffect(() => {
    if (initialQuestion && !initialAnswer) {
      setQuestion(initialQuestion);
      executeSearch(initialQuestion);
    }
  }, [initialQuestion]);

  useEffect(() => {
    if (initialAnswer) {
      setAnswerResult(initialAnswer);
      setQuestion(initialAnswer.question);
    }
  }, [initialAnswer]);

  const executeSearch = async (queryToRun: string) => {
    if (!queryToRun.trim()) return;

    setIsLoading(true);
    setLoadingStep(1);

    const config: QueryConfig = {
      mode,
      depth,
      maxSources,
      prioritizeRecent,
      verifiedOnly,
      style: answerStyle
    };

    // Step-by-step progress animation ticker
    const timer1 = setTimeout(() => setLoadingStep(2), 350);
    const timer2 = setTimeout(() => setLoadingStep(3), 750);
    const timer3 = setTimeout(() => setLoadingStep(4), 1150);

    try {
      const result = await graphRagService.executeQuery(queryToRun, config);
      setTimeout(() => {
        setAnswerResult(result);
        setIsLoading(false);
        setInvestigationTitle(`Investigation: ${queryToRun.slice(0, 42)}…`);
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const handleCopyAnswer = () => {
    if (!answerResult) return;
    navigator.clipboard.writeText(answerResult.answerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveInvestigation = () => {
    if (!answerResult) return;
    const tags = investigationTags.split(',').map(t => t.trim()).filter(Boolean);
    onSaveInvestigation(answerResult, investigationTitle || 'Scientific Investigation', tags);
    setSaveModalOpen(false);

    // Confetti celebration
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (e) {
      // fallback
    }
  };

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuery.trim()) return;
    const combined = `${question} -> Follow-up: ${followUpQuery}`;
    setQuestion(combined);
    setShowFollowUp(false);
    setFollowUpQuery('');
    executeSearch(combined);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Query Search Card */}
      <div className="card" style={{ padding: '24px', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label className="form-label" style={{ fontSize: '14px', marginBottom: 0 }}>
              Multi-Hop Research Question
            </label>

            {/* Retrieval Mode Segmented Control */}
            <div className="segmented-control">
              <button
                type="button"
                onClick={() => setMode('hybrid')}
                className={`segmented-option ${mode === 'hybrid' ? 'active' : ''}`}
                title="Combines semantic chunk retrieval with graph traversal"
              >
                <Sparkles size={13} style={{ marginRight: '4px', verticalAlign: 'middle', color: mode === 'hybrid' ? 'var(--primary-blue)' : undefined }} />
                Hybrid GraphRAG
              </button>
              <button
                type="button"
                onClick={() => setMode('vector')}
                className={`segmented-option ${mode === 'vector' ? 'active' : ''}`}
                title="Standard dense embeddings only without graph path traversal"
              >
                Vector Search Only
              </button>
              <button
                type="button"
                onClick={() => setMode('graph')}
                className={`segmented-option ${mode === 'graph' ? 'active' : ''}`}
                title="Graph edges traversal only without chunk grounding"
              >
                Knowledge Graph Only
              </button>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a multi-hop question across your research collection (e.g. Which method was evaluated on BioASQ, what task does it support, and which author is associated with the relevant research paper?)..."
              className="form-textarea"
              style={{
                minHeight: '84px',
                fontSize: '14.5px',
                paddingRight: '120px',
                lineHeight: 1.5,
                borderColor: 'var(--border-gray)'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  executeSearch(question);
                }
              }}
            />
            <button
              onClick={() => executeSearch(question)}
              disabled={isLoading || !question.trim()}
              className="btn btn-primary"
              style={{
                position: 'absolute',
                right: '12px',
                bottom: '14px',
                padding: '9px 18px',
                borderRadius: '7px'
              }}
            >
              {isLoading ? (
                <>
                  <Activity size={15} className="spinner" />
                  <span>Traversing...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Synthesize</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--muted-text)', fontWeight: 600 }}>
            Example Questions:
          </span>
          {(sampleQuestionsList || sampleQuestions).map((sq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setQuestion(sq.question);
                executeSearch(sq.question);
              }}
              style={{
                fontSize: '11.5px',
                background: 'var(--pale-blue-bg)',
                border: '1px solid var(--light-blue-gray)',
                borderRadius: '16px',
                padding: '4px 11px',
                color: 'var(--primary-navy)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)'
              }}
              className="chip-btn"
            >
              {sq.question.length > 55 ? `${sq.question.slice(0, 52)}…` : sq.question}
            </button>
          ))}
        </div>

        {/* Advanced Controls Toggle */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="btn-ghost btn-sm"
            style={{ padding: '4px 8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sliders size={13} />
            <span>Advanced Retrieval Controls</span>
            {showAdvanced ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {showAdvanced && (
            <div
              style={{
                marginTop: '12px',
                padding: '16px',
                background: 'var(--surface-bg)',
                borderRadius: '8px',
                border: '1px solid var(--border-light)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}
            >
              <div>
                <label className="form-label" style={{ fontSize: '11.5px' }}>
                  Graph Traversal Depth: {depth} Hop{depth > 1 ? 's' : ''}
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {([1, 2, 3] as const).map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDepth(d)}
                      className={`btn btn-sm ${depth === d ? 'btn-primary' : 'btn-outline'}`}
                      style={{ flex: 1, padding: '4px' }}
                    >
                      {d} {d === 1 ? 'Hop' : 'Hops'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '11.5px' }}>
                  Max Evidence Sources: {maxSources}
                </label>
                <select
                  value={maxSources}
                  onChange={(e) => setMaxSources(Number(e.target.value))}
                  className="form-select"
                  style={{ fontSize: '12px', padding: '5px 8px' }}
                >
                  <option value={3}>3 Sources</option>
                  <option value={5}>5 Sources (Recommended)</option>
                  <option value={8}>8 Sources</option>
                  <option value={12}>12 Sources (Broad)</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '11.5px' }}>
                  Answer Tone & Style
                </label>
                <select
                  value={answerStyle}
                  onChange={(e) => setAnswerStyle(e.target.value as any)}
                  className="form-select"
                  style={{ fontSize: '12px', padding: '5px 8px' }}
                >
                  <option value="Analytical">Analytical (Default)</option>
                  <option value="Concise">Concise Briefing</option>
                  <option value="Detailed">Detailed Academic Report</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={prioritizeRecent}
                    onChange={(e) => setPrioritizeRecent(e.target.checked)}
                  />
                  <span>Prioritize Recent Studies</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                  />
                  <span>Verified Relations Only (&gt;= 85%)</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State Animation with Progress Ticker */}
      {isLoading && (
        <div className="card" style={{ padding: '36px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'var(--pale-blue-bg)', marginBottom: '16px' }}>
            <Sparkles size={32} color="var(--primary-blue)" className="spinner" />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '6px' }}>
            Executing Hybrid GraphRAG Retrieval
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--secondary-text)', maxWidth: '480px', margin: '0 auto 20px' }}>
            Combining vector similarity over 1536-dim chunk embeddings with {depth}-hop knowledge graph traversal.
          </p>

          <div style={{ maxWidth: '420px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: loadingStep >= 1 ? 'var(--primary-blue)' : 'var(--muted-text)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: loadingStep >= 1 ? 'var(--primary-blue)' : '#CBD5E1' }} />
              <span>Detecting entities and question intent...</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: loadingStep >= 2 ? 'var(--primary-blue)' : 'var(--muted-text)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: loadingStep >= 2 ? 'var(--primary-blue)' : '#CBD5E1' }} />
              <span>Retrieving top semantic vector chunks...</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: loadingStep >= 3 ? 'var(--primary-blue)' : 'var(--muted-text)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: loadingStep >= 3 ? 'var(--primary-blue)' : '#CBD5E1' }} />
              <span>Traversing {depth} hops across relational graph edges...</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: loadingStep >= 4 ? 'var(--primary-blue)' : 'var(--muted-text)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: loadingStep >= 4 ? 'var(--primary-blue)' : '#CBD5E1' }} />
              <span>Synthesizing grounded citations and reasoning path...</span>
            </div>
          </div>
        </div>
      )}

      {/* Answer and Evidence View */}
      {answerResult && !isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Main Answer Card */}
          <div className="card" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="card-header" style={{ background: '#F8FAFD' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={18} color="var(--primary-blue)" />
                <span className="card-title">Synthesized Answer & Citation Trace</span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: answerResult.diagnostics.overallConfidence >= 0.9 ? '#EAF7EE' : 'var(--pale-blue-bg)',
                    color: answerResult.diagnostics.overallConfidence >= 0.9 ? '#1E7E34' : 'var(--primary-navy)',
                    border: '1px solid #C3E6CB'
                  }}
                >
                  {(answerResult.diagnostics.overallConfidence * 100).toFixed(0)}% Grounded
                </span>
              </div>

              {/* Action Buttons Bar */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleCopyAnswer}
                  className="btn btn-outline btn-sm"
                  title="Copy formatted answer text"
                >
                  {copied ? <Check size={14} color="#2ECC71" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => setSaveModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  title="Save investigation to library"
                >
                  <BookmarkPlus size={14} />
                  <span>Save Investigation</span>
                </button>
              </div>
            </div>

            <div className="card-body">
              {/* Answer Text with Markdown Paragraphs */}
              <div
                style={{
                  fontSize: '14.5px',
                  color: 'var(--dark-text)',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {answerResult.answerText}
              </div>

              {/* Feedback buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', marginTop: '20px', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>Was this evidence accurate?</span>
                  <button
                    onClick={() => setFeedbackSent('up')}
                    className={`btn-ghost ${feedbackSent === 'up' ? 'active' : ''}`}
                    style={{ padding: '4px 8px', borderRadius: '4px', color: feedbackSent === 'up' ? '#2ECC71' : undefined }}
                  >
                    <ThumbsUp size={14} />
                  </button>
                  <button
                    onClick={() => setFeedbackSent('down')}
                    className={`btn-ghost ${feedbackSent === 'down' ? 'active' : ''}`}
                    style={{ padding: '4px 8px', borderRadius: '4px', color: feedbackSent === 'down' ? 'var(--destructive-red)' : undefined }}
                  >
                    <ThumbsDown size={14} />
                  </button>
                  {feedbackSent && (
                    <span style={{ fontSize: '11px', color: 'var(--primary-blue)', fontWeight: 600 }}>
                      Thank you for your feedback!
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setShowFollowUp(!showFollowUp)}
                  className="btn btn-outline btn-sm"
                >
                  <MessageSquare size={13} />
                  <span>Ask Follow-up</span>
                </button>
              </div>

              {/* Follow-up query form */}
              {showFollowUp && (
                <form onSubmit={handleFollowUpSubmit} style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={followUpQuery}
                    onChange={(e) => setFollowUpQuery(e.target.value)}
                    placeholder="Ask a clarifying or follow-up question related to this finding..."
                    className="form-input"
                    style={{ fontSize: '13px' }}
                    autoFocus
                  />
                  <button type="submit" className="btn btn-primary btn-sm">
                    Submit
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Reasoning Path Section */}
          {answerResult.reasoningPaths.length > 0 && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <Share2 size={18} color="var(--primary-blue)" />
                  <span>Multi-Hop Reasoning Path</span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                  {answerResult.reasoningPaths.length} connecting steps traversed
                </span>
              </div>

              <div className="card-body">
                <div style={{ fontSize: '12.5px', color: 'var(--secondary-text)', marginBottom: '10px' }}>
                  Click any entity or relational hop to inspect its evidence:
                </div>

                <div className="reasoning-chain">
                  {answerResult.reasoningPaths.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <button
                        type="button"
                        onClick={() => setSelectedEntityInfo(step)}
                        className="reasoning-node-pill"
                        title={`Click to inspect ${step.fromNodeName}`}
                      >
                        <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--primary-blue)' }}>
                          [{step.fromNodeType}]
                        </span>
                        <span>{step.fromNodeName}</span>
                      </button>

                      <div
                        onClick={() => setSelectedEntityInfo(step)}
                        className="reasoning-rel-arrow"
                        title={`Click to view relationship: ${step.relationType}`}
                        style={{ cursor: 'pointer' }}
                      >
                        <span>➔</span>
                        <span>{step.relationType.replace('_', ' ')}</span>
                      </div>

                      {idx === answerResult.reasoningPaths.length - 1 && (
                        <button
                          type="button"
                          onClick={() => setSelectedEntityInfo(step)}
                          className="reasoning-node-pill"
                          title={`Click to inspect ${step.toNodeName}`}
                        >
                          <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--primary-blue)' }}>
                            [{step.toNodeType}]
                          </span>
                          <span>{step.toNodeName}</span>
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Inspect Details Popover for Clicked Step */}
                {selectedEntityInfo && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '14px',
                      background: 'var(--white)',
                      borderRadius: '8px',
                      border: '1px solid var(--primary-blue)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--primary-navy)' }}>
                        Relational Step Evidence ({selectedEntityInfo.fromNodeName} ➔ {selectedEntityInfo.toNodeName})
                      </span>
                      <button
                        onClick={() => setSelectedEntityInfo(null)}
                        className="btn-ghost"
                        style={{ padding: '2px 6px', fontSize: '12px' }}
                      >
                        Close
                      </button>
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--dark-text)', fontStyle: 'italic', marginBottom: '8px' }}>
                      "{selectedEntityInfo.evidenceSnippet}"
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--muted-text)', display: 'flex', gap: '12px' }}>
                      <span>Source: <strong>{selectedEntityInfo.docTitle}</strong></span>
                      <span>Ref: <strong>{selectedEntityInfo.pageRef}</strong></span>
                      <span>Confidence: <strong>{(selectedEntityInfo.confidence * 100).toFixed(0)}%</strong></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Retrieved Subgraph & Supporting Evidence (Two Columns) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)', gap: '24px' }}>
            {/* Supporting Evidence Cards */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <FileText size={18} color="var(--primary-blue)" />
                  <span>Supporting Document Evidence</span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                  {answerResult.supportingEvidence.length} source passages
                </span>
              </div>

              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '480px', overflowY: 'auto' }}>
                {answerResult.supportingEvidence.map(ev => (
                  <div
                    key={ev.id}
                    style={{
                      padding: '14px',
                      background: 'var(--pale-blue-bg)',
                      borderRadius: '8px',
                      border: '1px solid var(--light-blue-gray)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="citation-chip">[{ev.id}]</span>
                        <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--primary-navy)' }}>
                          {ev.docTitle}
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--primary-blue)', fontWeight: 600 }}>
                        {ev.chunkRef}
                      </span>
                    </div>

                    <div style={{ fontSize: '12.5px', color: 'var(--dark-text)', fontStyle: 'italic', lineHeight: 1.4 }}>
                      "{ev.excerpt}"
                    </div>

                    <div style={{ fontSize: '11.5px', color: 'var(--secondary-text)', marginTop: '2px' }}>
                      <strong>Relevance:</strong> {ev.relevanceExplanation}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', paddingTop: '6px', borderTop: '1px dashed var(--border-light)' }}>
                      <span style={{ fontSize: '11px', color: 'var(--muted-text)' }}>
                        Confidence: {(ev.confidence * 100).toFixed(0)}%
                      </span>
                      <button
                        onClick={() => onViewDoc(ev.docId)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '2px 8px', fontSize: '11px' }}
                      >
                        <span>View Document</span>
                        <ExternalLink size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Retrieved Subgraph Canvas */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <Share2 size={18} color="var(--primary-blue)" />
                  <span>Retrieved Subgraph Explanation</span>
                </div>
                <button onClick={onOpenExplorerWithNodes} className="btn btn-outline btn-sm">
                  <span>Full Explorer</span>
                  <ExternalLink size={12} />
                </button>
              </div>

              <div style={{ padding: '12px' }}>
                <InteractiveGraphCanvas
                  nodes={answerResult.retrievedGraph.nodes}
                  edges={answerResult.retrievedGraph.edges}
                  isCompact={true}
                  highlightRetrievedOnly={true}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', fontSize: '11.5px', color: 'var(--muted-text)' }}>
                  <span>{answerResult.retrievedGraph.nodes.length} nodes & {answerResult.retrievedGraph.edges.length} edges utilized</span>
                  <span>Drag nodes to inspect links</span>
                </div>
              </div>
            </div>
          </div>

          {/* Retrieval Diagnostics Expandable Panel */}
          <div className="card">
            <div
              className="card-header"
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              style={{ cursor: 'pointer', background: '#FAFBFD' }}
            >
              <div className="card-title">
                <Activity size={18} color="var(--primary-blue)" />
                <span>Retrieval Diagnostics & Pipeline Metrics</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--primary-navy)', fontWeight: 600 }}>
                  Latency: {answerResult.diagnostics.processingTimeMs}ms
                </span>
                {showDiagnostics ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {showDiagnostics && (
              <div className="card-body">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                    gap: '16px',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ padding: '12px', background: 'var(--surface-bg)', borderRadius: '6px' }}>
                    <div className="stat-label">Vector Chunks</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary-navy)' }}>
                      {answerResult.diagnostics.semanticChunksRetrieved} retrieved
                    </div>
                  </div>

                  <div style={{ padding: '12px', background: 'var(--surface-bg)', borderRadius: '6px' }}>
                    <div className="stat-label">Relevant Entities</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary-blue)' }}>
                      {answerResult.diagnostics.relevantEntitiesFound} identified
                    </div>
                  </div>

                  <div style={{ padding: '12px', background: 'var(--surface-bg)', borderRadius: '6px' }}>
                    <div className="stat-label">Graph Traversal Hops</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary-navy)' }}>
                      {answerResult.diagnostics.graphPathsTraversed} paths mapped
                    </div>
                  </div>

                  <div style={{ padding: '12px', background: 'var(--surface-bg)', borderRadius: '6px' }}>
                    <div className="stat-label">Relation Confidence</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#2ECC71' }}>
                      {(answerResult.diagnostics.avgRelationConfidence * 100).toFixed(0)}%
                    </div>
                  </div>

                  <div style={{ padding: '12px', background: 'var(--surface-bg)', borderRadius: '6px' }}>
                    <div className="stat-label">Answer Grounding</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#2ECC71' }}>
                      {(answerResult.diagnostics.overallConfidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                {answerResult.diagnostics.notes && (
                  <div style={{ fontSize: '12.5px', color: 'var(--secondary-text)', background: 'var(--pale-blue-bg)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--light-blue-gray)' }}>
                    <strong>Execution Notes:</strong> {answerResult.diagnostics.notes}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save Investigation Modal Dialog */}
      {saveModalOpen && (
        <div className="modal-overlay" onClick={() => setSaveModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookmarkPlus size={18} color="var(--primary-blue)" />
                <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--primary-navy)' }}>
                  Save Investigation to Library
                </span>
              </div>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Investigation Title</label>
                <input
                  type="text"
                  value={investigationTitle}
                  onChange={(e) => setInvestigationTitle(e.target.value)}
                  className="form-input"
                  placeholder="e.g. BioASQ Evaluation & Authorship Trace"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={investigationTags}
                  onChange={(e) => setInvestigationTags(e.target.value)}
                  className="form-input"
                  placeholder="BioASQ, GraphRAG, Multi-Hop"
                />
              </div>

              <div style={{ padding: '12px', background: 'var(--surface-bg)', borderRadius: '6px', fontSize: '12px', color: 'var(--secondary-text)' }}>
                This will preserve the complete query configuration, synthesized answer, {answerResult?.reasoningPaths.length} reasoning steps, supporting citation sources, and retrieved subgraph.
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setSaveModalOpen(false)} className="btn btn-outline btn-sm">
                Cancel
              </button>
              <button onClick={handleSaveInvestigation} className="btn btn-primary btn-sm">
                Save Investigation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
