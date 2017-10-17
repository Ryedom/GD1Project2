//constructor. A function constructor, no less!
let level2State = function()
{
  this.playerScript = new playerScript();
  this.enemyGroupScript = new enemyGroupScript();
  this.bandMemberPowerupScript = new bandMemberPowerupScript();

  this.goalY = 20;
  this.nextState = "titlemenu";
};

//when Phaser creates an instance of this state, we want it to
level2State.prototype.preload = function()
{
  this.playerScript.preload();
  this.bandMemberPowerupScript.preload();
};

level2State.prototype.create = function()
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
    this.bandMemberPowerupScript.addPowerup(300, 1500);
    this.bandMemberPowerupScript.addPowerup(300, 1500);
    this.bandMemberPowerupScript.addPowerup(300, 1500);
    this.bandMemberPowerupScript.addPowerup(300, 1500);

    // ENEMY CREATION LOGIC
    // instantiate an enemy group script (handles enemy group logic)
    this.enemyGroupScript.create(this.playerSprite, this.playerScript);
    // create 3 skaters
    for (let i = 0; i < 3; i++){
      this.enemyGroupScript.addEnemy(i * 70 + 10, 10, "skater", this.playerSprite);
    }

    // create one bully
    this.enemyGroupScript.addEnemy(325, 1000, "bully", this.playerSprite);

    // create a pair of football players
    this.enemyGroupScript.addEnemy(100, 300, "football_player_left", this.playerSprite);
    this.enemyGroupScript.addEnemy(600, 300, "football_player_right", this.playerSprite);

};

level2State.prototype.update = function(){
    //update the player
    this.playerScript.update();
    this.bandMemberPowerupScript.update();
    this.enemyGroupScript.update();
    if (this.playerSprite.y === 0){
      game.state.start("cutscene_three", FadeOut, FadeIn);
    }
};

level2State.prototype.render = function() {
    // this.render();
    this.playerScript.render();
};
