//constructor. A function constructor, no less!
let bandMemberPowerupScript = function()
{

};

//when Phaser creates an instance of this state, we want it to
bandMemberPowerupScript.prototype.preload = function()
{
};

//arg1: the player's sprite
//arg2: the player's playerScript
bandMemberPowerupScript.prototype.create = function(playerSprite, playerScript) {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.bandMembersPowerups = game.add.group();
    this.bandMembersPowerups.enableBody = true;

    this.playerSprite = playerSprite;
    this.playerScript = playerScript;
};


bandMemberPowerupScript.prototype.update = function()
{
    game.physics.arcade.overlap(this.playerSprite, this.bandMembersPowerups, this.pickup, null, this);
};

bandMemberPowerupScript.prototype.addPowerup = function(x, y)
{
    let bandMember = game.add.sprite(x, y, 'ally_powerup');
    bandMember.animations.add('stand', [0, 1], 5, true);
    bandMember.animations.play("stand");

    this.bandMembersPowerups.add(bandMember);

    bandMember.scale.x = bandMember.scale.x * .5;
    bandMember.scale.y = bandMember.scale.y * .5;
    bandMember.body.setSize(105, 210, 45, 0);
};

bandMemberPowerupScript.prototype.pickup = function(playerSprite, powerup)
{
    powerup.kill();

    this.playerScript.addBandMember();
};
