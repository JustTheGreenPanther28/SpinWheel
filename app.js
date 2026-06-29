let names = ["Raj", "Yash", "Raja"];
let currentAngle = 0;

// document.getElementById('submit').addEventListener("click", () => {
//     names = document.getElementById('names').value.split(',');
//     loadCircle(names);
//     document.getElementById('names').value = '';
// });

document.getElementById("spin-btn").addEventListener("click", () => {
    if (names.length >= 1 && names[0] != "") {
        document.getElementById("spin-btn").disabled = true;
        spinSpeed = (Math.random() * 0.2 + 0.3);
        spin();
    }
})


/*(0,0)──────────(400,0)
  │                  │
  │                  │
  │    (200,200)     │
  │                  │
(0,400)────────(400,400)
*/
function loadCircle() {
    const canvas = document.getElementById("wheel");
    const ctx = canvas.getContext("2d");
    const cx = 200, cy = 200, radius = 200;
    if (names.length >= 1 && names[0] != "") {

        colors = ["#4285F4", "#34A853", "#FBBC05", "#EA4335"];
        const anglePerSlice = (2 * Math.PI) / names.length;

        ctx.clearRect(0, 0, 400, 400); // yeh purana circle hata dega puarana wala 
        ctx.save();

        //to rotate it from center
        ctx.translate(cx, cy);
        ctx.rotate(currentAngle);
        ctx.translate(-cx, -cy); // again back to 0,0


        //The canvas needs radian , full circl= 2PI 
        for (let i = 0; i < names.length; i++) {
            const start = i * anglePerSlice;
            const end = start + anglePerSlice;

            //sector ko draw karna
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, start, end);
            ctx.closePath();

            //Andar ka color
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();

            //border ka color
            ctx.strokeStyle = "white";
            ctx.stroke();

            //canvas ki current transformation state save karta hai 
            ctx.save();


            const midAngle = start + anglePerSlice / 2;
            ctx.translate(cx, cy);
            ctx.rotate(midAngle);
            ctx.fillStyle = "white";
            ctx.font = "bold 18px Arial";
            ctx.fillText(names[i], radius * 0.4, 6);
            ctx.restore();
        }
    }
    else {

        //default gray circle
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.closePath();

        ctx.fillStyle = "gray";
        ctx.fill();
    }

    // center white circle
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

document.addEventListener("DOMContentLoaded", loadCircle);

