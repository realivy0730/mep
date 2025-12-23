/**
 * 主要 JavaScript 檔案
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM 載入完成');

    // 延遲初始化輪播，確保 DOM 完全載入
    setTimeout(function () {
        console.log('開始初始化輪播...');
        // 初始化首頁輪播
        initMainSwiper();
        // 初始化統計圖表輪播
        initStatsSwiper();
    }, 100);

    // 延遲初始化圖表，確保所有元素都載入完成
    setTimeout(function () {
        console.log('開始初始化圖表...');
        if (typeof echarts !== 'undefined') {
            initCharts();
        } else {
            console.error('ECharts 未載入');
        }
    }, 1000);
});

/**
 * 初始化首頁主輪播
 */
function initMainSwiper() {
    console.log('初始化主輪播...');
    const swiper = new Swiper('.full-width-slider', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        on: {
            slideChange: function () {
                // 動態切換背景
                const slider = document.querySelector('.section_home_slider');
                const slideIndex = this.realIndex + 1; // realIndex 從 0 開始，所以 +1

                // 移除所有背景類別
                slider.classList.remove('slide-1', 'slide-2', 'slide-3');
                // 添加當前背景類別
                slider.classList.add(`slide-${slideIndex}`);

                console.log(`切換到第 ${slideIndex} 張輪播，背景已更新`);
            }
        }
    });

    // 初始化時設定第一張背景
    const slider = document.querySelector('.section_home_slider');
    if (slider) {
        slider.classList.add('slide-1');
    }

    console.log('主輪播初始化完成:', swiper);
}

/**
 * 初始化統計圖表輪播
 */
function initStatsSwiper() {
    new Swiper('.stats-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
            el: '.stats-pagination',
            clickable: true,
        },
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
    console.log('開始初始化圖表...');

    // 檢查 ECharts 是否載入
    if (typeof echarts === 'undefined') {
        console.error('ECharts 未載入');
        return;
    }

    // 檢查 DOM 元素是否存在
    const chartElements = [
        'efficiencyChart', 'marketShareChart',
        'carbonReductionChart', 'labelApplicationChart'
    ];

    for (let id of chartElements) {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`找不到圖表容器: ${id}`);
            return;
        }
    }

    try {
        // 1. 能源使用效率統計 - 卡片式統計面板
        const efficiencyContainer = document.getElementById('efficiencyChart');
        efficiencyContainer.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: 100%; padding: 10px;">
                <div style="background: linear-gradient(135deg, #5b73e8, #4c63d2); color: white; border-radius: 15px; padding: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; box-shadow: 0 4px 15px rgba(91, 115, 232, 0.3);">
                    <div style="font-size: 14px; margin-bottom: 15px; opacity: 0.9;">113年有效登錄<br>廠商數量</div>
                    <div style="font-size: 30px; font-weight: bold; margin: 10px 0;">3499</div>
                </div>
                <div style="background: transparent; border: 3px solid #0D6389; border-radius: 15px; padding: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                    <div style="font-size: 14px; margin-bottom: 15px; color: #666;">有效登錄廠商<br>成長百分比</div>
                    <div style="font-size: 30px; font-weight: bold; margin: 10px 0; color: #333;">6%</div>
                </div>
                <div style="background: transparent; border: 3px solid  #0D6389; border-radius: 15px; padding: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                    <div style="font-size: 14px; margin-bottom: 15px; color: #666;">113年已獲准登錄<br>廠商家數</div>
                    <div style="font-size: 30px; font-weight: bold; margin: 10px 0; color: #333;">51</div>
                </div>
                <div style="background: linear-gradient(135deg, #5b73e8, #4c63d2); color: white; border-radius: 15px; padding: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; box-shadow: 0 4px 15px rgba(91, 115, 232, 0.3);">
                    <div style="font-size: 14px; margin-bottom: 15px; opacity: 0.9;">歷屆登錄廠商<br>家數成長</div>
                    <div style="font-size: 30px; font-weight: bold; margin: 10px 0;">50%</div>
                </div>
            </div>
        `;

        // 2. 節能產品市佔率 - 圓餅圖（各等級之空壓機登錄數量及占比）
        const marketShareChart = echarts.init(document.getElementById('marketShareChart'));
        const marketShareOption = {

            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}款 ({d}%)'
            },
            series: [{
                name: '空壓機登錄數量',
                type: 'pie',
                radius: ['0%', '65%'],
                center: ['50%', '50%'],
                data: [
                    { value: 990, name: '1級' },
                    { value: 81, name: '2級' },
                    { value: 107, name: '3級' }
                ],
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: function (params) {
                        return `{name|${params.name}/${params.value}款}\n{percent|${params.percent}%}`;
                    },
                    rich: {
                        name: {
                            fontSize: 16,
                            color: "rgba(0, 0, 0, 0.7)"
                        },
                        percent: {
                            fontSize: 25,
                            color: "#0D6389"
                        }
                    }
                },
                labelLine: {
                    show: true,
                    length: 20,
                    length2: 15,
                    lineStyle: {
                        color: '#666',
                        width: 1
                    }
                },
                color: ['#4a6fa5', '#6b5b95', '#8e7cc3'],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.3)'
                    }
                }
            }]
        };
        marketShareChart.setOption(marketShareOption);



        // 5. 已獲核准登錄廠商數與有效登錄數 - 組合圖表
        const carbonReductionChart = echarts.init(document.getElementById('carbonReductionChart'), null, { height: 350 });
        const carbonReductionOption = {
            title: {
                text: '已獲核准登錄廠商數與有效登錄數',
                subtext: '(106年～113年11月)',
                left: 'left',
                textStyle: {
                    fontSize: 16,
                    color: '#333'
                },
                subtextStyle: {
                    fontSize: 16,
                    color: '#114BAF'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: ['年份'],
                right: 'right'
            },
            grid: {
                left: '8%',
                right: '8%',
                bottom: '15%',
                top: '30%'
            },
            xAxis: {
                type: 'category',
                data: ['106', '107', '108', '109', '110', '111', '112', '113.11'],
                axisLine: {
                    lineStyle: {
                        color: '#ddd'
                    }
                }
            },
            yAxis: [{
                type: 'value',
                min: 0,
                max: 80,
                position: 'left',
                axisLine: {
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#f0f0f0'
                    }
                }
            }, {
                type: 'value',
                min: 0,
                max: 4000,
                position: 'right',
                axisLine: {
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                splitLine: {
                    show: false
                }
            }],
            series: [{
                name: '年份',
                type: 'bar',
                data: [24, 44, 46, 47, 47, 49, 50, 51],
                itemStyle: {
                    color: '#2E5F8A',
                    borderRadius: [4, 4, 0, 0]
                },
                label: {
                    show: true,
                    position: 'inside',
                    color: '#fff',
                    fontSize: 12
                }
            }, {
                name: '有效登錄數',
                type: 'line',
                yAxisIndex: 1,
                data: [2249, 2723, 2273, 2825, 3027, 3123, 3309, 3499],
                lineStyle: {
                    color: '#4A90E2',
                    width: 2
                },
                itemStyle: {
                    color: '#4A90E2'
                },
                symbol: 'circle',
                symbolSize: 6,
                label: {
                    show: true,
                    position: 'top',
                    color: '#333',
                    fontSize: 10
                }
            }]
        };
        carbonReductionChart.setOption(carbonReductionOption);

        // 6. 各等級之空壓機登錄數量及占比 - 環形圓餅圖
        const labelApplicationChart = echarts.init(document.getElementById('labelApplicationChart'));
        const labelApplicationOption = {

            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}款 ({d}%)'
            },
            legend: {
                show: false
            },

            series: [
                {
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['50%', '50%'],
                    avoidLabelOverlap: true,
                    label: {
                        show: true,
                        position: 'outside',
                        edgeDistance: '15%',
                        formatter: function (params) {
                            return `{name|${params.name}}\n{percent|${params.percent}%}`;
                        },
                        rich: {
                            name: {
                                fontSize: 14,
                                color: "rgba(0,0,0,0.7)"
                            },
                            percent: {
                                fontSize: 22,
                                color: "#0D6389",
                                fontWeight: "bold"
                            }
                        }
                    },
                    labelLine: {
                        show: true,
                        length: 15,
                        length2: 10
                    },
                    data: [
                        {
                            value: 990,
                            name: '1級',
                            itemStyle: {
                                color: '#4285F4'
                            }
                        },
                        {
                            value: 81,
                            name: '2級',
                            itemStyle: {
                                color: '#7A62CD'
                            }
                        },
                        {
                            value: 107,
                            name: '3級',
                            itemStyle: {
                                color: '#16F5FF'
                            }
                        }
                    ]
                }
            ]
        };
        labelApplicationChart.setOption(labelApplicationOption);

        // 響應式處理
        window.addEventListener('resize', function () {
            marketShareChart.resize();
            carbonReductionChart.resize();
            labelApplicationChart.resize();
        });

        console.log('所有圖表初始化完成');

    } catch (error) {
        console.error('圖表初始化失敗:', error);
    }
}
