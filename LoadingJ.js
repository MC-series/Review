(function() {
    const updateLoader = () => {
        const percentageText = document.getElementById('load-percentage');
        const statusText = document.getElementById('load-status-text');
        const carMover = document.getElementById('load-car-mover');
        let progress = 0;

        const interval = setInterval(() => {
            progress += 1;
            
            if (percentageText) percentageText.innerText = `${progress}%`;
            
            if (carMover) {
                const screenWidth = window.innerWidth;
                const startPos = -200;
                const endPos = screenWidth + 200;
                const currentPos = startPos + (progress / 100) * (endPos - startPos);
                carMover.style.left = `${currentPos}px`;
            }

            if (progress >= 100) {
                clearInterval(interval);
                if (statusText) {
                    statusText.innerText = "READY";
                    statusText.classList.add('load-complete');
                }
                
                // Transition to home screen
                transitionToHome();
            }
        }, 20);
    };

    const createStars = () => {
        const container = document.getElementById('load-stars-container');
        if (!container) return;

        for (let i = 0; i < 60; i++) {
            const star = document.createElement('div');
            star.className = 'load-home-star';
            const size = Math.random() * 2 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDuration = `${Math.random() * 3 + 2}s`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            container.appendChild(star);
        }
    };

    const transitionToHome = () => {
        // Add slight delay to let status text update
        setTimeout(() => {
            const loadingContext = document.querySelector('.load-full-page-context');
            const homePortal = document.querySelector('.home-main-portal');
            const homeHeader = document.querySelector('.home-branding-header');
            const navFab = document.getElementById('nav-fab-trigger');
            const navDock = document.querySelector('.nav-dock-container');
            const video = document.querySelector('.anispot-frame');

            if (loadingContext) {
                loadingContext.classList.add('load-complete');
            }
            if (homePortal) {
                homePortal.classList.add('show-home');
            }
            if (homeHeader) {
                homeHeader.classList.add('show-home');
            }
            if (navFab) {
                navFab.classList.add('show-nav');
            }
            if (navDock) {
                navDock.classList.add('show-nav');
            }
            if (video) {
                video.classList.add('show-video');
            }
            
            // Signal that loading is complete
            window.isLoadingComplete = true;
            window.dispatchEvent(new CustomEvent('loadingComplete'));
        }, 300);
    };

    const init = () => {
        createStars();
        updateLoader();
    };

    document.readyState === 'complete' ? init() : window.addEventListener('load', init);
})();