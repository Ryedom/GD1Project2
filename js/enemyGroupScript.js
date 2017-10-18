/** @constructor */
// enemy types - skater, bully, football_player_left, football_player_right
let enemyGroupScript = function(){
  this.tooClose = false;  // for enemies tracking player, whether they are "too close" and should continue on a straight path
  this.enemyWeapon = null; // null unless created for that enemy type in create
  this.bulletSpeed = 500; //500
  this.fireRate = 1000; // 1000
  this.throwing = false;
  this.testSkater = null;
  this.cameraY = 0;
  this.aoeScript = new aoe();
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

  this.musicians = game.add.group();
  this.musicians.enableBody = true;
  this.aoes = game.add.group();
  this.aoes.enableBody = true;

  this.footballPlayers = game.add.group();
  this.footballPlayers.enableBody = true;

  this.enemies = game.add.group();
  this.enemies.enableBody = true;
  this.enemies.add(this.skaters);
  this.enemies.add(this.bullies);
  this.enemies.add(this.footballPlayers);
  this.enemies.add(this.musicians);

  this.bullets = game.add.group();
  this.bullets.enableBody = true;

  this.enemyTimer = game.time.create(false);
  this.enemyTimer.loop(1000, this.generateRandomEnemies, this, this.player);
  this.enemyTimer.start();
};

enemyGroupScript.prototype.update = function(){
  // Clear out enemies from groups
  this.bullies.forEachDead(function(enem){
    this.bullies.remove(enem);
  }, this, true);
  this.skaters.forEachDead(function(enem){
    this.skaters.remove(enem);
  }, this, true);
  this.footballPlayers.forEachDead(function(enem){
    this.footballPlayers.remove(enem);
  }, this, true);
  this.musicians.forEachDead(function(enem){
    this.musicians.remove(enem);
  }, this, true);
  this.aoes.forEachDead(function(enem){
    this.aoes.remove(enem);
  }, this, true);

  // Update the camera
  this.cameraY = game.camera.y;

  // COLLISION LOGIC
  // enemy bullets hit player - due to the way Phaser works, easier to just check each group, not group of groups
  this.bullies.forEach(enemyGroupScript.prototype.enemyHitsPlayerCheck, this, true, this.player);
  this.footballPlayers.forEach(enemyGroupScript.prototype.enemyHitsPlayerCheck, this, true, this.player);

  // football player passing logic
  this.footballPlayers.forEach(enemyGroupScript.prototype.checkReceptionOfFootballPlayer, this, true, this.footballPlayers);

  // enemies collide with player
  game.physics.arcade.overlap(this.player, this.skaters, enemyGroupScript.prototype.enemyHitsPlayer, null, this);
  game.physics.arcade.overlap(this.playerScript.returnBandMemberGroup(), this.skaters, enemyGroupScript.prototype.enemyHitsPlayer, null, this);
  game.physics.arcade.overlap(this.player, this.bullies, enemyGroupScript.prototype.enemyHitsPlayer, null, this);
  game.physics.arcade.overlap(this.playerScript.returnBandMemberGroup(), this.bullies, enemyGroupScript.prototype.enemyHitsPlayer, null, this);
  game.physics.arcade.overlap(this.player, this.footballPlayers, enemyGroupScript.prototype.enemyHitsPlayer, null, this);
  game.physics.arcade.overlap(this.playerScript.returnBandMemberGroup(), this.footballPlayers, enemyGroupScript.prototype.enemyHitsPlayer, null, this);
  game.physics.arcade.overlap(this.player, this.musicians, enemyGroupScript.prototype.enemyHitsPlayer, null, this);
  game.physics.arcade.overlap(this.playerScript.returnBandMemberGroup(), this.musicians, enemyGroupScript.prototype.enemyHitsPlayer, null, this);
  game.physics.arcade.overlap(this.player, this.bullets, enemyGroupScript.prototype.enemyHitsPlayer, null, this);

  // musician AOE collision logic
  if (!(game.physics.arcade.overlap(this.player, this.aoes, this.playerEntersAOE, null, this))){
    this.playerScript.shootEnabled = true;
  }
  let bandmems = this.playerScript.returnBandMemberGroup();
  bandmems.forEach(this.checkBandMemAOE, this, true, this.aoes);
  // game.physics.arcade.overlap(this.playerScript.returnBandMemberGroup(), this.aoes, this.BandMemberEntersAOE, null, this);

    //this.playerScript.bandMembers.children[i].shootEnabled = true;

  // player bullets hit enemy
  let enemWeap = this.playerScript.returnPlayerWeapon();
  game.physics.arcade.overlap(this.enemies, enemWeap.bullets, this.playerHitsEnemy, null, this);
  game.physics.arcade.overlap(this.playerScript.returnBandMemberGroup(), this.bullets, enemyGroupScript.prototype.enemyHitsPlayer, null, this);

  // kill enemies behind player
  this.bullies.forEach(this.killEnemyIfBehindPlayer, this, true);
  this.footballPlayers.forEach(this.killEnemyIfBehindPlayer, this, true);
  this.skaters.forEach(this.killEnemyIfBehindPlayer, this, true);
  this.musicians.forEach(this.killEnemyIfBehindPlayer, this, true);
};

enemyGroupScript.prototype.render = function(){
}

enemyGroupScript.prototype.killEnemyIfBehindPlayer = function(enem){
  if (enem.y > game.camera.y + game.camera.height){
    enem.die();
  }
}


enemyGroupScript.prototype.addEnemy = function(x, y, type, playerRef){
  let new_enemy = null;
  if (type === "skater"){
    new_enemy = new enemy(x, y, "skater", playerRef);
    this.skaters.add(new_enemy);
      //new_enemy.scale.x = new_enemy.scale.x * .5;
      //new_enemy.scale.y = new_enemy.scale.y * .5;
  } else if (type === "bully"){
    new_enemy = new enemy(x, y, "bully", playerRef);
    this.bullies.add(new_enemy);
  } else if (type === "football_player_left"){
    new_enemy = new enemy(x, y, "football_player_left", playerRef);
    this.footballPlayers.add(new_enemy);
  } else if (type === "football_player_right"){
    new_enemy = new enemy(x, y, "football_player_right", playerRef);
    this.footballPlayers.add(new_enemy);
  } else if (type === "musician") {
    let new_aoe = this.aoeScript.create(x, y, playerRef);
    this.aoes.add(new_aoe);
    new_enemy = new enemy(x, y, "musician", playerRef, new_aoe);
    this.musicians.add(new_enemy);
  }
}

// generates enemies at the top of the screen
enemyGroupScript.prototype.generateRandomEnemies = function(playerSprite){
  let y_value = this.cameraY;
  let enemIndex = 4;//Math.ceil(Math.random() * 4); // four different enemy types, musician not currently used!
  if (enemIndex === 1){ // skater
    this.addEnemy(Math.random() * 750, y_value, "skater", playerSprite);
  } else if (enemIndex === 2){
    this.addEnemy(Math.random() * 750, y_value, "bully", playerSprite);
  } else if (enemIndex === 3){ // 3
    this.addEnemy(50, y_value - 40, "football_player_left", playerSprite);
    this.addEnemy(700, y_value - 40, "football_player_right", playerSprite);
  } else { // 4
    let musicianIndex = Math.ceil(Math.random() * 2);
    if (musicianIndex === 1){ // left side
      this.addEnemy(100, y_value - 40, "musician", playerSprite);
    } else {
      this.addEnemy(650, y_value - 40, "musician", playerSprite);  // right
    }
  }
}

enemyGroupScript.prototype.playerHitsEnemy = function(enem, bull) {
  // copy the bullets from the enemy object - otherwise bullets pass through player when enemy dies!
  let enemWeap = enem.getEnemyWeapon();
  if (enemWeap !== null){
    this.bullets.addMultiple(enemWeap.bullets);
  }
  // kill the enemy
  enem.die();
}

enemyGroupScript.prototype.enemyInGroupHitsPlayerCheck = function(enem_group, plyr){
  enem_group.forEachAlive(enemyGroupScript.prototype.enemyHitsPlayerCheck, this, true, this.player); // this function receives a GROUP as a parameter, we need to get the individual to get their bullets
}

enemyGroupScript.prototype.enemyHitsPlayerCheck = function(enem, plyr){
  game.physics.arcade.overlap(this.player, enem.getEnemyWeapon().bullets, enemyGroupScript.prototype.enemyHitsPlayer, null, this);
  game.physics.arcade.overlap(this.playerScript.returnBandMemberGroup(), enem.getEnemyWeapon().bullets, enemyGroupScript.prototype.enemyHitsPlayer, null, this);
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

enemyGroupScript.prototype.checkAOEcollision = function(musc, plyr){
  // console.log("AOE Collision");
  game.physics.arcade.overlap(plyr, musc.musicianAreaOfEffect, enemyGroupScript.prototype.AOEcollision, null, this);
}

enemyGroupScript.prototype.playerEntersAOE = function(plyr, circle){
    this.playerScript.shootEnabled = false;
}

enemyGroupScript.prototype.checkBandMemAOE = function(mem, aoes){
  if (!(game.physics.arcade.overlap(mem, aoes, this.BandMemberEntersAOE, null, this))){
    mem.shootEnabled = true;
  }
}

enemyGroupScript.prototype.BandMemberEntersAOE = function(member, circle){
    member.shootEnabled = false;
}
