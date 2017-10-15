let preloadState = function() {

}

preloadState.prototype.preload = function() {
    game.load.image("title_background","assets/title_background.png");
    game.load.image("title_logo","assets/title_logo.png");
    game.load.spritesheet("button","assets/button_sheet.png",512,256);
}

preloadState.prototype.create = function() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.parentIsWindow = true;
    game.scale.refresh();
    game.state.start("titlemenu");
}

preloadState.prototype.update = function() {
    
}