// Enemies our player must avoid
var Enemy = function(speed) {
    this.x = 0;
    this.y = 63 + Math.floor((Math.random() * 3)) * 83; //  y position - also generated by a random number
    this.speed = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (player.isStarted() == true && player.state == '') {
        this.x += dt * this.speed;
        if (this.x > canvas.width){
            var i = allEnemies.indexOf(this);
            if(i != -1) {
                allEnemies.splice(i, 1);
            }
        }
    }
	this.render();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    if (player.isStarted() == true)
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.getHeight = function() {
    return 65;
};

Enemy.prototype.getWidth = function() {
    return 76;
};

// This Player class contains an update(), render() and
// a handleInput() method.
var Player = function () {
    this.x = 2 * 101;   // default x position
    this.y = 73 + 4 * 83; // default y position
    this.score = 0; // total score of the player
    this.pointsAdded = 0;
    this.playerCollision = false;   // the player is not in collision with any bugs
    this.start = false;  // Has the game started yet
    this.playerId = -1;   // the user has to choose a player ID between 1 to 5
    this.msg = "";    // record the number of points that the player gains or loses for display
    this.state = "";  // has the player won or lost, otherwise set to ""
	this.updating = false; // Is the score being updated right now?

    this.charImages = {
        '1': 'images/char-boy.png',
        '2': 'images/char-cat-girl.png',
        '3': 'images/char-horn-girl.png',
        '4': 'images/char-pink-girl.png',
        '5': 'images/char-princess-girl.png'
    };
};

// Return player status
Player.prototype.isStarted = function() {
    return this.start;
};

// Return player height
Player.prototype.getHeight = function() {
    return 75;
};

// Return player width
Player.prototype.getWidth = function() {
    return 76;
};

// Reset player position, state, and message, but not the game
Player.prototype.reset = function() {
    this.x = 2 * 101;
    this.y = 73 + 4 * 83;
    this.playerCollision = false;
    this.msg = "";
    this.state = "";
	this.updating = false;
};

// Reset the game
Player.prototype.resetGame = function() {
    this.msg = "";
    this.state = "";
    this.score = 0;
    this.start = false;
    this.playerId = -1;
};

// Update internal states - check to see if player
// has collided with the enemies, caught any gems, won or lost the game
Player.prototype.update = function() {
    if (this.start == false)
        return;
	
    this.checkCollisions(); // Check if player collides with any enemies

    // The player loses 20 points when colliding with the enemy
    if (this.playerCollision) {
        this.score --;
		this.updating = true;
        this.pointsAdded --;
        this.msg = "-20";
	
        if(this.pointsAdded == -20) {
            this.pointsAdded = 0;
            this.reset();
        }
    }

    // The player gains 50 points upon reaching the water
    if (this.y < 73) {// in water
        this.score ++;
		this.updating = true;
        this.pointsAdded ++;
        this.msg = '+50';

        if (this.pointsAdded == 50) {
            this.pointsAdded = 0;
            this.reset();
        }
    }

    if (this.score >= 300) {
        this.state = 'WON';
    }
    else if (this.score <= -100) {
        this.state = 'LOST';
    }
    else 
        this.state = '';
};

// Render the player image
Player.prototype.render = function() {
    if (this.start == true){
        ctx.drawImage(Resources.get(this.charImages[this.playerId]), this.x, this.y);
        if (player.state != '') {
            ctx.fillStyle = 'green';
            ctx.font = 'bold 20pt sans-serif';
            ctx.fillText('GAME OVER - You ' + player.state + '!!!', 30, 249);
            ctx.fillText('Please Enter Space Key To Restart' + '!!!', 30, 310);
        }
    }
};

// Process user key inputs
// Space key is to restart the game
// number 1 to 5 is to choose a character
//  left, right, up, down keys are to control player direction
Player.prototype.handleInput = function(keyCode) { 
    if(this.updating == true)
        return;

    if(this.start == true && this.state == "") {
        if (keyCode == 'left') {
            this.x = (this.x >= 101) ? (this.x - 101) : this.x;
        }
        else if (keyCode == 'up') {
            this.y -= 83;
            this.y = (this.y < -10) ? (this.y + 83) : this.y;
            this.y %= 488;
        }
        else if (keyCode == 'down') {
            this.y = ((this.y + 83) < 488) ? (this.y + 83) : this.y; 
        }
        else if (keyCode == 'right') {
            this.x = ((this.x + 101) < canvas.width) ? (this.x + 101) : this.x;
        }
    }
	else if (this.start == true && this.state != "" && keyCode == 'Space') {
        this.resetGame();
    }
    else if (this.start == false &&  // Game has not started - player is selecting a character
            (keyCode == '1' || keyCode == '2' || keyCode == '3' || keyCode == '4' || keyCode == '5')) {
        this.playerId = keyCode;
        this.start = true;
    }
    this.render();
};

Player.prototype.checkCollisions = function() {
// check if player collide with any enemies
// if true, then set playerCollision = true
    var counter;
    var proximity = 80;

    for (counter in allEnemies) {
        var enemy = allEnemies[counter];
        if (this.playerCollision == true)
            return;
			
        if (Math.abs(enemy.x - this.x) < proximity && Math.abs(enemy.y - this.y) < proximity) {
            this.playerCollision = true;
        }
    }
};
	
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'Space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        49: '1',
        50: '2',
        51: '3',
        52: '4',
        53: '5'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
setInterval(function() {
	            if (allEnemies.length > 5)
                    return;
	            var r = Math.floor((Math.random() * 3)); // random
	            var s = Math.floor((Math.random() * 100)); // starting speed
 				s = (s < 5) ? (s + 10) : s;
	            for (var i = 0; i < r; i ++, s += 50){
                     allEnemies.push(new Enemy(s));
	            }
            }, 1000);

var player = new Player();