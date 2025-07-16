const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];

for (let i = 0; i < 200; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        vx: Math.floor(Math.random() * 50) - 25,
        vy: Math.floor(Math.random() * 50) - 25
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";

    for (let i = 0, x = stars.length; i < x; i++) {
        const s = stars[i];

        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.stroke();
    }

    ctx.beginPath();
    for (let i = 0, x = stars.length; i < x; i++) {
        const starI = stars[i];
        ctx.moveTo(starI.x, starI.y);
        if (distance(starI, starI) < 5000) {
            for (let j = 0, x = stars.length; j < x; j++) {
                const starII = stars[j];
                if (distance(starI, starII) < 5000) {
                    ctx.lineTo(starII.x, starII.y);
                }
            }
        }
    }
    ctx.lineWidth = 0.05;
    ctx.strokeStyle = 'white';
    ctx.stroke();
}

function distance(point1, point2) {
    let xs = 0;
    let ys = 0;

    xs = point2.x - point1.x;
    xs = xs * xs;

    ys = point2.y - point1.y;
    ys = ys * ys;

    return xs + ys;
}

function update() {
    for (let i = 0, x = stars.length; i < x; i++) {
        const s = stars[i];

        s.x += s.vx / 60;
        s.y += s.vy / 60;

        if (s.x < 0 || s.x > canvas.width) s.vx = -s.vx;
        if (s.y < 0 || s.y > canvas.height) s.vy = -s.vy;
    }
}

function tick() {
    draw();
    update();
    requestAnimationFrame(tick);
}

tick();