const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const stopBtn = document.getElementById('stop');
const timeButtons = document.querySelectorAll('.timechoose button');
const openPlantModalBtn = document.getElementById('openPlantModal');
const plantModal = document.getElementById('plantModal');
const closeModalBtn = document.querySelector('.close-modal');
const plantOptions = document.querySelectorAll('.plant-option');
const musicOptions = document.querySelectorAll('.music-option');
const selectedPlantSpan = document.getElementById('selectedPlant');
const selectedMusicSpan = document.getElementById('selectedMusic');
const plantStages = document.querySelectorAll('.plant_stage');
const wrapper = document.getElementById('wrapper');
const page = document.getElementById('page');
const timerchoose = document.getElementById('timechoose');
const choosewidjet = document.getElementById('plant');
const modalcont = document.getElementById('modalcontant');
const modalhead = document.getElementById('modalhead');
const selplant = document.getElementById('selplant');
const timertitle = document.getElementById('timer-title');
const sidemenu = document.getElementById('menu_content');
const menuhandler = document.getElementById('menu_handle');
const handlearrow = document.querySelectorAll('.menu_handle i');
let currentMusic = null;
let totalSeconds = 1800;
let initialTime = 1800;
let timerInterval = null;
let isRunning = false;
let selectedPlant = null;
let selectedMusic = null;
let menuvisible = false;
//narcissus
let narcissusVisual = ['timer_title', 'wrapper', 'selected-plant-display', 'page', 'modal-header', 'modal-content', 'timechoose', 'plant', 'timer_clock', 'plant-option', 'plant-option', 'plant-option', 'music-option', 'music-option', 'music-option', 'music-option'];
//seastones
let seastonesVisual = ['timer_title_sea', 'wrapper_sea', 'selected-plant-display-sea', 'page_sea', 'modal-header-sea', 'modal-content-sea', 'timechoose_sea', 'plant_sea', 'timer_clock_sea', 'plant-option-sea', 'plant-option-sea', 'plant-option-sea', 'music-option-sea', 'music-option-sea', 'music-option-sea', 'music-option-sea'];
let themeObjects = [timertitle, wrapper, selplant, page, modalhead, modalcont, timerchoose, choosewidjet, timerDisplay, plantOptions[0], plantOptions[1], plantOptions[2], musicOptions[0], musicOptions[1], musicOptions[2], musicOptions[3]];
for (let i = 0; i < seastonesVisual.length; i++) {
    themeObjects[i].classList.remove(seastonesVisual[i]);

}


//running man
let runningmanVisual = ['timer_title_run', 'wrapper_run', 'selected-plant-display-run', 'page_run', 'modal-header-run', 'modal-content-run', 'timechoose_run', 'plant_run', 'timer_clock_run', 'plant-option-run', 'plant-option-run', 'plant-option-run', 'music-option-run', 'music-option-run', 'music-option-run', 'music-option-run'];
for (let i = 0; i < seastonesVisual.length; i++) {
    themeObjects[i].classList.remove(runningmanVisual[i]);

}
updateTimerDisplay();
updatePlantStage();
timeButtons[2].classList.add('active');

const PlantMusicDictionary = {
    narcissus: document.getElementById('narcissusmusic'),
    seastones: document.getElementById('yellowmusic'),
    running: document.getElementById('runningman')
};

function MenuVisibility() {
    if (!menuvisible) {
        sidemenu.style.display = 'flex';
        menuvisible = true;
        handlearrow[0].style.display = 'none';
        handlearrow[1].style.display = 'block';
    }
    else {
        sidemenu.style.display = 'none';
        menuvisible = false;
        handlearrow[1].style.display = 'none';
        handlearrow[0].style.display = 'block';
    }
}
menuhandler.addEventListener("click", MenuVisibility);
function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (totalSeconds < 300) {
        timerDisplay.style.color = '#ffccbc';
        timerDisplay.style.textShadow = '0 0 10px rgba(255, 204, 188, 0.5)';
    } else {
        timerDisplay.style.color = '#c8e6c9';
        timerDisplay.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
    }

    updatePlantStage();
}

function updatePlantStage() {
    const progress = totalSeconds / initialTime;

    plantStages.forEach(stage => stage.classList.remove('active'));

    let activeStage;
    if (progress >= 0.75) {
        activeStage = plantStages[0]; // Первая стадия (75-100%)
    } else if (progress >= 0.5) {
        activeStage = plantStages[1]; // Вторая стадия (50-75%)
    } else if (progress >= 0.25) {
        activeStage = plantStages[2]; // Третья стадия (25-50%)
    } else {
        activeStage = plantStages[3]; // Четвертая стадия (0-25%)
    }

    activeStage.classList.add('active');
}

//Эту функцию надо полностью поменять
function PlayMusic(plantType) {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }

    const song = PlantMusicDictionary[plantType];
    if (song) {
        song.volume = 0.5;
        currentMusic = song;

        if (isRunning) {
            const playPromise = song.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log("Музыка успешно воспроизводится");
                }).catch(error => {
                    console.log("Ошибка воспроизведения:", error);
                });
            }
        }
    }
    changeTheme(plantType);
}
function changeTheme(plantType) {
    if (plantType == 'seastones') {
        for (let i = 0; i < seastonesVisual.length; i++) {
            themeObjects[i].classList.remove(runningmanVisual[i]);

        }
        for (let i = 0; i < seastonesVisual.length; i++) {
            themeObjects[i].classList.remove(narcissusVisual[i]);

        }
        for (let i = 0; i < seastonesVisual.length; i++) {
            themeObjects[i].classList.add(seastonesVisual[i]);

        }
        document.body.style.background = '#0c2159ff';
        startBtn.style.background = 'linear-gradient(180deg,  #0090b4ff 0%, #00FFDE 100%)';
        stopBtn.style.background = 'linear-gradient(180deg,  #0065F8 0%, #00CAFF 100%)';
        resetBtn.style.background = 'linear-gradient(180deg,  #0065F8 0%, #6d3df2ff 100%)'; //#00FFDE #00CAFF #4300FF #0065F8


    }
    else if (plantType == 'narcissus') {
        for (let i = 0; i < seastonesVisual.length; i++) {
            themeObjects[i].classList.remove(runningmanVisual[i]);

        }
        for (let i = 0; i < seastonesVisual.length; i++) {
            themeObjects[i].classList.remove(seastonesVisual[i]);

        }
        for (let i = 0; i < seastonesVisual.length; i++) {
            themeObjects[i].classList.add(narcissusVisual[i]);

        }
        document.body.style.background = 'linear-gradient(135deg, #0c291f 0%, #143727 100%)';
        startBtn.style.background = 'linear-gradient(180deg, #2e7d4d 0%, #266d41 100%)';
        stopBtn.style.background = 'linear-gradient(180deg, #5d4037 0%, #4e342e 100%)';
        resetBtn.style.background = 'linear-gradient(180deg, #2d5a42 0%, #234735 100%)';

    }
    else if (plantType == 'running') {
        for (let i = 0; i < seastonesVisual.length; i++) {
            themeObjects[i].classList.add(runningmanVisual[i]);

        }
        for (let i = 0; i < seastonesVisual.length; i++) {
            themeObjects[i].classList.remove(seastonesVisual[i]);

        }
        for (let i = 0; i < seastonesVisual.length; i++) {
            themeObjects[i].classList.remove(narcissusVisual[i]);

        }
        document.body.style.background = 'linear-gradient(180deg,  #f8e300f3 0%, #ff6600ff 100%)';
        startBtn.style.background = 'linear-gradient(180deg,  #6700f83f 0%, #ff6600ff 100%)';
        stopBtn.style.background = 'linear-gradient(180deg,  #6700f82d 0%, #ff6600ff 100%)';
        resetBtn.style.background = 'linear-gradient(180deg,  #6700f879 0%, #f2643dff 100%)'; //#00FFDE #00CAFF #4300FF #0065F8


    }
}
function startTimer() {
    if (isRunning) return;

    isRunning = true;
    startBtn.disabled = true;

    if (selectedPlant) {
        PlayMusic(selectedPlant);
    }
    else {
        alert("Выберите режим");
    }

    timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            isRunning = false;
            startBtn.disabled = false;

            if (currentMusic) {
                currentMusic.pause();
                currentMusic.currentTime = 0;
            }
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.disabled = false;

    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }

    const activeTimeBtn = document.querySelector('.timechoose button.active');
    if (activeTimeBtn) {
        initialTime = parseInt(activeTimeBtn.dataset.time);
        totalSeconds = initialTime;
    } else {
        initialTime = 1800;
        totalSeconds = 1800;
    }

    updateTimerDisplay();
}

function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.disabled = false;

    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
stopBtn.addEventListener('click', stopTimer);

timeButtons.forEach(button => {
    button.addEventListener('click', function () {
        timeButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        if (!isRunning) {
            initialTime = parseInt(this.dataset.time);
            totalSeconds = initialTime;
            updateTimerDisplay();
        }
    });
});

openPlantModalBtn.addEventListener('click', function () {
    plantModal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', function () {
    plantModal.style.display = 'none';
});

// Закрытие модального окна при клике вне его
window.addEventListener('click', function (event) {
    if (event.target === plantModal) {
        plantModal.style.display = 'none';
    }
});
/*
plantOptions.forEach(option => {
    option.addEventListener('click', function () {
        plantOptions.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');

        selectedPlant = this.dataset.plant;
        const plantName = this.querySelector('h3').textContent;

        selectedPlantSpan.textContent = plantName;
        selectedMusicSpan.textContent = MusicName;

        openPlantModalBtn.textContent = `${plantName} + ${MusicName} ✓`;

        updatePlantImages(selectedPlant);
        PlayMusic(selectedPlant);

        setTimeout(() => {
            plantModal.style.display = 'none';
        }, 1000);
    });
});
*/
function updatePlantImages(plantType) {
    const plantImages = {
        narcissus: [
            'img/plant1.png',
            'img/plant1_2.png',
            'img/plant1_3.png',
            'img/plant1_4.png'
        ],
        seastones: [
            'img/plant2_1.png',
            'img/plant2_2.png',
            'img/plant2_3.png',
            'img/plant2_4.png'
        ],
        running: [
            'img/plant3_1.png',
            'img/plant3_2.png',
            'img/plant3_3.png',
            'img/plant3_4.png'
        ]

    };

    if (plantImages[plantType]) {
        plantStages.forEach((stage, index) => {
            if (plantImages[plantType][index]) {
                stage.src = plantImages[plantType][index];
            }
        });
    }
}

// ГОРЯЧИЕ КЛАВИШИ
document.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
        event.preventDefault();
        if (isRunning) {
            stopTimer();
        } else {
            startTimer();
        }
    }
});