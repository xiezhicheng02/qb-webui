# UI 主题全局美化设计规格

## 概述

对 qBittorrent Web UI 进行全局视觉美化，实现深色/浅色双主题系统，统一交互动效，优化 Logo 和登录页视觉。

## 决策记录

| 决策项 | 选择 | 理由 |
|--------|------|------|
| 主题方向 | 深色 + 浅色双主题 | 长时间使用护眼 + 场景灵活切换 |
| 主题实现 | Element Plus 内置暗色模式 | 与框架集成度高，维护成本低 |
| 交互动效 | 方案 B — 适度动效 | 微抬升 + 阴影 + 脉冲进度条，有质感但不干扰操作 |
| 登录页 | 保留赛博风格动画 | 统一配色为 CSS 变量响应主题 |
| Logo | C. 六边形网络 | 六边形代表 P2P 拓扑，中心箭头为核心功能 |

---

## 1. 主题系统架构

### 实现方式

使用 Element Plus 内置暗色模式：在 `<html>` 元素上切换 `dark` class，配合 CSS 自定义变量扩展。

```js
// 切换主题
document.documentElement.classList.toggle('dark')
```

Element Plus 会自动切换其组件的暗色样式。项目自定义部分通过 CSS 变量在 `:root` 和 `html.dark` 下分别定义。

### 主题持久化

- 使用 localStorage 存储 `theme-preference`：`dark` / `light` / `auto`
- `auto` 模式跟随 `prefers-color-scheme` 媒体查询
- Settings 页面的主题选择器接入真实切换逻辑

---

## 2. 色彩系统

### 深色主题

| 用途 | 变量名 | 值 |
|------|--------|-----|
| 页面底色 | `--bg-base` | `#0f1117` |
| 卡片/面板 | `--bg-card` | `#1e2030` |
| 侧边栏 | `--bg-sidebar` | `#0f1117` |
| 行悬停 | `--bg-hover` | `#252840` |
| 主文字 | `--text-primary` | `#f1f5f9` |
| 次要文字 | `--text-secondary` | `#cbd5e1` |
| 弱化文字 | `--text-muted` | `#94a3b8` |
| 主强调 (cyan) | `--accent-primary` | `#22d3ee` |
| 次强调 (purple) | `--accent-secondary` | `#a78bfa` |
| 强调渐变 | `--accent-gradient` | `linear-gradient(135deg, #22d3ee, #c4b5fd)` |
| 成功 | `--status-success` | `#34d399` |
| 警告 | `--status-warning` | `#fbbf24` |
| 错误 | `--status-error` | `#f87171` |
| 边框 | `--border-default` | `rgba(255,255,255,0.08)` |
| 分割线 | `--border-subtle` | `rgba(255,255,255,0.06)` |

### 浅色主题

| 用途 | 变量名 | 值 |
|------|--------|-----|
| 页面底色 | `--bg-base` | `#ffffff` |
| 卡片/面板 | `--bg-card` | `#f8fafc` |
| 侧边栏 | `--bg-sidebar` | `#f8fafc` |
| 行悬停 | `--bg-hover` | `#f1f5f9` |
| 主文字 | `--text-primary` | `#1e293b` |
| 次要文字 | `--text-secondary` | `#475569` |
| 弱化文字 | `--text-muted` | `#94a3b8` |
| 主强调 (cyan) | `--accent-primary` | `#0284c7` |
| 次强调 (purple) | `--accent-secondary` | `#7c3aed` |
| 强调渐变 | `--accent-gradient` | `linear-gradient(135deg, #0284c7, #7c3aed)` |
| 成功 | `--status-success` | `#10b981` |
| 警告 | `--status-warning` | `#f59e0b` |
| 错误 | `--status-error` | `#ef4444` |
| 边框 | `--border-default` | `#e2e8f0` |
| 分割线 | `--border-subtle` | `#f1f5f9` |

---

## 3. Logo — 六边形网络 (方案 C)

### SVG 定义

```xml
<svg width="80" height="80" viewBox="0 0 80 80" fill="none">
  <defs>
    <linearGradient id="logo-grad" x1="10" y1="10" x2="70" y2="70"
                    gradientUnits="userSpaceOnUse">
      <stop stop-color="#22d3ee"/>
      <stop offset="1" stop-color="#c4b5fd"/>
    </linearGradient>
  </defs>
  <polygon points="40,16 58,26 58,46 40,56 22,46 22,26"
           stroke="url(#logo-grad)" stroke-width="2.5" fill="none"/>
  <path d="M40 28 L40 44" stroke="#22d3ee" stroke-width="3"
        stroke-linecap="round"/>
  <path d="M33 38 L40 46 L47 38" stroke="#22d3ee" stroke-width="3"
        stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="14" cy="40" r="3" fill="#a78bfa" opacity="0.5"/>
  <circle cx="66" cy="40" r="3" fill="#22d3ee" opacity="0.5"/>
  <circle cx="40" cy="8" r="2.5" fill="#a78bfa" opacity="0.4"/>
  <circle cx="40" cy="72" r="2.5" fill="#22d3ee" opacity="0.4"/>
  <line x1="17" y1="40" x2="22" y2="38" stroke="#a78bfa"
        stroke-width="1" opacity="0.3"/>
  <line x1="58" y1="34" x2="63" y2="40" stroke="#22d3ee"
        stroke-width="1" opacity="0.3"/>
</svg>
```

### 使用位置

- **侧边栏顶部** — 28x28，配合 "qBittorrent" 文字
- **登录页** — 64x64 或 80x80，居中展示
- **浏览器 favicon** — 需导出 32x32 ICO/PNG

### 浅色主题适配

Logo 使用 `url(#logo-grad)` 渐变，深浅主题通用。浅色模式下降低 SVG 透明度层的 opacity 以适配白色背景。

---

## 4. 交互动效 (方案 B — 适度动效)

### 全局过渡参数

- 默认缓动: `cubic-bezier(0.4, 0, 0.2, 1)`
- 微交互时长: `200ms`
- 中等交互时长: `300ms`
- 进度条/数据动画: `800ms`

### 交互清单

| 元素 | 事件 | 效果 |
|------|------|------|
| 主按钮 | hover | `translateY(-2px)` + 阴影加深，200ms |
| 次按钮 | hover | `translateY(-1px)` + 背景色 + 阴影，200ms |
| 列表行 | hover | `translateY(-1px)` + 边框发光 + 微阴影，200ms |
| 输入框 | focus | 边框变色 + `box-shadow` 光晕扩散，200ms |
| 进度条 | 数据变化 | 宽度过渡 800ms + 光泽脉冲 `@keyframes shimmer` |
| 卡片 | 入场 | `opacity: 0→1` + `translateY(8px→0)`，300ms |
| 侧边栏 | 折叠/展开 | 宽度过渡 250ms，文字渐隐 |
| 通知 | 入场 | 右侧滑入 + 淡入，300ms |
| 通知 | 出场 | 右侧滑出 + 淡出，200ms |

### 进度条脉冲动画

```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

---

## 5. 登录页

### 深色登录页

- 背景: `linear-gradient(135deg, #0a0e1a, #0f1117, #131620)`
- 保留: 网格线、渐变光晕（降低 opacity）
- 移除: 浮动粒子、扫描线叠加（过于花哨）
- 卡片: `rgba(15,17,23,0.85)` + `backdrop-filter: blur(20px)` + `border: rgba(255,255,255,0.08)`

### 浅色登录页

- 背景: `linear-gradient(135deg, #f0f9ff, #ffffff, #faf5ff)`
- 网格线: `rgba(2,132,199,0.04)` 极淡
- 光晕: `rgba(2,132,199,0.06)` 和 `rgba(124,58,237,0.05)`
- 卡片: `rgba(255,255,255,0.9)` + `backdrop-filter: blur(20px)` + `box-shadow`

---

## 6. 实现范围

| 文件 | 改动内容 |
|------|----------|
| `src/assets/main.css` | 重写 CSS 变量体系，新增 `html.dark` 变量覆盖，清理 `.glass-panel` 遗留样式，新增过渡动画 keyframes |
| `src/main.js` | 导入 Element Plus 暗色 CSS (`element-plus/theme-chalk/dark/css-vars.css`)，注册主题切换函数 |
| `src/App.vue` | Logo SVG 替换为六边形方案，侧边栏/头部样式改为 CSS 变量，添加过渡动画 |
| `src/views/Dashboard.vue` | 表格行 hover 动效，进度条脉冲，标签边框增强，`:deep()` 选择器适配变量 |
| `src/views/Login.vue` | 移除粒子/扫描线，背景和卡片颜色改为响应主题变量，Logo 替换 |
| `src/views/Settings.vue` | 主题选择器接入 `toggleTheme()` 真实逻辑 |
| `src/components/NotificationContainer.vue` | 通知卡片样式适配双主题 + 入/出场动画 |
| `src/store/notification.js` | 无需改动 |

---

## 7. 不在范围内

- `Torrents.vue` 和 `Overview.vue` — 死代码，本次不修改
- 国际化 — 维持中文界面
- 响应式布局 — 维持当前 260px/60px 侧边栏方案
- 后端 API 交互 — 不改动

---

## 验收标准

1. Settings 中选择"深色"后，所有页面立即切换为深色主题，刷新后保持
2. Settings 中选择"浅色"后，所有页面立即切换为浅色主题，刷新后保持
3. 选择"自动"后跟随系统主题，切换系统深浅色时 UI 自动响应
4. 深色主题下所有文字对比度符合 WCAG AA (4.5:1)
5. 所有按钮/行/输入框 hover/focus 动效流畅，无卡顿
6. 登录页在两种主题下视觉协调，赛博风格保留
7. Logo 在侧边栏 (28px) 和登录页 (64-80px) 均清晰可辨
