const stageBg = document.querySelector('.stage-bg');
const scoreElement = document.querySelector('.score');
const timerElement = document.querySelector('.timer');
const startButton = document.querySelector('.start');
const replayButton = document.querySelector('.replay');
const cursor = document.querySelector('.cursor');

const vegIcons = [
    { icon: '🌽', value: 1 },
    { icon: '🍅', value: 2 },
    { icon: '🥕', value: 3 },
    { icon: '🍆', value: 4 },
    { icon: '🥬', value: 5 },
    { icon: '🥔', value: 6 },
    { icon: '🥦', value: 7 },
    { icon: '🧅', value: 8 },
    { icon: '🧄', value: 9 },
    { icon: '🌶️', value: 10 },
    { icon: '🥒', value: 11 },
];

let score = 0;
let timer = 30;
let gameActive = false;
let intervalId;

// Atualiza a posição do cursor personalizado
document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});

// Inicia o jogo
function startGame() {
    score = 0;
    timer = 30;
    gameActive = true;
    scoreElement.textContent = `Score: ${score}`;
    timerElement.textContent = `⏱️ ${timer}s`;
    startButton.style.display = 'none';
    replayButton.style.display = 'none';
    stageBg.innerHTML = '';
    spawnVegetable();
    intervalId = setInterval(updateTimer, 1000);
}

// Atualiza o cronômetro
function updateTimer() {
    timer--;
    timerElement.textContent = `⏱️ ${timer}s`;
    if (timer <= 0) endGame();
}

// Finaliza o jogo
function endGame() {
    gameActive = false;
    clearInterval(intervalId);
    replayButton.style.display = 'block';
}

// Gera vegetais na tela e os faz se mover
function spawnVegetable() {
    if (!gameActive) return;

    const vegData = vegIcons[Math.floor(Math.random() * vegIcons.length)];
    const veg = document.createElement('div');
    veg.textContent = vegData.icon;
    veg.dataset.value = vegData.value;
    veg.classList.add('vegetable');
    veg.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
    veg.style.top = `${Math.random() * (window.innerHeight - 50)}px`;

    stageBg.appendChild(veg);

    // Move o vegetal horizontalmente
    gsap.to(veg, {
        x: `${Math.random() > 0.5 ? '+=' : '-='}${Math.random() * 200}px`,
        duration: Math.random() * 2 + 2,
        repeat: -1,
        yoyo: true,
    });
}

// Detecta o corte de vegetais
document.addEventListener('mousedown', (e) => {
    if (!gameActive) return;

    const vegetables = document.querySelectorAll('.vegetable');
    vegetables.forEach((veg) => {
        const rect = veg.getBoundingClientRect();
        if (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
        ) {
            score += parseInt(veg.dataset.value);
            scoreElement.textContent = `Score: ${score}`;
            veg.remove();
            spawnVegetable(); // Gera outro vegetal após o clique
        }
    });
});

// Configura os botões
startButton.onclick = startGame;
replayButton.onclick = startGame;
