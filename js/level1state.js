//constructor. A function constructor, no less!
let level1State = function()
{
  this.playerScript = new playerScript();
  this.enemyGroupScript = new enemyGroupScript();
  this.bandMemberPowerupScript = new bandMemberPowerupScript();

  this.goalY = 20;
  this.nextState = "titlemenu";
};

//when Phaser creates an instance of this state, we want it to
level1State.prototype.preload = function()
{
  this.playerScript.preload();
  this.bandMemberPowerupScript.preload();
};

level1State.prototype.create = function()
{
    //enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // background
    game.add.sprite(0, 0, "parking_lot");
    game.add.sprite(0, 1300, "parking_lot");

    game.world.setBounds(0, 0, 750, 2000);

    //add the player
    this.playerSprite = this.playerScript.create();

    //game.physics.p2.enable(this.player);
    //game.camera.follow(this.player);

    this.bandMemberPowerupScript.create(this.playerSprite, this.playerScript);
    this.bandMemberPowerupScript.addPowerup(game.world.width/2, game.world.height/2);

    // ENEMY CREATION LOGIC
    // instantiate an enemy group script (handles enemy group logic)
    this.enemyGroupScript.create(this.playerSprite, this.playerScript);
    // create 3 skaters
    for (let i = 0; i < 3; i++){
      this.enemyGroupScript.addEnemy(i * 70 + 10, 10, "skater", this.playerSprite);
    }

    // create one bully
    this.enemyGroupScript.addEnemy(470, 100, "bully", this.playerSprite);

    // create a pair of football players
    this.enemyGroupScript.addEnemy(100, 300, "football_player_left", this.playerSprite);
    this.enemyGroupScript.addEnemy(600, 300, "football_player_right", this.playerSprite);

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
