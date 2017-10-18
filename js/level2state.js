// References used: https://phaser.io/docs/2.6.2/index
//                  https://phaser.io/examples
//constructor. A function constructor, no less!
let level2State = function() {
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
  game.load.audio('musicLevel2', ['assets/Audio/Level2.ogg','assets/Audio/Level2.mp3']);
};

level2State.prototype.create = function()
{
    //enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // background
    game.world.setBounds(0, 0, 750, 12000);

    for (let i = 0; (i * 2662) < 12000; i++) {
      if (i % 2 == 0) {
          game.add.sprite(0, i * 2662, "hallway2");
      } else {
          game.add.sprite(0, i * 2662, "hallway1");
      }
  }

    //add the player
    this.playerSprite = this.playerScript.create();

    //game.physics.p2.enable(this.player);
    //game.camera.follow(this.player);

    this.bandMemberPowerupScript.create(this.playerSprite, this.playerScript);
    this.bandMemberPowerupScript.spreadOut(7, game.world.width, game.world.height/14);

    // Music
    this.music = game.add.audio('musicLevel2');
    this.music.loopFull();

    // ENEMY CREATION LOGIC
    // instantiate an enemy group script (handles enemy group logic)
    this.enemyGroupScript.create(this.playerSprite, this.playerScript, 2);

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

level2State.prototype.shutdown = function() {
  this.music.stop();
}
