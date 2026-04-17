// 🌸 juna kim — interactions

document.addEventListener('DOMContentLoaded', () => {

    const carousel = document.getElementById('carousel');
    const buttons = document.querySelectorAll('.scroll-btn');

    // ----- Arrow button scroll -----
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const dir = parseInt(btn.dataset.dir, 10);
            const card = carousel.querySelector('.project-card');
            const cardWidth = card.offsetWidth + 24; // card + gap
            carousel.scrollBy({
                left: cardWidth * dir,
                behavior: 'smooth',
            });
        });
    });

    // ----- Mouse wheel horizontal scroll -----
    carousel.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            carousel.scrollBy({
                left: e.deltaY,
                behavior: 'auto',
            });
        }
    }, { passive: false });

    // ----- Drag to scroll -----
    let isDown = false;
    let startX, scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.classList.add('dragging');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.classList.remove('dragging');
    });

    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.classList.remove('dragging');
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 1.5;
        carousel.scrollLeft = scrollLeft - walk;
    });

    // ----- Keyboard navigation -----
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            buttons[1]?.click();
        } else if (e.key === 'ArrowLeft') {
            buttons[0]?.click();
        }
    });

});
