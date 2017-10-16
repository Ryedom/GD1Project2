/** @constructor */
// enemy types - skater, bully, football_player_left, football_player_right
let enemyGroupScript = function(){
  this.tooClose = false;  // for enemies tracking player, whether they are "too close" and should continue on a straight path
  this.enemyWeapon = null; // null unless created for that enemy type in create
  this.bulletSpeed = 500; //500
  this.fireRate = 1000; // 1000
  this.throwing = false;
  this.enemyScript = new enemyScript();
  this.testSkater = null;

};

enemyGroupScript.prototype.preload = function(){
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  game.load.spritesheet('bullet', 'assets/rgblaser.png', 4, 4);
};

enemyGroupScript.prototype.create = function(x, y, type, playerRef){
  this.skaters = game.add.group();
  this.skaters.enableBody = true;
};

enemyGroupScript.prototype.update = function(){
    // this.skaters.update();
    // if (this.testSkater !== null){
    //   this.testSkater.update();
    //   // this.skaters.forEach(function(skater){
    //   //   skater.update();
    //   // }, this, true);
    //   // console.log("update function in enemyGroupScript called");
    // }
    // else {
    // }
};

enemyGroupScript.prototype.addEnemy = function(x, y, type, playerRef){
  if (type === "skater"){
    this.testSkater = new enemyScript();
    this.testSkater.create(x, y, "skater", playerRef);
    this.skaters.add(this.testSkater);
  }
}

//killEnemy - kills the enemy - does not destroy the object!
enemyGroupScript.prototype.killEnemy = function(enem){
    enem.kill();
}

//killEnemy - kills the enemy - does not destroy the object!
enemyGroupScript.prototype.die = function(){
    this.kill();
}

enemyGroupScript.prototype.getEnemyWeapon = function(){
  return this.enemyWeapon;
}

// getAngleToPlayer - returns the angle to the player
enemyGroupScript.prototype.getAngleToPlayer = function(enem, pl_x, pl_y) {
  return Math.atan2(pl_y - enem.y, pl_x - enem.x);

}

// getDistanceFromPlayer - returns a distance (non-negative) from an enemy to a player
enemyGroupScript.prototype.getDistanceFromPlayer = function(pl_x, pl_y) {
  return Math.sqrt(Math.pow((this.enemy.x - pl_x), 2) + Math.pow((this.enemy.y - pl_y), 2));
};

// moveEnemyTowardPlayer - moves the enemy sprite towards the player
enemyGroupScript.prototype.moveEnemyTowardPlayer = function(pl_x, pl_y){
  if (this.tooClose === false){ // the enemy hasn't gotten too close
    if (this.getDistanceFromPlayer(pl_x, pl_y) > 20) { // within a certain distance, skater starts skating in a straight line
      // // find vector to player
      let angleToPlayer = this.getAngleToPlayer(pl_x, pl_y);
      // // set velocity to travel to her
      game.physics.arcade.velocityFromRotation(angleToPlayer, 200, this.enemy.body.velocity);
    }
    else { // set tooClose to true so enemy doesn't hug player
       this.tooClose = true;
    }
  }
};

// shootAtPlayer - gets the X, Y position of player and fires a bullet at it
enemyGroupScript.prototype.shootAtPlayer = function(enem, plyr_x, plyr_y){
    enem.enemyWeapon.fireAtXY(plyr_x, plyr_y);
}

enemyGroupScript.prototype.throwBalltoEachOther = function(enem){
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
enemyGroupScript.prototype.killIfOffscreen = function(obj){
   if (!(obj.visible)){
      obj.die();
  }
};

enemyGroupScript.prototype.getType = function(){
  return this.enemyType;
}

enemyGroupScript.prototype.getEnemyWeapon = function(){
  return this.enemyWeapon;
}
