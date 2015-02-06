// Enemies our player must avoid
var Enemy = function(speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
	this.x = Math.random() * 4 * 101;  // a random number between 0 and 4  multiplied by width of image
	this.y = Math.floor((Math.random() * 3) + 1) * 83; // a random number between 1 and 3 multiplied by height of image
	this.speed = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	this.x += dt * this.speed;
	this.x %= canvas.width;
	
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	if (this.y < 83) {// in water
		this.score ++;
		this.reset();
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}
}

Enemy.prototype.getHeight = function() {
//	return Resources.get(this.sprite).height;
	return 83;
}

Enemy.prototype.getWidth = function() {
	return Resources.get(this.sprite).width;
}
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function (playerId) {
	this.x = 2 * 101;
	this.y = 5 * 83;
	this.score = 0;
	
	this.playerId = playerId;
	this.charImages ={
		"1": "images/char-boy.png",
		"2": "images/char-cat-girl.png",
		"3": "images/char-horn-girl.png",
		"4": "images/char-pink-girl.png",
		"5": "images/char-princess-girl.png"
	};
	if (!this.charImages.hasOwnProperty(playerId))
		this.playerId = "1";
}

Player.prototype.getHeight = function() {
//	return Resources.get(this.charImages[this.playerId]).height;
	return 83;
}

Player.prototype.getWidth = function() {
	return Resources.get(this.charImages[this.playerId]).width;
}

Player.prototype.reset = function() {
	this.x = 2 * 101;
	this.y = 5 * 83;
}

Player.prototype.update = function() {
//	if (this.y < 83) {// in water
//		this.score ++;
//		this.reset();
//	}
}

Player.prototype.deduct = function() {
	this.score --;
}


Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.charImages[this.playerId]), this.x, this.y);
}

Player.prototype.handleInput = function(keyCode) {
//	console.log("Before x = " + this.x);
//	console.log("Before y = " + this.y);
	if (keyCode == 'left') {
		this.x -= this.getWidth();
		if (this.x < 0)
			this.x += canvas.width;
		this.x %= canvas.width;
	}
	else if (keyCode == 'up') {
		this.y -= this.getHeight();
		if (this.y < 0)
			this.y += canvas.height;
		this.y %= canvas.height;
	}
	else if (keyCode == 'down') {
		this.y += this.getHeight();
		this.y %= canvas.height;
	}
	else if (keyCode == 'right') {
		this.x += this.getWidth();
		this.x %= canvas.width;
	}
//	console.log("after x = " + this.x);
//	console.log("after y = " + this.y);
}

Player.prototype.checkPlayerCollisions = function() {
	var counter;
	
	// write some code that checks if enemy.xPosition >= player.xPosition
	// if true, then set playerCollision = true
	// I hope you know what I mean by "xPosition"; maybe you called that variable something else.
	for (counter in allEnemies) {
		if (player.x < allEnemies[counter].x) {
				return true;
		}
	}
	return false;

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
allEnemies[0] = new Enemy(50);
allEnemies[1] = new Enemy(100);
allEnemies[2] = new Enemy(150);
var player = new Player("3");

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


