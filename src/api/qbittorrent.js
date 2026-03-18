/**
 * qBittorrent API 客户端
 * 基于 qBittorrent Web API v2.0+
 */

const API_BASE = '/api/v2'

class QBittorrentAPI {
  constructor() {
    this.baseUrl = ''
    this.sid = null
    // Load SID from localStorage if available
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedSid = localStorage.getItem('qb-webui-sid')
      if (savedSid) {
        this.sid = savedSid
      }
    }
    // Polling state
    this.isPolling = false
    this.currentRid = 0
    this.pollingCallback = null
  }

  /**
   * 设置连接配置
   * @param {string} username - 用户名
   * @param {string} password - 密码
   */
  setConfig(username, password) {
    // 根据约束：所有的 /api/v2的接口访问都需要代理中转到本机的8088端口
    // 强制使用代理模式，不设置 baseUrl，使用相对路径
    // 所有 /api/v2 开头的请求都会被代理到 localhost:8088 (由 vite.config.js 或 Nginx 配置)
    this.baseUrl = ''

    this.username = username
    this.password = password
  }

  /**
   * 登录
   * @returns {Promise<boolean>}
   */
  async login() {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `username=${encodeURIComponent(this.username)}&password=${encodeURIComponent(this.password)}`
      })

      if (response.ok) {
        const text = await response.text()
        console.log('Login response:', text)
        if (text === 'Ok.') {
          // 获取 session cookie
          const cookies = response.headers.get('set-cookie')
          if (cookies) {
            const sidMatch = cookies.match(/SID=([^;]+)/)
            if (sidMatch) {
              this.sid = sidMatch[1]
              // Save SID to localStorage for persistence
              if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem('qb-webui-sid', this.sid)
              }
            }
          }

          // 如果无法从 set-cookie 头获取 SID（例如 CORS 限制），
          // 在代理模式下，浏览器会自动处理 Cookie
          // 我们设置一个标记表示已登录，但不设置具体的 SID
          if (!this.sid) {
            this.sid = 'logged-in'  // 标记已登录状态
            if (typeof window !== 'undefined' && window.localStorage) {
              localStorage.setItem('qb-webui-sid', this.sid)
            }
          }

          return true
        }
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  /**
   * 检查是否已登录
   * @returns {boolean}
   */
  isLoggedIn() {
    return this.sid !== null
  }

  /**
   * 登出
   */
  logout() {
    this.sid = null
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('qb-webui-sid')
    }
  }

  /**
   * 获取所有种子
   * @returns {Promise<Array>}
   */
  async getTorrents() {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/torrents/info`, {
        headers: this._getHeaders()
      })
      if (!this._checkResponse(response)) return []
      return await response.json()
    } catch (error) {
      console.error('Failed to get torrents:', error)
      return []
    }
  }

  /**
   * 获取种子列表（带筛选）
   * @param {Object} params - 筛选参数
   * @returns {Promise<Array>}
   */
  async getTorrentsFiltered(params = {}) {
    try {
      const url = new URL(`${this.baseUrl}${API_BASE}/torrents/info`)
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key])
        }
      })

      const response = await fetch(url.toString(), {
        headers: this._getHeaders()
      })
      if (!this._checkResponse(response)) return []
      return await response.json()
    } catch (error) {
      console.error('Failed to get filtered torrents:', error)
      return []
    }
  }

  /**
   * 添加种子
   * @param {string} url - 种子URL或磁力链接
   * @param {Object} options - 选项
   * @returns {Promise<boolean>}
   */
  async addTorrent(url, options = {}) {
    try {
      const formData = new FormData()
      formData.append('urls', url)

      if (options.savepath) formData.append('savepath', options.savepath)
      if (options.category) formData.append('category', options.category)
      if (options.paused !== undefined) formData.append('paused', options.paused)
      if (options.skipChecking !== undefined) formData.append('skip_checking', options.skipChecking)

      const response = await fetch(`${this.baseUrl}${API_BASE}/torrents/add`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: formData
      })

      if (!this._checkResponse(response)) return false
      return response.ok
    } catch (error) {
      console.error('Failed to add torrent:', error)
      return false
    }
  }

  /**
   * 暂停种子
   * @param {string} hash - 种子哈希
   * @returns {Promise<boolean>}
   */
  async pauseTorrent(hash) {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/torrents/pause`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: `hashes=${hash}`
      })
      if (!this._checkResponse(response)) return false
      return response.ok
    } catch (error) {
      console.error('Failed to pause torrent:', error)
      return false
    }
  }

  /**
   * 恢复种子
   * @param {string} hash - 种子哈希
   * @returns {Promise<boolean>}
   */
  async resumeTorrent(hash) {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/torrents/resume`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: `hashes=${hash}`
      })
      if (!this._checkResponse(response)) return false
      return response.ok
    } catch (error) {
      console.error('Failed to resume torrent:', error)
      return false
    }
  }

  /**
   * 删除种子
   * @param {string} hash - 种子哈希
   * @param {boolean} deleteFiles - 是否删除文件
   * @returns {Promise<boolean>}
   */
  async deleteTorrent(hash, deleteFiles = false) {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/torrents/delete`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: `hashes=${hash}&deleteFiles=${deleteFiles}`
      })
      if (!this._checkResponse(response)) return false
      return response.ok
    } catch (error) {
      console.error('Failed to delete torrent:', error)
      return false
    }
  }

  /**
   * 获取传输信息
   * @returns {Promise<Object>}
   */
  async getTransferInfo() {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/transfer/info`, {
        headers: this._getHeaders()
      })
      if (!this._checkResponse(response)) return {}
      return await response.json()
    } catch (error) {
      console.error('Failed to get transfer info:', error)
      return {}
    }
  }

  /**
   * 获取全局速度限制
   * @returns {Promise<Object>}
   */
  async getSpeedLimitsMode() {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/transfer/speedLimitsMode`, {
        headers: this._getHeaders()
      })
      if (!this._checkResponse(response)) return {}
      return await response.json()
    } catch (error) {
      console.error('Failed to get speed limits mode:', error)
      return {}
    }
  }

  /**
   * 设置全局速度限制
   * @param {number} mode - 模式 (0: 无限制, 1: 限制)
   * @returns {Promise<boolean>}
   */
  async setSpeedLimitsMode(mode) {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/transfer/setSpeedLimitsMode`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: `mode=${mode}`
      })
      if (!this._checkResponse(response)) return false
      return response.ok
    } catch (error) {
      console.error('Failed to set speed limits mode:', error)
      return false
    }
  }

  /**
   * 获取应用版本
   * @returns {Promise<string>}
   */
  async getVersion() {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/app/version`, {
        headers: this._getHeaders()
      })
      if (!this._checkResponse(response)) return ''
      return await response.text()
    } catch (error) {
      console.error('Failed to get version:', error)
      return ''
    }
  }

  /**
   * 获取应用信息
   * @returns {Promise<Object>}
   */
  async getAppInfo() {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/app/buildinfo`, {
        headers: this._getHeaders()
      })
      if (!this._checkResponse(response)) return {}
      return await response.json()
    } catch (error) {
      console.error('Failed to get app info:', error)
      return {}
    }
  }

  /**
   * 获取主窗口信息
   * @returns {Promise<Object>}
   */
  async getMainwindowInfo() {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/app/mainwindow`, {
        headers: this._getHeaders()
      })
      if (!this._checkResponse(response)) return {}
      return await response.json()
    } catch (error) {
      console.error('Failed to get main window info:', error)
      return {}
    }
  }

  /**
   * 获取下载速度限制
   * @returns {Promise<number>}
   */
  async getDownloadLimit() {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/transfer/downloadLimit`, {
        headers: this._getHeaders()
      })
      if (!this._checkResponse(response)) return 0
      return await response.json()
    } catch (error) {
      console.error('Failed to get download limit:', error)
      return 0
    }
  }

  /**
   * 设置下载速度限制
   * @param {number} limit - 速度限制 (0 表示无限制)
   * @returns {Promise<boolean>}
   */
  async setDownloadLimit(limit) {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/transfer/setDownloadLimit`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: `limit=${limit}`
      })
      if (!this._checkResponse(response)) return false
      return response.ok
    } catch (error) {
      console.error('Failed to set download limit:', error)
      return false
    }
  }

  /**
   * 获取上传速度限制
   * @returns {Promise<number>}
   */
  async getUploadLimit() {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/transfer/uploadLimit`, {
        headers: this._getHeaders()
      })
      if (!this._checkResponse(response)) return 0
      return await response.json()
    } catch (error) {
      console.error('Failed to get upload limit:', error)
      return 0
    }
  }

  /**
   * 设置上传速度限制
   * @param {number} limit - 速度限制 (0 表示无限制)
   * @returns {Promise<boolean>}
   */
  async setUploadLimit(limit) {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/transfer/setUploadLimit`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: `limit=${limit}`
      })
      if (!this._checkResponse(response)) return false
      return response.ok
    } catch (error) {
      console.error('Failed to set upload limit:', error)
      return false
    }
  }

  /**
   * 获取全局速度限制模式
   * @returns {Promise<Object>}
   */
  async getGlobalSpeedLimits() {
    try {
      const [downloadLimit, uploadLimit] = await Promise.all([
        this.getDownloadLimit(),
        this.getUploadLimit()
      ])
      return {
        downloadLimit,
        uploadLimit
      }
    } catch (error) {
      console.error('Failed to get global speed limits:', error)
      return { downloadLimit: 0, uploadLimit: 0 }
    }
  }

  /**
   * 设置全局速度限制
   * @param {Object} limits - 限制对象 { downloadLimit, uploadLimit }
   * @returns {Promise<boolean>}
   */
  async setGlobalSpeedLimits(limits) {
    try {
      const results = await Promise.all([
        this.setDownloadLimit(limits.downloadLimit || 0),
        this.setUploadLimit(limits.uploadLimit || 0)
      ])
      return results.every(r => r)
    } catch (error) {
      console.error('Failed to set global speed limits:', error)
      return false
    }
  }

  /**
   * 获取种子优先级
   * @param {string} hash - 种子哈希
   * @returns {Promise<number>}
   */
  async getTorrentPriority(hash) {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/torrents/queueTop`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: `hashes=${hash}`
      })
      if (!this._checkResponse(response)) return -1
      return response.ok ? 0 : -1
    } catch (error) {
      console.error('Failed to get torrent priority:', error)
      return -1
    }
  }

  /**
   * 设置种子优先级
   * @param {string} hash - 种子哈希
   * @param {string} action - 操作: 'top', 'bottom', 'increase', 'decrease'
   * @returns {Promise<boolean>}
   */
  async setTorrentPriority(hash, action) {
    try {
      const actionMap = {
        'top': 'queueTop',
        'bottom': 'queueBottom',
        'increase': 'queueUp',
        'decrease': 'queueDown'
      }
      const endpoint = actionMap[action]
      if (!endpoint) return false

      const response = await fetch(`${this.baseUrl}${API_BASE}/torrents/${endpoint}`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: `hashes=${hash}`
      })
      if (!this._checkResponse(response)) return false
      return response.ok
    } catch (error) {
      console.error('Failed to set torrent priority:', error)
      return false
    }
  }

  /**
   * 获取种子分类
   * @returns {Promise<Array>}
   */
  async getCategories() {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/torrents/categories`, {
        headers: this._getHeaders()
      })
      if (!this._checkResponse(response)) return []
      return await response.json()
    } catch (error) {
      console.error('Failed to get categories:', error)
      return []
    }
  }

  /**
   * 添加分类
   * @param {string} name - 分类名称
   * @param {string} savePath - 保存路径
   * @returns {Promise<boolean>}
   */
  async addCategory(name, savePath = '') {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/torrents/createCategory`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: `category=${encodeURIComponent(name)}&savePath=${encodeURIComponent(savePath)}`
      })
      if (!this._checkResponse(response)) return false
      return response.ok
    } catch (error) {
      console.error('Failed to add category:', error)
      return false
    }
  }

  /**
   * 删除分类
   * @param {string} name - 分类名称
   * @returns {Promise<boolean>}
   */
  async removeCategory(name) {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/torrents/removeCategories`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: `categories=${encodeURIComponent(name)}`
      })
      if (!this._checkResponse(response)) return false
      return response.ok
    } catch (error) {
      console.error('Failed to remove category:', error)
      return false
    }
  }

  /**
   * 获取种子标签
   * @returns {Promise<Array>}
   */
  async getTags() {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/torrents/tags`, {
        headers: this._getHeaders()
      })
      if (!this._checkResponse(response)) return []
      return await response.json()
    } catch (error) {
      console.error('Failed to get tags:', error)
      return []
    }
  }

  /**
   * 添加标签
   * @param {string} tag - 标签名称
   * @returns {Promise<boolean>}
   */
  async addTag(tag) {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/torrents/createTags`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: `tags=${encodeURIComponent(tag)}`
      })
      if (!this._checkResponse(response)) return false
      return response.ok
    } catch (error) {
      console.error('Failed to add tag:', error)
      return false
    }
  }

  /**
   * 删除标签
   * @param {string} tag - 标签名称
   * @returns {Promise<boolean>}
   */
  async removeTag(tag) {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/torrents/deleteTags`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: `tags=${encodeURIComponent(tag)}`
      })
      if (!this._checkResponse(response)) return false
      return response.ok
    } catch (error) {
      console.error('Failed to remove tag:', error)
      return false
    }
  }

  /**
   * 为种子添加标签
   * @param {string} hash - 种子哈希
   * @param {string} tag - 标签名称
   * @returns {Promise<boolean>}
   */
  async addTagToTorrent(hash, tag) {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/torrents/addTags`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: `hashes=${hash}&tags=${encodeURIComponent(tag)}`
      })
      if (!this._checkResponse(response)) return false
      return response.ok
    } catch (error) {
      console.error('Failed to add tag to torrent:', error)
      return false
    }
  }

  /**
   * 为种子移除标签
   * @param {string} hash - 种子哈希
   * @param {string} tag - 标签名称
   * @returns {Promise<boolean>}
   */
  async removeTagFromTorrent(hash, tag) {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/torrents/removeTags`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: `hashes=${hash}&tags=${encodeURIComponent(tag)}`
      })
      if (!this._checkResponse(response)) return false
      return response.ok
    } catch (error) {
      console.error('Failed to remove tag from torrent:', error)
      return false
    }
  }

  /**
   * 获取服务器偏好设置
   * @returns {Promise<Object>}
   */
  async getPreferences() {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/app/preferences`, {
        headers: this._getHeaders()
      })
      if (!this._checkResponse(response)) return {}
      return await response.json()
    } catch (error) {
      console.error('Failed to get preferences:', error)
      return {}
    }
  }

  /**
   * 设置服务器偏好设置
   * @param {Object} prefs - 偏好设置对象
   * @returns {Promise<boolean>}
   */
  async setPreferences(prefs) {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/app/setPreferences`, {
        method: 'POST',
        headers: {
          ...this._getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prefs })
      })
      if (!this._checkResponse(response)) return false
      return response.ok
    } catch (error) {
      console.error('Failed to set preferences:', error)
      return false
    }
  }

  /**
   * 检查连接状态
   * @returns {Promise<boolean>}
   */
  async checkConnection() {
    try {
      const version = await this.getVersion()
      return version !== ''
    } catch (error) {
      return false
    }
  }

  /**
   * 处理 403 错误，跳转到登录页面
   */
  handle403Error() {
    // 清除过期的 SID
    this.sid = null
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('qb-webui-sid')
    }
    // 跳转到登录页面
    if (typeof window !== 'undefined' && window.location) {
      // 检查当前是否已经在登录页面，避免循环跳转
      const currentPath = window.location.pathname
      if (currentPath !== '/login' && !currentPath.endsWith('/login')) {
        window.location.href = '/login'
      }
    }
  }

  /**
   * 处理响应，检查 403 错误
   * @param {Response} response - fetch 响应
   * @returns {boolean} - 是否应该继续处理
   */
  _checkResponse(response) {
    if (response.status === 403) {
      this.handle403Error()
      return false
    }
    return true
  }

  /**
   * 获取主数据（支持同步）
   * @param {number} rid - 响应ID (0 表示全量更新)
   * @returns {Promise<Object>} 主数据对象
   */
  async getMainData(rid = 0) {
    try {
      const response = await fetch(`${this.baseUrl}${API_BASE}/sync/maindata?rid=${rid}`, {
        headers: this._getHeaders()
      })

      if (response.status === 403) {
        this.handle403Error()
        return null
      }

      if (!response.ok) {
        console.error('getMainData HTTP error:', response.status)
        return null
      }

      const data = await response.json()
      console.log('getMainData response:', { request_rid: rid, response_rid: data.rid, full_update: data.full_update, has_torrents: !!data.torrents })
      return data
    } catch (error) {
      console.error('getMainData error:', error)
      return null
    }
  }

  /**
   * 开始轮询主数据
   * @param {Function} callback - 数据更新回调函数
   * @param {number} interval - 轮询间隔（毫秒，默认1000）
   */
  startPolling(callback, interval = 3000) {
    this.pollingCallback = callback
    // Only reset rid to 0 if this is the first time polling
    // This preserves the rid across component remounts for incremental updates
    if (this.currentRid === undefined || this.currentRid === null) {
      this.currentRid = 0
    }
    this.isPolling = true

    const poll = async () => {
      if (!this.isPolling) return

      try {
        console.log('Polling with rid:', this.currentRid)
        const data = await this.getMainData(this.currentRid)
        if (data && this.pollingCallback) {
          console.log('Received data with rid:', data.rid, 'full_update:', data.full_update)
          // Use the response rid for the NEXT request
          // This ensures we get incremental updates from the server
          this.currentRid = data.rid
          this.pollingCallback(data)
        } else if (data === null) {
          console.warn('getMainData returned null, skipping update')
          // Reset rid to 0 on error to get full update next time
          this.currentRid = 0
        }
      } catch (error) {
        console.error('Polling error:', error)
        // Reset rid to 0 on error to get full update next time
        this.currentRid = 0
      }

      if (this.isPolling) {
        setTimeout(poll, interval)
      }
    }

    // 开始初始轮询
    poll()
  }

  /**
   * 停止轮询
   */
  stopPolling() {
    this.isPolling = false
    this.pollingCallback = null
  }

  /**
   * 获取服务器状态摘要
   * @returns {Promise<Object>}
   */
  async getServerState() {
    try {
      const [transferInfo, version] = await Promise.all([
        this.getTransferInfo(),
        this.getVersion()
      ])
      return {
        version,
        ...transferInfo,
        connected: true
      }
    } catch (error) {
      console.error('Failed to get server state:', error)
      return { connected: false }
    }
  }

  _getHeaders() {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    // 在代理模式下，浏览器会自动处理 Cookie
    // 如果 SID 是 'logged-in'，说明我们无法提取具体的 SID，依赖浏览器自动处理
    if (this.sid && this.sid !== 'logged-in') {
      headers['Cookie'] = `SID=${this.sid}`
    }
    return headers
  }
}

export default new QBittorrentAPI()
