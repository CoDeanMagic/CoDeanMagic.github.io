// 遊戲狀態管理
/// !!! answer可用const宣告，但更新answer的方式要調整，避免後面被更改
let answer = []; // 儲存遊戲的答案數字
let isGameStarted = false; // 追蹤遊戲是否已開始
/// !!! guessHistory可用const宣告，用array移除，避免後面被更改
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
//可以用一個for迴圈解決;
function calculateAB(guess) {
  const guessDigits = guess.split("").map(Number); // 將猜測轉為數字陣列
  let A = 0; // 位置和數字都對的計數
  let B = 0; // 只有數字對的計數

  // 計算 A（位置和數字都對）
  for (let i = 0; i < 4; i++) {
    if (guessDigits[i] === answer[i]) {
      A++;
    }
  }

  // 計算 B（數字對但位置不對）
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
  // !!!產生新的答案，把邏輯寫出去，讓程式碼看起來更簡潔
  answer = generateAnswer(); // 產生新的答案
  isGameStarted = true; // 設置遊戲狀態為已開始
  guessHistory = []; // 清空猜測歷史記錄陣列
  resultBox.innerHTML = ""; // 清空結果顯示區域的內容
  guessInput.value = ""; // 清空輸入框的值
  guessInput.disabled = false; // 啟用輸入框
  guessBtn.disabled = false; // 啟用猜測按鈕

  // console.log 可以輸出多個值
  console.log("Answer:", answer.join(""), "gg"); // 開發時用，實際上線要移除
});

// 重置遊戲
resetBtn.addEventListener("click", () => {
  isGameStarted = false; // 將遊戲狀態設為未開始
  answer = []; // 清空答案陣列
  guessHistory = []; // 清空猜測歷史紀錄陣列
  resultBox.innerHTML = ""; // 清空結果顯示區域的內容
  guessInput.value = ""; // 清空輸入框的值
  guessInput.disabled = true; // 禁用輸入框
  guessBtn.disabled = true; // 禁用猜測按鈕
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

  const guess = guessInput.value; // 獲取輸入框的值
  if (!validateInput(guess)) {
    // 驗證輸入是否合法
    return; // 如果不合法，中斷執行
  }

  const result = calculateAB(guess); // 計算 A 和 B 的數量
  addGuessToHistory(guess, result); // 將猜測結果添加到歷史記錄

  if (result.A === 4) {
    // 如果 A = 4，表示完全猜對
    //!!!猜對加上不同的顯示內容，例如猜對時顯示綠色，其他時候顯示紅色
    showHint("恭喜你猜對了！"); // 顯示祝賀訊息
    isGameStarted = false; // 結束遊戲
    guessInput.disabled = true; // 禁用輸入框
    guessBtn.disabled = true; // 禁用猜測按鈕
  }

  guessInput.value = ""; // 清空輸入框，準備下一次猜測
});

//!!!window load 資源載入完成後，或是DOM載入完成後 要觸發的事件
// 初始化：禁用輸入和猜測按鈕
guessInput.disabled = true;
guessBtn.disabled = true;
