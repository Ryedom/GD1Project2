/** @constructor */
let playerControlTestState = function()
{
    this.playerYOffest = 200;
    this.playerVelocity = 200;
    this.playerIdleFrame = 4;

    this.bulletSpeed = 1500;
    this.fireRate = 50;

    /*
    this.numBandMembers = 0;
    this.maxBandMembers = 4;
    this.bandMemberOffsetX = [-20, 20, -40, 40];
    this.bandMemberOffsetY = [-20, 20, -40, 40];
    */
};

playerControlTestState.prototype.preload = function()
{

};

playerControlTestState.prototype.create = function()
{
    //enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //PLAYER---------------------------------------------------------------
    //add this.player
    this.player = game.add.sprite(game.world.width/2, game.world.height - this.playerYOffest, 'dude');

    //  We need to enable physics on the this.player
    game.physics.arcade.enable(this.player);

    this.player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);
    //END PLAYER----------------------------------------------------------

    //WEAPON--------------------------------------------------------------
    //add weapon
    this.playerWeapon = game.add.weapon(100, 'bullet');

    //The 'rgblaser.png' is a Sprite Sheet with 80 frames in it (each 4x4 px in size)
    //  The 3rd argument tells the Weapon Plugin to advance to the next frame each time
    //  a bullet is fired, when it hits 80 it'll wrap to zero again.
    //  You can also set this via this.weapon.bulletFrameCycle = true
    this.playerWeapon.setBulletFrames(0, 80, true);

    //bullets disappear when they exit frame
    this.playerWeapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  The speed at which the bullet is fired
    this.playerWeapon.bulletSpeed = this.bulletSpeed;

    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 50ms
    this.playerWeapon.fireRate = this.fireRate;

    //  Weapon tracks player
    //  X offset equal to half the player's width (so it fires from the center)
    //  no Y offset
    //  'false' argument tells the weapon not to track player rotation (will always shoot up)
    this.playerWeapon.trackSprite(this.player, this.player.width/2, 0, false);
    //END WEAPON----------------------------------------------------------------------

    //BAND MEMBERS------------------------------------------------------------------------

    //this.bandMembers = game.add.group();

    //END BAND MEMBERS--------------------------------------------------------------------

    //WEAPON GROUP---------------------------------------------------------

    //this.allyWeapons = game.add.group();

    //END WEAPON GROUP----------------------------------------------------

    //  Our controls. (delete later)
    this.cursors = game.input.keyboard.createCursorKeys();
};

playerControlTestState.prototype.update = function()
{

    //then set the velocity depending on where the mouse is while button is down
    if(game.input.mousePointer.isDown)
    {
        if(game.input.x < this.player.centerX)
        {
            this.player.body.velocity.x = -1 * this.playerVelocity;

            this.player.animations.play('left');
        }
        if(game.input.x > this.player.centerX)
        {
            this.player.body.velocity.x = this.playerVelocity;

            this.player.animations.play('right');
        }

    }
    else
    {
        //  Reset the this.players velocity (movement)
        this.player.body.velocity.x = 0;

        //  Stand still
        this.player.animations.stop();
        this.player.frame = this.playerIdleFrame;
    }

    //the playerWeapon always fires
    this.playerWeapon.fire();


    if(this.cursors.left.onDown){
        this.addBandMember();
    }
    if(this.cursors.right.onDown){
        this.removeBandMember();
    }
};

//debug text
playerControlTestState.prototype.render = function() {
    game.debug.text("Mouse Button: " + game.input.mousePointer.isDown, 300, 132);
    game.debug.text("Left Key: " + this.cursors.left.isDown, 300, 150);
};


playerControlTestState.prototype.addBandMember = function(){

    /*
    if(this.numBandMembers < this.maxBandMembers){
        this.numBandMembers = this.numBandMembers + 1;

        let member = this.bandMembers.create(50, 50, 'dude');

        //  Our two animations, walking left and right.
        //this.member.animations.add('left', [0, 1, 2, 3], 10, true);
        //this.member.animations.add('right', [5, 6, 7, 8], 10, true);
    }
    */
}

playerControlTestState.prototype.removeBandMember = function(){

}