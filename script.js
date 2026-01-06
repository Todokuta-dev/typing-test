const wpmDisplay = document.getElementById("wpm-display");
const bestDisplay = document.getElementById("best-display");
const accuracyId = document.getElementById("accuracy-id");
const timeDisplay = document.getElementById("time-id");
const lowButton = document.getElementById("low-button");
const mediumButton = document.getElementById("medium-button");
const highButton = document.getElementById("high-button");
const contentDisplay = document.getElementById("sentence-display");
const resetButton = document.getElementById("reset-btn");

let time = 0;
let wpm = "";
let accuracy = 0;
let currentIndex = 0;
let wrongChar = "";
let rightChar = "";
let sentence = "";
let userInput = "";
let testRunning = false;
let difficulty = "easy";
let timerInterval;

let sentences = {
  easy: "Learning to type is a hard challenge. This is some random typing that you can use to practice. Ok, thank you for typing this",
  medium: "Business meetings, and professional recordings can contain sensitive data, so security is something a transcription company should not overlook when providing services. Companies should therefore follow the various laws and industry best practice, especially so when serving law firms, government agencies or courts.",
  high: "Medical Transcription specifically is governed by HIPAA, which elaborates data security practices and compliance measures to be strictly followed, failure of which leads to legal action and penalties. Transcription security includes maintaining confidentiality of the data through information security practices including limiting access with passwords and ensuring a secure environment for data and appropriate methods of disposal of all materials and deletion of files.",
};

let timeLimits = {
  easy: 30,
  medium: 50,
  high: 70,
};

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (key === " ") {
    event.preventDefault();
  }

  if (key.length > 1) return;
  if (!testRunning) {
    startTest();
  }
  checkChars(key);
});

function displaySentence() {
  if (!sentence) return;
  contentDisplay.innerHTML = "";
  const characters = sentence.split("");
  for (let i = 0; i < characters.length; i++) {
    const spanElem = document.createElement("span");
    spanElem.textContent = characters[i];
    contentDisplay.appendChild(spanElem);
  }
}

lowButton.addEventListener("click", () => switchDifficulty("easy"));
mediumButton.addEventListener("click", () => switchDifficulty("medium"));
highButton.addEventListener("click", () => switchDifficulty("high"));
resetButton.addEventListener("click", resetTimer);

function switchDifficulty(diff) {
  difficulty = diff;
  sentence = sentences[diff];
  resetTimer();
  displaySentence();
}

function checkChars(key) {
  const correctChar = sentence[currentIndex];
  const spans = contentDisplay.children;
  const currentSpan = spans[currentIndex];
  if (key === correctChar) {
    rightChar++;
    currentSpan.style.color = "green";
  } else {
    wrongChar++;
    currentSpan.style.color = "red";
  }
  currentIndex++;
  if (currentIndex === sentence.length) {
    endTest();
  }
}

function startTest() {
  testRunning = true;
  time = timeLimits[difficulty];
  timerInterval = setInterval(() => {
    time--;
    timeDisplay.textContent = time;
    if (time === 0) {
      endTest();
      return;
    }
  }, 1000);
}

function endTest() {
  clearInterval(timerInterval);
  testRunning = false;
  const timeElapsed = (timeLimits[difficulty] - time) / 60;

  wpm = rightChar / 5 / timeElapsed;

  accuracy = (rightChar / (rightChar + wrongChar)) * 100;
  updatePersonalBest();

  wpmDisplay.textContent = Math.round(wpm);
  accuracyId.textContent = Math.round(accuracy);
}

function resetTimer() {
  clearInterval(timerInterval);
  time = 0;
  rightChar = 0;
  wrongChar = 0;
  currentIndex = 0;
  testRunning = false;
  timeDisplay.textContent = 0;
  wpmDisplay.textContent = 0;
  accuracyId.textContent = 0;
  displaySentence();
}

function updatePersonalBest() {
  let personalBest = localStorage.getItem("personalBest") || 0;
  console.log("current wpm:", wpm);
  console.log("current saved:", personalBest);
  if (wpm > personalBest) {
    localStorage.setItem("personalBest", Math.round(wpm));
    bestDisplay.textContent = Math.round(wpm);
  }
}

localStorage.clear();
