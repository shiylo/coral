document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    
    // 1. БУРГЕР МЕНЮ
    const burger = document.querySelector('.burger');
    const headerMenu = document.querySelector('.header__menu');
    const headerLinks = document.querySelectorAll('.header__link');
    
    if (burger && headerMenu) {
        burger.addEventListener('click', toggleMenu);
        
        headerLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Закрываем меню на мобильных
                if (window.innerWidth <= 1000) {
                    toggleMenu();
                }
                
                // Плавный скролл для якорных ссылок
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
        
        // Закрытие по ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeEverything();
            }
        });
    }
    
    function toggleMenu() {
        burger.classList.toggle('active');
        headerMenu.classList.toggle('active');
        body.classList.toggle('lock');
    }
    
    function closeEverything() {
        burger.classList.remove('active');
        headerMenu.classList.remove('active');
        body.classList.remove('lock');
        closeModal();
    }
    
    // 2. СЛАЙДЕР
    class Slider {
        constructor() {
            this.slides = document.querySelectorAll('.slide');
            this.dots = document.querySelectorAll('.dot');
            this.currentSlide = 0;
            this.interval = null;
            
            if (this.slides.length > 0) {
                this.init();
            }
        }
        
        init() {
            this.showSlide(0);
            this.startAutoSlide();
            
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    clearInterval(this.interval);
                    this.goToSlide(index);
                    this.startAutoSlide();
                });
            });
            
            // Добавляем свайп для слайдера
            const slider = document.querySelector('.hero-slider');
            let startX = 0;
            let endX = 0;
            
            slider.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                clearInterval(this.interval);
            });
            
            slider.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                this.handleSwipe(startX, endX);
                this.startAutoSlide();
            });
            
            // Для десктопов
            slider.addEventListener('mousedown', (e) => {
                startX = e.clientX;
                clearInterval(this.interval);
            });
            
            slider.addEventListener('mouseup', (e) => {
                endX = e.clientX;
                this.handleSwipe(startX, endX);
                this.startAutoSlide();
            });
        }
        
        handleSwipe(startX, endX) {
            const difference = startX - endX;
            if (Math.abs(difference) > 50) {
                if (difference > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        }
        
        showSlide(index) {
            this.slides.forEach(slide => slide.classList.remove('slide--active'));
            this.dots.forEach(dot => dot.classList.remove('dot--active'));
            
            this.slides[index].classList.add('slide--active');
            this.dots[index].classList.add('dot--active');
            this.currentSlide = index;
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.showSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.showSlide(prevIndex);
        }
        
        goToSlide(index) {
            this.showSlide(index);
        }
        
        startAutoSlide() {
            this.interval = setInterval(() => {
                this.nextSlide();
            }, 5000);
        }
    }
    
    // Инициализация слайдера
    new Slider();
    
    // 3. АКТИВНЫЕ ССЫЛКИ ПРИ СКРОЛЛЕ
    function updateActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
                headerLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLinks);
    updateActiveLinks(); // Инициализация при загрузке
    
    // 4. МОДАЛЬНОЕ ОКНО ДЛЯ ПРОДУКТОВ
    
    // Данные для всех 6 продуктов
    const productsData = {
        magnesium: {
            name: "Магний",
            badge: "Для нервной системы",
            description: "Снижение стресса, улучшение сна и общее расслабление организма. Формула с высокой биодоступностью.",
            price: "1 200 ₽",
            details: `<ul>
                <li>Успокаивает нервную систему и снижает уровень стресса</li>
                <li>Улучшает качество сна и помогает при бессоннице</li>
                <li>Способствует расслаблению мышц</li>
                <li>Поддерживает здоровье сердечно-сосудистой системы</li>
                <li>Участвует в более чем 300 биохимических реакциях</li>
                <li>Повышает устойчивость к стрессовым ситуациям</li>
            </ul>
            <p><strong>Состав:</strong> Магний цитрат, витамин B6, таурин.</p>
            <p><strong>Применение:</strong> 1-2 капсулы в день во время еды.</p>
            <p><strong>Курс:</strong> 1-2 месяца.</p>`
        },
        bluron: {
            name: "B-LURON",
            badge: "Для суставов",
            description: "Поддержка подвижности суставов и восстановление хрящевой ткани. Инновационная формула.",
            price: "16 000 ₽",
            details: `<ul>
                <li>Восстанавливает хрящевую ткань и подвижность суставов</li>
                <li>Снижает болевые ощущения и воспаление</li>
                <li>Улучшает синтез собственной гиалуроновой кислоты</li>
                <li>Защищает суставы от возрастных изменений</li>
                <li>Повышает эластичность соединительной ткани</li>
                <li>Способствует регенерации суставных поверхностей</li>
            </ul>
            <p><strong>Состав:</strong> Глюкозамин, хондроитин, MSM, гиалуроновая кислота.</p>
            <p><strong>Применение:</strong> По назначению специалиста.</p>
            <p><strong>Курс:</strong> Индивидуальный.</p>`
        },
        lipostic: {
            name: "Lipostic Fit",
            badge: "Для метаболизма",
            description: "Контроль веса и нормализация обмена веществ. Натуральная формула для коррекции веса.",
            price: "6 600 ₽",
            details: `<ul>
                <li>Ускоряет метаболизм и сжигание жиров</li>
                <li>Снижает аппетит и тягу к сладкому</li>
                <li>Поддерживает уровень энергии во время диеты</li>
                <li>Улучшает пищеварение и усвоение питательных веществ</li>
                <li>Помогает поддерживать достигнутый результат</li>
                <li>Детоксикация и очищение организма</li>
            </ul>
            <p><strong>Состав:</strong> Экстракт зеленого кофе, L-карнитин, гуарана, хром.</p>
            <p><strong>Применение:</strong> 2 капсулы в день за 30 минут до еды.</p>
            <p><strong>Курс:</strong> 1-3 месяца.</p>`
        },
        zinc: {
            name: "Coral Zinc",
            badge: "Для иммунитета",
            description: "Поддержка иммунной системы и антиоксидантная защита. Цинк в легкоусвояемой форме.",
            price: "1 500 ₽",
            details: `<ul>
                <li>Укрепляет иммунную систему</li>
                <li>Обладает антиоксидантными свойствами</li>
                <li>Поддерживает здоровье кожи, волос и ногтей</li>
                <li>Участвует в процессах регенерации тканей</li>
                <li>Необходим для нормальной работы гормональной системы</li>
                <li>Защищает от вирусных и бактериальных инфекций</li>
            </ul>
            <p><strong>Состав:</strong> Цинк пиколинат, витамин C, селен.</p>
            <p><strong>Применение:</strong> 1 таблетка в день во время еды.</p>
            <p><strong>Курс:</strong> 1 месяц, 2-3 раза в год.</p>`
        },
        carnitine: {
            name: "Coral-Carnitine",
            badge: "Для энергии",
            description: "Энергия, выносливость и поддержка сердечно-сосудистой системы. Идеально для активных людей.",
            price: "1 500 ₽",
            details: `<ul>
                <li>Повышает физическую и умственную работоспособность</li>
                <li>Способствует преобразованию жира в энергию</li>
                <li>Поддерживает здоровье сердечно-сосудистой системы</li>
                <li>Улучшает восстановление после физических нагрузок</li>
                <li>Защищает клетки от окислительного стресса</li>
                <li>Ускоряет метаболизм жиров</li>
            </ul>
            <p><strong>Состав:</strong> L-карнитин, коэнзим Q10, витамины группы B.</p>
            <p><strong>Применение:</strong> 1-2 капсулы в день.</p>
            <p><strong>Курс:</strong> 1-2 месяца.</p>`
        },
        detox: {
            name: "Coral Detox Plus",
            badge: "Детокс",
            description: "Очищение организма и поддержка естественных процессов детоксикации. Комплексный подход.",
            price: "5 000 ₽",
            details: `<ul>
                <li>Выводит токсины и тяжелые металлы</li>
                <li>Поддерживает работу печени и почек</li>
                <li>Улучшает пищеварение и работу кишечника</li>
                <li>Способствует омоложению на клеточном уровне</li>
                <li>Повышает общий тонус и энергию</li>
                <li>Восстанавливает естественный баланс организма</li>
            </ul>
            <p><strong>Состав:</strong> Расторопша, артишок, куркума, хлорелла.</p>
            <p><strong>Применение:</strong> По назначению специалиста.</p>
            <p><strong>Курс:</strong> 10-30 дней, 1-2 раза в год.</p>`
        }
    };
    
    // Элементы модального окна
    const modal = document.getElementById('productModal');
    const modalOverlay = document.querySelector('.modal__overlay');
    const modalClose = document.querySelector('.modal__close');
    
    // Открытие модального окна
    document.querySelectorAll('[data-modal]').forEach(element => {
        element.addEventListener('click', function(e) {
            const productId = this.getAttribute('data-modal');
            openModal(productId);
        });
    });
    
    function openModal(productId) {
        const product = productsData[productId];
        
        if (!product) {
            console.error('Продукт не найден:', productId);
            return;
        }
        
        // Заполняем данные
        document.getElementById('modalProductName').textContent = product.name;
        document.getElementById('modalProductBadge').textContent = product.badge;
        document.getElementById('modalProductDescription').textContent = product.description;
        document.getElementById('modalProductPrice').textContent = product.price;
        document.getElementById('modalProductDetails').innerHTML = product.details;
        
        // Устанавливаем изображение
        const modalImg = document.getElementById('modalProductImage');
        const productElement = document.querySelector(`[data-modal="${productId}"]`);
        if (productElement) {
            const imgElement = productElement.querySelector('img');
            if (imgElement) {
                modalImg.src = imgElement.src;
                modalImg.alt = product.name;
            }
        }
        
        // Открываем модальное окно
        modal.classList.add('active');
        body.classList.add('lock');
        
        // Фокусируемся на первом поле формы
        setTimeout(() => {
            document.getElementById('orderName').focus();
        }, 300);
    }
    
    // Закрытие модального окна
    function closeModal() {
        modal.classList.remove('active');
        body.classList.remove('lock');
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Управление количеством товара
    const quantityMinus = document.querySelector('.quantity-btn.minus');
    const quantityPlus = document.querySelector('.quantity-btn.plus');
    const quantityInput = document.getElementById('productQuantity');
    
    if (quantityMinus && quantityPlus && quantityInput) {
        quantityMinus.addEventListener('click', () => {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
        
        quantityPlus.addEventListener('click', () => {
            let value = parseInt(quantityInput.value);
            if (value < 10) {
                quantityInput.value = value + 1;
            }
        });
        
        quantityInput.addEventListener('change', () => {
            let value = parseInt(quantityInput.value);
            if (value < 1) quantityInput.value = 1;
            if (value > 10) quantityInput.value = 10;
        });
    }
    
    // 5. ФОРМА ЗАКАЗА В МОДАЛЬНОМ ОКНЕ
    const productOrderForm = document.getElementById('productOrderForm');
    
    if (productOrderForm) {
        productOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const productName = document.getElementById('modalProductName').textContent;
            const productPrice = document.getElementById('modalProductPrice').textContent;
            const quantity = document.getElementById('productQuantity').value;
            const name = document.getElementById('orderName').value.trim();
            const phone = document.getElementById('orderPhone').value.trim();
            
            // Валидация
            if (!name) {
                alert('Пожалуйста, введите ваше имя');
                document.getElementById('orderName').focus();
                return;
            }
            
            if (!phone || phone.length < 10) {
                alert('Пожалуйста, введите корректный номер телефона');
                document.getElementById('orderPhone').focus();
                return;
            }
            
            // Формируем сообщение для WhatsApp
            const message = `🎯 ЗАКАЗ ПРОДУКТА CORAL CLUB\n\n` +
                          `🏷️ Продукт: ${productName}\n` +
                          `💰 Цена: ${productPrice}\n` +
                          `📦 Количество: ${quantity} шт.\n` +
                          `👤 Имя: ${name}\n` +
                          `📱 Телефон: ${phone}\n\n` +
                          `🕐 Пожалуйста, свяжитесь со мной для оформления заказа.`;
            
            // Отправляем в WhatsApp
            const whatsappNumber = '79323310473';
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            window.open(whatsappUrl, '_blank');
            
            // Закрываем модальное окно
            closeModal();
            
            // Сбрасываем форму
            this.reset();
            document.getElementById('productQuantity').value = '1';
        });
    }
    
    // 6. ФОРМА КОНСУЛЬТАЦИИ
    const consultForm = document.getElementById('consultForm');
    
    if (consultForm) {
        consultForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('userName').value.trim();
            const phone = document.getElementById('userPhone').value.trim();
            const goal = document.getElementById('userGoal').value;
            const message = document.getElementById('userMessage').value.trim();
            
            // Валидация
            if (!name || !phone) {
                alert('Пожалуйста, заполните обязательные поля');
                return;
            }
            
            const goalTexts = {
                'weight': 'Коррекция веса',
                'energy': 'Повышение энергии',
                'immunity': 'Укрепление иммунитета',
                'detox': 'Очищение организма',
                'other': 'Другое'
            };
            
            // Формируем сообщение для WhatsApp
            const consultMessage = `👨‍⚕️ ЗАПРОС НА КОНСУЛЬТАЦИЮ\n\n` +
                                 `👤 Имя: ${name}\n` +
                                 `📱 Телефон: ${phone}\n` +
                                 `🎯 Цель: ${goalTexts[goal] || 'Не указана'}\n` +
                                 `📝 Сообщение: ${message || 'Не указано'}\n\n` +
                                 `🕐 Прошу связаться со мной для консультации.`;
            
            // Отправляем в WhatsApp
            const whatsappNumber = '79323310473';
            const encodedMessage = encodeURIComponent(consultMessage);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            window.open(whatsappUrl, '_blank');
            
            // Сбрасываем форму
            this.reset();
        });
    }
    
    // 7. МАСКА ДЛЯ ТЕЛЕФОНА
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    function formatPhoneNumber(value) {
        const numbers = value.replace(/\D/g, '');
        
        if (numbers.length === 0) return '';
        
        let formatted = '+7';
        
        if (numbers.length > 1) {
            formatted += ' (' + numbers.substring(1, 4);
        }
        if (numbers.length > 4) {
            formatted += ') ' + numbers.substring(4, 7);
        }
        if (numbers.length > 7) {
            formatted += '-' + numbers.substring(7, 9);
        }
        if (numbers.length > 9) {
            formatted += '-' + numbers.substring(9, 11);
        }
        
        return formatted;
    }
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            this.value = formatPhoneNumber(this.value);
        });
        
        input.addEventListener('keydown', function(e) {
            // Разрешаем: backspace, delete, tab, escape, enter
            if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
                (e.keyCode === 65 && e.ctrlKey === true) || // Ctrl+A
                (e.keyCode === 67 && e.ctrlKey === true) || // Ctrl+C
                (e.keyCode === 86 && e.ctrlKey === true) || // Ctrl+V
                (e.keyCode === 88 && e.ctrlKey === true) || // Ctrl+X
                (e.keyCode >= 35 && e.keyCode <= 39)) { // Home, End, Left, Right
                return;
            }
            
            // Запрещаем все, кроме цифр
            if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    });
    
    // 8. ПЛАВНЫЙ СКРОЛЛ ДЛЯ ВСЕХ ЯКОРНЫХ ССЫЛОК
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});