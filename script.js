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

            // Оновлюємо поле цільового рахунку
            document.getElementById("targetScoreInput").value = targetScore;

            // Оновлюємо відображення рахунку
            const scoreDisplay = document.getElementById("scoreDisplay");
            if (targetScore > 0) {
                scoreDisplay.textContent = `Рахунок: ${score}/${targetScore}`;
            } else {
                scoreDisplay.textContent = `Рахунок: ${score}`;
            }

            // Оновлюємо активний таб
            document
                .getElementById("lettersTab")
                .classList.toggle("active", currentTab === "letters");
            document
                .getElementById("numbersTab")
                .classList.toggle("active", currentTab === "numbers");

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

        // Оновлюємо поле цільового рахунку
        document.getElementById("targetScoreInput").value = targetScore;

        // Оновлюємо відображення рахунку
        const scoreDisplay = document.getElementById("scoreDisplay");
        if (targetScore > 0) {
            scoreDisplay.textContent = `Рахунок: ${score}/${targetScore}`;
        } else {
            scoreDisplay.textContent = `Рахунок: ${score}`;
        }

        // Оновлюємо активний таб
        document
            .getElementById("lettersTab")
            .classList.toggle("active", currentTab === "letters");
        document
            .getElementById("numbersTab")
            .classList.toggle("active", currentTab === "numbers");

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
    // Створюємо копію оригінального алфавіту
    shuffledAlphabet = [...ukrainianAlphabet];

    // Перемішуємо за алгоритмом Fisher-Yates
    for (let i = shuffledAlphabet.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledAlphabet[i], shuffledAlphabet[j]] = [
            shuffledAlphabet[j],
            shuffledAlphabet[i],
        ];
    }
}

function shuffleNumbers() {
    // Створюємо копію оригінального масиву цифр
    shuffledNumbers = [...ukrainianNumbers];

    // Перемішуємо за алгоритмом Fisher-Yates
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

    // Шукаємо українські голоси
    const ukrainianVoices = voices.filter(
        (voice) =>
            voice.lang.includes("uk") ||
            voice.name.toLowerCase().includes("ukrain"),
    );

    // Якщо є українські голоси, вибираємо перший
    if (ukrainianVoices.length > 0) {
        selectedVoice = ukrainianVoices[0];
    } else {
        // Якщо немає українських, шукаємо жіночі голоси
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
            // Використовуємо перший доступний голос
            selectedVoice = voices[0];
        }
    }

    console.log("Обраний голос:", selectedVoice?.name);
}

function generateQuestion() {
    // Розблоковуємо кнопки для нового питання
    buttonsLocked = false;

    // Вибираємо випадковий елемент з поточного масиву
    const originalArray = getOriginalArray();
    
    // Фільтруємо завдання, які не були показані в останніх MIN_QUESTIONS_BEFORE_REPEAT разів
    let availableQuestions = originalArray.filter(item => {
        const itemValue = currentTab === "letters" ? item.letter : item.number;
        return !lastQuestions.includes(itemValue);
    });

    // Якщо всі завдання вже були показані, скидаємо історію
    if (availableQuestions.length === 0) {
        lastQuestions = [];
        availableQuestions = originalArray;
    }

    // Вибираємо випадкове завдання з доступних
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const correctItem = availableQuestions[randomIndex];

    // Додаємо завдання в історію
    const itemValue = currentTab === "letters" ? correctItem.letter : correctItem.number;
    lastQuestions.push(itemValue);
    
    // Обмежуємо розмір історії
    if (lastQuestions.length > MIN_QUESTIONS_BEFORE_REPEAT) {
        lastQuestions.shift();
    }

    currentQuestion = correctItem;

    // Оновлюємо відображення питання
    document.getElementById("questionEmoji").textContent = correctItem.emoji;
    const questionType = currentTab === "letters" ? "букву" : "цифру";
    document.getElementById("questionText").textContent = `Яка це ${questionType}? (${correctItem.word})`;

    // Озвучуємо слово емодзі при появі нового питання
    if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(correctItem.word);
        utterance.lang = "uk-UA";
        utterance.rate = 0.9;
        utterance.pitch = 1.2;

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        speechSynthesis.speak(utterance);
    }

    // Додаємо візуальний ефект до емодзі при озвучуванні
    const emoji = document.getElementById("questionEmoji");
    emoji.style.transform = "scale(1.2)";
    emoji.style.filter = "brightness(1.3)";

    setTimeout(() => {
        emoji.style.transform = "scale(1)";
        emoji.style.filter = "brightness(1)";
    }, 800);

    // Генеруємо варіанти відповідей
    generateAnswerOptions(correctItem);
}

function getOriginalArray() {
    return currentTab === "letters" ? ukrainianAlphabet : ukrainianNumbers;
}

function generateAnswerOptions(correctItem) {
    const options = [correctItem];
    const originalArray = getOriginalArray();

    // Додаємо 4 неправильні варіанти
    while (options.length < 5) {
        const randomItem =
            originalArray[Math.floor(Math.random() * originalArray.length)];

        // Перевіряємо, чи варіант не повторювався
        const correctValue =
            currentTab === "letters" ? correctItem.letter : correctItem.number;
        const randomValue =
            currentTab === "letters" ? randomItem.letter : randomItem.number;
        const isDuplicate = options.some((option) => {
            const optionValue =
                currentTab === "letters" ? option.letter : option.number;
            return optionValue === randomValue;
        });

        if (!isDuplicate) {
            options.push(randomItem);
        }
    }

    // Перемішуємо варіанти для випадкового розташування
    options.sort(() => Math.random() - 0.5);

    // Очищуємо контейнер та створюємо нові кнопки
    const container = document.getElementById("answerOptions");
    container.innerHTML = "";

    options.forEach((option) => {
        const btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.textContent =
            currentTab === "letters" ? option.letter : option.number;
        btn.onclick = () => checkAnswer(option, btn);

        // Додаємо hover ефект
        btn.addEventListener("mouseenter", () => {
            if (!buttonsLocked) {
                btn.style.transform = "scale(1.1)";
            }
        });

        btn.addEventListener("mouseleave", () => {
            if (!buttonsLocked) {
                btn.style.transform = "scale(1)";
            }
        });

        container.appendChild(btn);
    });
}

function checkAnswer(selectedItem, buttonElement) {
    // Перевіряємо, чи не заблоковані кнопки
    if (buttonsLocked) {
        return;
    }

    const currentValue =
        currentTab === "letters" ? selectedItem.letter : selectedItem.number;
    const correctValue =
        currentTab === "letters" ? currentQuestion.letter : currentQuestion.number;
    const isCorrect = currentValue === correctValue;

    if (isCorrect) {
        // Блокуємо всі кнопки після правильної відповіді
        buttonsLocked = true;
        const allButtons = document.querySelectorAll(".answer-btn");
        allButtons.forEach((btn) => {
            btn.disabled = true;
            btn.style.opacity = "0.6";
            btn.style.cursor = "not-allowed";
        });

        // Зелений колір та анімація для правильної відповіді
        buttonElement.style.backgroundColor = "#00b894";
        buttonElement.style.color = "white";
        buttonElement.classList.add("correct");

        // Озвучуємо правильну відповідь
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(
                `${currentValue}. ${selectedItem.word}. Вірно!`,
            );
            utterance.lang = "uk-UA";
            utterance.rate = 0.8;
            utterance.pitch = 1.1;

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }

            speechSynthesis.speak(utterance);
        }

        score += 10;
        showCelebration("🎉 Вірно! 🎉", "correct");
        saveProgressToCloud();

        setTimeout(() => {
            generateQuestion();
        }, 1500);
    } else {
        // При неправильній відповіді НЕ блокуємо кнопки
        // Червоний колір та анімація для неправильної відповіді
        buttonElement.style.backgroundColor = "#e17055";
        buttonElement.style.color = "white";
        buttonElement.classList.add("incorrect");

        // Озвучуємо неправильно обрану букву/цифру
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(
                `${currentValue}. ${selectedItem.word}. Спробуй ще раз!`,
            );
            utterance.lang = "uk-UA";
            utterance.rate = 0.8;
            utterance.pitch = 1.1;

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }

            speechSynthesis.speak(utterance);
        }

        score = Math.max(0, score - 10);
        showCelebration(
            `❌ Це ${currentValue} (${selectedItem.word}). Спробуй ще раз!`,
            "incorrect",
        );
        saveProgressToCloud();

        // Через 2 секунди повертаємо кнопку до нормального стану
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
    lastQuestions = []; // Скидаємо історію завдань

    // Оновлюємо кнопки режимів
    document
        .getElementById("learningBtn")
        .classList.toggle("active", mode === "learning");
    document
        .getElementById("trainingBtn")
        .classList.toggle("active", mode === "training");

    // Показуємо/ховаємо режими
    document
        .getElementById("learningMode")
        .classList.toggle("active", mode === "learning");
    document
        .getElementById("trainingMode")
        .classList.toggle("active", mode === "training");

    // Показуємо/ховаємо рахунок залежно від режиму
    const scoreDisplay = document.getElementById("scoreDisplay");
    if (mode === "training") {
        scoreDisplay.style.display = "block";
        // Оновлюємо відображення рахунку
        if (targetScore > 0) {
            scoreDisplay.textContent = `Рахунок: ${score}/${targetScore}`;
        } else {
            scoreDisplay.textContent = `Рахунок: ${score}`;
        }
        generateQuestion();
    } else {
        scoreDisplay.style.display = "none";
        updateDisplay();
    }
}

function updateDisplay() {
    const current = getCurrentArray()[currentIndex];
    const displayValue =
        currentTab === "letters" ? current.letter : current.number;

    document.getElementById("currentLetter").textContent = displayValue;
    document.getElementById("emojiDisplay").textContent = current.emoji;
    document.getElementById("letterName").textContent =
        `${displayValue} - "${current.name}"`;
    document.getElementById("letterExample").textContent = current.example;
    document.getElementById("letterSound").textContent =
        `Натисни на ${currentTab === "letters" ? "букву" : "цифру"} або емодзі!`;

    updateProgress();
    updateAlphabetGrid();
}

function updateProgress() {
    const learned = getCurrentLearnedArray().length;
    const total = getCurrentArray().length;
    const percentage = (learned / total) * 100;

    document.getElementById("progressFill").style.width = percentage + "%";
    document.getElementById("progressText").textContent =
        `Прогрес: ${learned}/${total}`;

    // Показуємо рахунок тільки в режимі тренування
    if (currentMode === "training") {
        if (targetScore > 0) {
            document.getElementById("scoreDisplay").textContent =
                `Рахунок: ${score}/${targetScore}`;

            // Перевіряємо, чи досягнута ціль
            if (score >= targetScore) {
                setTimeout(() => {
                    showVictoryScreen();
                }, 500);
            }
        } else {
            document.getElementById("scoreDisplay").textContent =
                `Рахунок: ${score}`;
        }
    } else {
        // В режимі навчання не показуємо рахунок
        document.getElementById("scoreDisplay").style.display = "none";
    }
}

function updateAlphabetGrid() {
    const grid = document.getElementById("alphabetGrid");
    grid.innerHTML = "";

    // Використовуємо поточний масив залежно від табу
    const originalArray = getOriginalArray();
    const learnedArray = getCurrentLearnedArray();
    const currentArray = getCurrentArray();

    originalArray.forEach((item, index) => {
        const btn = document.createElement("button");
        btn.className = "alphabet-btn";
        btn.textContent =
            currentTab === "letters" ? item.letter : item.number;
        btn.onclick = () => {
            // Знаходимо індекс цього елемента в перемішаному масиві
            const displayValue =
                currentTab === "letters" ? item.letter : item.number;
            const shuffledIndex = currentArray.findIndex((shuffledItem) => {
                const shuffledValue =
                    currentTab === "letters"
                        ? shuffledItem.letter
                        : shuffledItem.number;
                return shuffledValue === displayValue;
            });
            if (shuffledIndex !== -1) {
                currentIndex = shuffledIndex;
                updateDisplay();
                playSound();
            }
        };

        const itemValue =
            currentTab === "letters" ? item.letter : item.number;
        if (learnedArray.includes(itemValue)) {
            btn.classList.add("learned");
        }

        grid.appendChild(btn);
    });
}

function switchTab(tab) {
    currentTab = tab;
    lastQuestions = []; // Скидаємо історію завдань

    // Оновлюємо кнопки табів
    document
        .getElementById("lettersTab")
        .classList.toggle("active", tab === "letters");
    document
        .getElementById("numbersTab")
        .classList.toggle("active", tab === "numbers");

    // Скидаємо індекс на початок поточного масиву
    currentIndex = 0;

    // НЕ перемішуємо масиви - вони вже перемішані при завантаженні
    // Просто оновлюємо відображення залежно від поточного режиму
    if (currentMode === "training") {
        // У режимі тренування генеруємо нове питання
        generateQuestion();
    } else {
        // У режимі навчання оновлюємо звичайне відображення
        updateDisplay();
    }

    updateProgress();
    
    // Зберігаємо поточний таб
    if (currentUser) {
        saveProgressToCloud();
    } else {
        saveProgressToLocal();
    }
}

function playSound() {
    const current = getCurrentArray()[currentIndex];
    const displayValue =
        currentTab === "letters" ? current.letter : current.number;

    // Використовуємо аудіофайли з папки sounds/ua/letters/
    if (currentTab === "letters" && current.sound) {
        const audio = new Audio(`sounds/ua/letters/${current.sound}.wav`);
        audio.volume = 0.8;
        
        // Обробка помилок завантаження аудіо
        audio.onerror = function() {
            console.log(`Помилка завантаження аудіо для букви ${current.sound}`);
            // Fallback до speechSynthesis якщо аудіофайл не знайдено
            if ("speechSynthesis" in window) {
                const utterance = new SpeechSynthesisUtterance(
                    `${displayValue}. ${current.word}.`,
                );
                utterance.lang = "uk-UA";
                utterance.rate = 0.8;
                utterance.pitch = 1.1;

                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }

                speechSynthesis.speak(utterance);
            }
        };
        
        audio.play().catch(function(error) {
            console.log(`Помилка відтворення аудіо: ${error}`);
            // Fallback до speechSynthesis
            if ("speechSynthesis" in window) {
                const utterance = new SpeechSynthesisUtterance(
                    `${displayValue}. ${current.word}.`,
                );
                utterance.lang = "uk-UA";
                utterance.rate = 0.8;
                utterance.pitch = 1.1;

                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }

                speechSynthesis.speak(utterance);
            }
        });
    } else {
        // Для цифр або якщо немає звуку, використовуємо speechSynthesis
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(
                `${displayValue}. ${current.word}.`,
            );
            utterance.lang = "uk-UA";
            utterance.rate = 0.8;
            utterance.pitch = 1.1;

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }

            speechSynthesis.speak(utterance);
        }
    }

    // Додаємо візуальний ефект до букви/цифри
    const letter = document.getElementById("currentLetter");
    letter.style.transform = "scale(1.2)";
    letter.style.color = "#00b894";

    // Додаємо ефект до емодзі
    const emoji = document.getElementById("emojiDisplay");
    emoji.style.transform = "scale(1.3)";

    setTimeout(() => {
        letter.style.transform = "scale(1)";
        letter.style.color = "#2d3436";
        emoji.style.transform = "scale(1)";
    }, 500);
}

function createCelebrationMusic() {
    try {
        // Створюємо веселу мелодію за допомогою Web Audio API
        const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();

        // Ноти для веселої мелодії (До мажор)
        const notes = [
            { freq: 523.25, duration: 0.3 }, // До
            { freq: 587.33, duration: 0.3 }, // Ре
            { freq: 659.25, duration: 0.3 }, // Мі
            { freq: 698.46, duration: 0.3 }, // Фа
            { freq: 783.99, duration: 0.6 }, // Соль
            { freq: 698.46, duration: 0.3 }, // Фа
            { freq: 659.25, duration: 0.3 }, // Мі
            { freq: 587.33, duration: 0.3 }, // Ре
            { freq: 523.25, duration: 0.6 }, // До
        ];

        let currentTime = audioContext.currentTime;

        notes.forEach((note) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(note.freq, currentTime);
            oscillator.type = "triangle";

            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                currentTime + note.duration,
            );

            oscillator.start(currentTime);
            oscillator.stop(currentTime + note.duration);

            currentTime += note.duration;
        });
    } catch (error) {
        console.log("Музика недоступна в цьому браузері");
    }
}

function showVictoryScreen() {
    const victoryScreen = document.createElement("div");
    victoryScreen.className = "victory-celebration";
    victoryScreen.innerHTML = `
        <div class="victory-content">
            <div class="victory-emoji">🎉🏆🎊</div>
            <div class="victory-text">Вітаємо! Ціль досягнута!</div>
            <div class="victory-score">Ви набрали ${score} поїнтів!</div>
            <button class="continue-btn" onclick="closeVictoryScreen()">
                Продовжити навчання
            </button>
        </div>
    `;

    document.body.appendChild(victoryScreen);

    // Запускаємо святкову музику
    createCelebrationMusic();

    // Повторюємо музику кілька разів
    setTimeout(() => createCelebrationMusic(), 1000);
    setTimeout(() => createCelebrationMusic(), 2000);
}

function closeVictoryScreen() {
    const victoryScreen = document.querySelector(".victory-celebration");

    targetScore = 0;

    if (victoryScreen) {
        document.body.removeChild(victoryScreen);
    }
}

function setTargetScore() {
    // Складна математична перевірка для батьків
    const mathQuestion = Math.floor(Math.random() * 10) + 5; // Число від 5 до 14
    const mathAnswer = mathQuestion * 3; // Складна формула

    const userAnswer = prompt(
        `Батьківський контроль:\nОбчисліть: ${mathQuestion} × 3 = ?`,
    );

    if (parseInt(userAnswer) === mathAnswer) {
        const newTarget = parseInt(
            document.getElementById("targetScoreInput").value,
        );
        targetScore = newTarget;

        if (targetScore === 0) {
            showCelebration("⚙️ Встановлено: без лімітів поїнтів");
        } else {
            showCelebration(`⚙️ Встановлено ціль: ${targetScore} поїнтів`);
        }

        updateProgress();
    } else {
        alert(
            "Неправильна відповідь! Тільки батьки можуть змінювати налаштування.",
        );
        // Повертаємо попереднє значення
        document.getElementById("targetScoreInput").value = targetScore;
    }
}

function playEmojiSound() {
    const current = getCurrentArray()[currentIndex];

    // Використовуємо аудіофайли для букв
    if (currentTab === "letters" && current.sound) {
        const audio = new Audio(`sounds/ua/letters/${current.sound}.wav`);
        audio.volume = 0.8;
        
        // Обробка помилок завантаження аудіо
        audio.onerror = function() {
            console.log(`Помилка завантаження аудіо для букви ${current.sound}`);
            // Fallback до speechSynthesis
            if ("speechSynthesis" in window) {
                const utterance = new SpeechSynthesisUtterance(current.word);
                utterance.lang = "uk-UA";
                utterance.rate = 0.9;
                utterance.pitch = 1.2;

                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }

                speechSynthesis.speak(utterance);
            }
        };
        
        audio.play().catch(function(error) {
            console.log(`Помилка відтворення аудіо: ${error}`);
            // Fallback до speechSynthesis
            if ("speechSynthesis" in window) {
                const utterance = new SpeechSynthesisUtterance(current.word);
                utterance.lang = "uk-UA";
                utterance.rate = 0.9;
                utterance.pitch = 1.2;

                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }

                speechSynthesis.speak(utterance);
            }
        });
    } else {
        // Для цифр або якщо немає звуку, використовуємо speechSynthesis
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(current.word);
            utterance.lang = "uk-UA";
            utterance.rate = 0.9;
            utterance.pitch = 1.2;

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }

            speechSynthesis.speak(utterance);
        }
    }

    // Візуальний ефект для емодзі
    const emoji = document.getElementById("emojiDisplay");
    emoji.style.transform = "scale(1.4)";
    emoji.style.filter = "brightness(1.2)";

    setTimeout(() => {
        emoji.style.transform = "scale(1)";
        emoji.style.filter = "brightness(1)";
    }, 600);
}

function playQuestionEmojiSound() {
    if (currentQuestion) {
        // Використовуємо аудіофайли для букв
        if (currentTab === "letters" && currentQuestion.sound) {
            const audio = new Audio(`sounds/ua/letters/${currentQuestion.sound}.wav`);
            audio.volume = 0.8;
            
            // Обробка помилок завантаження аудіо
            audio.onerror = function() {
                console.log(`Помилка завантаження аудіо для букви ${currentQuestion.sound}`);
                // Fallback до speechSynthesis
                if ("speechSynthesis" in window) {
                    const utterance = new SpeechSynthesisUtterance(currentQuestion.word);
                    utterance.lang = "uk-UA";
                    utterance.rate = 0.9;
                    utterance.pitch = 1.2;

                    if (selectedVoice) {
                        utterance.voice = selectedVoice;
                    }

                    speechSynthesis.speak(utterance);
                }
            };
            
            audio.play().catch(function(error) {
                console.log(`Помилка відтворення аудіо: ${error}`);
                // Fallback до speechSynthesis
                if ("speechSynthesis" in window) {
                    const utterance = new SpeechSynthesisUtterance(currentQuestion.word);
                    utterance.lang = "uk-UA";
                    utterance.rate = 0.9;
                    utterance.pitch = 1.2;

                    if (selectedVoice) {
                        utterance.voice = selectedVoice;
                    }

                    speechSynthesis.speak(utterance);
                }
            });
        } else {
            // Для цифр або якщо немає звуку, використовуємо speechSynthesis
            if ("speechSynthesis" in window) {
                const utterance = new SpeechSynthesisUtterance(currentQuestion.word);
                utterance.lang = "uk-UA";
                utterance.rate = 0.9;
                utterance.pitch = 1.2;

                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }

                speechSynthesis.speak(utterance);
            }
        }

        // Візуальний ефект
        const emoji = document.getElementById("questionEmoji");
        emoji.style.transform = "scale(1.3)";
        emoji.style.filter = "brightness(1.3)";

        setTimeout(() => {
            emoji.style.transform = "scale(1)";
            emoji.style.filter = "brightness(1)";
        }, 600);
    }
}

function nextLetter() {
    const currentArray = getCurrentArray();
    currentIndex = (currentIndex + 1) % currentArray.length;
    updateDisplay();
    playSound();
    // Очищаємо writingArea при перемиканні букви
    const writingArea = document.getElementById('writingArea');
    if (writingArea) writingArea.innerHTML = '✏️ Натисни, щоб попрактикувати написання';
}

function previousLetter() {
    const currentArray = getCurrentArray();
    currentIndex =
        currentIndex === 0 ? currentArray.length - 1 : currentIndex - 1;
    updateDisplay();
    playSound();
    // Очищаємо writingArea при перемиканні букви
    const writingArea = document.getElementById('writingArea');
    if (writingArea) writingArea.innerHTML = '✏️ Натисни, щоб попрактикувати написання';
}

function markAsLearned() {
    const current = getCurrentArray()[currentIndex];
    const currentValue =
        currentTab === "letters" ? current.letter : current.number;
    const learnedArray = getCurrentLearnedArray();

    if (!learnedArray.includes(currentValue)) {
        learnedArray.push(currentValue);

        const itemType = currentTab === "letters" ? "букву" : "цифру";
        showCelebration(
            `✅ Молодець! ${itemType.charAt(0).toUpperCase() + itemType.slice(1)} вивчено!`,
            "general",
        );
        updateProgress();

        // Зберігаємо прогрес
        if (currentUser) {
            saveProgressToCloud();
        } else {
            saveProgressToLocal();
        }

        setTimeout(() => {
            nextLetter();
        }, 1500);
    } else {
        const itemType = currentTab === "letters" ? "буква" : "цифра";
        showCelebration(`📚 Ця ${itemType} вже вивчена!`, "general");
    }
}

function showCelebration(message = "🎉 Молодець! 🎉", type = "general") {
    const celebration = document.createElement("div");
    celebration.className = `celebration ${type}`;
    celebration.textContent = message;

    // Додаємо елемент до сторінки
    document.body.appendChild(celebration);

    // Видаляємо елемент після завершення анімації
    celebration.addEventListener("animationend", () => {
        if (document.body.contains(celebration)) {
            document.body.removeChild(celebration);
        }
    });
}

// Додаємо можливість натискати на емодзі
document.addEventListener("DOMContentLoaded", () => {
    // При натисканні на емодзі в режимі навчання - озвучуємо тільки слово
    document
        .getElementById("emojiDisplay")
        .addEventListener("click", playEmojiSound);

    // При натисканні на емодзі в режимі тренування - озвучуємо слово питання
    document
        .getElementById("questionEmoji")
        .addEventListener("click", playQuestionEmojiSound);

    // При натисканні на букву - повна озвучка
    document
        .getElementById("currentLetter")
        .addEventListener("click", playSound);

    // Завантажуємо прогрес
    if (currentUser) {
        loadProgressFromCloud();
    } else {
        loadProgressFromLocal();
    }
});

// Ініціалізація
shuffleAlphabet();
shuffleNumbers();
updateDisplay();

// Додаємо підтримку клавіатури
document.addEventListener("keydown", (e) => {
    // Якщо ми в режимі тренування, блокуємо стрілки та змінюємо логіку пробілу
    if (currentMode === "training") {
        switch (e.key) {
            case "ArrowLeft":
            case "ArrowRight":
                // Блокуємо стрілки в режимі тренування
                e.preventDefault();
                return;
            case " ":
                e.preventDefault();
                // В режимі тренування пробіл озвучує питання
                playQuestionEmojiSound();
                break;
            case "Enter":
                // Enter в тренуванні не робить нічого
                e.preventDefault();
                return;
        }
    } else {
        // В режимі навчання працюють всі клавіші як раніше
        switch (e.key) {
            case "ArrowLeft":
                previousLetter();
                break;
            case "ArrowRight":
                nextLetter();
                break;
            case " ":
                e.preventDefault();
                playSound();
                break;
            case "Enter":
                markAsLearned();
                break;
        }
    }
});

// Підтримка touch подій для мобільних
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextLetter(); // Свайп вліво = наступна буква
        } else {
            previousLetter(); // Свайп вправо = попередня буква
        }
    }
}

speechSynthesis.addEventListener("voiceschanged", initializeVoices);
initializeVoices(); // Викликаємо одразу на випадок, якщо голоси вже завантажені 

function resetProgress() {
    // Запитуємо підтвердження
    if (!confirm("Ви впевнені, що хочете скинути весь прогрес? Цю дію неможливо скасувати.")) {
        return;
    }

    // Скидаємо всі дані
    learnedLetters = [];
    learnedNumbers = [];
    score = 0;
    targetScore = 0;

    // Оновлюємо відображення
    document.getElementById("targetScoreInput").value = "0";
    const scoreDisplay = document.getElementById("scoreDisplay");
    scoreDisplay.textContent = "Рахунок: 0";

    // Оновлюємо інтерфейс
    updateDisplay();
    updateProgress();
    updateAlphabetGrid();

    // Зберігаємо зміни
    if (currentUser) {
        saveProgressToCloud();
    } else {
        saveProgressToLocal();
    }

    // Показуємо повідомлення
    showCelebration("🔄 Прогрес скинуто!", "general");
} 