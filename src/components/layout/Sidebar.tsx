import { UserProfile } from '../../types';
import {
  LayoutDashboard,
  FileText,
  Share2,
  Sparkles,
  BookmarkCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Pencil
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'documents' | 'graph' | 'research' | 'saved' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  docsCount: number;
  entitiesCount: number;
  savedCount: number;
  activeWorkspaceName: string;
  onOpenWorkspaceModal: () => void;
  userProfile: UserProfile;
  onOpenProfileModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  docsCount,
  entitiesCount,
  savedCount,
  activeWorkspaceName,
  onOpenWorkspaceModal,
  userProfile,
  onOpenProfileModal
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'documents' as ActiveTab,
      label: 'Document Library',
      icon: FileText,
      badge: `${docsCount}`
    },
    {
      id: 'graph' as ActiveTab,
      label: 'Knowledge Graph',
      icon: Share2,
      badge: `${entitiesCount}`
    },
    {
      id: 'research' as ActiveTab,
      label: 'Ask Research',
      icon: Sparkles,
      badge: 'AI',
      isAi: true
    },
    {
      id: 'saved' as ActiveTab,
      label: 'Saved Investigations',
      icon: BookmarkCheck,
      badge: `${savedCount}`
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        {!collapsed && (
          <div className="brand-wrapper">
            <div className="brand-logo-icon">
              <Share2 size={20} />
            </div>
            <div>
              <div className="brand-title">GraphRAG Navigator</div>
              <div className="brand-subtitle">Research Assistant</div>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="brand-logo-icon" style={{ margin: '0 auto' }}>
            <Share2 size={20} />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="sidebar-collapse-btn"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Workspace Selector */}
      {!collapsed && (
        <div className="sidebar-workspace">
          <div
            className="workspace-select-trigger"
            onClick={onOpenWorkspaceModal}
            title="Click to switch or create workspace"
            style={{ cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
              <span className="workspace-dot" />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeWorkspaceName}
              </span>
            </div>
            <ChevronDown size={14} style={{ opacity: 0.7, flexShrink: 0 }} />
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item-btn ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="nav-item-icon" />
              {!collapsed && (
                <>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`nav-item-badge ${item.isAi ? 'ai-badge' : ''}`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer / User Profile */}
      <div
        className="sidebar-footer"
        onClick={onOpenProfileModal}
        style={{ cursor: 'pointer', transition: 'background var(--transition-fast)' }}
        title="Click to edit your name, credentials, or avatar"
      >
        <div className="user-profile-widget">
          <div
            className="user-avatar"
            style={{
              background: userProfile.avatarColor || 'linear-gradient(135deg, var(--muted-green) 0%, var(--primary-blue) 100%)',
              color: '#FFFFFF'
            }}
          >
            {userProfile.initials || 'U'}
          </div>
          {!collapsed && (
            <div className="user-info">
              <div className="user-name" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{userProfile.name}</span>
                <Pencil size={11} style={{ opacity: 0.6, marginLeft: '6px' }} />
              </div>
              <div className="user-role">{userProfile.role}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
