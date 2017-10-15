let preloadState = function() {

}

preloadState.prototype.preload = function() {
    // Menu stuff
    game.load.image("title_background","assets/test_title_background.png");
    game.load.image("title_logo","assets/test_title_logo.png");
    game.load.spritesheet("button","assets/test_button_sheet.png",512,256);
    // Game stuff
    game.load.image('parking_lot', 'assets/Rough/parkinglot.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('bullet', 'assets/rgblaser.png', 4, 4);
}

preloadState.prototype.create = function() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
    game.state.start("titlemenu");
}

preloadState.prototype.update = function() {
    
}
