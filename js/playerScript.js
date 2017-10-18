/** @constructor */
let playerScript = function()
{
    this.playerYStart = 200;
    this.playerStrafeVelocity = 200;
    this.playerForwardVelocity = 250;
    this.playerIdleFrame = 4;

    this.cameraYOffset = 200;

    this.maxBulletsOnScreen = 300;
    this.bulletFrames = 4;
    this.bulletSpeed = 1500;
    this.fireRate = 150;

    this.numBandMembers = 0;
    this.maxBandMembers = 4;
    this.bandMemberOffsetX = [-70, 55, -140, 110];
    this.bandMemberOffsetY = [20, 20, 40, 40];
    this.noteColor = [0xFF0000, 0xFFAA00, 0xFFFF00, 0x00FF00, 0x00FFFF, 0x0000FF];
    this.currentNoteColor = 0;

    this.spriteScaleFraction = .5;
    this.shootEnabled = true;
};

playerScript.prototype.preload = function()
{
};

playerScript.prototype.create = function()
{
    //PLAYER---------------------------------------------------------------
    //add this.player
    this.player = game.add.sprite(game.world.width/2, game.world.height - this.playerYStart, 'carole');
    this.player.scale.x = this.player.scale.x * this.spriteScaleFraction;
    this.player.scale.y = this.player.scale.y * this.spriteScaleFraction;
    //original width:

    //  We need to enable physics on the this.player
    game.physics.arcade.enable(this.player);
    this.player.body.setSize(105, 210, 45, 0); // reduce hitbox to hug Carole!

    this.player.body.collideWorldBounds = true;

    this.player.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 25, true);
    //END PLAYER----------------------------------------------------------

    //WEAPON--------------------------------------------------------------
    //add weapon
    this.playerWeapon = game.add.weapon(this.maxBulletsOnScreen, 'music_notes');
    this.playerWeapon.multiFire = true;

    //The 'rgblaser.png' is a Sprite Sheet with 80 frames in it (each 4x4 px in size)
    //  The 3rd argument tells the Weapon Plugin to advance to the next frame each time
    //  a bullet is fired, when it hits 80 it'll wrap to zero again.
    //  You can also set this via this.weapon.bulletFrameCycle = true
    this.playerWeapon.setBulletFrames(0, this.bulletFrames, true);

    //bullets disappear when they exit frame
    this.playerWeapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;

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
    this.bandMembers.enableBody = true;

    //END BAND MEMBERS--------------------------------------------------------------------
    this.player.animations.play("run");

    return this.player;
};

playerScript.prototype.update = function(){
    this.player.body.velocity.y = -1 * this.playerForwardVelocity;

    //then set the velocity depending on where the mouse is while button is down
    if(game.input.activePointer.isDown)
    {
        if(game.input.activePointer.x < this.player.centerX)
        {
            this.player.body.velocity.x = -1 * this.playerStrafeVelocity;
        }
        if(game.input.activePointer.x > this.player.centerX)
        {
            this.player.body.velocity.x = this.playerStrafeVelocity;
        }

    }
    else
    {
        //  Reset the this.players velocity (movement)
        this.player.body.velocity.x = 0;
    }
    if (this.player.alive && this.shootEnabled === true){
        var lastBullet = this.playerWeapon.fire();
        if (lastBullet !== null) {
            this.currentNoteColor = (this.currentNoteColor + 1) % this.noteColor.length;
            lastBullet.tint = this.noteColor[this.currentNoteColor];
        }
    }

    //update allies' positions and make them fire
    for(i=0; i<this.bandMembers.children.length; i++){
        this.bandMembers.children[i].x = this.player.x + this.bandMemberOffsetX[i];
        this.bandMembers.children[i].y = this.player.y + this.bandMemberOffsetY[i];

        if (this.bandMembers.children[i].shootEnabled === true){
            var lastBullet = this.playerWeapon.fire( {x: this.bandMembers.children[i].x + this.bandMembers.children[i].width/2, y: this.bandMembers.children[i].y} );
            if (lastBullet !== null)
                lastBullet.tint = this.noteColor[this.currentNoteColor];
        }
    }

    //set camera to focus on a point in front of player such that player is 'cameraYOffset' distance from bottom of screen
    game.camera.focusOnXY(game.world.width/2, this.player.position.y - game.camera.height/2 + this.cameraYOffset);
};

playerScript.prototype.render = function() {
    
};


playerScript.prototype.addBandMember = function(){

    if(this.numBandMembers < this.maxBandMembers) {
        this.numBandMembers = this.numBandMembers + 1;

        //CREATE NEW BAND MEMBER------------------------------
        let member = this.bandMembers.create(0, 0, 'ally' + (this.numBandMembers - 1));

        member.scale.x = member.scale.x * this.spriteScaleFraction;
        member.scale.y = member.scale.y * this.spriteScaleFraction;
        member.shootEnabled = true;
        member.body.setSize(105, 210, 45, 0); // reduce hitbox to hug Carole!
        game.physics.arcade.enable(member);

        //  Our two animations, walking left and right.
        member.animations.add('run', [0, 1, 2, 3, 4], 10, true);
        member.animations.play('run');
        //END CREATE NEW BAND MEMBER---------------------------
        // let member = game.add.sprite(0, 0, 'ally0');
        //
        // //  Our two animations, walking left and right.
        // member.animations.add('run', [0, 1, 2, 3, 4], 12, true);
        // member.animations.play('run');
        //
        // this.bandMembers.add(member);
    }
};

playerScript.prototype.removeBandMember = function(){

    if(this.numBandMembers > 0){

        this.numBandMembers -= 1;

        this.bandMembers.children.pop().kill();
    }
};

playerScript.prototype.returnPlayerWeapon = function(){
  return this.playerWeapon;
};

playerScript.prototype.returnBandMemberGroup = function(){
    return this.bandMembers;
}

playerScript.prototype.damagePlayer = function(){
    if (this.numBandMembers === 0){
      this.killPlayer();
    } else {
      this.removeBandMember();
    }
};

playerScript.prototype.killPlayer = function(){
    this.player.kill();

    game.state.start(game.state.current);
};
