class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        // 获取保存的主题设置
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.classList.toggle('light-theme', savedTheme === 'light');
        }

        // 绑定所有主题切换按钮
        this.bindThemeToggles();

        // 监听DOM变化，为新添加的主题切换按钮绑定事件
        this.observeDOM();
    }

    bindThemeToggles() {
        const themeToggles = document.querySelectorAll('.theme-toggle');
        themeToggles.forEach(toggle => this.bindThemeToggle(toggle));
    }

    bindThemeToggle(toggle) {
        // 检查是否已经绑定过事件
        if (toggle.dataset.themeBound) return;

        // 设置初始图标
        const icon = toggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-sun', document.body.classList.contains('light-theme'));
            icon.classList.toggle('fa-moon', !document.body.classList.contains('light-theme'));
        }

        // 绑定点击事件
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            
            // 更新所有主题切换按钮的图标
            document.querySelectorAll('.theme-toggle i').forEach(icon => {
                icon.classList.toggle('fa-sun');
                icon.classList.toggle('fa-moon');
            });

            // 保存主题设置
            const isDarkTheme = !document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        });

        // 标记已绑定
        toggle.dataset.themeBound = 'true';
    }

    observeDOM() {
        // 创建 MutationObserver 来监听 DOM 变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // 元素节点
                        const themeToggles = node.classList?.contains('theme-toggle') ? 
                            [node] : 
                            node.querySelectorAll?.('.theme-toggle') || [];
                        
                        themeToggles.forEach(toggle => this.bindThemeToggle(toggle));
                    }
                });
            });
        });

        // 开始观察整个文档
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// 初始化主题管理器
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
}); 