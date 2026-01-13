// Инициализация иконок Lucide
lucide.createIcons();

// Базовая логика хедера
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.padding = '10px 0';
        header.style.background = 'rgba(10, 12, 16, 0.95)';
    } else {
        header.style.padding = '0';
        header.style.background = 'rgba(10, 12, 16, 0.8)';
    }
});

// Заглушка для мобильного меню (будет расширена при необходимости)
const burger = document.getElementById('burger-menu');
burger.addEventListener('click', () => {
    console.log('Mobile menu toggled');
    // Тут будет анимация выезда меню
});
// Наблюдатель за появлением элементов
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

// Применяем ко всем элементам с классом fade-in
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
// Эффект свечения карточек при наведении
document.querySelectorAll('.m-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Инициализируем иконки повторно, если добавили новые
lucide.createIcons();
// Функция для последовательного появления (Stagger effect)
const revealSteps = () => {
    const steps = document.querySelectorAll('.trajectory .t-step');
    steps.forEach((step, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, index * 200); // Задержка 200мс для каждого следующего шага
                }
            });
        }, { threshold: 0.2 });
        observer.observe(step);
    });
};

revealSteps();
// Логика переключения табов в секции Инноваций
const setupTabs = () => {
    const controls = document.querySelectorAll('.control-item');
    const terminalContents = document.querySelectorAll('.terminal-content');

    if (controls.length === 0) return;

    controls.forEach(control => {
        control.addEventListener('click', () => {
            // 1. Убираем активный класс у всех кнопок
            controls.forEach(c => c.classList.remove('active'));
            // 2. Добавляем активный класс нажатой кнопке
            control.classList.add('active');

            // 3. Получаем ID целевого контента
            const targetId = control.getAttribute('data-target');
            
            // 4. Скрываем весь контент терминала
            terminalContents.forEach(content => content.classList.remove('active'));
            
            // 5. Показываем нужный контент
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Перезапуск анимации луча для эффекта "нового сканирования"
                const beam = document.querySelector('.scanner-beam');
                beam.style.animation = 'none';
                // Форсируем перерисовку (hack для перезапуска CSS анимации)
                beam.offsetHeight; 
                beam.style.animation = 'scanDown 3s ease-in-out infinite';
            }
        });
    });
};

setupTabs();
// Инициализируем новые иконки
lucide.createIcons();
// --- ЛОГИКА ФОРМЫ ---

// 1. Генерация капчи
let captchaResult;
const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    captchaResult = num1 + num2;
    const questionEl = document.getElementById('captcha-question');
    if(questionEl) questionEl.textContent = `${num1} + ${num2} = ?`;
};

// 2. Валидация телефона (только цифры)
const phoneInput = document.getElementById('user_phone');
phoneInput?.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

// 3. Обработка отправки (AJAX имитация)
const contactForm = document.getElementById('eonix-form');
const successMsg = document.getElementById('form-success');

contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Проверка капчи
    const userAnswer = document.getElementById('captcha-answer').value;
    if (parseInt(userAnswer) !== captchaResult) {
        alert('Ошибка капчи! Попробуйте снова.');
        generateCaptcha();
        document.getElementById('captcha-answer').value = '';
        return;
    }

    // Имитация отправки
    const btn = document.getElementById('submit-btn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = 'Отправка...';

    setTimeout(() => {
        // Показываем успех
        successMsg.classList.add('active');
        contactForm.reset();
        generateCaptcha();
        
        // Через 5 секунд можно вернуть форму (опционально)
        setTimeout(() => {
            successMsg.classList.remove('active');
            btn.disabled = false;
            btn.innerHTML = originalText;
        }, 5000);
    }, 1500);
});

// Инициализируем капчу при загрузке
generateCaptcha();
// --- МОБИЛЬНОЕ МЕНЮ ---
const burgerBtn = document.getElementById('burger-menu');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav__link');

const toggleMenu = () => {
    burgerBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    // Блокируем скролл при открытом меню
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
};

burgerBtn.addEventListener('click', toggleMenu);

// Закрываем меню при клике на ссылку
mobileLinks.forEach(link => {
    link.addEventListener('click', toggleMenu);
});


// --- COOKIE POPUP LOGIC ---
const cookiePopup = document.getElementById('cookie-popup');
const cookieAcceptBtn = document.getElementById('cookie-accept');

const checkCookieConsent = () => {
    const isAccepted = localStorage.getItem('eonix_cookies_accepted');
    if (!isAccepted) {
        // Показываем через 2 секунды после загрузки
        setTimeout(() => {
            cookiePopup.classList.add('show');
        }, 2000);
    }
};

cookieAcceptBtn.addEventListener('click', () => {
    localStorage.setItem('eonix_cookies_accepted', 'true');
    cookiePopup.classList.remove('show');
});

// Инициализация
checkCookieConsent();
lucide.createIcons();