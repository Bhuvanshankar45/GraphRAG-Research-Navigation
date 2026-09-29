import {
  Workspace,
  Document,
  DocumentChunk,
  Entity,
  Relationship,
  SavedInvestigation
} from '../types';
import {
  seedDocuments,
  seedChunks,
  seedEntities,
  seedRelationships,
  seedSavedInvestigations,
  sampleQuestions
} from './seedData';

export interface WorkspaceBundle {
  workspace: Workspace;
  documents: Document[];
  chunks: DocumentChunk[];
  entities: Entity[];
  relationships: Relationship[];
  savedInvestigations: SavedInvestigation[];
  sampleQuestions: { question: string; category: string; description: string }[];
}

// 1. Biomedical & AI Literature Workspace
export const biomedicalWorkspaceBundle: WorkspaceBundle = {
  workspace: {
    id: 'ws-biomed-ai',
    name: 'Biomedical & AI Literature',
    domain: 'Biomedical & AI',
    description: 'Academic papers, BioASQ benchmarks, GraphRAG methodology, and multi-hop scientific question answering.',
    activeCollection: 'Academic Papers & Benchmarks',
    totalDocs: seedDocuments.length,
    totalChunks: seedChunks.length,
    totalEntities: seedEntities.length,
    totalRelations: seedRelationships.length
  },
  documents: seedDocuments,
  chunks: seedChunks,
  entities: seedEntities,
  relationships: seedRelationships,
  savedInvestigations: seedSavedInvestigations,
  sampleQuestions: sampleQuestions
};

// 2. Enterprise Incident & Supply Chain Audit Workspace
const incidentDocs: Document[] = [
  {
    id: 'doc-inc-1',
    title: 'Incident Investigation Report IR-2024-88: Falcon PowerCell Thermal Event',
    authors: ['Safety Investigation Board', 'Marcus Vance (Lead Investigator)'],
    year: 2024,
    fileType: 'PDF',
    fileSize: '2.1 MB',
    pageCount: 14,
    uploadDate: '2024-05-10',
    status: 'Ready',
    chunksCount: 3,
    entitiesCount: 6,
    relationsCount: 6,
    collectionId: 'col-incident-audit',
    tags: ['Incident Report', 'Falcon PowerCell X1', 'Thermal Anomaly', 'Hardware'],
    summary: 'Investigation into the field thermal event affecting Falcon PowerCell X1 modules deployed in enterprise backup power racks.',
    extractedText: `INCIDENT INVESTIGATION REPORT IR-2024-88
Subject: Falcon PowerCell X1 High-Capacity Battery Module Thermal Excursion
Date of Occurrence: April 22, 2024

Summary of Event:
During scheduled peak-load discharge testing, rack unit B-04 containing Falcon PowerCell X1 battery modules experienced an uncontrolled thermal anomaly. Telemetry confirmed internal micro-shorting within cell serial batches manufactured by primary supplier Apex Lithium Systems at the Reno Gigaplant facility.

Findings:
The affected product is the Falcon PowerCell X1 module. Root-cause microscopy revealed cathode separator degradation supplied by Apex Lithium Systems under OEM Contract AGR-2022-44.`
  },
  {
    id: 'doc-inc-2',
    title: 'Supplier Quality Audit & Manufacturing Protocol: Apex Lithium Systems',
    authors: ['Quality Assurance Group', 'Horizon Tech Audit Team'],
    year: 2024,
    fileType: 'PDF',
    fileSize: '3.4 MB',
    pageCount: 22,
    uploadDate: '2024-05-18',
    status: 'Ready',
    chunksCount: 3,
    entitiesCount: 5,
    relationsCount: 5,
    collectionId: 'col-incident-audit',
    tags: ['Supplier Audit', 'Apex Lithium Systems', 'ISO-9001', 'Manufacturing'],
    summary: 'Supplier quality audit examining battery cell manufacturing tolerances, automated defect inspection, and ISO-9001 thermal safety compliance.',
    extractedText: `SUPPLIER QUALITY AUDIT: APEX LITHIUM SYSTEMS
Audit Reference: AUD-SUP-2024-12
Audited Entity: Apex Lithium Systems, Facility Reno Gigaplant Module 4

Scope & Findings:
Apex Lithium Systems is the designated tier-1 cell supplier for the Falcon PowerCell product line. Audit inspections revealed non-conformance with ISO-9001 Thermal Safety Standard clause 6.4 regarding automated optical inspection of cell separators between Q1 2023 and Q1 2024.`
  },
  {
    id: 'doc-inc-3',
    title: 'OEM Master Supply Agreement AGR-2022-44: Component Warranty & SLA',
    authors: ['Horizon Tech Legal & Procurement', 'Apex Lithium Systems Counsel'],
    year: 2022,
    fileType: 'DOCX',
    fileSize: '1.2 MB',
    pageCount: 30,
    uploadDate: '2024-01-15',
    status: 'Ready',
    chunksCount: 2,
    entitiesCount: 4,
    relationsCount: 4,
    collectionId: 'col-incident-audit',
    tags: ['Contract', 'Warranty', 'SLA', 'Procurement'],
    summary: 'Procurement agreement specifying warranty liabilities, defect remediation protocols, and manufacturing quality covenants.',
    extractedText: `MASTER SUPPLY AGREEMENT AGR-2022-44
Parties: Horizon Technologies Inc. ("Buyer") and Apex Lithium Systems Corp. ("Supplier")

Section 8. Warranty & Indemnification:
Supplier Apex Lithium Systems warrants that all battery components integrated into the Falcon PowerCell product suite shall conform to ISO-9001 thermal standards and be free from manufacturing separator defects.`
  }
];

const incidentEntities: Entity[] = [
  {
    id: 'ent-falcon-cell',
    name: 'Falcon PowerCell X1',
    type: 'Product',
    description: 'High-capacity lithium battery module deployed in enterprise backup power racks.',
    confidence: 0.99,
    sourceDocIds: ['doc-inc-1', 'doc-inc-2', 'doc-inc-3'],
    chunkIds: ['chk-inc-1', 'chk-inc-2'],
    degree: 5
  },
  {
    id: 'ent-incident-88',
    name: 'Incident Report IR-2024-88',
    type: 'Document',
    description: 'Official safety investigation report documenting the Falcon PowerCell thermal excursion event.',
    confidence: 1.0,
    sourceDocIds: ['doc-inc-1'],
    chunkIds: ['chk-inc-1'],
    degree: 4
  },
  {
    id: 'ent-supplier-apex',
    name: 'Apex Lithium Systems',
    type: 'Organization',
    description: 'Tier-1 lithium cell supplier responsible for cathode separator manufacturing and cell assembly.',
    confidence: 0.99,
    sourceDocIds: ['doc-inc-1', 'doc-inc-2', 'doc-inc-3'],
    chunkIds: ['chk-inc-1', 'chk-inc-2', 'chk-inc-3'],
    degree: 6
  },
  {
    id: 'ent-reno-facility',
    name: 'Reno Gigaplant Module 4',
    type: 'Location',
    description: 'Apex Lithium manufacturing plant where compromised cell batches were produced.',
    confidence: 0.95,
    sourceDocIds: ['doc-inc-1', 'doc-inc-2'],
    chunkIds: ['chk-inc-2'],
    degree: 3
  },
  {
    id: 'ent-iso-9001-thermal',
    name: 'ISO-9001 Thermal Safety Standard',
    type: 'Policy',
    description: 'Mandatory manufacturing standard governing automated optical inspection and thermal separator integrity.',
    confidence: 0.97,
    sourceDocIds: ['doc-inc-2', 'doc-inc-3'],
    chunkIds: ['chk-inc-2', 'chk-inc-3'],
    degree: 4
  },
  {
    id: 'ent-marcus-vance',
    name: 'Marcus Vance',
    type: 'Person',
    description: 'Lead Safety Investigator overseeing failure analysis of the Falcon PowerCell modules.',
    confidence: 0.96,
    sourceDocIds: ['doc-inc-1'],
    chunkIds: ['chk-inc-1'],
    degree: 3
  }
];

const incidentRelationships: Relationship[] = [
  {
    id: 'rel-inc-1',
    sourceId: 'ent-incident-88',
    targetId: 'ent-falcon-cell',
    relationType: 'affected_by',
    confidence: 0.99,
    sourceDocId: 'doc-inc-1',
    sourceDocTitle: 'Incident Investigation Report IR-2024-88',
    sourceChunkId: 'chk-inc-1',
    pageRef: 'Page 1',
    evidenceText: 'Incident Report IR-2024-88 investigates the thermal anomaly affecting the Falcon PowerCell X1 product.',
    timestamp: '2024-05-10'
  },
  {
    id: 'rel-inc-2',
    sourceId: 'ent-falcon-cell',
    targetId: 'ent-supplier-apex',
    relationType: 'supplied_by',
    confidence: 0.99,
    sourceDocId: 'doc-inc-1',
    sourceDocTitle: 'Incident Investigation Report IR-2024-88',
    sourceChunkId: 'chk-inc-1',
    pageRef: 'Page 2',
    evidenceText: 'Falcon PowerCell X1 internal cell modules are manufactured and supplied by Apex Lithium Systems.',
    timestamp: '2024-05-10'
  },
  {
    id: 'rel-inc-3',
    sourceId: 'ent-supplier-apex',
    targetId: 'ent-reno-facility',
    relationType: 'occurred_in',
    confidence: 0.98,
    sourceDocId: 'doc-inc-2',
    sourceDocTitle: 'Supplier Quality Audit & Manufacturing Protocol',
    sourceChunkId: 'chk-inc-2',
    pageRef: 'Page 3',
    evidenceText: 'Apex Lithium Systems operates the Reno Gigaplant Module 4 manufacturing line where separator defects originated.',
    timestamp: '2024-05-18'
  },
  {
    id: 'rel-inc-4',
    sourceId: 'ent-supplier-apex',
    targetId: 'ent-iso-9001-thermal',
    relationType: 'governed_by',
    confidence: 0.97,
    sourceDocId: 'doc-inc-2',
    sourceDocTitle: 'Supplier Quality Audit & Manufacturing Protocol',
    sourceChunkId: 'chk-inc-2',
    pageRef: 'Page 4',
    evidenceText: 'Apex Lithium Systems manufacturing processes are legally governed by the ISO-9001 Thermal Safety Standard.',
    timestamp: '2024-05-18'
  },
  {
    id: 'rel-inc-5',
    sourceId: 'ent-marcus-vance',
    targetId: 'ent-incident-88',
    relationType: 'authored_by',
    confidence: 0.98,
    sourceDocId: 'doc-inc-1',
    sourceDocTitle: 'Incident Investigation Report IR-2024-88',
    sourceChunkId: 'chk-inc-1',
    pageRef: 'Page 1',
    evidenceText: 'Marcus Vance authored Incident Investigation Report IR-2024-88 for the Safety Investigation Board.',
    timestamp: '2024-05-10'
  }
];

const incidentChunks: DocumentChunk[] = [
  {
    id: 'chk-inc-1',
    docId: 'doc-inc-1',
    docTitle: 'Incident Investigation Report IR-2024-88',
    chunkIndex: 0,
    pageNumber: 1,
    text: 'During scheduled peak-load discharge testing, rack unit B-04 containing Falcon PowerCell X1 battery modules experienced an uncontrolled thermal anomaly. Telemetry confirmed internal micro-shorting within cell serial batches manufactured by primary supplier Apex Lithium Systems.',
    tokenCount: 68,
    embeddingSummary: 'Incident IR-2024-88 thermal event; Falcon PowerCell X1 product; Apex Lithium Systems supplier responsibility.',
    entities: ['Incident Report IR-2024-88', 'Falcon PowerCell X1', 'Apex Lithium Systems', 'Marcus Vance']
  },
  {
    id: 'chk-inc-2',
    docId: 'doc-inc-2',
    docTitle: 'Supplier Quality Audit: Apex Lithium Systems',
    chunkIndex: 0,
    pageNumber: 3,
    text: 'Apex Lithium Systems is the designated tier-1 cell supplier for the Falcon PowerCell product line. Audit inspections at the Reno Gigaplant Module 4 revealed non-conformance with ISO-9001 Thermal Safety Standard regarding separator optical inspection.',
    tokenCount: 64,
    embeddingSummary: 'Apex Lithium Systems Reno plant audit; ISO-9001 non-conformance; Falcon PowerCell supply relationship.',
    entities: ['Apex Lithium Systems', 'Falcon PowerCell X1', 'Reno Gigaplant Module 4', 'ISO-9001 Thermal Safety Standard']
  },
  {
    id: 'chk-inc-3',
    docId: 'doc-inc-3',
    docTitle: 'OEM Master Supply Agreement AGR-2022-44',
    chunkIndex: 0,
    pageNumber: 8,
    text: 'Section 8. Warranty & Indemnification: Supplier Apex Lithium Systems warrants that all battery components integrated into the Falcon PowerCell product suite shall conform to ISO-9001 thermal standards.',
    tokenCount: 48,
    embeddingSummary: 'Supply agreement terms; Apex Lithium Systems warranty obligations for Falcon PowerCell.',
    entities: ['Apex Lithium Systems', 'Falcon PowerCell X1', 'ISO-9001 Thermal Safety Standard']
  }
];

export const incidentWorkspaceBundle: WorkspaceBundle = {
  workspace: {
    id: 'ws-incident-supply',
    name: 'Enterprise Incident & Supply Chain Audit',
    domain: 'Product & Supply Chain',
    description: 'Hardware failure investigations, product telemetry, supplier quality audits, and liability agreements.',
    activeCollection: 'Incident & Supplier Reports',
    totalDocs: incidentDocs.length,
    totalChunks: incidentChunks.length,
    totalEntities: incidentEntities.length,
    totalRelations: incidentRelationships.length
  },
  documents: incidentDocs,
  chunks: incidentChunks,
  entities: incidentEntities,
  relationships: incidentRelationships,
  savedInvestigations: [],
  sampleQuestions: [
    {
      question: 'Which product is linked to the incident report and which supplier is responsible for it?',
      category: 'Incident & Supplier Attribution',
      description: 'Traverses Incident Report IR-2024-88 -> Falcon PowerCell X1 -> Apex Lithium Systems'
    },
    {
      question: 'What manufacturing facility produced the compromised cells and what standard was violated?',
      category: 'Quality Audit',
      description: 'Traverses Apex Lithium Systems -> Reno Gigaplant Module 4 -> ISO-9001 Thermal Safety Standard'
    }
  ]
};

// 3. Corporate Policy & Regulatory Compliance Workspace
const complianceDocs: Document[] = [
  {
    id: 'doc-comp-1',
    title: 'Annual Internal Audit Report AUD-2024: Data Governance & Compliance',
    authors: ['Internal Audit Committee', 'Claire Sterling (Chief Audit Executive)'],
    year: 2024,
    fileType: 'PDF',
    fileSize: '1.9 MB',
    pageCount: 18,
    uploadDate: '2024-04-12',
    status: 'Ready',
    chunksCount: 3,
    entitiesCount: 5,
    relationsCount: 5,
    collectionId: 'col-compliance-audit',
    tags: ['Audit Report', 'Data Governance', 'Cross-Border', 'Risk'],
    summary: 'Internal audit findings detailing unencrypted cross-border data replication and regulatory compliance discrepancies.',
    extractedText: `ANNUAL INTERNAL AUDIT REPORT AUD-2024
Issued by: Global Audit & Risk Committee
Audit Finding Ref: AUD-2024-03

Executive Summary:
Audit testing discovered that telemetry replication from EU regional datacenters to US analytical clusters utilized unencrypted transmission channels, constituting a non-compliance event under Global Privacy Standard 8.4 and triggering reporting obligations under the Vendor Risk Notification Policy.`
  },
  {
    id: 'doc-comp-2',
    title: 'Global Privacy Framework Standard 8.4: Cross-Border Data Transfers',
    authors: ['Legal Compliance Department', 'Data Protection Officer'],
    year: 2023,
    fileType: 'PDF',
    fileSize: '1.4 MB',
    pageCount: 16,
    uploadDate: '2024-01-10',
    status: 'Ready',
    chunksCount: 2,
    entitiesCount: 4,
    relationsCount: 4,
    collectionId: 'col-compliance-audit',
    tags: ['Privacy Policy', 'GDPR', 'Encryption', 'Standard 8.4'],
    summary: 'Corporate policy specifying end-to-end encryption requirements and adequacy safeguards for international data transfers.',
    extractedText: `GLOBAL PRIVACY FRAMEWORK STANDARD 8.4
Mandatory Requirements for Transnational Data Replication

Section 4. Cryptographic Controls:
All production datasets containing customer or employee telemetry transferred across jurisdictional borders must enforce TLS 1.3 encryption in transit with mutual authentication. Failure to adhere mandates immediate escalation to the Regulatory Oversight Board.`
  }
];

const complianceEntities: Entity[] = [
  {
    id: 'ent-audit-finding-3',
    name: 'Audit Finding AUD-2024-03',
    type: 'Event',
    description: 'Documented compliance issue concerning unencrypted cross-border telemetry replication.',
    confidence: 0.99,
    sourceDocIds: ['doc-comp-1'],
    chunkIds: ['chk-comp-1'],
    degree: 4
  },
  {
    id: 'ent-privacy-std-84',
    name: 'Global Privacy Standard 8.4',
    type: 'Policy',
    description: 'Corporate privacy standard mandating TLS 1.3 encryption for transnational data replication.',
    confidence: 0.99,
    sourceDocIds: ['doc-comp-1', 'doc-comp-2'],
    chunkIds: ['chk-comp-1', 'chk-comp-2'],
    degree: 5
  },
  {
    id: 'ent-vendor-notify-policy',
    name: 'Vendor Risk Notification Policy',
    type: 'Policy',
    description: 'Mandatory notification procedure requiring third-party data disclosures to be audited within 72 hours.',
    confidence: 0.96,
    sourceDocIds: ['doc-comp-1'],
    chunkIds: ['chk-comp-1'],
    degree: 3
  },
  {
    id: 'ent-oversight-board',
    name: 'Regulatory Oversight Board',
    type: 'Organization',
    description: 'External governance body monitoring compliance with transnational data protection agreements.',
    confidence: 0.95,
    sourceDocIds: ['doc-comp-2'],
    chunkIds: ['chk-comp-2'],
    degree: 3
  }
];

const complianceRelationships: Relationship[] = [
  {
    id: 'rel-comp-1',
    sourceId: 'ent-audit-finding-3',
    targetId: 'ent-privacy-std-84',
    relationType: 'governed_by',
    confidence: 0.98,
    sourceDocId: 'doc-comp-1',
    sourceDocTitle: 'Annual Internal Audit Report AUD-2024',
    sourceChunkId: 'chk-comp-1',
    pageRef: 'Page 2',
    evidenceText: 'Audit Finding AUD-2024-03 directly violates the requirements set forth in Global Privacy Standard 8.4.',
    timestamp: '2024-04-12'
  },
  {
    id: 'rel-comp-2',
    sourceId: 'ent-audit-finding-3',
    targetId: 'ent-vendor-notify-policy',
    relationType: 'related_to',
    confidence: 0.96,
    sourceDocId: 'doc-comp-1',
    sourceDocTitle: 'Annual Internal Audit Report AUD-2024',
    sourceChunkId: 'chk-comp-1',
    pageRef: 'Page 3',
    evidenceText: 'The cross-border data transfer issue triggered mandatory reporting covenants under the Vendor Risk Notification Policy.',
    timestamp: '2024-04-12'
  },
  {
    id: 'rel-comp-3',
    sourceId: 'ent-privacy-std-84',
    targetId: 'ent-oversight-board',
    relationType: 'governed_by',
    confidence: 0.97,
    sourceDocId: 'doc-comp-2',
    sourceDocTitle: 'Global Privacy Framework Standard 8.4',
    sourceChunkId: 'chk-comp-2',
    pageRef: 'Page 4',
    evidenceText: 'Global Privacy Standard 8.4 enforcement is supervised by the Regulatory Oversight Board.',
    timestamp: '2024-01-10'
  }
];

const complianceChunks: DocumentChunk[] = [
  {
    id: 'chk-comp-1',
    docId: 'doc-comp-1',
    docTitle: 'Annual Internal Audit Report AUD-2024',
    chunkIndex: 0,
    pageNumber: 2,
    text: 'Audit testing discovered that telemetry replication from EU regional datacenters utilized unencrypted transmission channels, constituting a non-compliance event under Global Privacy Standard 8.4 and triggering reporting obligations under the Vendor Risk Notification Policy.',
    tokenCount: 65,
    embeddingSummary: 'Audit finding AUD-2024-03; unencrypted cross-border replication; violation of Global Privacy Standard 8.4 and Vendor Risk Notification Policy.',
    entities: ['Audit Finding AUD-2024-03', 'Global Privacy Standard 8.4', 'Vendor Risk Notification Policy']
  },
  {
    id: 'chk-comp-2',
    docId: 'doc-comp-2',
    docTitle: 'Global Privacy Framework Standard 8.4',
    chunkIndex: 0,
    pageNumber: 3,
    text: 'All production datasets transferred across jurisdictional borders must enforce TLS 1.3 encryption in transit with mutual authentication. Failure to adhere mandates immediate escalation to the Regulatory Oversight Board.',
    tokenCount: 54,
    embeddingSummary: 'Standard 8.4 encryption requirements; jurisdiction transfers; Regulatory Oversight Board escalation.',
    entities: ['Global Privacy Standard 8.4', 'Regulatory Oversight Board']
  }
];

export const complianceWorkspaceBundle: WorkspaceBundle = {
  workspace: {
    id: 'ws-compliance-governance',
    name: 'Corporate Policy & Regulatory Governance',
    domain: 'Compliance & Legal',
    description: 'Internal audit reports, data governance policies, cross-border transfer standards, and privacy mandates.',
    activeCollection: 'Corporate Governance & Audits',
    totalDocs: complianceDocs.length,
    totalChunks: complianceChunks.length,
    totalEntities: complianceEntities.length,
    totalRelations: complianceRelationships.length
  },
  documents: complianceDocs,
  chunks: complianceChunks,
  entities: complianceEntities,
  relationships: complianceRelationships,
  savedInvestigations: [],
  sampleQuestions: [
    {
      question: 'What policies are connected to the compliance issue mentioned in the audit findings?',
      category: 'Regulatory Audit Trace',
      description: 'Traverses Audit Finding AUD-2024-03 -> Global Privacy Standard 8.4 & Vendor Risk Notification Policy'
    }
  ]
};

// 4. Custom Blank Workspace (Clean canvas for custom user files)
export const customResearchWorkspaceBundle: WorkspaceBundle = {
  workspace: {
    id: 'ws-custom-research',
    name: 'My Custom Research Workspace',
    domain: 'Custom Research',
    description: 'A clean, dedicated workspace ready for your own uploaded PDFs, DOCX papers, notes, or CSV datasets.',
    activeCollection: 'User Uploaded Collection',
    totalDocs: 0,
    totalChunks: 0,
    totalEntities: 0,
    totalRelations: 0
  },
  documents: [],
  chunks: [],
  entities: [],
  relationships: [],
  savedInvestigations: [],
  sampleQuestions: [
    {
      question: 'Summarize the primary entities, methods, and relationships identified in my uploaded documents.',
      category: 'Custom Synthesis',
      description: 'Synthesizes findings across any documents you upload'
    }
  ]
};

export const availableWorkspaces: WorkspaceBundle[] = [
  biomedicalWorkspaceBundle,
  incidentWorkspaceBundle,
  complianceWorkspaceBundle,
  customResearchWorkspaceBundle
];
