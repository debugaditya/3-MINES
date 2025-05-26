function resetimages() { 
  const boxes = document.querySelectorAll(".box");
  boxes.forEach(box => {
    box.style.backgroundImage = "none";
    box.style.backgroundColor = "";
    box.textContent = box.dataset.originalText || "";
    const newBox = box.cloneNode(true);
    box.parentNode.replaceChild(newBox, box);
  });
}

function disableAllBoxes() {
  const boxes = document.querySelectorAll(".box");
  boxes.forEach(box => {
    const clone = box.cloneNode(true);
    box.parentNode.replaceChild(clone, box);
  });
}

function resetGame() {
  cnt = 0;
  const submitBtn = document.querySelector(".gameform button[type='submit']");
  submitBtn.disabled = false;
  submitBtn.style.backgroundColor = "";
}

function getThreeDistinctNumbers() {
  const nums = new Set();
  while (nums.size < 3) {
    const randomNum = Math.floor(Math.random() * 9);
    nums.add(randomNum);
  }
  return [...nums];
}

let cnt = 0;
let amount = 0;
let randomNumbers = [];

document.querySelector(".gameform").addEventListener("submit", function (e) {
  e.preventDefault();
  const boxes = document.querySelectorAll(".box");

  boxes.forEach(box => {
    if (!box.dataset.originalText) {
      box.dataset.originalText = box.textContent;
    }
    box.textContent = box.dataset.originalText;
    box.style.backgroundImage = "none";
    box.style.backgroundColor = "";
    const newBox = box.cloneNode(true);
    box.parentNode.replaceChild(newBox, box);
  });

  const amountInput = document.getElementById("amt");
  const initialBalance = document.querySelector(".balance");
  amount = Number(amountInput.value);
  let balance = Number(initialBalance.textContent.match(/\d+/)[0]);
  document.querySelector(".winning").textContent = `BET: ${amount}$`;

  if (amount > balance) {
    alert("AUKAAT ME MITTARR!");
    return;
  }

  document.querySelector(".balance").textContent = `BALANCE: ${balance - amount} $`;

  const submitBtn = document.querySelector(".gameform button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.style.backgroundColor = "#ff4444";
  const w = document.querySelector(".withdraw");
  w.style.backgroundColor = "green";
  w.disabled = false;
  randomNumbers = getThreeDistinctNumbers();

  const newBoxes = document.querySelectorAll(".box");

  newBoxes.forEach((box, i) => {
    box.addEventListener("click", function handleClick() {
      this.textContent = "";

      if (randomNumbers.includes(i)) {
        const audio = new Audio('lose.wav');
        audio.play();
        this.style.backgroundImage = "url('mine.jpg')";
        this.style.backgroundSize = "cover";
        this.style.backgroundPosition = "center";
        this.style.backgroundRepeat = "no-repeat";
        document.querySelector(".winning").textContent = `BET: 0$`;
        disableAllBoxes();
        resetGame();
        const w = document.querySelector(".withdraw");
        w.style.backgroundColor = "#ff4444";
        w.disabled = true;
      } else {
        const audio = new Audio('ting.mp3');
        audio.play();
        this.style.backgroundImage = "url('diamond.svg')";
        this.style.backgroundSize = "cover";
        this.style.backgroundPosition = "center";
        this.style.backgroundRepeat = "no-repeat";

        const clone = this.cloneNode(true);
        box.parentNode.replaceChild(clone, this);

        cnt++;
        if (cnt == 1) amount *= 1.12;
        else if (cnt == 2) amount *= 1.29;
        else if (cnt == 3) amount *= 1.48;
        else if (cnt == 4) amount *= 1.71;
        else if (cnt == 5) amount *= 2;
        else if (cnt == 6) amount *= 2.35;

        document.querySelector(".winning").textContent = `BET: ${amount.toFixed(2)}$`;
      }
    });
  });

  document.querySelector(".withdraw").addEventListener("click", function () {
    w.style.backgroundColor = "#ff4444";
    w.disabled = true;
    let currentWinning = Number(document.querySelector(".winning").textContent.match(/\d+(\.\d+)?/)[0]);
    let balanceElement = document.querySelector(".balance");
    let balance = Number(balanceElement.textContent.match(/\d+/)[0]);
    balance += currentWinning;
    const audio = new Audio('money.mp3');
    audio.play();
    balanceElement.textContent = `BALANCE: ${balance} $`;
    document.querySelector(".winning").textContent = `BET: 0$`;
    cnt = 0;
    const clone = this.cloneNode(true);
    this.parentNode.replaceChild(clone, this);
    disableAllBoxes();
    resetGame();
  });
});

