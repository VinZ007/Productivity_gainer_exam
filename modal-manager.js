const plantOptions = document.querySelectorAll('.plant-option');
const musicOptions = document.querySelectorAll('.music-option');
let selectedPlant = null;
let selectedMusic = null;

plantOptions.forEach(option => {
    option.addEventListener('click', function () {
        plantOptions.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');

        selectedPlant = this.dataset.plant;
        const plantName = this.querySelector('h3').textContent;

        selectedPlantSpan.textContent = plantName;
        

        openPlantModalBtn.textContent = `${plantName} +  `;

        updatePlantImages(selectedPlant);
        PlayMusic(selectedPlant);

        setTimeout(() => {
            plantModal.style.display = 'none';
        }, 1000);
    });
});