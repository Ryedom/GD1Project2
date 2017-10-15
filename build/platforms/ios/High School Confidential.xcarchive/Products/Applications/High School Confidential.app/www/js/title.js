let titleState = function() {

}

titleState.prototype.preload = function() {
    
}

titleState.prototype.create = function() {
    this.titleBackground = game.add.sprite(0,0,"title_background");
    this.titleLogo = game.add.sprite(game.world.centerX - 256,128,"title_logo");
    this.buttons = game.add.group();
    this.texts = game.add.group();

    var playButton = game.make.button(game.world.centerX - 256, game.world.centerY - 196, "button", this.pressPlay, this, 0,1,2);
    var helpButton = game.make.button(game.world.centerX - 256, game.world.centerY + 196, "button", this.pressHelp, this, 0,1,2);

    this.buttons.add(playButton);
    this.buttons.add(helpButton);

    var style = { font: "100px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: playButton.width, align: "center" };
    var playText = game.add.text(playButton.x + (playButton.width) / 2.0, playButton.y + (playButton.height) / 2.0, "Play", style);
    var helpText = game.add.text(helpButton.x + (helpButton.width) / 2.0, helpButton.y + (helpButton.height) / 2.0, "Help", style);

    playText.anchor.set(0.5);
    helpText.anchor.set(0.5);

    this.texts.add(playText);
    this.texts.add(helpText);
}

titleState.prototype.update = function() {
    
}

titleState.prototype.pressPlay = function() {
    game.state.start("cutscene_one", FadeOut, FadeIn);
}

titleState.prototype.pressHelp = function() {
    game.state.start("help", FadeOut, FadeIn);
}