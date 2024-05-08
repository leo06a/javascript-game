const canvas = document.getElementById('gameCanvas');
let c = canvas.getContext('2d')
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight -5;
let text = document.getElementById('text')
let isPaused = false
let arrBottom = []
let arrTop = []

let obstacleWidth = 60
let obstacleHeight = 500
let obstacleX = canvas.width-100
let obstacleY = 500

const obsspeed = 10

const difficulties = {
    easy: {
        obsspeed: 5,
    },
    medium: {
        obsspeed: 10,
    },
    hard: {
        obsspeed: 15,
    }
};


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

let settings = document.getElementById('settings')

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (settings.style.display === 'none') {
            settings.style.display = 'flex'
        } else {
            settings.style.display = 'none'
        }
    }
})


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

        const difficultySelect = document.getElementById('difficulty');
        difficultySelect.addEventListener('change', function() {
        obsspeed = difficulties[this.value].obsspeed; // Update obstacle speed
        });

        moveObstacle()
        for (let i = 0; i < arrBottom.length; i++) {
            const obstacleB = arrBottom[i];
            this.ctx.fillRect(obstacleB.x, obstacleB.y, obstacleB.width, obstacleB.height)
        }

        for (let i = 0; i < arrTop.length; i++) {
            const obstacleT = arrTop[i];
            this.ctx.fillRect(obstacleT.x, 0, obstacleT.width, obstacleT.height)
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
    if (!isPaused) {
        let randomHeight = Math.random() * (canvas.height - 200) + 50;
        let obsGap = 140
        
        let obsBottom = {
            x: obstacleX,
            y: canvas.height - randomHeight,
            width: obstacleWidth,
            height: randomHeight
        };
        arrBottom.push(obsBottom)
        
        console.log(arrTop)
        
        let obsTopHeight = canvas.height - obsBottom.height - obsGap;
        let obsTop = {
            x: obstacleX,
            y: 0,
            width: obstacleWidth,
            height: obsTopHeight
        };
        
        arrTop.push(obsTop)    
    } else {
        obsspeed = 0
    }
},1000);