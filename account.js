document.addEventListener('DOMContentLoaded', function () {
    // Проверка авторизации
    if (!authSystem.isLoggedIn()) {
        window.location.href = 'login.html';
    }
    let currentUser = authSystem.getCurrentUser();
    let currentProfile = authSystem.getCurrentUserProfile();

    // Форматирование времени
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}ч ${minutes}м`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    // Загрузка профиля
    function loadProfile() {
        document.getElementById('username').textContent = currentUser.username;
        document.getElementById('email').textContent = currentUser.email;

        if (currentProfile) {
            // Аватар
            if (currentProfile.avatar) {
                document.getElementById('avatarImage').src = currentProfile.avatar;
            } else {
                document.getElementById('avatarImage').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.username)}&background=2d572c&color=fff&size=200`;
            }

            // Биография
            if (currentProfile.bio) {
                document.getElementById('bioText').textContent = currentProfile.bio;
            }
            /*
                            // Статистика
                            if (currentProfile.stats) {
                                document.getElementById('narcissusTime').textContent = formatTime(currentProfile.stats.narcissusTime);
                                document.getElementById('seastonesTime').textContent = formatTime(currentProfile.stats.seastonesTime);
                                document.getElementById('runningTime').textContent = formatTime(currentProfile.stats.runningTime);
                                document.getElementById('totalSessions').textContent = currentProfile.stats.totalSessions || 0;
                            }
            
                            */
        }
    }

    // Загрузка аватара
    document.getElementById('avatarInput').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showMessage('Размер файла не должен превышать 5 МБ', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                const img = document.getElementById('avatarImage');
                img.src = event.target.result;

                const result = authSystem.updateUserProfile(currentUser.id, {
                    avatar: event.target.result
                });

                if (result.success) {
                    showMessage('Аватар обновлен!', 'success');
                }
            };
            reader.readAsDataURL(file);
        }
    });


    // Редактирование биографии
    function toggleBioEdit() {
        document.getElementById('bioDisplay').style.display = 'none';
        document.getElementById('bioEdit').style.display = 'block';
        document.getElementById('bioTextarea').value = document.getElementById('bioText').textContent;
        if (document.getElementById('bioText').textContent === 'Расскажите о себе...') {
            document.getElementById('bioTextarea').value = '';
        }
    }

    function cancelBioEdit() {
        document.getElementById('bioDisplay').style.display = 'block';
        document.getElementById('bioEdit').style.display = 'none';
    }

    function saveBio() {
        const bioText = document.getElementById('bioTextarea').value.trim();

        const result = authSystem.updateUserProfile(currentUser.id, {
            bio: bioText
        });

        if (result.success) {
            document.getElementById('bioText').textContent = bioText || 'Расскажите о себе...';
            cancelBioEdit();
            showMessage('Биография обновлена!', 'success');
        }
    }

    function showMessage(text, type) {
        const msg = document.getElementById('message');
        msg.textContent = text;
        msg.className = 'message ' + type;
        msg.style.display = 'block';

        setTimeout(() => {
            msg.style.display = 'none';
        }, 3000);
    }
    function saveProfile() {
    showMessage('Изменения сохранены', 'success');
}
window.saveProfile = saveProfile;
window.toggleBioEdit = toggleBioEdit;
window.cancelBioEdit = cancelBioEdit;
window.saveBio = saveBio;
    // Загрузка при старте
    loadProfile();


});

