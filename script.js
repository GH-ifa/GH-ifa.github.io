let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');



let duck = {
    x: 0,
    y: 0,
    dx: 220,
    dy: 160,
    tileX: 0,
    nbTile: 3,
    timer: 0,
    width: 32,
    height: 32,
    row: 0,
}

let update = (dt) => {
    duck.x += duck.dx * dt / 1000;
    duck.y += duck.dy * dt / 1000;

    duck.timer += dt;
    if (duck.timer >= 160) {
        duck.timer -= 160;
        duck.tileX = (duck.tileX + 1) % duck.nbTile;
    }

    if (duck.x < 0) {
        duck.dx = -duck.dx;
    }
    else if (duck.x + duck.width > 256) {
        duck.dx = -duck.dx;
    }

    if (duck.y < 0) {
        duck.dy = -duck.dy;
    }
    else if (duck.y + duck.height > 160) {
        duck.dy = - duck.dy;
    }

    if (duck.dx < 0) {
        duck.row = 1;
    }
    else {
        duck.row = 0;
    }

};

let draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgBg, 0, 0, 256, 256, 0, 0, 256, 256);


    ctx.drawImage(imgDuck, duck.tileX * duck.width, duck.row * duck.height, duck.width, duck.height, duck.x, duck.y, duck.width, duck.height);


};

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
    if (imgLoaded === 3) {
        timer = performance.now();
        run();
    }
}

let imgBg = new Image();
imgBg.addEventListener('load', gameReady());
imgBg.src = 'img/bg.png';

let imgDog = new Image();
imgDog.addEventListener('load', gameReady());
imgDog.src = 'img/dog.png';

let imgDuck = new Image();
imgDuck.addEventListener('load', gameReady());
imgDuck.src = 'img/duck.png';
















