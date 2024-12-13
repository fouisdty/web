document.addEventListener('DOMContentLoaded', () => {
    // 导航栏链接高亮
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section, .chat-section, #chat-container');

    function updateActiveLink() {
        const currentPos = window.scrollY + 100;
        
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.id;
            
            if (currentPos >= sectionTop && currentPos < sectionBottom) {
                navLinks.forEach(link => {
                    const href = link.getAttribute('href').slice(1);
                    link.classList.toggle('active', 
                        href === sectionId || 
                        (href === 'chat' && sectionId === 'chat-container')
                    );
                });
            }
        });
    }

    // 平滑滚动到对应区域
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offset = 80; // 导航栏高度
                const targetPosition = targetElement.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 监听滚动事件
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
}); 