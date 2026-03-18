# QB-WebUI 技术文档

## 🏗️ 项目详细架构设计

### 1. 技术栈选择

```javascript
// 核心依赖
{
  "vue": "^3.5.30",           // 前端框架
  "vue-router": "^4.6.4",     // 路由管理
  "pinia": "^3.0.4",          // 状态管理
  "element-plus": "^2.13.5",  // UI 组件库
  "@element-plus/icons-vue": "^2.3.2", // 图标库
  "vite": "^7.3.1",           // 构建工具
  "@vitejs/plugin-vue": "^6.0.4" // Vite Vue 插件
}
```

### 2. 项目目录结构

```
qb-webui/
├── public/                 # 静态资源
├── src/
│   ├── api/                # API 接口层
│   │   └── qbittorrent.js  # qBittorrent API 客户端
│   ├── assets/             # 静态资源
│   │   ├── styles/         # 样式文件
│   │   └── images/         # 图片资源
│   ├── components/         # 公共组件
│   │   ├── common/         # 通用组件
│   │   │   ├── Loading.vue
│   │   │   ├── Empty.vue
│   │   │   └── Pagination.vue
│   │   └── torrent/        # 种子相关组件
│   │       ├── TorrentCard.vue
│   │       ├── TorrentList.vue
│   │       └── AddTorrentDialog.vue
│   ├── composables/        # 组合式函数
│   │   ├── useTorrent.js
│   │   └── useSettings.js
│   ├── router/             # 路由配置
│   │   └── index.js
│   ├── store/              # Pinia 状态管理
│   │   ├── torrent.js      # 种子状态
│   │   ├── settings.js     # 设置状态
│   │   └── app.js          # 应用状态
│   ├── utils/              # 工具函数
│   │   ├── format.js       # 格式化工具
│   │   └── storage.js      # 本地存储
│   ├── views/              # 页面组件
│   │   ├── Overview.vue    # 概览页面
│   │   ├── Torrents.vue    # 任务列表
│   │   ├── Settings.vue    # 设置页面
│   │   └── NotFound.vue    # 404页面
│   ├── App.vue             # 根组件
│   └── main.js             # 入口文件
├── index.html              # HTML 模板
├── vite.config.js          # Vite 配置
├── package.json            # 项目配置
└── README.md               # 项目说明
```

### 3. 核心对象设计

#### 3.1 Torrent 对象（种子实体）

```javascript
{
  id: string,              // 种子唯一标识
  name: string,            // 种子名称
  hash: string,            // 种子哈希值
  size: number,            // 文件大小（字节）
  progress: number,        // 进度百分比 (0-100)
  state: string,           // 状态: downloading, uploading, paused, error, etc.
  downloadSpeed: number,   // 下载速度（字节/秒）
  uploadSpeed: number,     // 上传速度（字节/秒）
  ratio: number,           // 分享率
  addedDate: number,       // 添加时间戳
  completedDate: number,   // 完成时间戳
  savePath: string,        // 保存路径
  category: string,        // 分类
  tags: array,             // 标签
  eta: number,             // 预计完成时间（秒）
  numSeeds: number,        // 做种数
  numLeechs: number,       // 下载数
  totalSeeds: number,      // 总做种数
  totalLeechs: number      // 总下载数
}
```

#### 3.2 Settings 对象（设置实体）

```javascript
{
  connection: {
    host: string,          // 主机地址
    port: number,          // 端口
    username: string,      // 用户名
    password: string       // 密码
  },
  download: {
    defaultPath: string,   // 默认下载路径
    maxDownloadSpeed: number, // 最大下载速度
    maxUploadSpeed: number,   // 最大上传速度
    maxActiveDownloads: number // 最大同时下载数
  },
  ui: {
    theme: string,         // 主题: light/dark/auto
    refreshInterval: number, // 刷新间隔（秒）
    language: string       // 语言
  }
}
```

#### 3.3 TransferInfo 对象（传输信息）

```javascript
{
  downloadSpeed: number,   // 总下载速度
  uploadSpeed: number,     // 总上传速度
  downloadData: number,    // 总下载数据量
  uploadData: number,      // 总上传数据量
  freeSpaceOnDisk: number  // 磁盘剩余空间
}
```

### 4. 组件设计

#### 4.1 布局组件

```vue
<!-- App.vue - 主布局 -->
<template>
  <el-container class="layout">
    <el-aside width="200px">
      <!-- 侧边栏导航 -->
    </el-aside>
    <el-container>
      <el-header>
        <!-- 顶部栏 -->
      </el-header>
      <el-main>
        <!-- 主内容区 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
```

#### 4.2 页面组件

| 组件 | 路由 | 功能描述 |
|------|------|----------|
| Overview.vue | `/` | 显示统计卡片和速度监控 |
| Torrents.vue | `/torrents` | 种子列表管理 |
| Settings.vue | `/settings` | 系统设置 |

#### 4.3 公共组件

| 组件 | 功能描述 |
|------|----------|
| Loading.vue | 加载状态提示 |
| Empty.vue | 空状态提示 |
| Pagination.vue | 分页组件 |
| TorrentCard.vue | 种子卡片 |
| AddTorrentDialog.vue | 添加种子对话框 |

### 5. 状态管理设计

#### 5.1 Torrent Store

```javascript
// store/torrent.js
export const useTorrentStore = defineStore('torrent', () => {
  // 状态
  const torrents = ref([])
  const transferInfo = ref({})
  const isLoading = ref(false)

  // Getters
  const totalDownloadSpeed = computed(() => ...)
  const totalUploadSpeed = computed(() => ...)

  // Actions
  const fetchTorrents = async () => {...}
  const addTorrent = async (url, options) => {...}
  const pauseTorrent = async (hash) => {...}

  return { torrents, transferInfo, isLoading, ... }
})
```

#### 5.2 Settings Store

```javascript
// store/settings.js
export const useSettingsStore = defineStore('settings', () => {
  const settings = ref(defaultSettings)

  const saveSettings = () => {...}
  const loadSettings = () => {...}

  return { settings, saveSettings, loadSettings }
})
```

### 6. API 接口设计

#### 6.1 qBittorrent API 客户端

```javascript
// api/qbittorrent.js
class QBittorrentAPI {
  // 认证
  async login() {...}

  // 种子管理
  async getTorrents() {...}
  async addTorrent(url, options) {...}
  async pauseTorrent(hash) {...}
  async resumeTorrent(hash) {...}
  async deleteTorrent(hash, deleteFiles) {...}

  // 传输信息
  async getTransferInfo() {...}
  async getSpeedLimitsMode() {...}
  async setSpeedLimitsMode(mode) {...}

  // 应用信息
  async getVersion() {...}
  async checkConnection() {...}
}
```

#### 6.2 API 端点映射

| 功能 | qBittorrent API 端点 |
|------|---------------------|
| 登录 | `/api/v2/auth/login` |
| 获取种子列表 | `/api/v2/torrents/info` |
| 添加种子 | `/api/v2/torrents/add` |
| 暂停种子 | `/api/v2/torrents/pause` |
| 恢复种子 | `/api/v2/torrents/resume` |
| 删除种子 | `/api/v2/torrents/delete` |
| 传输信息 | `/api/v2/transfer/info` |
| 速度限制 | `/api/v2/transfer/speedLimitsMode` |

---

## 📚 使用文档

### 1. 项目概述

**QB-WebUI** 是一个基于 Vue3 + Element Plus 的 qBittorrent Web UI 界面，提供现代化的种子管理体验。

### 2. 快速开始

#### 2.1 环境要求
- Node.js >= 16
- npm >= 8

#### 2.2 安装依赖
```bash
npm install
```

#### 2.3 启动开发服务器
```bash
npm run dev
```

#### 2.4 构建生产版本
```bash
npm run build
```

### 3. 核心功能

#### 3.1 概览页面
- 实时下载/上传速度监控
- 种子状态统计卡片
- 全局速度限制控制

#### 3.2 任务列表
- 种子列表展示
- 搜索功能
- 状态筛选
- 分页显示
- 操作控制（暂停/恢复/删除）

#### 3.3 设置页面
- qBittorrent 连接配置
- 下载设置
- 界面主题设置
- 自动刷新间隔

### 4. 开发指南

#### 4.1 添加新页面
1. 在 `src/views/` 创建 Vue 组件
2. 在 `src/router/index.js` 添加路由
3. 在侧边栏添加导航链接

#### 4.2 添加新组件
1. 在 `src/components/` 创建组件
2. 导入并使用在页面中

#### 4.3 状态管理
使用 Pinia 进行状态管理，遵循以下原则：
- 状态集中管理
- Getters 用于计算属性
- Actions 用于异步操作

### 5. 最佳实践

#### 5.1 代码规范
- 使用 ESLint + Prettier
- 组件采用 `<script setup>` 语法
- 使用组合式 API

#### 5.2 性能优化
- 使用 `v-if` 和 `v-show` 合理
- 列表使用 `key` 属性
- 图片懒加载
- 数据缓存

#### 5.3 安全考虑
- 密码本地加密存储
- API 请求错误处理
- XSS 防护
