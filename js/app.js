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
    this.speed = speed
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

// Method to check if the enemy collides with the player
Enemy.prototype.checkCollision = function() {
    //Checking to see if the player is near the enemy bug
    if(player.y > this.y - 10 && player.y < this.y + 10) {
        if(player.x > this.x - 50 && player.x < this.x + 60) {
            // If there is a collision reset the game
            console.log("collision");
            player.y = player.initial_y;
        }
    }
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
            if(this.x > 10) {
                this.x = this.x - 101;
            }
            break;
        case "right":
            if(this.x < 400) {
               this.x = this.x + 101;
            }
            break;
        case "down":
            if(this.y < 400) {
               this.y = this.y + 83;
            }
            break;
        case "up":
            if(this.y > 50) {
                this.y = this.y - 83;
            }
            break;
        case "enter":
            gameState = "starting";
            break;
    }
};




// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(60, 10), new Enemy(60, 50), new Enemy(60, 150), new Enemy(145, 70),
    new Enemy(145, 170), new Enemy(145, 250), new Enemy(225, 40), new Enemy(225, 90), new Enemy(225, 190),
        new Enemy(225, 290)];

var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
