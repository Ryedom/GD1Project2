//constructor. A function constructor, no less!
let playerObjectTestState = function()
{

};

//when Phaser creates an instance of this state, we want it to
playerObjectTestState.prototype.preload = function()
{

};

playerObjectTestState.prototype.create = function()
{
    //enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //add the player
    this.player = new player();
    this.player.create();
};

playerObjectTestState.prototype.update = function()
{
    //update the player
    this.player.update();
};

playerObjectTestState.prototype.render = function() {
    this.player.render();
};