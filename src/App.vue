<template>
  <div id="app">
    <el-container class="layout-container">
      <el-aside width="220px" class="sidebar">
        <div class="logo">
          <h2>QB-WebUI</h2>
        </div>
        <el-menu
          default-active="1"
          class="el-menu-vertical"
          router
          :default-openeds="openedMenus"
        >
          <el-sub-menu index="torrents">
            <template #title>
              <el-icon><List /></el-icon>
              <span>任务列表</span>
            </template>
            <el-menu-item index="/torrents/all">
              <el-icon><Tickets /></el-icon>
              <span>全部</span>
            </el-menu-item>
            <el-menu-item index="/torrents/downloading">
              <el-icon><Download /></el-icon>
              <span>下载中</span>
            </el-menu-item>
            <el-menu-item index="/torrents/completed">
              <el-icon><Finished /></el-icon>
              <span>已完成</span>
            </el-menu-item>
            <el-menu-item index="/torrents/paused">
              <el-icon><VideoPause /></el-icon>
              <span>暂停</span>
            </el-menu-item>
            <el-menu-item index="/torrents/seeding">
              <el-icon><Upload /></el-icon>
              <span>做种</span>
            </el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="categories">
            <template #title>
              <el-icon><Folder /></el-icon>
              <span>分类</span>
            </template>
            <el-menu-item index="/categories/all">
              <el-icon><Folder /></el-icon>
              <span>全部分类</span>
            </el-menu-item>
            <el-menu-item index="/categories/movie">
              <el-icon><Film /></el-icon>
              <span>电影</span>
            </el-menu-item>
            <el-menu-item index="/categories/tv">
              <el-icon><VideoCamera /></el-icon>
              <span>电视剧</span>
            </el-menu-item>
            <el-menu-item index="/categories/anime">
              <el-icon><Collection /></el-icon>
              <span>动漫</span>
            </el-menu-item>
            <el-menu-item index="/categories/music">
              <el-icon><Headset /></el-icon>
              <span>音乐</span>
            </el-menu-item>
            <el-menu-item index="/categories/software">
              <el-icon><Monitor /></el-icon>
              <span>软件</span>
            </el-menu-item>
            <el-menu-item index="/categories/document">
              <el-icon><Document /></el-icon>
              <span>文档</span>
            </el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="tags">
            <template #title>
              <el-icon><Collection /></el-icon>
              <span>标签</span>
            </template>
            <el-menu-item index="/tags/all">
              <el-icon><Collection /></el-icon>
              <span>全部标签</span>
            </el-menu-item>
            <el-menu-item index="/tags/high-def">
              <el-icon><Monitor /></el-icon>
              <span>高清</span>
            </el-menu-item>
            <el-menu-item index="/tags/4k">
              <el-icon><VideoCamera /></el-icon>
              <span>4K</span>
            </el-menu-item>
            <el-menu-item index="/tags/chinese">
              <el-icon><ChatLineRound /></el-icon>
              <span>国语</span>
            </el-menu-item>
            <el-menu-item index="/tags/subtitle">
              <el-icon><Document /></el-icon>
              <span>中字</span>
            </el-menu-item>
            <el-menu-item index="/tags/lossless">
              <el-icon><Headset /></el-icon>
              <span>无损</span>
            </el-menu-item>
            <el-menu-item index="/tags/favorite">
              <el-icon><Star /></el-icon>
              <span>收藏</span>
            </el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <span>设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div class="header-content">
            <span class="title">qBittorrent Web UI</span>
            <div class="actions">
              <el-button type="primary" size="small" @click="addTorrent">
                <el-icon><Plus /></el-icon>
                添加任务
              </el-button>
            </div>
          </div>
        </el-header>
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  List,
  Tickets,
  Download,
  Finished,
  VideoPause,
  Upload,
  Setting,
  Plus,
  Folder,
  Film,
  Headset,
  Monitor,
  Document,
  Collection,
  VideoCamera,
  ChatLineRound,
  Star
} from '@element-plus/icons-vue'

const router = useRouter()
const openedMenus = ref(['torrents', 'categories', 'tags'])

const addTorrent = () => {
  // 添加种子的逻辑
  console.log('添加种子')
}

onMounted(() => {
  // 确保菜单默认展开
  openedMenus.value = ['torrents', 'categories', 'tags']
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  width: 100%;
}

.layout-container {
  height: 100vh;
}

.sidebar {
  background-color: var(--sidebar-background);
  color: var(--text-secondary);
  box-shadow: var(--shadow-md);
  border-right: 1px solid #e6e6e6;
  position: relative;
}

.sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg,
    transparent 0%,
    rgba(59, 130, 246, 0.5) 20%,
    rgba(139, 92, 246, 0.5) 50%,
    rgba(59, 130, 246, 0.5) 80%,
    transparent 100%);
}

.logo {
  padding: var(--spacing-lg);
  text-align: center;
  background-color: var(--card-background);
  border-bottom: 1px solid #e6e6e6;
  position: relative;
}

.logo h2 {
  color: var(--text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  letter-spacing: 2px;
}

.el-menu-vertical {
  border-right: none;
  background: transparent;
  padding: var(--spacing-sm) 0;
}

.el-menu-vertical .el-sub-menu__title {
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  transition: all 0.3s ease;
  position: relative;
  padding: 0 var(--spacing-md) !important;
  margin: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  background: transparent;
}

.el-menu-vertical .el-sub-menu__title:hover {
  background-color: var(--background-color);
  color: var(--primary-color);
}

.el-menu-vertical .el-sub-menu__title.is-active {
  background-color: rgba(64, 158, 255, 0.1);
  color: var(--primary-color);
  font-weight: var(--font-weight-bold);
}

.el-menu-vertical .el-menu-item {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all 0.3s ease;
  margin: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  padding: 0 var(--spacing-md) !important;
  background: transparent;
}

.el-menu-vertical .el-menu-item:hover {
  background-color: var(--background-color);
  color: var(--text-primary);
}

.el-menu-vertical .el-menu-item.is-active {
  background-color: rgba(64, 158, 255, 0.1);
  color: var(--primary-color);
  font-weight: var(--font-weight-bold);
}

.el-menu-vertical .el-sub-menu .el-menu-item {
  padding-left: 45px !important;
  background: transparent !important;
  color: var(--text-secondary) !important;
  border-radius: var(--border-radius-sm) !important;
  margin: var(--spacing-xs) var(--spacing-lg) !important;
  font-size: var(--font-size-xs) !important;
  font-weight: var(--font-weight-medium) !important;
  transition: all 0.3s ease;
}


.el-menu-vertical .el-sub-menu .el-menu-item:hover {
  color: var(--text-primary) !important;
  background-color: var(--background-color) !important;
}

.el-menu-vertical .el-sub-menu .el-menu-item.is-active {
  background-color: rgba(64, 158, 255, 0.1) !important;
  color: var(--primary-color) !important;
  font-weight: var(--font-weight-bold);
}

.el-menu-vertical .el-icon {
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.el-menu-vertical .el-menu-item:hover .el-icon,
.el-menu-vertical .el-sub-menu__title:hover .el-icon {
  color: var(--primary-color);
}

.el-menu-vertical .el-menu-item.is-active .el-icon,
.el-menu-vertical .el-sub-menu__title.is-active .el-icon {
  color: var(--primary-color);
}


.header {
  background-color: var(--card-background);
  border-bottom: 1px solid #e6e6e6;
  padding: 0 var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.main-content {
  background-color: var(--background-color);
  padding: var(--spacing-md);
  position: relative;
}

</style>
