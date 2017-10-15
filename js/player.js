/** @constructor */
player = function(gamevar)
{
    // call super constructor on sprite


    this.playerYOffest = 200;
    this.playerVelocity = 200;
    this.playerIdleFrame = 4;
    this.playerHealth = 1;
    Phaser.Sprite.call(this, gamevar, game.world.width/2, game.world.height - this.playerYOffest, 'dude');
    game.add.existing(this);

    this.bulletSpeed = 1500;
    this.fireRate = 0;

    this.numBandMembers = 0;
    this.maxBandMembers = 4;
    this.bandMemberOffsetX = [-40, 40, -80, 80];
    this.bandMemberOffsetY = [40, 40, 80, 80];

    //PLAYER---------------------------------------------------------------
    //  We need to enable physics on the this.player
    game.physics.arcade.enable(this);

    this.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
    //END PLAYER----------------------------------------------------------

    //WEAPON--------------------------------------------------------------
    //add weapon
    this.playerWeapon = game.add.weapon(500, 'bullet');

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
    this.playerWeapon.trackSprite(this, this.width/2, 0, false);
    //END WEAPON----------------------------------------------------------------------

    //BAND MEMBERS------------------------------------------------------------------------

    this.bandMembers = game.add.group();

    //END BAND MEMBERS--------------------------------------------------------------------

    //  Our controls. (delete later)
    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);

};

player.prototype = Object.create(Phaser.Sprite.prototype);
player.prototype.constructor = player;

player.prototype.preload = function()
{

};

player.prototype.create = function()
{


};

player.prototype.update = function()
{

    //then set the velocity depending on where the mouse is while button is down
    if(game.input.mousePointer.isDown)
    {
        if(game.input.x < this.centerX)
        {
            this.body.velocity.x = -1 * this.playerVelocity;

            this.animations.play('left');
        }
        if(game.input.x > this.centerX)
        {
            this.body.velocity.x = this.playerVelocity;

            this.animations.play('right');
        }

    }
    else
    {
        //  Reset the this.players velocity (movement)
        this.body.velocity.x = 0;

        //  Stand still
        this.animations.stop();
        this.frame = this.playerIdleFrame;
    }

    if (this.alive) {
      this.playerWeapon.fire();
    }


    //update allies' positions and make them fire
    for(i=0; i<this.bandMembers.children.length; i++){
        this.bandMembers.children[i].x = this.x + this.bandMemberOffsetX[i];
        this.bandMembers.children[i].y = this.y + this.bandMemberOffsetY[i];

        if (this.playerWeapon !== null) {
          this.playerWeapon.fireRate = 0;
          this.playerWeapon.fire( {x: this.bandMembers.children[i].x + this.bandMembers.children[i].width/2, y: this.bandMembers.children[i].y} );
          this.playerWeapon.fireRate = this.fireRate;
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
player.prototype.render = function() {
    game.debug.text("Mouse Button: " + game.input.mousePointer.isDown, 300, 130);
    game.debug.text("Num Band Members: " + this.numBandMembers, 300, 150);
};


player.prototype.addBandMember = function(){

    if(this.numBandMembers < this.maxBandMembers) {
        this.numBandMembers = this.numBandMembers + 1;

        //CREATE NEW BAND MEMBER------------------------------
        let member = this.bandMembers.create(0, 0, 'dude');

        //  Our two animations, walking left and right.
        //this.member.animations.add('left', [0, 1, 2, 3], 10, true);
        //this.member.animations.add('right', [5, 6, 7, 8], 10, true);
        //END CREATE NEW BAND MEMBER---------------------------

    }
}

player.prototype.removeBandMember = function(){

    if(this.numBandMembers > 0){

        this.numBandMembers = this.numBandMembers - 1;

        this.bandMembers.children.pop().kill();
    }
}

player.prototype.getX = function(){
  return this.body.x;
}

player.prototype.getY = function(){
  return this.body.y;
}

player.prototype.damagePlayer = function(){
  if (this.numBandMembers === 0){
    this.killPlayer();
  } else {
    this.removeBandMember();
  }

}

player.prototype.killPlayer = function(){
    this.kill();
}
