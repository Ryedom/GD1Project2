//constructor. A function constructor, no less!
let preloadState = function()
{

};

//when Phaser creates an instance of this state, we want it to
preloadState.prototype.preload = function()
{

};

preloadState.prototype.create = function()
{
    game.state.start("level1State");
};

preloadState.prototype.update = function()
{

};
