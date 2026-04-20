class AuthSystem {
    constructor() {
        this.storageKey = 'usersXML';
        this.initializeSpace();
    }

    initializeSpace() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, `<?xml version="1.0" encoding="UTF-8"?><users></users>`);
        }
    }

    getXML() {
        return new DOMParser().parseFromString(localStorage.getItem(this.storageKey), "text/xml");
    }

    saveXML(xmlDocument) {
        localStorage.setItem(this.storageKey, new XMLSerializer().serializeToString(xmlDocument));
    }

    register(username, email, password) {
        const xmlDocument = this.getXML();
        const users = xmlDocument.getElementsByTagName('user');
        for (let i = 0; i < users.length; i++) {
            if (users[i].getElementsByTagName('email')[0].textContent === email) {
                return { success: false, message: 'Пользователь с таким email уже существует' };
            }
        }
        const newUser = xmlDocument.createElement('user');
        newUser.setAttribute('id', Date.now().toString());
        const user_name = xmlDocument.createElement('username');
        user_name.textContent = username;
        newUser.appendChild(user_name);
        const user_email = xmlDocument.createElement('email');
        user_email.textContent = email;
        newUser.appendChild(user_email);
        const user_password = xmlDocument.createElement('password');
        user_password.textContent = password;
        newUser.appendChild(user_password);
        


        //профиль
        const profile = xmlDocument.createElement('profile');

        const avatar = xmlDocument.createElement('avatar');
        avatar.textContent = '';
        profile.appendChild(avatar);


        const bio = xmlDocument.createElement('bio');
        bio.textContent = '';
        profile.appendChild(bio);

        // статы
        const stats = xmlDocument.createElement('stats');

        const createModeStats = (modeName) => {
            const mode = xmlDocument.createElement(modeName);
            const narcissus = xmlDocument.createElement('narcissus');
            narcissus.textContent = '0';
            mode.appendChild(narcissus);
            const seastones = xmlDocument.createElement('seastones');
            seastones.textContent = '0';
            mode.appendChild(seastones);
            const running = xmlDocument.createElement('running');
            running.textContent = '0';
            mode.appendChild(running);
            const sessions = xmlDocument.createElement('sessions');
            sessions.textContent = '0';
            mode.appendChild(sessions);
            return mode;
        };

        stats.appendChild(createModeStats('productiveGainer'));
        stats.appendChild(createModeStats('sleepHelper'));
        stats.appendChild(createModeStats('darkMode'));

        profile.appendChild(stats);
        newUser.appendChild(profile);
        xmlDocument.documentElement.appendChild(newUser);

        this.saveXML(xmlDocument);
        return { success: true, message: 'Регистрация успешна!' };
    }

    login(email, password) {
        const users = this.getXML().getElementsByTagName('user');
        for (let i = 0; i < users.length; i++) {
            if (users[i].getElementsByTagName('email')[0].textContent === email &&
                users[i].getElementsByTagName('password')[0].textContent === password) {
                localStorage.setItem('currentUserId', users[i].getAttribute('id'));
                localStorage.setItem('currentUsername', users[i].getElementsByTagName('username')[0].textContent);
                localStorage.setItem('currentEmail', email);
                return { success: true, message: 'Вход выполнен!' };
            }
        }
        return { success: false, message: 'Неверный email или пароль' };
    }

    logout() {
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('currentUsername');
        localStorage.removeItem('currentEmail');
    }

    isLoggedIn() {
        return localStorage.getItem('currentUserId') !== null;
    }

    getCurrentUser() {
        const id = localStorage.getItem('currentUserId');
        if (!id) return null;
        return {
            id: id,
            username: localStorage.getItem('currentUsername'),
            email: localStorage.getItem('currentEmail')
        };
    }
    getCurrentUserProfile() {
        const userId = localStorage.getItem('currentUserId');
        if (!userId) return null;

        const xmlDocument = this.getXML();
        const users = xmlDocument.getElementsByTagName('user');
        for (let i = 0; i < users.length; i++) {
            if (users[i].getAttribute('id') === userId) {
                const profile = users[i].getElementsByTagName('profile')[0];
                if (!profile) return null;

                const avatar = profile.getElementsByTagName('avatar')[0]?.textContent || '';
                const bio = profile.getElementsByTagName('bio')[0]?.textContent || '';

                const stats = profile.getElementsByTagName('stats')[0];
                const getModeStats = (modeName) => {
                    const mode = stats?.getElementsByTagName(modeName)[0];
                    if (!mode) return { narcissus: 0, seastones: 0, running: 0, sessions: 0 };
                    return {
                        narcissus: parseInt(mode.getElementsByTagName('narcissus')[0]?.textContent || '0'),
                        seastones: parseInt(mode.getElementsByTagName('seastones')[0]?.textContent || '0'),
                        running: parseInt(mode.getElementsByTagName('running')[0]?.textContent || '0'),
                        sessions: parseInt(mode.getElementsByTagName('sessions')[0]?.textContent || '0')
                    };
                };

                return {
                    avatar,
                    bio,
                    stats: {
                        productiveGainer: getModeStats('productiveGainer'),
                        sleepHelper: getModeStats('sleepHelper'),
                        darkMode: getModeStats('darkMode')
                    }
                };
            }
        }
        return null;
    }
    updateUserProfile(userId, profileData) {
    const xmlDoc = this.getXML();
    const users = xmlDoc.getElementsByTagName('user');

    for (let user of users) {
        if (user.getAttribute('id') === userId) {
            let profile = user.getElementsByTagName('profile')[0];
            
            if (!profile) {
                profile = xmlDoc.createElement('profile');
                user.appendChild(profile);
            }

            // Обновление аватара
            if (profileData.avatar !== undefined) {
                let avatar = profile.getElementsByTagName('avatar')[0];
                if (!avatar) {
                    avatar = xmlDoc.createElement('avatar');
                    profile.appendChild(avatar);
                }
                avatar.textContent = profileData.avatar;
            }

            // Обновление биографии
            if (profileData.bio !== undefined) {
                let bio = profile.getElementsByTagName('bio')[0];
                if (!bio) {
                    bio = xmlDoc.createElement('bio');
                    profile.appendChild(bio);
                }
                bio.textContent = profileData.bio;
            }

            // Обновление статистики (структура с режимами)
            if (profileData.stats) {
                let stats = profile.getElementsByTagName('stats')[0];
                if (!stats) {
                    stats = xmlDoc.createElement('stats');
                    profile.appendChild(stats);
                }

                const ensureMode = (modeName) => {
                    let mode = stats.getElementsByTagName(modeName)[0];
                    if (!mode) {
                        mode = xmlDoc.createElement(modeName);
                        stats.appendChild(mode);
                    }
                    return mode;
                };

               /* const updateModeStats = (modeNode, data) => {
                    const fields = ['narcissus', 'seastones', 'running', 'sessions'];
                    fields.forEach(field => {
                        if (data[field] !== undefined) {
                            let node = modeNode.getElementsByTagName(field)[0];
                            if (!node) {
                                node = xmlDoc.createElement(field);
                                modeNode.appendChild(node);
                            }
                            node.textContent = data[field].toString();
                        }
                    });
                };

                if (profileData.stats.productiveGainer) {
                    const mode = ensureMode('productiveGainer');
                    updateModeStats(mode, profileData.stats.productiveGainer);
                }
                if (profileData.stats.sleepHelper) {
                    const mode = ensureMode('sleepHelper');
                    updateModeStats(mode, profileData.stats.sleepHelper);
                }
                if (profileData.stats.darkMode) {
                    const mode = ensureMode('darkMode');
                    updateModeStats(mode, profileData.stats.darkMode);
                }*/
            }

            this.saveXML(xmlDoc);
            return { success: true, message: 'Профиль обновлён' };
        }
    }

    return { success: false, message: 'Пользователь не найден' };
}
}

const authSystem = new AuthSystem();

function ShowMessage(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => { element.style.display = 'none'; }, 7000);
}

const form = document.getElementById('registrationForm');
if (form) {
    const errormas = document.getElementById('errorMessage');
    const sucessmes = document.getElementById('successMessage');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordrepeat').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        if (username.length < 4) { ShowMessage(errormas, 'Имя пользователя должно содержать минимум 4 символа'); return; }
        if (password.length < 6) { ShowMessage(errormas, 'Пароль должен содержать минимум 6 символов'); return; }
        if (password !== passwordConfirm) { ShowMessage(errormas, 'Пароли не совпадают'); return; }
        if (!agreeTerms) { ShowMessage(errormas, 'Необходимо согласиться с правилами сервиса'); return; }

        const result = authSystem.register(username, email, password);
        if (result.success) {
            ShowMessage(sucessmes, result.message);
            form.reset();
            setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        } else {
            ShowMessage(errormas, result.message);
        }
    });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const result = authSystem.login(email, password);
        if (result.success) {
            window.location.href = 'Productivity_Gainer.html';
        } else {
            alert(result.message);
        }
    });
}