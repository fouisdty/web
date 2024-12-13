document.addEventListener('DOMContentLoaded', function() {
    // 主题切换
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        const icon = themeToggle.querySelector('i');
        if (body.classList.contains('light-theme')) {
            icon.className = 'fas fa-moon';
        } else {
            icon.className = 'fas fa-sun';
        }
    });

    // AI 助手对话功能
    const chatWidget = document.getElementById('chatWidget');
    const chatToggle = document.querySelector('.chat-toggle');
    const closeChat = document.querySelector('.close-chat');
    const sendMessage = document.querySelector('.send-message');
    const chatInput = document.querySelector('.chat-input textarea');
    const chatMessages = document.querySelector('.chat-messages');
    const ctaButton = document.querySelector('.cta-button');

    function toggleChat() {
        const isVisible = chatWidget.style.display === 'flex';
        chatWidget.style.display = isVisible ? 'none' : 'flex';
    }

    chatToggle.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', toggleChat);
    ctaButton.addEventListener('click', () => {
        chatWidget.style.display = 'flex';
    });

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        
        // 支持 Markdown 渲染
        const renderedContent = marked.parse(content);
        messageDiv.innerHTML = renderedContent;

        // 代码高亮
        messageDiv.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendMessage.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatInput.value = '';
            
            // 模拟 AI 回复
            setTimeout(() => {
                addMessage('我是 AI 助手，很高兴为您服务！');
            }, 1000);
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage.click();
        }
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 轮播功能
    function initCarousel() {
        const carousel = document.querySelector('.carousel');
        const items = carousel.querySelectorAll('.carousel-item');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        let currentIndex = 0;
        
        // 自动播放间隔时间（毫秒）
        const autoPlayInterval = 5000;
        
        function showSlide(index) {
            items.forEach(item => item.classList.remove('active'));
            items[index].classList.add('active');
        }
        
        // 添加按钮点击事件
        prevBtn.addEventListener('click', () => {
            clearInterval(autoPlayTimer);
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            showSlide(currentIndex);
        });
        
        nextBtn.addEventListener('click', () => {
            clearInterval(autoPlayTimer);
            currentIndex = (currentIndex + 1) % items.length;
            showSlide(currentIndex);
        });
        
        // 自动播放
        let autoPlayTimer = setInterval(() => {
            currentIndex = (currentIndex + 1) % items.length;
            showSlide(currentIndex);
        }, autoPlayInterval);
    }

    // 启动轮播
    initCarousel();

    // 连接 AI 助手介绍卡片的开始对话按钮
    document.querySelector('.start-chat').addEventListener('click', () => {
        document.getElementById('chatWidget').style.display = 'flex';
    });

    // 视频播放控制
    const video = document.getElementById('demoVideo');
    const playBtn = document.querySelector('.play-btn');
    
    playBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    video.addEventListener('ended', () => {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    });

    // 导航链接激活状态管理
    function updateActiveNav() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        // 获取当前滚动位置
        const scrollPosition = window.scrollY;
        
        // 检查每个区块的位置
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // 考虑导航栏高度
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // 移除所有激活状态
                navLinks.forEach(link => link.classList.remove('active'));
                
                // 添加当前区块对应的导航链接激活状态
                const correspondingLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
        
        // 如果在顶部，激活首页
        if (scrollPosition < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            document.querySelector('.nav-links a[href="#home"]').classList.add('active');
        }
    }

    // 监听滚动事件
    window.addEventListener('scroll', updateActiveNav);
    
    // 初始化时调用一次
    updateActiveNav();
}); 