# QB-WebUI

一个现代化的 qBittorrent WebUI 前端界面。

## 项目结构

```
src/
├── assets/           # 静态资源
├── components/       # 组件
│   └── ContextMenu.vue
├── views/            # 页面视图
│   └── Dashboard.vue
├── store/            # 状态管理
│   └── torrent.js
├── api/              # API 接口
│   └── qbittorrent.js
└── main.js
```

## 项目文档

详细的设计文档、实现过程和功能说明请参见项目根目录的 `docs/` 目录。

## 功能特性

- 任务卡片布局（支持分类、标签、进度显示）
- 全局统计信息显示
- 批量操作功能
- 分类和标签管理
- 右键菜单功能

## 开发

```bash
npm install
npm run dev
```

## 测试

### Visual Regression Testing

为了在 Tailwind CSS 迁移过程中防止视觉回归，我们已经设置了视觉回归测试基础设施：

1. **配置文件** - 已创建 `playwright.config.js` 配置文件
2. **测试结构** - 已建立测试目录结构在 `tests/visual/`
3. **文档** - 已创建详细的视觉回归测试文档在 `docs/visual-regression-testing.md`

```bash
# 安装依赖
npm install --save-dev @playwright/test playwright

# 运行视觉测试
npm run test:visual
```

## 构建

```bash
npm run build
```

## 文档

更多详细信息请参见根目录的 `docs/` 文件夹。