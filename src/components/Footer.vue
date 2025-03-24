<!-- src/components/Footer.vue -->
<template>
    <footer class="footer">
        <nav class="nav-container">
            <button class="nav-item" :class="{ active: isRouteActive('home') }" @click="navigate('home')">
                <i class="fa-solid fa-house"></i>
                <span class="nav-text">首頁</span>
            </button>

            <button class="nav-item" :class="{ active: isRouteActive('points') }" @click="navigate('points')">
                <i class="fa-brands fa-product-hunt"></i>
                <span class="nav-text">點數</span>
            </button>

            <button class="nav-item" :class="{ active: isRouteActive('barcode') }" @click="navigate('barcode')">
                <i class="fa-solid fa-qrcode"></i>
                <span class="nav-text">卡號</span>
            </button>

            <button class="nav-item" :class="{ active: isRouteActive('coupons') }" @click="navigate('coupons')">
                <i class="fa-solid fa-ticket"></i>
                <span class="nav-text">票券</span>
            </button>

            <button class="nav-item" :class="{ active: isRouteActive('profile') }" @click="navigate('profile')">
                <i class="fa-regular fa-user"></i>
                <span class="nav-text">會員</span>
            </button>
        </nav>
    </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import '@fortawesome/fontawesome-free/css/all.css'

// 使用 Vue Router
const router = useRouter()
const route = useRoute()
const currentRoute = ref('home')

// 同步當前路由
onMounted(() => {
    updateCurrentRoute()
    // 監聽路由變化
    routeWatch()
})

const routeWatch = () => {
    router.afterEach(() => {
        updateCurrentRoute()
    })
}

/**
 * 更新當前路由狀態
 * 根據路徑判斷當前所在頁面
 */
const updateCurrentRoute = () => {
    const pathParts = route.path.split('/')

    // 如果是根路徑，則為首頁
    if (route.path === '/') {
        currentRoute.value = 'home'
        return
    }

    // 取得路徑的第一個部分作為主要路由
    const mainPath = pathParts[1] || 'home'

    // 處理特殊路由映射
    if (mainPath === 'members') {
        // 會員相關路由
        const subPath = pathParts[2]
        if (subPath === 'barcode') {
            currentRoute.value = 'barcode'
        } else if (subPath === 'profile') {
            currentRoute.value = 'profile'
        }
    } else if (mainPath === 'points') {
        currentRoute.value = 'points'
    } else if (mainPath === 'coupons') {
        currentRoute.value = 'coupons'
    } else if (mainPath === 'brands' || mainPath === 'stores') {
        // 品牌詳情頁和門市詳情頁保持首頁活躍
        currentRoute.value = 'home'
    } else {
        currentRoute.value = mainPath
    }
}

/**
 * 判斷指定路由是否為活躍狀態
 * @param {string} routeName - 路由名稱
 * @returns {boolean} - 是否活躍
 */
const isRouteActive = (routeName) => {
    return currentRoute.value === routeName
}

/**
 * 頁面導航
 * @param {string} path - 導航目標路徑
 */
const navigate = (path) => {
    // 根據不同路由進行跳轉
    const routes = {
        'home': '/',
        'points': '/points',
        'barcode': '/members/barcode',
        'coupons': '/coupons',
        'profile': '/members/profile'
    }
    router.push(routes[path])
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/main' as *;

.footer {
    background-color: var(--white);
    border-top: 1px solid var(--border-disabled);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    padding-bottom: env(safe-area-inset-bottom, 0);
}

.nav-container {
    max-width: 768px;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    padding: $spacing-sm 0;
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-sm;
    min-width: 56px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--nav-text);
    transition: all 0.3s ease;
}

.nav-item.active {
    color: var(--white);
    background-color: var(--primary);
    border-radius: 100px;
    width: 60px;
    height: 60px;
}

.nav-item:hover {
    color: var(--primary);
}

.nav-item.active:hover {
    color: var(--white);
}

.fa-solid,
.fa-regular,
.fa-brands {
    font-size: 1.5rem;
}

.nav-text {
    font-size: var(--font-size-note);
}

@supports (padding-bottom: env(safe-area-inset-bottom)) {
    .footer {
        padding-bottom: env(safe-area-inset-bottom);
    }
}
</style>
