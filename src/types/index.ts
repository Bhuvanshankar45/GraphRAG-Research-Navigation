export type EntityType =
  | 'Person'
  | 'Organization'
  | 'Document'
  | 'Topic'
  | 'Method'
  | 'Dataset'
  | 'Task'
  | 'Product'
  | 'Location'
  | 'Policy'
  | 'Event'
  | 'Concept'
  | 'Technology';

export type RelationshipType =
  | 'authored_by'
  | 'cites'
  | 'uses'
  | 'evaluates'
  | 'improves'
  | 'belongs_to'
  | 'related_to'
  | 'affected_by'
  | 'supplied_by'
  | 'governed_by'
  | 'occurred_in'
  | 'contradicts'
  | 'supports';

export type ProcessingStatus =
  | 'Uploaded'
  | 'Extracting'
  | 'Chunking'
  | 'Embedding'
  | 'Graph Extraction'
  | 'Ready'
  | 'Failed';

export interface Document {
  id: string;
  title: string;
  authors: string[];
  year: number;
  fileType: 'PDF' | 'DOCX' | 'TXT' | 'MD' | 'CSV';
  fileSize: string;
  pageCount: number;
  uploadDate: string;
  status: ProcessingStatus;
  chunksCount: number;
  entitiesCount: number;
  relationsCount: number;
  collectionId: string;
  tags: string[];
  summary: string;
  extractedText: string;
}

export interface DocumentChunk {
  id: string;
  docId: string;
  docTitle: string;
  chunkIndex: number;
  pageNumber: number;
  text: string;
  tokenCount: number;
  embeddingSummary: string;
  entities: string[];
}

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  description: string;
  confidence: number;
  sourceDocIds: string[];
  chunkIds: string[];
  degree?: number;
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  relationType: RelationshipType;
  confidence: number;
  sourceDocId: string;
  sourceDocTitle: string;
  sourceChunkId: string;
  pageRef: string;
  evidenceText: string;
  timestamp: string;
}

export interface GraphNode {
  id: string;
  name: string;
  type: EntityType;
  description: string;
  confidence: number;
  sourceDocIds: string[];
  degree: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  isRetrieved?: boolean;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationType: RelationshipType;
  confidence: number;
  sourceDocTitle: string;
  evidenceText: string;
  pageRef: string;
  isRetrieved?: boolean;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export type RetrievalMode = 'hybrid' | 'vector' | 'graph';
export type AnswerStyle = 'Concise' | 'Analytical' | 'Detailed';
export type CitationStyle = 'Numeric' | 'APA' | 'IEEE' | 'Nature';

export interface QueryConfig {
  mode: RetrievalMode;
  depth: 1 | 2 | 3;
  maxSources: number;
  prioritizeRecent: boolean;
  verifiedOnly: boolean;
  style: AnswerStyle;
}

export interface ReasoningStep {
  fromNodeId: string;
  fromNodeName: string;
  fromNodeType: EntityType;
  relationType: RelationshipType;
  toNodeId: string;
  toNodeName: string;
  toNodeType: EntityType;
  confidence: number;
  evidenceSnippet: string;
  docTitle: string;
  pageRef: string;
}

export interface SupportingEvidence {
  id: number;
  docId: string;
  docTitle: string;
  chunkRef: string;
  pageNumber: number;
  confidence: number;
  excerpt: string;
  relevanceExplanation: string;
  linkedEntities: string[];
}

export interface RetrievalDiagnostics {
  semanticChunksRetrieved: number;
  relevantEntitiesFound: number;
  graphPathsTraversed: number;
  avgRelationConfidence: number;
  overallConfidence: number;
  vectorSimilarityTop: number;
  processingTimeMs: number;
  retrievalModeUsed: RetrievalMode;
  notes?: string;
}

export interface AnswerResult {
  id: string;
  question: string;
  answerText: string;
  reasoningPaths: ReasoningStep[];
  supportingEvidence: SupportingEvidence[];
  retrievedGraph: GraphData;
  diagnostics: RetrievalDiagnostics;
  timestamp: string;
  queryConfig: QueryConfig;
}

export interface SavedInvestigation {
  id: string;
  title: string;
  question: string;
  queryConfig: QueryConfig;
  answerResult: AnswerResult;
  dateCreated: string;
  tags: string[];
  savedBy: string;
  notes?: string;
  collection: string;
}

export interface Workspace {
  id: string;
  name: string;
  domain: string;
  description: string;
  activeCollection: string;
  totalDocs: number;
  totalChunks: number;
  totalEntities: number;
  totalRelations: number;
}

export interface UserSettings {
  workspaceName: string;
  activeCollection: string;
  embeddingModel: string;
  entityExtractionModel: string;
  relationConfidenceThreshold: number;
  chunkSize: number;
  chunkOverlap: number;
  traversalDepthDefault: 1 | 2 | 3;
  citationStyle: CitationStyle;
  dataRetentionDays: number;
  autoSaveInvestigations: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  email: string;
  initials: string;
  avatarColor?: string;
}

