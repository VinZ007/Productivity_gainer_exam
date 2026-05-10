const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const stopBtn = document.getElementById('stop');
const timeButtons = document.querySelectorAll('.sleep-timechoose button');
const openPlantModalBtn = document.getElementById('openPlantModal');
const plantModal = document.getElementById('plantModal');
const plantImage = document.getElementById('plantStage1'); // одна картинка

const closeModalBtn = document.querySelector('.close-modal');
const applyBtn = document.getElementById('ApplySelection');
const galleryDiv = document.getElementById('gallery');
const fullscreenDiv = document.getElementById('fullscreen');
const previewAudio = document.getElementById('previewAudio');
const npPlayBtn = document.getElementById('npPlayBtn');
const npPlayIcon = document.getElementById('npPlayIcon');
const nowPlayingTitle = document.getElementById('nowPlayingTitle');
const nowPlayingSub = document.getElementById('nowPlayingSub');
const npBarFill = document.getElementById('npBarFill');
const npTime = document.getElementById('npTime');

let currentMusic = null;
let totalSeconds = 1800;
let initialTime = 1800;
let timerInterval = null;
let isRunning = false;
let selectedWidget = null;
let selectedMusic = null;
let menuvisible = false;

const widgetsData = {
    fish: {
        name: 'Art Deco',
        subtitle: 'A1',
        music: document.getElementById('fishmusic'),
        images: ['img/sleep_helper/art_deco.png', 'img/sleep_helper/private_album.png'],
    },
    shark: {
        name: 'Private',
        subtitle: 'A2',
        music: document.getElementById('privatemusic'),
        images: ['img/sleep_helper/private.png', 'img/sleep_helper/private_album.png'],
    },
    scolo: {
        name: 'Your Mother Was Cheaper',
        subtitle: 'A3',
        music: document.getElementById('scolomusic'),
        images: ['img/sleep_helper/scolo.png', 'img/sleep_helper/private_album.png'],
    },
    japan: {
        name: '505',
        subtitle: 'A4',
        music: document.getElementById('japanmusic'),
        images: ['img/sleep_helper/505.png', 'img/sleep_helper/505_album.png'],
    },
    raven: {
        name: 'Do You Wanna Come Over',
        subtitle: 'A5',
        music: document.getElementById('ravenmusic'),
        images: ['img/sleep_helper/fish.png', 'img/sleep_helper/private_album.png'],
    },
    jellyfish: {
        name: 'Tattoos',
        subtitle: 'A6',
        music: document.getElementById('jellyfishmusic'),
        images: ['img/sleep_helper/tattoos.png', 'img/sleep_helper/private_album.png'],
    },
    chihiro: {
        name: 'CHIHIRO',
        subtitle: 'A7',
        music: document.getElementById('chihiromusic'), 
        images: ['img/sleep_helper/chihiro.png', 'img/sleep_helper/private_album.png'],
    }
};

function updatePlantImages(plantType) {
    if (widgetsData[plantType]) {
        plantImage.src = widgetsData[plantType].images[0];
    }
}

function initializeGallery() {
    galleryDiv.innerHTML = '';

    Object.keys(widgetsData).forEach((key, index) => {
        const widget = widgetsData[key];
        const albumCard = document.createElement('div');
        albumCard.className = 'album-card';
        albumCard.dataset.music = key;
        albumCard.dataset.index = index;
        coverImage = widget.images[1];
        
        albumCard.innerHTML = `
            <div class="album-cover">
                <div class="ac-inner">
                    <img src="${coverImage}" alt="Album cover for ${widget.name}">
                </div>
            </div>
            <div class="album-label" data-tt="album_${key}">${widget.name}</div>
        `;
        
        albumCard.addEventListener('click', () => selectAlbum(index, key, albumCard, true));
        albumCard.addEventListener('mouseenter', () => hoverAlbum(index, key, albumCard));
        albumCard.addEventListener('mouseleave', stopHoverPreview);
        galleryDiv.appendChild(albumCard);
    });
    const firstCard = galleryDiv.querySelector('.album-card');
    if (firstCard) {
        selectAlbum(parseInt(firstCard.dataset.index, 10), firstCard.dataset.music, firstCard, false);
        setTimeout(() => {
            galleryDiv.scrollLeft = Math.max(0, firstCard.offsetLeft - 40);
        }, 50);
    }
    nowPlayingTitle.textContent = 'Select a track';
    nowPlayingTitle.setAttribute('data-tt', 'selectTrack');
}

function applyCoverFlow(selectedIndex) {
    const cards = galleryDiv.querySelectorAll('.album-card');
    cards.forEach(card => {
        card.classList.remove('left-far', 'left', 'center', 'right', 'right-far', 'hidden');
        const index = parseInt(card.dataset.index, 10);
        const diff = index - selectedIndex;

        if (diff === 0) card.classList.add('center');
        else if (diff === -1) card.classList.add('left');
        else if (diff === 1) card.classList.add('right');
        else if (diff === -2) card.classList.add('left-far');
        else if (diff === 2) card.classList.add('right-far');
    });
}

function selectAlbum(index, key, element, playPreview) {
    document.querySelectorAll('.album-card').forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    selectedWidget = key;
    selectedMusic = key;
    applyCoverFlow(index);

    const widget = widgetsData[key];
    nowPlayingTitle.textContent = widget.name;
    nowPlayingTitle.setAttribute('data-tt', `album_${key}`);
    nowPlayingSub.textContent = widget.subtitle;
    document.getElementById('nowPlayingProgress').style.display = 'flex';
    updatePreviewButton(key);
    updatePlantImages(key);

    if (playPreview) startPreview(key);
}

function hoverAlbum(index, key, element) {
    selectAlbum(index, key, element, false);
    startPreview(key);
}

function startPreview(key) {
    const widget = widgetsData[key];
    if (!widget || !widget.music) return;
    
    previewAudio.src = widget.music.src;
    previewAudio.currentTime = 0;
    previewAudio.play().catch(() => {});
    npPlayBtn.style.display = 'block';
    npPlayBtn.classList.add('playing');
    npPlayIcon.className = 'bi bi-pause-fill';
}

function stopHoverPreview() {
    if (!previewAudio.paused) {
        previewAudio.pause();
        npPlayBtn.classList.remove('playing');
        npPlayIcon.className = 'bi bi-play-fill';
    }
}

function updatePreviewButton(key) {
    npPlayBtn.style.display = 'block';
    npPlayBtn.classList.remove('playing');
    npPlayIcon.className = 'bi bi-play-fill';
    npTime.textContent = '0:00';
    npBarFill.style.width = '0%';
}

npPlayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!selectedMusic) {
        // alert('Please select a track');
        return;
    }
    const widget = widgetsData[selectedMusic];
    if (!widget || !widget.music) return;
    
    if (npPlayBtn.classList.contains('playing')) {
        previewAudio.pause();
        npPlayBtn.classList.remove('playing');
        npPlayIcon.className = 'bi bi-play-fill';
    } else {
        previewAudio.src = widget.music.src;
        previewAudio.currentTime = 0;
        previewAudio.play();
        npPlayBtn.classList.add('playing');
        npPlayIcon.className = 'bi bi-pause-fill';
    }
});

previewAudio.addEventListener('timeupdate', () => {
    const duration = previewAudio.duration || 30;
    const percent = (previewAudio.currentTime / duration) * 100;
    npBarFill.style.width = percent + '%';
    const minutes = Math.floor(previewAudio.currentTime / 60);
    const seconds = Math.floor(previewAudio.currentTime % 60);
    npTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

previewAudio.addEventListener('ended', () => {
    npPlayBtn.classList.remove('playing');
    npPlayIcon.className = 'bi bi-play-fill';
});

function setPlantRotation(rotate) {
    if (rotate) {
        plantImage.classList.add('rotating');
    } else {
        plantImage.classList.remove('rotating');
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function playMusic() {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }
    if (selectedMusic && widgetsData[selectedMusic] && widgetsData[selectedMusic].music) {
        currentMusic = widgetsData[selectedMusic].music;
        currentMusic.play().catch(() => {});
    }
}

function startTimer() {
    if (isRunning) return;
    if (!selectedWidget || !selectedMusic) {
        alert('Please select a widget and music');
        return;
    }
    isRunning = true;
    startBtn.disabled = true;
    setPlantRotation(true);  // 🔄 запуск вращения
    
    playMusic();
    
    timerInterval = setInterval(() => {
        totalSeconds--;
        updateTimerDisplay();
        
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            isRunning = false;
            startBtn.disabled = false;
            setPlantRotation(false); // остановка по завершении
            if (currentMusic) currentMusic.pause();
            alert('Sleep session completed!');
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.disabled = false;
    setPlantRotation(false); // остановка вращения
    
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }
    
    const activeTimeBtn = document.querySelector('.sleep-timechoose button.active');
    if (activeTimeBtn) {
        totalSeconds = parseInt(activeTimeBtn.dataset.time);
        initialTime = totalSeconds;
    } else {
        totalSeconds = 1800;
        initialTime = 1800;
    }
    updateTimerDisplay();
}

function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.disabled = false;
    setPlantRotation(false); // остановка вращения
    
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }
}



startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
stopBtn.addEventListener('click', stopTimer);

timeButtons.forEach(button => {
    button.addEventListener('click', function() {
        if (isRunning) return;
        timeButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        totalSeconds = parseInt(this.dataset.time);
        initialTime = totalSeconds;
        updateTimerDisplay();
    });
});

openPlantModalBtn.addEventListener('click', () => {
    plantModal.showModal();
});

closeModalBtn.addEventListener('click', () => {
    plantModal.close();
});

applyBtn.addEventListener('click', () => {
    if (!selectedWidget || !selectedMusic) {
        alert('Please select a widget and music');
        return;
    }
    const widget = widgetsData[selectedWidget];
    openPlantModalBtn.textContent = widget.name;
    openPlantModalBtn.setAttribute('data-tt', `album_${selectedWidget}`);
    plantModal.close();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && plantModal.open) {
        plantModal.close();
    }
});

// Меню
const menuHandle = document.getElementById('menu_handle');
const menuContent = document.getElementById('menu_content');
const userBtn = document.querySelector('#userBtn');
const logoutBtn = document.getElementById('logoutBtn');

menuHandle.addEventListener('click', () => {
    menuvisible = !menuvisible;
    menuContent.style.display = menuvisible ? 'flex' : 'none';
    document.querySelectorAll('.menu_handle i').forEach((icon, i) => {
        icon.style.display = (i === 0 && menuvisible) || (i === 1 && !menuvisible) ? 'none' : 'block';
    });
});

if (typeof authSystem !== 'undefined' && authSystem.isLoggedIn()) {
    if (userBtn) userBtn.style.display = 'block';
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            authSystem.logout();
            window.location.reload();
        });
    }
} else {
    if (userBtn) userBtn.style.display = 'none';
}

const translations = {
    en: {
        timer_title: 'Sleep Helper',
        chooseWidget: 'Choose Your Widget',
        sectionMusic: 'Choose Music',
        applyBtn: 'Apply Selection',
        profile: 'Profile',
        productiveMode: 'Productivity Mode',

        // Альбомы
        album_fish: 'Art Deco',
        album_shark: 'Private',
        album_scolo: 'Your Mother Was Cheaper',
        album_japan: 'White Ferrari',
        album_raven: 'Scream My Name',
        album_jellyfish: 'Tattoos',
        album_chihiro: 'CHIHIRO',

        // UI элементы
        selectTrack: 'Select a track',
        langBtnLabel: 'Русский',
        //
        bmo: 'Feedback',
    },

    ru: {
        timer_title: 'Помощник сна',
        chooseWidget: 'Выбрать виджет',
        sectionMusic: 'Выберите музыку',
        applyBtn: 'Применить выбор',
        profile: 'Профиль',
        productiveMode: 'Режим продуктивности',

        // Альбомы
        album_fish: 'Art Deco',
        album_shark: 'Private',
        album_scolo: 'Your Mother Was Cheaper',
        album_japan: 'White Ferrari',
        album_raven: 'Scream My Name',
        album_jellyfish: 'Tattoos',
        album_chihiro: 'CHIHIRO',

        // UI элементы
        selectTrack: 'Выберите трек',
        langBtnLabel: 'English',
        bmo: 'Обратная связь',
    }
};


let currentLang = localStorage.getItem('pg_lang') || 'en';

function getItemTranslate(item) {
    if (translations[currentLang][item] != undefined) {
        return translations[currentLang][item];
    }
    else {
        return item;
    }
}


function applyTranslate() {
    document.querySelectorAll('[data-tt]').forEach(element => {
        const item = element.dataset.tt;
        const text = getItemTranslate(item);
        if (text !== undefined) element.textContent = text;
    });
    
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
        langBtn.textContent = getItemTranslate('langBtnLabel');
    }

    document.documentElement.lang = currentLang;
}

function toggleLanguage() {
    if (currentLang === 'en') {
        currentLang = 'ru';
    } else {
        currentLang = 'en';
    }
    localStorage.setItem('pg_lang', currentLang);
    applyTranslate();
}

document.getElementById('langToggleBtn').addEventListener('click', toggleLanguage);

document.addEventListener('DOMContentLoaded', () => {
    applyTranslate();
    initializeGallery();
    updateTimerDisplay();

    if (timeButtons.length > 1) timeButtons[1].click();

    const defaultWidget = Object.keys(widgetsData)[0];
    if (defaultWidget && widgetsData[defaultWidget]) {
        // Устанавливаем выбранный виджет по умолчанию
        selectedWidget = defaultWidget;
        selectedMusic = defaultWidget;
        updatePlantImages(defaultWidget);
    }
});