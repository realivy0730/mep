import { createRouter, createWebHistory } from 'vue-router'

/**
 * @description 路由配置檔案
 * @returns Vue Router 實例
 */
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Index',
            // 直接在路由中導入元件
            component: () => import('@/views/Index.vue')
        },
        {
            path: '/brands/:brand',
            name: 'Brands',
            // 直接在路由中導入元件
            component: () => import('@/views/brands/Show.vue')
        },
        {
            path: '/stores/:store',
            name: 'Stores',
            // 直接在路由中導入元件
            component: () => import('@/views/stores/Show.vue')
        },
        {
            path: '/members/barcode',
            name: 'barcode',
            // 直接在路由中導入元件
            component: () => import('@/views/barcodes/Show.vue')
        },
        {
            path: '/members/profile',
            name: 'MemberProfile',
            // 會員個人資料頁面
            component: () => import('@/views/members/View.vue')
        },
        {
            path: '/members/profile/edit',
            name: 'MemberProfileEdit',
            // 會員個人資料編輯頁面
            component: () => import('@/views/members/Edit.vue')
        },
        {
            path: '/points',
            name: 'Points',
            // 直接在路由中導入元件
            component: () => import('@/views/points/Index.vue')
        },
        {
            path: '/points/show/:id',
            name: 'PointsShow',
            // 點數兌換項目詳情頁面
            component: () => import('@/views/points/Show.vue')
        },
        {
            path: '/points/info',
            name: 'PointsInfo',
            // 直接在路由中導入元件
            component: () => import('@/views/points/Info.vue')
        },
        {
            path: '/levels',
            name: 'MemberLevels',
            // 直接在路由中導入元件
            component: () => import('@/views/levels/Index.vue')
        },
        {
            path: '/coupons',
            name: 'Coupons',
            // 直接在路由中導入元件
            component: () => import('@/views/coupons/Index.vue')
        },
        {
            path: '/coupons/:id',
            name: 'CouponDetail',
            // 直接在路由中導入元件
            component: () => import('@/views/coupons/Show.vue')
        },
        {
            path: '/data',
            name: 'Data',
            // 資料展示頁面
            component: () => import('@/views/DataView.vue')
        },
        // 會員條款相關路由
        {
            path: '/terms',
            name: 'Terms',
            // 條款首頁
            component: () => import('@/views/terms/TermsIndex.vue')
        },
        {
            path: '/terms/member',
            name: 'MemberTerms',
            // 會員條款頁面
            component: () => import('@/views/terms/MemberTerms.vue')
        },
        {
            path: '/terms/privacy',
            name: 'PrivacyPolicy',
            // 隱私權政策頁面
            component: () => import('@/views/terms/PrivacyPolicy.vue')
        },
        // 更新認證相關路由
        {
            path: '/auth',
            component: () => import('@/layouts/AuthLayout.vue'),
            children: [
                {
                    path: '',
                    name: 'Login',
                    component: () => import('@/views/auth/Login.vue'),
                    meta: { requiresGuest: true }
                },
                {
                    path: 'phone-login',
                    name: 'PhoneLogin',
                    component: () => import('@/views/auth/PhoneLogin.vue'),
                    meta: { requiresGuest: true }
                },
                {
                    path: 'verify',
                    name: 'verification',
                    component: () => import('@/views/auth/VerificationView.vue'),
                    meta: {
                        title: '驗證手機號碼'
                    }
                },
            ]
        },

        // 保留舊路由作為重定向，避免潛在的破壞性變更
        {
            path: '/login',
            redirect: '/auth'
        },
        {
            path: '/phone-login',
            redirect: '/auth/phone-login'
        }

    ]
})

export default router
