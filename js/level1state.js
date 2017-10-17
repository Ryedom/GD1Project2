//constructor. A function constructor, no less!
let level1State = function()
{
  this.playerScript = new playerScript();
  this.enemyGroupScript = new enemyGroupScript();
  this.bandMemberPowerupScript = new bandMemberPowerupScript();
};

//when Phaser creates an instance of this state, we want it to
level1State.prototype.preload = function()
{
  this.playerScript.preload();
  this.bandMemberPowerupScript.preload();
};

level1State.prototype.create = function()
{
    // Set the world bounds (changed by the cutscene)
    game.world.setBounds(0,0,750,1334);
    // background
    game.add.sprite(0, 0, "parking_lot");

    //enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //add the player
    this.player = this.playerScript.create();

    this.bandMemberPowerupScript.create(this.player, this.playerScript);
    this.bandMemberPowerupScript.addPowerup(game.world.width/2, game.world.height/2);

    // ENEMY CREATION LOGIC
    // instantiate an enemy group script (handles enemy group logic)
    this.enemyGroupScript.create(this.player, this.playerScript);
    // create 3 skaters
    for (let i = 0; i < 3; i++){
      this.enemyGroupScript.addEnemy(i * 70 + 10, 10, "skater", this.player);
    }

    // create one bully
    this.enemyGroupScript.addEnemy(470, 100, "bully", this.player);

    // create a pair of football players
    this.enemyGroupScript.addEnemy(100, 300, "football_player_left", this.player);
    this.enemyGroupScript.addEnemy(600, 300, "football_player_right", this.player);

};

level1State.prototype.update = function(){
    //update the player
    this.playerScript.update();
    this.bandMemberPowerupScript.update();
    this.enemyGroupScript.update();
};

level1State.prototype.render = function() {
    // this.render();
    this.playerScript.render();
};
