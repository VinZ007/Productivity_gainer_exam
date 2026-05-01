let hor = 0;
let vert = -1;
let add = false;   // not used, but kept for potential expansion
let del = false;
let isDead = false;
const scorespan = document.querySelector(".score");
const scorespan_g = document.querySelector(".score_g");
let score = 0;
const gameov = document.querySelector('.game_over');
const win = document.querySelector('.win');
const game_wind = document.querySelector(".wind");
const restart = document.querySelector('#restart');
const win_restart = document.querySelector('.restart');
const start_button = document.querySelector('.start');
const stop_button = document.querySelector('.stop');

window.addEventListener('keydown', e => {
  if (e.code === 'KeyW' && vert === 0) { vert = -1; hor = 0; }
  if (e.code === 'KeyS' && vert === 0) { vert = 1; hor = 0; }
  if (e.code === 'KeyA' && hor === 0) { hor = -1; vert = 0; }
  if (e.code === 'KeyD' && hor === 0) { hor = 1; vert = 0; }
});

restart.addEventListener('click', () => { location.reload(); });
stop_button.addEventListener('click', () => { location.reload(); });
win_restart.addEventListener('click', () => { location.reload(); });

// ---------- BodyPart, Snake, Field, ApplePart, PoisonPart ----------

class BodyPart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.lx = x;
    this.ly = y;
  }
}

class Snake {
  constructor(x, y, size) {
    this.parts = [new BodyPart(x, y)];
    this.head = this.parts[0];
    this.tail = this.parts[0];
    this.size = size;
  }

  move() {
    let newX = this.head.x + hor;
    let newY = this.head.y + vert;

    if (newX === this.size) newX = 0;
    else if (newX === -1) newX = this.size - 1;
    else if (newY === this.size) newY = 0;
    else if (newY === -1) newY = this.size - 1;

    for (let part of this.parts) {
      part.lx = part.x;
      part.ly = part.y;
      part.x = newX;
      part.y = newY;
      newX = part.lx;
      newY = part.ly;
    }
  }

  addPart() {
    let t = new BodyPart(this.tail.lx, this.tail.ly);
    this.tail = t;
    this.parts.push(t);
  }

  deletePart() {
    if (this.parts.length > 1) {
      this.parts.pop();
      this.tail = this.parts[this.parts.length - 1];
    }
  }
}

class Field {
  constructor(size, cells) {
    this.size = size;
    this.snake = new Snake(Math.floor(size / 2), Math.floor(size / 2), size);
    this.cells = cells;

    // Основные массивы яблок и ядов
    this.apples = [new ApplePart(
      Math.floor(Math.random() * this.size),
      Math.floor(Math.random() * this.size)
    )];
    this.poisons = [new PoisonPart(
      Math.floor(Math.random() * this.size),
      Math.floor(Math.random() * this.size)
    )];

    this.isGameOver = false;   // флаг остановки

    // Интервалы спавна
    this.appleInterval = setInterval(() => {
      if (this.apples.length < 5) this.createApple();
    }, 3000);

    this.poisonInterval = setInterval(() => {
      if (this.poisons.length < 7) this.createPoison();
    }, 6000);

    this.draw();
  }

  createPoison() {
    const x = Math.floor(Math.random() * this.size);
    const y = Math.floor(Math.random() * this.size);
    this.poisons.push(new PoisonPart(x, y));
  }

  createApple() {
    const x = Math.floor(Math.random() * this.size);
    const y = Math.floor(Math.random() * this.size);
    this.apples.push(new ApplePart(x, y));
  }

  update() {
    if (this.isGameOver) return;   // не двигаемся после завершения игры

    this.snake.move();

    // Проверка поедания яблок
    for (let i = 0; i < this.apples.length; i++) {
      const apple = this.apples[i];
      if (apple.x === this.snake.head.x && apple.y === this.snake.head.y) {
        this.snake.addPart();
        score++;
        scorespan.innerHTML = score;
        scorespan_g.innerHTML = score;
        this.apples.splice(i, 1);
        add = true;
      }
    }

    // Проверка поедания яда
    for (let i = 0; i < this.poisons.length; i++) {
      const poison = this.poisons[i];
      if (poison.x === this.snake.head.x && poison.y === this.snake.head.y) {
        // Не даём удалить голову (длина не может стать 0)
        if (this.snake.parts.length > 1) {
          this.snake.deletePart();
        }
        score--;
        scorespan.innerHTML = score;
        scorespan_g.innerHTML = score;
        this.poisons.splice(i, 1);
        del = true;
      }
    }

    // Столкновение с собственным телом
    for (let i = 1; i < this.snake.parts.length; i++) {
      if (this.snake.parts[0].x === this.snake.parts[i].x &&
          this.snake.parts[0].y === this.snake.parts[i].y) {
        this.endGame('gameover');
        return;
      }
    }

    // Проверка победы
    if (score >= 10) {
      this.endGame('win');
    }
  }

  endGame(type) {
    this.isGameOver = true;
    clearInterval(this.appleInterval);
    clearInterval(this.poisonInterval);
    if (type === 'gameover') {
      gameov.classList.remove("hidden");
    } else if (type === 'win') {
      win.classList.remove("hidden");
    }
  }

  draw() {
    // Сброс всех клеток
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.cells[i][j].className = 'cell';
      }
    }

    // Змейка
    this.snake.parts.forEach(part => {
      this.cells[part.y][part.x].classList.add('cell-body');
    });

    // Яблоки (не рисуем на теле змейки)
    for (let apple of this.apples) {
      const cell = this.cells[apple.y]?.[apple.x];
      if (cell && !cell.classList.contains('cell-body')) {
        cell.classList.add('cell-apple');
      }
    }

    // Яды
    for (let poison of this.poisons) {
      const cell = this.cells[poison.y]?.[poison.x];
      if (cell && !cell.classList.contains('cell-body')) {
        cell.classList.add('cell-poison');
      }
    }
  }

  do() {
    this.update();
    this.draw();
  }
}

// Запасные части (Apple/Poison классы больше не нужны)

class ApplePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class PoisonPart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}