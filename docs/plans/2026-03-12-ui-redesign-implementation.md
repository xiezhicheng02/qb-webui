# UI 重设计实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 优化 QB-WebUI 的浅色模式 UI，改进布局、间距和视觉层次，使用蓝色主色调。

**Architecture:** 创建样式变量文件定义 CSS 变量，重构组件样式，优化布局系统，更新全局样式。

**Tech Stack:** Vue 3, Element Plus, CSS Variables, Vite

---

### Task 1: 创建样式变量文件

**Files:**
- Create: `src/styles/variables.css`

**Step 1: Write the failing test**

由于这是样式文件，无法编写单元测试。我们将通过检查文件是否存在来验证。

**Step 2: Run test to verify it fails**

```bash
ls src/styles/variables.css
```
Expected: "No such file or directory"

**Step 3: Write minimal implementation**

```css
/* src/styles/variables.css */
:root {
  /* 主色调 - 蓝色 */
  --primary-color: #409EFF;
  --primary-hover: #66b1ff;
  --primary-active: #3a8ee6;

  /* 背景色 */
  --background-color: #F5F7FA;
  --card-background: #FFFFFF;
  --sidebar-background: #FFFFFF;

  /* 文字颜色 */
  --text-primary: #303133;
  --text-secondary: #606266;
  --text-tertiary: #909399;

  /* 间距系统 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* 圆角 */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;

  /* 阴影 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 12px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 20px rgba(0, 0, 0, 0.15);

  /* 字体大小 */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 20px;
  --font-size-xl: 24px;

  /* 字体粗细 */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
}
```

**Step 4: Run test to verify it passes**

```bash
ls src/styles/variables.css
```
Expected: File exists

**Step 5: Commit**

```bash
git add src/styles/variables.css
git commit -m "feat: create CSS variables file for UI redesign"
```

---

### Task 2: 更新全局样式引入

**Files:**
- Modify: `src/main.js`

**Step 1: Write the failing test**

检查 `src/main.js` 是否引入了样式变量文件。

**Step 2: Run test to verify it fails**

```bash
grep "variables.css" src/main.js
```
Expected: No match found

**Step 3: Write minimal implementation**

```javascript
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/variables.css' // 新增：引入样式变量

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(ElementPlus)

app.mount('#app')
```

**Step 4: Run test to verify it passes**

```bash
grep "variables.css" src/main.js
```
Expected: Match found

**Step 5: Commit**

```bash
git add src/main.js
git commit -m "feat: import CSS variables in main.js"
```

---

### Task 3: 优化 Settings.vue 样式

**Files:**
- Modify: `src/views/Settings.vue:284-299` (样式部分)

**Step 1: Write the failing test**

检查 Settings.vue 是否使用了 CSS 变量。

**Step 2: Run test to verify it fails**

```bash
grep "var(--" src/views/Settings.vue
```
Expected: No match found (或很少匹配)

**Step 3: Write minimal implementation**

```vue
<!-- src/views/Settings.vue -->
<style scoped>
.settings {
  padding: var(--spacing-md);
  background-color: var(--background-color);
  min-height: calc(100vh - 60px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-md);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

/* 优化表单样式 */
.el-form {
  max-width: 600px;
}

.el-form-item {
  margin-bottom: var(--spacing-lg);
}

.el-form-item__label {
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}

/* 优化按钮样式 */
.el-button {
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
}

/* 优化卡片样式 */
.el-card {
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.3s ease;
}

.el-card:hover {
  box-shadow: var(--shadow-md);
}

/* 优化标签样式 */
.el-tag {
  border-radius: var(--border-radius-sm);
  font-weight: var(--font-weight-medium);
}

/* 优化输入框样式 */
.el-input__inner,
.el-input-number__input {
  border-radius: var(--border-radius-sm);
}

/* 优化选项卡样式 */
.el-tabs__item {
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}

.el-tabs__item.is-active {
  color: var(--primary-color);
  font-weight: var(--font-weight-bold);
}
</style>
```

**Step 4: Run test to verify it passes**

```bash
grep "var(--" src/views/Settings.vue
```
Expected: Multiple matches found

**Step 5: Commit**

```bash
git add src/views/Settings.vue
git commit -m "feat: optimize Settings.vue styles with CSS variables"
```

---

### Task 4: 优化 Dashboard.vue 样式

**Files:**
- Modify: `src/views/Dashboard.vue` (样式部分)

**Step 1: Write the failing test**

检查 Dashboard.vue 是否使用了 CSS 变量。

**Step 2: Run test to verify it fails**

```bash
grep "var(--" src/views/Dashboard.vue
```
Expected: No match found (或很少匹配)

**Step 3: Write minimal implementation**

```vue
<!-- src/views/Dashboard.vue -->
<style scoped>
.dashboard {
  padding: var(--spacing-md);
  background-color: var(--background-color);
  min-height: calc(100vh - 60px);
}

/* 统计卡片样式 */
.stat-card {
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
}

.stat-icon {
  font-size: 40px;
  margin-right: var(--spacing-md);
}

.stat-info {
  text-align: center;
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  margin-top: var(--spacing-xs);
}

/* 速度监控卡片样式 */
.speed-card {
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
}

.speed-info {
  display: flex;
  justify-content: space-around;
  padding: var(--spacing-lg) 0;
}

.speed-item {
  text-align: center;
}

.speed-label {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-xs);
}

.speed-value {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
}

.speed-value.download {
  color: var(--primary-color);
}

.speed-value.upload {
  color: #67c23a;
}

/* 任务列表样式 */
.torrents {
  padding: var(--spacing-md);
  background-color: var(--background-color);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-md);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.torrent-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: var(--font-weight-medium);
}

.pagination {
  margin-top: var(--spacing-lg);
  display: flex;
  justify-content: flex-end;
}

/* 优化表格样式 */
.el-table {
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.el-table th {
  background-color: var(--background-color);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}

.el-table td {
  color: var(--text-primary);
}

/* 优化按钮组样式 */
.el-button-group .el-button {
  border-radius: var(--border-radius-sm);
}
</style>
```

**Step 4: Run test to verify it passes**

```bash
grep "var(--" src/views/Dashboard.vue
```
Expected: Multiple matches found

**Step 5: Commit**

```bash
git add src/views/Dashboard.vue
git commit -m "feat: optimize Dashboard.vue styles with CSS variables"
```

---

### Task 5: 优化 App.vue 样式

**Files:**
- Modify: `src/App.vue` (样式部分)

**Step 1: Write the failing test**

检查 App.vue 是否使用了 CSS 变量。

**Step 2: Run test to verify it fails**

```bash
grep "var(--" src/App.vue
```
Expected: No match found (或很少匹配)

**Step 3: Write minimal implementation**

```vue
<!-- src/App.vue -->
<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  background-color: var(--background-color);
  line-height: 1.5;
}

#app {
  min-height: 100vh;
}

/* 侧边栏样式 */
.el-aside {
  background-color: var(--sidebar-background);
  border-right: 1px solid #e6e6e6;
  transition: width 0.3s ease;
}

.el-menu {
  border-right: none;
}

.el-menu-item {
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}

.el-menu-item:hover {
  background-color: var(--background-color);
  color: var(--primary-color);
}

.el-menu-item.is-active {
  background-color: rgba(64, 158, 255, 0.1);
  color: var(--primary-color);
  font-weight: var(--font-weight-bold);
}

.el-sub-menu__title {
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

/* 主内容区域 */
.el-main {
  background-color: var(--background-color);
  padding: var(--spacing-md);
}

/* 顶部导航栏 */
.el-header {
  background-color: var(--card-background);
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-lg);
}

.header-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--background-color);
}

::-webkit-scrollbar-thumb {
  background: var(--text-tertiary);
  border-radius: var(--border-radius-sm);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}
</style>
```

**Step 4: Run test to verify it passes**

```bash
grep "var(--" src/App.vue
```
Expected: Multiple matches found

**Step 5: Commit**

```bash
git add src/App.vue
git commit -m "feat: optimize App.vue styles with CSS variables"
```

---

### Task 6: 测试和验证

**Files:**
- No file changes, manual testing

**Step 1: Write the failing test**

无法编写自动化测试，需要手动验证。

**Step 2: Run test to verify it fails**

启动开发服务器并检查 UI。

**Step 3: Write minimal implementation**

手动测试以下场景：
1. 访问 http://localhost:3003
2. 检查侧边栏样式
3. 检查主内容区域样式
4. 检查卡片、按钮、表格样式
5. 检查视觉层次（标题大小、颜色）

**Step 4: Run test to verify it passes**

所有场景通过视觉验证。

**Step 5: Commit**

```bash
git add .
git commit -m "feat: complete UI redesign with improved layout and spacing"
```

---

## Execution Handoff

Plan complete and saved to `docs/plans/2026-03-12-ui-redesign-implementation.md`. Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**