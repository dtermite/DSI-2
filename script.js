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
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 60, // Resta la altura del navbar
                    behavior: 'smooth'
                });
            }
        });
    });

    // Efecto de crecimiento en el logo al hacer scroll
    const navbarBrand = document.querySelector('.navbar-brand');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbarBrand.style.transform = 'scale(1.1)';
        } else {
            navbarBrand.style.transform = 'scale(1)';
        }
    });

});