//constructor. A function constructor, no less!
let preloadState = function()
{

};

//when Phaser creates an instance of this state, we want it to
preloadState.prototype.preload = function()
{
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('bullet', 'assets/rgblaser.png', 4, 4);
};

preloadState.prototype.create = function()
{
    game.state.start("PlayerControlTest");
};

preloadState.prototype.update = function()
{

};
