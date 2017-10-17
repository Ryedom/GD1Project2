/** @constructor */
// enemy types - skater, bully, football_player_left, football_player_right
enemy = function(x, y, type, playerRef){

    // call super constructor on sprite
    Phaser.Sprite.call(this, game, x, y, 'dude');

    // additional data
    this.playerRef = playerRef; // reference to player object
    this.enemyType = type; // the type of enemy
    this.tooClose = false;  // for enemies tracking player, whether they are "too close" and should continue on a straight path

    this.enemyWeapon = null; // null unless created for that enemy type in create
    this.bulletSpeed = 500; //500
    this.fireRate = 1000; // 1000
    this.throwing = false;
    this.checkCollision = true;
    game.add.existing(this);

    //  We need to enable physics on the this.enemy
    game.physics.arcade.enable(this);

    if (this.enemyType === "football_player_left"){ // left football player always starts throwing, right doesn't
      this.throwing = true;
    }

    // Weapon - Optional for shooting enemies
    if ((this.enemyType === "bully") || (this.enemyType === "football_player_left") || (this.enemyType === "football_player_right")){

      // //add weapon if a shooting character
      this.enemyWeapon = game.add.weapon(500, 'bullet');

      //The 'rgblaser.png' is a Sprite Sheet with 80 frames in it (each 4x4 px in size)
      //  The 3rd argument tells the Weapon Plugin to advance to the next frame each time
      //  a bullet is fired, when it hits 80 it'll wrap to zero again.
      //  You can also set this via this.weapon.bulletFrameCycle = true
      this.enemyWeapon.setBulletFrames(0, 80, true);

      //if bully, bullets disappear when they exit frame, bullies when they hit the world, since they spawn offscreen
      if (this.enemyType === "bully"){
        this.enemyWeapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
      } else if ((this.enemyType === "football_player_left") || (this.enemyType === "football_player_right")){
        this.enemyWeapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
      }

      //  The speed at which the bullet is fired
      this.enemyWeapon.bulletSpeed = this.bulletSpeed;

      //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 50ms
      this.enemyWeapon.fireRate = this.fireRate;

      //  Weapon tracks player
      //  X offset equal to half the player's width (so it fires from the center)
      //  no Y offset
      //  'false' argument tells the weapon not to track player rotation (will always shoot up)
      this.enemyWeapon.trackSprite(this, this.width/2, 0, false);
      //END WEAPON----------------------------------------------------------------------
    }
};

enemy.prototype = Object.create(Phaser.Sprite.prototype);
enemy.prototype.constructor = enemy;


enemy.prototype.preload = function(){
};

enemy.prototype.create = function(){
};

enemy.prototype.update = function(){
    if (this.alive){
      if (this.enemyType === "skater"){
        // skaters move towards player
        if (this.visible){
          enemy.prototype.moveEnemyTowardPlayer(this, this.playerRef.x, this.playerRef.y);
        }
      } else if (this.enemyType === "bully"){
      //   // bullies remain stationary but shoot towards player
        if (this.visible){
            enemy.prototype.shootAtPlayer(this, this.playerRef.x, this.playerRef.y);
        }
      } else if ((this.enemyType === "football_player_left") || (this.enemyType === "football_player_right")){
        enemy.prototype.throwBalltoEachOther(this);
      }
      // destroy offscreen enemies to speed things up
      enemy.prototype.killIfOffscreen(this);
    }

};

//killEnemy - kills the enemy - does not destroy the object!
enemy.prototype.killEnemy = function(enem){
    enem.kill();
}

//killEnemy - kills the enemy - does not destroy the object!
enemy.prototype.die = function(){
    this.kill();
}

enemy.prototype.getEnemyWeapon = function(){
  return this.enemyWeapon;
}

// getAngleToPlayer - returns the angle to the player
enemy.prototype.getAngleToPlayer = function(enem, pl_x, pl_y) {
  return Math.atan2(pl_y - enem.y, pl_x - enem.x);

}

// getDistanceFromPlayer - returns a distance (non-negative) from an enemy to a player
enemy.prototype.getDistanceFromPlayer = function(enem, pl_x, pl_y) {
  return Math.sqrt(Math.pow((enem.x - pl_x), 2) + Math.pow((enem.y - pl_y), 2));
};

// moveEnemyTowardPlayer - moves the enemy sprite towards the player
enemy.prototype.moveEnemyTowardPlayer = function(enem, pl_x, pl_y){
  if (enem.tooClose === false){ // the enemy hasn't gotten too close
    if (enemy.prototype.getDistanceFromPlayer(enem, pl_x, pl_y) > 20) { // within a certain distance, skater starts skating in a straight line
      // // find vector to player
      let angleToPlayer = enemy.prototype.getAngleToPlayer(enem, pl_x, pl_y);
      // // set velocity to travel to her
      game.physics.arcade.velocityFromRotation(angleToPlayer, 200, enem.body.velocity);
    }
    else { // set tooClose to true so enemy doesn't hug player
       enem.tooClose = true;
    }
  }
};

// shootAtPlayer - gets the X, Y position of player and fires a bullet at it
enemy.prototype.shootAtPlayer = function(enem, plyr_x, plyr_y){
    enem.enemyWeapon.fireAtXY(plyr_x + 105, plyr_y);
}

enemy.prototype.throwBalltoEachOther = function(enem){
  if (enem.throwing === true) { // player is supposed to immediately throw
    if (enem.enemyType === "football_player_left") { // should throw right
      enem.enemyWeapon.fireAtXY(750, enem.y);
    } else { // should throw left
      enem.enemyWeapon.fireAtXY(0, enem.y);
    }
    enem.throwing = false; // while ball is in the air, don't throw anything else!
  }
}

// killIfOffscreen - kills offscreen enemies
enemy.prototype.killIfOffscreen = function(obj){
   if (!(obj.visible)){
      obj.die();
  }
};

enemy.prototype.getType = function(){
  return this.enemyType;
}

enemy.prototype.getEnemyWeapon = function(){
  return this.enemyWeapon;
}
