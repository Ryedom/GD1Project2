/** @constructor */
// enemy types - skater, bully, football_player_left, football_player_right
let enemyGroupScript = function(){
  this.tooClose = false;  // for enemies tracking player, whether they are "too close" and should continue on a straight path
  this.enemyWeapon = null; // null unless created for that enemy type in create
  this.bulletSpeed = 500; //500
  this.fireRate = 1000; // 1000
  this.throwing = false;
  this.testSkater = null;

};

enemyGroupScript.prototype.preload = function(){
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  game.load.spritesheet('bullet', 'assets/rgblaser.png', 4, 4);
};

enemyGroupScript.prototype.create = function(playerRef, playerScript){
  this.player = playerRef;
  this.playerScript = playerScript;

  this.skaters = game.add.group();
  this.skaters.enableBody = true;

  this.bullies = game.add.group();
  this.bullies.enableBody = true;

  this.footballPlayers = game.add.group();
  this.footballPlayers.enableBody = true;
};

enemyGroupScript.prototype.update = function(){
  // COLLISION LOGIC
  // enemy bullets hit player - due to the way Phaser works, easier to just check each group, not group of groups
  this.bullies.forEach(enemyGroupScript.prototype.enemyHitsPlayerCheck, this, true, this.player);
  this.footballPlayers.forEach(enemyGroupScript.prototype.enemyHitsPlayerCheck, this, true, this.player);

  // football player passing logic
  this.footballPlayers.forEach(enemyGroupScript.prototype.checkReceptionOfFootballPlayer, this, true, this.footballPlayers);

  // enemies collide with player
  game.physics.arcade.overlap(this.player, this.skaters, enemyGroupScript.prototype.enemyHitsPlayer, null, this);
  game.physics.arcade.overlap(this.player, this.bullies, enemyGroupScript.prototype.enemyHitsPlayer, null, this);
  game.physics.arcade.overlap(this.player, this.footballPlayers, enemyGroupScript.prototype.enemyHitsPlayer, null, this);

  // player bullets hit enemy
  let enemWeap = this.playerScript.returnPlayerWeapon();
  game.physics.arcade.overlap(this.enemies, enemWeap.bullets, enemyGroupScript.prototype.playerHitsEnemy, null, this);
};

enemyGroupScript.prototype.addEnemy = function(x, y, type, playerRef){
  var new_enemy = null;
  if (type === "skater"){
    new_enemy = new enemy(x, y, "skater", playerRef);
    this.skaters.add(new_enemy);
  } else if (type === "bully"){
    new_enemy = new enemy(x, y, "bully", playerRef);
    this.bullies.add(new_enemy);
  } else if (type === "football_player_left"){
    new_enemy = new enemy(x, y, "football_player_left", playerRef);
    this.footballPlayers.add(new_enemy);
  } else if (type === "football_player_right"){
    new_enemy = new enemy(x, y, "football_player_right", playerRef);
    this.footballPlayers.add(new_enemy);

    // create a master enemy group
    this.enemies = game.add.group();
    this.enemies.enableBody = true;
    this.enemies.add(this.skaters);
    this.enemies.add(this.bullies);
    this.enemies.add(this.footballPlayers);
  }
}


enemyGroupScript.prototype.playerHitsEnemy = function(enem, bull) {
  enem.die();
}

enemyGroupScript.prototype.enemyInGroupHitsPlayerCheck = function(enem_group, plyr){
  enem_group.forEachAlive(enemyGroupScript.prototype.enemyHitsPlayerCheck, this, true, this.player); // this function receives a GROUP as a parameter, we need to get the individual to get their bullets
}

enemyGroupScript.prototype.enemyHitsPlayerCheck = function(enem, plyr){
  game.physics.arcade.overlap(this.player, enem.getEnemyWeapon().bullets, enemyGroupScript.prototype.enemyHitsPlayer, null, this);
}

enemyGroupScript.prototype.enemyHitsPlayer = function(plyr, bull){
  this.playerScript.damagePlayer();
  bull.kill(); // kill the bullet too, or else it will keep damaging you each frame
}

enemyGroupScript.prototype.checkReceptionOfFootballPlayer = function(foot_plyr, foot_plyrs){
  foot_plyrs.forEach(enemyGroupScript.prototype.throwerHitsCatcherCheck, this, true, foot_plyr);
}

enemyGroupScript.prototype.throwerHitsCatcherCheck = function(foot_plyr1, foot_plyr2){
  if (foot_plyr1 != foot_plyr2){
    game.physics.arcade.overlap(foot_plyr1, foot_plyr2.getEnemyWeapon().bullets, enemyGroupScript.prototype.catchBall, null, this);
  }

}

enemyGroupScript.prototype.catchBall = function(ft_ply, bull){
  bull.kill();
  ft_ply.throwing = true;
}
