// ===================================
// TestGen AI - Authentication Module
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Селектори за поздравна порака и копчиња
    const userWelcome = document.getElementById('user-welcome');
    const userEmailDisplay = document.getElementById('user-email-display');
    const logoutBtn = document.getElementById('navbar-logout-btn');
    const navLoginLink = document.querySelector('a[href="#login"]');

    // 1. СЛЕДЕЊЕ НА СОСТОЈБАТА НА КОРИСНИКОТ (Auth State Changes)
    window.fbAuth.onAuthStateChanged(window.auth, (user) => {
        if (user) {
            console.log("Корисникот е најавен:", user.email);
            window.currentUser = user; // Го зачувуваме корисникот глобално

            // Прикажи ја поздравната порака и внеси го мејлот горе десно
            if (userWelcome && userEmailDisplay) {
                userEmailDisplay.textContent = user.email;
                userWelcome.style.display = 'inline-block';
            }

            // Прикажи го копчето за Logout
            if (logoutBtn) {
                logoutBtn.style.display = 'inline-block';
            }

            // Скриј го навигацискиот линк "Најава" за да не боде очи
            if (navLoginLink) navLoginLink.style.display = 'none';

            // Ако корисникот е заглавен на login страницата, прати го на генератор
            const loginPage = document.getElementById('login-page');
            if (loginPage && loginPage.style.display === 'block') {
                window.showPage('generator');
            }
        } else {
            console.log("Нема активна корисничка сесија.");
            window.currentUser = null;

            // Сокриј ги поздравната порака и Logout копчето
            if (userWelcome) userWelcome.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';

            // Врати го стандардниот линк за најава во менито
            if (navLoginLink) {
                navLoginLink.style.display = 'inline-block';
                navLoginLink.innerHTML = '<i class="bi bi-person"></i> Најава';
            }

            // Исчисти ја историјата од екранот бидејќи никој не е логиран
            const historyContainer = document.getElementById('history-container');
            if (historyContainer) historyContainer.innerHTML = '';
        }
    });

    // 2. СЛУШАТЕЛ ЗА LOGOUT КОПЧЕТО ОД NAVBAR
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            window.fbAuth.signOut(window.auth)
                .then(() => {
                    console.log("Успешен Logout.");
                    alert("Успешно се одјавивте.");
                    window.showPage('login');
                })
                .catch((error) => {
                    console.error("Грешка при одјава:", error);
                });
        });
    }

    // 3. TOGGLE ЛОГИКА ПОМЕЃУ LOGIN И REGISTER ФОРМИТЕ
    const loginContainer = document.getElementById('login-box-container');
    const registerContainer = document.getElementById('register-box-container');
    const goToRegister = document.getElementById('go-to-register');
    const goToLogin = document.getElementById('go-to-login');

    if (goToRegister && goToLogin) {
        goToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginContainer) loginContainer.style.display = 'none';
            if (registerContainer) registerContainer.style.display = 'block';
        });

        goToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            if (registerContainer) registerContainer.style.display = 'none';
            if (loginContainer) loginContainer.style.display = 'block';
        });
    }

    // 4. ЛОГИКА ЗА НАЈАВА ПРЕКУ ФОРМА (Email & Password)
    const loginForm = document.getElementById('firebase-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email')?.value || document.getElementById('email')?.value;
            const password = document.getElementById('login-password')?.value || document.getElementById('password')?.value;

            if (!email || !password) {
                alert('Ве молиме пополнете ги сите полиња за најава.');
                return;
            }

            window.fbAuth.signInWithEmailAndPassword(window.auth, email, password)
                .then((userCredential) => {
                    console.log('Успешна најава преку форма:', userCredential.user);
                    window.showPage('generator');
                })
                .catch((error) => {
                    console.error('Грешка при најава:', error.message);
                    alert('Неуспешна најава: Проверете ги вашите податоци.');
                });
        });
    }

    // 5. ЛОГИКА ЗА РЕГИСТРАЦИЈА ПРЕКУ ФОРМА (Email & Password)
    const registerForm = document.getElementById('firebase-register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('register-email')?.value;
            const password = document.getElementById('register-password')?.value;

            if (!email || !password) {
                alert('Ве молиме пополнете ги сите полиња за регистрација.');
                return;
            }

            if (password.length < 6) {
                alert('Лозинката мора да биде долга најмалку 6 карактери.');
                return;
            }

            window.fbAuth.createUserWithEmailAndPassword(window.auth, email, password)
                .then((userCredential) => {
                    console.log('Успешна регистрација на нов корисник:', userCredential.user);
                    alert('Профилот е успешно креиран!');
                    window.showPage('generator');
                })
                .catch((error) => {
                    console.error('Грешка при регистрација:', error.message);
                    alert('Грешка при регистрација: ' + error.message);
                });
        });
    }

    // 6. ЛОГИКА ЗА НАЈАВА СО GOOGLE
    const googleBtn = document.getElementById('google-login-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            window.fbAuth.signInWithPopup(window.auth, window.googleProvider)
                .then((result) => {
                    console.log('Успешна Google најава:', result.user);
                    window.showPage('generator');
                })
                .catch((error) => {
                    console.error('Грешка при Google најава:', error.message);
                    alert('Неуспешна најава со Google.');
                });
        });
    }
});