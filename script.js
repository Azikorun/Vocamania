let currentLevel = "";
let questionsList = [];
let index = 0;
let correct = 0;
let timer;
let timeLeft = 20;

document.addEventListener("DOMContentLoaded", function() {
    showLevels();
    setupThemeToggle();
    applySavedTheme();
});

function showLevels() {
    const levelDiv = document.getElementById('levels');
    levelDiv.innerHTML = '';

    let levels = Object.keys(questions);

    levels.forEach((level, i) => {
        const button = document.createElement('button');
        button.className = 'level-button';
        button.innerText = i + 1;

        if (!isLevelUnlocked(i + 1)) {
            button.disabled = true;
            const lock = document.createElement('span');
            lock.className = 'lock-icon';
            lock.innerText = '🔒';
            button.appendChild(lock);
        }

        button.onclick = () => startLevel(level);
        levelDiv.appendChild(button);
    });
}

function isLevelUnlocked(levelNumber) {
    return localStorage.getItem(`NGSL-level${levelNumber}`) === 'passed' || levelNumber === 1;
}

function startLevel(levelName) {
    currentLevel = levelName;
    let allQuestions = questions[levelName];

    questionsList = shuffleArray(allQuestions).slice(0, 20);

    index = 0;
    correct = 0;
    document.getElementById('level-select').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    document.getElementById('page-title').style.display = 'none';
    showQuestion();
}

function showQuestion() {
    if (index >= questionsList.length) {
        finishQuiz();
        return;
    }
    const q = questionsList[index];
    document.getElementById('question-number').innerText = `${index + 1} - ${questionsList.length}`;
    document.getElementById('question-text').innerText = q.Question;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    [...q.options, q.RightAnswer].sort(() => Math.random() - 0.5).forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-button';
        btn.innerText = option;
        btn.onclick = () => selectAnswer(option);
        optionsDiv.appendChild(btn);
    });

    document.getElementById('quiz').classList.add('fade-in');
    setTimeout(() => {
        document.getElementById('quiz').classList.remove('fade-in');
    }, 500);

    startTimer();
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 20;
    const timerBar = document.getElementById('timer-bar');
    timerBar.style.width = "100%";
    timerBar.classList.remove('red-flash');

    timer = setInterval(() => {
        timeLeft--;
        timerBar.style.width = `${(timeLeft / 20) * 100}%`;

        if (timeLeft <= 5) {
            timerBar.classList.add('red-flash');
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            autoNextQuestion();
        }
    }, 1000);
}

function selectAnswer(selected) {
    clearInterval(timer);

    const buttons = document.querySelectorAll('#options button');
    const correctAnswer = questionsList[index].RightAnswer;

    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.innerText === correctAnswer) {
            btn.classList.add('correct');
        } else if (btn.innerText === selected) {
            btn.classList.add('wrong');
        }
    });

    if (selected === correctAnswer) {
        correct++;
    }

    setTimeout(() => {
        index++;
        showQuestion();
    }, 1000);
}

function autoNextQuestion() {
    const buttons = document.querySelectorAll('#options button');
    buttons.forEach(btn => btn.disabled = true);
    setTimeout(() => {
        index++;
        showQuestion();
    }, 1000);
}

function finishQuiz() {
    document.getElementById('quiz').style.display = 'none';
    const score = (correct / questionsList.length) * 100;
    document.getElementById('result').style.display = 'block';
    document.getElementById('result').innerHTML = `<h2>Your Score: ${score.toFixed(2)}%</h2>`;

    if (score >= 80) {
        document.getElementById('result').innerHTML += `<p>Congratulations! Next level unlocked!</p>`;
        unlockNextLevel();
    } else {
        document.getElementById('result').innerHTML += `<p>Try again to pass!</p>`;
    }
    document.getElementById('result').innerHTML += `<button onclick="location.reload()">Go Back</button>`;
}

function unlockNextLevel() {
    const levelNum = parseInt(currentLevel.replace('level ', ''));
    localStorage.setItem(`NGSL-level${levelNum + 1}`, 'passed');
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// -------------------
// THEME TOGGLE SECTION
// -------------------

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            saveThemePreference();
        });
    }
}

function saveThemePreference() {
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}
