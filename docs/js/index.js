/**
 * 主要 JavaScript 檔案
 */
document.addEventListener('DOMContentLoaded', function () {
    // 初始化首頁輪播
    swiperIndexSplish();
    // 初始化統計圖表輪播
    initStatsSwiper();
    // 初始化所有圖表
    initCharts();
});

/**
 * 初始化首頁主輪播
 */
function swiperIndexSplish() {
    let swiper = new Swiper(".section_home_slider .swiper", {
        loop: true,
        loopedSlides: 2,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            stopOnLastSlide: false,
        },
        pagination: {
            el: ".slider_pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".slider_button-next",
            prevEl: ".slider_button-prev",
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        }
    });
}

/**
 * 初始化統計圖表輪播
 */
function initStatsSwiper() {
    let statsSwiper = new Swiper(".stats-swiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".slider_pagination",
            clickable: true,
        },
        pagination: {
            el: ".slider_pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".slider_button-next",
            prevEl: ".slider_button-prev",
        },
        // 當輪播切換時重新渲染圖表，避免尺寸問題
        on: {
            slideChangeTransitionEnd: function () {
                window.dispatchEvent(new Event('resize'));
            }
        }
    });
}

/**
 * 初始化所有圖表
 */
function initCharts() {
    // 設置共用的圖表選項
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 12,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                titleColor: '#333',
                bodyColor: '#666',
                borderColor: '#ddd',
                borderWidth: 1
            }
        }
    };

    // 1. 能源使用效率統計 - 折線圖
    const efficiencyCtx = document.getElementById('efficiencyChart').getContext('2d');
    new Chart(efficiencyCtx, {
        type: 'line',
        data: {
            labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
            datasets: [{
                label: '能源使用效率指數',
                data: [65, 72, 78, 85, 90, 95],
                borderColor: '#1a5aa0',
                backgroundColor: 'rgba(26, 90, 160, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '效率指數'
                    }
                }
            }
        }
    });

    // 2. 節能產品市佔率 - 圓餅圖
    const marketShareCtx = document.getElementById('marketShareChart').getContext('2d');
    new Chart(marketShareCtx, {
        type: 'pie',
        data: {
            labels: ['一級能效', '二級能效', '三級能效', '其他'],
            datasets: [{
                data: [45, 30, 15, 10],
                backgroundColor: [
                    '#1a5aa0',
                    '#4285F4',
                    '#80b1fb',
                    '#d0e0fc'
                ],
                borderWidth: 1
            }]
        },
        options: commonOptions
    });

    // 3. 年度能源節省量 - 柱狀圖
    const energySavingCtx = document.getElementById('energySavingChart').getContext('2d');
    new Chart(energySavingCtx, {
        type: 'bar',
        data: {
            labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
            datasets: [{
                label: '節省電力 (百萬度)',
                data: [120, 150, 180, 210, 250, 290],
                backgroundColor: '#0D6389'
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '百萬度'
                    }
                }
            }
        }
    });

    // 4. 各類產品效率比較 - 雷達圖
    const productComparisonCtx = document.getElementById('productComparisonChart').getContext('2d');
    new Chart(productComparisonCtx, {
        type: 'radar',
        data: {
            labels: ['冷氣機', '電冰箱', '洗衣機', '電視機', '照明設備', '電熱水器'],
            datasets: [{
                label: '2023年',
                data: [85, 90, 78, 82, 95, 70],
                backgroundColor: 'rgba(26, 90, 160, 0.2)',
                borderColor: '#1a5aa0',
                borderWidth: 2,
                pointBackgroundColor: '#1a5aa0'
            }, {
                label: '2024年',
                data: [90, 92, 85, 88, 98, 75],
                backgroundColor: 'rgba(13, 99, 137, 0.2)',
                borderColor: '#0D6389',
                borderWidth: 2,
                pointBackgroundColor: '#0D6389'
            }]
        },
        options: commonOptions
    });

    // 5. 碳排放減少量 - 區域圖
    const carbonReductionCtx = document.getElementById('carbonReductionChart').getContext('2d');
    new Chart(carbonReductionCtx, {
        type: 'line',
        data: {
            labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
            datasets: [{
                label: '碳排放減少量 (萬噸)',
                data: [50, 65, 80, 95, 115, 140],
                borderColor: '#17F5FF',
                backgroundColor: 'rgba(23, 245, 255, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '萬噸'
                    }
                }
            }
        }
    });

    // 6. 能源標章申請數量 - 堆疊柱狀圖
    const labelApplicationCtx = document.getElementById('labelApplicationChart').getContext('2d');
    new Chart(labelApplicationCtx, {
        type: 'bar',
        data: {
            labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
            datasets: [{
                label: '一級能效',
                data: [300, 350, 400, 450, 520, 580],
                backgroundColor: '#1a5aa0'
            }, {
                label: '二級能效',
                data: [200, 220, 240, 260, 280, 300],
                backgroundColor: '#4285F4'
            }, {
                label: '三級能效',
                data: [100, 120, 130, 140, 150, 160],
                backgroundColor: '#80b1fb'
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '申請數量'
                    }
                }
            }
        }
    });
}
