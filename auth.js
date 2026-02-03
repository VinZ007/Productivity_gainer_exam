const form = document.getElementById('registrationForm');
const errormas = document.getElementById('errorMessage');
const sucessmes = document.getElementById('successMessage');

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

    const result = authSystem.register(username, email, password);

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