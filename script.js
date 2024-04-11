const canvas = document.getElementById('gameCanvas');
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight -5;

class Player {
    constructor(x, y, radius, gravity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedY = 0;
        this.gravity = gravity;
    }

    jump() {
        this.speedY = -10;
    }

    updatePosition() {
        this.speedY += this.gravity;
        // Update player's vertical position
        this.y += this.speedY;

        // Prevent player from falling through the ground
        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.speedY = 0;      
        }

        // Prevent player from flying away upwards
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.speedY = 0;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

class Obstacle {
    constructor(x, gapHeight, speed, width, canvasHeight) {
        this.x = x;
        this.gapHeight = gapHeight;
        this.speed = speed;
        this.width = width;
        this.canvasHeight = canvasHeight;
    }

    move() {
        this.x -= this.speed;
    }

    reset(canvasWidth) {
        if (this.x + this.width < 0) {
            this.x = canvasWidth;
            this.gapHeight = Math.random() * (this.canvasHeight - 200) + 100; // Ensure a minimum gap height of 100
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, 0, this.width, this.canvasHeight - this.gapHeight);
        ctx.fillRect(this.x, this.canvasHeight - this.gapHeight, this.width, this.gapHeight);
    }
}

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.player = new Player(canvas.width / 2, canvas.height / 2, 20, 0.5);
        this.obstacle = new Obstacle(canvas.width, 200, 2, 50, canvas.height);
    }

    handleKeyDown(e) {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            this.player.jump();
        }
    }

    animate(timestamp) {
        this.player.updatePosition();
        this.obstacle.move();
        this.obstacle.reset(this.canvas.width);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw(this.ctx);
        this.obstacle.draw(this.ctx);

        requestAnimationFrame((timestamp) => this.animate(timestamp));
    }

    start() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        requestAnimationFrame((timestamp) => this.animate(timestamp));
    }
}


const game = new Game(canvas);
game.start();
