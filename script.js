// 🌸 juna kim — interactions

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------
       Password Gate
       -------------------------------- */
    const gate = document.getElementById('gate');
    const gateForm = document.getElementById('gate-form');
    const gateInput = document.getElementById('gate-input');
    const gateError = document.getElementById('gate-error');
    const PASSWORD = 'junajunajuna';

    // If already unlocked this session, hide gate immediately
    try {
        if (sessionStorage.getItem('juna-unlocked') === 'yes') {
            gate.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('locked');
        }
    } catch (e) { /* ignore */ }

    if (gateForm) {
        gateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = (gateInput.value || '').trim().toLowerCase();
            if (val === PASSWORD) {
                try { sessionStorage.setItem('juna-unlocked', 'yes'); } catch (e) {}
                gate.setAttribute('aria-hidden', 'true');
                gateError.textContent = '';
                // Reload so all page scripts (carousel/modal) initialise cleanly
                setTimeout(() => { location.reload(); }, 450);
            } else {
                gateError.textContent = 'hmm, that\'s not it — try again ✿';
                gate.classList.remove('shake');
                // force reflow so animation replays
                void gate.offsetWidth;
                gate.classList.add('shake');
                gateInput.value = '';
                gateInput.focus();
            }
        });
    }

    // Stop further scripts if still locked
    if (document.body.classList.contains('locked')) return;

    /* --------------------------------
       Carousel controls
       -------------------------------- */
    const carousel = document.getElementById('carousel');
    const buttons = document.querySelectorAll('.scroll-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dir = parseInt(btn.dataset.dir, 10);
            const card = carousel.querySelector('.project-card');
            const cardWidth = card.offsetWidth + 24;
            carousel.scrollBy({ left: cardWidth * dir, behavior: 'smooth' });
        });
    });

    carousel.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            carousel.scrollBy({ left: e.deltaY, behavior: 'auto' });
        }
    }, { passive: false });

    // Drag to scroll (desktop)
    let isDown = false;
    let startX, scrollLeft, dragMoved = false;

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        dragMoved = false;
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
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 1.5;
        if (Math.abs(walk) > 4) dragMoved = true;
        carousel.scrollLeft = scrollLeft - walk;
    });

    /* --------------------------------
       Project Modal
       -------------------------------- */
    const modal = document.getElementById('project-modal');
    const dataEl = document.getElementById('project-data');
    const projectData = dataEl ? JSON.parse(dataEl.textContent) : {};

    const modalEls = {
        num: document.getElementById('modal-num'),
        year: document.getElementById('modal-year'),
        title: document.getElementById('modal-title'),
        role: document.getElementById('modal-role'),
        description: document.getElementById('modal-description'),
        tags: document.getElementById('modal-tags'),
        link: document.getElementById('modal-link'),
        media: modal.querySelector('.modal-media'),
        mediaIcon: modal.querySelector('.modal-media-icon'),
    };

    function openModal(id) {
        const p = projectData[id];
        if (!p) return;

        modalEls.num.textContent = p.num || '';
        modalEls.year.textContent = p.year || '';
        modalEls.title.textContent = p.title || '';
        modalEls.role.textContent = p.role || '';
        modalEls.role.style.display = p.role ? 'block' : 'none';
        modalEls.description.innerHTML = p.description || '';
        modalEls.media.setAttribute('data-color', p.color || 'pink');
        modalEls.mediaIcon.textContent = p.icon || '✿';

        // tags
        modalEls.tags.innerHTML = '';
        (p.tags || []).forEach(tag => {
            const span = document.createElement('span');
            span.textContent = tag;
            modalEls.tags.appendChild(span);
        });

        // link
        if (p.link && p.link !== '#') {
            modalEls.link.href = p.link;
            modalEls.link.textContent = p.linkLabel || 'view project →';
            modalEls.link.style.display = 'inline-block';
        } else {
            modalEls.link.style.display = 'none';
        }

        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }

    // Attach card click handlers
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // don't open modal if user was dragging
            if (dragMoved) {
                dragMoved = false;
                return;
            }
            const id = card.dataset.project;
            if (id) openModal(id);
        });
    });

    // Close handlers
    modal.querySelectorAll('[data-close]').forEach(el => {
        el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
            closeModal();
            return;
        }
        // Carousel keyboard nav (only when modal closed)
        if (modal.getAttribute('aria-hidden') !== 'false') {
            if (e.key === 'ArrowRight') buttons[1]?.click();
            else if (e.key === 'ArrowLeft') buttons[0]?.click();
        }
    });

});
