// ============================================================
// Wheel of Names — clean rewrite
//
// Canvas angle convention (standard HTML canvas):
//   angle 0     = 3 o'clock (east)
//   angle PI/2  = 6 o'clock (south)   [angles increase CLOCKWISE
//   angle PI    = 9 o'clock (west)     because the y-axis points down]
//   angle 3PI/2 = 12 o'clock (north)
//
// The pointer is fixed on the LEFT side of the wheel (9 o'clock),
// which is screen-angle PI. This is set in CSS (#pointer { left: -26px }).
//
// A slice drawn at LOCAL angle theta ends up, after ctx.rotate(currentAngle),
// sitting at SCREEN angle (theta + currentAngle). So the winning slice is
// whichever local angle theta satisfies:
//      theta + currentAngle = PI   (mod 2*PI)
//   -> theta = PI - currentAngle   (mod 2*PI)
// ============================================================

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

        // label
        ctx.save();
        const midAngle = start + anglePerSlice / 2;
        ctx.translate(CX, CY);
        ctx.rotate(midAngle);
        ctx.fillStyle = "white";
        ctx.font = "bold 18px Arial";
        ctx.textBaseline = "middle";
        ctx.fillText(names[i], RADIUS * 0.55, 0);
        ctx.restore();
    }

    ctx.restore();
    drawHub();
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
        setWheelEnabled(true);
        announceWinner();
    }
}

function announceWinner() {
    const winningIndex = getWinningIndex();
    showAlert("WINNER", names[winningIndex]);
}

function setWheelEnabled(enabled) {
    canvas.classList.toggle("disabled", !enabled);
    submitBtn.disabled = !enabled;
}

function showAlert(headingMsg, alertMsg) {
    const winBox = document.getElementById("alert");
    const winnerText = document.getElementById("alert-message");
    const heading = document.getElementById("heading");

    winnerText.textContent = alertMsg;
    heading.textContent = headingMsg;
    winBox.style.display = "flex";

    setTimeout(() => {
        winBox.style.display = "none";
    }, 4000);
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