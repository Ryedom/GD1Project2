/** @constructor */
let playerScript = function()
{
    this.playerYOffset = 200;
    this.playerStrafeVelocity = 200;
    this.playerForwardVelocity = 100;
    this.playerIdleFrame = 4;

    this.maxBulletsOnScreen = 500;
    this.bulletFrames = 80;
    this.bulletSpeed = 1500;
    this.fireRate = 0;

    this.numBandMembers = 0;
    this.maxBandMembers = 4;
    this.bandMemberOffsetX = [-40, 40, -80, 80];
    this.bandMemberOffsetY = [40, 40, 80, 80];
};

playerScript.prototype.preload = function()
{
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('bullet', 'assets/rgblaser.png', 4, 4);
};

playerScript.prototype.create = function()
{
    //PLAYER---------------------------------------------------------------
    //add this.player
    this.player = game.add.sprite(game.world.width/2, game.world.height - this.playerYOffset, 'dude');

    //  We need to enable physics on the this.player
    game.physics.arcade.enable(this.player);

    this.player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);
    //END PLAYER----------------------------------------------------------

    //WEAPON--------------------------------------------------------------
    //add weapon
    this.playerWeapon = game.add.weapon(this.maxBulletsOnScreen, 'bullet');

    //The 'rgblaser.png' is a Sprite Sheet with 80 frames in it (each 4x4 px in size)
    //  The 3rd argument tells the Weapon Plugin to advance to the next frame each time
    //  a bullet is fired, when it hits 80 it'll wrap to zero again.
    //  You can also set this via this.weapon.bulletFrameCycle = true
    this.playerWeapon.setBulletFrames(0, this.bulletFrames, true);

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

    this.bandMembers = game.add.group();

    //END BAND MEMBERS--------------------------------------------------------------------

    //  Our controls. (delete later)
    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);

    return this.player;
};

playerScript.prototype.update = function()
{
    this.player.body.velocity.y = -1 * this.playerForwardVelocity;

    //then set the velocity depending on where the mouse is while button is down
    if(game.input.activePointer.isDown)
    {
        if(game.input.activePointer.x < this.player.centerX)
        {
            this.player.body.velocity.x = -1 * this.playerStrafeVelocity;

            this.player.animations.play('left');
        }
        if(game.input.activePointer.x > this.player.centerX)
        {
            this.player.body.velocity.x = this.playerStrafeVelocity;

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
    if (this.player.alive){
      this.playerWeapon.fire();
    }

    //update allies' positions and make them fire
    for(i=0; i<this.bandMembers.children.length; i++){
        this.bandMembers.children[i].x = this.player.x + this.bandMemberOffsetX[i];
        this.bandMembers.children[i].y = this.player.y + this.bandMemberOffsetY[i];

        this.playerWeapon.fireRate = 0;
        this.playerWeapon.fire( {x: this.bandMembers.children[i].x + this.bandMembers.children[i].width/2, y: this.bandMembers.children[i].y} );
        this.playerWeapon.fireRate = this.fireRate;

        //play animations of band members
        if(game.input.activePointer.isDown)
        {
            if(game.input.activePointer.x < this.player.centerX)
            {
                this.bandMembers.children[i].animations.play('left');
            }
            if(game.input.activePointer.x > this.player.centerX)
            {
                this.bandMembers.children[i].animations.play('right');
            }

        }
        else
        {
            //  Stand still
            this.bandMembers.children[i].animations.stop();
            this.bandMembers.children[i].frame = this.playerIdleFrame;
        }
    }

    if(this.leftKey.downDuration(1)){
        this.addBandMember();
    }
    if(this.rightKey.downDuration(1)){
        this.removeBandMember();
    }
    if(this.spaceKey.downDuration(1)){
        this.killPlayer();
    }
};

//debug text
playerScript.prototype.render = function() {
    game.debug.text("Mouse Button: " + game.input.activePointer.isDown, 300, 130);
    game.debug.text("Num Band Members: " + this.numBandMembers, 300, 150);
};


playerScript.prototype.addBandMember = function(){

    if(this.numBandMembers < this.maxBandMembers) {
        this.numBandMembers = this.numBandMembers + 1;

        //CREATE NEW BAND MEMBER------------------------------
        let member = this.bandMembers.create(0, 0, 'dude');

        //  Our two animations, walking left and right.
        member.animations.add('left', [0, 1, 2, 3], 10, true);
        member.animations.add('right', [5, 6, 7, 8], 10, true);
        //END CREATE NEW BAND MEMBER---------------------------

    }
};

playerScript.prototype.removeBandMember = function(){

    if(this.numBandMembers > 0){

        this.numBandMembers = this.numBandMembers - 1;

        this.bandMembers.children.pop().kill();
    }
};

playerScript.prototype.returnPlayerWeapon = function(){
  return this.playerWeapon;
};

playerScript.prototype.damagePlayer = function(){
    if (this.numBandMembers === 0){
      this.killPlayer();
    } else {
      this.removeBandMember();
    }
};

playerScript.prototype.killPlayer = function(){
    this.player.kill();
};


playerScript.prototype.damagePlayer = function(){
  if (this.numBandMembers === 0){
    this.killPlayer();
  } else {
    this.removeBandMember();
  }

};
