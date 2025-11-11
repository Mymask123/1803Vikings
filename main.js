document.addEventListener('DOMContentLoaded', () => {
    // Inject shared footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        fetch('footer.html')
            .then(res => res.text())
            .then(html => {
                footerContainer.innerHTML = html;
            })
            .catch(() => {
                // Simple fallback if footer.html can't be loaded
                footerContainer.innerHTML = `
                    <footer class="footer">
                        <p>© 1803 Vikings Robotics · Paul D. Schreiber High School</p>
                        <div class="social-links">
                            <a href="https://instagram.com/1803vikings" target="_blank">Instagram</a>
                            <a href="mailto:vikings1803@gmail.com">Email</a>
                        </div>
                    </footer>`;
            });
    }

    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let hasShownNavbar = navbar.classList.contains('always-visible');

    // Subpages: navbar always visible
    if (navbar.classList.contains('always-visible')) {
        navbar.classList.add('visible');
    }

    // Scroll behavior only for home (no always-visible)
    window.addEventListener('scroll', () => {
        if (!navbar || navbar.classList.contains('always-visible')) return;

        const scrollY = window.scrollY;

        if (scrollY > window.innerHeight * 0.15 && !hasShownNavbar) {
            navbar.classList.add('visible');
            hasShownNavbar = true;
        } else if (scrollY <= 10 && hasShownNavbar) {
            navbar.classList.remove('visible');
            hasShownNavbar = false;
        }
    });

    // Smooth scroll for same-page anchors (e.g., About on home)
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const targetId = link.getAttribute('href').substring(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                window.scrollTo({
                    top: targetEl.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
