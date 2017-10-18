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
  game.load.audio('musicLevel1', 'assets/Audio/Level1.ogg');
};

level1State.prototype.create = function()
{
    //enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //background
    game.world.setBounds(0, 0, 750, 180000);

    for (let i = 0; (i * 1300) < 180000; i++){
        game.add.sprite(0, i * 1300, "parking_lot");
    }

    //add the player
    this.playerSprite = this.playerScript.create();

    this.bandMemberPowerupScript.create(this.playerSprite, this.playerScript);
    this.bandMemberPowerupScript.addPowerup(game.world.width/2, game.world.height - 1000);
    this.bandMemberPowerupScript.addPowerup(game.world.width/2, game.world.height - 2000);

    // Music
    this.music = game.add.audio('musicLevel1');
    this.music.play();
    this.music.onStop.add(function() {
        this.music.play("",1.8);
    },this);

    // ENEMY CREATION LOGIC
    // instantiate an enemy group script (handles enemy group logic)
    // enemies are generated based on a timer
    this.enemyGroupScript.create(this.playerSprite, this.playerScript, 3);
};

level1State.prototype.update = function() {
    //update the player
    this.playerScript.update();
    this.bandMemberPowerupScript.update();
    this.enemyGroupScript.update();
    if (this.playerSprite.y === 0){
      game.state.start("cutscene_two", FadeOut, FadeIn);
    }

};

level1State.prototype.render = function() {
    // this.render();
    this.playerScript.render();
    this.enemyGroupScript.render();
};

level1State.prototype.shutdown = function() {
    this.music.onStop.removeAll();
    this.music.stop();
}
