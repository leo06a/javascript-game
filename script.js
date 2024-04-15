const canvas = document.getElementById('gameCanvas');
let c = canvas.getContext('2d')
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight -5;

arr = []
obstacleWidth = 60
obstacleHeight = 500
obstacleX = canvas.width
obstacleY = 0

function e() {
    let random = obstacleY - obstacleHeight/4 - Math.random()*(obstacleHeight/2)
    let top = {
        x: obstacleX,
        y: random,
        width: obstacleWidth,
        height: obstacleHeight,
    }
    arr.push(top)
}

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


class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.player = new Player(canvas.width / 2, canvas.height / 2, 20, 0.5);
    }

    handleclick() {
        this.player.jump()
    }

    animate() {
        this.player.updatePosition();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw(this.ctx);
        
        for (let i = 0; i < arr.length; i++) {
            let obstacle = arr[i]
            this.ctx.fillStyle = 'black'
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
        }
        
        requestAnimationFrame((timestamp) => this.animate(timestamp));
    }

    start() {
        document.addEventListener('keypress', () => this.handleclick());
        requestAnimationFrame((timestamp) => this.animate(timestamp));
    }
}

const game = new Game(canvas);
game.start();
