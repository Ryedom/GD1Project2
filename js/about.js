let aboutState = function() {

}

aboutState.prototype.preload = function() {

}

aboutState.prototype.create = function() {
    this.titleBackground = game.add.sprite(0,0,"about_background");
}

aboutState.prototype.update = function() {
    if (game.input.activePointer.isDown) {
        game.state.start("titlemenu", Phaser.Plugin.StateTransition.Out.SlideLeft, Phaser.Plugin.StateTransition.In.SlideLeft);
    }
}