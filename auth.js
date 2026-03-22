const form = document.getElementById('registrationForm');
const errormas = document.getElementById('errorMessage');
const sucessmes = document.getElementById('successMessage');

class AuthSystem {
    constructor() {
        this.storageKey = 'usersXML';
        this.currentUserKey = 'currentUser';
    }

    initializeSpace() {
        if (!localStorage.getItem(this.storageKey)) {
            const xmlStruct = `<?xml version="1.0" encoding="UTF-8"?><users></users>`;
            localStorage.setItem(this.storageKey, xmlStruct);
        }
    }

    getXML() {
        const xmlStr = localStorage.getItem(this.storageKey);
        const parser = new DOMParser();
        return parser.parseFromString(xmlStr, "text/xml");

    }
    saveXML(xmlDocument) { //он получает данные из формы в виде строки эту строку переделывает в xml чтобы ее можно было сохранить и использовать, как мне надо
        const serializer = new XMLSerializer();
        const xmlStr = serializer.serializeToString(xmlDocument);
        return serializer.setItem(this.storageKey, xmlStr);
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
        newUser.setAttribute('id', Date.now().toLocaleString());


        const user_name = xmlDocument.createElement('username');
        user_name.textContent = username;
        newUser.appendChild(user_name);

        const user_email = xmlDocument.createElement('email');
        user_email.textContent = email;
        newUser.appendChild(user_email);

        const user_password = xmlDocument.createElement('password');
        user_password.textContent = password;
        newUser.appendChild(user_password);

        xmlDocument.documentElement.appendChild(newUser);
        this.saveXML(xmlDocument);
        return { success: true, message: 'Регистрация успешна!' };



    }

    login(email, password) {
        const xmlDoc = this.getXML();
        const users = xmlDoc.getElementsByTagName('user');
        for (let i = 0; i < users.length; i++) {
            if (users[i].getElementsByTagName('email')[0].textContent === email && users[i].getElementsByTagName('password')[0].textContent === password) {
                const username = users[i].getElementsByTagName('username')[0].textContent;
                const userId = users[i].getAttribute('id');

                const currentUser = {
                    id: userId,
                    username: username,
                    email: email
                };

                localStorage.setItem('currentUserId', currentUser.id);
                localStorage.setItem('currentUsername', currentUser.username);
                localStorage.setItem('currentEmail', currentUser.email);
                return { success: true, message: 'Вход выполнен!', user: currentUser };
            }
            else {
                return { success: false, message: 'Неверный email или пароль' };

            }
        }
    }

    logout() {
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('currentUsername');
        localStorage.removeItem('currentEmail');
        return { success: true, message: 'Выход выполнен' };
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
}





const authSystem = new AuthSystem();


function ShowMessage(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 7000);

}

form.addEventListener('submit', function (event) {
    event.preventDefault();
    errormas.style.display = 'none';
    sucessmes.style.display = 'none';
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordrepeat').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    if (username.length < 4) {
        ShowMessage(errormas, 'Имя пользователя должно содержать минимум 4 символа');
        return;
    }

    if (password.length < 6) {
        ShowMessage(errormas, 'Пароль должен содержать минимум 6 символов');
        return;
    }

    if (password !== passwordConfirm) {
        ShowMessage(errormas, 'Пароли не совпадают');
        return;
    }

    if (!agreeTerms) {
        ShowMessage(errormas, 'Необходимо согласиться с правилами сервиса');
        return;
    }

    const result = AuthSystem.register(username, email, password);

    if (result.success) {
        ShowMessage(sucessmes, result.message);
        form.reset();

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    } else {
        ShowMessage(errormas, result.message);
    }
})