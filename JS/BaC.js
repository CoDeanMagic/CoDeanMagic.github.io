// 遊戲狀態管理
let answer = []; // 儲存遊戲的答案數字
let isGameStarted = false; // 追蹤遊戲是否已開始
let guessHistory = []; // 儲存猜測歷史記錄

// DOM 元素
const startBtn = document.querySelector(".btn-custom:nth-child(1)"); // 選取"開始"按鈕
const resetBtn = document.querySelector(".btn-custom:nth-child(2)"); // 選取"放棄重來"按鈕
const showAnswerBtn = document.querySelector(".btn-custom:nth-child(3)"); // 選取"看答案"按鈕
const guessInput = document.getElementById("guessNumber"); // 選取輸入框
const guessBtn = document.querySelector(".input-box .btn-custom"); // 選取"猜！"按鈕
const resultBox = document.querySelector(".result-box .list-group"); // 選取結果顯示區
const hintToast = document.getElementById("hintToast"); // 選取提示框
const toast = new bootstrap.Toast(hintToast); // 初始化Bootstrap的Toast組件

// 生成隨機答案
function generateAnswer() {
  // 創建一個0-9的數字陣列
  const numbers = Array.from({ length: 10 }, (_, i) => i); // 0-9
  answer = [];

  // 隨機選取4個不重複的數字
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length); // 產生隨機索引
    answer.push(numbers[randomIndex]); // 將選中的數字加入答案
    numbers.splice(randomIndex, 1); // 從數字池中移除已選的數字
  }
  return answer;
}

// 驗證輸入
function validateInput(input) {
  // 檢查是否為4位數字
  if (!/^\d{4}$/.test(input)) {
    showHint("請輸入4位數字");
    return false;
  }

  // 檢查數字是否重複
  const digits = input.split("").map(Number); // 將輸入字串轉為數字陣列
  const uniqueDigits = new Set(digits); // 使用Set來檢查唯一性
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
