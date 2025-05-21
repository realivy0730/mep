document.addEventListener('DOMContentLoaded', function () {
    // 設定日期選擇器的配置選項
    const dateConfig = {
        locale: 'zh-tw',                      // 使用繁體中文
        dateFormat: 'Y/m/d',                  // 日期格式：年/月/日
        disableMobile: false,                 // 在移動設備上也使用日曆
        allowInput: true,                     // 允許手動輸入
        static: true,                         // 防止在某些情況下的位置問題
        nextArrow: '<i class="fa-solid fa-chevron-right"></i>',  // 自定義箭頭圖標
        prevArrow: '<i class="fa-solid fa-chevron-left"></i>'    // 自定義箭頭圖標
    };

    // 初始化開始日期選擇器
    const startDatePicker = flatpickr('.date-start', {
        ...dateConfig,
        onChange: function (selectedDates, dateStr) {
            // 當開始日期變更時，更新結束日期選擇器的最小日期
            if (selectedDates[0]) {
                endDatePicker.set('minDate', selectedDates[0]);
            }
        }
    });

    // 初始化結束日期選擇器
    const endDatePicker = flatpickr('.date-end', {
        ...dateConfig,
        onChange: function (selectedDates, dateStr) {
            // 當結束日期變更時，更新開始日期選擇器的最大日期
            if (selectedDates[0]) {
                startDatePicker.set('maxDate', selectedDates[0]);
            }
        }
    });

    // 點擊日曆圖標也能打開日期選擇器
    document.querySelectorAll('.date-icon').forEach(icon => {
        icon.addEventListener('click', function () {
            const input = this.previousElementSibling;
            if (input.classList.contains('date-start')) {
                startDatePicker.open();
            } else if (input.classList.contains('date-end')) {
                endDatePicker.open();
            }
        });
    });
});
