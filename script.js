const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const spriteSheet = document.createElement('img');

spriteSheet.src = 'BirdSpriteBig.png';
let frameIndex = 1;
const spriteWidth = 1280;
const spriteHeight = 480;
const animationFrames = 8;
let scale = 0.5;


let lastTimestamp = 0,
    maxFPS = 15,
    timestep = 1000 / maxFPS
var player = {
    x: canvas.width/2,
    y: canvas.height/2,
    dx: 5,
    dy: 5,
    radius: 40,
    direction: {
        left: false,
        right: false,
        up: false,
        down: false,
    },
    attack: false,
    jump: false,
}
            
document.addEventListener('keydown', (e) => {
    if (e.key == 's') {
        player.direction.down = true;
    } else if (e.key == 'w') {
        player.direction.up = true;
    } else if (e.key == 'a') {
        player.direction.left = true;
    } else if (e.key == 'd') {
        player.direction.right = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key == 's') {
        player.direction.down = false;
    } else if (e.key == 'w') {
        player.direction.up = false;
    } else if (e.key == 'a') {
        player.direction.left = false;
    } else if (e.key == 'd') {
        player.direction.right = false;
    }
});








function animate(timestamp) {
    if (timestamp - lastTimestamp < timestep) {
        requestAnimationFrame(animate);
        return;
    }
    lastTimestamp = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (player.direction.up) {
        player.y -= player.dy;
        ctx.drawImage(spriteSheet, frameIndex * spriteWidth, spriteHeight, spriteWidth, spriteHeight, player.x, player.y, spriteWidth * scale, spriteHeight * scale);
        frameIndex = (frameIndex + 1) % animationFrames;
    } else if (player.direction.down) {
        player.y += player.dy;
        ctx.drawImage(spriteSheet, frameIndex * spriteWidth, spriteHeight, spriteWidth, spriteHeight, player.x, player.y, spriteWidth * scale, spriteHeight * scale);
        frameIndex = (frameIndex + 1) % animationFrames;
    } else if (player.direction.left) {
        player.x -= player.dx;
        ctx.drawImage(spriteSheet, frameIndex * spriteWidth, spriteHeight, spriteWidth, spriteHeight, player.x, player.y, spriteWidth * scale, spriteHeight * scale);
        frameIndex = (frameIndex + 1) % animationFrames;
    } else if (player.direction.right) {
        player.x += player.dx;
        ctx.drawImage(spriteSheet, frameIndex * spriteWidth, spriteHeight, spriteWidth, spriteHeight, player.x, player.y, spriteWidth * scale, spriteHeight * scale);
    } else {
        ctx.drawImage(spriteSheet, frameIndex * spriteWidth, 0, spriteWidth, spriteHeight, player.x, player.y, spriteWidth * scale, spriteHeight * scale);
        frameIndex = (frameIndex + 1) % animationFrames;
    };

    if (player.y > canvas.height - spriteHeight*2) {
        player.y = canvas.height - spriteHeight*2;
    } else if (player.y < 0) {
        player.y = 0;
    } else if (player.x < 0) {
        player.x = 0;
    } else if (player.x > canvas.width - spriteWidth*2) {
        player.x = canvas.width - spriteWidth*2;
    };
    requestAnimationFrame(animate);
};

animate();