class AuthModal {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || {};
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.init();
    }

    init() {
        this.createModal();
        this.bindEvents();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-container">
                <div class="auth-header">
                    <h2>登录</h2>
                    <p>请输入账号密码</p>
                </div>
                <form class="auth-form" onsubmit="return false;">
                    <div class="form-group">
                        <input type="text" id="email" placeholder="用户名" required>
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="form-group">
                        <input type="password" id="password" placeholder="密码" required>
                        <i class="fas fa-lock"></i>
                    </div>
                    <button type="submit" class="auth-submit">登录</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        this.modal = modal;
    }

    bindEvents() {
        // 绑定表单提交事件
        const form = this.modal.querySelector('.auth-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = this.modal.querySelector('#email').value;
            const password = this.modal.querySelector('#password').value;
            this.login(email, password);
        });

        // 点击模态框外部关闭
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                // 如果未登录，不允许关闭模态框
                if (!this.currentUser) return;
                this.hideModal();
            }
        });
    }

    showModal(mode = 'login') {
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    hideModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    login(email, password) {
        // 简化登录逻辑，只验证管理员账号
        if (email === 'admin' && password === '123456') {
            this.currentUser = {
                email: 'admin',
                username: 'admin',
                avatar: 'images/default-avatar.jpg'
            };
            
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.hideModal();
            this.updateUIAfterLogin();
            this.showToast('登录成功！');
            
            // 刷新页面状态
            window.location.reload();
        } else {
            this.showToast('用户名或密码错误！', 'error');
        }
    }

    updateUIAfterLogin() {
        const authBtns = document.querySelector('.nav-auth');
        authBtns.innerHTML = `
            <div class="user-info" style="display: flex; align-items: center; gap: 8px;">
                <div class="user-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <span class="username">${this.currentUser.username}</span>
                <button class="auth-btn logout">退出</button>
            </div>
            <button class="theme-toggle">
                <i class="fas ${document.body.classList.contains('light-theme') ? 'fa-sun' : 'fa-moon'}"></i>
            </button>
        `;

        // 绑定退出按钮事件
        const logoutBtn = authBtns.querySelector('.logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// 初始化并设为全局变量
window.authModal = new AuthModal(); 