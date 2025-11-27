document.addEventListener("DOMContentLoaded", function() {

    // Animación de los elementos al hacer scroll
    const animatedElements = document.querySelectorAll('.animated-element');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Deja de observar el elemento una vez que se ha animado
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2 // El 20% del elemento debe ser visible para que se active
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Desplazamiento suave para los enlaces de la barra de navegación
    // Nota: CSS scroll-behavior: smooth y scroll-padding-top manejan esto nativamente en navegadores modernos.
    // Mantenemos este código como fallback o para control preciso si es necesario, pero simplificado.
    document.addEventListener('click', function (e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // El scroll-padding-top en CSS debería manejar el offset, pero si usamos JS explícito:
                const headerOffset = 60;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }
    });

    // Efecto de crecimiento en el logo al hacer scroll (Optimizado)
    const navbarBrand = document.querySelector('.navbar-brand');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    navbarBrand.style.transform = 'scale(1.1)';
                } else {
                    navbarBrand.style.transform = 'scale(1)';
                }
                ticking = false;
            });
            ticking = true;
        }
    });

});