const savedUsers = localStorage.getItem('cyberpanda_users');
const users = savedUsers ? JSON.parse(savedUsers) : [
    { id: 1, login: 'admin', password: 'admin123', name: 'Админ Клуба', role: 'admin' },
    { id: 2, login: 'user', password: 'user123', name: 'Игрок', role: 'user' }
];

const products = [
    { 
        id: 1, name: 'Игровой ПК Premium', description: 'Мощный ПК с RTX 4080, Intel i9, 32GB RAM, 360Hz монитор', 
        price: 500, image: 'img/pc-premium.jpg', category: 'pc',
        specs: ['RTX 4080', 'Intel i9-13900K', '32GB DDR5', '360Hz монитор']
    },
    { 
        id: 2, name: 'Игровой ПК Standard', description: 'Надежный ПК с RTX 4060, Intel i5, 16GB RAM, 144Hz монитор', 
        price: 300, image: 'img/pc-standard.jpg', category: 'pc',
        specs: ['RTX 4060', 'Intel i5-13400', '16GB DDR4', '144Hz монитор']
    },
    { 
        id: 3, name: 'PlayStation 5 Zone', description: 'Консольная зона с PS5 и библиотекой эксклюзивов', 
        price: 250, image: 'img/ps5.jpg', category: 'console',
        specs: ['PS5', '4K TV', 'Беспроводной геймпад', '100+ игр']
    },
    { 
        id: 4, name: 'Xbox Series X Zone', description: 'Консольная зона с Xbox Series X и Game Pass', 
        price: 250, image: 'img/xbox.jpg', category: 'console',
        specs: ['Xbox Series X', '4K TV', 'Game Pass Ultimate', '200+ игр']
    },
    { 
        id: 5, name: 'VR Meta Quest 3', description: 'Полное погружение в виртуальную реальность', 
        price: 400, image: 'img/vr.jpg', category: 'vr',
        specs: ['Meta Quest 3', 'Беспроводной', '120Hz', '100+ VR-игр']
    }
];

const tariffs = [
    {
        id: 'basic',
        name: 'Базовый минимум',
        price: 300,
        period: 'час',
        features: ['Доступ к игровым ПК', 'Бесплатные напитки', 'Wi-Fi'],
        popular: false
    },
    {
        id: 'premium',
        name: 'Роскошный максимум',
        price: 500,
        period: 'час',
        features: ['Приоритетные места', 'Бесплатный кальян', 'Дополнительные мониторы', 'Механическая клавиатура'],
        popular: true
    },
    {
        id: 'night',
        name: 'Ночной',
        price: 1200,
        period: '5 часов',
        features: ['С 22:00 до 08:00', 'Неограниченные напитки', 'Комфортная зона отдыха'],
        popular: false
    }
];

function validateLogin(login) {
    if (!login || login.length < 3) return 'Логин должен быть не менее 3 символов';
    return null;
}

function validatePassword(password) {
    if (!password || password.length < 6) return 'Пароль должен быть не менее 6 символов';
    return null;
}

function validateForm(login, password) {
    const loginError = validateLogin(login);
    const passwordError = validatePassword(password);
    return { loginError, passwordError, isValid: !loginError && !passwordError };
}

function loginUser(login, password) {
    const user = users.find(u => u.login === login && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user };
    }
    return { success: false, error: 'Неверный логин или пароль' };
}

function registerUser(login, password, name) {
    if (users.find(u => u.login === login)) {
        return { success: false, error: 'Пользователь с таким логином уже существует' };
    }
    
    const newUser = { 
        id: users.length + 1, 
        login, 
        password, 
        name,
        role: 'user'
    };
    
    users.push(newUser);
    
    localStorage.setItem('cyberpanda_users', JSON.stringify(users));
    
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return { success: true, user: newUser };
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    return { success: true };
}

function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function isAuthenticated() {
    return getCurrentUser() !== null;
}

function initAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        const userData = JSON.parse(savedUser);
        const userExists = users.find(u => u.id === userData.id);
        if (!userExists) {
            logoutUser();
        }
    }
}

function getProductById(id) {
    return products.find(p => p.id === parseInt(id));
}

function getProductsByCategory(category) {
    if (!category || category === 'all') return products;
    return products.filter(p => p.category === category);
}

function renderProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}" data-category="${product.category}">
            <img src="${product.image}" alt="${product.name}" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+JHtwcm9kdWN0Lm5hbWV9PC90ZXh0Pjwvc3ZnPg=='">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="specs">
                ${product.specs.map(spec => `<span class="spec-tag">${spec}</span>`).join('')}
            </div>
            <div class="price">от ${product.price} руб/час</div>
            <button class="btn" onclick="bookProduct(${product.id})">Забронировать</button>
        </div>
    `;
}

function renderProductList(container, category = null) {
    if (!container) return;
    
    const productsList = getProductsByCategory(category);
    container.innerHTML = productsList.map(renderProductCard).join('');
    
    container.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn')) {
                const productId = card.dataset.id;
                window.location.href = `product.html?id=${productId}`;
            }
        });
    });
}

function renderProductDetails(productId) {
    const product = getProductById(productId);
    
    if (!product) {
        return `
            <section class="page-header">
                <div class="container">
                    <h1>Услуга не найдена</h1>
                    <p>Запрошенная услуга не существует.</p>
                    <a href="services.html" class="btn">Вернуться к услугам</a>
                </div>
            </section>
        `;
    }
    
    return `
        <section class="page-header">
            <div class="container">
                <h1>${product.name}</h1>
            </div>
        </section>
        
        <section class="product-detail">
            <div class="container">
                <div class="product-detail-grid">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" 
                             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+JHtwcm9kdWN0Lm5hbWV9PC90ZXh0Pjwvc3ZnPg=='">
                    </div>
                    <div class="product-info">
                        <p class="product-description">${product.description}</p>
                        <div class="product-specs">
                            <h3>Характеристики:</h3>
                            <ul>
                                ${product.specs.map(spec => `<li>${spec}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="product-price">
                            <span class="price">от ${product.price} руб/час</span>
                        </div>
                        <button class="btn btn-large" onclick="bookProduct(${product.id})">Забронировать</button>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function initProductFilters(container) {
    if (!container) return;
    
    const categories = [
        { id: 'all', name: 'Все' },
        { id: 'pc', name: 'Игровые ПК' },
        { id: 'console', name: 'Консоли' },
        { id: 'vr', name: 'VR' },
        { id: 'event', name: 'Турниры' },
        { id: 'rent', name: 'Аренда' },
        { id: 'hookah', name: 'Кальяны' }
    ];
    
    const filterHTML = `
        <div class="product-filters">
            ${categories.map(cat => `
                <button class="filter-btn ${cat.id === 'all' ? 'active' : ''}" 
                        data-category="${cat.id}">${cat.name}</button>
            `).join('')}
        </div>
    `;
    
    container.insertAdjacentHTML('afterbegin', filterHTML);
    
    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const productsGrid = document.querySelector('.products-grid');
            if (productsGrid) {
                renderProductList(productsGrid, category);
            }
        });
    });
}

function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    return page || 'index.html';
}

function updateAuthUI() {
    let authStatus = document.getElementById('auth-status');
    if (!authStatus) {
        authStatus = document.createElement('div');
        authStatus.id = 'auth-status';
        authStatus.style.position = 'absolute';
        authStatus.style.top = '10px';
        authStatus.style.right = '20px';
        authStatus.style.display = 'flex';
        authStatus.style.gap = '10px';
        authStatus.style.alignItems = 'center';
        authStatus.style.zIndex = '101';
        document.body.appendChild(authStatus);
    }
    
    const currentUser = getCurrentUser();
    
    if (isAuthenticated()) {
        authStatus.innerHTML = `
            <span>Привет, ${currentUser.name || currentUser.login}!</span>
            <button id="logout-btn" class="btn btn-small">Выйти</button>
        `;
        document.getElementById('logout-btn')?.addEventListener('click', logoutHandler);
    } else {
        authStatus.innerHTML = `
            <a href="reg.html" class="btn btn-small">Регистрация</a>
            <button id="login-btn" class="btn btn-small">Войти</button>
        `;
        document.getElementById('login-btn')?.addEventListener('click', showLoginModal);
    }
}

function showLoginModal() {
    const existingModal = document.getElementById('login-modal');
    if (existingModal) {
        existingModal.style.display = 'flex';
        return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'login-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" id="close-login">&times;</span>
            <h2>Вход в аккаунт</h2>
            <form id="login-form">
                <div class="form-group">
                    <label for="login-input">Логин</label>
                    <input type="text" id="login-input" required>
                </div>
                <div class="form-group">
                    <label for="password-input">Пароль</label>
                    <input type="password" id="password-input" required>
                </div>
                <button type="submit" class="btn">Войти</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#close-login')?.addEventListener('click', () => closeModal('login-modal'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal('login-modal');
    });
    modal.querySelector('#login-form')?.addEventListener('submit', loginHandler);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function initEffects() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature, .promo-item, .service-card, .product-card, .pricing-plan').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

function loginHandler(e) {
    e.preventDefault();
    const login = document.getElementById('login-input')?.value;
    const password = document.getElementById('password-input')?.value;
    
    if (!login || !password) {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    
    const result = loginUser(login, password);
    
    if (result.success) {
        alert('Вход успешен!');
        closeModal('login-modal');
        updateAuthUI();
        setTimeout(() => {
            window.location.reload();
        }, 100);
    } else {
        alert('Ошибка: ' + result.error);
    }
}

function logoutHandler() {
    logoutUser();
    alert('Вы вышли из аккаунта');
    window.location.reload();
}

window.bookProduct = function(productId) {
    if (!isAuthenticated()) {
        alert('Требуется авторизация!');
        showLoginModal();
        return;
    }
    alert(`Бронирование услуги ID: ${productId}\nФункция в разработке...`);
};

window.selectTariff = function(tariffId) {
    if (!isAuthenticated()) {
        alert('Требуется авторизация!');
        showLoginModal();
        return;
    }
    alert(`Выбран тариф: ${tariffId}\nФункция в разработке...`);
};

document.addEventListener('DOMContentLoaded', function() {
    initAuth();
    updateAuthUI();
    initEffects();
    
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'login.html':
            const loginForm = document.getElementById('login-form');
            loginForm?.addEventListener('submit', loginHandler);
            break;
            
        case 'reg.html':
            const registerForm = document.getElementById('register-form');
            registerForm?.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('name')?.value || '';
                const login = document.getElementById('login').value;
                const password = document.getElementById('password').value;
                
                const validation = validateForm(login, password);
                
                if (!validation.isValid) {
                    const errors = [];
                    if (validation.loginError) errors.push(validation.loginError);
                    if (validation.passwordError) errors.push(validation.passwordError);
                    alert('Ошибки:\n' + errors.join('\n'));
                    return;
                }
                
                const result = registerUser(login, password, name);
                
                if (result.success) {
                    alert('Регистрация успешна! Добро пожаловать, ' + (result.user.name || result.user.login));
                    window.location.href = 'index.html';
                } else {
                    alert('Ошибка: ' + result.error);
                }
            });
            
            const showLoginLink = document.getElementById('show-login');
            showLoginLink?.addEventListener('click', (e) => {
                e.preventDefault();
                showLoginModal();
            });
            break;
            
        case 'contacts.html':
            const feedbackForm = document.getElementById('feedback-form');
            feedbackForm?.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('name').value;
                const phone = document.getElementById('phone').value;
                const message = document.getElementById('message').value;
                
                console.log('Форма обратной связи:', { name, phone, message });
                alert('Спасибо! Ваше сообщение отправлено.');
                feedbackForm.reset();
            });
            break;
            
        case 'services.html':
            const productsGrid = document.querySelector('.products-grid');
            if (productsGrid) {
                renderProductList(productsGrid);
                
                const filtersContainer = document.querySelector('.products-section');
                if (filtersContainer) {
                    initProductFilters(filtersContainer);
                }
            }
            
            const pricingTable = document.querySelector('.pricing-table');
            if (pricingTable) {
                pricingTable.innerHTML = tariffs.map(tariff => `
                    <div class="pricing-plan ${tariff.popular ? 'popular' : ''}">
                        ${tariff.popular ? '<div class="popular-badge">Популярный</div>' : ''}
                        <h3>${tariff.name}</h3>
                        <div class="price">${tariff.price} руб/${tariff.period}</div>
                        <ul>
                            ${tariff.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                        <button class="btn" onclick="selectTariff('${tariff.id}')">Выбрать</button>
                    </div>
                `).join('');
            }
            break;
            
        case 'product.html':
            const container = document.querySelector('.main');
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');
            
            if (productId && container) {
                container.innerHTML = renderProductDetails(productId);
            } else {
                container.innerHTML = `
                    <section class="page-header">
                        <div class="container">
                            <h1>Ошибка</h1>
                            <p>ID услуги не указан.</p>
                            <a href="services.html" class="btn">Вернуться к услугам</a>
                        </div>
                    </section>
                `;
            }
            break;
            
        case 'index.html':
        default:
            const heroSection = document.querySelector('.hero');
            if (heroSection && isAuthenticated()) {
                const currentUser = getCurrentUser();
                const welcomeMsg = document.createElement('div');
                welcomeMsg.className = 'welcome-message';
                welcomeMsg.style.marginTop = '1rem';
                welcomeMsg.style.fontSize = '1.2rem';
                welcomeMsg.innerHTML = `<p>👋 Добро пожаловать, ${currentUser.name || currentUser.login}! Готовы к игре?</p>`;
                heroSection.appendChild(welcomeMsg);
            }
            break;
    }
});