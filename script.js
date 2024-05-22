const canvas = document.getElementById('gameCanvas');
const playerImage = new Image();
playerImage.src = '../images/bird.png';
let c = canvas.getContext('2d')
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight -5;
let isPaused = false
let arrBottom = []
let arrTop = []

let obstacleWidth = 60
let obstacleHeight = 500
let obstacleX = canvas.width-100
let obstacleY = 500

let obsspeed = 10

function moveObstacle() {
    for (let i = 0; i < arrBottom.length; i++) {
        let obs = arrBottom[i];
        obs.x -= obsspeed 
        
    }
    for (let i = 0; i < arrTop.length; i++) {
        let obs = arrTop[i];
        obs.x -= obsspeed
    }
}

class Player {
    constructor(x, y, radius, gravity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.speedY = 0
        this.gravity = gravity
        this.image = playerImage
        this.frames = 8
        this.currentFrame = 0
        this.frameWidth = 16
        this.frameHeight = 16
        this.flap = false
    }

    jump() {
        this.speedY = -10;
        this.flap = true
    }

    updatePosition() {
        this.speedY += this.gravity    
        // Update player's vertical position
        this.y += this.speedY

        // Prevent player from flying away upwards
        if (this.y - this.radius < 0) {
            this.y = this.radius
            this.speedY = 0
        }
    }
    draw(ctx) {
        if (this.flap) {
            ctx.drawImage(this.image, this.currentFrame, 0, this.frameWidth, this.frameHeight, this.x-this.radius-10, this.y-this.radius-10, this.radius * 3, this.radius * 3);
            this.currentFrame = this.currentFrame + 16;
            if (this.currentFrame >= this.frames * this.frameWidth) {
                this.currentFrame = 0
                this.flap = false
            }
        } else {
            ctx.drawImage(this.image, this.currentFrame, 0, this.frameWidth, this.frameHeight, this.x-this.radius-10, this.y-this.radius-10, this.radius * 3, this.radius * 3);
        }
    }
}

class Game {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.player = new Player(canvas.width / 2, canvas.height / 2, 20, 0.5)
    }

    handleclick() {
        if (!isPaused) {
            this.player.jump()
        } 
    }

    checkCollision(player, obstacle) {
        if (
            player.x + player.radius > obstacle.x && 
            player.x - player.radius < obstacle.x + obstacle.width && 
            player.y + player.radius > obstacle.y && 
            player.y - player.radius < obstacle.y + obstacle.height
        ) {
            return true
        }
        return false
    }

    animate() {
        if (isPaused) return

        this.player.updatePosition();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw(this.ctx);

        moveObstacle()
        for (let i = 0; i < arrBottom.length; i++) {
            const obstacleB = arrBottom[i];
            this.ctx.fillRect(obstacleB.x, obstacleB.y, obstacleB.width, obstacleB.height)
            if (this.checkCollision(this.player, obstacleB)) {
                // isPaused = true
                document.body.style.backgroundImage = "url('./images/background.PNG')"
            }
        }

        for (let i = 0; i < arrTop.length; i++) {
            const obstacleT = arrTop[i];
            this.ctx.fillRect(obstacleT.x, 0, obstacleT.width, obstacleT.height)
            if (this.checkCollision(this.player, obstacleT)) {
                // isPaused = true
                document.body.style.backgroundImage = "url('./images/background.PNG')"
            }
        }

        // Prevent player from falling through the ground
        if (this.player.y + this.player.radius+60 > canvas.height) {
            this.player.y = canvas.height - this.player.radius-60;
            this.player.speedY = 0;
            isPaused = true
            document.getElementById('settings').style.display = 'flex'
            document.body.style.backgroundImage = "url('./images/background.PNG')"
        }

        if (!isPaused) {
            requestAnimationFrame(this.animate.bind(this))
        }
    }
}

document.addEventListener('keypress', (e) => {
    if (e.key === ' ') {
        game.handleclick()
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        let settings = document.getElementById('settings')
        if (settings.style.display === 'none') {
            settings.style.display = 'flex'
            isPaused = true
        } else {
            settings.style.display = 'none'
            isPaused = false
            game.animate()
        }
    }
})  

const difficulties = {
    easy: {
        obsGap: 250,
    },
    medium: {
        obsGap: 200,
    },
    hard: {
        obsGap: 150,
    }
}

let obsGap = 200

let selectElement = document.getElementById('difficulty')   
selectElement.addEventListener('change', (event) => {
    let selectedOption = event.target.value
    console.log('Selected option:', selectedOption)
    if (selectedOption === 'easy') {
        obsGap = difficulties.easy.obsGap
        console.log(obsGap)
    } else if (selectedOption === 'medium') {
        obsGap = difficulties.medium.obsGap
        console.log(obsGap)
    } else if (selectedOption === 'hard') {
        obsGap = difficulties.hard.obsGap
        console.log(obsGap)
    } 
})

this.spawnObstacle = setInterval(() => {
    if (!isPaused) {
        let randomHeight = Math.random() * (canvas.height - 300) + 50

        let obsBottom = {
            x: obstacleX,
            y: canvas.height - randomHeight,
            width: obstacleWidth,
            height: randomHeight
        };

        arrBottom.push(obsBottom);

        let obsTopHeight = canvas.height - obsBottom.height - obsGap;

        let obsTop = {
            x: obstacleX,
            y: 0,
            width: obstacleWidth,
            height: obsTopHeight
        };

        arrTop.push(obsTop);
    } 
}, 1000);

let score = 0

function increaseScore() {
    score++;
    document.getElementById("score").innerHTML = score;
}

setInterval(increaseScore, 2000);

const game = new Game(canvas)
game.player.y = canvas.height/2
game.player.x = canvas.width/2
game.player.speedY = 0
if (!isPaused) {
    game.animate()
}