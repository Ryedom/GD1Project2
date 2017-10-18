// References used: https://phaser.io/docs/2.6.2/index
//                  https://phaser.io/examples
//constructor. A function constructor, no less!
let playerObjectTestState = function()
{
    this.playerScript = new playerScript();
    this.bandMemberPowerupScript = new bandMemberPowerupScript();
};

//when Phaser creates an instance of this state, we want it to
playerObjectTestState.prototype.preload = function()
{
    this.playerScript.preload();
    this.bandMemberPowerupScript.preload();
};

playerObjectTestState.prototype.create = function()
{
    //enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //add the player
    this.playerSprite = this.playerScript.create();

    this.bandMemberPowerupScript.create(this.playerSprite, this.playerScript);
    this.bandMemberPowerupScript.addPowerup(game.world.width/2, game.world.height/2);
};

playerObjectTestState.prototype.update = function()
{
    //update the player
    this.playerScript.update();
    this.bandMemberPowerupScript.update();
};

playerObjectTestState.prototype.render = function() {
    this.playerScript.render();
};
