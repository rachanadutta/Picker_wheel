const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const addBtn = document.getElementById("addBtn");
const itemInput = document.getElementById("itemInput");
const itemList = document.getElementById("itemList");
const resultOverlay = document.getElementById("resultOverlay");
const spinSound = new Audio("spin.mp3");

const confettiSound = new Audio("confetti.mp3");
spinSound.preload = "auto";

confettiSound.preload = "auto";

confettiSound.volume = 0.2;
spinSound.volume = 0.2;


let items = ["Yes", "No", "Yes", "No"]; // default items
const colors = ["#FF5733", "#FFC300", "#28B463", "#5DADE2", "#AF7AC5", "#F39C12"];

let startAngle = 0;
let arc = 0;
let spinSpeed = 0;
let spinning = false;

function drawWheel() {
  arc = (2 * Math.PI) / items.length;
  for (let i = 0; i < items.length; i++) {
    const angle = startAngle + i * arc;
    ctx.beginPath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, angle, angle + arc);
    ctx.fill();

    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "18px sans-serif";
    ctx.fillText(items[i], 180, 10);
    ctx.restore();
  }
}

function spin() {
  if (!spinning) return;
  spinSpeed *= 0.98;
  if (spinSpeed < 0.01) {
    
    spinSound.pause();
    spinSound.loop = false;
    spinSound.currentTime = 0; // Reset sound
    
    spinning = false;
    const degrees = (startAngle * 180) / Math.PI ;
    const index = Math.floor(((360 - (degrees % 360)) / (360 / items.length))) % items.length;
    showResult(items[index]);
    launchConfetti();
    
    
  
    
    confettiSound.play();
    
    
  return;
  }
  
  startAngle += spinSpeed;
  draw();
  requestAnimationFrame(spin);

}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWheel();
}

function launchConfetti() {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function showResult(text) {
  resultOverlay.innerHTML = `<div class="flex flex-col items-center justify-evenly p-5 h-full gap-5">
  <div class="text-xl">Winner is</div>
        <div id="resultText" class="text-5xl">${text}</div>
        <div id="close" class="border-[2px] border-white text-white cursor-pointer align-self-end text-xl p-2">Close</div></div>`;
  
  resultOverlay.classList.remove("hidden");
  const closeBtn = document.getElementById("close");
  
  closeBtn.addEventListener("click", () => {
    resultOverlay.classList.add("hidden");
    resultOverlay.innerHTML = "";
    
    confettiSound.pause();
    confettiSound.currentTime = 0; // Reset sound
  })
}

function addItem() {
  const value = itemInput.value.trim();
  if (!value) return;
  if (items.join(",") === "Yes,No,Yes,No") {
    items = [];
  }
  items.push(value);
  itemInput.value = "";
  renderList();
  draw();
}

function deleteItem(index) {
  items.splice(index, 1);
  renderList();
  draw();
}

function editItem(index) {
  const newValue = prompt("Edit item:", items[index]);
  if (newValue && newValue.trim()) {
    items[index] = newValue.trim();
    renderList();
    draw();
  }
}

function renderList() {
  itemList.innerHTML = "";
  items.forEach((item, i) => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center bg-gray-700 px-3 py-1 rounded";
    li.innerHTML = `
      <span>${item}</span>
      <div class="space-x-2">
        <button onclick="editItem(${i})" class="bg-yellow-500 px-2 py-1 rounded">Edit</button>
        <button onclick="deleteItem(${i})" class="bg-red-500 px-2 py-1 rounded">Delete</button>
      </div>
    `;
    itemList.appendChild(li);
  });
}
itemInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        addItem();
    }
})


addBtn.addEventListener("click", addItem);
spinBtn.addEventListener("click", () => {
  if (!spinning && items.length > 0) {
    spinSpeed = Math.random() * 0.3 + 0.3;
    spinning = true;
    resultOverlay.classList.add("hidden");
    spinSound.currentTime = 0; // Reset sound
    
    spinSound.loop = true; // Loop the sound
    spinSound.play();
    spin();
  }
});

renderList();
draw();
