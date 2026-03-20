# UI 主题全局美化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- []`) syntax for tracking.

**Goal:** Implement dark/light dual theme system with moderate interaction animations, new hexagon logo, and theme-responsive login page for qBittorrent Web UI.

**Architecture:** Use Element Plus built-in dark mode (`html.dark` class toggle) + CSS custom properties for project-specific variables. Theme preference persisted in localStorage with auto mode support. All 7 files modified in dependency order.

**Tech Stack:** Vue 3.5, Element Plus 2.13.5, CSS Custom Properties, localStorage

---

## File Structure

| File | Responsibility |
|------|---------------|
| `src/assets/main.css` | CSS variable definitions (`:root` light + `html.dark` overrides), scrollbar, animations, utility classes |
| `src/main.js` | Import Element Plus dark CSS, register global `toggleTheme()` function |
| `src/App.vue` | Replace logo SVG, migrate hardcoded colors to CSS variables, add transition animations |
| `src/views/Dashboard.vue` | Table row hover animation, progress bar shimmer, `:deep()` variable migration |
| `src/views/Login.vue` | Remove particles/scanlines, theme-responsive background/card, replace logo SVG |
| `src/views/Settings.vue` | Connect theme selector to real `toggleTheme()` logic |
| `src/components/NotificationContainer.vue` | Minor variable cleanup for dual theme |

---

### Task 1: Rewrite `src/assets/main.css` — Dual Theme CSS Variables + Animations

**Files:**
- Modify: `src/assets/main.css` (full rewrite)

**Context:** Current file has 167 lines with light-theme-only variables on `:root`. Has a stale `.glass-panel` class with hardcoded dark background. Needs `html.dark` variable block and animation keyframes.

- [ ] **Step 1: Rewrite `:root` block with unified variable names**

Replace the entire `:root` block (lines 3-104) with the new naming convention. Keep old variable names as aliases where they're still referenced in scoped styles (to avoid breaking existing code before migration). Key new variables:

```css
:root {
  /* === Unified Theme Variables (Light defaults) === */
  --bg-base: #ffffff;
  --bg-card: #f8fafc;
  --bg-sidebar: #f8fafc;
  --bg-hover: #f1f5f9;
  --text-primary: #1e293b;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --accent-primary: #0284c7;
  --accent-secondary: #7c3aed;
  --accent-gradient: linear-gradient(135deg, #0284c7, #7c3aed);
  --status-success: #10b981;
  --status-warning: #f59e0b;
  --status-error: #ef4444;
  --status-info: #0284c7;
  --border-default: #e2e8f0;
  --border-subtle: #f1f5f9;
  --speed-download: #0284c7;
  --speed-upload: #10b981;

  /* === Backward-compatible aliases === */
  --bg-light: var(--bg-base);
  --bg-light-secondary: var(--bg-card);
  --bg-panel: var(--bg-base);
  --bg-card-alt: var(--bg-card);
  --bg-task-list: var(--bg-base);
  --bg-task-header: var(--bg-card);
  --bg-task-row: var(--bg-base);
  --bg-task-row-hover: var(--bg-hover);
  --bg-sidebar-hover: var(--bg-hover);
  --bg-active: #dbeafe;
  --bg-active-secondary: #bfdbfe;
  --border-color: var(--border-default);
  --border-color-subtle: var(--border-subtle);
  --border-light: #cbd5e1;
  --accent-cyan: var(--accent-primary);
  --accent-cyan-dark: #0369a1;
  --accent-magenta: #db2777;
  --accent-purple: var(--accent-secondary);
  --accent-green: #059669;
  --accent-glow: 0 0 15px rgba(2, 132, 199, 0.3);
  --primary-color: var(--accent-primary);
  --primary-hover: #38bdf8;
  --primary-active: #0369a1;
  --background-color: var(--bg-base);
  --text-tertiary: #909399;
  --text-dim: #94a3b8;
  --accent-gradient-secondary: linear-gradient(135deg, #0369a1, #6d28d9);

  /* === Typography, spacing, radius, shadows (unchanged) === */
  --font-display: 'Orbitron', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-sans: 'Noto Sans SC', sans-serif;
  --text-xs: 12px; --text-sm: 14px; --text-base: 15px;
  --text-md: 17px; --text-lg: 19px; --text-xl: 22px; --text-2xl: 26px;
  --sidebar-width: 260px; --header-height: 64px;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px;
  --spacing-lg: 24px; --spacing-xl: 32px;
  --border-radius: 8px; --border-radius-sm: 6px;
  --border-radius-md: 12px; --border-radius-lg: 16px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.08);
  --shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.06);
  --font-weight-normal: 400; --font-weight-medium: 500; --font-weight-bold: 700;
}
```

- [ ] **Step 2: Add `html.dark` variable overrides**

Add after the `:root` block:

```css
html.dark {
  --bg-base: #0f1117;
  --bg-card: #1e2030;
  --bg-sidebar: #0f1117;
  --bg-hover: #252840;
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  --accent-primary: #22d3ee;
  --accent-secondary: #a78bfa;
  --accent-gradient: linear-gradient(135deg, #22d3ee, #c4b5fd);
  --status-success: #34d399;
  --status-warning: #fbbf24;
  --status-error: #f87171;
  --status-info: #38bdf8;
  --border-default: rgba(255, 255, 255, 0.08);
  --border-subtle: rgba(255, 255, 255, 0.06);
  --speed-download: #38bdf8;
  --speed-upload: #34d399;
  --bg-active: #1e293b;
  --bg-active-secondary: #1e293b;
  --accent-cyan-dark: #0891b2;
  --accent-glow: 0 0 15px rgba(34, 211, 238, 0.3);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.3);
  --shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}
```

- [ ] **Step 3: Update `body` background and scrollbar to use new variables**

Change `body` background from `var(--bg-light)` to `var(--bg-base)`. Update scrollbar track to use `var(--bg-card)`.

- [ ] **Step 4: Update `.glass-panel` class for dual theme**

Replace hardcoded dark values with CSS variables:

```css
.glass-panel {
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-default);
}
```

- [ ] **Step 5: Add animation keyframes**

Add after utility classes:

```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
```

- [ ] **Step 6: Add global transition rules for interactive elements**

```css
button, .nav-item, .tag-item {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

- [ ] **Step 7: Verify dev server loads without errors**

Run: `npm run dev` and check `http://localhost:3003` for console errors.

---

### Task 2: Modify `src/main.js` — Element Plus Dark Mode + Theme Toggle

**Files:**
- Modify: `src/main.js`

**Context:** Currently imports `element-plus/dist/index.css` and `./assets/main.css`. Needs dark mode CSS import and a global theme toggle function.

- [ ] **Step 1: Add Element Plus dark mode CSS import**

After line 4 (`import 'element-plus/dist/index.css'`), add:

```js
import 'element-plus/theme-chalk/dark/css-vars.css'
```

- [ ] **Step 2: Add global theme toggle function**

Before `app.mount('#app')`, add:

```js
// Theme management
function applyTheme(preference) {
  const html = document.documentElement
  if (preference === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    html.classList.toggle('dark', prefersDark)
  } else {
    html.classList.toggle('dark', preference === 'dark')
  }
}

// Expose globally
window.__toggleTheme = function(preference) {
  localStorage.setItem('theme-preference', preference)
  applyTheme(preference)
}

// Apply saved theme on startup
const savedTheme = localStorage.getItem('theme-preference') || 'light'
applyTheme(savedTheme)

// Listen for system theme changes in auto mode
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (localStorage.getItem('theme-preference') === 'auto') {
    applyTheme('auto')
  }
})
```

- [ ] **Step 3: Verify theme toggle works**

Open browser console and run `window.__toggleTheme('dark')` — page should switch to dark theme.

---

### Task 3: Modify `src/App.vue` — Logo + Style Migration + Transitions

**Files:**
- Modify: `src/App.vue`

**Context:** 553 lines. Has inline SVG box icon as logo, hardcoded color references. Needs hexagon network logo, CSS variable migration, and button hover transitions.

- [ ] **Step 1: Replace logo SVG in sidebar header (line 14-18)**

Replace the box icon SVG with the hexagon network logo:

```html
<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logo-grad" x1="10" y1="10" x2="70" y2="70"
                    gradientUnits="userSpaceOnUse">
      <stop stop-color="var(--accent-primary)"/>
      <stop offset="1" stop-color="var(--accent-secondary)"/>
    </linearGradient>
  </defs>
  <polygon points="40,16 58,26 58,46 40,56 22,46 22,26"
           stroke="url(#logo-grad)" stroke-width="2.5" fill="none"/>
  <path d="M40 28 L40 44" stroke="var(--accent-primary)" stroke-width="3"
        stroke-linecap="round"/>
  <path d="M33 38 L40 46 L47 38" stroke="var(--accent-primary)" stroke-width="3"
        stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="14" cy="40" r="3" fill="var(--accent-secondary)" opacity="0.5"/>
  <circle cx="66" cy="40" r="3" fill="var(--accent-primary)" opacity="0.5"/>
  <circle cx="40" cy="8" r="2.5" fill="var(--accent-secondary)" opacity="0.4"/>
  <circle cx="40" cy="72" r="2.5" fill="var(--accent-primary)" opacity="0.4"/>
  <line x1="17" y1="40" x2="22" y2="38" stroke="var(--accent-secondary)"
        stroke-width="1" opacity="0.3"/>
  <line x1="58" y1="34" x2="63" y2="40" stroke="var(--accent-primary)"
        stroke-width="1" opacity="0.3"/>
</svg>
```

- [ ] **Step 2: Update sidebar header gradient to use CSS variable**

Change line 262 from `rgba(2, 132, 199, 0.05)` to use `color-mix` or keep as-is since the accent color changes with theme. Actually, replace with:

```css
background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent-primary) 5%, transparent), transparent);
```

For broader compatibility, use a simpler approach:

```css
background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
opacity: 0.05;
```

Or just keep the existing CSS — the `rgba(2, 132, 199, 0.05)` is subtle enough for both themes.

- [ ] **Step 3: Update `.action-btn.primary` hover animation**

Change `.action-btn.primary:hover` (line 517-520) to use the spec's 200ms timing:

```css
.action-btn.primary:hover {
  opacity: 0.95;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(var(--accent-primary-rgb, 2, 132, 199), 0.35);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

Since CSS variables in `rgba()` require separate RGB components, simplify to:

```css
.action-btn.primary:hover {
  opacity: 0.95;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}
```

- [ ] **Step 4: Add sidebar collapse text transition**

Add to the `.logo-text` style:

```css
.logo-text {
  /* existing styles */
  transition: opacity 250ms ease;
  white-space: nowrap;
  overflow: hidden;
}
```

- [ ] **Step 5: Verify layout renders correctly**

Run dev server, check sidebar logo displays, toggle sidebar collapse, verify transitions.

---

### Task 4: Modify `src/views/Dashboard.vue` — Table Animations + Progress Bar Shimmer

**Files:**
- Modify: `src/views/Dashboard.vue`

**Context:** 427 lines. Primary active view with `el-table`, `el-progress`, `el-tag`. Has extensive `:deep()` selectors.

- [ ] **Step 1: Add table row hover animation**

In the `<style scoped>` section, update `.torrent-section :deep(.el-table tr:hover td)` (line 400-402):

```css
.torrent-section :deep(.el-table tr:hover td) {
  background-color: var(--bg-hover);
  transform: translateY(-1px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

Also update `.torrent-section :deep(.el-table td)` transition (line 395) to:

```css
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
```

- [ ] **Step 2: Add progress bar shimmer pulse**

Add a new CSS block after the existing progress styles:

```css
.torrent-section :deep(.el-progress-bar__outer) {
  overflow: hidden;
  position: relative;
}

.torrent-section :deep(.el-progress-bar__inner) {
  transition: width 800ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.torrent-section :deep(.el-progress-bar__inner)::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmer 2s infinite;
}
```

- [ ] **Step 3: Update tag border for dark theme visibility**

Update `.torrent-section :deep(.el-tag)` (line 415-420):

```css
.torrent-section :deep(.el-tag) {
  background-color: color-mix(in srgb, var(--accent-primary) 15%, transparent);
  border-color: color-mix(in srgb, var(--accent-primary) 30%, transparent);
  color: var(--accent-primary);
  font-size: var(--text-xs);
}
```

If `color-mix` isn't supported, use the existing pattern but with variables:

```css
.torrent-section :deep(.el-tag) {
  background-color: rgba(34, 211, 238, 0.12);
  border-color: rgba(34, 211, 238, 0.25);
  color: var(--accent-primary);
  font-size: var(--text-xs);
}
```

- [ ] **Step 4: Add card entrance animation**

Add to `.torrent-section`:

```css
.torrent-section {
  /* existing styles */
  animation: fadeInUp 300ms ease;
}
```

(Uses the `@keyframes fadeInUp` from Task 1.)

- [ ] **Step 5: Verify table interactions**

Run dev server, check row hover effect, progress bar shimmer, tag visibility in both themes.

---

### Task 5: Modify `src/views/Login.vue` — Theme-Responsive + Remove Particles/Scanlines

**Files:**
- Modify: `src/views/Login.vue`

**Context:** 470 lines. Has cyberpunk effects: `.bg-grid`, `.bg-gradient-mesh`, `.particles` (20 items), `.scanlines`. Card has hardcoded `rgba(255, 255, 255, 0.95)`.

- [ ] **Step 1: Remove particles template section**

Remove lines 6-8 (the `.particles` div):

```html
<div class="particles">
  <div v-for="n in 20" :key="n" class="particle" :style="getParticleStyle(n)"></div>
</div>
```

- [ ] **Step 2: Remove scanlines template section**

Remove line 77:

```html
<div class="scanlines"></div>
```

- [ ] **Step 3: Remove `getParticleStyle` function from script**

Remove lines 103-117 (the `getParticleStyle` function and its `onMounted` particle-related code).

- [ ] **Step 4: Replace login page logo SVG**

Replace the box icon SVG (lines 14-18) with hexagon network logo (same as App.vue but 64x64):

```html
<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="hex-logo">
  <defs>
    <linearGradient id="login-logo-grad" x1="10" y1="10" x2="70" y2="70"
                    gradientUnits="userSpaceOnUse">
      <stop stop-color="var(--accent-primary)"/>
      <stop offset="1" stop-color="var(--accent-secondary)"/>
    </linearGradient>
  </defs>
  <polygon points="40,16 58,26 58,46 40,56 22,46 22,26"
           stroke="url(#login-logo-grad)" stroke-width="2.5" fill="none"/>
  <path d="M40 28 L40 44" stroke="var(--accent-primary)" stroke-width="3"
        stroke-linecap="round"/>
  <path d="M33 38 L40 46 L47 38" stroke="var(--accent-primary)" stroke-width="3"
        stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="14" cy="40" r="3" fill="var(--accent-secondary)" opacity="0.5"/>
  <circle cx="66" cy="40" r="3" fill="var(--accent-primary)" opacity="0.5"/>
  <circle cx="40" cy="8" r="2.5" fill="var(--accent-secondary)" opacity="0.4"/>
  <circle cx="40" cy="72" r="2.5" fill="var(--accent-primary)" opacity="0.4"/>
  <line x1="17" y1="40" x2="22" y2="38" stroke="var(--accent-secondary)"
        stroke-width="1" opacity="0.3"/>
  <line x1="58" y1="34" x2="63" y2="40" stroke="var(--accent-primary)"
        stroke-width="1" opacity="0.3"/>
</svg>
```

Update `.logo-icon` to use `width: 64px; height: 64px;`.

- [ ] **Step 5: Update `.login-container` background to be theme-responsive**

```css
.login-container {
  background: var(--bg-base);
}
```

- [ ] **Step 6: Update `.bg-grid` for dual theme**

```css
.bg-grid {
  background-image:
    linear-gradient(var(--accent-primary) 1px, transparent 1px),
    linear-gradient(90deg, var(--accent-primary) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.03;
}
```

- [ ] **Step 7: Update `.bg-gradient-mesh` for dual theme**

```css
.bg-gradient-mesh {
  background:
    radial-gradient(circle at 20% 30%, var(--accent-primary) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, var(--accent-secondary) 0%, transparent 40%);
  opacity: 0.06;
}
```

- [ ] **Step 8: Update `.login-card` for dual theme**

```css
.login-card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 10px 40px rgba(0, 0, 0, 0.04);
}
```

- [ ] **Step 9: Remove `.particles`, `.particle`, `@keyframes floatParticle`, `.scanlines` CSS**

Remove lines 236-258 (particles styles) and lines 453-469 (scanlines styles).

- [ ] **Step 10: Verify login page in both themes**

Toggle theme to dark, navigate to `/login`, verify background, grid, card, and logo all look correct. Toggle to light and verify again.

---

### Task 6: Modify `src/views/Settings.vue` — Connect Theme Selector to Real Toggle

**Files:**
- Modify: `src/views/Settings.vue`

**Context:** 195 lines. Has `el-select` for theme (light/dark/auto) that only saves to localStorage but never applies the theme. Need to call `window.__toggleTheme()`.

- [ ] **Step 1: Add `watch` on theme selection for real-time switching**

In the `<script setup>` section, add after the imports:

```js
import { ref, onMounted, watch } from 'vue'
```

Then after `interfaceSettings` ref definition, add:

```js
// Apply theme immediately when user changes selection
watch(() => interfaceSettings.value.theme, (newTheme) => {
  if (window.__toggleTheme) {
    window.__toggleTheme(newTheme)
  }
})
```

- [ ] **Step 2: Update `saveInterfaceSettings` to apply theme**

The watch handles real-time preview. The save button persists. No change needed to `saveInterfaceSettings` — it already saves to localStorage and the `__toggleTheme` function also saves.

- [ ] **Step 3: Load saved theme on mount**

In `onMounted`, after loading saved interface settings, add theme application:

```js
// Apply saved theme
if (window.__toggleTheme) {
  window.__toggleTheme(interfaceSettings.value.theme)
}
```

- [ ] **Step 4: Verify theme switching**

Open Settings, change theme dropdown — UI should switch immediately. Refresh page — theme should persist.

---

### Task 7: Modify `src/components/NotificationContainer.vue` — Dual Theme Cleanup

**Files:**
- Modify: `src/components/NotificationContainer.vue`

**Context:** 201 lines. Already uses CSS variables extensively. Minor cleanup for dark theme contrast.

- [ ] **Step 1: Update notification hover shadow for dark theme**

Change line 92-93 from hardcoded `rgba(0, 0, 0, 0.15)`:

```css
.notification:hover {
  transform: translateX(-4px);
  box-shadow: var(--shadow-lg);
}
```

- [ ] **Step 2: Verify notifications in both themes**

Trigger a notification (e.g., login success), check visibility and contrast in dark/light modes.

---

### Task 8: Final Integration Verification

- [ ] **Step 1: Full theme cycle test**

1. Open app in light mode — verify all pages
2. Settings → switch to dark — verify all pages
3. Settings → switch to light — verify all pages
4. Settings → switch to auto — change system theme — verify auto-switch
5. Refresh page — verify persistence

- [ ] **Step 2: Check for console errors**

Open browser DevTools, navigate all pages, check for CSS/JS errors.

- [ ] **Step 3: Verify login page**

Navigate to `/login`, check both themes render correctly.

- [ ] **Step 4: Commit all changes**

```bash
git add -A
git commit -m "feat: implement dark/light dual theme system with interaction animations

- Add CSS custom properties for dual theme (light + dark)
- Import Element Plus dark mode CSS vars
- Add global theme toggle with localStorage persistence and auto mode
- Replace logo with hexagon network design
- Remove particles and scanlines from login page
- Add table row hover animation and progress bar shimmer
- Connect Settings theme selector to real toggle logic
- Migrate all components to use unified CSS variables
```

---

## Verification Checklist

| # | Criteria | How to Verify |
|---|----------|--------------|
| 1 | Settings "深色" → all pages dark, persists after refresh | Manual: Settings → dark → navigate → refresh |
| 2 | Settings "浅色" → all pages light, persists after refresh | Manual: Settings → light → navigate → refresh |
| 3 | Settings "自动" → follows system theme | Manual: change OS theme, verify UI follows |
| 4 | Dark theme text contrast ≥ WCAG AA | Visual check: all text readable on dark backgrounds |
| 5 | Button/row/input hover/focus animations smooth | Manual: hover all interactive elements |
| 6 | Login page looks good in both themes | Manual: toggle theme, visit /login |
| 7 | Logo clear at 28px (sidebar) and 64px (login) | Manual: visual check |
