const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1000
canvas.height = 1000
let lastTimestamp = 0,
    maxFPS = 15,
    timestep = 1000 / maxFPS;

var player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    speed: 5, 
    direction: {
        up: false,
        down: false,
    },
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        player.direction.up = true;
    } else if (e.key === 'ArrowDown') {
        player.direction.down = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') {
        player.direction.up = false;
    } else if (e.key === 'ArrowDown') {
        player.direction.down = false;
    }
});

function animate(timestamp) {
    if (timestamp - lastTimestamp < timestep) {
        requestAnimationFrame(animate);
        return;
    }
    lastTimestamp = timestamp;

    if (player.direction.up) {
        player.y -= player.speed;
    } else if (player.direction.down) {
        player.y += player.speed;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    requestAnimationFrame(animate);
}

animate();
