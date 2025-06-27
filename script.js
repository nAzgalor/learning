const firebaseConfig = {
    apiKey: "AIzaSyCcS5HMIhvsHkGq7hjjUYUtuPX8IlWtEs4",
    authDomain: "lear-9d1be.firebaseapp.com",
    projectId: "lear-9d1be",
    storageBucket: "lear-9d1be.firebasestorage.app",
    messagingSenderId: "739241285252",
    appId: "1:739241285252:web:b3f725bd09fe165bcc14d1",
    measurementId: "G-J44H9VDX6K",
};

// Ініціалізація Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;

// Додаємо змінні для відстеження завдань
let lastQuestions = [];
const MIN_QUESTIONS_BEFORE_REPEAT = 5;

// Функції авторизації
function signInAnonymously() {
    if (!auth) {
        console.error('Firebase не ініціалізовано');
        return;
    }
    auth.signInAnonymously()
        .then(() => {
            // Очищаємо localStorage при вході
            localStorage.removeItem('learningProgress');
            showCelebration("👤 Увійшли як гість!");
        })
        .catch((error) => {
            console.error("Помилка входу:", error);
            alert("Помилка входу. Спробуйте ще раз.");
        });
}

function signInWithGoogle() {
    if (!auth) {
        console.error('Firebase не ініціалізовано');
        return;
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(() => {
            // Очищаємо localStorage при вході
            localStorage.removeItem('learningProgress');
            showCelebration("📧 Успішний вхід через Google!");
        })
        .catch((error) => {
            console.error("Помилка входу через Google:", error);
            alert("Помилка входу через Google. Спробуйте ще раз.");
        });
}

function signOut() {
    auth.signOut().then(() => {
        showCelebration("👋 До побачення!");
        // Очищаємо локальні дані
        learnedLetters = [];
        learnedNumbers = [];
        score = 0;
        updateDisplay();
        updateProgress();
    });
}

// Відстежування стану авторизації
auth.onAuthStateChanged((user) => {
    currentUser = user;
    updateAuthUI();

    if (user) {
        loadProgressFromCloud();
    } else {
        // Якщо користувач не увійшов, завантажуємо з локального сховища
        loadProgressFromLocal();
    }
});

function updateAuthUI() {
    const authPanel = document.getElementById("authPanel");
    const userInfo = document.getElementById("userInfo");
    const userName = document.getElementById("userName");

    if (currentUser) {
        authPanel.style.display = "none";
        userInfo.style.display = "block";
        userName.textContent = currentUser.isAnonymous
            ? "👤 Гість"
            : `📧 ${currentUser.displayName || currentUser.email}`;
    } else {
        authPanel.style.display = "block";
        userInfo.style.display = "none";
    }
}

// Збереження прогресу в хмару
async function saveProgressToCloud() {
    if (!currentUser) return;

    const progress = {
        learnedLetters: learnedLetters,
        learnedNumbers: learnedNumbers,
        score: score,
        targetScore: targetScore,
        currentTab: currentTab,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
    };

    try {
        await db.collection("userProgress").doc(currentUser.uid).set(progress);
        console.log("✅ Прогрес збережено!");
    } catch (error) {
        console.error("❌ Помилка збереження:", error);
    }
}

// Завантаження прогресу з хмари
async function loadProgressFromCloud() {
    if (!currentUser) return;

    try {
        const doc = await db.collection("userProgress").doc(currentUser.uid).get();

        if (doc.exists) {
            const data = doc.data();
            // Повністю замінюємо локальні дані даними з Firebase
            learnedLetters = data.learnedLetters || [];
            learnedNumbers = data.learnedNumbers || [];
            score = data.score || 0;
            targetScore = data.targetScore || 0;
            currentTab = data.currentTab || "letters";
            
            updateUIBasedOnTab(currentTab);
            updateDisplay();
            updateProgress();
            showCelebration("📥 Прогрес завантажено!");
        }
    } catch (error) {
        console.error("❌ Помилка завантаження:", error);
    }
}

// Функція для збереження прогресу в localStorage
function saveProgressToLocal() {
    const progress = {
        learnedLetters: learnedLetters,
        learnedNumbers: learnedNumbers,
        score: score,
        targetScore: targetScore,
        currentTab: currentTab
    };
    localStorage.setItem('learningProgress', JSON.stringify(progress));
}

// Функція для завантаження прогресу з localStorage
function loadProgressFromLocal() {
    const savedProgress = localStorage.getItem('learningProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        learnedLetters = progress.learnedLetters || [];
        learnedNumbers = progress.learnedNumbers || [];
        score = progress.score || 0;
        targetScore = progress.targetScore || 0;
        currentTab = progress.currentTab || "letters";

        updateUIBasedOnTab(currentTab);
        updateDisplay();
        updateProgress();
    }
}


const ukrainianAlphabet = [
    {
        letter: "А",
        name: "А",
        sound: "а",
        emoji: "🍍",
        word: "Ананас",
        example: "А — ананас 🍍",
    },
    {
        letter: "Б",
        name: "Бе",
        sound: "б",
        emoji: "🐝",
        word: "Бджола",
        example: "Б — бджола 🐝",
    },
    {
        letter: "В",
        name: "Ве",
        sound: "в",
        emoji: "🐻",
        word: "Ведмідь",
        example: "В — ведмідь 🐻",
    },
    {
        letter: "Г",
        name: "Ге",
        sound: "г",
        emoji: "🎃",
        word: "Гарбуз",
        example: "Г — гарбуз 🎃",
    },
    {
        letter: "Ґ",
        name: "Ґе",
        sound: "ґ",
        emoji: "🔘",
        word: "Ґудзик",
        example: "Ґ — ґудзик 🔘",
    },
    {
        letter: "Д",
        name: "Де",
        sound: "д",
        emoji: "🍈",
        word: "Диня",
        example: "Д — диня 🍈",
    },
    {
        letter: "Е",
        name: "Е",
        sound: "е",
        emoji: "🚜",
        word: "Екскаватор",
        example: "Е — екскаватор 🚜",
    },
    {
        letter: "Є",
        name: "Є",
        sound: "є",
        emoji: "🦝",
        word: "Єнот",
        example: "Є — єнот 🦝",
    },
    {
        letter: "Ж",
        name: "Же",
        sound: "ж",
        emoji: "🦒",
        word: "Жирафа",
        example: "Ж — жирафа 🦒",
    },
    {
        letter: "З",
        name: "Зе",
        sound: "з",
        emoji: "🐍",
        word: "Змія",
        example: "З — змія 🐍",
    },
    {
        letter: "И",
        name: "И",
        sound: "и",
        emoji: "🍬",
        word: "Ириска",
        example: "И — іриска 🍬",
    },
    {
        letter: "І",
        name: "І",
        sound: "і",
        emoji: "🧸",
        word: "Іграшка",
        example: "І — іграшка 🧸",
    },
    {
        letter: "Ї",
        name: "Ї",
        sound: "ї",
        emoji: "🦔",
        word: "Їжак",
        example: "Ї — їжак 🦔",
    },
    {
        letter: "Й",
        name: "Йот",
        sound: "й",
        emoji: "🥛",
        word: "Йогурт",
        example: "Й — йогурт 🥛",
    },
    {
        letter: "К",
        name: "Ка",
        sound: "к",
        emoji: "🐱",
        word: "Кішка",
        example: "К — кішка 🐱",
    },
    {
        letter: "Л",
        name: "Ел",
        sound: "л",
        emoji: "🍋",
        word: "Лимон",
        example: "Л — лимон 🍋",
    },
    {
        letter: "М",
        name: "Ем",
        sound: "м",
        emoji: "⚽",
        word: "М'яч",
        example: "М — м'яч ⚽",
    },
    {
        letter: "Н",
        name: "Ен",
        sound: "н",
        emoji: "🦏",
        word: "Носоріг",
        example: "Н — носоріг 🦏",
    },
    {
        letter: "О",
        name: "О",
        sound: "о",
        emoji: "✏️",
        word: "Олівець",
        example: "О — олівець ✏️",
    },
    {
        letter: "П",
        name: "Пе",
        sound: "п",
        emoji: "🐼",
        word: "Панда",
        example: "П — панда 🐼",
    },
    {
        letter: "Р",
        name: "Ер",
        sound: "р",
        emoji: "🐟",
        word: "Рибка",
        example: "Р — рибка 🐟",
    },
    {
        letter: "С",
        name: "Ес",
        sound: "с",
        emoji: "☀️",
        word: "Сонце",
        example: "С — сонце ☀️",
    },
    {
        letter: "Т",
        name: "Те",
        sound: "т",
        emoji: "🐯",
        word: "Тигр",
        example: "Т — тигр 🐯",
    },
    {
        letter: "У",
        name: "У",
        sound: "у",
        emoji: "🌪️",
        word: "Ураган",
        example: "У — ураган 🌪️",
    },
    {
        letter: "Ф",
        name: "Еф",
        sound: "ф",
        emoji: "🦩",
        word: "Фламінго",
        example: "Ф — фламінго 🦩",
    },
    {
        letter: "Х",
        name: "Ха",
        sound: "х",
        emoji: "☁️",
        word: "Хмаринка",
        example: "Х — хмаринка ☁️",
    },
    {
        letter: "Ц",
        name: "Це",
        sound: "ц",
        emoji: "🍭",
        word: "Цукерка",
        example: "Ц — цукерка 🍭",
    },
    {
        letter: "Ч",
        name: "Че",
        sound: "ч",
        emoji: "🐢",
        word: "Черепаха",
        example: "Ч — черепаха 🐢",
    },
    {
        letter: "Ш",
        name: "Ша",
        sound: "ш",
        emoji: "🍫",
        word: "Шоколад",
        example: "Ш — шоколад 🍫",
    },
    {
        letter: "Щ",
        name: "Ща",
        sound: "щ",
        emoji: "🐶",
        word: "Щеня",
        example: "Щ — щеня 🐶",
    },
    {
        letter: "Ь",
        name: "М'який знак",
        sound: "ь",
        emoji: "🐴",
        word: "М'який знак",
        example: "Ь — м'який знак 🐴",
    },
    {
        letter: "Ю",
        name: "Ю",
        sound: "ю",
        emoji: "🪐",
        word: "Юпітер",
        example: "Ю — юпітер 🪐",
    },
    {
        letter: "Я",
        name: "Я",
        sound: "я",
        emoji: "🍓",
        word: "Ягода",
        example: "Я — ягода 🍓",
    },
];

const ukrainianNumbers = [
    {
        number: "0",
        name: "нуль",
        emoji: "0️⃣",
        word: "Нуль",
        example: "0 — нуль 0️⃣",
    },
    {
        number: "1",
        name: "один",
        emoji: "1️⃣",
        word: "Один",
        example: "1 — один 1️⃣",
    },
    {
        number: "2",
        name: "два",
        emoji: "2️⃣",
        word: "Два",
        example: "2 — два 2️⃣",
    },
    {
        number: "3",
        name: "три",
        emoji: "3️⃣",
        word: "Три",
        example: "3 — три 3️⃣",
    },
    {
        number: "4",
        name: "чотири",
        emoji: "4️⃣",
        word: "Чотири",
        example: "4 — чотири 4️⃣",
    },
    {
        number: "5",
        name: "п'ять",
        emoji: "5️⃣",
        word: "П'ять",
        example: "5 — п'ять 5️⃣",
    },
    {
        number: "6",
        name: "шість",
        emoji: "6️⃣",
        word: "Шість",
        example: "6 — шість 6️⃣",
    },
    {
        number: "7",
        name: "сім",
        emoji: "7️⃣",
        word: "Сім",
        example: "7 — сім 7️⃣",
    },
    {
        number: "8",
        name: "вісім",
        emoji: "8️⃣",
        word: "Вісім",
        example: "8 — вісім 8️⃣",
    },
    {
        number: "9",
        name: "дев'ять",
        emoji: "9️⃣",
        word: "Дев'ять",
        example: "9 — дев'ять 9️⃣",
    },
    {
        number: "10",
        name: "десять",
        emoji: "🔟",
        word: "Десять",
        example: "10 — десять 🔟",
    },
];

let currentIndex = 0;
let learnedLetters = [];
let currentMode = "learning";
let score = 0;
let currentQuestion = null;
let isAutoPlay = false;
let buttonsLocked = false;
let selectedVoice = null;
let shuffledAlphabet = [];
let targetScore = 0; // За замовчуванням 0 = без лімітів
let celebrationAudio = null;
let currentTab = "letters"; // 'letters' або 'numbers'
let shuffledNumbers = [];
let learnedNumbers = [];

function shuffleAlphabet() {
    shuffledAlphabet = [...ukrainianAlphabet];
    for (let i = shuffledAlphabet.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledAlphabet[i], shuffledAlphabet[j]] = [
            shuffledAlphabet[j],
            shuffledAlphabet[i],
        ];
    }
}

function shuffleNumbers() {
    shuffledNumbers = [...ukrainianNumbers];
    for (let i = shuffledNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledNumbers[i], shuffledNumbers[j]] = [
            shuffledNumbers[j],
            shuffledNumbers[i],
        ];
    }
}

function getCurrentArray() {
    return currentTab === "letters" ? shuffledAlphabet : shuffledNumbers;
}

function getCurrentLearnedArray() {
    return currentTab === "letters" ? learnedLetters : learnedNumbers;
}

function initializeVoices() {
    const voices = speechSynthesis.getVoices();
    const ukrainianVoices = voices.filter(
        (voice) =>
            voice.lang.includes("uk") ||
            voice.name.toLowerCase().includes("ukrain"),
    );

    if (ukrainianVoices.length > 0) {
        selectedVoice = ukrainianVoices[0];
    } else {
        const femaleVoices = voices.filter(
            (voice) =>
                voice.name.toLowerCase().includes("female") ||
                voice.name.toLowerCase().includes("woman") ||
                voice.name.toLowerCase().includes("anna") ||
                voice.name.toLowerCase().includes("maria"),
        );

        if (femaleVoices.length > 0) {
            selectedVoice = femaleVoices[0];
        } else {
            selectedVoice = voices[0];
        }
    }
    console.log("Обраний голос:", selectedVoice?.name);
}

// Додаю універсальну функцію для програвання звуку для букви/цифри
function playItemSound(item) {
    if (currentTab === "letters" && item.sound) {
        const audio = new Audio(`sounds/ua/letters/${item.sound}.wav`);
        audio.play().catch(() => speakFallback(item.letter, item.word));
    } else {
        // Для цифр або якщо немає запису — синтез
        speakFallback(currentTab === "letters" ? item.letter : item.number, item.word);
    }
}

function generateQuestion() {
    buttonsLocked = false;
    const originalArray = getOriginalArray();
    
    let availableQuestions = originalArray.filter(item => {
        const itemValue = currentTab === "letters" ? item.letter : item.number;
        return !lastQuestions.includes(itemValue);
    });

    if (availableQuestions.length === 0) {
        lastQuestions = [];
        availableQuestions = originalArray;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const correctItem = availableQuestions[randomIndex];
    const itemValue = currentTab === "letters" ? correctItem.letter : correctItem.number;
    lastQuestions.push(itemValue);
    
    if (lastQuestions.length > MIN_QUESTIONS_BEFORE_REPEAT) {
        lastQuestions.shift();
    }

    currentQuestion = correctItem;

    document.getElementById("questionEmoji").textContent = correctItem.emoji;
    const questionType = currentTab === "letters" ? "букву" : "цифру";
    document.getElementById("questionText").textContent = `Яка це ${questionType}? (${correctItem.word})`;

    // Використовую універсальну функцію для програвання звуку
    playItemSound(correctItem);

    const emoji = document.getElementById("questionEmoji");
    emoji.style.transform = "scale(1.2)";
    emoji.style.filter = "brightness(1.3)";

    setTimeout(() => {
        emoji.style.transform = "scale(1)";
        emoji.style.filter = "brightness(1)";
    }, 800);

    generateAnswerOptions(correctItem);
}

function getOriginalArray() {
    return currentTab === "letters" ? ukrainianAlphabet : ukrainianNumbers;
}

function generateAnswerOptions(correctItem) {
    const options = [correctItem];
    const originalArray = getOriginalArray();

    while (options.length < 5) {
        const randomItem = originalArray[Math.floor(Math.random() * originalArray.length)];
        const isDuplicate = options.some((option) => {
            const optionValue = currentTab === "letters" ? option.letter : option.number;
            const randomValue = currentTab === "letters" ? randomItem.letter : randomItem.number;
            return optionValue === randomValue;
        });

        if (!isDuplicate) {
            options.push(randomItem);
        }
    }

    options.sort(() => Math.random() - 0.5);

    const container = document.getElementById("answerOptions");
    container.innerHTML = "";

    options.forEach((option) => {
        const btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.textContent = currentTab === "letters" ? option.letter : option.number;
        btn.onclick = () => checkAnswer(option, btn);
        container.appendChild(btn);
    });
}

function checkAnswer(selectedItem, buttonElement) {
    if (buttonsLocked) return;

    const currentValue = currentTab === "letters" ? selectedItem.letter : selectedItem.number;
    const correctValue = currentTab === "letters" ? currentQuestion.letter : currentQuestion.number;
    const isCorrect = currentValue === correctValue;

    if (isCorrect) {
        buttonsLocked = true;
        document.querySelectorAll(".answer-btn").forEach((btn) => {
            btn.disabled = true;
            btn.style.opacity = "0.6";
            btn.style.cursor = "not-allowed";
        });

        buttonElement.style.backgroundColor = "#00b894";
        buttonElement.style.color = "white";
        buttonElement.classList.add("correct");

        score += 10;
        showCelebration("🎉 Вірно! 🎉", "correct");
        saveProgress();

        setTimeout(() => {
            generateQuestion();
        }, 1500);
    } else {
        buttonElement.style.backgroundColor = "#e17055";
        buttonElement.style.color = "white";
        buttonElement.classList.add("incorrect");

        score = Math.max(0, score - 10);
        showCelebration(`❌ Це ${currentValue} (${selectedItem.word}). Спробуй ще раз!`, "incorrect");
        saveProgress();

        setTimeout(() => {
            buttonElement.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
            buttonElement.style.color = "#2d3436";
            buttonElement.classList.remove("incorrect");
        }, 2000);
    }
    updateProgress();
}

function switchMode(mode) {
    currentMode = mode;
    lastQuestions = [];

    document.getElementById("learningBtn").classList.toggle("active", mode === "learning");
    document.getElementById("trainingBtn").classList.toggle("active", mode === "training");
    document.getElementById("learningMode").classList.toggle("active", mode === "learning");
    document.getElementById("trainingMode").classList.toggle("active", mode === "training");

    const scoreDisplay = document.getElementById("scoreDisplay");
    const targetScoreSetting = document.querySelector('.target-score-setting');
    
    if (mode === "training") {
        scoreDisplay.style.display = "block";
        targetScoreSetting.style.display = 'flex';
        updateProgress();
        generateQuestion();
    } else {
        scoreDisplay.style.display = "none";
        targetScoreSetting.style.display = 'none';
        updateDisplay();
    }
}

function updateDisplay() {
    const current = getCurrentArray()[currentIndex];
    if (!current) return;
    
    const displayValue = currentTab === "letters" ? current.letter : current.number;

    document.getElementById("currentLetter").textContent = displayValue;
    document.getElementById("emojiDisplay").textContent = current.emoji;
    document.getElementById("letterName").textContent = `${displayValue} - "${current.name}"`;
    document.getElementById("letterExample").textContent = current.example;
    document.getElementById("letterSound").textContent = `Натисни на ${currentTab === "letters" ? "букву" : "цифру"} або емодзі!`;
    
    updateProgress();
    updateAlphabetGrid();
    setupWritingArea();
}

function updateProgress() {
    const learned = getCurrentLearnedArray().length;
    const total = getCurrentArray().length;
    const percentage = total > 0 ? (learned / total) * 100 : 0;

    document.getElementById("progressFill").style.width = percentage + "%";
    document.getElementById("progressText").textContent = `Прогрес: ${learned}/${total}`;

    const scoreDisplay = document.getElementById("scoreDisplay");
    if (currentMode === "training") {
        scoreDisplay.style.display = 'block';
        if (targetScore > 0) {
            scoreDisplay.textContent = `Рахунок: ${score}/${targetScore}`;
            if (score >= targetScore) {
                setTimeout(showVictoryScreen, 500);
            }
        } else {
            scoreDisplay.textContent = `Рахунок: ${score}`;
        }
    } else {
        scoreDisplay.style.display = 'none';
    }
}

function updateAlphabetGrid() {
    const grid = document.getElementById("alphabetGrid");
    grid.innerHTML = "";
    const originalArray = getOriginalArray();
    const learnedArray = getCurrentLearnedArray();
    const currentArray = getCurrentArray();

    originalArray.forEach((item) => {
        const btn = document.createElement("button");
        btn.className = "alphabet-btn";
        const itemValue = currentTab === "letters" ? item.letter : item.number;
        btn.textContent = itemValue;

        btn.onclick = () => {
            const shuffledIndex = currentArray.findIndex(shuffledItem => {
                const shuffledValue = currentTab === "letters" ? shuffledItem.letter : shuffledItem.number;
                return shuffledValue === itemValue;
            });
            if (shuffledIndex !== -1) {
                currentIndex = shuffledIndex;
                updateDisplay();
                playSound();
                if (currentTab === "letters") {
                    practiceWriting(item.letter);
                }
            }
        };

        if (learnedArray.includes(itemValue)) {
            btn.classList.add("learned");
        }
        grid.appendChild(btn);
    });
}

function switchTab(tab) {
    currentTab = tab;
    lastQuestions = [];
    currentIndex = 0;

    updateUIBasedOnTab(tab);
    
    if (currentMode === "training") {
        generateQuestion();
    } else {
        updateDisplay();
    }
    
    updateProgress();
    saveProgress();
}

function updateUIBasedOnTab(tab) {
    document.getElementById("lettersTab").classList.toggle("active", tab === "letters");
    document.getElementById("numbersTab").classList.toggle("active", tab === "numbers");

    const writingArea = document.getElementById("writingArea");
    if (tab === 'letters' && currentMode === 'learning') {
        writingArea.style.display = 'flex';
        setupWritingArea();
    } else {
        writingArea.style.display = 'none';
    }

    document.getElementById("targetScoreInput").value = targetScore;
    const scoreDisplay = document.getElementById("scoreDisplay");
    if (targetScore > 0) {
        scoreDisplay.textContent = `Рахунок: ${score}/${targetScore}`;
    } else {
        scoreDisplay.textContent = `Рахунок: ${score}`;
    }
}


function playSound() {
    const current = getCurrentArray()[currentIndex];
    const displayValue = currentTab === "letters" ? current.letter : current.number;

    if (currentTab === "letters" && current.sound) {
        const audio = new Audio(`sounds/ua/letters/${current.sound}.wav`);
        audio.play().catch(() => speakFallback(displayValue, current.word));
    } else {
        speakFallback(displayValue, current.word);
    }

    const letter = document.getElementById("currentLetter");
    letter.style.transform = "scale(1.2)";
    setTimeout(() => { letter.style.transform = "scale(1)"; }, 500);
}

function speakFallback(text, word) {
    if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(`${text}. ${word}.`);
        utterance.lang = "uk-UA";
        if (selectedVoice) utterance.voice = selectedVoice;
        speechSynthesis.speak(utterance);
    }
}

function setTargetScore() {
    const mathQuestion = Math.floor(Math.random() * 10) + 5;
    const mathAnswer = mathQuestion * 3;
    const userAnswer = prompt(`Батьківський контроль:\nОбчисліть: ${mathQuestion} × 3 = ?`);

    if (parseInt(userAnswer) === mathAnswer) {
        targetScore = parseInt(document.getElementById("targetScoreInput").value, 10);
        showCelebration(targetScore === 0 ? "⚙️ Встановлено: без лімітів" : `⚙️ Встановлено ціль: ${targetScore} поїнтів`);
        updateProgress();
        saveProgress();
    } else {
        alert("Неправильна відповідь!");
        document.getElementById("targetScoreInput").value = targetScore;
    }
}

function nextLetter() {
    currentIndex = (currentIndex + 1) % getCurrentArray().length;
    updateDisplay();
    playSound();
}

function previousLetter() {
    const arrLength = getCurrentArray().length;
    currentIndex = (currentIndex - 1 + arrLength) % arrLength;
    updateDisplay();
    playSound();
}

function markAsLearned() {
    const current = getCurrentArray()[currentIndex];
    const currentValue = currentTab === "letters" ? current.letter : current.number;
    const learnedArray = getCurrentLearnedArray();

    if (!learnedArray.includes(currentValue)) {
        learnedArray.push(currentValue);
        const itemType = currentTab === "letters" ? "Букву" : "Цифру";
        showCelebration(`✅ Молодець! ${itemType} вивчено!`, "general");
        updateProgress();
        saveProgress();
        setTimeout(nextLetter, 1500);
    } else {
        showCelebration("📚 Вже вивчено!", "general");
    }
}

function showCelebration(message = "🎉 Молодець! 🎉", type = "general") {
    const celebration = document.createElement("div");
    celebration.className = `celebration ${type}`;
    celebration.textContent = message;
    document.body.appendChild(celebration);
    celebration.addEventListener("animationend", () => {
        if (document.body.contains(celebration)) {
            document.body.removeChild(celebration);
        }
    });
}

function saveProgress() {
    if (currentUser) {
        saveProgressToCloud();
    } else {
        saveProgressToLocal();
    }
}

function resetProgress() {
    if (confirm("Ви впевнені, що хочете скинути весь прогрес?")) {
        learnedLetters = [];
        learnedNumbers = [];
        score = 0;
        targetScore = 0;
        document.getElementById("targetScoreInput").value = "0";
        updateDisplay();
        updateProgress();
        saveProgress();
        showCelebration("🔄 Прогрес скинуто!", "general");
    }
}

// Функції для практики написання
function setupWritingArea() {
    const writingArea = document.getElementById('writingArea');
    if (!writingArea) return;

    if (currentTab === 'letters' && currentMode === 'learning') {
        writingArea.style.display = 'flex';
        // Показуємо підказку, лише якщо там ще немає полотна
        if (!writingArea.querySelector('canvas')) {
            writingArea.innerHTML = '✏️ Натисни, щоб попрактикувати написання';
        }
    } else {
        writingArea.style.display = 'none';
    }
}

function handleWritingAreaClick() {
    const writingArea = document.getElementById('writingArea');
    // Запускаємо, тільки якщо активна вкладка з буквами і там ще немає полотна
    if (currentTab === 'letters' && !writingArea.querySelector('canvas')) {
        const currentLetter = getCurrentArray()[currentIndex]?.letter;
        if (currentLetter) {
            practiceWriting(currentLetter);
        }
    }
}

// Ініціалізація
document.addEventListener("DOMContentLoaded", () => {
    switchMode('learning'); // Починаємо з режиму навчання
    shuffleAlphabet();
    shuffleNumbers();
    // Завантаження прогресу ініціюється через onAuthStateChanged
});

speechSynthesis.addEventListener("voiceschanged", initializeVoices);
initializeVoices();