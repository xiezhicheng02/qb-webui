# 连接配置页面增强设计文档

## 1. 概述
本设计文档针对 Day 4 开发任务 "连接配置页面"，重点是增强表单验证与用户体验。

## 2. 目标
- 提供实时的表单验证反馈。
- 改善连接测试的错误处理和用户提示。
- 优化 UI 交互体验。

## 3. 详细设计

### 3.1 架构与组件
- **组件**: `src/views/Settings.vue` (连接设置标签页)
- **API**: `src/api/qbittorrent.js`
- **Store**: `src/store/torrent.js`

### 3.2 UI/UX 设计
1. **表单验证**:
   - **Host**: 必填，必须以 `http://` 或 `https://` 开头。
   - **Port**: 必填，整数范围 1-65535。
   - **Username/Password**: 必填。
2. **状态指示**:
   - 使用 `el-tag` 显示连接状态 (已连接/未连接)。
3. **操作按钮**:
   - **测试连接**: 显示加载状态，点击后调用 API 进行登录测试。
   - **保存连接**: 将配置保存到 `localStorage`。

### 3.3 数据流
1. 用户输入 -> 更新 `connectionSettings`。
2. 触发验证逻辑 -> 显示错误信息。
3. 点击 "测试连接" -> 调用 `qbittorrentAPI.login()`。
4. 根据结果更新 `torrentStore.isConnected` 和显示 `ElMessage`。
5. 点击 "保存连接" -> 序列化配置并存入 `localStorage`。

### 3.4 错误处理
- **API 错误**: 捕获网络异常和认证失败。
- **UI 反馈**: 使用 `ElMessage` 显示全局提示，表单字段下方显示具体错误。

### 3.5 测试策略
- **手动测试**: 正常流程、异常流程（无效输入、断网等）。
- **集成测试**: 验证组件与 API/Store 的交互。

## 4. 代码变更要点
- 在 `Settings.vue` 中添加 `rules` 对象定义验证规则。
- 使用 `el-form` 的 `:rules` 属性绑定规则。
- 在 `testConnection` 中增加表单验证步骤和详细的错误捕获。
- 优化 `saveConnection` 的反馈机制。

---

*设计完成时间: 2026-03-12*
