<!-- src/layouts/AuthLayout.vue -->
<template>
    <div class="auth-layout">
        <router-view></router-view>
    </div>
</template>

<script setup>
// 這個布局元件用於提供登入相關頁面的共用布局
// 目前只是簡單包裝 router-view，未來可以添加共用的頁眉頁腳等
</script>

<style scoped lang="scss">
@use '@/assets/styles/main' as *;

.auth-layout {
    width: 100%;
    min-height: 100vh;
    background-color: var(--background-light);
}
</style>
