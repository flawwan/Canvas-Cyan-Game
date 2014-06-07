/*Canvas definition */


/*elements for older browsers*/
var tempMSG = document.getElementById("tempMSG");
var debug = document.getElementById("debug");
var debug2 = document.getElementById("debug2");

var game = {
    canvas: document.getElementById("canvas"),
    c: this.canvas.getContext("2d"),
    w: this.canvas.width / 20,
    h: this.canvas.height / 20,
    map: [],
    bonusTime: 10,
    running: true,
    playerX: 0,
    playerY: 0,
    counter: 60,
    score: 0,
    tempVal: 0,
    tempMsg: "",
    difficulity: 2,
    generateBlocks: function () {
        this.renderPlayer();

        for (var y = 0; y < this.h; y++) {
            var temp = [];
            for (var x = 0; x < this.w; x++) {
                if (x % this.difficulity && Math.random() > 0.5) {
                    if (Math.random() < 0.995) { // 0.5& CHANCE
                        temp.push("X");
                        this.renderBlock(x, y, "white");
                    } else {
                        temp.push("G");
                        this.renderBlock(x, y, "gold");
                    }

                } else {
                    temp.push("");
                }
            }
            this.map.push(temp);
        }
    },
    reRenderBlocks: function () {
        for (var y = 0; y < this.map.length; y++) {
            for (var x = 0; x < this.map[y].length; x++) {
                if (this.map[y][x] == "X") {
                    this.renderBlock(x, y, "white");
                } else if (this.map[y][x] == "G") {
                    this.renderBlock(x, y, "gold");
                }
            }
        }
    },
    renderBlock: function (x, y, color) {
        this.c.fillStyle = color;
        this.c.fillRect(x * 20, y * 20, 20, 20);
    },
    renderPlayer: function () {
        this.c.fillStyle = "firebrick";
        this.c.fillRect(this.playerX, this.playerY, 20, 20);
    },
    move: function (x, y) {
        if (this.collision(this.playerX + x, this.playerY + y) === false) {
            this.playerX += x;
            this.playerY += y;
            this.clear();
            this.generateGrid();
            this.reRenderBlocks();
            this.renderPlayer();
        }
    },
    newMap: function () {
        this.clear();
        this.map = [];
        this.generateBlocks();
        this.generateGrid();
    },
    clear: function () {
        this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    restart: function () {
        this.score = 0;
        debug2.innerHTML = "";
        tempMSG.innerHTML = "";

        this.counter = 60;
        this.newMap();
        this.running = true;
        this.resetPlayerPosition();
        this.clear();
        this.generateGrid();
        this.reRenderBlocks();
        this.renderPlayer();
    },
    resetPlayerPosition: function () {
        this.playerX = 0;
        this.playerY = 0;
    },
    collision: function (_x, _y) {
        if (_x < 0 || _y + 20 > this.canvas.height || _y < 0) {
            return true;
        }
        if (_x + 20 > this.canvas.width) {
            this.reset();
            this.counter += this.bonusTime + this.difficulity;
            this.score += game.difficulity;
            this.setMessage("+" + this.bonusTime, 2, "green");
            debug2.innerHTML = "| Score: " + this.score;
            return true;
        }
        if (this.map[_y / 20][_x / 20] == "X") {
            this.setMessage("-5", 2, "red");
            this.counter -= 5;
            this.removeBlock(_y, _x);
            return false;
        }
        if (this.map[_y / 20][_x / 20] == "G") {
            this.setMessage("+10", 3, "gold");
            this.counter += 10;
            this.score += 5 * game.difficulity;
            this.removeBlock(_y, _x);
            return false;
        }

        return false;
    },
    removeBlock: function (y, x) {
        this.map[y / 20][x / 20] = "";
        this.reRenderBlocks();
        this.generateGrid();

    },
    reset: function () {
        this.resetPlayerPosition();
        this.renderPlayer();
        this.counter -= 5;
        this.newMap();
    },
    countDown: function () {
        tempMSG.innerHTML = (this.tempVal >= 1 ? this.tempMsg : "");
        tempMSG.style.color = this.color;
        if (this.tempVal >= 1) {
            this.tempVal--;
        }
        if (this.counter < 1) {
            game.running = false;
            debug2.innerHTML = "";
            debug.innerHTML = ("You lost. Press [R] to restart the game! Your Score: " + this.score);
            tempMSG.innerHTML = "";
        } else {
            this.counter--;
            debug.innerHTML = "Time Left: " + (this.counter < 0 ? 0 : this.counter );
        }

    },
    generateGrid: function () {
        this.c.strokeStyle = "#777";
        for (var i = 0; i < this.canvas.width; i++) {
            this.c.moveTo(20 * i, 0);
            this.c.lineTo(20 * i, this.canvas.height);
        }
        for (var b = 0; b < this.canvas.height; b++) {
            this.c.moveTo(0, b * 20);
            this.c.lineTo(this.canvas.width, b * 20);
        }
        this.c.stroke();
    },
    setMessage: function (msg, time, color) {
        this.tempMsg = msg;
        this.tempVal = time;
        this.color = color;
    }

};

setInterval(function () {
    if (game.running == true)
        game.countDown();
}, 1000);

game.newMap();

document.onkeydown = function (e) {
    if (e.keyCode == 38 && game.counter > 0) {//UP
        game.move(0, -20);
    }
    if (e.keyCode == 40 && game.counter > 0) {//down
        game.move(0, 20);
    }
    if (e.keyCode == 37 && game.counter > 0) {
        game.move(-20, 0);
    }
    if (e.keyCode == 39 && game.counter > 0) {
        game.move(20, 0);
    }
    if (e.keyCode == 82) {
        game.restart();
    }
};
