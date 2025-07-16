const startGameBtn = document.getElementById('start-game-btn');
const maxGuessesInput = document.getElementById('max-guesses-input');
const timeLimitInput = document.getElementById('time-limit-input');
const guessBtn = document.getElementById('guess-btn');
const guessInput = document.getElementById('guess-input');
const message = document.getElementById('message');
const guessesRemainingSpan = document.getElementById('guesses-remaining');
const timeRemainingSpan = document.getElementById('time-remaining');
const guessList = document.getElementById('guess-list');

let timerInterval;

startGameBtn.addEventListener('click', () => {
    const max_guesses = parseInt(maxGuessesInput.value);
    const time_limit_seconds = parseInt(timeLimitInput.value);

    if (isNaN(max_guesses) || max_guesses <= 0) {
        message.textContent = 'Please enter a valid number for Max Guesses.';
        message.className = '';
        return;
    }
    if (isNaN(time_limit_seconds) || time_limit_seconds <= 0) {
        message.textContent = 'Please enter a valid number for Time Limit.';
        message.className = '';
        return;
    }

    fetch('/new_game', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ max_guesses, time_limit_seconds })
    })
        .then(response => response.json())
        .then(data => {
            updateGameUI(data);
            guessInput.value = '';
            guessInput.disabled = false;
            guessBtn.disabled = false;
            startTimer(data.time_remaining_seconds);
        });
});

guessBtn.addEventListener('click', makeGuess);

guessInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        makeGuess();
    }
});

function makeGuess() {
    const guess = parseInt(guessInput.value);
    if (isNaN(guess)) {
        message.textContent = 'Please enter a valid number.';
        message.className = '';
        return;
    }

    fetch('/guess', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guess })
    })
        .then(response => response.json())
        .then(data => {
            updateGameUI(data);
            if (data.game_over) {
                endGame();
            }
        });
}

function updateGameUI(data) {
    message.textContent = data.message;
    message.className = data.status;
    guessesRemainingSpan.textContent = data.max_guesses - data.guess_count;
    updateGuessList(data.guess_history);
    // Update timer display immediately with backend's remaining time
    const minutes = Math.floor(data.time_remaining_seconds / 60);
    const seconds = data.time_remaining_seconds % 60;
    timeRemainingSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateGuessList(history) {
    guessList.innerHTML = '';
    history.forEach(guess => {
        const li = document.createElement('li');
        li.textContent = guess;
        guessList.appendChild(li);
    });
}

function startTimer(duration) {
    clearInterval(timerInterval);
    let timer = duration;
    timerInterval = setInterval(() => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        timeRemainingSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (--timer < 0) {
            clearInterval(timerInterval);
            // The backend will send game_over: true with the correct message/status
            // on the next guess if time runs out. This just stops the frontend timer.
            guessInput.disabled = true;
            guessBtn.disabled = true;
        }
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    guessInput.disabled = true;
    guessBtn.disabled = true;
}