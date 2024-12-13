// 检查登录状态
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // 如果未登录，立即显示登录模态框
    if (!currentUser) {
        // 强制显示登录模态框
        if (window.authModal) {
            window.authModal.showModal('login');
        } else {
            // 如果 authModal 还未初始化，等待一下再试
            setTimeout(() => {
                window.authModal?.showModal('login');
            }, 100);
        }
    }
    
    const loginButtons = document.querySelectorAll('.auth-btn.login, .auth-btn.signup');
    const userInfo = document.querySelector('.user-info');
    const loginOverlay = document.querySelector('.login-overlay');
    const chatContainer = document.querySelector('.chat-container');
    const chatToggle = document.querySelector('.chat-toggle');
    const projectsSection = document.querySelector('#projects');
    const mainContent = document.querySelector('.main-content');
    const heroContent = document.querySelector('.hero-content');
    
    if (!currentUser) {
        // 未登录状态
        document.body.classList.add('not-logged-in');
        
        // 模糊所有内容区域
        [chatContainer, projectsSection, mainContent, heroContent].forEach(element => {
            if (element) {
                element.style.filter = 'blur(4px)';
                element.style.pointerEvents = 'none';
            }
        });
        
        // 隐藏聊天按钮
        if (chatToggle) chatToggle.style.display = 'none';
        
        // 显示登录提示遮罩
        if (loginOverlay) loginOverlay.style.display = 'flex';
        
        // 显示登录按钮
        loginButtons.forEach(btn => btn.style.display = 'inline-block');
        if (userInfo) userInfo.style.display = 'none';
        
        // 禁用所有链接和按钮
        document.querySelectorAll('a, button:not(.auth-btn):not(.auth-submit)').forEach(element => {
            element.style.pointerEvents = 'none';
        });
        
        // 禁止页面滚动
        document.body.style.overflow = 'hidden';
    } else {
        // 已登录状态
        document.body.classList.remove('not-logged-in');
        document.body.style.overflow = '';
        
        // 恢复所有内容区域
        [chatContainer, projectsSection, mainContent, heroContent].forEach(element => {
            if (element) {
                element.style.filter = 'none';
                element.style.pointerEvents = 'auto';
            }
        });
        
        // 显示聊天按钮
        if (chatToggle) chatToggle.style.display = 'block';
        
        // 隐藏登录提示遮罩
        if (loginOverlay) loginOverlay.style.display = 'none';
        
        // 显示用户信息
        loginButtons.forEach(btn => btn.style.display = 'none');
        if (userInfo) {
            userInfo.style.display = 'flex';
            userInfo.querySelector('.username').textContent = currentUser.username;
        }
        
        // 恢复所有链接和按钮
        document.querySelectorAll('a, button').forEach(element => {
            element.style.pointerEvents = 'auto';
        });
    }
}

// 确保在 DOM 加载完成后立即检查登录状态
document.addEventListener('DOMContentLoaded', () => {
    // 立即检查登录状态
    checkLoginStatus();
    
    // 添加登录按钮点击事件
    const loginButtons = document.querySelectorAll('.auth-btn.login');
    loginButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            window.authModal.showModal('login');
        });
    });
});

// 监听存储变化
window.addEventListener('storage', (e) => {
    if (e.key === 'currentUser') {
        checkLoginStatus();
    }
});

// 退出登录
document.querySelector('.logout')?.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    location.reload();
}); 