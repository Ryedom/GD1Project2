// constructor. A function constructor, no less!
let gameplayState = function(){
  var shootTimer;
  var shootBool;
}

gameplayState.prototype.preload = function(){

}

gameplayState.prototype.create = function(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  // add empty group to hold our platforms
  this.platforms = game.add.group();
  // enable physics on any object added to this group
  this.platforms.enableBody = true;

  let ground = this.platforms.create(0, game.world.height - 64, "platform");
  ground.scale.setTo(2,2);
  ground.body.immovable = true;

  let plat = this.platforms.create(400, 400, "platform");
  plat.body.immovable = true;

  plat = this.platforms.create(-150, 250, "platform");
  plat.body.immovable = true;

  // timer logic to control shooting
  shootTimer = game.time.create(false); // empty timer
  shootBool = true; // enemies can shoot
  shootTimer.loop(1000, gameplayState.prototype.reenableShootBool, this); // fire a shot every second, this timer loops
  shootTimer.start();

  var Enemy = function(x_spawn, y_spawn, type, id) {
    // public fields
    this.type = type;
    this.sprite = game.add.sprite(x_spawn, y_spawn, id);

  };
  // create the groups of enemies
  // skaters
  this.skaters = game.add.group();
  this.skaters.enableBody = true;

  // bullies
  this.bullies = game.add.group();
  this.bullies.enableBody = true;


  //  create 3 skaters
  // for (let i = 0; i < 3; i++){
  //   //let en = new Enemy(i * 70, 10, "skater", "shrek");
  //   this.skaters.create(i * 70 + 10, 10, "shrek");
  // }
  //
  // this.skaters.forEach(function(enem){
  //   enem.tooClose = false; // used for preventing sprite from "hugging" player
  // }, this, true);

  // create a bully
  for (let i = 0; i < 1; i++){
    this.bullies.create(i * 70 + 400, 10, "shrek");
  }

  // Player
  this.player = game.add.sprite(30, 400, "shrek");
  game.physics.arcade.enable(this.player);
  this.player.body.gravity.y = 300;
  this.player.body.collideWorldBounds = true;

  this.player.animations.add("left", [0, 1, 2, 3], 10, true);
  this.player.animations.add("right", [5, 6, 7, 8], 10, true);

  this.spitballs = game.add.group();
  this.spitballs.enableBody = true;

  /*
  // STARS
  this.stars = game.add.group();
  this.stars.enableBody = true;
  // create 12 stars
  for (let i = 0; i < 12; i++){
    let star = this.stars.create(i * 70, 0, "star");
    star.body.gravity.y = 200;
    star.body.bounce.y = Math.random() * 0.3 + 0.3;
  }
  // SCORE
  this.scoreText = game.add.text(16,16, "Score: 0");
  this.score = 0;
  */
  // CONTROLS
  this.cursors = game.input.keyboard.createCursorKeys();
}

gameplayState.prototype.getAngleToPlayer = function(enem, plyr) {
  return Math.atan2(plyr.y - enem.y, plyr.x - enem.x);

}

// returns a distance (non-negative) from an enemy to a player
gameplayState.prototype.getDistanceFromPlayer = function(enem, plyr) {
  return Math.sqrt(Math.pow((enem.x - plyr.x), 2) + Math.pow((enem.y - plyr.y), 2));
};

gameplayState.prototype.moveEnemiesTowardPlayer = function(enem, plyr){
  if (enem.tooClose === false){ // the enemy hasn't gotten too close
    if (gameplayState.prototype.getDistanceFromPlayer(enem, plyr) > 20) { // within a certain distance, skater starts skating in a straight line
      // find vector to player
      var angleToPlayer = gameplayState.prototype.getAngleToPlayer(enem, plyr);
      // set velocity to travel to her
      game.physics.arcade.velocityFromRotation(angleToPlayer, 200, enem.body.velocity);
    }
    else { // set tooClose to true so enemy doesn't hug player
        enem.tooClose = true;
    }
  }
};

gameplayState.prototype.shootAtPlayer = function(enem, plyr){
  if (shootBool) { // only if shooting is enabled
    // find vector to player
    var angleToPlayer = gameplayState.prototype.getAngleToPlayer(enem, plyr);
    // create a spitball
    var spitball = game.add.sprite(enem.x, enem.y, "star");
    game.physics.arcade.enable(spitball, Phaser.Physics.Arcade);
    // shoot toward player
    game.physics.arcade.velocityFromRotation(angleToPlayer, 400, spitball.body.velocity);
    this.spitballs.add(spitball);
  }
}

gameplayState.prototype.destroyIfOffscreen = function(obj){
  if (!(obj.visible)){
    obj.destroy();
  }
};

gameplayState.prototype.reenableShootBool = function(){
  shootBool = true;
};

gameplayState.prototype.update = function(){

  // ENEMY UPDATES
  // skaters move towards player
  this.skaters.forEach(gameplayState.prototype.moveEnemiesTowardPlayer, this, true, this.player);

  // bullies remain stationary but shoot towards player
  this.bullies.forEach(gameplayState.prototype.shootAtPlayer, this, true, this.player);

  // Shoot logic
  // if shootBool is true - we have shot - turn shootBool off
  if (shootBool) {
    shootBool = false;
  }

  // clear offscreen objects
  this.skaters.forEach(gameplayState.prototype.destroyIfOffscreen, this, true);
  this.bullies.forEach(gameplayState.prototype.destroyIfOffscreen, this, true);
  this.spitballs.forEach(gameplayState.prototype.destroyIfOffscreen, this, true);

  // Collision Logic
  game.physics.arcade.collide(this.player, this.platforms);
  //game.physics.arcade.collide(this.stars, this.platforms);
  //game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);

  // reset horizontal movement
  this.player.body.velocity.x = 0;

  if (this.cursors.left.isDown) {
    this.player.animations.play("left");
    this.player.body.velocity.x = -150;
  }
  else if (this.cursors.right.isDown) {
    this.player.animations.play("right");
    this.player.body.velocity.x = 150;
  }
  else {
    this.player.animations.stop();
    this.player.frame = 4;
  }
  if (this.cursors.up.isDown && this.player.body.touching.down){
    this.player.body.velocity.y = -300;
  }
}
/*
gameplayState.prototype.collectStar = function(player, star){
  star.kill();
  this.score += 10;
  this.scoreText.text = "Score: " + this.score;
}*/
