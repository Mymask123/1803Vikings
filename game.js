const canvas = document.getElementById('robotGame');
const ctx = canvas.getContext('2d');
const info = document.getElementById('game-info');
const restartBtn = document.getElementById('restartBtn');

const fieldPadding = 14;
const robotSize = 24;
const pieceSize = 10;
const gameTime = 30; // seconds

let robot, pieces, keys, score, remaining, lastTime, running;

function initGame() {
    robot = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        speed: 3
    };
    pieces = [];
    keys = {};
    score = 0;
    remaining = gameTime;
    lastTime = performance.now();
    running = true;
    spawnPieces(5);
    info.textContent = `Move: ↑ ↓ ← → or W A S D · Score 10+ before the timer hits 0.`;
    loop(lastTime);
}

function spawnPieces(count) {
    for (let i = 0; i < count; i++) {
        pieces.push({
            x: fieldPadding + Math.random() * (canvas.width - fieldPadding * 2),
            y: fieldPadding + Math.random() * (canvas.height - fieldPadding * 2)
        });
    }
}

function handleInput() {
    if (keys['ArrowUp'] || keys['KeyW']) robot.y -= robot.speed;
    if (keys['ArrowDown'] || keys['KeyS']) robot.y += robot.speed;
    if (keys['ArrowLeft'] || keys['KeyA']) robot.x -= robot.speed;
    if (keys['ArrowRight'] || keys['KeyD']) robot.x += robot.speed;

    // bounds
    robot.x = Math.max(fieldPadding, Math.min(canvas.width - fieldPadding, robot.x));
    robot.y = Math.max(fieldPadding, Math.min(canvas.height - fieldPadding, robot.y));
}

function update(dt) {
    if (!running) return;

    remaining -= dt / 1000;
    if (remaining <= 0) {
        remaining = 0;
        running = false;
        const win = score >= 10;
        info.textContent = win
            ? `Nice driving! Score: ${score}. Press Restart to play again.`
            : `Time's up! Score: ${score}. Get 10+ to win. Press Restart to try again.`;
        return;
    }

    handleInput();

    // collision with pieces
    pieces = pieces.filter(p => {
        const dx = p.x - robot.x;
        const dy = p.y - robot.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < (robotSize / 2 + pieceSize / 2)) {
            score++;
            // spawn a new one
            pieces.push({
                x: fieldPadding + Math.random() * (canvas.width - fieldPadding * 2),
                y: fieldPadding + Math.random() * (canvas.height - fieldPadding * 2)
            });
            return false;
        }
        return true;
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // field border
    ctx.strokeStyle = 'rgba(244,197,66,0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(fieldPadding, fieldPadding, canvas.width - fieldPadding*2, canvas.height - fieldPadding*2);

    // robot (rectangle with "forks")
    ctx.fillStyle = '#f4f4f4';
    ctx.fillRect(robot.x - robotSize/2, robot.y - robotSize/2, robotSize, robotSize);
    ctx.fillStyle = '#1c6ad6';
    ctx.fillRect(robot.x - robotSize/2, robot.y - robotSize/2, robotSize, 6);

    // game pieces
    ctx.fillStyle = '#e50914';
    pieces.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, pieceSize / 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // HUD
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Roboto';
    ctx.fillText(`Score: ${score}`, 18, 20);
    ctx.fillText(`Time: ${Math.ceil(remaining)}`, canvas.width - 80, 20);
}

function loop(timestamp) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;
    if (running) update(dt);
    draw();
    requestAnimationFrame(loop);
}

// Controls
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

restartBtn.addEventListener('click', () => {
    initGame();
});

// Start once DOM loaded
if (canvas) {
    initGame();
}
