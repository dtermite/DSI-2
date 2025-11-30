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

    // 6. Chatbot Functionality
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    const WEBHOOK_URL = 'https://automatizacion.dsinformatica.com.ar/webhook-test/chatcine';

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
        messageDiv.textContent = message;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function addLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'chat-message bot';
        loadingDiv.id = 'loading-indicator';
        loadingDiv.innerHTML = '<span>Escribiendo</span><span class="dots">...</span>';
        chatbotMessages.appendChild(loadingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function removeLoadingIndicator() {
        const loading = document.getElementById('loading-indicator');
        if (loading) loading.remove();
    }

    async function sendMessageToWebhook(message) {
        try {
            addLoadingIndicator();
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await response.json();
            removeLoadingIndicator();
            
            // Obtener respuesta del webhook
            const botResponse = data.response || 'Lo siento, no pude procesar tu mensaje.';
            addMessage(botResponse, false);
        } catch (error) {
            removeLoadingIndicator();
            addMessage('Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.', false);
            console.error('Error:', error);
        }
    }

    function handleSendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatbotInput.value = '';
            sendMessageToWebhook(message);
        }
    }

    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('chatbot-hidden');
            if (!chatbotWindow.classList.contains('chatbot-hidden') && chatbotMessages.children.length === 0) {
                addMessage('¡Hola! Soy el asistente virtual de DSI. ¿En qué puedo ayudarte hoy?', false);
            }
        });
    }

    if (chatbotClose) {
        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.add('chatbot-hidden');
        });
    }

    if (chatbotSend) {
        chatbotSend.addEventListener('click', handleSendMessage);
    }

    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
    }
});