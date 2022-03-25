let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

let nbBalles = 3;

let ducksShot = [false, false, false, false, false, false, false, false, false, false];
let currentDuck = 0;

let duck = {
    x: 112,
    y: 40,
    dx: 160,
    dy: 110,
    tileX: 0,
    nbTile: 3,
    timer: 0,
    width: 32,
    height: 32,
    row: 0,
    isHit: false,
    isAlive: true,
    isFleeing: false,
};

let randomDirection = () => {
    let angle = Math.random() * (2 * Math.PI);
    duck.dx = 220 * Math.cos(angle);
    duck.dy = 220 * Math.sin(angle);
};

randomDirection();

let update = (dt) => {
    duck.x += duck.dx * dt / 1000;
    duck.y += duck.dy * dt / 1000;

    duck.timer += dt;

    if (duck.isHit) {
        if (duck.timer >= 600) {
            duck.isAlive = false;
            duck.tileX = 7;
            duck.dx = 0;
            duck.dy = 200;
        } else {
            duck.tileX = 6;
            duck.dx = 0;
            duck.dy = 0;
        }
    } else if (duck.isAlive && duck.timer >= 160) {
        duck.timer -= 160;

        duck.tileX = (duck.tileX + 1) % duck.nbTile;
    }

    if (duck.isAlive && !duck.isHit && !duck.isFleeing) {
        if (duck.x < 0) {
            duck.dx = -duck.dx;
            duck.x = 0;
        }
        else if (duck.x + duck.width > 256) {
            duck.dx = -duck.dx;
            duck.x = 256 - duck.width;
        }

        if (duck.y < 0) {
            duck.dy = -duck.dy;
            duck.y = 0;
        }
        else if (duck.y + duck.height > 160) {
            duck.dy = - duck.dy;
            duck.y = 160 - duck.height;
        }

        if (duck.dx < 0) {
            duck.row = 1;
        }
        else {
            duck.row = 0;
        }
    }

    if (!duck.isAlive) {
        if (duck.y > 190) {
            resetDuck();
        }
    }

    if (duck.isFleeing) {
        if (duck.y + duck.height < -100) {
            resetDuck();
            ducksShot[currentDuck] = false;
            ++currentDuck;
        }
    }
};

let resetDuck = () => {
    duck.x = 112;
    duck.y = 40;
    duck.dx = 160;
    duck.dy = 110;
    duck.tileX = 0;
    duck.nbTile = 3;
    duck.timer = 0;
    duck.width = 32;
    duck.height = 32;
    duck.row = 0;
    duck.isHit = false;
    duck.isAlive = true;
    duck.isFleeing = false,
    randomDirection();
    nbBalles = 3;
}

let draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgBg, 0, 0, 256, 240, 0, 0, 256, 240);

    if ((duck.isAlive && !duck.isHit) && duck.dy > 0) {
        ctx.drawImage(imgDuck, (duck.tileX + 3) * duck.width, duck.row * duck.height, duck.width, duck.height, duck.x, duck.y, duck.width, duck.height);
    }
    else {
        ctx.drawImage(imgDuck, duck.tileX * duck.width, duck.row * duck.height, duck.width, duck.height, duck.x, duck.y, duck.width, duck.height);
    }

    for (let i = 0; i < nbBalles; ++i) {
        ctx.drawImage(imgGui, 2, 2, 4, 7, 26 + 8 * i, 208, 4, 7);
    }
    for (let i = 0; i < ducksShot.length; ++i) {
        ctx.drawImage(imgGui, ducksShot[i]?21:10, 2, 7, 7, 96 + 8 * i, 209, 7, 7);
    }
}

let tirer = () => {
    --nbBalles;
}

let mouseClick = (e) => {
    if (e.button == 0) {
        if (nbBalles > 0 && duck.isAlive && !duck.isHit) {
            tirer();
            if (e.clientX >= duck.x && e.clientX <= duck.x + duck.width && e.clientY >= duck.y && e.clientY <= duck.y + duck.height) {
                console.log('touché');
                duck.isHit = true;
                ducksShot[currentDuck] = true;
                ++currentDuck;
            }
            else if (nbBalles == 0) {
                duck.isFleeing = true;
                duck.dx = 0;
                duck.dy = -220;
            }
        }
    }
    // console.log(`${e.clientX} ${e.clientY}`);
};
canvas.addEventListener('mousedown', mouseClick, false);

let timer = 0;
let run = () => {
    let deltaTime = performance.now() - timer;
    timer += deltaTime;
    update(deltaTime);
    draw();
    requestAnimationFrame(run);
};


let imgLoaded = 0;

let gameReady = () => {
    ++imgLoaded;
    if (imgLoaded === 4) {
        timer = performance.now();
        run();
    }
};

let imgBg = new Image();
imgBg.addEventListener('load', gameReady());
imgBg.src = 'img/bg.png';

let imgDog = new Image();
imgDog.addEventListener('load', gameReady());
imgDog.src = 'img/dog.png';

let imgDuck = new Image();
imgDuck.addEventListener('load', gameReady());
imgDuck.src = 'img/duck.png';

let imgGui = new Image();
imgGui.addEventListener('load', gameReady());
imgGui.src = 'img/gui.png';
















