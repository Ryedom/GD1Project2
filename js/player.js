/** @constructor */
let player = function()
{
    this.playerYOffest = 200;
    this.playerVelocity = 200;
    this.playerIdleFrame = 4;

    this.bulletSpeed = 1500;
    this.fireRate = 0;

    this.numBandMembers = 0;
    this.maxBandMembers = 4;
    this.bandMemberOffsetX = [-40, 40, -80, 80];
    this.bandMemberOffsetY = [40, 40, 80, 80];

};

player.prototype.preload = function()
{

};

player.prototype.create = function()
{

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

    // ENEMY CREATION LOGIC

    // create the groups of enemies
    // skaters
    this.skaters = game.add.group();
    this.skaters.enableBody = true;

    // bullies
    this.bullies = game.add.group();
    this.bullies.enableBody = true;

    //  create 3 skaters
    for (let i = 0; i < 3; i++){
      this.skaters.create(i * 70 + 10, 10, "dude");
    }

    this.skaters.forEach(function(enem){
      enem.tooClose = false; // used for preventing sprite from "hugging" player
    }, this, true);

    // create a bully
    for (let i = 0; i < 1; i++){
      var bully = this.bullies.create(i * 70 + 400, 10, "dude");
      playerControlTestState.prototype.enableWeaponForEnemy(bully);
    }

    // bully's projectiles - spitballs
    this.spitballs = game.add.group();
    this.spitballs.enableBody = true;
};

player.prototype.update = function()
{
    // COLLISION LOGIC
    // enemy bullets hit player
    this.bullies.forEach(playerControlTestState.prototype.enemyHitsPlayerCheck, this, true, this.player);

    // player bullets hit enemy
    this.bullies.forEach(playerControlTestState.prototype.playerHitsEnemyCheck, this, true, this.player);

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

    if (this.playerWeapon !== null) {
      this.playerWeapon.fire();
    }


    //update allies' positions and make them fire
    for(i=0; i<this.bandMembers.children.length; i++){
        this.bandMembers.children[i].x = this.player.x + this.bandMemberOffsetX[i];
        this.bandMembers.children[i].y = this.player.y + this.bandMemberOffsetY[i];

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

    // ENEMY UPDATES
    // skaters move towards player
    this.skaters.forEach(playerControlTestState.prototype.moveEnemiesTowardPlayer, this, true, this.player);

    // bullies remain stationary but shoot towards player
    this.bullies.forEach(playerControlTestState.prototype.shootAtPlayer, this, true, this.player);

    // clear offscreen objects
    this.skaters.forEach(playerControlTestState.prototype.destroyIfOffscreen, this, true);
    this.bullies.forEach(playerControlTestState.prototype.destroyIfOffscreen, this, true);
    this.spitballs.forEach(playerControlTestState.prototype.destroyIfOffscreen, this, true);
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

player.prototype.killPlayer = function(){
    this.playerWeapon.destroy();
    this.playerWeapon = null; // fire functions should check for this so they don't try to call the weapon
    this.player.kill();
}

// ENEMY-RELATED FUNCTIONS

playerControlTestState.prototype.getAngleToPlayer = function(enem, plyr) {
  return Math.atan2(plyr.y - enem.y, plyr.x - enem.x);

}

// returns a distance (non-negative) from an enemy to a player
playerControlTestState.prototype.getDistanceFromPlayer = function(enem, plyr) {
  return Math.sqrt(Math.pow((enem.x - plyr.x), 2) + Math.pow((enem.y - plyr.y), 2));
};

playerControlTestState.prototype.moveEnemiesTowardPlayer = function(enem, plyr){
  if (enem.tooClose === false){ // the enemy hasn't gotten too close
    if (playerControlTestState.prototype.getDistanceFromPlayer(enem, plyr) > 20) { // within a certain distance, skater starts skating in a straight line
      // find vector to player
      var angleToPlayer = playerControlTestState.prototype.getAngleToPlayer(enem, plyr);
      // set velocity to travel to her
      game.physics.arcade.velocityFromRotation(angleToPlayer, 200, enem.body.velocity);
    }
    else { // set tooClose to true so enemy doesn't hug player
        enem.tooClose = true;
    }
  }
};

playerControlTestState.prototype.shootAtPlayer = function(enem, plyr){
    enem.weapon.fireAtSprite(plyr);
}

playerControlTestState.prototype.destroyIfOffscreen = function(obj){
  if (!(obj.visible)){
    obj.destroy();
  }
};

playerControlTestState.prototype.enableWeaponForEnemy = function(enem){
  var enemyWeapon = game.add.weapon(500, 'bullet');
  //The 'rgblaser.png' is a Sprite Sheet with 80 frames in it (each 4x4 px in size)
  //  The 3rd argument tells the Weapon Plugin to advance to the next frame each time
  //  a bullet is fired, when it hits 80 it'll wrap to zero again.
  //  You can also set this via this.weapon.bulletFrameCycle = true
  enemyWeapon.setBulletFrames(0, 80, true);

  //bullets disappear when they exit frame
  enemyWeapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

  //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 50ms
  enemyWeapon.fireRate = 1000;

  enemyWeapon.trackSprite(enem, enem.width/2, 0, false);
  enem.weapon = enemyWeapon;
};

playerControlTestState.prototype.enemyHitsPlayerCheck = function(enem, plyr){
  game.physics.arcade.overlap(plyr, enem.weapon.bullets, playerControlTestState.prototype.enemyHitsPlayer, null, this);
};

playerControlTestState.prototype.playerHitsEnemyCheck = function(enem, plyr){
  game.physics.arcade.overlap(enem, this.playerWeapon.bullets, playerControlTestState.prototype.playerHitsEnemy, null, this);
};

playerControlTestState.prototype.enemyHitsPlayer = function(plyr, bull) {
   this.killPlayer();
};

playerControlTestState.prototype.playerHitsEnemy = function(enem, bull) {
  // check which group the enemy is in, and remove him from that group
};
