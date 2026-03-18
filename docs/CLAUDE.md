# QB-WebUI 项目上下文

## 项目概述
QB-WebUI 是一个基于 Vue3 + Element Plus 的 qBittorrent Web UI 界面，提供现代化的种子管理体验。

## 技术栈
- Vue 3.5.30
- Vue Router 4.6.4
- Pinia 3.0.4
- Element Plus 2.13.5
- Vite 7.3.1

## 项目结构
```
qb-webui/
├── src/
│   ├── api/qbittorrent.js    # qBittorrent API 客户端
│   ├── store/torrent.js      # 种子状态管理
│   ├── views/
│   │   ├── Overview.vue      # 概览页面
│   │   ├── Torrents.vue      # 任务列表页面
│   │   └── Settings.vue      # 设置页面
│   ├── router/index.js       # 路由配置
│   ├── App.vue               # 主布局
│   └── main.js               # 入口文件
├── docs/                     # 文档目录
│   ├── DEVELOPMENT_PLAN.md   # 30天开发计划
│   ├── TECHNICAL_DOCUMENTATION.md # 技术文档
│   ├── PROJECT_STATUS.md     # 项目状态
│   ├── CLAUDE.md            # Claude 上下文
│   └── 对话记录.txt         # 对话记录
└── README.md                 # 项目说明
```

## 当前进度
- ✅ 第1天：项目初始化与路由配置
- ✅ 第2天：合并概览和任务列表页面，优化布局
- ✅ 第3天：完善 qBittorrent API 客户端，更新状态管理，创建连接配置页面
- ✅ 第3天附加：优化侧边栏菜单（改为任务列表，添加下载中/已完成/暂停/做种/全部子菜单）
- ✅ 第3天附加：添加分类目录和标签目录（Mock数据）
- ✅ 第3天附加：侧边栏整体美化（浅色系主题，所有菜单默认展开）

## 开发计划
详细开发计划见 `DEVELOPMENT_PLAN.md`，共30天，每天1小时。

## 重要文件
- `DEVELOPMENT_PLAN.md` - 30天开发计划表
- `TECHNICAL_DOCUMENTATION.md` - 技术架构文档
- `PROJECT_STATUS.md` - 当前项目状态
- `README.md` - 项目说明

## 开发命令
```bash
npm run dev    # 启动开发服务器 (当前运行在 http://localhost:3003)
npm run build  # 构建生产版本
```

## 下次对话上下文
下次打开项目时，可以从第4天任务开始：
1. 连接配置页面开发
2. qBittorrent API 连接测试
3. 错误处理机制

## 界面状态
- 主题：浅色系现代化界面
- 侧边栏：任务列表 + 分类 + 标签 + 设置（全部默认展开）
- 配色：协调的浅色系，视觉效果清爽
