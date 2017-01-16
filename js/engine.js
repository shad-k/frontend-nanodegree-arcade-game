/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        timer = 3;



    // The variable stores the current level of the game, starting from 1
    var level = 1;

    /* Declare and initialize the gameState variable to keep a track of the
     * state of the game
     */
    var gameState = "menu";

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        // Check to see if the game is yet to start
        if(global.gameState === "menu") {
            /* Call the render function to render the basic game track and player
             * and then call the menu function to display the starting menu with
             * level number
             */
            render();
            menu();
        }
        // Check to see if the user has started the game
        else if(global.gameState === "starting") {
            /* Clear the canvas to draw the starting message
             * and call the startGame method to draw a fancy starting message
             * with a countdown to let the user get ready
             */
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            render();
            startGame();
        }
        // Check to see if the game is in the "running" state
        else if(global.gameState === "running") {
            /* Call our update/render functions, pass along the time delta to
             * our update function since it may be used for smooth animation.
            */
            update(dt);
            render();
        }
        // Check to see if player passed the level
        else if(global.gameState === "level-up") {
            ctx.clearRect(0,0, canvas.width, canvas.height);
            render();
            levelup();
        }
        // Check to see if player collided
        else if(global.gameState === "lost") {
            ctx.clearRect(0,0, canvas.width, canvas.height);
            render();
            playerLost();
        }
        else if(global.gameState === "paused") {
        	render();
        	gamePaused();
        }

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main to draw the game start menu
     * Draws a transparent black screen over the game track
     * and shows welcome text along with the level number
     */
    function menu() {
        drawScreen();

        // ctx.font = "64px sans-serif";
        ctx.fillText("To start the game press Enter", canvas.width/2, 300);
    }

    /* This function just fancies up the start process
     * Draws a transparent screen over the track and then shows a countdown timer
     * When countdown hits "0", sets the gameState variable to "running"
     */
    function startGame() {
        drawScreen();

        // Countdown count
        global.timer -= 0.02;

        // Use Math.ceil() to show integers
        ctx.fillText("Game starting in " + Math.ceil(global.timer), canvas.width/2, 300);
        ctx.font = "48px sans-serif";
        ctx.fillText("Level " + global.level, canvas.width/2, 400);

        // After countdown ends
        if(global.timer < 0 ) {
            global.gameState = "running";
        }
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        checkCollisions();
        updateEntities(dt);
        hasPlayerWon();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });

        /* Commenting out the update method since the player is getting
           updated on the basis of the user input */
        //player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    // This function calls the won function of the player object
    function hasPlayerWon() {
        player.won();
    }

    function levelup() {
        drawScreen();
        ctx.fillText("Yayy!! You won!", canvas.width/2, 150);
        global.timer -= 0.02;
        ctx.fillText("Starting Level " + global.level + " in " +
            Math.ceil(global.timer), canvas.width/2, 300);

        if(global.timer < 0 ) {
            increaseSpeed();
            //resetEntities();
            global.gameState = "running";
        }
    }

    /* This function is called by main when the player pauses the game.
     * The function displays the pause screen till the player restarts
     * the game by pressing Enter.
     */
    function gamePaused() {
    	if(gameState !== "running") {
    		drawScreen();
    		ctx.fillText("Press Enter to restart", canvas.width/2, 350);
    		ctx.font = "64px sans-serif";
    		ctx.fillText("Paused", canvas.width/2, 250);
    	}
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {

    }

    /* This function draws a transparent black screen for showing messages
     * on the game board
     */
     function drawScreen() {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 50, canvas.width, canvas.height - 70);
        ctx.font = "36px sans-serif";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
     }

    /* This function detects the collisions if any between enemies and players
     * The function loops over all the enemy objects and calls their collision
     * checking functions to detect collisions
     */
    function checkCollisions() {
        allEnemies.forEach(function(enemy) {
            enemy.checkCollision();
        });
    }

    /* This function is called by main when the player collides with enemy
     * It shows the "Game Over" screen and give player to restart
     */
    function playerLost() {
        drawScreen();
        ctx.fillText("To start over press Enter", canvas.width/2, 350);
        ctx.font = "64px sans-serif";
        ctx.fillText("Game Over!", canvas.width/2, 250);
        resetEntities();
    }

    // This function speeds up the bug as the levels increase
    function increaseSpeed() {
        allEnemies.forEach(function(enemy) {
            enemy.speed += 100;
        })
    }

    /* This function calls the resetEnemy function for each of the enemy objects
     * to reset them to the original place
     */
    function resetEntities() {
        allEnemies.forEach(function(enemy) {
            enemy.resetEnemy();
        });
    }


    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;

    /* Make the gameState variable global by assigning it to the global variable
     * so that different states can be set through it during the game.
     */
    global.gameState = gameState;

    // Make the level and timer variables globally accessible
    global.level = level;
    global.timer =timer;
})(this);
