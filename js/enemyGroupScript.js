/** @constructor */
// enemy types - skater, bully, football_player_left, football_player_right
let enemyGroupScript = function(){
  this.tooClose = false;  // for enemies tracking player, whether they are "too close" and should continue on a straight path
  this.enemyWeapon = null; // null unless created for that enemy type in create

  this.throwing = false;
  this.testSkater = null;
  this.cameraY = 0;
  this.aoeScript = new aoe();

  this.enemySpawnDelay = 1500;
};

enemyGroupScript.prototype.preload = function(){
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  game.load.spritesheet('bullet', 'assets/rgblaser.png', 4, 4);
};

enemyGroupScript.prototype.create = function(playerRef, playerScript, level){
  this.player = playerRef;
  this.playerScript = playerScript;
  this.level = level;

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

  this.teachers = game.add.group();
  this.teachers.enableBody = true;

  this.teacherAOEs = game.add.group();
  this.teacherAOEs.enableBody = true;

  this.enemies = game.add.group();
  this.enemies.enableBody = true;
  this.enemies.add(this.skaters);
  this.enemies.add(this.bullies);
  this.enemies.add(this.footballPlayers);
  this.enemies.add(this.musicians);

  this.bullets = game.add.group();
  this.bullets.enableBody = true;

  this.enemyTimer = game.time.create(false);
  this.enemyTimer.loop(this.enemySpawnDelay, this.generateRandomEnemies, this, this.player, level);
  this.enemyTimer.start();
};

enemyGroupScript.prototype.update = function(){
  let playWeap = this.playerScript.returnPlayerWeapon();
  // Update the camera
  this.cameraY = game.camera.y;

  // we can optimize based on level!

  // BULLIES
  // bullies are in every level
  if (this.bullies.length > 0) {
    // Remove dead enemies
    this.bullies.forEachDead(function(enem){
      this.bullies.remove(enem);
      enem.destroy();
    }, this, true);

    // Enemy shoots player
    this.bullies.forEach(enemyGroupScript.prototype.enemyHitsPlayerCheck, this, true, this.player);

    // Collision
    game.physics.arcade.overlap(this.player, this.bullies, enemyGroupScript.prototype.enemyHitsPlayer, null, this);
    game.physics.arcade.overlap(this.playerScript.returnBandMemberGroup(), this.bullies, enemyGroupScript.prototype.enemyHitsPlayer, null, this);

    // Kill Offscreen Bullies
    this.bullies.forEach(this.killEnemyIfBehindPlayer, this, true);
  }

  // END BULLIES


  if (this.level === 1){
    // SKATERS
    if (this.skaters.length > 0){
      // Remove dead enemies
      this.skaters.forEachDead(function(enem){
        this.skaters.remove(enem);
      }, this, true);

      // Collision
      game.physics.arcade.overlap(this.player, this.skaters, enemyGroupScript.prototype.enemyHitsPlayer, null, this);
      game.physics.arcade.overlap(this.playerScript.returnBandMemberGroup(), this.skaters, enemyGroupScript.prototype.enemyHitsPlayer, null, this);

      // Kill Offscreen Skaters
      this.skaters.forEach(this.killEnemyIfBehindPlayer, this, true);
    }
    // END SKATERS
  }

  // FOOTBALL PLAYERS
  if ((this.level === 1) || (this.level === 2)) {
    if (this.footballPlayers.length > 0){
      // Remove dead enemies
      this.footballPlayers.forEachDead(function(enem){
        this.footballPlayers.remove(enem);
      }, this, true);

      // Enemy shoots player
      this.footballPlayers.forEach(enemyGroupScript.prototype.enemyHitsPlayerCheck, this, true, this.player);

      // Enemy passes football logic
      this.footballPlayers.forEach(enemyGroupScript.prototype.checkReceptionOfFootballPlayer, this, true, this.footballPlayers);

      // Collision
      game.physics.arcade.overlap(this.player, this.footballPlayers, enemyGroupScript.prototype.enemyHitsPlayer, null, this);
      game.physics.arcade.overlap(this.playerScript.returnBandMemberGroup(), this.footballPlayers, enemyGroupScript.prototype.enemyHitsPlayer, null, this);

      // Kill Offscreen Football Players
      this.footballPlayers.forEach(this.killEnemyIfBehindPlayer, this, true);
    }
  }
  // END FOOTBALL PLAYERS

  if ((this.level === 2) || (this.level === 3)){
    // MUSICIANS
    if (this.musicians.length > 0){

      // Remove dead enemies
      this.musicians.forEachDead(function(enem){
        this.musicians.remove(enem);
      }, this, true);

      this.aoes.forEachDead(function(enem){
        this.aoes.remove(enem);
      }, this, true);

      // Collision
      game.physics.arcade.overlap(this.player, this.musicians, enemyGroupScript.prototype.enemyHitsPlayer, null, this);
      game.physics.arcade.overlap(this.playerScript.returnBandMemberGroup(), this.musicians, enemyGroupScript.prototype.enemyHitsPlayer, null, this);

      // musician AOE collision logic
      if (!(game.physics.arcade.overlap(this.player, this.aoes, this.playerEntersAOE, null, this))){
        this.playerScript.shootEnabled = true;
      }
      let bandmems = this.playerScript.returnBandMemberGroup();
      bandmems.forEach(this.checkBandMemAOE, this, true, this.aoes);

      // Kill offscreen musicians
      this.musicians.forEach(this.killEnemyIfBehindPlayer, this, true);
    }

  }

  if (this.level === 3) {
    if (this.teachers.length > 0) {

      // Remove dead enemies
      this.teachers.forEachDead(function(enem){
        this.teachers.remove(enem);
      }, this, true);

      this.teacherAOEs.forEachDead(function(enem){
        this.teacherAOEs.remove(enem);
      }, this, true);

      // Collision logic
      game.physics.arcade.overlap(this.player, this.teachers, enemyGroupScript.prototype.enemyHitsPlayer, null, this);
      game.physics.arcade.overlap(this.playerScript.returnBandMemberGroup(), this.teachers, enemyGroupScript.prototype.enemyHitsPlayer, null, this);
      game.physics.arcade.overlap(this.player, this.teacherAOEs, this.playerEntersTeacherAOE, null, this);
      game.physics.arcade.overlap(this.playerScript.returnBandMemberGroup(), this.teacherAOEs, this.playerEntersTeacherAOE, null, this);

      // player bullets hit teacher
      game.physics.arcade.overlap(this.teachers, playWeap.bullets, this.playerHitsTeacher, null, this);

      // Kill offscreen teachers
      this.teachers.forEach(this.killEnemyIfBehindPlayer, this, true);
    }
  }

  // Bullets unattached to an enemy (an enemy dies, his bullets are stored in this.bullets)
  if (this.bullets.length > 0){
    game.physics.arcade.overlap(this.player, this.bullets, enemyGroupScript.prototype.enemyHitsPlayer, null, this);
    game.physics.arcade.overlap(this.playerScript.returnBandMemberGroup(), this.bullets, enemyGroupScript.prototype.enemyHitsPlayer, null, this);
  }

  // player bullets hit enemy
  if (this.enemies.length > 0){
    game.physics.arcade.overlap(this.enemies, playWeap.bullets, this.playerHitsEnemy, null, this);
  }
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
  } else if (type === "teacher") {
      let new_aoe = this.aoeScript.create(x, y, playerRef);
      this.teacherAOEs.add(new_aoe);
      new_enemy = new enemy(x, y, "teacher", playerRef, new_aoe);
      this.teachers.add(new_enemy);
  }

  new_enemy.body.setSize(105, 210, 45, 0);

}

// generates enemies at the top of the screen
enemyGroupScript.prototype.generateRandomEnemies = function(playerSprite, level){

  //don't spawn enemies while the player is in a place where screen can no longer scroll (end of level)
  if(playerSprite.y <= game.camera.height){
    return;
  }

  let y_value = this.cameraY;

  //get x value such that enemies do not spawn near path of player bullets
  let x_value = Math.random() * game.world.width/2;
  if(playerSprite.x < game.world.width/2){
      x_value = x_value + game.world.width/2;
  }

  if (level === 1){
    let enemIndex = Math.ceil(Math.random() * 3); // four different enemy types, musician not currently used!
    if (enemIndex === 1){ // skater
      this.addEnemy(x_value, y_value, "skater", playerSprite);
    } else if (enemIndex === 2){
      this.addEnemy(x_value, y_value, "bully", playerSprite);
    } else {// 3
      this.addEnemy(50, y_value - 40, "football_player_left", playerSprite);
      this.addEnemy(650, y_value - 40, "football_player_right", playerSprite);
    }
  } else if (level === 2){
    let enemIndex = Math.ceil(Math.random() * 3); // four different enemy types, musician not currently used!
    if (enemIndex === 1){ // skater
      this.addEnemy(x_value, y_value, "bully", playerSprite);
    } else if (enemIndex === 2){ // 3
      this.addEnemy(50, y_value - 40, "football_player_left", playerSprite);
      this.addEnemy(650, y_value - 40, "football_player_right", playerSprite);
    } else { // 3
      let musicianIndex = Math.ceil(Math.random() * 2);
      if (musicianIndex === 1){ // left side
        this.addEnemy(x_value, y_value - 40, "musician", playerSprite);
      } else {
        this.addEnemy(x_value, y_value - 40, "musician", playerSprite);  // right
      }
    }
  } else { // level 3
    let enemIndex = Math.ceil(Math.random() * 3); // four different enemy types, musician not currently used!
    if (enemIndex === 1){ // skater
      this.addEnemy(x_value, y_value, "bully", playerSprite);
    } else if (enemIndex === 2){ // 2
      let musicianIndex = Math.ceil(Math.random() * 2);
      if (musicianIndex === 1){ // left side
        this.addEnemy(x_value, y_value - 40, "musician", playerSprite);
      } else {
        this.addEnemy(x_value, y_value - 40, "musician", playerSprite);  // right
      }
    } else {
      this.addEnemy(x_value, y_value, "teacher", playerSprite);
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

enemyGroupScript.prototype.playerHitsTeacher = function(tchr, bull) {
  tchr.activate();
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

enemyGroupScript.prototype.playerEntersTeacherAOE = function(plyr, tch_aoe){
  if (tch_aoe.harmful === true){
    aoe.prototype.deactivate(tch_aoe);
    this.playerScript.damagePlayer();
  }
}
