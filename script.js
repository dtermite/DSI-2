document.addEventListener("DOMContentLoaded", function() {

    // 1. Scroll Animations (Intersection Observer)
    const animatedElements = document.querySelectorAll('.animated-element');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => observer.observe(element));

    // 2. Typing Effect for Hero Title
    const heroTitle = document.querySelector('.hero-section h1');
    if (heroTitle) {
        const text = heroTitle.innerText;
        heroTitle.innerHTML = '';
        heroTitle.style.borderRight = '2px solid var(--neon-cyan)';
        heroTitle.style.whiteSpace = 'normal'; // Allow wrapping
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50); // Typing speed
            } else {
                heroTitle.style.borderRight = 'none'; // Remove cursor after typing
            }
        }
        setTimeout(typeWriter, 500); // Start after a short delay
    }

    // 3. 3D Tilt Effect for Cards
    const cards = document.querySelectorAll('.card, .testimonial-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // 4. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    const navbarBrand = document.querySelector('.navbar-brand');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(5, 10, 20, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 242, 255, 0.1)';
            if(navbarBrand) navbarBrand.style.transform = 'scale(1.05)';
        } else {
            navbar.style.background = 'rgba(5, 10, 20, 0.85)';
            navbar.style.boxShadow = 'none';
            if(navbarBrand) navbarBrand.style.transform = 'scale(1)';
        }
    });

    // 5. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
});