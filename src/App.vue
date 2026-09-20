<template>
  <!-- 路由出口，所有子页面都会通过这里渲染 -->
  <router-view />
</template>

<script setup lang="ts">
// 这里不需要引入任何旧组件
</script>

<style>
/* 重置基础样式 */
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>