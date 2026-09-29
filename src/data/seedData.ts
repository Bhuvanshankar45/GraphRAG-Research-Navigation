import {
  Document,
  DocumentChunk,
  Entity,
  Relationship,
  SavedInvestigation,
  Workspace,
  UserSettings
} from '../types';

export const initialWorkspace: Workspace = {
  id: 'ws-biomed-ai',
  name: 'Biomedical & Scientific Knowledge Base',
  domain: 'Biomedical & AI',
  description: 'Multi-document knowledge base on biomedical NLP, hybrid retrieval benchmarks, and clinical research data governance.',
  activeCollection: 'col-academic-papers',
  totalDocs: 6,
  totalChunks: 38,
  totalEntities: 26,
  totalRelations: 44
};

export const initialUserSettings: UserSettings = {
  workspaceName: 'Biomedical & Scientific Knowledge Base',
  activeCollection: 'col-academic-papers',
  embeddingModel: 'text-embedding-3-large (1536-dim)',
  entityExtractionModel: 'gemini-1.5-pro / gpt-4o structured extraction',
  relationConfidenceThreshold: 0.75,
  chunkSize: 512,
  chunkOverlap: 64,
  traversalDepthDefault: 2,
  citationStyle: 'Numeric',
  dataRetentionDays: 90,
  autoSaveInvestigations: true
};

export const seedDocuments: Document[] = [
  {
    id: 'doc-1',
    title: 'Graph-Based Retrieval for Scientific Question Answering',
    authors: ['Dr. Maya Chen', 'Dr. Elena Rostova'],
    year: 2024,
    fileType: 'PDF',
    fileSize: '2.4 MB',
    pageCount: 16,
    uploadDate: '2024-03-12',
    status: 'Ready',
    chunksCount: 8,
    entitiesCount: 9,
    relationsCount: 12,
    collectionId: 'col-academic-papers',
    tags: ['GraphRAG', 'Multi-Hop QA', 'Knowledge Graph', 'NLP'],
    summary: 'Presents the GraphRAG framework integrating dense vector representations with structured knowledge graph traversal to answer complex multi-hop scientific questions with explainable reasoning paths.',
    extractedText: `GRAPH-BASED RETRIEVAL FOR SCIENTIFIC QUESTION ANSWERING
Maya Chen, Elena Rostova — Open Research Lab, 2024

Abstract:
Traditional dense vector retrieval fails when answering complex multi-hop scientific inquiries requiring evidence synthesized across disparate literature. We introduce GraphRAG, a hybrid retrieval paradigm uniting dense semantic search with sub-graph structural navigation. On multi-hop scientific benchmarks, GraphRAG boosts factual consistency by 34.2% over standalone dense vector retrieval while providing explicit citation pathways.

1. Introduction
Modern scientific research necessitates synthesizing assertions dispersed over hundreds of publications. In typical dense passage retrieval, isolated text chunks lose relational continuity, yielding disjointed or hallucinated answers. By coupling dense embeddings with an entity-relationship graph, GraphRAG facilitates structured reasoning hops across intermediate conceptual nodes.`
  },
  {
    id: 'doc-2',
    title: 'Evaluating Hybrid Retrieval Systems on Biomedical Literature',
    authors: ['Dr. Maya Chen', 'BioASQ Consortium', 'Open Research Lab'],
    year: 2024,
    fileType: 'PDF',
    fileSize: '3.1 MB',
    pageCount: 22,
    uploadDate: '2024-04-05',
    status: 'Ready',
    chunksCount: 10,
    entitiesCount: 11,
    relationsCount: 14,
    collectionId: 'col-academic-papers',
    tags: ['BioASQ', 'Biomedical Benchmark', 'Evaluation', 'GraphRAG'],
    summary: 'Empirical evaluation of dense vector baselines versus hybrid GraphRAG systems across the BioASQ challenge dataset, demonstrating significant evidence-path discovery improvements and reduced hallucination rates.',
    extractedText: `EVALUATING HYBRID RETRIEVAL SYSTEMS ON BIOMEDICAL LITERATURE
Open Research Lab in collaboration with BioASQ Consortium, 2024

Abstract:
We perform an extensive benchmark of state-of-the-art information retrieval architectures across biomedical literature. Evaluating GraphRAG on the BioASQ 11b benchmark reveals a 41.8% gain in evidence-path discovery for multi-hop clinical queries compared to Dense Vector Retrieval. The Open Research Lab published this evaluation dataset to promote verifiable reasoning in clinical decision support.

2. Benchmark Setup & Methodology
We evaluate retrieval models against the BioASQ challenge corpus consisting of 4.2 million MEDLINE abstracts and 4,800 complex questions. We assess mean reciprocal rank (MRR@10) and precision of multi-hop reasoning chains.`
  },
  {
    id: 'doc-3',
    title: 'Attention-Enhanced Knowledge Graphs for Complex Reasoning',
    authors: ['Dr. Aris Thorne', 'Dr. Maya Chen'],
    year: 2023,
    fileType: 'PDF',
    fileSize: '1.8 MB',
    pageCount: 14,
    uploadDate: '2024-02-18',
    status: 'Ready',
    chunksCount: 6,
    entitiesCount: 8,
    relationsCount: 9,
    collectionId: 'col-academic-papers',
    tags: ['Attention Mechanism', 'Graph Neural Networks', 'Multi-Hop'],
    summary: 'Formulates an attention-weighted graph convolutional operator for prioritizing relational edges during multi-hop path traversal in scientific knowledge graphs.',
    extractedText: `ATTENTION-ENHANCED KNOWLEDGE GRAPHS FOR COMPLEX REASONING
Aris Thorne, Maya Chen — 2023

Abstract:
Not all relational edges in knowledge graphs contribute equal evidential value during question answering. We present Controllable Multi-Hop Traverser, an attention-gated mechanism that dynamically prunes spurious semantic associations while amplifying verified empirical relations.`
  },
  {
    id: 'doc-4',
    title: 'BioASQ 11b: Benchmark Evaluation on Biomedical QA',
    authors: ['BioASQ Consortium', 'Dr. Aris Thorne'],
    year: 2023,
    fileType: 'PDF',
    fileSize: '4.5 MB',
    pageCount: 28,
    uploadDate: '2024-01-20',
    status: 'Ready',
    chunksCount: 7,
    entitiesCount: 7,
    relationsCount: 8,
    collectionId: 'col-academic-papers',
    tags: ['BioASQ', 'Benchmark', 'Biomedical QA', 'Ground Truth'],
    summary: 'Detailed specification of the BioASQ 11b challenge tasks, gold-standard human annotations, and multi-hop reasoning evaluations for biomedical question answering.',
    extractedText: `BIOASQ 11b: BENCHMARK EVALUATION AND SEMANTIC INDEXING ON BIOMEDICAL QA
BioASQ Consortium Technical Report, 2023

The BioASQ initiative provides rigorous international challenges on biomedical semantic indexing and question answering. Task 11b specifically tests multi-hop question answering where answers require combining findings across multiple research papers.`
  },
  {
    id: 'doc-5',
    title: 'SciFact-Open: Scientific Claim Verification through Structured Graphs',
    authors: ['Allen AI & Collaborators', 'Dr. Elena Rostova'],
    year: 2023,
    fileType: 'PDF',
    fileSize: '2.1 MB',
    pageCount: 18,
    uploadDate: '2024-02-28',
    status: 'Ready',
    chunksCount: 4,
    entitiesCount: 6,
    relationsCount: 6,
    collectionId: 'col-academic-papers',
    tags: ['SciFact', 'Fact Checking', 'Scientific Claims', 'Evidence'],
    summary: 'A dataset and verification pipeline for validating expert scientific claims against peer-reviewed literature, using graph-structured rationale extraction.',
    extractedText: `SCIFACT-OPEN: SCIENTIFIC CLAIM VERIFICATION THROUGH STRUCTURED GRAPHS
Allen AI & Collaborators, 2023

Validating scientific claims requires extracting verifiable rationales and detecting contradictory evidence across publications. SciFact provides 1,400 claims paired with evidence-annotated abstracts.`
  },
  {
    id: 'doc-6',
    title: 'Institutional Compliance & Data Governance Standards in AI-Assisted Clinical Trials',
    authors: ['Clinical Data Governance Board', 'Dr. Maya Chen'],
    year: 2024,
    fileType: 'PDF',
    fileSize: '1.5 MB',
    pageCount: 12,
    uploadDate: '2024-03-30',
    status: 'Ready',
    chunksCount: 3,
    entitiesCount: 6,
    relationsCount: 5,
    collectionId: 'col-academic-papers',
    tags: ['Compliance', 'Data Governance', 'Audit Trail', 'Policy'],
    summary: 'Regulatory audit standards, audit trail verification policies, and patient privacy guidelines governing the deployment of AI assistants in clinical research.',
    extractedText: `INSTITUTIONAL COMPLIANCE & DATA GOVERNANCE STANDARDS IN AI-ASSISTED CLINICAL TRIALS
Clinical Data Governance Board Audit Standards, 2024

Standard 4.2 dictates that all AI-derived recommendations in clinical investigations must maintain complete cryptographic provenance and citation trails linking assertions to source publications. Adherence to the NIH Data Management and Sharing Policy is mandatory.`
  }
];

export const seedEntities: Entity[] = [
  {
    id: 'ent-graphrag',
    name: 'GraphRAG',
    type: 'Method',
    description: 'A hybrid retrieval framework combining dense vector embeddings with knowledge-graph traversal for multi-hop question answering.',
    confidence: 0.98,
    sourceDocIds: ['doc-1', 'doc-2', 'doc-3'],
    chunkIds: ['chk-1-1', 'chk-1-2', 'chk-2-1', 'chk-3-1'],
    degree: 9
  },
  {
    id: 'ent-dense-retrieval',
    name: 'Dense Vector Retrieval',
    type: 'Method',
    description: 'Standard embedding-based vector similarity search utilizing bi-encoder models over isolated document chunks.',
    confidence: 0.96,
    sourceDocIds: ['doc-1', 'doc-2'],
    chunkIds: ['chk-1-1', 'chk-2-1'],
    degree: 5
  },
  {
    id: 'ent-controllable-traverser',
    name: 'Controllable Multi-Hop Traverser',
    type: 'Method',
    description: 'An attention-gated graph convolutional mechanism for selectively pruning low-confidence relational paths in scientific graphs.',
    confidence: 0.94,
    sourceDocIds: ['doc-3'],
    chunkIds: ['chk-3-1'],
    degree: 4
  },
  {
    id: 'ent-bioasq',
    name: 'BioASQ',
    type: 'Dataset',
    description: 'A benchmark challenge dataset for biomedical semantic indexing and multi-hop question answering consisting of millions of MEDLINE abstracts.',
    confidence: 0.99,
    sourceDocIds: ['doc-2', 'doc-4'],
    chunkIds: ['chk-2-1', 'chk-2-2', 'chk-4-1'],
    degree: 7
  },
  {
    id: 'ent-scifact',
    name: 'SciFact',
    type: 'Dataset',
    description: 'A benchmark dataset for scientific claim verification with expert rationale annotations and polarity classifications.',
    confidence: 0.95,
    sourceDocIds: ['doc-5'],
    chunkIds: ['chk-5-1'],
    degree: 4
  },
  {
    id: 'ent-pubmedqa',
    name: 'PubMedQA',
    type: 'Dataset',
    description: 'A biomedical question answering dataset collected from PubMed abstracts with reasoning annotations.',
    confidence: 0.91,
    sourceDocIds: ['doc-2'],
    chunkIds: ['chk-2-3'],
    degree: 3
  },
  {
    id: 'ent-multihop-qa',
    name: 'Multi-hop Question Answering',
    type: 'Task',
    description: 'The task of answering complex questions whose answers require connecting evidence across multiple distinct document passages.',
    confidence: 0.97,
    sourceDocIds: ['doc-1', 'doc-2', 'doc-4'],
    chunkIds: ['chk-1-1', 'chk-2-1', 'chk-4-1'],
    degree: 8
  },
  {
    id: 'ent-evidence-path',
    name: 'Evidence-Path Discovery',
    type: 'Task',
    description: 'Identifying and reconstructing the precise chain of supporting citations and intermediate entities supporting a conclusion.',
    confidence: 0.95,
    sourceDocIds: ['doc-1', 'doc-2', 'doc-5'],
    chunkIds: ['chk-1-2', 'chk-2-1', 'chk-5-1'],
    degree: 6
  },
  {
    id: 'ent-claim-verification',
    name: 'Scientific Claim Verification',
    type: 'Task',
    description: 'Assessing whether a given scientific assertion is supported, refuted, or unverified given published literature.',
    confidence: 0.93,
    sourceDocIds: ['doc-5'],
    chunkIds: ['chk-5-1'],
    degree: 4
  },
  {
    id: 'ent-maya-chen',
    name: 'Dr. Maya Chen',
    type: 'Person',
    description: 'Principal Investigator at Open Research Lab specializing in graph neural networks, biomedical NLP, and hybrid retrieval systems.',
    confidence: 0.99,
    sourceDocIds: ['doc-1', 'doc-2', 'doc-3', 'doc-6'],
    chunkIds: ['chk-1-1', 'chk-2-1', 'chk-3-1', 'chk-6-1'],
    degree: 10
  },
  {
    id: 'ent-aris-thorne',
    name: 'Dr. Aris Thorne',
    type: 'Person',
    description: 'Senior Research Scientist focusing on attention mechanisms in knowledge representation and graph reasoning.',
    confidence: 0.96,
    sourceDocIds: ['doc-3', 'doc-4'],
    chunkIds: ['chk-3-1', 'chk-4-1'],
    degree: 6
  },
  {
    id: 'ent-elena-rostova',
    name: 'Dr. Elena Rostova',
    type: 'Person',
    description: 'Research Scientist at Open Research Lab investigating scientific claim verification and knowledge graph alignment.',
    confidence: 0.94,
    sourceDocIds: ['doc-1', 'doc-5'],
    chunkIds: ['chk-1-1', 'chk-5-1'],
    degree: 5
  },
  {
    id: 'ent-open-research-lab',
    name: 'Open Research Lab',
    type: 'Organization',
    description: 'An independent collaborative research institute advancing transparent, reproducible AI and graph retrieval methodologies.',
    confidence: 0.99,
    sourceDocIds: ['doc-1', 'doc-2'],
    chunkIds: ['chk-1-1', 'chk-2-1'],
    degree: 7
  },
  {
    id: 'ent-bioasq-consortium',
    name: 'BioASQ Consortium',
    type: 'Organization',
    description: 'International collaborative organization responsible for annual biomedical semantic indexing and challenge evaluations.',
    confidence: 0.97,
    sourceDocIds: ['doc-2', 'doc-4'],
    chunkIds: ['chk-2-1', 'chk-4-1'],
    degree: 5
  },
  {
    id: 'ent-paper-chen-2024',
    name: 'Graph-Based Retrieval for Scientific Question Answering',
    type: 'Document',
    description: 'Foundational paper introducing GraphRAG and its multi-hop reasoning performance on scientific literature.',
    confidence: 1.0,
    sourceDocIds: ['doc-1'],
    chunkIds: ['chk-1-1', 'chk-1-2'],
    degree: 8
  },
  {
    id: 'ent-paper-eval-2024',
    name: 'Evaluating Hybrid Retrieval Systems on Biomedical Literature',
    type: 'Document',
    description: 'Benchmark study evaluating GraphRAG on BioASQ and demonstrating factual fidelity gains.',
    confidence: 1.0,
    sourceDocIds: ['doc-2'],
    chunkIds: ['chk-2-1', 'chk-2-2'],
    degree: 9
  },
  {
    id: 'ent-paper-thorne-2023',
    name: 'Attention-Enhanced Knowledge Graphs for Complex Reasoning',
    type: 'Document',
    description: 'Paper formulating attention operators for pruning spurious paths during multi-hop graph traversal.',
    confidence: 1.0,
    sourceDocIds: ['doc-3'],
    chunkIds: ['chk-3-1'],
    degree: 5
  },
  {
    id: 'ent-paper-bioasq11b',
    name: 'BioASQ 11b: Benchmark Evaluation on Biomedical QA',
    type: 'Document',
    description: 'Technical evaluation report outlining tasks, datasets, and human annotations for biomedical question answering.',
    confidence: 1.0,
    sourceDocIds: ['doc-4'],
    chunkIds: ['chk-4-1'],
    degree: 5
  },
  {
    id: 'ent-policy-nih-dms',
    name: 'NIH Data Management and Sharing Policy',
    type: 'Policy',
    description: 'Federal policy requiring research data to be deposited in accessible repositories with transparent metadata.',
    confidence: 0.94,
    sourceDocIds: ['doc-6'],
    chunkIds: ['chk-6-1'],
    degree: 4
  },
  {
    id: 'ent-policy-audit-42',
    name: 'GCP Standard 4.2: Audit Trail Verification',
    type: 'Policy',
    description: 'Institutional compliance protocol requiring cryptographically verifiable lineage for all automated research inferences.',
    confidence: 0.96,
    sourceDocIds: ['doc-6'],
    chunkIds: ['chk-6-1'],
    degree: 4
  },
  {
    id: 'ent-concept-graph-traversal',
    name: 'Knowledge Graph Traversal',
    type: 'Concept',
    description: 'Algorithmic process of stepping through entities and relation links to discover multi-hop paths connecting distant facts.',
    confidence: 0.95,
    sourceDocIds: ['doc-1', 'doc-3'],
    chunkIds: ['chk-1-2', 'chk-3-1'],
    degree: 6
  },
  {
    id: 'ent-concept-hallucination',
    name: 'Hallucination Mitigation in Multi-hop QA',
    type: 'Concept',
    description: 'Techniques and validation criteria that ensure answers strictly ground all assertions in retrieved citation evidence.',
    confidence: 0.97,
    sourceDocIds: ['doc-1', 'doc-2'],
    chunkIds: ['chk-1-1', 'chk-2-1'],
    degree: 5
  },
  {
    id: 'ent-product-navigator',
    name: 'GraphRAG Navigator Engine',
    type: 'Product',
    description: 'Production enterprise system integrating vector indices with knowledge graph sub-network exploration.',
    confidence: 0.98,
    sourceDocIds: ['doc-1'],
    chunkIds: ['chk-1-1'],
    degree: 4
  },
  {
    id: 'ent-clinical-trials',
    name: 'AI-Assisted Clinical Trials',
    type: 'Topic',
    description: 'Application of automated literature synthesis and decision support tools in clinical trial workflows.',
    confidence: 0.92,
    sourceDocIds: ['doc-6'],
    chunkIds: ['chk-6-1'],
    degree: 3
  }
];

export const seedRelationships: Relationship[] = [
  // Canonical seeded relations required by prompt:
  {
    id: 'rel-1',
    sourceId: 'ent-maya-chen',
    targetId: 'ent-paper-chen-2024',
    relationType: 'authored_by',
    confidence: 0.99,
    sourceDocId: 'doc-1',
    sourceDocTitle: 'Graph-Based Retrieval for Scientific Question Answering',
    sourceChunkId: 'chk-1-1',
    pageRef: 'Page 1',
    evidenceText: 'Dr. Maya Chen and Dr. Elena Rostova authored Graph-Based Retrieval for Scientific Question Answering at Open Research Lab.',
    timestamp: '2024-03-12'
  },
  {
    id: 'rel-2',
    sourceId: 'ent-paper-chen-2024',
    targetId: 'ent-graphrag',
    relationType: 'uses',
    confidence: 0.98,
    sourceDocId: 'doc-1',
    sourceDocTitle: 'Graph-Based Retrieval for Scientific Question Answering',
    sourceChunkId: 'chk-1-1',
    pageRef: 'Page 2',
    evidenceText: 'In this paper, we formulate and implement GraphRAG as a hybrid retrieval system coupling dense vectors with relational graphs.',
    timestamp: '2024-03-12'
  },
  {
    id: 'rel-3',
    sourceId: 'ent-graphrag',
    targetId: 'ent-multihop-qa',
    relationType: 'supports',
    confidence: 0.97,
    sourceDocId: 'doc-1',
    sourceDocTitle: 'Graph-Based Retrieval for Scientific Question Answering',
    sourceChunkId: 'chk-1-1',
    pageRef: 'Page 3',
    evidenceText: 'GraphRAG directly supports multi-hop question answering across multi-document scientific literature.',
    timestamp: '2024-03-12'
  },
  {
    id: 'rel-4',
    sourceId: 'ent-paper-eval-2024',
    targetId: 'ent-graphrag',
    relationType: 'evaluates',
    confidence: 0.98,
    sourceDocId: 'doc-2',
    sourceDocTitle: 'Evaluating Hybrid Retrieval Systems on Biomedical Literature',
    sourceChunkId: 'chk-2-1',
    pageRef: 'Page 1',
    evidenceText: 'We evaluate the GraphRAG framework against dense vector baselines on biomedical literature collections.',
    timestamp: '2024-04-05'
  },
  {
    id: 'rel-5',
    sourceId: 'ent-paper-eval-2024',
    targetId: 'ent-bioasq',
    relationType: 'uses',
    confidence: 0.99,
    sourceDocId: 'doc-2',
    sourceDocTitle: 'Evaluating Hybrid Retrieval Systems on Biomedical Literature',
    sourceChunkId: 'chk-2-1',
    pageRef: 'Page 2',
    evidenceText: 'Evaluating Hybrid Retrieval Systems on Biomedical Literature uses BioASQ as its primary empirical evaluation benchmark.',
    timestamp: '2024-04-05'
  },
  {
    id: 'rel-6',
    sourceId: 'ent-graphrag',
    targetId: 'ent-bioasq',
    relationType: 'improves',
    confidence: 0.96,
    sourceDocId: 'doc-2',
    sourceDocTitle: 'Evaluating Hybrid Retrieval Systems on Biomedical Literature',
    sourceChunkId: 'chk-2-1',
    pageRef: 'Page 4',
    evidenceText: 'GraphRAG improves evidence-path discovery on BioASQ by 41.8% over standard bi-encoder dense vector baselines.',
    timestamp: '2024-04-05'
  },
  {
    id: 'rel-7',
    sourceId: 'ent-open-research-lab',
    targetId: 'ent-paper-eval-2024',
    relationType: 'authored_by',
    confidence: 0.98,
    sourceDocId: 'doc-2',
    sourceDocTitle: 'Evaluating Hybrid Retrieval Systems on Biomedical Literature',
    sourceChunkId: 'chk-2-1',
    pageRef: 'Page 1',
    evidenceText: 'Open Research Lab published the evaluation paper in collaboration with the BioASQ Consortium.',
    timestamp: '2024-04-05'
  },
  {
    id: 'rel-8',
    sourceId: 'ent-paper-eval-2024',
    targetId: 'ent-paper-chen-2024',
    relationType: 'cites',
    confidence: 0.95,
    sourceDocId: 'doc-2',
    sourceDocTitle: 'Evaluating Hybrid Retrieval Systems on Biomedical Literature',
    sourceChunkId: 'chk-2-2',
    pageRef: 'Page 3',
    evidenceText: 'We adopt the foundational GraphRAG architecture as introduced by Chen and Rostova (2024).',
    timestamp: '2024-04-05'
  },
  {
    id: 'rel-9',
    sourceId: 'ent-elena-rostova',
    targetId: 'ent-paper-chen-2024',
    relationType: 'authored_by',
    confidence: 0.97,
    sourceDocId: 'doc-1',
    sourceDocTitle: 'Graph-Based Retrieval for Scientific Question Answering',
    sourceChunkId: 'chk-1-1',
    pageRef: 'Page 1',
    evidenceText: 'Elena Rostova co-authored Graph-Based Retrieval for Scientific Question Answering at Open Research Lab.',
    timestamp: '2024-03-12'
  },
  {
    id: 'rel-10',
    sourceId: 'ent-maya-chen',
    targetId: 'ent-open-research-lab',
    relationType: 'belongs_to',
    confidence: 0.99,
    sourceDocId: 'doc-1',
    sourceDocTitle: 'Graph-Based Retrieval for Scientific Question Answering',
    sourceChunkId: 'chk-1-1',
    pageRef: 'Page 1',
    evidenceText: 'Dr. Maya Chen leads the Knowledge Systems Group at Open Research Lab.',
    timestamp: '2024-03-12'
  },
  {
    id: 'rel-11',
    sourceId: 'ent-graphrag',
    targetId: 'ent-dense-retrieval',
    relationType: 'improves',
    confidence: 0.96,
    sourceDocId: 'doc-1',
    sourceDocTitle: 'Graph-Based Retrieval for Scientific Question Answering',
    sourceChunkId: 'chk-1-1',
    pageRef: 'Page 2',
    evidenceText: 'GraphRAG overcomes the topological blindness of Dense Vector Retrieval on multi-hop question answering.',
    timestamp: '2024-03-12'
  },
  {
    id: 'rel-12',
    sourceId: 'ent-graphrag',
    targetId: 'ent-evidence-path',
    relationType: 'improves',
    confidence: 0.95,
    sourceDocId: 'doc-1',
    sourceDocTitle: 'Graph-Based Retrieval for Scientific Question Answering',
    sourceChunkId: 'chk-1-2',
    pageRef: 'Page 5',
    evidenceText: 'By rendering explicit graph paths, GraphRAG improves evidence-path discovery and factual auditability.',
    timestamp: '2024-03-12'
  },
  {
    id: 'rel-13',
    sourceId: 'ent-paper-thorne-2023',
    targetId: 'ent-controllable-traverser',
    relationType: 'uses',
    confidence: 0.96,
    sourceDocId: 'doc-3',
    sourceDocTitle: 'Attention-Enhanced Knowledge Graphs for Complex Reasoning',
    sourceChunkId: 'chk-3-1',
    pageRef: 'Page 2',
    evidenceText: 'We introduce the Controllable Multi-Hop Traverser to dynamically guide attention over knowledge graph links.',
    timestamp: '2024-02-18'
  },
  {
    id: 'rel-14',
    sourceId: 'ent-aris-thorne',
    targetId: 'ent-paper-thorne-2023',
    relationType: 'authored_by',
    confidence: 0.98,
    sourceDocId: 'doc-3',
    sourceDocTitle: 'Attention-Enhanced Knowledge Graphs for Complex Reasoning',
    sourceChunkId: 'chk-3-1',
    pageRef: 'Page 1',
    evidenceText: 'Dr. Aris Thorne and Dr. Maya Chen authored Attention-Enhanced Knowledge Graphs for Complex Reasoning.',
    timestamp: '2024-02-18'
  },
  {
    id: 'rel-15',
    sourceId: 'ent-controllable-traverser',
    targetId: 'ent-graphrag',
    relationType: 'improves',
    confidence: 0.94,
    sourceDocId: 'doc-3',
    sourceDocTitle: 'Attention-Enhanced Knowledge Graphs for Complex Reasoning',
    sourceChunkId: 'chk-3-1',
    pageRef: 'Page 4',
    evidenceText: 'The attention-gated traverser improves GraphRAG path precision by filtering irrelevant neighbor nodes.',
    timestamp: '2024-02-18'
  },
  {
    id: 'rel-16',
    sourceId: 'ent-bioasq-consortium',
    targetId: 'ent-bioasq',
    relationType: 'belongs_to',
    confidence: 0.99,
    sourceDocId: 'doc-4',
    sourceDocTitle: 'BioASQ 11b: Benchmark Evaluation on Biomedical QA',
    sourceChunkId: 'chk-4-1',
    pageRef: 'Page 1',
    evidenceText: 'The BioASQ Consortium manages and curates the BioASQ challenge benchmarks.',
    timestamp: '2024-01-20'
  },
  {
    id: 'rel-17',
    sourceId: 'ent-bioasq',
    targetId: 'ent-multihop-qa',
    relationType: 'evaluates',
    confidence: 0.98,
    sourceDocId: 'doc-4',
    sourceDocTitle: 'BioASQ 11b: Benchmark Evaluation on Biomedical QA',
    sourceChunkId: 'chk-4-1',
    pageRef: 'Page 2',
    evidenceText: 'BioASQ Task 11b evaluates multi-hop question answering across PubMed abstracts.',
    timestamp: '2024-01-20'
  },
  {
    id: 'rel-18',
    sourceId: 'ent-elena-rostova',
    targetId: 'ent-scifact',
    relationType: 'evaluates',
    confidence: 0.93,
    sourceDocId: 'doc-5',
    sourceDocTitle: 'SciFact-Open: Scientific Claim Verification through Structured Graphs',
    sourceChunkId: 'chk-5-1',
    pageRef: 'Page 2',
    evidenceText: 'Elena Rostova evaluated structured evidence extraction across the SciFact claim verification benchmark.',
    timestamp: '2024-02-28'
  },
  {
    id: 'rel-19',
    sourceId: 'ent-scifact',
    targetId: 'ent-claim-verification',
    relationType: 'evaluates',
    confidence: 0.97,
    sourceDocId: 'doc-5',
    sourceDocTitle: 'SciFact-Open: Scientific Claim Verification through Structured Graphs',
    sourceChunkId: 'chk-5-1',
    pageRef: 'Page 1',
    evidenceText: 'SciFact benchmark validates automated scientific claim verification against gold-standard rationales.',
    timestamp: '2024-02-28'
  },
  {
    id: 'rel-20',
    sourceId: 'ent-policy-audit-42',
    targetId: 'ent-clinical-trials',
    relationType: 'governed_by',
    confidence: 0.97,
    sourceDocId: 'doc-6',
    sourceDocTitle: 'Institutional Compliance & Data Governance Standards in AI-Assisted Clinical Trials',
    sourceChunkId: 'chk-6-1',
    pageRef: 'Page 2',
    evidenceText: 'Clinical trial decision systems are governed by GCP Standard 4.2 audit trail verification policies.',
    timestamp: '2024-03-30'
  },
  {
    id: 'rel-21',
    sourceId: 'ent-policy-nih-dms',
    targetId: 'ent-clinical-trials',
    relationType: 'governed_by',
    confidence: 0.95,
    sourceDocId: 'doc-6',
    sourceDocTitle: 'Institutional Compliance & Data Governance Standards in AI-Assisted Clinical Trials',
    sourceChunkId: 'chk-6-1',
    pageRef: 'Page 3',
    evidenceText: 'All public clinical datasets must conform to the NIH Data Management and Sharing Policy.',
    timestamp: '2024-03-30'
  },
  {
    id: 'rel-22',
    sourceId: 'ent-graphrag',
    targetId: 'ent-concept-hallucination',
    relationType: 'supports',
    confidence: 0.97,
    sourceDocId: 'doc-1',
    sourceDocTitle: 'Graph-Based Retrieval for Scientific Question Answering',
    sourceChunkId: 'chk-1-2',
    pageRef: 'Page 6',
    evidenceText: 'GraphRAG supports hallucination mitigation by requiring all generated statements to link directly to verifiable graph triplets.',
    timestamp: '2024-03-12'
  },
  {
    id: 'rel-23',
    sourceId: 'ent-dense-retrieval',
    targetId: 'ent-concept-hallucination',
    relationType: 'contradicts',
    confidence: 0.88,
    sourceDocId: 'doc-1',
    sourceDocTitle: 'Graph-Based Retrieval for Scientific Question Answering',
    sourceChunkId: 'chk-1-2',
    pageRef: 'Page 7',
    evidenceText: 'Dense vector retrieval without graph grounding exhibits high hallucination rates on multi-hop scientific queries.',
    timestamp: '2024-03-12'
  }
];

export const seedChunks: DocumentChunk[] = [
  {
    id: 'chk-1-1',
    docId: 'doc-1',
    docTitle: 'Graph-Based Retrieval for Scientific Question Answering',
    chunkIndex: 0,
    pageNumber: 1,
    text: 'Modern scientific research necessitates synthesizing assertions dispersed over hundreds of publications. In typical dense passage retrieval, isolated text chunks lose relational continuity, yielding disjointed or hallucinated answers. By coupling dense embeddings with an entity-relationship graph, GraphRAG facilitates structured reasoning hops across intermediate conceptual nodes.',
    tokenCount: 84,
    embeddingSummary: 'GraphRAG formulation; limits of dense vector retrieval; relational continuity in scientific QA.',
    entities: ['GraphRAG', 'Dense Vector Retrieval', 'Multi-hop Question Answering', 'Dr. Maya Chen']
  },
  {
    id: 'chk-1-2',
    docId: 'doc-1',
    docTitle: 'Graph-Based Retrieval for Scientific Question Answering',
    chunkIndex: 1,
    pageNumber: 3,
    text: 'Graph-based retrieval explicitly constructs reasoning paths: Paper A -> uses Method X -> evaluated on Dataset Y -> reports improvement for Task Z. Each hop in the traversal is weighted by relation extraction confidence, ensuring that hallucination is mitigated and every claim is auditable.',
    tokenCount: 76,
    embeddingSummary: 'Multi-hop traversal path definition; evidence weighting; auditability in scientific retrieval.',
    entities: ['GraphRAG', 'Evidence-Path Discovery', 'Hallucination Mitigation in Multi-hop QA']
  },
  {
    id: 'chk-2-1',
    docId: 'doc-2',
    docTitle: 'Evaluating Hybrid Retrieval Systems on Biomedical Literature',
    chunkIndex: 0,
    pageNumber: 2,
    text: 'Evaluating GraphRAG on the BioASQ 11b benchmark reveals a 41.8% gain in evidence-path discovery for multi-hop clinical queries compared to Dense Vector Retrieval. The Open Research Lab published this evaluation dataset to promote verifiable reasoning in clinical decision support.',
    tokenCount: 71,
    embeddingSummary: 'Empirical BioASQ benchmark; GraphRAG vs Dense Vector Retrieval; Open Research Lab publication.',
    entities: ['GraphRAG', 'BioASQ', 'Dense Vector Retrieval', 'Open Research Lab', 'Dr. Maya Chen']
  },
  {
    id: 'chk-2-2',
    docId: 'doc-2',
    docTitle: 'Evaluating Hybrid Retrieval Systems on Biomedical Literature',
    chunkIndex: 1,
    pageNumber: 4,
    text: 'On biomedical literature where queries require multi-step inference, GraphRAG demonstrated 89.2% precision on gold-standard reasoning chains on BioASQ, whereas standard vector search decayed rapidly beyond 1-hop queries (dropping to 38.4% accuracy).',
    tokenCount: 63,
    embeddingSummary: 'Multi-step inference accuracy on BioASQ; precision decay of vector search vs GraphRAG.',
    entities: ['GraphRAG', 'BioASQ', 'Multi-hop Question Answering']
  },
  {
    id: 'chk-3-1',
    docId: 'doc-3',
    docTitle: 'Attention-Enhanced Knowledge Graphs for Complex Reasoning',
    chunkIndex: 0,
    pageNumber: 2,
    text: 'We formulate the Controllable Multi-Hop Traverser, an attention-gated mechanism that dynamically prunes spurious semantic associations while amplifying verified empirical relations. Co-authored by Dr. Aris Thorne and Dr. Maya Chen.',
    tokenCount: 56,
    embeddingSummary: 'Attention-enhanced graph traverser; pruning spurious links; Aris Thorne and Maya Chen collaboration.',
    entities: ['Controllable Multi-Hop Traverser', 'Dr. Aris Thorne', 'Dr. Maya Chen', 'GraphRAG']
  },
  {
    id: 'chk-4-1',
    docId: 'doc-4',
    docTitle: 'BioASQ 11b: Benchmark Evaluation on Biomedical QA',
    chunkIndex: 0,
    pageNumber: 1,
    text: 'BioASQ Task 11b provides a collection of 4,800 complex questions curated by medical researchers. Answers require multi-hop synthesis across multiple MEDLINE abstracts, making it the premier benchmark for evaluating hybrid retrieval systems.',
    tokenCount: 62,
    embeddingSummary: 'BioASQ 11b benchmark dataset overview; MEDLINE synthesis; multi-hop QA standard.',
    entities: ['BioASQ', 'Multi-hop Question Answering', 'BioASQ Consortium']
  },
  {
    id: 'chk-5-1',
    docId: 'doc-5',
    docTitle: 'SciFact-Open: Scientific Claim Verification through Structured Graphs',
    chunkIndex: 0,
    pageNumber: 2,
    text: 'SciFact evaluates the ability of NLP systems to verify scientific claims and locate supporting or refuting evidence rationales. Dr. Elena Rostova demonstrated that graph-guided retrieval identifies 27% more relevant rationales than bi-encoder dense indices.',
    tokenCount: 65,
    embeddingSummary: 'SciFact claim verification; Dr. Elena Rostova evaluation; graph-guided rationale extraction.',
    entities: ['SciFact', 'Scientific Claim Verification', 'Dr. Elena Rostova']
  },
  {
    id: 'chk-6-1',
    docId: 'doc-6',
    docTitle: 'Institutional Compliance & Data Governance Standards in AI-Assisted Clinical Trials',
    chunkIndex: 0,
    pageNumber: 2,
    text: 'Standard 4.2 dictates that all AI-derived recommendations in clinical investigations must maintain complete cryptographic provenance and citation trails linking assertions to source publications. Adherence to the NIH Data Management and Sharing Policy is mandatory.',
    tokenCount: 60,
    embeddingSummary: 'GCP Standard 4.2 audit trail requirement; NIH Data Management policy; clinical governance.',
    entities: ['GCP Standard 4.2: Audit Trail Verification', 'NIH Data Management and Sharing Policy', 'AI-Assisted Clinical Trials']
  }
];

export const sampleQuestions: { question: string; category: string; description: string }[] = [
  {
    question: 'Which method was evaluated on BioASQ, what task does it support, and which author is associated with the relevant research paper?',
    category: 'Multi-hop Reasoning',
    description: 'Requires traversing Evaluation paper -> Method -> Dataset -> Task -> Research Paper -> Author'
  },
  {
    question: 'Which datasets were used by papers that applied method GraphRAG and improved performance on Multi-hop Question Answering?',
    category: 'Comparative Benchmark',
    description: 'Connects GraphRAG across multiple papers, datasets (BioASQ, SciFact), and task metrics'
  },
  {
    question: 'What policies are connected to the compliance issue mentioned in the audit findings for clinical research?',
    category: 'Regulatory Audit',
    description: 'Traverses clinical research topics to Standard 4.2 and the NIH Data Management policy'
  },
  {
    question: 'Which authors worked on studies that cite paper Graph-Based Retrieval for Scientific Question Answering and use methodology Dense Vector Retrieval?',
    category: 'Author Network',
    description: 'Connects authors (Dr. Maya Chen, Dr. Elena Rostova, Dr. Aris Thorne) through citations'
  }
];

export const seedSavedInvestigations: SavedInvestigation[] = [
  {
    id: 'inv-1',
    title: 'BioASQ Evaluation & Authorship Trace',
    question: 'Which method was evaluated on BioASQ, what task does it support, and which author is associated with the relevant research paper?',
    queryConfig: {
      mode: 'hybrid',
      depth: 3,
      maxSources: 5,
      prioritizeRecent: true,
      verifiedOnly: true,
      style: 'Analytical'
    },
    answerResult: {
      id: 'ans-seed-1',
      question: 'Which method was evaluated on BioASQ, what task does it support, and which author is associated with the relevant research paper?',
      answerText: `Based on the multi-document analysis across the research collection:

1. **Method Evaluated on BioASQ:**
The method evaluated on the **BioASQ** benchmark is **GraphRAG** [1]. In the study *"Evaluating Hybrid Retrieval Systems on Biomedical Literature"* published by the Open Research Lab, GraphRAG achieved a **41.8% gain in evidence-path discovery** compared to standard Dense Vector Retrieval [1, 2].

2. **Supported Task:**
GraphRAG was specifically formulated to support **Multi-hop Question Answering** [1, 3]. It resolves complex inquiries where answers require traversing conceptual relationships spanning multiple isolated document chunks rather than relying purely on isolated text matches [3].

3. **Associated Author & Primary Research Paper:**
The foundational paper introducing this method, *"Graph-Based Retrieval for Scientific Question Answering"*, was authored by **Dr. Maya Chen** (along with Dr. Elena Rostova) at the Open Research Lab [3, 4]. Dr. Chen is also a co-author on subsequent evaluation and attention-enhanced traversal studies [2, 5].`,
      reasoningPaths: [
        {
          fromNodeId: 'ent-paper-eval-2024',
          fromNodeName: 'Evaluating Hybrid Retrieval Systems on Biomedical Literature',
          fromNodeType: 'Document',
          relationType: 'evaluates',
          toNodeId: 'ent-graphrag',
          toNodeName: 'GraphRAG',
          toNodeType: 'Method',
          confidence: 0.98,
          evidenceSnippet: 'Evaluates the GraphRAG framework against dense vector baselines on biomedical literature collections.',
          docTitle: 'Evaluating Hybrid Retrieval Systems on Biomedical Literature',
          pageRef: 'Page 1'
        },
        {
          fromNodeId: 'ent-paper-eval-2024',
          fromNodeName: 'Evaluating Hybrid Retrieval Systems on Biomedical Literature',
          fromNodeType: 'Document',
          relationType: 'uses',
          toNodeId: 'ent-bioasq',
          toNodeName: 'BioASQ',
          toNodeType: 'Dataset',
          confidence: 0.99,
          evidenceSnippet: 'Evaluating Hybrid Retrieval Systems on Biomedical Literature uses BioASQ as its primary empirical evaluation benchmark.',
          docTitle: 'Evaluating Hybrid Retrieval Systems on Biomedical Literature',
          pageRef: 'Page 2'
        },
        {
          fromNodeId: 'ent-graphrag',
          fromNodeName: 'GraphRAG',
          fromNodeType: 'Method',
          relationType: 'supports',
          toNodeId: 'ent-multihop-qa',
          toNodeName: 'Multi-hop Question Answering',
          toNodeType: 'Task',
          confidence: 0.97,
          evidenceSnippet: 'GraphRAG directly supports multi-hop question answering across multi-document scientific literature.',
          docTitle: 'Graph-Based Retrieval for Scientific Question Answering',
          pageRef: 'Page 3'
        },
        {
          fromNodeId: 'ent-paper-chen-2024',
          fromNodeName: 'Graph-Based Retrieval for Scientific Question Answering',
          fromNodeType: 'Document',
          relationType: 'uses',
          toNodeId: 'ent-graphrag',
          toNodeName: 'GraphRAG',
          toNodeType: 'Method',
          confidence: 0.98,
          evidenceSnippet: 'In this paper, we formulate and implement GraphRAG as a hybrid retrieval system coupling dense vectors with relational graphs.',
          docTitle: 'Graph-Based Retrieval for Scientific Question Answering',
          pageRef: 'Page 2'
        },
        {
          fromNodeId: 'ent-maya-chen',
          fromNodeName: 'Dr. Maya Chen',
          fromNodeType: 'Person',
          relationType: 'authored_by',
          toNodeId: 'ent-paper-chen-2024',
          toNodeName: 'Graph-Based Retrieval for Scientific Question Answering',
          toNodeType: 'Document',
          confidence: 0.99,
          evidenceSnippet: 'Dr. Maya Chen and Dr. Elena Rostova authored Graph-Based Retrieval for Scientific Question Answering at Open Research Lab.',
          docTitle: 'Graph-Based Retrieval for Scientific Question Answering',
          pageRef: 'Page 1'
        }
      ],
      supportingEvidence: [
        {
          id: 1,
          docId: 'doc-2',
          docTitle: 'Evaluating Hybrid Retrieval Systems on Biomedical Literature',
          chunkRef: 'Chunk #0, Page 2',
          pageNumber: 2,
          confidence: 0.98,
          excerpt: 'Evaluating GraphRAG on the BioASQ 11b benchmark reveals a 41.8% gain in evidence-path discovery for multi-hop clinical queries compared to Dense Vector Retrieval.',
          relevanceExplanation: 'Empirical benchmark confirming that GraphRAG is the method evaluated on BioASQ.',
          linkedEntities: ['GraphRAG', 'BioASQ', 'Open Research Lab']
        },
        {
          id: 2,
          docId: 'doc-2',
          docTitle: 'Evaluating Hybrid Retrieval Systems on Biomedical Literature',
          chunkRef: 'Chunk #1, Page 4',
          pageNumber: 4,
          confidence: 0.96,
          excerpt: 'On biomedical literature where queries require multi-step inference, GraphRAG demonstrated 89.2% precision on gold-standard reasoning chains on BioASQ.',
          relevanceExplanation: 'Demonstrates quantitative precision gains on multi-hop biomedical reasoning tasks.',
          linkedEntities: ['GraphRAG', 'BioASQ', 'Multi-hop Question Answering']
        },
        {
          id: 3,
          docId: 'doc-1',
          docTitle: 'Graph-Based Retrieval for Scientific Question Answering',
          chunkRef: 'Chunk #0, Page 1',
          pageNumber: 1,
          confidence: 0.99,
          excerpt: 'By coupling dense embeddings with an entity-relationship graph, GraphRAG facilitates structured reasoning hops across intermediate conceptual nodes for multi-hop question answering.',
          relevanceExplanation: 'Validates that GraphRAG was engineered to support multi-hop question answering.',
          linkedEntities: ['GraphRAG', 'Multi-hop Question Answering', 'Dr. Maya Chen']
        },
        {
          id: 4,
          docId: 'doc-1',
          docTitle: 'Graph-Based Retrieval for Scientific Question Answering',
          chunkRef: 'Front Matter, Page 1',
          pageNumber: 1,
          confidence: 0.99,
          excerpt: 'Graph-Based Retrieval for Scientific Question Answering. Authors: Maya Chen, Elena Rostova — Open Research Lab, 2024.',
          relevanceExplanation: 'Direct citation establishing Dr. Maya Chen as principal author of the GraphRAG research paper.',
          linkedEntities: ['Dr. Maya Chen', 'Graph-Based Retrieval for Scientific Question Answering']
        }
      ],
      retrievedGraph: {
        nodes: [
          { id: 'ent-paper-eval-2024', name: 'Evaluating Hybrid Retrieval Systems...', type: 'Document', description: 'Benchmark paper', confidence: 1.0, sourceDocIds: ['doc-2'], degree: 4, isRetrieved: true },
          { id: 'ent-graphrag', name: 'GraphRAG', type: 'Method', description: 'Hybrid retrieval framework', confidence: 0.98, sourceDocIds: ['doc-1', 'doc-2'], degree: 5, isRetrieved: true },
          { id: 'ent-bioasq', name: 'BioASQ', type: 'Dataset', description: 'Biomedical benchmark dataset', confidence: 0.99, sourceDocIds: ['doc-2'], degree: 3, isRetrieved: true },
          { id: 'ent-multihop-qa', name: 'Multi-hop Question Answering', type: 'Task', description: 'Multi-step QA task', confidence: 0.97, sourceDocIds: ['doc-1'], degree: 3, isRetrieved: true },
          { id: 'ent-paper-chen-2024', name: 'Graph-Based Retrieval for...', type: 'Document', description: 'Foundational paper', confidence: 1.0, sourceDocIds: ['doc-1'], degree: 4, isRetrieved: true },
          { id: 'ent-maya-chen', name: 'Dr. Maya Chen', type: 'Person', description: 'Principal investigator', confidence: 0.99, sourceDocIds: ['doc-1'], degree: 3, isRetrieved: true },
          { id: 'ent-open-research-lab', name: 'Open Research Lab', type: 'Organization', description: 'Publishing research lab', confidence: 0.98, sourceDocIds: ['doc-2'], degree: 2, isRetrieved: true }
        ],
        edges: [
          { id: 'rel-4', source: 'ent-paper-eval-2024', target: 'ent-graphrag', relationType: 'evaluates', confidence: 0.98, sourceDocTitle: 'Evaluating Hybrid Retrieval Systems...', evidenceText: 'Evaluates GraphRAG on BioASQ', pageRef: 'Page 1', isRetrieved: true },
          { id: 'rel-5', source: 'ent-paper-eval-2024', target: 'ent-bioasq', relationType: 'uses', confidence: 0.99, sourceDocTitle: 'Evaluating Hybrid Retrieval Systems...', evidenceText: 'Uses BioASQ benchmark', pageRef: 'Page 2', isRetrieved: true },
          { id: 'rel-3', source: 'ent-graphrag', target: 'ent-multihop-qa', relationType: 'supports', confidence: 0.97, sourceDocTitle: 'Graph-Based Retrieval...', evidenceText: 'Supports multi-hop QA', pageRef: 'Page 3', isRetrieved: true },
          { id: 'rel-2', source: 'ent-paper-chen-2024', target: 'ent-graphrag', relationType: 'uses', confidence: 0.98, sourceDocTitle: 'Graph-Based Retrieval...', evidenceText: 'Formulates GraphRAG', pageRef: 'Page 2', isRetrieved: true },
          { id: 'rel-1', source: 'ent-maya-chen', target: 'ent-paper-chen-2024', relationType: 'authored_by', confidence: 0.99, sourceDocTitle: 'Graph-Based Retrieval...', evidenceText: 'Authored by Dr. Maya Chen', pageRef: 'Page 1', isRetrieved: true }
        ]
      },
      diagnostics: {
        semanticChunksRetrieved: 6,
        relevantEntitiesFound: 7,
        graphPathsTraversed: 5,
        avgRelationConfidence: 0.98,
        overallConfidence: 0.97,
        vectorSimilarityTop: 0.93,
        processingTimeMs: 245,
        retrievalModeUsed: 'hybrid',
        notes: 'Complete 3-hop traversal verified across 3 source publications.'
      },
      timestamp: '2024-04-10 14:22:15',
      queryConfig: {
        mode: 'hybrid',
        depth: 3,
        maxSources: 5,
        prioritizeRecent: true,
        verifiedOnly: true,
        style: 'Analytical'
      }
    },
    dateCreated: '2024-04-10',
    tags: ['BioASQ', 'GraphRAG', 'Authorship', 'Multi-hop'],
    savedBy: 'Dr. Maya Chen',
    collection: 'Biomedical & Scientific Papers',
    notes: 'Key baseline verification of GraphRAG against BioASQ benchmark and authorship tracing.'
  },
  {
    id: 'inv-2',
    title: 'Audit Trail & Compliance Standards',
    question: 'What policies are connected to the compliance issue mentioned in the audit findings for clinical research?',
    queryConfig: {
      mode: 'hybrid',
      depth: 2,
      maxSources: 4,
      prioritizeRecent: true,
      verifiedOnly: true,
      style: 'Concise'
    },
    answerResult: {
      id: 'ans-seed-2',
      question: 'What policies are connected to the compliance issue mentioned in the audit findings for clinical research?',
      answerText: `The audit findings in clinical research link directly to two primary regulatory standards:

1. **GCP Standard 4.2 (Audit Trail Verification):** Mandates cryptographically verifiable provenance for all automated or AI-assisted research inferences in clinical trial environments [1].
2. **NIH Data Management and Sharing Policy:** Mandates public deposition and accessibility standards for research data [1]. Both policies govern decision-support tools deployed in clinical trial methodologies.`,
      reasoningPaths: [
        {
          fromNodeId: 'ent-policy-audit-42',
          fromNodeName: 'GCP Standard 4.2: Audit Trail Verification',
          fromNodeType: 'Policy',
          relationType: 'governed_by',
          toNodeId: 'ent-clinical-trials',
          toNodeName: 'AI-Assisted Clinical Trials',
          toNodeType: 'Topic',
          confidence: 0.97,
          evidenceSnippet: 'Clinical trial decision systems are governed by GCP Standard 4.2 audit trail verification policies.',
          docTitle: 'Institutional Compliance & Data Governance Standards in AI-Assisted Clinical Trials',
          pageRef: 'Page 2'
        },
        {
          fromNodeId: 'ent-policy-nih-dms',
          fromNodeName: 'NIH Data Management and Sharing Policy',
          fromNodeType: 'Policy',
          relationType: 'governed_by',
          toNodeId: 'ent-clinical-trials',
          toNodeName: 'AI-Assisted Clinical Trials',
          toNodeType: 'Topic',
          confidence: 0.95,
          evidenceSnippet: 'All public clinical datasets must conform to the NIH Data Management and Sharing Policy.',
          docTitle: 'Institutional Compliance & Data Governance Standards in AI-Assisted Clinical Trials',
          pageRef: 'Page 3'
        }
      ],
      supportingEvidence: [
        {
          id: 1,
          docId: 'doc-6',
          docTitle: 'Institutional Compliance & Data Governance Standards in AI-Assisted Clinical Trials',
          chunkRef: 'Chunk #0, Page 2',
          pageNumber: 2,
          confidence: 0.97,
          excerpt: 'Standard 4.2 dictates that all AI-derived recommendations in clinical investigations must maintain complete cryptographic provenance and citation trails linking assertions to source publications.',
          relevanceExplanation: 'Specifies the audit policy requirement.',
          linkedEntities: ['GCP Standard 4.2: Audit Trail Verification', 'NIH Data Management and Sharing Policy']
        }
      ],
      retrievedGraph: {
        nodes: [
          { id: 'ent-policy-audit-42', name: 'GCP Standard 4.2', type: 'Policy', description: 'Audit trail verification', confidence: 0.96, sourceDocIds: ['doc-6'], degree: 2, isRetrieved: true },
          { id: 'ent-policy-nih-dms', name: 'NIH DMS Policy', type: 'Policy', description: 'NIH data management', confidence: 0.94, sourceDocIds: ['doc-6'], degree: 2, isRetrieved: true },
          { id: 'ent-clinical-trials', name: 'AI-Assisted Clinical Trials', type: 'Topic', description: 'Clinical AI research', confidence: 0.92, sourceDocIds: ['doc-6'], degree: 2, isRetrieved: true }
        ],
        edges: [
          { id: 'rel-20', source: 'ent-policy-audit-42', target: 'ent-clinical-trials', relationType: 'governed_by', confidence: 0.97, sourceDocTitle: 'Institutional Compliance...', evidenceText: 'Governed by Standard 4.2', pageRef: 'Page 2', isRetrieved: true },
          { id: 'rel-21', source: 'ent-policy-nih-dms', target: 'ent-clinical-trials', relationType: 'governed_by', confidence: 0.95, sourceDocTitle: 'Institutional Compliance...', evidenceText: 'Conforms to NIH DMS', pageRef: 'Page 3', isRetrieved: true }
        ]
      },
      diagnostics: {
        semanticChunksRetrieved: 3,
        relevantEntitiesFound: 3,
        graphPathsTraversed: 2,
        avgRelationConfidence: 0.96,
        overallConfidence: 0.96,
        vectorSimilarityTop: 0.91,
        processingTimeMs: 180,
        retrievalModeUsed: 'hybrid'
      },
      timestamp: '2024-04-08 09:15:40',
      queryConfig: {
        mode: 'hybrid',
        depth: 2,
        maxSources: 4,
        prioritizeRecent: true,
        verifiedOnly: true,
        style: 'Concise'
      }
    },
    dateCreated: '2024-04-08',
    tags: ['Compliance', 'Audit', 'GCP Standard 4.2', 'NIH'],
    savedBy: 'Dr. Elena Rostova',
    collection: 'Governance & Regulatory',
    notes: 'Regulatory compliance cross-reference for audit review board.'
  }
];
