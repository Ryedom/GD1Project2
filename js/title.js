let titleState = function() {

}

titleState.prototype.preload = function() {

}

titleState.prototype.create = function() {
    game.world.setBounds(0,0,750,1334);
    this.titleBackground = game.add.sprite(0,0,"title_background");
    this.titleLogo = game.add.sprite(game.world.width - 400,0,"button",6);
    this.buttons = game.add.group();
    this.texts = game.add.group();

    var playButton = game.make.button(game.world.width - 350, 150, "button", this.pressPlay, this, 3,5);
    var helpButton = game.make.button(game.world.width - 350, 300, "button", this.pressHelp, this, 2,4);
    var aboutButton = game.make.button(-100, 0, "button", this.pressAbout, this, 0,1);

    this.buttons.add(playButton);
    this.buttons.add(helpButton);
    this.buttons.add(aboutButton);

    /*
    var style = { font: "100px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: playButton.width, align: "center" };
    var playText = game.add.text(playButton.x + (playButton.width) / 2.0, playButton.y + (playButton.height) / 2.0, "Play", style);
    var helpText = game.add.text(helpButton.x + (helpButton.width) / 2.0, helpButton.y + (helpButton.height) / 2.0, "Help", style);

    playText.anchor.set(0.5);
    helpText.anchor.set(0.5);

    this.texts.add(playText);
    this.texts.add(helpText);
    */
}

titleState.prototype.update = function() {
    
}

titleState.prototype.pressPlay = function() {
    game.state.start("cutscene_one", Phaser.Plugin.StateTransition.Out.SlideLeft, Phaser.Plugin.StateTransition.In.SlideLeft);
}

titleState.prototype.pressHelp = function() {
    game.state.start("help", Phaser.Plugin.StateTransition.Out.SlideRight, Phaser.Plugin.StateTransition.In.SlideRight);
}


titleState.prototype.pressAbout = function() {
    game.state.start("about", Phaser.Plugin.StateTransition.Out.SlideRight, Phaser.Plugin.StateTransition.In.SlideRight);
}