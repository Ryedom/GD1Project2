let helpState = function() {

}

helpState.prototype.preload = function() {

}

helpState.prototype.create = function() {
    this.texts = game.add.group();

    var style = { font: "128px Arial", fill: "#ffffff", wordWrap: false, align: "center" };
    var playText = game.add.text(game.world.centerX, game.world.centerY, "" + window.innerWidth, style);

    playText.anchor.set(0.5);

    this.texts.add(playText);
}

helpState.prototype.update = function() {
    
}