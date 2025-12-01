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

    const WEBHOOK_URL = 'https://automatizacion.dsinformatica.com.ar/webhook/dsibot';

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
        messageDiv.textContent = message;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function addLoadingIndicator() {
        // Agregar keyframes si no existen
        if (!document.getElementById('typing-animation-style')) {
            const style = document.createElement('style');
            style.id = 'typing-animation-style';
            style.textContent = `
                @keyframes typingDot {
                    0%, 60%, 100% { 
                        transform: translateY(0); 
                        opacity: 0.6; 
                    }
                    30% { 
                        transform: translateY(-12px); 
                        opacity: 1; 
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'chat-message bot';
        loadingDiv.id = 'loading-indicator';
        loadingDiv.innerHTML = '<div class="typing-indicator" style="display:flex;align-items:center;gap:6px;padding:10px 0;height:30px;"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:#0056b3;animation:typingDot 1.4s infinite ease-in-out;animation-delay:0s;"></span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:#0056b3;animation:typingDot 1.4s infinite ease-in-out;animation-delay:0.2s;"></span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:#0056b3;animation:typingDot 1.4s infinite ease-in-out;animation-delay:0.4s;"></span></div>';
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
            console.log('Enviando mensaje al webhook:', WEBHOOK_URL);
            console.log('Mensaje:', message);
            
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', [...response.headers.entries()]);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            let data;
            
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
                console.log('JSON response:', data);
            } else {
                const textData = await response.text();
                console.log('Text response:', textData);
                // Si la respuesta es texto plano, úsala directamente
                data = { response: textData };
            }
            
            removeLoadingIndicator();
            
            // Obtener respuesta del webhook - intentar diferentes propiedades
            const botResponse = data.response || data.message || data.text || data.reply || 
                               (typeof data === 'string' ? data : 'Lo siento, no pude procesar tu mensaje.');
            
            addMessage(botResponse, false);
        } catch (error) {
            removeLoadingIndicator();
            addMessage('Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.', false);
            console.error('Error completo:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            if (error instanceof TypeError) {
                console.error('Posible error de CORS o red');
            }
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