// Global variables
var gameRunning = false;
var characterRow = 2;
var speed = 100;
var startTime;
// Game variables
var rowScaling = {
    row1: .84,
    row2: 1,
    row3: 1.22
}
var rowY = {
    row1: 520,
    row2: 630,
    row3: 780
}
var obstacleTypes = ["bush", "tree", "branch"];
var obstacleProperties = [[180, 112], [112, 150], [180, 75]];
var objects = {
    stickman: {
        width: 112,
        height: 150
    },
    obstacles: []
}
var images = {};

// Element variables
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var playButton = document.getElementById("playButton");

// Event listeners
playButton.addEventListener("click", function() {
    playButton.style.display = "none";
    start();
});
document.addEventListener("keyup", function(e) {
    var key = e.keyCode || e.which;
    switch (key) {
        case 38: //up arrow
            if (characterRow > 1) characterRow--;
            break;
        case 40: //down arrow
            if (characterRow < 3) characterRow++;
            break;
    }
});

// Optimizing canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.onresize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    refresh();
};

// Canvas helper functions
function drawImage(image, x, y, w, h) {
    context.drawImage(images[imageNames.indexOf(image)], x, y, w, h);
}
function drawRect(color, x, y, w, h) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// Add an obstacle to the game
function createObstacle() {
    var num = Math.floor(Math.random() * obstacleTypes.length);
    var image = obstacleTypes[num];
    var w = obstacleProperties[num][0];
    var h = obstacleProperties[num][1];

    var x = window.innerWidth - w - 10;
    var y = rowY["row" + (Math.floor(Math.random() * 3) + 1)];

    objects.obstacles.push({image, x, y, w, h});
}

// Refresh loop
function refresh() {
    // Draw scenery
    drawRect("cyan", 0, 0, 1910, 895); //sky
    drawRect("rgb(3, 192, 52)", 0, 550, 1910, 540); //land
    drawImage("sun", 550, -225, 400, 400);

    // Draw character
    drawImage("stickman", 350, rowY["row" + characterRow], objects.stickman.width * rowScaling["row" + characterRow], objects.stickman.height * rowScaling["row" + characterRow]);

    // Draw obstacles
    for (i = 0; i < objects.obstacles.length; i++) {
        objects.obstacles[i].x -= (10 * (speed/100));
        var obstacle = objects.obstacles[i];

        if (obstacle.x <= -obstacle.w) objects.obstacles.splice(i, 1);
        else if (obstacle.x <= 350 + objects.stickman.width && obstacle.x >= 350 && rowY["row" + characterRow] == obstacle.y) lose();
        else drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.w, obstacle.h);
    }

    // Loop this function
    if (gameRunning == true) {
        context.font = "35px Arial";
        context.fillStyle = "#fff";
        context.fillText(Math.round((new Date() - startTime) / 10), 10, 45);
        speed += .1;
        setTimeout(function() {
            requestAnimationFrame(refresh)
        }, 50);
    }
}

// Start function
function start() {
    startTime = new Date();
    gameRunning = true;
    refresh();
    createObstacle();
}

// Game over function
function lose() {
    gameRunning = false;
    alert("You lost");
    location.reload();
}

// Initial execution
var imageNames = ["bush", "tree", "branch", "stickman", "sun"];
for (i = 0; i < imageNames.length; i++) {
    images[i] = new Image();
    images[i].src = "images/" + imageNames[i] + ".svg";
}
refresh();
setInterval(function() {
    if (objects.obstacles.length < 3 && gameRunning == true) createObstacle();
}, 3000);

