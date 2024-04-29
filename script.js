const canvas = document.getElementById('gameCanvas');
let c = canvas.getContext('2d')
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight -5;
let text = document.getElementById('text')

let arr = []

let obstacleWidth = 60
let obstacleHeight = 500
let obstacleX = canvas.width-100
let obstacleY = 500
const obsspeed = 2

function moveObstacle() {
    for (let i = 0; i < arr.length; i++) {
        let obs = arr[i];
        obs.x -= obsspeed 
        
    }
}

let settings = document.getElementById('setw tings')

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        isPaused = true
        settings.style.display = 'flex'
    }
})

let isPaused = false
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
        if (this.y + this.radius+90 > canvas.height) {
            this.y = canvas.height - this.radius-90;
            this.speedY = 0;
            isPaused = true
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
        if (isPaused == false) {
            this.player.jump()
        } else {
            document.addEventListener('keypress', (e) => {
                if (e.key === 'w') {
                    this.player.y = canvas.height/2
                    this.player.x = canvas.width/2
                    this.player.speedY = 0
                    isPaused = false
                }
            })
        }
    }

    animate() {
        this.player.updatePosition();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw(this.ctx);

        moveObstacle()
        for (let i = 0; i < arr.length; i++) {
            const obstacle = arr[i];
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
            
        }

        requestAnimationFrame(this.animate.bind(this))
    }
}

const game = new Game(canvas);

document.addEventListener('keypress', (e) => {
    if (e.key === 'w' && !isPaused) {
        game.player.y = canvas.height/2
        game.player.x = canvas.width/2
        game.player.speedY = 0
        game.animate();
        
    }
})

document.addEventListener('keypress', (e) => {
    if (e.key === ' ') {
        game.handleclick()
    }
});

setInterval(() => {
    let randomHeight = Math.random() * (canvas.height - 200) + 50;
    let obs = {
        x: obstacleX,
        y: canvas.height - randomHeight,
        width: obstacleWidth,
        height: randomHeight
    };
    arr.push(obs)

    console.log(arr)

},1000);