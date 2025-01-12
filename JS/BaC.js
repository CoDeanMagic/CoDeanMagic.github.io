// 遊戲狀態管理
let answer = [];
let isGameStarted = false;
let guessHistory = [];

// DOM 元素
const startBtn = document.querySelector(".btn-custom:nth-child(1)");
const resetBtn = document.querySelector(".btn-custom:nth-child(2)");
const showAnswerBtn = document.querySelector(".btn-custom:nth-child(3)");
const guessInput = document.getElementById("guessNumber");
const guessBtn = document.querySelector(".input-box .btn-custom");
const resultBox = document.querySelector(".result-box .list-group");
const hintToast = document.getElementById("hintToast");
const toast = new bootstrap.Toast(hintToast);

// 生成隨機答案
function generateAnswer() {
  const numbers = Array.from({ length: 10 }, (_, i) => i); // 0-9
  answer = [];
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    answer.push(numbers[randomIndex]);
    numbers.splice(randomIndex, 1);
  }
  return answer;
}

// 驗證輸入
function validateInput(input) {
  if (!/^\d{4}$/.test(input)) {
    showHint("請輸入4位數字");
    return false;
  }

  const digits = input.split("").map(Number);
  const uniqueDigits = new Set(digits);
  if (uniqueDigits.size !== 4) {
    showHint("數字不能重複");
    return false;
  }

  return true;
}

// 計算 AB 數量
function calculateAB(guess) {
  const guessDigits = guess.split("").map(Number);
  let A = 0;
  let B = 0;

  // 計算 A
  for (let i = 0; i < 4; i++) {
    if (guessDigits[i] === answer[i]) {
      A++;
    }
  }

  // 計算 B
  for (let i = 0; i < 4; i++) {
    if (answer.includes(guessDigits[i]) && guessDigits[i] !== answer[i]) {
      B++;
    }
  }

  return { A, B };
}

// 顯示提示訊息
function showHint(message) {
  const toastBody = document.querySelector(".toast-body");
  toastBody.textContent = `提示: ${message}`;
  toast.show();
}

// 添加猜測結果到歷史記錄
function addGuessToHistory(guess, result) {
  const li = document.createElement("li");
  li.className = "list-group-item";
  li.innerHTML = `
        <span class="badge bg-primary">${result.A}A${result.B}B</span> ${guess}
    `;
  resultBox.insertBefore(li, resultBox.firstChild);
}

// 遊戲開始
startBtn.addEventListener("click", () => {
  answer = generateAnswer();
  isGameStarted = true;
  guessHistory = [];
  resultBox.innerHTML = "";
  guessInput.value = "";
  guessInput.disabled = false;
  guessBtn.disabled = false;
  console.log("Answer:", answer.join("")); // 開發時用，實際上線要移除
});

// 重置遊戲
resetBtn.addEventListener("click", () => {
  isGameStarted = false;
  answer = [];
  guessHistory = [];
  resultBox.innerHTML = "";
  guessInput.value = "";
  guessInput.disabled = true;
  guessBtn.disabled = true;
});

// 顯示答案
showAnswerBtn.addEventListener("click", () => {
  if (isGameStarted) {
    showHint(`答案是: ${answer.join("")}`);
  } else {
    showHint("請先開始遊戲");
  }
});

// 猜數字
guessBtn.addEventListener("click", () => {
  if (!isGameStarted) {
    showHint("請先開始遊戲");
    return;
  }

  const guess = guessInput.value;
  if (!validateInput(guess)) {
    return;
  }

  const result = calculateAB(guess);
  addGuessToHistory(guess, result);

  if (result.A === 4) {
    showHint("恭喜你猜對了！");
    isGameStarted = false;
    guessInput.disabled = true;
    guessBtn.disabled = true;
  }

  guessInput.value = "";
});

// 初始化：禁用輸入和猜測按鈕
guessInput.disabled = true;
guessBtn.disabled = true;
