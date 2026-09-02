const piston1 = document.getElementById("piston1");
const piston2 = document.getElementById("piston2");

const crank1 = document.getElementById("crank1");
const crank2 = document.getElementById("crank2");

const rod1 = document.getElementById("rod1");
const rod2 = document.getElementById("rod2");

const fire1 = document.getElementById("fire1");
const fire2 = document.getElementById("fire2");

const air1 = document.getElementById("air1");
const air2 = document.getElementById("air2");

const exhaust1 = document.getElementById("exhaust1");
const exhaust2 = document.getElementById("exhaust2");

const intake1 = document.getElementById("intake1");
const intake2 = document.getElementById("intake2");

const exhaustValve1 = document.getElementById("exhaustValve1");
const exhaustValve2 = document.getElementById("exhaustValve2");

const rpmText = document.getElementById("rpmText");
const rpmSlider = document.getElementById("rpmSlider");

const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");

const strokes = [
    document.getElementById("stroke1"),
    document.getElementById("stroke2"),
    document.getElementById("stroke3"),
    document.getElementById("stroke4")
];

let running = false;
let rpm = Number(rpmSlider.value);
let angle = 0;
let lastTime = performance.now();

/* =========================
ปุ่มสตาร์ท (แก้จุดที่ 2: เพิ่มการสั่งเรียก animate)
========================= */

startButton.addEventListener("click", function () {
    if (!running) {
        running = true;
        lastTime = performance.now();
        requestAnimationFrame(animate);
    }
});

/* =========================
ปุ่มดับเครื่อง
========================= */

stopButton.addEventListener("click", function () {
    running = false;
    rpmText.textContent = "0";
});

/* =========================
ปรับ RPM
========================= */

rpmSlider.addEventListener("input", function () {
    rpm = Number(rpmSlider.value);
});

/* =========================
หาจังหวะเครื่องยนต์ 4 จังหวะ
========================= */

function getStroke(degrees) {
    const cycle = ((degrees % 720) + 720) % 720;

    if (cycle < 180) return 0;
    if (cycle < 360) return 1;
    if (cycle < 540) return 2;
    return 3;
}

/* =========================
อัปเดตภาพของแต่ละสูบ
========================= */

function updateCylinder(
    phase,
    air,
    fire,
    exhaustGas,
    intakeValve,
    exhaustValve
) {
    /* รีเซ็ต */
    air.style.opacity = "0";
    fire.style.opacity = "0";
    exhaustGas.style.opacity = "0";

    fire.style.transform = "scale(0.4)";

    intakeValve.style.height = "55px";
    exhaustValve.style.height = "55px";

    /* จังหวะดูด */
    if (phase === 0) {
        air.style.opacity = "0.75";
        intakeValve.style.height = "75px";
    }

    /* จังหวะอัด */
    if (phase === 1) {
        air.style.opacity = "0.25";
    }

    /* จังหวะระเบิด */
    if (phase === 2) {
        fire.style.opacity = "1";
        fire.style.transform = "scale(1.25)";
    }

    /* จังหวะคาย */
    if (phase === 3) {
        exhaustGas.style.opacity = "0.75";
        exhaustValve.style.height = "75px";
    }
}

/* =========================
แสดงจังหวะที่กำลังทำงาน
========================= */

function updateStrokeDisplay(phase) {
    strokes.forEach(function (stroke, index) {
        stroke.classList.remove("active");
        if (index === phase) {
            stroke.classList.add("active");
        }
    });
}

/* =========================
ANIMATION (แก้จุดที่ 1 & 3: เติมส่วนที่ขาดจนสมบูรณ์)
========================= */

function animate(currentTime) {
    if (!running) return;

    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // อัปเดตตัวเลข RPM บน UI
    rpmText.textContent = rpm;

    // คำนวณองศาตาม RPM
    const degreesPerSecond = rpm * 6;
    angle += degreesPerSecond * (deltaTime / 1000);

    /* =====================
       CRANKSHAFT
    ===================== */
    crank1.style.transform = `rotate(${angle}deg)`;
    crank2.style.transform = `rotate(${angle + 180}deg)`;

    /* =====================
       PISTON MOVEMENT
    ===================== */
    const rad1 = angle * Math.PI / 180;
    const rad2 = (angle + 180) * Math.PI / 180;

    const pistonMove1 = 115 + Math.cos(rad1) * 105;
    const pistonMove2 = 115 + Math.cos(rad2) * 105;

    piston1.style.top = pistonMove1 + "px";
    piston2.style.top = pistonMove2 + "px";

    /* =====================
       CONNECTING RODS
    ===================== */
    const rodAngle1 = Math.sin(rad1) * 25;
    const rodAngle2 = Math.sin(rad2) * 25;

    rod1.style.transformOrigin = "top center";
    rod2.style.transformOrigin = "top center";

    rod1.style.top = (pistonMove1 + 40) + "px";
    rod2.style.top = (pistonMove2 + 40) + "px";

    rod1.style.transform = `rotate(${rodAngle1}deg)`;
    rod2.style.transform = `rotate(${rodAngle2}deg)`;

    /* =====================
       4 STROKE ENGINE CYCLES
    ===================== */
    const phase1 = getStroke(angle);
    const phase2 = getStroke(angle + 180);

    // อัปเดตสภาวะของแต่ละสูบ
    updateCylinder(phase1, air1, fire1, exhaust1, intake1, exhaustValve1);
    updateCylinder(phase2, air2, fire2, exhaust2, intake2, exhaustValve2);

    // อัปเดต UI แถบจังหวะ (ยึดตามสูบที่ 1)
    updateStrokeDisplay(phase1);

    // วนลูปแอนิเมชันถัดไป
    requestAnimationFrame(animate);
}