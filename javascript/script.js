class Player {
    constructor(x, y, radius, gravity, image) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedY = 0;
        this.gravity = gravity;
        this.image = image;
        this.frames = 8;
        this.currentFrame = 0;
        this.frameWidth = 16;
        this.frameHeight = 16;
        this.flap = false;
    }

    jump() {
        this.speedY = -10;
        this.flap = true;
    }

    updatePosition(canvasHeight) {
        this.speedY += this.gravity;
        this.y += this.speedY;

        // Prevent from going above ceiling
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.speedY = 0;
        }

        // Prevent from going beneath floor
        if (this.y + this.radius + 60 > canvasHeight) {
            this.y = canvasHeight - this.radius - 60;
            this.speedY = 0;
            game.endGame()
        }
    }

    draw(ctx) {
        if (this.flap) {
            ctx.drawImage(this.image, this.currentFrame, 0, this.frameWidth, this.frameHeight, this.x - this.radius - 10, this.y - this.radius - 10, this.radius * 3, this.radius * 3);
            this.currentFrame = this.currentFrame + this.frameWidth;
            if (this.currentFrame >= this.frames * this.frameWidth) {
                this.currentFrame = 0;
                this.flap = false;
            }
        } else {
            ctx.drawImage(this.image, this.currentFrame, 0, this.frameWidth, this.frameHeight, this.x - this.radius - 10, this.y - this.radius - 10, this.radius * 3, this.radius * 3);
        }
    }
}

class Game {
    constructor(canvas, playerImage) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = window.innerWidth - 50;
        this.canvas.height = window.innerHeight - 5;
        this.isPaused = false;
        this.obstaclesBottom = [];
        this.obstaclesTop = [];
        this.obstacleWidth = 60;
        this.obstacleX = this.canvas.width - 100;
        this.obsspeed = 10;
        this.score = 0;
        this.obsGap = 200;
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2, 20, 0.5, playerImage);
        
        this.setEventListeners();
        this.spawnObstacle();
        this.animate();
    }

    setEventListeners() {
        document.addEventListener('keypress', (e) => {
            if (e.key === ' ') {
                this.handleJump();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.togglePause();
            }
        });

        document.getElementById('startOver').addEventListener('click', () => {
            this.reset();
        });

        document.getElementById('difficulty').addEventListener('change', (event) => {
            this.changeDifficulty(event.target.value);
            // Difficulty changes gap between obstacles
        });
    }

    handleJump() {
        if (!this.isPaused) {
            this.player.jump();
        }
    }

    togglePause() {
        let settings = document.getElementById('settings');
        if (settings.style.display === 'none') {
            settings.style.display = 'flex';
            this.isPaused = true;
            document.body.style.backgroundImage = "url('../images/background.PNG')";
        } else {
            settings.style.display = 'none';
            this.isPaused = false;
            document.body.style.backgroundImage = "url('../images/background.gif')";
            this.animate();
        }
    }

    changeDifficulty(difficulty) {
        const difficulties = {
            easy: 250,
            medium: 200,
            hard: 150,
        };
        this.obsGap = difficulties[difficulty];
    }

    moveObstacles() {
        for (let i = 0; i < this.obstaclesBottom.length; i++) {
            let obs = this.obstaclesBottom[i];
            obs.x -= this.obsspeed;
            if (obs.x + obs.width < this.player.x && !obs.passed) {
                obs.passed = true;
                this.score++;
                document.getElementById("score").innerHTML = this.score;
            }
        }
        for (let i = 0; i < this.obstaclesTop.length; i++) {
            let obs = this.obstaclesTop[i];
            obs.x -= this.obsspeed;
        }
    }

    createObstacle() {
        let randomHeight = Math.random() * (this.canvas.height - 300) + 50;
        let obsBottom = {
            x: this.obstacleX,
            y: this.canvas.height - randomHeight,
            width: this.obstacleWidth,
            height: randomHeight,
            passed: false
        };

        this.obstaclesBottom.push(obsBottom);

        let obsTopHeight = this.canvas.height - obsBottom.height - this.obsGap;
        let obsTop = {
            x: this.obstacleX,
            y: 0,
            width: this.obstacleWidth,
            height: obsTopHeight,
            passed: false
        };
        this.obstaclesTop.push(obsTop);
    }

    checkCollision(player, obstacle) {
        return (
            player.x + player.radius > obstacle.x &&
            player.x - player.radius < obstacle.x + obstacle.width &&
            player.y + player.radius > obstacle.y &&
            player.y - player.radius < obstacle.y + obstacle.height
        );
    }

    animate() {
        if (this.isPaused) return; // If isPaused is true, stop the animate loop by returning from animate function

        this.player.updatePosition(this.canvas.height);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw(this.ctx);

        this.moveObstacles();
        for (let i = 0; i < this.obstaclesBottom.length; i++) {
            const obstacleB = this.obstaclesBottom[i];
            this.ctx.fillRect(obstacleB.x, obstacleB.y, obstacleB.width, obstacleB.height);
            if (this.checkCollision(this.player, obstacleB)) {
                this.endGame();
            }
        }

        for (let i = 0; i < this.obstaclesTop.length; i++) {
            const obstacleT = this.obstaclesTop[i];
            this.ctx.fillRect(obstacleT.x, 0, obstacleT.width, obstacleT.height);
            if (this.checkCollision(this.player, obstacleT)) {
                this.endGame();
            }
        }
        // for loops draws every obstacle in top and bottom arrays, then checks if player has collided with them

        requestAnimationFrame(this.animate.bind(this)); // this looses its context, bind ensures this refers to 'Game'
    }

    endGame() {
        this.isPaused = true;
        document.getElementById('settings').style.display = 'flex';
        document.body.style.backgroundImage = "url('../images/background.PNG')";
    }

    reset() {
        this.player.y = this.canvas.height / 2;
        this.player.x = this.canvas.width / 2;
        this.player.speedY = 0;
        this.obstaclesBottom = [];
        this.obstaclesTop = [];
        this.score = 0;
        document.getElementById("score").innerHTML = this.score;
        this.isPaused = false;
        document.getElementById('settings').style.display = 'none';
        document.body.style.backgroundImage = 'url("../images/background.gif")'
        this.animate(); 
    }
    // Resets the game:
    // - Sets player initial position to the center of the canvas
    // - Resets player vertical speed
    // - Clears obstacle arrays
    // - Resets the score to zero and updates its display
    // - Sets the game to not paused
    // - Hides the settings menu
    // - Changes the background image to the game's background

    spawnObstacle() {
        setInterval(() => {
            if (!this.isPaused) {
                this.createObstacle();
            }
        }, 1000);
    }
}

const canvas = document.getElementById('gameCanvas');
const playerImage = new Image();
playerImage.src = '../images/bird.png';
const game = new Game(canvas, playerImage);
