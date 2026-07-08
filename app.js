const TWO_PI = 2 * Math.PI;
const CX = 200, CY = 200, RADIUS = 200;
const COLORS = ["#4285F4", "#34A853", "#FBBC05", "#EA4335"];

let names = [];
let currentAngle = 0;
let spinSpeed = 0;
let spinning = false;

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

function drawWheel() {
    ctx.clearRect(0, 0, 400, 400);

    if (names.length === 0) {
        ctx.beginPath();
        ctx.arc(CX, CY, RADIUS, 0, TWO_PI);
        ctx.fillStyle = "gray";
        ctx.fill();
        drawHub();
        return;
    }

    const anglePerSlice = TWO_PI / names.length;

    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(currentAngle);
    ctx.translate(-CX, -CY);

    for (let i = 0; i < names.length; i++) {
        const start = i * anglePerSlice;
        const end = start + anglePerSlice;

        ctx.beginPath();
        ctx.moveTo(CX, CY);
        ctx.arc(CX, CY, RADIUS, start, end);
        ctx.closePath();
        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();

        let fontSize = getFontSize()
        ctx.save();
        const midAngle = start + anglePerSlice / 2;
        ctx.translate(CX, CY);
        ctx.rotate(midAngle);
        ctx.fillStyle = "white";
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textBaseline = "middle";
        if (names[i].length >= 6) {
            ctx.fillText(names[i].substring(0, 6) + "...", RADIUS * 0.45, 0);
        }
        else {
            ctx.fillText(names[i], RADIUS * 0.45, 0);
        }
        ctx.restore();
    }

    ctx.restore();
    drawHub();
}

function getFontSize() {
    const n = names.length;
    const base = 22;
    const min = 9;
    const size = base - (n - 1) * 1.3;
    return Math.max(min, size);
}

function drawHub() {
    ctx.beginPath();
    ctx.arc(CX, CY, 28, 0, TWO_PI);
    ctx.fillStyle = "white";
    ctx.fill();
}

function getWinningIndex() {
    const anglePerSlice = TWO_PI / names.length;
    let normalized = (Math.PI - currentAngle) % TWO_PI;
    if (normalized < 0) normalized += TWO_PI;
    return Math.floor(normalized / anglePerSlice);
}

function spinTick() {
    if (spinSpeed > 0.0015) {
        currentAngle = (currentAngle + spinSpeed) % TWO_PI;
        spinSpeed *= 0.985;
        drawWheel();
        requestAnimationFrame(spinTick);
    } else {
        spinning = false;
        announceWinner();
    }
}

function announceWinner() {
    const winningIndex = getWinningIndex();
    showAlert("WINNER", names[winningIndex], winningIndex);
}

function setWheelEnabled(enabled) {
    canvas.classList.toggle("disabled", !enabled);
    submitBtn.disabled = !enabled;
}

function closeAlert(winBox) {
    winBox.classList.add('closing');
    winBox.addEventListener('transitionend', () => {
        winBox.style.display = 'none';
        winBox.classList.remove('closing');
        setWheelEnabled(true);
    }, { once: true });
}

function showAlert(headingMsg, alertMsg, index) {
    const winBox = document.getElementById("alert");
    const winnerText = document.getElementById("alert-message");
    const heading = document.getElementById("heading");

    winnerText.textContent = alertMsg;
    heading.textContent = headingMsg;
    winBox.style.display = "flex";
    winBox.classList.remove('closing');

    const oldRemoveBtn = document.getElementById("remove");
    const oldCancelBtn = document.getElementById("cancel");
    const removeBtn = oldRemoveBtn.cloneNode(true);
    const cancelBtn = oldCancelBtn.cloneNode(true);
    oldRemoveBtn.replaceWith(removeBtn);
    oldCancelBtn.replaceWith(cancelBtn);

    removeBtn.addEventListener("click", () => {
        names.splice(index, 1);
        drawWheel();
        closeAlert(winBox);
    });

    cancelBtn.addEventListener("click", () => {
        drawWheel();
        closeAlert(winBox);
    });
}

const submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", () => {
    const raw = document.getElementById("names").value;
    names = raw.split(",").map(n => n.trim()).filter(n => n !== "");
    currentAngle = 0;
    drawWheel();
    document.getElementById("names").value = "";
});

canvas.addEventListener("click", () => {
    if (spinning || names.length === 0) return;
    spinning = true;
    setWheelEnabled(false);
    spinSpeed = Math.random() * 0.25 + 0.35;
    requestAnimationFrame(spinTick);
});

drawWheel();