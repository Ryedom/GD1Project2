//constructor. A function constructor, no less!
let bandMemberPowerupScript = function()
{

};

//when Phaser creates an instance of this state, we want it to
bandMemberPowerupScript.prototype.preload = function()
{
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
};

//arg1: the player's sprite
//arg2: the player's playerScript
bandMemberPowerupScript.prototype.create = function(player, playerScript) {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.bandMembersPowerups = game.add.group();
    this.bandMembersPowerups.enableBody = true;

    this.player = player;
    this.playerScript = playerScript;
};


bandMemberPowerupScript.prototype.update = function()
{
    game.physics.arcade.overlap(this.player, this.bandMembersPowerups, this.pickup, null, this);
};

bandMemberPowerupScript.prototype.addPowerup = function(x, y)
{
    this.bandMembersPowerups.create(x, y, 'dude');
};

bandMemberPowerupScript.prototype.pickup = function(player, powerup)
{
    powerup.kill();

    this.playerScript.addBandMember();
};