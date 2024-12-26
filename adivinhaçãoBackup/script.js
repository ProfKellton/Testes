const guessInput = document.getElementById('guessInput');
const checkButton = document.getElementById('checkButton');
const message = document.getElementById('message');
const result = document.getElementById('result');
const restartButton = document.getElementById('restartButton');
const difficultySelect = document.getElementById('difficulty');
const successSound = document.getElementById('successSound');
const errorSound = document.getElementById('errorSound');
const clickSound = document.getElementById('clickSound');

let randomNumber;
let maxRange = 100;
let attempts = 0;

const startGame = () => {
    maxRange = parseInt(difficultySelect.value);
    randomNumber = Math.floor(Math.random() * maxRange) + 1;
    attempts = 0;
    guessInput.value = '';
    guessInput.disabled = false;
    checkButton.disabled = false;
    message.textContent = '';
    result.textContent = '';
    restartButton.classList.add('hidden');
};

difficultySelect.addEventListener('change', startGame);

const checkGuess = () => {
    const userGuess = Number(guessInput.value);
    attempts++;
    clickSound.play();

    if (userGuess < 1 || userGuess > maxRange || isNaN(userGuess)) {
        message.textContent = `Por favor, insira um número válido entre 1 e ${maxRange}.`;
        message.style.color = 'red';
        errorSound.play();
        return;
    }

    if (userGuess === randomNumber) {
        result.textContent = `🎉 Parabéns! Você acertou o número ${randomNumber} em ${attempts} tentativas.`;
        result.style.color = '#388e3c';
        message.textContent = '';
        successSound.play();
        checkButton.disabled = true;
        guessInput.disabled = true;
        restartButton.classList.remove('hidden');
    } else if (userGuess < randomNumber) {
        message.textContent = "Tente um número maior! 📈";
        message.style.color = '#1976d2';
        errorSound.play();
    } else {
        message.textContent = "Tente um número menor! 📉";
        message.style.color = '#d32f2f';
        errorSound.play();
    }
};

checkButton.addEventListener('click', checkGuess);

guessInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        checkGuess();
    }
});

restartButton.addEventListener('click', startGame);

startGame();



let toggleBtn = document.querySelector('.toggleBtn');
        let menu = document.querySelector('.menu');
        toggleBtn.addEventListener('click', () => {
            menu.classList.toggle('active');
        });