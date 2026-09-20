<template>
  <el-container class="layout-container">
    <!-- 左侧侧边栏 -->
    <el-aside width="240px">
      <div class="logo">R&D Copilot</div>
      <el-menu
        :default-active="$route.path"
        router
        background-color="#304156"
        text-color="rgba(255, 255, 255, 0.75)"
        active-text-color="#ffffff"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <span>效能数据看板</span>
        </el-menu-item>
        <el-menu-item index="/generator">
          <el-icon><Cpu /></el-icon>
          <span>AI 组件生成器</span>
        </el-menu-item>
        <el-menu-item index="/tester">
          <el-icon><Checked /></el-icon>
          <span>接口测试辅助</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶部导航 -->
      <el-header class="header-container">
        <div class="header-left">
          <span class="system-title">
            研发效能智能化平台
            <span class="tag-intern">实习自研项目</span>
          </span>
        </div>

        <!-- 新增：右侧用户区域与通知 -->
        <div class="header-right">
          <div class="notice-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8c8c8c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span class="dot"></span>
          </div>
          <div class="user-profile">
            <img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" alt="Avatar" class="avatar" />
            <span class="username">Admin</span>
          </div>
        </div>
      </el-header>

      <!-- 主内容区域 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { DataAnalysis, Cpu, Checked } from '@element-plus/icons-vue'
</script>

<style scoped>
.layout-container {
  height: 100vh;
}
.el-aside {
  background-color: #304156;
  border-right: 1px solid #2b3643;
}
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  background-color: #2b3643;
  letter-spacing: 0.5px;
}

/* 侧边菜单定制：解决未选中字体暗淡、高亮不够精致的问题 */
:deep(.el-menu) {
  border-right: none;
}
:deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  transition: all 0.2s ease;
}
:deep(.el-menu-item:hover) {
  background-color: #263445 !important;
  color: #fff !important;
}
/* 选中高亮状态 */
:deep(.el-menu-item.is-active) {
  background-color: #1890ff !important; /* 科技蓝高亮 */
  font-weight: 500;
  position: relative;
}
/* 选中时的左侧精致高亮边条 */
:deep(.el-menu-item.is-active::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #3498db;
}

/* 顶部 Header 精细化 */
.header-container {
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 60px;
}

.system-title {
  font-size: 15px;
  font-weight: 600;
  color: #262626;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 弱化处理实习项目便签 */
.tag-intern {
  font-size: 11px;
  font-weight: normal;
  color: #8c8c8c;
  background: #f5f5f5;
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

/* 右侧头像和通知中心布局 */
.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.notice-badge {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.notice-badge .dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 6px;
  height: 6px;
  background-color: #ff4d4f;
  border-radius: 50%;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #eee;
}

.username {
  font-size: 14px;
  color: #595959;
  font-weight: 500;
}

/* 主区域背景色稍微调淡，衬托白色卡片 */
.el-main {
  background-color: #f8f9fa;
  padding: 0; /* 内部 padding 让 dashboard/index.vue 自己的 24px 接管 */
}
</style>