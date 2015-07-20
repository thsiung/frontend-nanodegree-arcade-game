// GEM our player can get to win more points
var Gem = function(gemId) {
    this.x = Math.random() * 4 * 101;  // x position - a random number between 0 and 4  multiplied by width of image
    this.y = 101 + Math.floor((Math.random() * 3)) * 83; // y position - a random number between 1 and 5 multiplied by height of image
    this.gemId = gemId;
    this.created = Date.now();  // the time that this gem is created

    this.charImages = {
        '1' : {image: 'images/Gem Blue.png', cycletime: 10},
        '2' : {image: 'images/Gem Green.png', cycletime: 12},
        '3' : {image: 'images/Gem Orange.png', cycletime: 18},
        '4' : {image: 'images/Heart.png', cycletime: 8},
        '5' : {image: 'images/Star.png', cycletime: 6},
    };

    this.cycle = this.charImages[this.gemId].cycletime;
    this.sprite = this.charImages[this.gemId].image;
};

// Update the gem's position
Gem.prototype.update = function() {
    // check if gem has been caught by the player, if yes, increment player's score by 5
    function xWithinRange(gem) {
		if ((player.x >= gem.x) && ((player.x - gem.x) < 51.5)) 
            return true;
        else if ((player.x < gem.x) && ((gem.x - player.x) < 101))
            return true;
        return false;
    }
    function yWithinRange(gem) {
        if ((player.y >= gem.y) && ((player.y - gem.y) < 41.5))
            return true;
        else if ((player.y < gem.y) &&(gem.y - player.y) < 112)
            return true;
        
        return false;
    }
    if (xWithinRange(this) && yWithinRange(this)) {
        player.score += 5;
        player.msg = "+5";
        this.reset();
    }
    else {
        if (player.msg == "+5")
            player.msg = "";
        var now = Date.now();
        var passed = (now - this.created) / 1000.0;
        var oldX = this.x;
        var oldY = this.y;

        // The Gem would disappear based on its cycle time. When it reappear, it's going to be random position
        if ( passed % this.cycle > this.cycle / 2) {
            this.x = -200;
            this.y = -200;
        }
        else {
            if (this.x == -300 && this.y == -300)
                return;
			
            this.x = (oldX == -200) ? (Math.random() * 4 * 101) : oldX;
            this.y = (oldY == -200) ? (101 + Math.floor((Math.random() * 3)) * 83) : oldY;
        } 
    }
    this.render();
};

// Hide the gem
Gem.prototype.reset = function() {
    this.created = Date.now();
    this.x = -300;
    this.y = -300;
};

// Draw the gem on the screen, required method for game
Gem.prototype.render = function() {
    if (player.isStarted() == true && player.state == "") {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 50.5, 41.5);
    }
};

// return gem image height
Gem.prototype.getHeight = function() {
//	return Resources.get(this.sprite).height;
    return 83;
};

// return gem image width
Gem.prototype.getWidth = function() {
    return Resources.get(this.sprite).width;
};

// GEM list
var allGems = [];
allGems[0] = new Gem("1");
allGems[1] = new Gem("2");
allGems[2] = new Gem("3");
allGems[3] = new Gem("4");
allGems[4] = new Gem("5");