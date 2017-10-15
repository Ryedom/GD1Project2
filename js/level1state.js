//constructor. A function constructor, no less!
let level1State = function()
{

};

//when Phaser creates an instance of this state, we want it to
level1State.prototype.preload = function()
{

};

level1State.prototype.create = function()
{
    //enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //add the player
    this.player = new player(game);

    // ENEMY CREATION LOGIC

    // create the groups of enemies
    // skaters
    this.skaters = game.add.group();
    this.skaters.enableBody = true;
    //
    // bullies
    this.bullies = game.add.group();
    this.bullies.enableBody = true;

    //  create 3 skaters
    for (let i = 0; i < 3; i++){
      let temp_skater = new enemy(i * 70 + 10, 10, game, "skater", this.player);
      this.skaters.add(temp_skater);
    }

    // create a bully
    for (let i = 0; i < 1; i++){
    let bully = new enemy(i * 70 + 400, 100, game, "bully", this.player);
      this.bullies.add(bully);
    }

    // create a master enemy group
    this.enemies = game.add.group();
    this.enemies.enableBody = true;
    this.enemies.add(this.skaters);
    this.enemies.add(this.bullies);

};

level1State.prototype.addBulletsToGroup = function(enem, bullet_group){
  bullet_group.add(enem.enemyWeapon.bullets);
}

level1State.prototype.update = function(){
    // COLLISION LOGIC
    // enemy bullets hit player - due to the way Phaser works, easier to just check each group, not group of groups
    this.bullies.forEach(level1State.prototype.enemyHitsPlayerCheck, this, true, this.player);

    // enemies collide with player
    game.physics.arcade.overlap(this.player, this.skaters, level1State.prototype.enemyHitsPlayer, null, this);

    // player bullets hit enemy
    // game.physics.arcade.overlap(this.enemies, this.player.playerWeapon.bullets, level1State.prototype.playerHitsEnemy, null, this);
};

level1State.prototype.render = function() {
    // this.render();
};

level1State.prototype.playerHitsEnemy = function(enem, bull) {
  enem.die();
}

level1State.prototype.enemyInGroupHitsPlayerCheck = function(enem_group, plyr){
  enem_group.forEachAlive(level1State.prototype.enemyHitsPlayerCheck, this, true, this.player); // this function receives a GROUP as a parameter, we need to get the individual to get their bullets
}

level1State.prototype.enemyHitsPlayerCheck = function(enem, plyr){
  console.log(enem.getType());
  console.log(enem.getEnemyWeapon().bullets.length);
  game.physics.arcade.overlap(this.player, enem.getEnemyWeapon().bullets, level1State.prototype.enemyHitsPlayer, null, this);
}

level1State.prototype.enemyHitsPlayer = function(plyr, bull){
  this.player.damagePlayer();
  bull.kill(); // kill the bullet too, or else it will keep damaging you each frame
}
