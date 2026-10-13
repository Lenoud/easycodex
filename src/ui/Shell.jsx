import React from "react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderOpen,
  GitBranch,
  Globe2,
  Maximize2,
  Mic,
  MoreHorizontal,
  PanelLeft,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  TerminalSquare,
  Workflow,
  X,
} from "lucide-react";

const navItems = [
  ["newThread", Plus, "新建对话", "开始新对话", ""],
  ["searchButton", Search, "搜索", "搜索对话", "muted"],
  ["pluginsButton", Box, "插件", "查看插件", "muted"],
  ["automationsButton", Workflow, "自动化", "查看自动化", "muted"],
];

const artifacts = ["README.md", "AGENTS.md"];
const reasoningLevels = ["低", "中", "高", "极高"];

function FaIcon({ icon, className }) {
  const [width, height, , , path] = icon.icon;
  return (
    <svg className={className} aria-hidden="true" focusable="false" data-prefix={icon.prefix} data-icon={icon.iconName} role="img" viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d={path} />
    </svg>
  );
}

function IconCommand({ id, icon, label, ariaLabel, tone }) {
  const Icon = icon;
  return (
    <button type="button" className={`nav-command ${tone}`.trim()} id={id} aria-label={ariaLabel}>
      <span className="command-icon" aria-hidden="true"><Icon size={17} strokeWidth={1.9} /></span>
      <span>{label}</span>
    </button>
  );
}

function Sidebar() {
  return (
    <>
      <button type="button" className="sidebar-scrim" id="sidebarScrim" aria-label="关闭对话列表" />
      <aside className="sidebar" id="threadSidebar" aria-label="对话">
        <div className="sidebar-windowbar" aria-label="Codex local bridge">
          <span className="window-dot red" aria-hidden="true" />
          <span className="window-dot yellow" aria-hidden="true" />
          <span className="window-dot green" aria-hidden="true" />
          <span className="window-spacer" aria-hidden="true" />
          <PanelLeft size={15} strokeWidth={1.8} aria-hidden="true" />
          <ChevronLeft size={15} strokeWidth={1.8} aria-hidden="true" />
          <ChevronRight size={15} strokeWidth={1.8} aria-hidden="true" />
        </div>

        <nav className="primary-nav" aria-label="主要操作">
          {navItems.map(([id, icon, label, ariaLabel, tone]) => (
            <IconCommand key={id} id={id} icon={icon} label={label} ariaLabel={ariaLabel} tone={tone} />
          ))}
        </nav>

        <div className="thread-section">
          <div className="section-title">最近对话</div>
          <input id="threadSearch" className="thread-search hidden" type="search" placeholder="搜索对话" aria-label="搜索对话" />
          <div id="threadList" className="thread-list" />
        </div>

        <button type="button" className="settings" id="settingsButton" aria-label="查看设置">
          <span className="command-icon" aria-hidden="true"><Settings size={17} strokeWidth={1.9} /></span>
          <span>设置</span>
        </button>
      </aside>
      <div className="sidebar-resize-handle left-resize-handle" id="leftResizeHandle" role="separator" aria-orientation="vertical" aria-label="调整左侧栏宽度" tabIndex="0" />
    </>
  );
}

function Header() {
  return (
    <header className="titlebar">
      <button type="button" className="mobile-toggle" id="mobileThreads" aria-controls="threadSidebar" aria-expanded="false">
        <PanelLeft size={17} strokeWidth={2} aria-hidden="true" />
        <span>对话</span>
      </button>
      <div className="title-stack">
        <h1 id="threadTitle">Codex Remote</h1>
        <p id="meta">正在准备连接</p>
      </div>
      <div className="title-actions">
        <button id="connect" type="button" className="icon-button" title="重新连接" aria-label="重新连接"><RefreshCw size={16} strokeWidth={1.9} /></button>
        <button type="button" className="icon-button" id="menuButton" title="打开或关闭右侧面板" aria-label="打开或关闭右侧面板" aria-controls="artifactPanel" aria-expanded="false"><MoreHorizontal size={18} strokeWidth={2} /></button>
      </div>
    </header>
  );
}

function ModelMenu() {
  return (
    <div id="modelMenu" className="model-menu hidden" role="menu" aria-label="模型和推理强度">
      <div className="model-menu-label">推理强度</div>
      {reasoningLevels.map((level) => (
        <button
          key={level}
          type="button"
          className="model-menu-row"
          data-reasoning={level}
          role="menuitemradio"
          aria-checked={level === "中" ? "true" : "false"}
        >
          {level}
          {level === "中" ? <span className="checkmark">✓</span> : null}
        </button>
      ))}
      <div className="model-menu-separator" />
      <div id="modelChoices" />
      <button type="button" className="model-menu-row submenu-row" id="moreModelsButton" role="menuitem">
        更多模型<span className="chevron">›</span>
      </button>
    </div>
  );
}

function Composer() {
  return (
    <form id="composer" className="composer">
      <input id="fileInput" className="hidden" type="file" accept="image/*" multiple />
      <div id="attachments" className="attachments" aria-live="polite" />
      <textarea id="prompt" rows="2" placeholder="输入后续修改要求" aria-label="发送给 Codex 的消息" />
      <div className="composer-footer">
        <div className="composer-left">
          <button type="button" className="ghost-button icon-only" id="addButton" aria-label="添加图片"><Plus size={18} strokeWidth={1.9} /></button>
          <button type="button" className="ghost-button icon-only expand-button" id="expandPromptButton" title="展开输入框" aria-label="展开输入框">
            <Maximize2 size={17} strokeWidth={1.9} aria-hidden="true" />
          </button>
          <button type="button" className="access-button" id="accessButton">
            <span className="access-label">完全访问</span>
            <FaIcon icon={faChevronDown} className="button-chevron-icon" />
          </button>
        </div>
        <div className="composer-right">
          <button type="button" id="modelButton" className="model-button">
            <span className="model-button-label">加载中</span>
            <FaIcon icon={faChevronDown} className="button-chevron-icon" />
          </button>
          <button type="button" className="voice-button" id="voiceButton" title="语音输入" aria-label="语音输入"><Mic size={18} strokeWidth={1.9} /></button>
          <button type="button" className="interrupt-button hidden" id="interruptRun" title="中断当前任务" aria-label="中断当前任务">
            <span className="interrupt-icon" aria-hidden="true"></span>
            <span className="interrupt-label">中断</span>
          </button>
          <button id="send" type="submit" className="send-button" title="发送" aria-label="发送"><Send size={18} strokeWidth={2.2} /></button>
        </div>
      </div>
      <ModelMenu />
    </form>
  );
}

function PromptModal() {
  return (
    <section className="prompt-modal hidden" id="promptModal" role="dialog" aria-modal="true" aria-labelledby="promptModalTitle">
      <div className="prompt-modal-card">
        <header className="prompt-modal-header">
          <h2 id="promptModalTitle">编辑输入内容</h2>
          <button type="button" className="prompt-modal-close" id="closePromptModalButton" aria-label="关闭"><X size={17} strokeWidth={2} /></button>
        </header>
        <textarea id="promptModalInput" className="prompt-modal-input" placeholder="输入后续修改要求" aria-label="展开的输入框" />
        <footer className="prompt-modal-footer">
          <button type="button" className="secondary" id="cancelPromptModalButton">取消</button>
          <button type="button" id="applyPromptModalButton">应用</button>
        </footer>
      </div>
    </section>
  );
}

function WorkspaceStrip() {
  return (
    <div id="workspaceIndicator" className="workspace-strip empty" aria-label="当前工作区">
      <div className="workspace-place">
        <span id="workspaceRepo" className="workspace-repo">仓库</span>
        <span id="workspaceLocation" className="workspace-location">.</span>
      </div>
      <div className="workspace-branch">
        <span className="branch-label">分支</span>
        <span id="branchName" className="branch-name">未知</span>
      </div>
    </div>
  );
}

function Conversation() {
  return (
    <section className="conversation" aria-label="对话">
      <div id="log" className="log" aria-live="polite" />
      <section id="approval" className="approval hidden">
        <div>
          <strong>授权请求</strong>
          <pre id="approvalText" />
        </div>
        <div className="actions">
          <button id="decline" type="button" className="secondary">拒绝</button>
          <button id="approve" type="button">允许</button>
        </div>
      </section>
      <div id="runState" className="run-state" data-state="connecting" role="status" aria-live="polite">
        <span className="run-state-dot" aria-hidden="true" />
        <span id="runStateLabel">正在准备连接</span>
      </div>
      <div className="composer-stack">
        <Composer />
        <WorkspaceStrip />
      </div>
      <PromptModal />
    </section>
  );
}

function PanelTab({ id, panel, icon, label }) {
  const Icon = icon;
  return (
    <button type="button" className="panel-tab" id={id} data-panel-tab={panel} aria-label={label} title={label} aria-pressed={panel === "artifacts" ? "true" : "false"}>
      <Icon size={14} strokeWidth={1.9} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </button>
  );
}

function ArtifactPanel() {
  return (
    <aside className="artifact-panel" id="artifactPanel" aria-label="右侧面板">
      <div className="sidebar-resize-handle right-resize-handle" id="rightResizeHandle" role="separator" aria-orientation="vertical" aria-label="调整右侧栏宽度" tabIndex="0" />
      <section className="panel-card primary-panel">
        <div className="panel-title">
          <span id="artifactTitle">产物</span>
          <button type="button" className="panel-close" id="closePanelButton" title="关闭" aria-label="关闭右侧面板"><X size={15} strokeWidth={2} /></button>
        </div>
        <div className="panel-tabs" role="toolbar" aria-label="切换右侧面板">
          <PanelTab id="artifactTab" panel="artifacts" icon={FileText} label="产物" />
          <PanelTab id="workspaceTab" panel="workspace" icon={FolderOpen} label="Files" />
          <PanelTab id="reviewTab" panel="review" icon={GitBranch} label="Diff" />
          <PanelTab id="statusButton" panel="status" icon={TerminalSquare} label="Run" />
          <PanelTab id="webSearchButton" panel="sources" icon={Globe2} label="Web" />
        </div>
        <div id="artifactList">
          {artifacts.map((name) => (
            <button key={name} type="button" className="artifact-row" data-artifact={name}>
              <FileText size={15} strokeWidth={1.9} /><span>{name}</span>
            </button>
          ))}
        </div>
        <div id="artifactPreview" className="artifact-preview hidden" />
      </section>
    </aside>
  );
}

export function CodexRemoteShell() {
  return (
    <main className="app-shell">
      <Sidebar />
      <section className="workspace">
        <Header />
        <div className="content-grid">
          <Conversation />
          <ArtifactPanel />
        </div>
      </section>
    </main>
  );
}
