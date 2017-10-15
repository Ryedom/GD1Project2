let gameplayState = function() {

}

gameplayState.prototype.preload = function() {

}

gameplayState.prototype.create = function() {
    this.texts = game.add.group();

    var style = { font: "128px Arial", fill: "#ffffff", wordWrap: false, align: "center" };
    var playText = game.add.text(game.world.centerX, game.world.centerY, "You hit Play", style);

    playText.anchor.set(0.5);

    this.texts.add(playText);
}

gameplayState.prototype.update = function() {
    
}