# QB-WebUI

一个基于 Vue3 + Element Plus 的 qBittorrent Web UI 界面。

## 功能特性

- 🎨 现代化的界面设计
- 📊 实时下载/上传速度监控
- 📋 任务列表管理（搜索、筛选、分页）
- ⚙️ 完整的设置界面
- 🔄 支持暂停/恢复/删除任务
- 📱 响应式布局

## 技术栈

- **前端框架**: Vue 3
- **UI 组件**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router
- **构建工具**: Vite

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000 查看应用

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
qb-webui/
├── src/
│   ├── api/           # API 接口
│   ├── components/    # 公共组件
│   ├── router/        # 路由配置
│   ├── store/         # Pinia 状态管理
│   ├── views/         # 页面组件
│   ├── assets/        # 静态资源
│   ├── App.vue        # 根组件
│   └── main.js        # 入口文件
├── docs/              # 文档目录
│   ├── DEVELOPMENT_PLAN.md       # 30天开发计划
│   ├── TECHNICAL_DOCUMENTATION.md # 技术文档
│   ├── PROJECT_STATUS.md         # 项目状态
│   ├── CLAUDE.md                 # Claude 上下文
│   └── 对话记录.txt              # 对话记录
├── index.html         # HTML 模板
├── vite.config.js     # Vite 配置
└── package.json       # 项目配置
```

## API 配置

在设置页面配置 qBittorrent 连接信息：
- 主机地址
- 端口 (默认: 8080)
- 用户名
- 密码

## 开发说明

### 添加新页面

1. 在 `src/views/` 目录下创建新的 Vue 组件
2. 在 `src/router/index.js` 中添加路由配置
3. 在侧边栏菜单中添加导航链接

### 状态管理

使用 Pinia 进行状态管理，主要的 store 位于 `src/store/` 目录。

### API 接口

所有 qBittorrent API 调用都在 `src/api/qbittorrent.js` 中实现。

## 许可证

MIT License
