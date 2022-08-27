

let canvas;
let ctx;
let score = 0;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);


let backgroundimage, spaceshipimage, bulletimage, enemyimage, gameoverimage;
let gameOver = false;


let spaceshipX = 170;
let spaceshipY = 635;

let bulletList = []; // save bullets here

function Bullet() {
    this.x = 0;
    this.y = 0;
    this.init = function () {
        this.x = spaceshipX + 20;
        this.y = spaceshipY;
        this.alive = true
        bulletList.push(this);
    };
    this.update = function () {
        this.y -= 5

    };

    this.checkHit = function () {
        for (let i = 0; i < enemyList.length; i++) {
            if (
                this.y <= enemyList[i].y &&
                this.x >= enemyList[i].x &&
                this.x <= enemyList[i].x + 64
            ) {
                score++;
                this.alive = false;
                enemyList.splice(i, 1);
            }
            if (
                this.y <= 0
            ) {
                this.alive = false;
            }
        }
    }
};

let enemyList = [];

function generateRandomValue(min, max) {
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min //math fl random
    return randomNum

};

function Enemy() {
    this.x = 0;
    this.y = 0;
    this.init = function () {
        this.x = generateRandomValue(0, canvas.width - 64);
        this.y = 0;

        enemyList.push(this)
    };
    this.update = function () {
        this.y += 3;

        if (this.y >= canvas.height - 64) {
            gameOver = true;
        }
    }
};


function loadimage() {
    backgroundimage = new Image();
    backgroundimage.src = "img/space.jpg";

    spaceshipimage = new Image();
    spaceshipimage.src = "img/spaceship.png";

    bulletimage = new Image();
    bulletimage.src = "img/bullet.png";

    enemyimage = new Image();
    enemyimage.src = "img/enemy.png";

    gameoverimage = new Image();
    gameoverimage.src = "img/game-over.png";

}
let keysDown = {}
function setupKeyboardListener() {
    document.addEventListener("keydown", function (event) {
        keysDown[event.keyCode] = true;
    });
    document.addEventListener("keyup", function (event) {
        delete keysDown[event.keyCode]

        if (event.keyCode == 32) {
            createBullet()
        }
    });
}

function createEnemy() {
    const interval = setInterval(function () {
        let e = new Enemy()
        e.init()
    }, 1000) // every 1 sec

};

function createBullet() {
    let b = new Bullet()
    b.init()

};




function update() {
    if (39 in keysDown) {
        spaceshipX += 5
    } //right
    if (37 in keysDown) {
        spaceshipX -= 5
    } //left
    if (spaceshipX <= 0) {
        spaceshipX = 0
    }
    if (spaceshipX >= canvas.width - 64) {
        spaceshipX = canvas.width - 64
    }

    for (let i = 0; i < bulletList.length; i++) {
        if (bulletList[i].alive) {
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }
    for (let i = 0; i < enemyList.length; i++) {
        enemyList[i].update();
    }

};


function render() {
    ctx.drawImage(backgroundimage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipimage, spaceshipX, spaceshipY);
    ctx.fillText(`score:${score}`, 20, 20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";


    for (let i = 0; i < bulletList.length; i++) {
        if (bulletList[i].alive) {
            ctx.drawImage(bulletimage, bulletList[i].x, bulletList[i].y);
        }
    }

    for (let i = 0; i < enemyList.length; i++) {
        ctx.drawImage(enemyimage, enemyList[i].x, enemyList[i].y);
    }

};

function main() {
    if (!gameOver) {
        update();
        render();
        requestAnimationFrame(main);
    } else {
        ctx.drawImage(gameoverimage, 0, 100, canvas.width, 450);
    }
};

loadimage();
setupKeyboardListener();
createEnemy();
main();
