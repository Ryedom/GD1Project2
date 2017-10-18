//constructor. A function constructor, no less!
let level3State = function()
{
  this.playerScript = new playerScript();
  this.enemyGroupScript = new enemyGroupScript();
  this.bandMemberPowerupScript = new bandMemberPowerupScript();

  this.goalY = 20;
  this.nextState = "titlemenu";
};

//when Phaser creates an instance of this state, we want it to
level3State.prototype.preload = function()
{
  this.playerScript.preload();
  this.bandMemberPowerupScript.preload();
};

level3State.prototype.create = function()
{
    //enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // background
    game.world.setBounds(0, 0, 750, 12000);

    for (let i = 0; (i * 1300) < 12000; i++){
        game.add.sprite(0, i * 1300, "promgymnism");
    }

    //add the player
    this.playerSprite = this.playerScript.create();

    //game.physics.p2.enable(this.player);
    //game.camera.follow(this.player);

    this.bandMemberPowerupScript.create(this.playerSprite, this.playerScript);
    this.bandMemberPowerupScript.randomLocations(10, game.world.width, game.world.height);

    // ENEMY CREATION LOGIC
    // instantiate an enemy group script (handles enemy group logic)
    this.enemyGroupScript.create(this.playerSprite, this.playerScript, 3);

};

level3State.prototype.update = function(){
    //update the player
    this.playerScript.update();
    this.bandMemberPowerupScript.update();
    this.enemyGroupScript.update();
    if (this.playerSprite.y === 0){
      game.state.start("level1State", FadeOut, FadeIn);
    }
};

level3State.prototype.render = function() {
    // this.render();
    this.playerScript.render();
};
