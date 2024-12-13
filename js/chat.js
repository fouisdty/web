class ChatWidget {
    constructor() {
        this.DASHSCOPE_API_KEY = 'sk-f2a7382aae2f4f5d97e7a66759eead76';
        this.API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
        this.init();
    }

    init() {
        // 获取DOM元素
        this.chatMessages = document.querySelector('.chat-messages');
        this.chatInput = document.querySelector('.chat-input textarea');
        this.sendButton = document.querySelector('.send-message');

        // 初始化消息历史
        this.messageHistory = [{
            role: "system",
            content: "You are a helpful assistant."
        }];

        // 添加超时控制
        this.timeout = 30000;
        this.maxRetries = 3;
        this.retryDelay = 1000;

        this.bindEvents();
        
        // 添加欢迎消息
        this.addMessage('你好！我是AI助手，很高兴为您服务。请问有什么我可以帮您的吗？', 'ai');
    }

    bindEvents() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // 禁用输入和发送按钮
        this.setInputState(false);

        // 添加用户消息到界面
        this.addMessage(message, 'user');
        this.chatInput.value = '';

        // 添加用户消息到历史
        this.messageHistory.push({
            role: "user",
            content: message
        });

        // 显示加载状态
        const loadingMessage = this.addLoadingMessage();

        try {
            const response = await this.callAIAPIWithRetry();
            
            loadingMessage.remove();

            if (response && response.choices && response.choices[0].message) {
                const aiMessage = response.choices[0].message.content;
                this.addMessage(aiMessage, 'ai');
                this.messageHistory.push({
                    role: "assistant",
                    content: aiMessage
                });
            }
        } catch (error) {
            console.error('API调用错误:', error);
            loadingMessage.remove();
            this.addMessage('抱歉，发生了一些错误，请稍后再试。', 'error');
        } finally {
            // 重新启用输入和发送��钮
            this.setInputState(true);
        }
    }

    async callAIAPIWithRetry(retryCount = 0) {
        try {
            // 创建超时 Promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('请求超时')), this.timeout);
            });

            // 创建 API 请求 Promise
            const fetchPromise = this.callAIAPI();

            // 使用 Promise.race 实现超时控制
            const response = await Promise.race([fetchPromise, timeoutPromise]);
            return response;

        } catch (error) {
            if (retryCount < this.maxRetries) {
                console.log(`重试第 ${retryCount + 1} 次`);
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                return this.callAIAPIWithRetry(retryCount + 1);
            }
            throw error;
        }
    }

    async callAIAPI() {
        const requestBody = {
            model: "qwen-plus",
            messages: this.messageHistory,
            // 添加一些参数来控制响应
            temperature: 0.7, // 控制响应的随机性
            max_tokens: 1000  // 限制响应长度
        };

        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.DASHSCOPE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API请求失败: ${errorData.error?.message || response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API调用错误:', error);
            throw error;
        }
    }

    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas ${type === 'user' ? 'fa-user' : 'fa-robot'}"></i>
                <p>${this.formatMessage(text)}</p>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        return messageDiv;
    }

    addLoadingMessage() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai-message loading';
        loadingDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-robot"></i>
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        this.chatMessages.appendChild(loadingDiv);
        this.scrollToBottom();
        return loadingDiv;
    }

    formatMessage(text) {
        // 转义HTML字符
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            // 将换行符转换为<br>
            .replace(/\n/g, "<br>");
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    setInputState(enabled) {
        this.chatInput.disabled = !enabled;
        this.sendButton.disabled = !enabled;
        if (!enabled) {
            this.sendButton.classList.add('disabled');
        } else {
            this.sendButton.classList.remove('disabled');
        }
    }
}

// 初始化聊天小部件
document.addEventListener('DOMContentLoaded', () => {
    window.chatWidget = new ChatWidget();
}); 