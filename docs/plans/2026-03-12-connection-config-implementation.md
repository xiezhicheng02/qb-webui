# Connection Configuration Enhancement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enhance the connection configuration UI with real-time validation, improved error handling, and better user feedback.

**Architecture:** Modify the existing `Settings.vue` component to add form validation rules, improve the connection testing flow, and enhance user feedback using Element Plus components.

**Tech Stack:** Vue 3, Element Plus, Pinia, JavaScript

---

### Task 1: Add Form Validation Rules

**Files:**
- Modify: `src/views/Settings.vue:108-145`

**Step 1: Write the failing test**

Since this is a UI component, we'll verify the validation logic works by checking the rules object.

```javascript
// Validation rules should be defined
const rules = {
  host: [
    { required: true, message: '请输入主机地址', trigger: 'blur' },
    { pattern: /^https?:\/\/.+/, message: '请输入有效的 URL (http:// 或 https://)', trigger: 'blur' }
  ],
  port: [
    { required: true, message: '请输入端口', trigger: 'blur' },
    { type: 'number', min: 1, max: 65535, message: '端口必须在 1-65535 之间', trigger: 'blur' }
  ]
}
```

**Step 2: Run test to verify it fails**

Open the browser and navigate to Settings page. Try to save without entering host.
Expected: No validation error shown (current behavior)

**Step 3: Write minimal implementation**

```javascript
// Add to <script setup> section after existing refs
import { reactive } from 'vue'

const connectionForm = ref(null)

// 定义验证规则
const rules = reactive({
  host: [
    { required: true, message: '请输入主机地址', trigger: 'blur' },
    { pattern: /^https?:\/\/.+/, message: '请输入有效的 URL (http:// 或 https://)', trigger: 'blur' }
  ],
  port: [
    { required: true, message: '请输入端口', trigger: 'blur' },
    { type: 'number', min: 1, max: 65535, message: '端口必须在 1-65535 之间', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})
```

**Step 4: Update template to use validation**

```vue
<!-- Modify the el-form element -->
<el-form :model="connectionSettings" :rules="rules" ref="connectionForm" label-width="150px" style="max-width: 600px;">
  <el-form-item label="qBittorrent 地址" prop="host">
    <el-input v-model="connectionSettings.host" placeholder="http://localhost" />
  </el-form-item>
  <el-form-item label="端口" prop="port">
    <el-input-number v-model="connectionSettings.port" :min="1" :max="65535" />
  </el-form-item>
  <el-form-item label="用户名" prop="username">
    <el-input v-model="connectionSettings.username" placeholder="admin" />
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="connectionSettings.password" type="password" placeholder="密码" show-password />
  </el-form-item>
  <!-- ... rest of form ... -->
</el-form>
```

**Step 5: Run test to verify it works**

Open browser, navigate to Settings page.
Expected: Validation errors appear when fields are empty or invalid

**Step 6: Commit**

```bash
git add src/views/Settings.vue
git commit -m "feat: add form validation rules to connection settings"
```

---

### Task 2: Enhance Connection Testing Function

**Files:**
- Modify: `src/views/Settings.vue:147-175`

**Step 1: Write the failing test**

Current `testConnection` function doesn't validate form before testing.
Expected: Function should validate form first.

**Step 2: Run test to verify it fails**

Try clicking "Test Connection" with empty fields.
Expected: No validation feedback (current behavior)

**Step 3: Write minimal implementation**

```javascript
const testConnection = async () => {
  // Validate form first
  try {
    await connectionForm.value.validate()
  } catch (error) {
    ElMessage.warning('请检查表单输入')
    return
  }

  testingConnection.value = true
  try {
    // 设置API配置
    qbittorrentAPI.setConfig(
      connectionSettings.value.host,
      connectionSettings.value.port,
      connectionSettings.value.username,
      connectionSettings.value.password
    )

    // 尝试登录
    const loginSuccess = await qbittorrentAPI.login()
    if (loginSuccess) {
      ElMessage.success('连接成功！')
      torrentStore.isConnected = true
      // 获取服务器信息
      await torrentStore.fetchServerState()
    } else {
      ElMessage.error('连接失败，请检查用户名和密码')
      torrentStore.isConnected = false
    }
  } catch (error) {
    // 区分不同类型的错误
    if (error.message && error.message.includes('Failed to fetch')) {
      ElMessage.error('网络错误：无法连接到服务器')
    } else {
      ElMessage.error('连接失败：' + error.message)
    }
    torrentStore.isConnected = false
  } finally {
    testingConnection.value = false
  }
}
```

**Step 4: Run test to verify it works**

Open browser, navigate to Settings page.
Expected: Validation error appears when clicking Test Connection with empty fields
Expected: Proper error messages for different failure scenarios

**Step 5: Commit**

```bash
git add src/views/Settings.vue
git commit -m "feat: enhance connection testing with validation and error handling"
```

---

### Task 3: Improve Save Connection Function

**Files:**
- Modify: `src/views/Settings.vue:177-197`

**Step 1: Write the failing test**

Current `saveConnection` function doesn't validate form before saving.
Expected: Function should validate form first.

**Step 2: Run test to verify it fails**

Try clicking "Save Connection" with empty fields.
Expected: No validation feedback (current behavior)

**Step 3: Write minimal implementation**

```javascript
const saveConnection = async () => {
  // Validate form first
  try {
    await connectionForm.value.validate()
  } catch (error) {
    ElMessage.warning('请检查表单输入')
    return
  }

  savingConnection.value = true
  try {
    // 保存到本地存储
    localStorage.setItem('qb-webui-connection', JSON.stringify(connectionSettings.value))

    // 设置API配置
    qbittorrentAPI.setConfig(
      connectionSettings.value.host,
      connectionSettings.value.port,
      connectionSettings.value.username,
      connectionSettings.value.password
    )

    ElMessage.success('连接设置已保存')
  } catch (error) {
    ElMessage.error('保存失败：' + error.message)
  } finally {
    savingConnection.value = false
  }
}
```

**Step 4: Run test to verify it works**

Open browser, navigate to Settings page.
Expected: Validation error appears when clicking Save Connection with empty fields
Expected: Success message when saving with valid fields

**Step 5: Commit**

```bash
git add src/views/Settings.vue
git commit -m "feat: add validation to save connection function"
```

---

### Task 4: Visual Polish and Loading States

**Files:**
- Modify: `src/views/Settings.vue:1-106` (template section)

**Step 1: Write the failing test**

Current UI doesn't show clear loading states during connection testing.
Expected: Buttons should show loading spinner during operations.

**Step 2: Run test to verify it fails**

Click "Test Connection" and observe button state.
Expected: No visual loading indicator (current behavior)

**Step 3: Write minimal implementation**

The template already has `:loading="testingConnection"` and `:loading="savingConnection"` on buttons. We just need to ensure the icons are properly imported.

```vue
<!-- Ensure icons are imported at top of template -->
<template>
  <div class="settings">
    <!-- ... existing code ... -->
    <el-button type="primary" @click="testConnection" :loading="testingConnection">
      <el-icon><Connection /></el-icon>
      测试连接
    </el-button>
    <el-button type="success" @click="saveConnection" :loading="savingConnection">
      <el-icon><Check /></el-icon>
      保存连接
    </el-button>
    <!-- ... -->
  </div>
</template>
```

**Step 4: Run test to verify it works**

Open browser, navigate to Settings page.
Expected: Loading spinner appears on buttons during operations

**Step 5: Commit**

```bash
git add src/views/Settings.vue
git commit -m "feat: improve visual feedback and loading states"
```

---

### Task 5: Test All Scenarios

**Files:**
- No file changes, manual testing

**Step 1: Write test scenarios**

1. Valid connection test (localhost:8080)
2. Invalid URL format test
3. Invalid port test
4. Empty field validation test
5. Wrong credentials test
6. Save and reload test

**Step 2: Run manual tests**

Open browser, navigate to Settings page.
Test each scenario and verify expected behavior.

**Step 3: Fix any issues found**

Make necessary code adjustments.

**Step 4: Commit final changes**

```bash
git add src/views/Settings.vue
git commit -m "feat: complete connection configuration enhancement"
```

---

## Execution Handoff

**Plan complete and saved to `docs/plans/2026-03-12-connection-config-implementation.md`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
