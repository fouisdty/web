class VideoCarousel {
    constructor() {
        this.currentIndex = 0;
        this.videos = document.querySelectorAll('.video-container video');
        this.containers = document.querySelectorAll('.video-container');
        this.indicators = document.querySelectorAll('.video-indicators .indicator');
        this.prevBtn = document.querySelector('.prev-video');
        this.nextBtn = document.querySelector('.next-video');
        this.isPlaying = false;
        this.autoPlayInterval = null;
        
        this.init();
    }

    init() {
        // 初始化第一个视频
        this.playVideo(0);
        
        // 绑定按钮事件
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // 绑定指示器点击事件
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goTo(index));
        });

        // 视频结束事件处理
        this.videos.forEach((video, index) => {
            video.addEventListener('ended', () => {
                this.next();
            });
        });

        // 启动自动播放
        this.startAutoPlay();

        // 鼠标悬停时暂停自动播放
        const carousel = document.querySelector('.video-carousel');
        carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
        carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    async playVideo(index) {
        try {
            // 停止当前播放的视频
            this.videos.forEach(v => {
                v.pause();
                v.currentTime = 0;
            });
            this.containers.forEach(c => c.classList.remove('active'));
            this.indicators.forEach(i => i.classList.remove('active'));

            // 播放新视频
            this.currentIndex = index;
            const video = this.videos[index];
            this.containers[index].classList.add('active');
            this.indicators[index].classList.add('active');
            
            await video.play();
            this.isPlaying = true;
        } catch (error) {
            console.error('视频播放失败:', error);
        }
    }

    prev() {
        const newIndex = (this.currentIndex - 1 + this.videos.length) % this.videos.length;
        this.playVideo(newIndex);
    }

    next() {
        const newIndex = (this.currentIndex + 1) % this.videos.length;
        this.playVideo(newIndex);
    }

    goTo(index) {
        if (index !== this.currentIndex) {
            this.playVideo(index);
        }
    }

    startAutoPlay() {
        if (this.autoPlayInterval) return;
        this.autoPlayInterval = setInterval(() => this.next(), 5000); // 5秒切换一次
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// 初始化视频轮播
document.addEventListener('DOMContentLoaded', () => {
    new VideoCarousel();
}); 