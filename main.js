(function() {
    //Selecting HTML elements
    const canvas = document.querySelector("#canvas");
    const eatSound = document.querySelector("#eatUrl");
    const opening = document.querySelector("#opening");
    const soundTrack = document.querySelector("#strack");
    const startGame = document.querySelector("#start-game");
    const displayScore = document.querySelector("#score");
    const won = document.querySelector("#won");
    const soundButton = document.querySelector("#sound");
    const playSound = document.querySelector("#play");
    const die = document.querySelector("#die");
    const mute = document.querySelector("#mute");
	

    //Setting the field map and types
    let map = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0],
        [0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0],
        [0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0],
        [0, 1, 1, 0, 1, 1, 1, 3, 3, 3, 3, 1, 1, 1, 0, 1, 1, 0],
        [0, 0, 1, 0, 0, 1, 0, 1, 4, 1, 1, 0, 1, 0, 0, 1, 0, 0],
        [0, 3, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0],
        [0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

    ];
    const TYPES = [
        "BARRIER",
        "BISCUIT",
        "OPEN",
        "PACMAN",
        "GHOST"
    ];

    function Tile(x, y, type) {
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.x = x;
        this.y = y;
        this.neighbours = [];
        this.parent = null;
        this.type = type;

    }
    Tile.prototype.draw = function() {
        switch (this.type) {

            case "BARRIER":

                ctx.fillStyle = "blue";
                ctx.fillRect(this.x, this.y, size, size);
                break;


            case "BISCUIT":
                ctx.fillStyle = "#fff";
                ctx.beginPath();
                ctx.arc(this.x + third, this.y + third, 5, 0, 2 * Math.PI);
                ctx.fill();

                break;


            case "GHOST":

                var image = document.querySelector("#m1");
                ctx.drawImage(image, this.x + 4, this.y + 4, size - 5, size - 5);
                break;

            case "PACMAN":
                var image = document.querySelector("#source");
                ctx.drawImage(image, this.x + 4, this.y + 4, size - 5, size - 5);
                break;


        }

    };
    Tile.prototype.drawDebug = function(color) {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, size, size);

    }
    Tile.prototype.move = function(string) {
        switch (string) {
            case "up":
                var newY = pacman.y - size;
                pacmove(pacman.x, newY);

                break;

            case "right":
                var newX = pacman.x + size;
                pacmove(newX, pacman.y);

                break;
            case "left":
                var newX = pacman.x - size;
                pacmove(newX, pacman.y);

                break;
            case "down":
                var newY = pacman.y + size;
                pacmove(pacman.x, newY);

                break;
        };
    };
    Tile.prototype.addNeighbouras = function(filed) {
        var i = this.y / size;
        var j = this.x / size;
        if (i < 12) {
            this.neighbours.push(field[i + 1][j])
        }
        if (i > 0) {
            this.neighbours.push(field[i - 1][j])
        }
        if (j < 17) {
            this.neighbours.push(field[i][j + 1])
        }
        if (j > 0) {
            this.neighbours.push(field[i][j - 1])
        }
    }
    let field = [];
    let ghosts = [];
    let endScore = 0;
    let pacman;
    let played;
    let size = 50; //field block Size
    let score = 0; //keeping track of score
    let rows = map.length;
    let cols = map[0].length;
    let third = size / 2; //for BISCUIT drawing
    let ctx = canvas.getContext("2d");
	let died=false;
    let hieght = canvas.height;
    field = genereateField();

    function genereateField() {
        let grid = new Array();
        for (i = 0; i < rows; i++) {
            grid[i] = map[i];
            for (let j = 0; j < cols; j++) {
                let y = i * size;
                let x = j * size;
                let type = TYPES[grid[i][j]];
                let tile = new Tile(x, y, type);
                switch (type) {

                    case "PACMAN":
                        pacman = tile;
                        grid[i][j] = new Tile(x, y, "OPEN");
                        break;

                    case "BARRIER":
                        grid[i][j] = tile;
                        break;

                    case "BISCUIT":
                        endScore++; // worth 1 point
                        grid[i][j] = tile;
                        break;
                    case "GHOST":
                        ghosts.push(new Tile(x, y, type));
                        grid[i][j] = new Tile(x, y, "OPEN");
                        //   ghostId++;
                        break;
                }
            }
        }
        return grid
    }

    // Drawing the filed elements
    (function drawfield() {
        field.map(arr => arr.map(tile => tile.draw()));
        pacman.draw();
        ghosts.map(ghost => ghost.draw());
    })();


    // Adding neighbours to each element in the field
    for (i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            field[i][j].addNeighbouras(field);
        }
    }

    document.addEventListener("keydown", handleKeyBoard);

    function handleKeyBoard(e) {
		if(!died){
        switch (e.keyCode) {
            case 38:
                pacman.move("up");
                break;
            case 37:
                pacman.move("left");
                break;
            case 40:
                pacman.move("down");
                break;
            case 39:
                pacman.move("right");
                break;
        	}
		}
    }


    function getTile(x, y) {
        let i = y / size;
        let j = x / size;
        return field[i][j];
    }


    let done = false;

    function pacmove(x, y) {

        var tile = getTile(x, y);
        if (tile.type != "BARRIER") {
            ctx.clearRect(pacman.x, pacman.y, size, size);
            if (tile.type == "BISCUIT") {
                eatSound.currentTime = 0;
                eatSound.play();
                tile.type = "OPEN";
                score++;
                updatescore();
            }
            pacman.x = x;
            pacman.y = y;
            if (done) {
                astar(start, goal);
            }
            pacman.draw();


        }

    }

    function updatescore() {
        displayScore.innerHTML = score;
        if (score == endScore) {
            won.style.display = "flex";
            soundTrack.pause();
        }
    }

    if (!Array.prototype.remove) {
        Array.prototype.remove = function(from, to) {
            var rest = this.slice((to || from) + 1 || this.length);
            this.length = from < 0 ? this.length + from : from;
            return this.push.apply(this, rest);
        };
    }



    function heuristic(a, b) {
        return Math.abs(a.x / size - b.x / size) + Math.abs(a.y / size - b.y / size);
    }


    function astar(start, goal) {
        done = false;
        //clearInterval(loop);
        let current;
        var openSet = [];
        var closedSet = [];
        var path = [];

        start = field[ghosts[0].y / size][ghosts[0].x / size];
        goal = pacman;
        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field[i].length; j++) {
                field[i][j].parent = null;
            }
        }
        start.g = 0;
        start.f = heuristic(start, goal);
        openSet.push(start);
        while (openSet.length > 0) {
            var winner = 0;
            for (let i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[winner].f) {
                    winner = i;
                }
            }
            current = openSet[winner];
            if (current.x == goal.x && current.y == goal.y) {
                console.log("DONE");

                var temp = current;
                path.push(temp);
                while (temp.parent) {
                    path.push(temp.parent);
                    temp = temp.parent;
                }

                index = path.length - 1;
                var loop = setInterval(function() {
                    if (index > 0) {
                        prev = path[index];
                        ghosts[0].x = path[index - 1].x;
                        ghosts[0].y = path[index - 1].y;
                        if (ghosts[0].x == pacman.x && ghosts[0].y == pacman.y) {
                            console.log("lost");
                            document.querySelector(".score").innerHTML = score;
                            document.querySelector("#lost").style.display = "flex";
                            soundTrack.pause();
                            die.play();
							died=true;
                            clearInterval(loop);
                        }
                        ctx.clearRect(prev.x, prev.y, size, size);
                        if (prev.type == "BISCUIT") {
                            ctx.fillStyle = "#fff";
                            ctx.beginPath();
                            ctx.arc(prev.x + third, prev.y + third, 5, 0, 2 * Math.PI);
                            ctx.fill();
                        }
                        ghosts[0].draw();
                        index = index - 1;
                    } else {
                        done = true;
                        clearInterval(loop);
                    }

                }, 175);
              //  for (i = 0; i < path.length; i++) {
                //    path[i].drawDebug("pink");
               // }

                return;
            }
            neighbours = current.neighbours;
            closedSet.push(current);
            openSet.remove(winner);
            var neighbour;
            for (i = 0; i < neighbours.length; i++) {
                neighbour = neighbours[i];
                if (closedSet.includes(neighbour) || neighbour.type == "BARRIER") {
                    continue;
                }
                if (!openSet.includes(neighbour)) {
                    openSet.push(neighbour);
                }

                let tempG = current.g + 1
                if (tempG >= neighbours.g) {
                    continue;
                }
                neighbour.parent = current;
                neighbour.g = tempG;
                neighbour.f = neighbour.g + heuristic(neighbour, goal);
            };
        }

    }
    setInterval(function() {
        if (done) {
            astar(ghosts[0], pacman);
        }
    }, 0);

    //Background music mutting button clicked
    soundButton.addEventListener("click", function() {
        if (played) {
            mute.style.display = "block";
            playSound.style.display = "none";
            soundTrack.pause();
            played = false;
        } else {
            mute.style.display = "none";
            playSound.style.display = "block";
            soundTrack.volume = 0.2;
            soundTrack.play();
            played = true;
        }
    });
    //starting game by pressing space 
    document.addEventListener("keypress", function(e) {
        if (e.keyCode == 32) {
            astar(ghosts[0], pacman);
            startGame.style.display = "none";
            opening.pause();
            soundTrack.play();
            played = true;
            playSound.style.display = "block";
        }
    });
})();