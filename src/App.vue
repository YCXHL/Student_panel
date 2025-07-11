<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Cookies from 'js-cookie'
</script>

<template>
  <header class="top-bar">
    <div class="logo">智能教室管理系统--控制面板</div>
    <nav class="nav-links">
      <router-link class="nav-item" to="/">主页</router-link>
      <router-link class="nav-item" to="/TeachData">教学数据</router-link>
      <router-link class="nav-item" to="/login">登录</router-link>
      <router-link class="nav-item" to="/register">注册</router-link>
    </nav>
  </header>
  <RouterView />
</template>

<style scoped>
@import url(/src/assets/main.css);
</style>
