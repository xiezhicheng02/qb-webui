# 代理配置修改记录

## 日期
2026年3月13日

## 问题
访问 qBittorrent 登录接口时出现 CORS 错误：
```
Access to fetch at 'http://localhost:8088/api/v2/auth/login' from origin 'http://localhost:3000' has been blocked by CORS policy
```

## 解决方案
采用 Vite 代理配置来解决 CORS 问题，并删除连接设置页面。

## 修改的文件

### 1. vite.config.js
- 添加了代理配置，将 `/api` 路径的请求转发到 `http://localhost:8088`
- 修改开发服务器端口为 3001（因为 3000 端口被占用）
- 更新代理配置，保留 `/api` 前缀转发

### 2. src/api/qbittorrent.js
- 更新了 `setConfig` 方法，自动检测代理模式
- 在代理模式下使用相对路径，避免 CORS 问题

### 3. src/views/Settings.vue
- **删除了连接设置页面**
- 保留下载设置和界面设置页面
- 默认激活下载设置标签页

### 4. src/main.js
- 添加了自动配置 API 的代码
- 在开发环境中自动使用代理模式
- 在生产环境中尝试从本地存储加载配置

## 代理配置详情

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8088',
    changeOrigin: true,
    rewrite: (path) => path  // 保留 /api 前缀
  }
}
```

## 使用方法
1. 确保 qBittorrent WebUI 正在运行在 `http://localhost:8088`
2. 启动开发服务器：`npm run dev`
3. 访问 `http://localhost:3001`
4. 应用会自动使用代理模式，无需手动配置连接

## 测试结果
✅ 代理连接测试成功
✅ 登录成功
✅ 获取版本信息成功 (v5.1.2.10)
✅ 获取传输信息成功
✅ 获取种子列表成功 (4 个种子)
