/**
 * Antigravity 一键汉化与多语言管理程序
 * (C) 2026 Antigravity Chinese Localization Tool (全界面深度汉化版)
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

// 1. 查找 VS Code 扩展目录
function findExtensionDir() {
  const home = os.homedir();
  const extsDir = path.join(home, '.vscode', 'extensions');
  if (!fs.existsSync(extsDir)) {
    throw new Error('未检测到 VS Code 扩展安装目录: ' + extsDir);
  }
  const entries = fs.readdirSync(extsDir);
  const match = entries.find(name => name.startsWith('google.google-antigravity-') && !name.endsWith('.bak'));
  if (!match) {
    throw new Error('未在 ' + extsDir + ' 找到 Antigravity 扩展 (google.google-antigravity-*)');
  }
  return path.join(extsDir, match);
}

// 2. package.json 纯中文简洁汉化字典 (严禁括号夹杂英文)
const COMMAND_TRANSLATIONS = {
  'antigravity.showThirdPartyNotices': '第三方声明',
  'antigravity.openChangelog': '更新日志',
  'antigravity.resetConversationState': '重置当前对话',
  'antigravity.insertSnippet': '添加代码到对话',
  'antigravity.addFileToChat': '添加当前文件到对话',
  'antigravity.insertTerminalSnippet': '添加终端选区到对话',
  'antigravity.insertTerminalOutput': '添加终端输出到对话',
  'antigravity.startNewConversation': '新建对话',
  'antigravity.toggleChatFocus': '切换对话焦点',
  'antigravity.panel.focus': '打开对话窗口',
  'antigravity.acceptAllChanges': '接受全部修改',
  'antigravity.rejectAllChanges': '拒绝全部修改',
  'antigravity.inlineDiff.acceptAll': '接受当前修改',
  'antigravity.inlineDiff.rejectAll': '拒绝当前修改',
  'antigravity.inlineDiff.acceptFocusedHunk': '接受当前修改块',
  'antigravity.inlineDiff.rejectFocusedHunk': '拒绝当前修改块',
  'antigravity.sideBySide.acceptAll': '接受全部修改 (双栏)',
  'antigravity.sideBySide.rejectAll': '拒绝全部修改 (双栏)',
  'antigravity.toggleInlineDiff': '行内差异对比',
  'antigravity.openSettings': '设置',
  'antigravity.signIn': '登录',
  'antigravity.signOut': '退出登录',
  'antigravity.statusMenu': '操作菜单',
  'antigravity.openTelemetrySettings': '数据与隐私',
  'antigravity.feedback': '意见反馈',
  'antigravity.createComment': '添加批注',
  'antigravity.editComment': '编辑批注',
  'antigravity.deleteComment': '删除批注',
  'antigravity.saveComment': '保存批注',
  'antigravity.cancelComment': '取消批注',
  'antigravity.commentForSelection': '添加代码批注',
  'antigravity.dynamic.conversationView.findInConversation': '在对话中查找',
  'antigravity.inlineDiff.undo': '撤销修改',
  'antigravity.inlineDiff.redo': '重做修改',
  'antigravity.dynamic.interruptAgent': '停止生成',
  'antigravity.searchConversations': '搜索历史对话',
  'antigravity.dynamic.toggleModelSelector': '切换模型',
  'antigravity.dynamic.conversation.selectPrevious': '上一条对话',
  'antigravity.dynamic.conversation.selectNext': '下一条对话'
};

const CONFIG_TRANSLATIONS = {
  'antigravity.keybindingScheme': {
    description: '快捷键方案。',
    enumDescriptions: [
      '兼容 VS Code 常用快捷键（避免冲突）。',
      '使用 Antigravity 专用快捷键方案。'
    ]
  },
  'antigravity.serverPort': {
    description: '后台服务端口，设为 0 为自动分配动态端口（推荐）。'
  },
  'antigravity.serverStartupTimeoutMs': {
    description: '后台服务启动超时时间（毫秒）。'
  },
  'antigravity.heartbeatIntervalMs': {
    description: '后台服务健康探测间隔（毫秒）。设为 0 关闭心跳。'
  },
  'antigravity.enableTelemetry': {
    description: '是否允许发送匿名使用数据。'
  },
  'antigravity.enableInlineDiff': {
    description: '启用代码行内差异对比。关闭时使用左右双栏对比。'
  },
  'antigravity.autoAcceptOnChat': {
    description: '开始新对话时，自动接受后台未确认的代码修改。'
  },
  'antigravity.autoOpenFiles': {
    description: '智能体修改文件时自动在编辑器打开对应文件。'
  },
  'antigravity.enableComments': {
    description: '允许在编辑器中为智能体添加代码评审批注。'
  },
  'antigravity.caCertificates': {
    description: '自定义 CA 证书文件路径。'
  },
  'antigravity.releaseBaseUrl': {
    description: '组件下载地址。'
  },
  'antigravity.serverArgs': {
    description: '后台服务启动附加参数。'
  },
  'antigravity.channel': {
    description: '插件更新通道。'
  }
};

// 3. 生成深度汉化的 Webview 运行时脚本
function getRuntimeScriptContent() {
  return `/**
 * Antigravity UI Runtime Localization & Language Switcher (Deep Localization)
 * (C) 2026 Antigravity Chinese Localization
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'antigravity_language';
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'zh-CN';

  // 深度精确翻译字典 (纯中文，无括号残留英文)
  const exactMap = {
    "A few things to know, and a couple settings to review.": "首次使用的几点须知与基础设置建议。",
    "A group with this name already exists.": "已存在同名分组。",
    "A label for this computer when you connect from another device. Changing it reconnects.": "从其他设备连接时用于标识此电脑的标签。修改后将重新连接。",
    "A nickname for identifying this application in the companion website. Changing this will restart the connection.": "在配套网页中识别此应用的别名。修改后将重新建立连接。",
    "A project with this name already exists.": "已存在同名项目。",
    "A shell setup script run before every command the agent executes.": "智能体每次执行终端命令前运行的 Shell 初始化脚本。",
    "ABFS Workspace (Alpha)": "ABFS 工作区 (测试版)",
    "Accent": "强调色",
    "Accept": "接受",
    "Accept All": "接受全部",
    "Accept Step": "接受此步",
    "Access grants": "访问授权",
    "Access restricted": "访问受限",
    "Access rules": "访问规则",
    "Accessibility": "无障碍",
    "Account": "账户",
    "Account connection was not completed.": "账号连接未完成。",
    "Accounts": "账号",
    "Accounts tab": "账号标签页",
    "Action required": "需要操作",
    "Actions": "操作",
    "Actual behavior": "实际表现",
    "Add Hook Card": "添加钩子卡片",
    "Add inline comment": "添加行内批注",
    "Add MCP Server": "添加 MCP 服务",
    "Add MCP Servers": "添加 MCP 服务",
    "Add screenshot to conversation": "添加截图到对话",
    "Add Shortcut": "添加快捷键",
    "Add to Chat": "添加到对话",
    "Add to Chat/Quote": "添加并引用到对话",
    "Added": "已添加",
    "Added (Staged)": "已暂存",
    "Admin escalation": "管理员提权",
    "Advanced Settings": "高级设置",
    "After": "之后",
    "Agent": "智能体",
    "Agent can": "智能体可以",
    "Agent can run": "智能体可运行",
    "Agent Edits": "智能体修改",
    "Agent Hooks Configuration": "智能体钩子配置",
    "Agent terminated due to error": "智能体因异常退出",
    "Agents": "智能体列表",
    "All active Antigravity shortcuts and user keybinding overrides are managed directly by VS Code.": "所有已启用的 Antigravity 快捷键及自定义覆盖均由 VS Code 直接管理。",
    "Allow": "允许",
    "Allow creating issues and grant access to specific issues.": "允许创建 Issue 并授予特定 Issue 的访问权限。",
    "Allow full browser script execution without prompting.": "允许直接运行浏览器脚本，无需提示。",
    "Allow Next Non-Corp Prompt": "允许下次非企业提示词",
    "Allow opening pull requests and grant access to specific PRs.": "允许发起 Pull Request 并授予特定 PR 的访问权限。",
    "Allow reading workflow runs (list, view, watch) across the whole repository.": "允许查看仓库所有工作流运行状态（列出、查看与监视）。",
    "Allow/deny agent browser actuation access to specific URLs.": "允许或拒绝智能体在特定网址上执行浏览器操作。",
    "Allow/deny agent browser file downloads from specific sites.": "允许或拒绝智能体从特定网站下载文件。",
    "Allow/deny agent command execution outside the sandbox.": "允许或拒绝智能体在沙箱外执行终端命令。",
    "Allow/deny agent read access to specific files or directories.": "允许或拒绝智能体读取指定文件或目录。",
    "Allow/deny agent read access to specific URLs or domains.": "允许或拒绝智能体读取特定网址或域名。",
    "Allow/deny agent write access to specific files or directories.": "允许或拒绝智能体写入指定文件或目录。",
    "Allow/deny specific terminal commands.": "允许或拒绝执行特定的终端命令。",
    "Alt text:": "替代文本:",
    "Always allow": "始终允许",
    "Always Allow": "始终允许",
    "Always Proceed": "始终直接运行",
    "Amend": "追加提交",
    "Amend succeeded": "追加提交成功",
    "Announcements and tips": "公告与提示",
    "Antigravity (AGY) Style": "Antigravity 独立方案",
    "Antigravity Interactive HTML": "Antigravity 交互式 HTML",
    "Any error messages": "报错信息",
    "Any error messages seen when trying to log in": "尝试登录时看到的报错信息",
    "Any relevant information": "其他补充信息",
    "Any time": "任何时间",
    "App": "应用设置",
    "App update required": "需要更新应用",
    "App version": "应用版本",
    "Appearance": "外观",
    "Application": "应用设置",
    "Approve": "允许",
    "Apps connected to your account": "已连接到您账号的应用",
    "Archive": "归档",
    "Archive project": "归档项目",
    "Archive This Conversation": "归档此会话",
    "Archive Workspace": "归档工作区",
    "Archived Only": "仅显示已归档",
    "Are you sure you want to delete this conversation? This action cannot be undone.": "确定要删除此对话吗？此操作无法撤销。",
    "Are you sure you want to delete this side question? This action cannot be undone.": "确定要删除此分支提问吗？此操作无法撤销。",
    "Artifact Comments": "工件批注",
    "Artifact updated by agent": "工件已由智能体更新",
    "Artifacts": "工件",
    "Ask a quick question without interrupting the main conversation.": "在不打断主对话的情况下快速发起提问。",
    "Ask about your code or any topic, get clear answers.": "就代码或任意话题提问，获取清晰解答。",
    "Ask before sensitive operations.": "执行敏感操作前进行确认。",
    "Ask questions, report issues, and discuss features": "提出问题、报告问题或讨论功能需求",
    "Attach Antigravity server logs": "附带 Antigravity 后台日志",
    "Attackers might be able to see the images you're looking at on this site and trick you by modifying them.": "攻击者可能会窥探您在此网站上查看的图片，并可能通过篡改图片实施欺诈。",
    "Auth and Billing": "登录与计费",
    "Authenticate": "进行身份验证",
    "Authentication expired": "身份验证已过期",
    "Authentication Required": "需要身份验证",
    "Author": "作者",
    "Authorization code": "授权码",
    "Auto": "自动模式",
    "Auto (detected)": "自动 (检测)",
    "Auto Pin": "自动置顶",
    "Auto-detect (browser defaults)": "自动检测 (浏览器默认)",
    "Automatic Check for Updates": "自动检查更新",
    "Automatically decide if commands run.": "自动判断终端命令是否可以直接运行。",
    "Automatically prompt you to restart the app when a new update is available. When disabled, you can check for updates manually from the app menu.": "当有新版本可用时自动提示重启应用。关闭后可在应用菜单中手动检查更新。",
    "Automatically reproduce bugs, trace causes, test fixes.": "自动复现问题、排查原因并验证修复代码。",
    "Automations": "自动化任务",
    "Back": "返回",
    "Back to safety": "返回安全页面",
    "Background": "后台",
    "Background Tasks": "后台任务",
    "Background tasks and terminals agents left running, across all conversations.": "跨所有会话中智能体在后台保留运行的任务与终端。",
    "Backoff": "重试等待",
    "Bad Response": "响应异常",
    "Baseline model quota reached": "已达基础模型用量上限",
    "Before": "之前",
    "Best of N": "多重采样 (Best of N)",
    "Best of N mode is not available": "多重采样模式当前不可用",
    "Best-of-N Ended": "多重采样完成",
    "Best-of-N Started": "多重采样已开始",
    "Block": "阻止",
    "Block all browser JavaScript execution.": "禁止所有浏览器脚本执行。",
    "Blocked": "已阻止",
    "Blocked, needs input": "已暂停，等待输入",
    "Boolean AND, OR, and negation": "逻辑运算符 与、或、非",
    "Bot": "机器人",
    "Bottom Panel": "底部面板",
    "Branch": "分支",
    "Branch Changes": "分支修改",
    "Browse": "浏览",
    "Browse and enable plugins from the Build With Google catalog.": "浏览并启用 Google 官方插件目录中的扩展。",
    "Browser": "浏览器",
    "Browser actions": "浏览器操作",
    "Browser Actuation Permissions": "浏览器操作权限",
    "Browser Actuation Rules": "网页操作规则",
    "Browser downloads": "浏览器下载",
    "Browser Javascript Execution Policy": "浏览器脚本执行策略",
    "Browser Subagent": "浏览器智能体",
    "Browser Use": "浏览器操作",
    "Browsing Data": "浏览数据",
    "Browsing History": "浏览历史",
    "Bug Report": "问题报告",
    "Build new features": "构建新功能",
    "Build with Google": "使用 Google 工具构建",
    "Build With Google Plugins": "Google 官方插件",
    "Build with one agent or a team": "由单智能体或团队协同构建",
    "Built In": "内置",
    "Built to help, not hurt": "安全与设计承诺",
    "Built-in Browser": "内置浏览器",
    "Bundles": "扩展包",
    "Business Account Sign In": "企业账号登录",
    "By default, agents work in folders you choose and ask before sensitive changes. Adjust this anytime in Settings.": "默认情况下，智能体仅在您选定的目录中工作，且在做出敏感更改前会请求确认。您可以随时在设置中调整。",
    "Cancel": "取消",
    "Cancel download": "取消下载",
    "Cancel Generation": "停止生成",
    "Capture Console Logs": "捕获控制台日志",
    "Capture Screenshot": "截取屏幕",
    "Carries out the plan: searches, edits, builds, and tests. Pick a faster, cheaper model.": "负责执行计划：搜索、编辑、构建与测试。建议选择响应更快、成本更低的模型。",
    "Certificate details": "证书详情",
    "Change model": "更换模型",
    "Change schedule": "修改排期",
    "Changes": "变更列表",
    "Chat": "对话",
    "Chat Layout": "对话布局",
    "Check for Updates": "检查更新",
    "Chief of Staff canvas": "核心画布",
    "Chief of Staff voice mode is active": "语音模式运行中",
    "Choose a Subscription": "选择订阅方案",
    "Choose between non-colliding VS Code defaults or standalone Antigravity chords.": "选择与 VS Code 无冲突的默认方案，或使用 Antigravity 独立快捷键方案。",
    "Choose how much detail is shown during a conversation.": "选择对话期间展示细节的详略程度。",
    "Choose interface theme": "选择界面主题",
    "Choose Region": "选择区域",
    "Choose what to clear from the built-in browser. It can't be undone.": "选择要从内置浏览器中清除的内容。此操作无法撤销。",
    "Choose where links open by default when clicked.": "选择点击网页链接时的默认打开目标。",
    "Choose where terminal sessions appear.": "选择终端会话展示的位置。",
    "Choose which key sends a message in the chat composer.": "选择在对话框中发送消息的按键。",
    "Chosen": "已选择",
    "Claude and GPT models": "Claude 与 GPT 系列模型",
    "Clear": "清空",
    "Clear Browsing Data?": "清除浏览数据？",
    "Clear history, cookies and site data from the built-in browser, or manage cookies for each site.": "清除内置浏览器的历史记录、Cookie 与网站数据，或管理各网站 Cookie。",
    "Clear Search": "清空搜索",
    "Cleared Count": "已清空计数",
    "Click to copy URL": "点击复制网址",
    "Click to view more": "点击查看更多",
    "Click to view or edit comment": "点击查看或编辑批注",
    "Clone current workspace into a new independent workspace": "将当前工作区克隆为新的独立工作区",
    "Close": "关闭",
    "Close (Esc)": "关闭 (Esc)",
    "Close Other Tabs": "关闭其他标签页",
    "Close split view and go to forked conversation": "关闭分屏视图并转到分支对话",
    "Close Tab": "关闭标签页",
    "Close Tabs to the Left": "关闭左侧标签页",
    "Close Tabs to the Right": "关闭右侧标签页",
    "Code": "代码",
    "Code Change Summary": "代码修改摘要",
    "Code Search": "代码搜索",
    "Collapse all": "全部折叠",
    "Collapse All Folders": "折叠所有文件夹",
    "Command": "命令",
    "Command Palette": "命令面板",
    "Command prompt": "命令提示符",
    "Command setup script": "命令前置脚本",
    "Command:": "命令:",
    "Commands": "命令列表",
    "Commands and files these agents can use.": "这些智能体可以使用的终端命令与文件。",
    "Commands outside sandbox": "沙箱外执行命令",
    "Commands Outside Sandbox": "沙箱外执行命令",
    "commands.": "命令的快捷键组合。",
    "Comment": "批注",
    "Comment on Selection": "为选中内容添加批注",
    "Comment on the plan before your agent starts, and get a walkthrough when it finishes.": "在智能体启动前对计划发表评审批注，并在完成后获得演示说明。",
    "Compact": "紧凑",
    "Compact View": "紧凑视图",
    "Configure": "配置",
    "Configure agent execution, queued message delivery, and permissions.": "配置智能体执行方式、排队消息发送与全局权限。",
    "Configure allowed and denied paths for file reads and writes.": "配置文件读写的允许与拒绝路径。",
    "Configure allowed and denied URLs for reading.": "配置允许与拒绝读取的网址 URL 规则。",
    "Configure allowed and denied URLs for the browser subagent (invoked with /browser). Requires": "配置浏览器智能体（使用 /browser 触发）允许和拒绝访问的网址。需要安装",
    "Configure allowed and denied URLs for the browser subagent (invoked with /browser). Requires Google Chrome.": "配置浏览器智能体（使用 /browser 触发）允许和拒绝访问的网址。需要安装 Google Chrome。",
    "Configure built-in browser, link opening, and browser subagent preferences.": "配置内置浏览器、链接打开方式及浏览器智能体偏好。",
    "Configure external tools via Model Context Protocol.": "通过 Model Context Protocol 配置外部工具。",
    "Configure global allowed and denied resource permissions.": "配置全局允许与拒绝的资源权限。",
    "Configure global allowed and denied resource permissions. Learn more.": "配置全局允许与拒绝的资源权限。了解更多。",
    "Configure the agent's visual theme and display preferences.": "配置智能体的视觉主题与显示偏好。",
    "Configure the default width of markdown artifacts.": "配置 Markdown 工件窗口的默认宽度。",
    "Configure the maximum width of the conversation panel.": "配置对话面板的最大显示宽度。",
    "Configure when follow-up messages are sent.": "设置后续消息的发送时机。",
    "Configure workspace-specific permissions, resources, and customizations.": "配置当前工作区专属的权限、资源与扩展项。",
    "Confirm": "确认",
    "Confirm Delete": "确认删除",
    "Connect Account": "连接账号",
    "Connected": "已连接",
    "Connected Accounts": "已关联账号",
    "Connection Error": "连接错误",
    "Connection Failed": "连接失败",
    "Connection Lost": "连接已断开",
    "Console": "控制台",
    "Constrain voice dictation to selected languages in priority order. Leave empty to auto-detect.": "按优先级限制语音听写语言。留空则自动检测。",
    "Content": "内容",
    "Context and Quota Indicator": "上下文与配额指示器",
    "Context size": "上下文大小",
    "Context Window": "上下文窗口",
    "Continue": "继续",
    "Continue conversation": "继续对话",
    "Continue in new conversation": "在新对话中继续",
    "Controls permissions for remote conversations.": "控制远程对话的访问权限。",
    "Controls the actions the agent can take.": "控制智能体可执行的操作。",
    "Controls the actions the agent can take. Default and Auto need the terminal sandbox, which isn't available on this host.": "控制智能体可执行的操作。默认与自动模式需要终端沙箱支持，当前系统不支持。",
    "Controls whether terminal commands require your approval before running.": "控制终端命令在运行前是否需要人工确认。",
    "Controls whether the agent can run custom JavaScript to automate complex browser actions.": "控制智能体是否可以运行自定义 JS 自动化复杂浏览器操作。",
    "Conversation limit reached": "已达对话次数上限",
    "Conversation Steps": "对话步骤展示",
    "Conversation Width": "对话窗口宽度",
    "Conversations": "历史对话",
    "Conversations and tasks": "对话与任务",
    "Copied!": "已复制！",
    "Copy": "复制",
    "Copy Code": "复制代码",
    "Copy Link": "复制链接",
    "Copy Link to Task": "复制任务链接",
    "Copy message": "复制消息",
    "Copy Output": "复制输出",
    "Copy Path": "复制路径",
    "Create": "创建",
    "Create Account": "创建账号",
    "Create Agent": "创建智能体",
    "Create File": "新建文件",
    "Create Folder": "新建文件夹",
    "Create New": "新建",
    "Create Project": "创建项目",
    "Created": "已创建",
    "Ctrl+Enter": "Ctrl+回车",
    "Current Plan": "当前方案",
    "Current Workspace": "当前工作区",
    "Custom": "自定义",
    "Custom Agents": "自定义智能体",
    "Custom Context Menus": "自定义右键菜单",
    "Custom Instructions": "自定义指令",
    "Customizations": "扩展与技能",
    "Customize Global Skills": "全局技能管理",
    "Customize Shortcuts": "自定义快捷键",
    "Daily conversation limit reached": "已达今日对话次数上限",
    "Dark": "暗色模式",
    "Dark Theme": "深色主题",
    "Data Sharing": "数据共享",
    "Debug": "调试",
    "Debug Console": "调试控制台",
    "Debug Logs": "调试日志",
    "Default and Auto need the terminal sandbox, which isn't available on this host.": "默认与自动模式需要终端沙箱支持，当前系统不支持。",
    "Default Branch": "默认分支",
    "Default Customizations": "默认扩展",
    "Default Model": "默认模型",
    "Delete": "删除",
    "Delete All": "删除全部",
    "Delete Conversation": "删除对话",
    "Delete File": "删除文件",
    "Delete Folder": "删除文件夹",
    "Delete project": "删除项目",
    "Delete Step": "删除此步",
    "Deny": "拒绝",
    "Describe what you want. Your agent plans and builds it, and brings in other agents when needed.": "描述您的目标。智能体将规划并实现它，并在需要时引入其他专业智能体协同。",
    "Description": "详细描述",
    "Details": "详情",
    "Developer": "开发者设置",
    "Diagnostics": "诊断",
    "Dictation languages": "听写语言",
    "Did restarting the desktop app help?": "重启桌面应用是否有效？",
    "Diff": "差异对比",
    "Directory": "目录",
    "Disable": "禁用",
    "Disable All": "全部禁用",
    "Disabled": "禁用",
    "Discard": "放弃修改",
    "Discard Changes": "放弃修改",
    "Disconnected": "已断开连接",
    "Dismiss": "忽略",
    "Docs": "文档",
    "Documentation": "官方文档",
    "Done": "完成",
    "Download": "下载",
    "Downloading Update": "正在下载更新",
    "Draft": "草稿",
    "Draft documents, emails, and notes that sound like you.": "起草符合您语气风格的文档、邮件和笔记。",
    "Duplicate": "创建副本",
    "Edit": "编辑",
    "Edit Agent": "编辑智能体",
    "Edit file": "修改文件",
    "Edit Instructions": "编辑指令",
    "Edit Mode": "编辑模式",
    "Edit Permissions": "编辑权限",
    "Edit Shortcut": "编辑快捷键",
    "Empty": "空",
    "Enable": "启用",
    "Enable AI Credit Overages": "启用额度超额扣费",
    "Enable All": "全部启用",
    "Enable All MCP Servers": "启用所有 MCP 服务",
    "Enable Browser Agent": "启用浏览器智能体",
    "Enable Notifications": "启用系统通知",
    "Enable Notifications for Agent": "启用智能体系统通知",
    "Enable Sounds for Agent": "启用智能体提示音",
    "Enable terminal sandbox": "启用终端沙箱",
    "Enabled": "已启用",
    "Enter": "回车",
    "Enter project name...": "输入项目名称...",
    "Environment Variables": "环境变量",
    "Error": "错误",
    "Error details": "错误详情",
    "Error Loading Models": "模型加载失败",
    "Every command requires approval.": "所有命令都需要人工确认。",
    "Execution History": "执行历史",
    "Execution Policy": "执行策略",
    "Execution Time": "执行耗时",
    "Executor Model": "执行模型",
    "Exit": "退出",
    "Expand all": "全部展开",
    "Expand All Folders": "展开所有文件夹",
    "Expected behavior": "预期效果",
    "Export": "导出",
    "Export Conversation": "导出对话",
    "External Browser": "外部默认浏览器",
    "External tools the agent can call via Model Context Protocol.": "智能体可通过 Model Context Protocol (MCP) 调用的外部工具。",
    "Failed": "失败",
    "Failed to clone project locally": "本地克隆项目失败",
    "Failed to create remote project": "创建远程项目失败",
    "Failed to load": "加载失败",
    "Failed to unarchive local project": "解档本地项目失败",
    "Fast": "快速模式",
    "Favorites": "收藏夹",
    "Feature Request": "功能建议",
    "Feedback": "意见反馈",
    "Feedback submitted successfully": "反馈提交成功",
    "Feedback Type": "反馈类型",
    "File": "文件",
    "File Permissions": "文件权限",
    "File Tree": "文件树",
    "Files": "文件列表",
    "Files Changed": "修改的文件",
    "Files, folders, and repositories you connect are accessible to your agent in this project, including during background or scheduled runs.": "您在此项目中连接的文件、文件夹与仓库对智能体均可访问，包括后台运行与定时任务期间。",
    "Fill": "填满",
    "Filter": "筛选",
    "Find": "查找",
    "Find Next": "查找下一个",
    "Find Previous": "查找上一个",
    "Five Hour Limit Remaining": "5小时剩余额度",
    "Focus Input": "聚焦输入框",
    "Folder": "文件夹",
    "For any feedback that does not fit into the above categories.": "适用于不属于上述分类的任何其他反馈与建议。",
    "Fork Conversation": "分支新对话",
    "Format Document": "格式化文档",
    "Fullscreen": "全屏",
    "Gemini Models": "Gemini 系列模型",
    "General": "常规",
    "General Feedback": "其他建议",
    "General Settings": "常规设置",
    "GitHub Permissions": "GitHub 权限",
    "Give Feedback": "意见反馈",
    "Global": "全局",
    "Global Permissions": "全局权限",
    "Global settings": "全局设置",
    "Help": "帮助",
    "Hide": "隐藏",
    "Hide Details": "隐藏详情",
    "Hide thoughts": "收起思考",
    "High": "高",
    "History": "历史记录",
    "Home": "主页",
    "How this feature would help you and other users": "此功能如何为您和其他用户带来帮助",
    "Import": "导入",
    "Import AI Studio Project": "导入 AI Studio 项目",
    "In Progress": "进行中",
    "Include default customizations, such as default skills.": "启用默认内置的技能与智能体能力。",
    "Include Jetski Default Customizations": "启用系统内置扩展",
    "Information": "信息",
    "Inline Diff": "行内差异",
    "Input": "输入",
    "Input Box": "输入框",
    "Insert at Cursor": "在光标处插入",
    "Insights": "洞察",
    "Inspect": "检查",
    "Inspect Element": "检查元素",
    "Inspect live bindings or record custom key chords filtered to": "查看当前生效的键位绑定，或录制过滤到",
    "Inspect live bindings or record custom key chords filtered to antigravity. commands.": "查看当前生效的键位绑定，或录制过滤到 antigravity. 命令的快捷键组合。",
    "Install": "安装",
    "Install Update": "安装更新",
    "Installed": "已安装",
    "Instructions": "使用说明",
    "Insufficient AI Credits": "AI 额度不足",
    "Interface Layout": "界面布局",
    "Interrupt the agent and send immediately.": "打断智能体并立即发送。",
    "Issues": "问题列表",
    "Jetski Chat": "聊天设置",
    "Keep the app accessible from the menu bar and running in the background when all windows are closed.": "所有窗口关闭后，仍在菜单栏常驻并在后台保持运行。",
    "Keep waiting": "继续等待",
    "Keybinding Scheme": "快捷键方案",
    "Keyboard shortcuts": "快捷键说明",
    "Keyboard shortcuts for quick navigation and control.": "快捷键导航与控制设置。",
    "Language": "语言",
    "Last 30 Days": "过去 30 天",
    "Last 7 Days": "过去 7 天",
    "Last Updated": "最后更新",
    "Latest updates": "最新更新",
    "Layout": "布局",
    "Learn more": "了解更多",
    "Learn more.": "了解更多。",
    "Let the agent open URLs, read web pages, and interact with browser content.": "允许智能体打开网页、阅读页面内容并进行交互。",
    "Light": "亮色模式",
    "Light Theme": "浅色主题",
    "Line numbers": "行号",
    "Loading...": "加载中...",
    "Local Permissions": "本地权限",
    "Logs": "日志",
    "Low": "低",
    "Manage Accounts": "账号管理",
    "Manage Customizations": "管理扩展",
    "Manage Data Sharing & Telemetry": "数据与隐私",
    "Manage fine-grained permissions for GitHub.": "管理 GitHub 的细粒度权限配置。",
    "Manage permissions": "管理权限",
    "Manage your conversations from the companion website.": "通过配套网页远程管理您的会话。",
    "Manage your keybinding scheme and customize shortcuts in VS Code.": "在 VS Code 中管理快捷键方案与自定义快捷键。",
    "Manage your model quota and credits.": "管理您的模型配额与 AI 额度。",
    "Manage your notification preferences.": "管理系统通知与提示音偏好。",
    "Markdown Artifact Width": "工件窗口宽度",
    "Marketplace": "扩展市场",
    "MCP Servers": "MCP 服务配置",
    "Mcp Tools": "MCP 工具",
    "Medium": "中",
    "Memory": "内存占用",
    "Menu": "菜单",
    "Messages": "消息列表",
    "Min": "最小",
    "Minimize": "最小化",
    "Mode": "模式",
    "Model Credits": "AI 额度",
    "Model details": "模型详情",
    "Model Quota": "模型配额",
    "Model quota reached": "已达模型用量上限",
    "Models": "模型与用量",
    "Models & Usage": "模型与用量",
    "Modify permissions for file, terminal, and MCP tools.": "配置文件、终端与 MCP 工具的独立权限。",
    "More actions": "更多操作",
    "Move Conversation Down": "下移对话",
    "Move Conversation Up": "上移对话",
    "Mute Voice Mic": "静音麦克风",
    "Mute Voice Speaker": "静音扬声器",
    "Name": "名称",
    "Narrow": "较窄",
    "Navigate": "导航",
    "need the terminal sandbox, which isn't available on this host.": "需要终端沙箱支持，当前系统不支持。",
    "Needs Input": "等待输入",
    "needs the terminal sandbox, which isn't available on this host.": "需要终端沙箱支持，当前系统不支持。",
    "Network access rules": "网络访问规则",
    "Network Permissions": "网络权限",
    "New": "新",
    "New Chat": "新建对话",
    "New conversation": "新建会话",
    "New Conversation": "新建会话",
    "New models have been enabled for you!": "已为您启用新模型！",
    "New Project": "新建项目",
    "New Tab": "新标签页",
    "New Workspace": "新建工作区",
    "Next": "下一步",
    "No conversations yet": "暂无历史对话",
    "No model specified for Battle Mode, falling back to use current selected model": "未指定对战模式模型，已回退为使用当前选中的模型",
    "No Models Available": "无可用模型",
    "No results found": "未找到相关结果",
    "None": "无",
    "Normal": "正常",
    "Not connected": "未连接",
    "Not in Project": "未归属项目",
    "Notification Preferences": "通知偏好设置",
    "Notifications": "通知",
    "Offline": "离线",
    "Online": "在线",
    "Open": "配置",
    "Open File": "打开文件",
    "Open Folder": "打开文件夹",
    "Open Folder...": "打开文件夹...",
    "Open in Built-in Browser": "在内置浏览器中打开",
    "Open in external browser": "在外部浏览器中打开",
    "Open in External Browser": "在外部浏览器中打开",
    "Open Keyboard Shortcuts": "打开快捷键设置",
    "Open Links In": "默认打开方式",
    "Open project settings": "打开项目设置",
    "Open Settings (JSON)": "打开设置 (JSON)",
    "Optimize the interface and terminal output for screen readers.": "为读屏无障碍软件优化界面与终端输出。",
    "Optional": "可选",
    "Options": "选项",
    "Orchestrator Model": "编排模型",
    "Orchestrator Settings": "编排器设置",
    "Output": "输出",
    "Overview": "概览",
    "Panel": "面板",
    "Parameters": "参数",
    "Paste": "粘贴",
    "Path": "路径",
    "Pause": "暂停",
    "Pending": "等待中",
    "Performance": "性能",
    "Permission preset": "权限预设",
    "Permissions": "权限",
    "Pick up this remote conversation on your phone or in any browser. Scan the QR code or open the link below.": "在手机或任意浏览器中继续此远程会话。扫描二维码或打开下方链接。",
    "Pin Conversation": "置顶对话",
    "Pin This Conversation": "置顶此对话",
    "Pinned": "已置顶",
    "Plan": "计划模式",
    "Plan upgrade required": "需要升级方案",
    "Play a sound when your action is needed or the agent finishes.": "当需要操作或智能体完成任务时播放提示音。",
    "Please describe the feature you'd like to see. The more detailed the requirements, the easier it will be for our team to incorporate your ideas. Some helpful information includes:": "请描述您期望的功能。需求越明确，我们的团队越容易采纳您的建议。建议包含：",
    "Please describe the issue in detail. The more actionable your feedback, the quicker our team can address your request. Some helpful information includes:": "请详细描述问题。信息越具体，我们排查解决越迅速。建议包含：",
    "Please describe your auth or billing issue. More details will help our support team resolve your issue quicker. Some helpful information includes:": "请描述您的登录认证或计费问题。更多细节有助于技术支持团队快速处理。建议包含：",
    "Please list the steps to reproduce the issue": "请列出复现此问题的具体步骤",
    "Please Wait...": "请稍候...",
    "Preferences": "首选项",
    "Press Cmd+Enter to send, Enter for a new line.": "按 Cmd+Enter 发送，Enter 换行。",
    "Press Ctrl+Enter to send, Enter for a new line.": "按 Ctrl+Enter 发送，Enter 换行。",
    "Press Enter to send, Shift+Enter for a new line.": "按 Enter 发送，Shift+Enter 换行。",
    "Prevent the computer from sleeping while the app is running.": "应用运行时阻止计算机进入休眠状态。",
    "Preview": "预览",
    "Previous": "上一步",
    "Privacy": "隐私",
    "Proceed": "继续",
    "Proceed in Sandbox": "沙箱内直接运行",
    "Proceed with Plan": "执行计划",
    "Progress": "进度",
    "Project Overview": "项目概览",
    "Project Settings": "项目设置",
    "Projects": "项目",
    "Prompt for approval before running browser scripts.": "运行浏览器脚本前提示审批。",
    "Properties": "属性",
    "Provide Feedback": "意见反馈",
    "Purchase Credits": "购买额度",
    "Queue": "排队",
    "Queue until after the current turn.": "在当前轮次结束后再发送。",
    "Queued messages": "排队消息",
    "Quota": "模型配额",
    "Quota Remaining": "剩余配额",
    "Rate Limit": "速率限制",
    "Recent": "最近",
    "Recent Files": "最近打开的文件",
    "Recent Projects": "最近项目",
    "Recheck": "重新检查",
    "Recommended": "推荐",
    "Redo": "重做",
    "Refresh": "刷新",
    "Refresh quota and credits data": "刷新配额与额度数据",
    "Refresh Token": "刷新令牌",
    "Regenerate": "重新生成",
    "Reject": "拒绝",
    "Reject All": "拒绝全部",
    "Reject Step": "拒绝此步",
    "Reload": "重新加载",
    "Remote Control Issue": "远程控制问题",
    "Remove": "移除",
    "Remove All": "全部移除",
    "Remove individual uploaded files or connected resources in Project Settings, or delete a project or conversation to remove its stored files.": "在项目设置中可单独移除已上传的文件或连接的资源，或通过删除项目/对话以清除其存储的文件。",
    "Remove Shortcut": "移除快捷键",
    "Rename": "重命名",
    "Rename Conversation": "重命名对话",
    "Rename Project": "重命名项目",
    "Replace": "替换",
    "Replace All": "全部替换",
    "Replace the default browser right-click menu with quick actions.": "将默认右键菜单替换为快捷操作菜单。",
    "Report Bug": "提交 Bug",
    "Request": "请求",
    "Request Review": "每次请求确认",
    "Required": "必填",
    "Reset": "重置",
    "Reset to auto": "恢复自动",
    "Reset to default": "恢复默认",
    "Restart": "重启",
    "Restart to Update": "重启以完成更新",
    "Restore": "还原",
    "Resume": "继续",
    "Retry": "重试",
    "Retry Connection": "重试连接",
    "Review changes": "查看修改",
    "Review plans and walkthroughs": "审查计划与执行演示",
    "Role": "角色",
    "Rules": "规则",
    "Rules and customization token budgets exceeded. Large rules are demoted to path pointers and large customizations are excluded from context.": "规则与扩展的 Token 预算已超限。大型规则已降级为路径指针，大型扩展已从上下文中排除。",
    "Rules and skills": "规则与技能",
    "Rules token budget exceeded. Large rules are demoted to path pointers.": "规则 Token 预算已超限。大型规则已降级为路径指针。",
    "Run all commands without restrictions.": "无限制直接运行所有命令。",
    "Run command": "运行命令",
    "Run in terminal": "在终端运行",
    "Run terminal commands with sandbox restrictions.": "在沙箱限制环境下运行终端命令。",
    "Running": "运行中任务",
    "Running Processes": "运行中的进程",
    "Sandbox": "沙箱",
    "Save": "保存",
    "Save All": "保存全部",
    "Save Changes": "保存修改",
    "Scope": "范围",
    "Screen Reader Mode": "屏幕阅读器模式",
    "Search conversations": "搜索对话",
    "Search Conversations": "搜索对话",
    "Search conversations...": "搜索历史对话...",
    "Search files...": "搜索文件...",
    "Search for conversations...": "搜索历史对话...",
    "Search projects...": "搜索项目...",
    "Search settings": "搜索设置",
    "Search Settings": "搜索设置",
    "Search settings...": "搜索设置...",
    "Search...": "搜索...",
    "See Plans": "查看方案",
    "Select All": "全选",
    "Select another model": "选择其他模型",
    "Select Model": "选择模型",
    "Select Model to Send Message": "选择发送消息的模型",
    "Select the workspace type that will be used for new conversations started with the New Workspace option.": "选择通过“新建工作区”选项启动新会话时默认使用的工作区类型。",
    "Send": "发送",
    "Send Feedback": "发送反馈",
    "Send Immediately": "立即发送",
    "Send message": "发送消息",
    "Session": "会话",
    "Set the volume of agent sounds.": "设置智能体提示音的音量大小。",
    "Settings": "设置",
    "Settings for conversations outside of projects.": "项目外独立对话的设置与用量。",
    "Shortcuts": "快捷键",
    "Show All": "显示全部",
    "Show Automation Conversations": "显示自动化对话",
    "Show Details": "显示详情",
    "Show how full the context window is next to the send button. Click it for a breakdown and to see your model quota.": "在发送按钮旁显示上下文占用率，点击可查看明细与模型配额。",
    "Show Less": "收起",
    "Show More": "展开更多",
    "Show Plugin Conversations": "显示插件对话",
    "Show system notifications when your action is needed or the agent finishes.": "当需要操作或智能体完成任务时弹出系统通知。",
    "Show thoughts": "展开思考",
    "Side by Side Diff": "双栏差异对比",
    "Side Panel": "侧边栏面板",
    "Sidebar": "侧边栏",
    "Sign in to finish setting up this plugin.": "请登录以完成该插件的配置。",
    "Skills": "技能",
    "Sort Conversations": "对话排序",
    "Sound": "提示音",
    "Source": "源码",
    "Split Editor": "拆分编辑器",
    "Standard": "标准模式",
    "Start": "开始",
    "Start Voice Recording": "开始语音录制",
    "Status": "状态",
    "Steps to Reproduce": "复现步骤",
    "Steps to reproduce the issue": "复现步骤",
    "Stop": "停止",
    "Stop Voice Recording": "停止语音录制",
    "Submit Feedback": "提交反馈",
    "Submitting...": "正在提交...",
    "Success": "成功",
    "Sync": "同步",
    "System": "跟随系统",
    "System Theme": "跟随系统主题",
    "Tasks": "任务列表",
    "Telemetry is disabled in Settings": "已在设置中关闭遥测与使用数据共享",
    "Terminal command auto execution": "终端命令自动执行",
    "Terminal Placement": "终端窗口位置",
    "The breakdown below shows token usage from customizations like rules, skills, and MCP. If a budget is exceeded, large rules are demoted to path pointers and large customizations are excluded automatically.": "下方明细显示了自定义规则、技能与 MCP 工具的 Token 占用情况。超出预算时，大型规则将自动降级为路径指针，大型扩展将自动被排除。",
    "The main conversation's input isn't available right now.": "主对话输入框当前不可用。",
    "Theme": "界面主题",
    "Themes": "主题模式",
    "Thinking...": "思考中...",
    "Thought process": "思考过程",
    "Thoughts": "思考过程",
    "Toggle Between Light/Dark Themes": "切换深色/浅色主题",
    "Toggle Model Selector": "切换模型选择器",
    "Toggle Project Selector": "切换项目选择器",
    "Toggle Sidebar": "展开/折叠侧边栏",
    "Toggle Voice Recording": "切换语音录制",
    "Tokens": "Token",
    "Tool permissions": "工具权限",
    "Tool Permissions": "工具权限",
    "Total Tokens": "Token 总量",
    "Turbo": "极速模式",
    "Turn on strict / LaTeX faithfulness mode, which throws an error if the input uses features that are not supported by LaTeX.": "开启严格 LaTeX 准确模式，当输入包含 LaTeX 不支持的特性时报错提示。",
    "Type": "类型",
    "Undo": "撤销",
    "Uninstall": "卸载",
    "Unknown": "未知",
    "Unlimited": "无限制",
    "Unpin Conversation": "取消置顶",
    "Unsaved Changes": "未保存的修改",
    "Update Available": "有可用更新",
    "Upgrade": "升级",
    "Upgrade Plan": "升级方案",
    "Upload": "上传",
    "Upload Debug Bundle": "上传日志",
    "Usage": "用量",
    "Use this form if you cannot connect to Remote Control. If your instance is already connected and you are experiencing issues in the browser, report directly from the Remote Control web page so that relevant logs are included. Some helpful information includes:": "如果您无法连接到远程控制，请使用此表单。如果您的实例已连接且在浏览器中遇到问题，请直接在远程控制网页中反馈，以便附带相关日志。建议包含：",
    "User": "用户",
    "Variables": "变量",
    "Verbose": "详细",
    "Version": "版本",
    "View All": "查看全部",
    "View Details": "查看详情",
    "View logs": "查看日志",
    "Voice engine": "语音引擎",
    "Voice mode": "语音模式",
    "Volume": "音量",
    "VS Code Default": "VS Code 默认方案",
    "VS Code Keyboard Shortcuts": "VS Code 键盘快捷键",
    "Warning": "警告",
    "Weekly Limit Remaining": "本周剩余额度",
    "What functionality you expect your account tier to have available that is missing": "您的账号等级应具备哪些缺失的功能",
    "What is missing in your workflow": "当前工作流中缺少什么",
    "What quota or feature is being incorrectly limited": "哪项配额或功能被错误限制",
    "What you would like to see to address this gap in your workflow": "您希望通过什么方式填补该空缺",
    "When toggled on, Antigravity will use your AI credits to fulfill model requests once you're out of model quota. Antigravity will always use your model quota first before using AI credits.": "开启后，当模型免费配额用尽时，将自动使用 AI 额度继续响应。系统始终优先使用免费配额。",
    "Whether it never connects or is intermittent/flaky": "是始终无法连接还是断断续续不稳定",
    "Which workspace the New Conversation button and keyboard shortcut start you in.": "点击新建会话按钮或按快捷键时默认进入的工作区。",
    "Wide": "较宽",
    "Window": "窗口",
    "Workspace": "工作区",
    "Workspaces": "工作区",
    "Workspaces tab": "工作区标签页",
    "Write file": "创建文件",
    "You can upgrade to a Google AI Ultra plan to receive higher rate limits.": "您可以升级至 Google AI Ultra 方案以获得更高的用量限额。",
        // 对话区与状态
    "Thinking": "思考过程",
    "Thinking effort": "思考深度",
    "Thought Process": "思考过程",
    "Working": "处理中",
    "Explored": "已探索",
    "Sources": "参考来源",
    "Done": "完成",
    "This conversation is in a different workspace.": "当前对话位于其他工作区。",
    "This project is associated with a different workspace.": "此项目关联至其他工作区。",
    "Switch IDE Workspace": "切换 IDE 工作区",
    "Snooze for 24 Hours": "稍后提醒 (24小时)",
    "Dismiss": "忽略",
    "Listening. Ask anything.": "正在聆听，请提问...",
    "Enter to send": "按回车发送",
    "Send messages with the keyboard's Enter key instead of starting a new line.": "使用键盘的 Enter 键发送消息，而非换行。",
    "Add Context": "添加上下文",
    "Add context": "添加上下文",
    "Mentions": "引用 (@)",
    "Screen Recording": "屏幕录制",
    "Connectors": "连接器",
    "Select Environment": "选择环境",
    "Stop generating": "停止生成",
    "Couldn't load this view": "无法加载此视图",
    "An unexpected error occurred while loading this view. Please reload or report an issue.": "加载此视图时发生未知错误。请重新加载或反馈问题。",
    "Try again": "重试",
    "Report issue": "反馈问题",
    "Ask anything, @ to mention, / for actions": "输入任何问题，使用 @ 引用，输入 / 触发操作...",
    "Message subagent, @ to mention, / for actions": "向子智能体发送消息，使用 @ 引用，输入 / 触发操作...",
    "Your Plan: Google AI Pro": "当前方案：Google AI Pro"
  };

  const placeholderMap = {
    "Ask anything, @ to mention, / for actions": "输入任何问题，使用 @ 引用，输入 / 触发操作...",
    "Ask anything, @ to mention, / for workflows...": "输入任何问题，使用 @ 引用，输入 / 触发工作流...",
    "Ask anything, @ to mention": "输入任何问题，使用 @ 引用...",
    "Message subagent, @ to mention, / for actions": "向子智能体发送消息，使用 @ 引用，输入 / 触发操作...",
    "Message subagent, @ to mention": "向子智能体发送消息，使用 @ 引用...",
    "Ask anything, @ to mention...": "输入任何问题，使用 @ 引用文件或角色...",
    "Search...": "搜索...",
    "Search settings...": "搜索设置...",
    "Search conversations...": "搜索历史对话...",
    "Type a message...": "输入消息...",
    "Search languages to add (e.g. English,": "搜索要添加的语言 (如 中文、English)...",
    "Describe the bug you encountered...": "请详细描述您遇到的问题...",
    "Describe the feature you would like to see...": "请详细描述您期望的功能...",
    "Describe your auth or billing issue...": "请描述您的登录认证或计费问题...",
    "Describe your Remote Control issue...": "请描述您的远程控制问题...",
    "Enter your feedback...": "请输入您的反馈内容...",
    "Please list the steps to reproduce the issue": "请列出复现此问题的具体步骤..."
  };

  function translateText(text) {
    if (!text || typeof text !== 'string') return text;
    const trimmed = text.trim();
    if (!trimmed) return text;

    // 1. 精确匹配
    if (exactMap[trimmed]) {
      return text.replace(trimmed, exactMap[trimmed]);
    }

    // 2. 动态参数正则匹配
    // 展开/收起明细：Show 25 breakdowns / Hide 25 breakdowns
    if (/^Show\\s+(\\d+)\\s+breakdowns?$/i.test(trimmed)) {
      return text.replace(trimmed, trimmed.replace(/^Show\\s+(\\d+)\\s+breakdowns?$/i, '展开 $1 项明细'));
    }
    if (/^Hide\\s+(\\d+)\\s+breakdowns?$/i.test(trimmed)) {
      return text.replace(trimmed, trimmed.replace(/^Hide\\s+(\\d+)\\s+breakdowns?$/i, '收起 $1 项明细'));
    }

    // 方案名称：Your Plan: Google AI Pro
    if (/^Your Plan:\\s*(.+)$/i.test(trimmed)) {
      const plan = trimmed.replace(/^Your Plan:\\s*/i, '');
      return text.replace(trimmed, \`当前方案：\${plan}\`);
    }

    // 配额倒计时刷新文本
    if (/^You have used some of your weekly limit,\\s*it will fully refresh in\\s*(.+)$/i.test(trimmed)) {
      const m = trimmed.match(/^You have used some of your weekly limit,\\s*it will fully refresh in\\s*(.+)$/i);
      let timeStr = m[1].replace(/days?/g, '天').replace(/hours?/g, '小时').replace(/minutes?|mins?/g, '分钟');
      return text.replace(trimmed, \`您已消耗部分本周额度，将在 \${timeStr} 后完全重置。\`);
    }
    if (/^You have used some of your 5-hour limit,\\s*it will fully refresh in\\s*(.+)$/i.test(trimmed)) {
      const m = trimmed.match(/^You have used some of your 5-hour limit,\\s*it will fully refresh in\\s*(.+)$/i);
      let timeStr = m[1].replace(/days?/g, '天').replace(/hours?/g, '小时').replace(/minutes?|mins?/g, '分钟');
      return text.replace(trimmed, \`您已消耗部分5小时额度，将在 \${timeStr} 后完全重置。\`);
    }
    if (/^Resets in\\s*(.+)$/i.test(trimmed)) {
      const m = trimmed.match(/^Resets in\\s*(.+)$/i);
      let timeStr = m[1].replace(/d/g, '天').replace(/h/g, '小时').replace(/m/g, '分钟');
      return text.replace(trimmed, \`将在 \${timeStr} 后重置\`);
    }

    // Token 计数括号：(3,089 tokens) -> (3,089 Token)
    if (/^\\(([\\d,]+)\\s+tokens\\)$/i.test(trimmed)) {
      return text.replace(trimmed, trimmed.replace(/^\\(([\\d,]+)\\s+tokens\\)$/i, '($1 Token)'));
    }

    // 思考过程 (动态耗时 / 阶段)
    if (/^Thinking\\s+for\\s+(\\d+.*)$/i.test(trimmed)) {
      const rest = trimmed.replace(/^Thinking\\s+for\\s+/i, '');
      return text.replace(trimmed, '思考中 (' + rest + ')');
    }
    if (/^Thought\\s+for\\s+(\\d+.*)$/i.test(trimmed)) {
      const rest = trimmed.replace(/^Thought\\s+for\\s+/i, '');
      return text.replace(trimmed, '已思考 ' + rest);
    }
    if (/^Still\\s+thinking,\\s*(\\d+.*)$/i.test(trimmed)) {
      const rest = trimmed.replace(/^Still\\s+thinking,\\s*/i, '');
      return text.replace(trimmed, '正在思考，已用时 ' + rest);
    }
    if (/^Thinking(\\s+.*)?$/i.test(trimmed)) {
      const rest = trimmed.replace(/^Thinking\\s*/i, '');
      return text.replace(trimmed, rest ? '思考过程 ' + rest : '思考过程');
    }
    if (/^Explored\\s+(.+)$/i.test(trimmed)) {
      const rest = trimmed.replace(/^Explored\\s+/i, '');
      return text.replace(trimmed, '已探索 ' + rest);
    }
    if (/^Ran\\s+(\\d+)\\s+commands?$/i.test(trimmed)) {
      const m = trimmed.match(/^Ran\\s+(\\d+)\\s+commands?$/i);
      return text.replace(trimmed, '执行了 ' + m[1] + ' 条命令');
    }
    if (/^ran\\s+(\\d+)\\s+commands?$/i.test(trimmed)) {
      const m = trimmed.match(/^ran\\s+(\\d+)\\s+commands?$/i);
      return text.replace(trimmed, '执行了 ' + m[1] + ' 条命令');
    }
    if (/^Edited\\s+(.+)$/i.test(trimmed)) {
      const rest = trimmed.replace(/^Edited\\s+/i, '');
      return text.replace(trimmed, '已编辑 ' + rest);
    }
    if (/^edited\\s+(.+)$/i.test(trimmed)) {
      const rest = trimmed.replace(/^edited\\s+/i, '');
      return text.replace(trimmed, '已编辑 ' + rest);
    }

    // 3. 动态前缀匹配 (长说明文)
    if (trimmed.startsWith("Honors standard VS Code shortcuts without collisions")) {
      return text.replace(trimmed, "遵循标准 VS Code 快捷键，无冲突（如 Ctrl+L 聚焦输入，Ctrl+Shift+L 新建会话，Ctrl+Shift+A 历史选择，Ctrl+Shift+, 设置）。");
    }
    if (trimmed.startsWith("Uses standalone Antigravity chords")) {
      return text.replace(trimmed, "使用独立快捷键方案（如 Ctrl+I 聚焦输入，Ctrl+Shift+O 新建会话，Ctrl+K 选择会话，Ctrl+, 打开设置，Ctrl+[/] 历史导航）。会覆盖部分默认快捷键。");
    }
    if (trimmed.startsWith("Inherits your Global Permissions when working")) {
      return text.replace(trimmed, "工作时自动继承全局权限设置。");
    }
    if (trimmed.startsWith("A change to this setting will only apply to new messages")) {
      return text.replace(trimmed, "注意：此设置仅对之后发送的新消息生效。正在进行的任务继续沿用先前的设置值。");
    }

    return text;
  }

  const IGNORE_TAGS = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE']);

  function walkAndTranslate(node) {
    if (currentLang !== 'zh-CN') return;
    if (!node) return;

    if (node.nodeType === Node.TEXT_NODE) {
      if (node.parentElement && IGNORE_TAGS.has(node.parentElement.tagName)) return;
      if (node.parentElement && node.parentElement.isContentEditable) return;

      const orig = node.nodeValue;
      const trans = translateText(orig);
      if (trans !== orig) {
        node.nodeValue = trans;
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (IGNORE_TAGS.has(node.tagName)) return;

      if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
        const ph = node.getAttribute('placeholder');
        if (ph) {
          if (ph.startsWith("Ask anything")) {
            node.setAttribute('placeholder', "输入任何问题，使用 @ 引用，输入 / 触发操作...");
          } else if (ph.startsWith("Message subagent")) {
            node.setAttribute('placeholder', "向子智能体发送消息，使用 @ 引用，输入 / 触发操作...");
          } else {
            for (const [k, v] of Object.entries(placeholderMap)) {
              if (ph === k || ph.startsWith(k)) {
                node.setAttribute('placeholder', v);
                break;
              }
            }
          }
        }
      }

      const title = node.getAttribute('title');
      if (title && exactMap[title.trim()]) {
        node.setAttribute('title', exactMap[title.trim()]);
      }
      const aria = node.getAttribute('aria-label');
      if (aria && exactMap[aria.trim()]) {
        node.setAttribute('aria-label', exactMap[aria.trim()]);
      }

      for (let child = node.firstChild; child; child = child.nextSibling) {
        walkAndTranslate(child);
      }
    }
  }

  // 注入设置顶部的语言切换器卡片
  function injectLanguageSetting() {
    if (document.getElementById('agy-language-card')) return;

    const settingsContainers = document.querySelectorAll('.space-y-6, [data-testid=\"settings-screen\"], .agy-card');
    if (!settingsContainers || settingsContainers.length === 0) return;

    const targetContainer = settingsContainers[0];

    const card = document.createElement('div');
    card.id = 'agy-language-card';
    card.style.cssText = \`
      margin-bottom: 18px;
      padding: 14px 18px;
      border: 1px solid var(--vscode-widget-border, rgba(255,255,255,0.12));
      border-radius: 10px;
      background: var(--vscode-sideBar-background, rgba(255,255,255,0.03));
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.2s ease;
    \`;

    const left = document.createElement('div');
    left.innerHTML = \`
      <div style=\"font-size: 14px; font-weight: 600; color: var(--vscode-foreground, #fff); display: flex; align-items: center; gap: 6px;\">
        <span>🌐 界面语言 (Language)</span>
      </div>
      <div style=\"font-size: 12px; opacity: 0.75; margin-top: 4px; color: var(--vscode-descriptionForeground, #999);\">
        \${currentLang === 'zh-CN' ? '选择界面的显示语言' : 'Choose interface display language'}
      </div>
    \`;

    const right = document.createElement('div');
    const select = document.createElement('select');
    select.id = 'agy-language-dropdown';
    select.style.cssText = \`
      padding: 6px 14px;
      border-radius: 6px;
      background: var(--vscode-dropdown-background, #252526);
      color: var(--vscode-dropdown-foreground, #ffffff);
      border: 1px solid var(--vscode-dropdown-border, #3c3c3c);
      cursor: pointer;
      outline: none;
      font-size: 13px;
    \`;

    select.innerHTML = \`
      <option value=\"zh-CN\" \${currentLang === 'zh-CN' ? 'selected' : ''}>简体中文</option>
      <option value=\"en-US\" \${currentLang === 'en-US' ? 'selected' : ''}>English</option>
    \`;

    select.addEventListener('change', (e) => {
      const newLang = e.target.value;
      localStorage.setItem(STORAGE_KEY, newLang);
      location.reload();
    });

    right.appendChild(select);
    card.appendChild(left);
    card.appendChild(right);

    if (targetContainer.parentElement) {
      targetContainer.parentElement.insertBefore(card, targetContainer);
    } else {
      targetContainer.insertBefore(card, targetContainer.firstChild);
    }
  }

  function init() {
    walkAndTranslate(document.body);
    injectLanguageSetting();

    // 修复 MutationObserver 掉包问题：将所有变动的节点放入待处理队列，避免 rAF 期间丢弃后续批次
    let pendingNodes = new Set();
    let scheduled = false;

    function scheduleTranslation() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        if (pendingNodes.size > 0) {
          const nodes = Array.from(pendingNodes);
          pendingNodes.clear();
          for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            if (n && n.isConnected) {
              walkAndTranslate(n);
            }
          }
        }
        injectLanguageSetting();
      });
    }

    const observer = new MutationObserver((mutations) => {
      for (let i = 0; i < mutations.length; i++) {
        const m = mutations[i];
        if (m.type === 'childList') {
          for (let j = 0; j < m.addedNodes.length; j++) {
            pendingNodes.add(m.addedNodes[j]);
          }
        } else if (m.type === 'characterData') {
          pendingNodes.add(m.target);
        }
      }
      scheduleTranslation();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // 监听全局点击事件（切换左侧选项卡时 React 会动态挂载右侧视图，50ms/250ms 触发即时全量扫描）
    document.addEventListener('click', () => {
      setTimeout(() => walkAndTranslate(document.body), 50);
      setTimeout(() => walkAndTranslate(document.body), 250);
    }, true);

    // 兜底定时巡检（对已翻译的文本零开销直接跳过，耗时 < 1ms，确保异步 API 返回后 100% 汉化）
    setInterval(() => {
      if (currentLang === 'zh-CN') {
        walkAndTranslate(document.body);
      }
    }, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('[Antigravity i18n] Runtime active, lang:', currentLang);
})();
`;
}

// 4. 执行汉化安装
function install(extDir) {
  console.log('\n[1/4] 正在备份原始文件...');
  const pkgPath = path.join(extDir, 'package.json');
  const extJsPath = path.join(extDir, 'extension.js');
  const runtimePath = path.join(extDir, 'agy-i18n-runtime.js');

  const pkgBak = path.join(extDir, 'package.json.original.bak');
  const extJsBak = path.join(extDir, 'extension.js.original.bak');

  if (!fs.existsSync(pkgBak)) {
    fs.copyFileSync(pkgPath, pkgBak);
    console.log('   - 已备份 package.json -> package.json.original.bak');
  } else {
    console.log('   - 官方备份已存在，跳过');
  }
  if (!fs.existsSync(extJsBak)) {
    fs.copyFileSync(extJsPath, extJsBak);
    console.log('   - 已备份 extension.js -> extension.js.original.bak');
  } else {
    console.log('   - 官方备份已存在，跳过');
  }

  console.log('[2/4] 写入 Webview 全界面深度本地化运行时脚本...');
  fs.writeFileSync(runtimePath, getRuntimeScriptContent(), 'utf8');
  console.log('   - 深度本地化运行时脚本已写入 agy-i18n-runtime.js');

  console.log('[3/4] 汉化 package.json 命令与配置项 (纯中文精简版)...');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  if (pkg.contributes && pkg.contributes.commands) {
    pkg.contributes.commands.forEach(cmd => {
      if (COMMAND_TRANSLATIONS[cmd.command]) {
        cmd.title = COMMAND_TRANSLATIONS[cmd.command];
      }
    });
  }

  if (pkg.contributes && pkg.contributes.submenus) {
    pkg.contributes.submenus.forEach(sub => {
      if (sub.id === 'antigravity.panelMoreSubmenu') {
        sub.label = '更多操作';
      }
    });
  }

  if (pkg.contributes && pkg.contributes.configuration && pkg.contributes.configuration.properties) {
    const props = pkg.contributes.configuration.properties;
    for (const [key, trans] of Object.entries(CONFIG_TRANSLATIONS)) {
      if (props[key]) {
        if (trans.description) props[key].description = trans.description;
        if (trans.enumDescriptions) props[key].enumDescriptions = trans.enumDescriptions;
      }
    }

    props['antigravity.language'] = {
      type: 'string',
      default: 'zh-CN',
      enum: ['zh-CN', 'en-US'],
      enumDescriptions: [
        '简体中文',
        'English'
      ],
      description: '界面语言设置'
    };
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
  console.log('   - package.json 汉化完成');

  console.log('[4/4] 注入 Webview 代理拦截中间件 (安全拦截支持)...');
  let code = fs.readFileSync(extJsPath, 'utf8');

  // 如果已有旧版代理，恢复备份后再注入
  if (code.includes('__agy_start_i18n_proxy')) {
    if (fs.existsSync(extJsBak)) {
      code = fs.readFileSync(extJsBak, 'utf8');
    }
  }

  const target = 'async function fV(a,b){var c=f.asyncContextStart(),d=c();c=c(1);try{return{effectiveUrl:c(await d(l.env.asExternalUri(l.Uri.parse(a)))).toString().replace(/\\/$/,""),humanReadable:b}}finally{d()}}';
  
  const proxyInject = `
var __agy_proxy_cache = null;
function __agy_start_i18n_proxy(targetUrl) {
  if (__agy_proxy_cache && __agy_proxy_cache.targetUrl === targetUrl) {
    return Promise.resolve(__agy_proxy_cache.proxyUrl);
  }
  return new Promise((resolve) => {
    try {
      const http = require('http');
      const net = require('net');
      const fs = require('fs');
      const path = require('path');
      const targetParsed = new URL(targetUrl);
      const targetPort = parseInt(targetParsed.port, 10);
      const targetHost = targetParsed.hostname;
      const runtimePath = path.join(__dirname, 'agy-i18n-runtime.js');

      const server = http.createServer((req, res) => {
        if (req.url === '/agy-i18n-runtime.js') {
          try {
            const content = fs.readFileSync(runtimePath, 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
            res.end(content);
          } catch (e) {
            res.writeHead(404);
            res.end('Not found');
          }
          return;
        }

        const options = {
          hostname: targetHost,
          port: targetPort,
          path: req.url,
          method: req.method,
          headers: { ...req.headers, host: targetHost + ':' + targetPort }
        };

        if (options.headers.origin) {
          options.headers.origin = 'http://' + targetHost + ':' + targetPort;
        }
        delete options.headers['accept-encoding'];

        const proxyReq = http.request(options, proxyRes => {
          const contentType = proxyRes.headers['content-type'] || '';
          if (contentType.includes('text/html')) {
            const headers = { ...proxyRes.headers };
            delete headers['content-length'];
            delete headers['content-security-policy'];
            delete headers['content-encoding'];

            let body = '';
            proxyRes.on('data', chunk => body += chunk);
            proxyRes.on('end', () => {
              const injected = body.replace('</head>', '<script src="/agy-i18n-runtime.js"></script></head>');
              res.writeHead(proxyRes.statusCode, headers);
              res.end(injected);
            });
          } else {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
          }
        });

        proxyReq.on('error', err => {
          res.writeHead(502);
          res.end('Proxy Error: ' + err.message);
        });

        req.pipe(proxyReq);
      });

      server.on('upgrade', (req, socket, head) => {
        const targetSocket = net.connect(targetPort, targetHost, () => {
          targetSocket.write(req.method + ' ' + req.url + ' HTTP/' + req.httpVersion + '\\r\\n');
          for (let i = 0; i < req.rawHeaders.length; i += 2) {
            let key = req.rawHeaders[i];
            let val = req.rawHeaders[i + 1];
            if (key.toLowerCase() === 'host') val = targetHost + ':' + targetPort;
            if (key.toLowerCase() === 'origin') val = 'http://' + targetHost + ':' + targetPort;
            targetSocket.write(key + ': ' + val + '\\r\\n');
          }
          targetSocket.write('\\r\\n');
          if (head && head.length > 0) targetSocket.write(head);
          socket.pipe(targetSocket);
          targetSocket.pipe(socket);
        });
        targetSocket.on('error', () => socket.destroy());
        socket.on('error', () => targetSocket.destroy());
      });

      server.listen(0, '127.0.0.1', () => {
        const proxyPort = server.address().port;
        const proxyUrl = 'http://127.0.0.1:' + proxyPort;
        __agy_proxy_cache = { targetUrl, proxyUrl, server };
        resolve(proxyUrl);
      });
    } catch(err) {
      console.warn('[Antigravity i18n] Failed to start proxy, falling back to original url:', err);
      resolve(targetUrl);
    }
  });
}
async function fV(a,b){var c=f.asyncContextStart(),d=c();c=c(1);try{a=c(await d(__agy_start_i18n_proxy(a)));return{effectiveUrl:c(await d(l.env.asExternalUri(l.Uri.parse(a)))).toString().replace(/\\/$/,""),humanReadable:b}}finally{d()}}
`;

  if (code.includes(target)) {
    code = code.replace(target, proxyInject);
    fs.writeFileSync(extJsPath, code, 'utf8');
    console.log('   - extension.js 代理已注入成功');
  } else {
    console.warn('   - 未能在 extension.js 找到注入锚点，跳过');
  }

  console.log('\n======================================================');
  console.log('  【成功】Antigravity 全界面深度汉化已安装！');
  console.log('  【关键步骤】请在 VS Code 中彻底重载窗口以清空内存缓存：');
  console.log('        按快捷键 Ctrl+Shift+P，输入并回车：');
  console.log('        Developer: Reload Window (开发人员: 重新加载窗口)');
  console.log('======================================================\n');
}

// 5. 执行还原官方英文原版
function restore(extDir) {
  console.log('\n正在还原官方英文原版...');
  const pkgPath = path.join(extDir, 'package.json');
  const extJsPath = path.join(extDir, 'extension.js');
  const runtimePath = path.join(extDir, 'agy-i18n-runtime.js');

  const pkgBak = path.join(extDir, 'package.json.original.bak');
  const extJsBak = path.join(extDir, 'extension.js.original.bak');

  let restored = false;

  if (fs.existsSync(pkgBak)) {
    fs.copyFileSync(pkgBak, pkgPath);
    console.log('   - 已恢复 package.json');
    restored = true;
  }
  if (fs.existsSync(extJsBak)) {
    fs.copyFileSync(extJsBak, extJsPath);
    console.log('   - 已恢复 extension.js');
    restored = true;
  }
  if (fs.existsSync(runtimePath)) {
    fs.unlinkSync(runtimePath);
    console.log('   - 已移除 agy-i18n-runtime.js');
  }

  if (restored) {
    console.log('\n======================================================');
    console.log('  【成功】已完全还原为官方英文原版！');
    console.log('  【关键提示】由于 VS Code 会在内存中缓存菜单定义：');
    console.log('        必须按 Ctrl+Shift+P 执行 "Developer: Reload Window"');
    console.log('        或重启 VS Code，右上角三个点才会彻底恢复为英文！');
    console.log('======================================================\n');
  } else {
    console.log('未检测到备份文件，当前已经是官方原版。\n');
  }
}

// 6. 切换语言
function setLanguage(extDir, lang) {
  const runtimePath = path.join(extDir, 'agy-i18n-runtime.js');
  if (!fs.existsSync(runtimePath)) {
    console.log('\n请先执行 [1] 安装深度汉化补丁后，再切换语言！\n');
    return;
  }
  let content = fs.readFileSync(runtimePath, 'utf8');
  content = content.replace(/localStorage\.getItem\(STORAGE_KEY\) \|\| '[^']+'/, `localStorage.getItem(STORAGE_KEY) || '${lang}'`);
  fs.writeFileSync(runtimePath, content, 'utf8');
  console.log(`\n已成功切换默认界面语言为: ${lang === 'zh-CN' ? '简体中文' : 'English'}`);
  console.log('请在 VS Code 中执行 Ctrl+Shift+P -> "Developer: Reload Window" 生效！\n');
}

// 7. 查看状态
function checkStatus(extDir) {
  const pkgBak = path.join(extDir, 'package.json.original.bak');
  const extJsBak = path.join(extDir, 'extension.js.original.bak');
  const runtimePath = path.join(extDir, 'agy-i18n-runtime.js');

  console.log('\n--- Antigravity 插件状态检测 ---');
  console.log('扩展安装目录:', extDir);
  console.log('原始备份状态:', (fs.existsSync(pkgBak) && fs.existsSync(extJsBak)) ? '已备份(正常)' : '未检测到完整备份');
  console.log('深度汉化运行时:', fs.existsSync(runtimePath) ? '已安装(激活中)' : '未安装(官方原版)');
  console.log('--------------------------------\n');
}

// 8. 命令行入口与交互菜单
async function main() {
  let extDir;
  try {
    extDir = findExtensionDir();
  } catch (e) {
    console.error('[错误]', e.message);
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const action = args[0];

  if (action === 'install') {
    install(extDir);
    return;
  }
  if (action === 'restore') {
    restore(extDir);
    return;
  }
  if (action === 'status') {
    checkStatus(extDir);
    return;
  }
  if (action === 'lang-zh') {
    setLanguage(extDir, 'zh-CN');
    return;
  }
  if (action === 'lang-en') {
    setLanguage(extDir, 'en-US');
    return;
  }

  // 无参数时进入纯 ASCII 交互控制台
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const promptMenu = () => {
    console.log('======================================================');
    console.log('       Antigravity 深度汉化与语言管理控制台');
    console.log('======================================================');
    console.log('  [1] 一键安装 / 更新深度汉化补丁');
    console.log('  [2] 一键还原官方英文原版 (恢复原始纯净状态)');
    console.log('  [3] 切换界面语言为: 简体中文');
    console.log('  [4] 切换界面语言为: English');
    console.log('  [5] 检查当前插件汉化状态');
    console.log('  [0] 退出');
    console.log('======================================================');
    rl.question('请输入选项序号并按回车 [0-5]: ', (ans) => {
      const choice = ans.trim();
      switch (choice) {
        case '1':
          install(extDir);
          promptMenu();
          break;
        case '2':
          restore(extDir);
          promptMenu();
          break;
        case '3':
          setLanguage(extDir, 'zh-CN');
          promptMenu();
          break;
        case '4':
          setLanguage(extDir, 'en-US');
          promptMenu();
          break;
        case '5':
          checkStatus(extDir);
          promptMenu();
          break;
        case '0':
          console.log('\n已退出控制台。\n');
          rl.close();
          break;
        default:
          console.log('\n输入有误，请输入 0 到 5 之间的数字！\n');
          promptMenu();
          break;
      }
    });
  };

  promptMenu();
}

main().catch(err => {
  console.error('[严重错误]', err);
  process.exit(1);
});
