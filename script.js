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

    // Identificador de conversación (por visita) para que el bot pueda mantener el hilo
    function getSessionId() {
        try {
            let id = sessionStorage.getItem('dsi-chat-session');
            if (!id) {
                id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
                sessionStorage.setItem('dsi-chat-session', id);
            }
            return id;
        } catch (_) {
            return 'anon-' + Date.now();
        }
    }

    // Botones de respuesta rápida para arrancar la conversación
    const QUICK_REPLIES = [
        'Quiero automatizar una tarea repetitiva',
        'Quiero un asistente de IA para mi empresa',
        'Necesito un dashboard o reportes',
        'Tengo una idea y no sé por dónde empezar'
    ];

    function addQuickReplies() {
        const wrap = document.createElement('div');
        wrap.className = 'chat-quick-replies';
        QUICK_REPLIES.forEach(text => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'chat-chip';
            btn.textContent = text;
            btn.addEventListener('click', () => {
                wrap.remove();
                addMessage(text, true);
                sendMessageToWebhook(text);
            });
            wrap.appendChild(btn);
        });
        chatbotMessages.appendChild(wrap);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    const FALLBACK_MESSAGE = 'Ahora mismo no puedo responderte, estamos con una demora. Probá de nuevo en unos minutos o escribinos por LinkedIn: https://www.linkedin.com/in/diego-termite-dsi';

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
        // Verificar si ya hay una petición en curso
        if (document.getElementById('loading-indicator')) {
            console.log('Ya hay una petición en curso, ignorando...');
            return;
        }

        try {
            addLoadingIndicator();
            console.log('Enviando mensaje al webhook:', WEBHOOK_URL);
            console.log('Mensaje:', message);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout
            
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message, sessionId: getSessionId() }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
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
            
            if (error.name === 'AbortError') {
                console.error('La petición tardó demasiado y fue cancelada');
                addMessage('La respuesta está tardando más de lo normal. Probá de nuevo en un momento.', false);
            } else {
                addMessage(FALLBACK_MESSAGE, false);
                console.error('Error completo:', error);
                console.error('Error name:', error.name);
                console.error('Error message:', error.message);
                if (error instanceof TypeError) {
                    console.error('Posible error de CORS o red');
                }
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
                addMessage('¡Hola! Soy el asistente de DSI, y funciono con IA. Contame qué proceso, tarea o problema de tu empresa te gustaría resolver y te voy guiando. ¿Por dónde empezamos?', false);
                addQuickReplies();
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

    // Botones que abren el chatbot en lugar de WhatsApp
    document.querySelectorAll('.open-chatbot').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const win = document.getElementById('chatbot-window');
            if (win && win.classList.contains('chatbot-hidden')) {
                document.getElementById('chatbot-toggle').click();
            }
            win.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });
    });

    // Typing effect for hero
    const typedTextEl = document.getElementById('typed-text');
    if (typedTextEl) {
        const words = ['Resultados', 'Decisiones', 'Crecimiento', 'Eficiencia'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typedTextEl.textContent = currentWord.slice(0, charIndex - 1);
                charIndex--;
            } else {
                typedTextEl.textContent = currentWord.slice(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                setTimeout(() => { isDeleting = true; typeEffect(); }, 2000);
                return;
            }
            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }

            setTimeout(typeEffect, isDeleting ? 70 : 110);
        }
        setTimeout(typeEffect, 800);
    }

    // Counter animation for hero stats
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'), 10);
                const duration = 1400;
                const stepTime = 16;
                const steps = duration / stepTime;
                const increment = target / steps;
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        el.textContent = target;
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.floor(current);
                    }
                }, stepTime);

                counterObserver.unobserve(el);
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }
});