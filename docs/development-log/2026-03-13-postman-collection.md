# Postman Collection Generation - 2026年3月13日

## 今日完成的工作

### 1. 生成 qBittorrent WebUI API Postman 配置文件
- **文件**: `c:\home\project\qBittorrent_API_Postman_Collection_Manual.json`
- **内容**: 包含所有 qBittorrent WebUI API (v5.0) 的 Postman 集合
- **API 分组**:
  - Authentication API (认证 API)
  - Application API (应用 API)
  - Log API (日志 API)
  - Sync API (同步 API)
  - Transfer API (传输 API)
  - Torrent Management API (种子管理 API)
  - RSS API (RSS API)
  - Search API (搜索 API)

### 2. API 端点数量
- 总共 45+ 个 API 端点
- 包含 GET 和 POST 请求
- 包含请求头、参数和请求体配置

### 3. Postman 环境变量配置
- `baseUrl`: qBittorrent WebUI 地址 (默认: http://localhost:8080)
- `username`: 登录用户名
- `password`: 登录密码
- `sid`: 会话 ID (登录后获取)
- `torrent_hash`: 种子哈希值

## 使用说明

### 导入到 Postman
1. 打开 Postman
2. 点击 "Import"
3. 选择 "Import File"
4. 选择生成的 JSON 文件: `qBittorrent_API_Postman_Collection_Manual.json`

### 配置环境变量
1. 在 Postman 中创建环境
2. 添加以下变量:
   - `baseUrl`: http://localhost:8080 (或您的 qBittorrent 地址)
   - `username`: 您的用户名
   - `password`: 您的密码
   - `sid`: 会话 ID (登录后自动获取)

### 使用流程
1. 先调用登录 API 获取 session ID
2. 将 session ID 设置到环境变量 `sid` 中
3. 调用其他 API 时会自动使用 session ID

## API 分组详情

### Authentication API
- `POST /api/v2/auth/login` - 登录
- `POST /api/v2/auth/logout` - 登出

### Application API
- `GET /api/v2/app/version` - 获取版本信息
- `GET /api/v2/app/webapiVersion` - 获取 API 版本
- `GET /api/v2/app/buildInfo` - 获取构建信息
- `POST /api/v2/app/shutdown` - 关闭 qBittorrent

### Log API
- `GET /api/v2/log/main` - 获取主日志

### Sync API
- `GET /api/v2/sync/maindata` - 获取主数据
- `GET /api/v2/sync/torrentPeers` - 获取种子 peers

### Transfer API
- `GET /api/v2/transfer/info` - 获取传输信息
- `GET /api/v2/transfer/speedLimitsMode` - 获取速度限制模式
- `POST /api/v2/transfer/toggleSpeedLimitsMode` - 切换速度限制模式
- `POST /api/v2/transfer/setDownloadLimit` - 设置全局下载限制
- `POST /api/v2/transfer/setUploadLimit` - 设置全局上传限制

### Torrent Management API
- `GET /api/v2/torrents/info` - 获取种子列表
- `POST /api/v2/torrents/add` - 添加种子
- `POST /api/v2/torrents/pause` - 暂停种子
- `POST /api/v2/torrents/resume` - 恢复种子
- `POST /api/v2/torrents/delete` - 删除种子
- `POST /api/v2/torrents/recheck` - 重新检查种子
- `GET /api/v2/torrents/properties` - 获取种子属性
- `GET /api/v2/torrents/trackers` - 获取种子 trackers
- `GET /api/v2/torrents/webseeds` - 获取种子 web seeds
- `GET /api/v2/torrents/files` - 获取种子文件列表
- `GET /api/v2/torrents/pieceStates` - 获取种子 piece 状态
- `GET /api/v2/torrents/pieceHashes` - 获取种子 piece 哈希
- `POST /api/v2/torrents/pauseAll` - 暂停所有种子
- `POST /api/v2/torrents/resumeAll` - 恢复所有种子
- `GET /api/v2/torrents/categories` - 获取分类列表
- `POST /api/v2/torrents/createCategory` - 创建分类
- `POST /api/v2/torrents/removeCategories` - 删除分类
- `GET /api/v2/torrents/tags` - 获取标签列表
- `POST /api/v2/torrents/createTags` - 创建标签
- `POST /api/v2/torrents/deleteTags` - 删除标签

### RSS API
- `GET /api/v2/rss/items` - 获取 RSS 订阅列表
- `POST /api/v2/rss/addItem` - 添加 RSS 订阅

### Search API
- `POST /api/v2/search/start` - 开始搜索
- `POST /api/v2/search/stop` - 停止搜索
- `GET /api/v2/search/results` - 获取搜索结果
- `POST /api/v2/search/delete` - 删除搜索

## 注意事项
- 所有 API 请求都需要认证 (除登录 API 外)
- 认证使用 Cookie-based authentication (SID)
- 部分 API 需要特定的参数格式
- 建议先测试登录 API 获取 session ID

## 下次开发建议
1. 测试所有 API 端点是否正常工作
2. 根据实际使用情况调整 API 参数
3. 添加更多错误处理和验证
4. 考虑添加 API 响应示例
