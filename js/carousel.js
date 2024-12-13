class Carousel {
    constructor(element) {
        this.carousel = element;
        this.items = Array.from(this.carousel.querySelectorAll('.carousel-item'));
        this.indicators = Array.from(this.carousel.querySelectorAll('.indicator'));
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        
        this.init();
    }

    init() {
        // 绑定控制按钮事件
        this.carousel.querySelector('.prev').addEventListener('click', () => this.prev());
        this.carousel.querySelector('.next').addEventListener('click', () => this.next());
        
        // 绑定指示器点击事件
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goTo(index));
        });

        // 自动播放
        this.startAutoPlay();

        // 鼠标悬停时暂停自动播放
        this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    goTo(index) {
        // 移除当前活动项的active类
        this.items[this.currentIndex].classList.remove('active');
        this.indicators[this.currentIndex].classList.remove('active');
        
        // 更新当前索引
        this.currentIndex = index;
        
        // 如果索引超出范围，重置为0
        if (this.currentIndex >= this.items.length) {
            this.currentIndex = 0;
        } else if (this.currentIndex < 0) {
            this.currentIndex = this.items.length - 1;
        }
        
        // 添加新的活动项的active类
        this.items[this.currentIndex].classList.add('active');
        this.indicators[this.currentIndex].classList.add('active');
    }

    next() {
        this.goTo(this.currentIndex + 1);
    }

    prev() {
        this.goTo(this.currentIndex - 1);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.next(), 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// 初始化所有轮播图
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => new Carousel(carousel));
}); 