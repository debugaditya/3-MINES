function resetimages() {
  const boxes = document.querySelectorAll(".box");
  boxes.forEach(box => {
    box.style.backgroundImage = "none";
    box.style.backgroundColor = "";
    // Restore original text from data attribute
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
  document.querySelector(".gameform button[type='submit']").disabled = false;
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

  // Save original text content once and restore text on start/reset
  boxes.forEach(box => {
    if (!box.dataset.originalText) {
      box.dataset.originalText = box.textContent;
    }
    box.textContent = box.dataset.originalText;
    box.style.backgroundImage = "none";
    box.style.backgroundColor = "";

    // Replace with clone to remove old listeners if needed
    const newBox = box.cloneNode(true);
    box.parentNode.replaceChild(newBox, box);
  });

  resetimages();

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
  document.querySelector(".gameform button[type='submit']").disabled = true;

  randomNumbers = getThreeDistinctNumbers();

  // Re-query boxes because replaced with clones
  const newBoxes = document.querySelectorAll(".box");

  newBoxes.forEach((box, i) => {
    box.addEventListener("click", function handleClick() {
      // Hide text on click
      this.textContent = "";

      if (randomNumbers.includes(i)) {
        this.style.backgroundImage = "url('mine.jpg')";
        this.style.backgroundSize = "cover";
        this.style.backgroundPosition = "center";
        this.style.backgroundRepeat = "no-repeat";
        const audio = new Audio('lose.wav'); // Path to your audio file
        audio.play();
        document.querySelector(".winning").textContent = `BET: 0$`;

        disableAllBoxes();
        resetGame();
      } else {
        const audio = new Audio('ting.mp3'); // Path to your audio file
        audio.play();
        this.style.backgroundImage = "url('diamond.svg')";
        this.style.backgroundSize = "cover";
        this.style.backgroundPosition = "center";
        this.style.backgroundRepeat = "no-repeat";
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
});

// Withdraw — now disables boxes
document.querySelector(".withdraw").addEventListener("click", function () {
  let currentWinning = Number(document.querySelector(".winning").textContent.match(/\d+(\.\d+)?/)[0]);
  let balanceElement = document.querySelector(".balance");
  let balance = Number(balanceElement.textContent.match(/\d+/)[0]);
  balance += currentWinning;
  const audio = new Audio('money.mp3'); // Path to your audio file
  audio.play();
  balanceElement.textContent = `BALANCE: ${balance} $`;
  document.querySelector(".winning").textContent = `BET: 0$`;
  cnt = 0;
  disableAllBoxes();
  resetGame();
});
