import React, { useState, useMemo } from 'react';
import {
  Document,
  DocumentChunk,
  Entity,
  Relationship,
  GraphNode,
  GraphEdge,
  SavedInvestigation,
  UserSettings,
  AnswerResult,
  Workspace,
  UserProfile
} from './types';
import {
  initialUserSettings,
  initialWorkspace
} from './data/seedData';
import {
  availableWorkspaces,
  WorkspaceBundle
} from './data/multiWorkspaces';
import { GraphRAGService } from './services/graphRagEngine';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { DocumentLibraryView } from './components/documents/DocumentLibraryView';
import { KnowledgeGraphView } from './components/graph/KnowledgeGraphView';
import { AskResearchView } from './components/research/AskResearchView';
import { SavedInvestigationsView } from './components/investigations/SavedInvestigationsView';
import { SettingsView } from './components/settings/SettingsView';
import { WorkspaceSwitcherModal } from './components/workspace/WorkspaceSwitcherModal';
import { UserProfileModal } from './components/profile/UserProfileModal';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // User Profile / Custom Investigator Credentials State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('graphrag_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to default
      }
    }
    return {
      id: 'usr-primary',
      name: 'Bhuvan Shankar',
      role: 'Lead Research Analyst',
      email: 'bhuvan.shankar@research.org',
      initials: 'BS',
      avatarColor: 'linear-gradient(135deg, #003366 0%, #006699 100%)'
    };
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleSaveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem('graphrag_user_profile', JSON.stringify(newProfile));
    showToast(`Profile credentials updated for ${newProfile.name}`);
  };

  // Multi-Workspace Management State
  const [workspacesList, setWorkspacesList] = useState<WorkspaceBundle[]>(availableWorkspaces);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>('ws-biomed-ai');
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);

  // Current active workspace bundle
  const activeBundle = useMemo(() => {
    return workspacesList.find(b => b.workspace.id === currentWorkspaceId) || workspacesList[0];
  }, [workspacesList, currentWorkspaceId]);

  // Application Data States (for current workspace)
  const [documents, setDocuments] = useState<Document[]>(activeBundle.documents);
  const [chunks, setChunks] = useState<DocumentChunk[]>(activeBundle.chunks);
  const [entities, setEntities] = useState<Entity[]>(activeBundle.entities);
  const [relationships, setRelationships] = useState<Relationship[]>(activeBundle.relationships);
  const [savedInvestigations, setSavedInvestigations] = useState<SavedInvestigation[]>(activeBundle.savedInvestigations);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    ...initialUserSettings,
    workspaceName: activeBundle.workspace.name,
    activeCollection: activeBundle.workspace.activeCollection
  });

  // Selected document for library drawer
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  // Context passing for Ask Research
  const [researchQuery, setResearchQuery] = useState<string>('');
  const [researchAnswer, setResearchAnswer] = useState<AnswerResult | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Switch Workspace Handler
  const handleSelectWorkspace = (bundle: WorkspaceBundle) => {
    setCurrentWorkspaceId(bundle.workspace.id);
    setDocuments(bundle.documents);
    setChunks(bundle.chunks);
    setEntities(bundle.entities);
    setRelationships(bundle.relationships);
    setSavedInvestigations(bundle.savedInvestigations);
    setUserSettings(prev => ({
      ...prev,
      workspaceName: bundle.workspace.name,
      activeCollection: bundle.workspace.activeCollection
    }));
    setSelectedDoc(null);
    setResearchQuery('');
    setResearchAnswer(null);
    showToast(`Switched to workspace: "${bundle.workspace.name}"`);
  };

  // Create New Workspace Handler
  const handleCreateWorkspace = (name: string, domain: string, description: string) => {
    const newWsId = `ws-${Date.now()}`;
    const newBundle: WorkspaceBundle = {
      workspace: {
        id: newWsId,
        name,
        domain,
        description,
        activeCollection: `${name} Collection`,
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
          question: `What are the primary findings and core entities extracted in this workspace?`,
          category: 'Overview Synthesis',
          description: 'Synthesizes information from your newly uploaded documents.'
        }
      ]
    };

    setWorkspacesList(prev => [...prev, newBundle]);
    handleSelectWorkspace(newBundle);
    showToast(`Created workspace "${name}"`);
    setActiveTab('documents');
  };

  // GraphRAG Service instance
  const graphRagService = useMemo(() => {
    return new GraphRAGService(documents, chunks, entities, relationships);
  }, [documents, chunks, entities, relationships]);

  // Transform entities and relationships into graph nodes & edges
  const graphNodes: GraphNode[] = useMemo(() => {
    return entities.map(e => ({
      id: e.id,
      name: e.name,
      type: e.type,
      description: e.description,
      confidence: e.confidence,
      sourceDocIds: e.sourceDocIds,
      degree: e.degree || 3
    }));
  }, [entities]);

  const graphEdges: GraphEdge[] = useMemo(() => {
    return relationships.map(r => ({
      id: r.id,
      source: r.sourceId,
      target: r.targetId,
      relationType: r.relationType,
      confidence: r.confidence,
      sourceDocTitle: r.sourceDocTitle,
      evidenceText: r.evidenceText,
      pageRef: r.pageRef
    }));
  }, [relationships]);

  // Upload handler from Document Library
  const handleUploadFile = (
    newDoc: Document,
    newChunks: DocumentChunk[],
    newEntities: Entity[],
    newRels: Relationship[]
  ) => {
    setDocuments(prev => [newDoc, ...prev]);
    setChunks(prev => [...newChunks, ...prev]);
    setEntities(prev => [...newEntities, ...prev]);
    setRelationships(prev => [...newRels, ...prev]);
    showToast(`Successfully indexed "${newDoc.title}"`);
  };

  // Save investigation from Ask Research
  const handleSaveInvestigation = (answer: AnswerResult, title: string, tags: string[]) => {
    const newInv: SavedInvestigation = {
      id: `inv-${Date.now()}`,
      title,
      question: answer.question,
      queryConfig: answer.queryConfig,
      answerResult: answer,
      dateCreated: new Date().toISOString().split('T')[0],
      tags,
      savedBy: userProfile.name,
      collection: userSettings.activeCollection
    };

    setSavedInvestigations(prev => [newInv, ...prev]);
    showToast(`Investigation saved as "${title}"`);
  };

  // Open investigation from Saved Investigations
  const handleOpenInvestigation = (inv: SavedInvestigation) => {
    setResearchQuery(inv.question);
    setResearchAnswer(inv.answerResult);
    setActiveTab('research');
  };

  // Duplicate investigation
  const handleDuplicateInvestigation = (inv: SavedInvestigation) => {
    const dup: SavedInvestigation = {
      ...inv,
      id: `inv-${Date.now()}`,
      title: `${inv.title} (Copy)`,
      dateCreated: new Date().toISOString().split('T')[0]
    };
    setSavedInvestigations(prev => [dup, ...prev]);
    showToast(`Investigation duplicated`);
  };

  // Delete investigation
  const handleDeleteInvestigation = (id: string) => {
    setSavedInvestigations(prev => prev.filter(i => i.id !== id));
    showToast(`Investigation removed`);
  };

  // Ask about entity from Knowledge Graph
  const handleAskAboutEntity = (entityName: string) => {
    const q = `How does ${entityName} connect to related entities, source records, and findings in this workspace?`;
    setResearchQuery(q);
    setResearchAnswer(null);
    setActiveTab('research');
  };

  // Reset workspace
  const handleResetWorkspace = () => {
    handleSelectWorkspace(activeBundle);
    showToast(`Workspace reset to initial state`);
  };

  // Quick navigation to Ask a Question
  const handleAskClick = (presetQuestion?: string) => {
    if (presetQuestion) {
      setResearchQuery(presetQuestion);
    }
    setResearchAnswer(null);
    setActiveTab('research');
  };

  // View document details
  const handleViewDoc = (doc: Document) => {
    setSelectedDoc(doc);
    setActiveTab('documents');
  };

  const handleViewDocById = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      setSelectedDoc(doc);
      setActiveTab('documents');
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        docsCount={documents.length}
        entitiesCount={entities.length}
        savedCount={savedInvestigations.length}
        activeWorkspaceName={userSettings.workspaceName}
        onOpenWorkspaceModal={() => setWorkspaceModalOpen(true)}
        userProfile={userProfile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Wrapper */}
      <div className={`main-content-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header
          activeTab={activeTab}
          onOpenUpload={() => setActiveTab('documents')}
          onAskQuestion={() => handleAskClick()}
          collectionName={userSettings.activeCollection}
          onOpenWorkspaceModal={() => setWorkspaceModalOpen(true)}
        />

        <main className="content-body">
          {activeTab === 'dashboard' && (
            <DashboardView
              documents={documents}
              nodes={graphNodes}
              edges={graphEdges}
              savedInvestigations={savedInvestigations}
              onUploadClick={() => setActiveTab('documents')}
              onAskClick={handleAskClick}
              onViewDoc={handleViewDoc}
              onViewGraph={() => setActiveTab('graph')}
              workspaceName={userSettings.workspaceName}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentLibraryView
              documents={documents}
              chunks={chunks}
              entities={entities}
              relationships={relationships}
              onUploadFile={handleUploadFile}
              selectedDoc={selectedDoc}
              setSelectedDoc={setSelectedDoc}
            />
          )}

          {activeTab === 'graph' && (
            <KnowledgeGraphView
              nodes={graphNodes}
              edges={graphEdges}
              documents={documents}
              chunks={chunks}
              onAskAboutEntity={handleAskAboutEntity}
              onViewDoc={handleViewDoc}
            />
          )}

          {activeTab === 'research' && (
            <AskResearchView
              graphRagService={graphRagService}
              onSaveInvestigation={handleSaveInvestigation}
              onOpenExplorerWithNodes={() => setActiveTab('graph')}
              onViewDoc={handleViewDocById}
              initialQuestion={researchQuery}
              initialAnswer={researchAnswer}
              sampleQuestionsList={activeBundle.sampleQuestions}
            />
          )}

          {activeTab === 'saved' && (
            <SavedInvestigationsView
              investigations={savedInvestigations}
              onOpenInvestigation={handleOpenInvestigation}
              onDeleteInvestigation={handleDeleteInvestigation}
              onDuplicateInvestigation={handleDuplicateInvestigation}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={userSettings}
              onUpdateSettings={(s) => {
                setUserSettings(s);
                showToast('Settings updated');
              }}
              onResetWorkspace={handleResetWorkspace}
              userProfile={userProfile}
              onOpenProfileModal={() => setIsProfileModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Workspace Switcher & Creator Modal */}
      <WorkspaceSwitcherModal
        isOpen={workspaceModalOpen}
        onClose={() => setWorkspaceModalOpen(false)}
        availableBundles={workspacesList}
        activeWorkspaceId={currentWorkspaceId}
        onSelectWorkspace={handleSelectWorkspace}
        onCreateWorkspace={handleCreateWorkspace}
      />

      {/* User Profile Customization Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentProfile={userProfile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast toast-info">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
