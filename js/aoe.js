/** @constructor */
let aoe = function(){

};

aoe.prototype.create = function(x, y, playerRef){
  this.aoe = game.add.sprite(x, y, 'aoe');
  game.physics.arcade.enable(this.aoe);
  this.playerRef = playerRef; // reference to player object

  //  We need to enable physics on the this
  game.physics.arcade.enable(this.aoe);
  this.aoe.anchor.setTo(0.5, 0.5);
  this.aoe.scale.setTo(1.5, 1.5);
  this.aoe.alpha = 0.1;
  // temp_aoe.anchor.setTo(0.5, 0.5);
  // this.children.anchor.setTo(0.5, 0.5);
  this.aoe.body.setCircle(150);

  return this.aoe;
};
aoe.prototype.update = function(){

}
aoe.prototype.die = function(){
    this.aoe.kill();
}

aoe.prototype.render = function(){
    // game.debug.body(this.aoe);
}
