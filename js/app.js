// Enemies our player must avoid
var Enemy = function(y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    //The location of our enemies
    this.x = -100; //Starting value
    this.y = y; //Starting value

    //The speed of our enemies
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.x > 505) {
        this.x = - 500;
    }
    this.x = this.x + this.speed * dt;

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.resetEnemy = function() {
    this.x = -100;
}

/* Method to check if the enemy collides with the player
 * Checks if the player's location is the same as the bug location.
 * If yes, raises the collision state and resets the player
 */
Enemy.prototype.checkCollision = function() {
    //Checking to see if the player is near the enemy bug
    if(player.y > this.y - 10 && player.y < this.y + 10) {
        if(player.x > this.x - 50 && player.x < this.x + 70) {
            // If there is a collision reset the game
            gameState = "lost";
            level = 1;
            timer = 0;
            allEnemies.forEach(function(enemy) {
                enemy.speed -= (player.level - 1) * 100;
            });

            player.y = player.initial_y;
            player.x = player.initial_x;
        }
    }
};

// This function is called by the increaseSpeed function in the engine.js
// file to increase the speed of the bugs on level up.
Enemy.prototype.increase = function() {
    this.speed += 100;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {

    //The image/sprite for our player
    this.sprite = 'images/char-boy.png';

    //The initial x and y values for player
    this.initial_x = 210;
    this.initial_y = 400;

    //The location of our player
    this.x = this.initial_x;
    this.y = this.initial_y;

    /* Keeps a track of the current player level
     * Also used for resetting the bugs back to their initial speed
     * when the game is restarted after player loses
     */
    this.level = 1;
};

/*  No use for this method currently since the player's position is updated
    from within the key press event handler
*/
// Player.prototype.update = function() {

// }

// This function renders the player according to its position on the game track
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//The mandatory event handler for keypress events
Player.prototype.handleInput = function(keyPressed) {

    switch(keyPressed) {
        case "left":
            if(this.x > 10 && gameState === "running") {
                this.x = this.x - 101;
            }
            break;
        case "right":
            if(this.x < 400 && gameState === "running") {
               this.x = this.x + 101;
            }
            break;
        case "down":
            if(this.y < 400 && gameState === "running") {
               this.y = this.y + 83;
            }
            break;
        case "up":
            if(this.y > 50 && gameState === "running") {
                this.y = this.y - 83;
            }
            break;
        case "enter":
            if(gameState === "menu" || gameState === "lost"
            	|| gameState === "paused") {
                gameState = "starting";
            }
            break;
        case "esc":
        	if(gameState === "running") {
            	gameState = "paused";
        	}
            break;
    }
};

// This method checks to see if the player has won the game
Player.prototype.won = function() {
    if(player.y < 0 ) {

        console.log("Player has won");
        player.y = player.initial_y;
        player.x = player.initial_x;
        timer = 3;
        gameState = "level-up";
        level++;
        player.level = level;
    }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(60, 10), new Enemy(60, 50), new Enemy(60, 150), new Enemy(145, 70),
    new Enemy(145, 170), new Enemy(145, 250), new Enemy(225, 40), new Enemy(225, 90), new Enemy(225, 190),
        new Enemy(225, 290)];

var player = new Player();


// This event listener is to prevent browser scrolling with the arrow keys
document.addEventListener('keydown', function(e) {

	/* Array includes only arrow keys to limit the preventDefault to only
	 * the arrow keys and not encompass each key as that can have some
	 * possible side-effect.
	 */
	var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if(allowedKeys[e.keyCode]) {
    	// To prevent browser scrolling
		e.preventDefault();
    }
});

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {

    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter',
        27: 'esc'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
