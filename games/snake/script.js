const SIZE = 15;

const gameDiv = document.querySelector('.game');

let temp = '';
for (let i = 0; i < SIZE * SIZE; i++) {
  temp += '<div class="cell"></div>';
}
gameDiv.innerHTML = temp;

let cells = [];
for (let i = 0; i < SIZE; i++) {
  let row = [];
  for (let j = 0; j < SIZE; j++) {
    row.push(gameDiv.children[SIZE * i + j]);
  }
  cells.push(row);
}

let field = new Field(SIZE, cells);

let gameInterval = setInterval(() => {
  field.do();
  // Останавливаем интервал, если игра завершена
  if (field.isGameOver) {
    clearInterval(gameInterval);
  }
}, 100);