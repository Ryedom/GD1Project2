let preloadState = function() {

}

preloadState.prototype.preload = function() {
    // Menu stuff
    game.load.image("title_background","assets/Title/TitleScreen.png");
    game.load.spritesheet("button","assets/Title/ButtonSheet.png",449,184);
    // Game stuff
    game.load.image('parking_lot', 'assets/background/parkinglot.png');
    game.load.image('hallway', 'assets/background/hallway.png');
    game.load.image('promgymnism', 'assets/background/promgymnism.png');
    game.load.image('help_background', 'assets/background/helpscreen.png');
    game.load.image('about_background', 'assets/background/aboutscreen.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('carole', 'assets/PlayerAndAllyAnimations/Carole_run.png', 210, 210);
    game.load.spritesheet('music_notes', 'assets/MusicNotes.png', 50, 50);
    game.load.spritesheet('ally_powerup', 'assets/PlayerAndAllyAnimations/ally_powerupsheet.png', 210, 210);
    game.load.spritesheet('ally0', 'assets/PlayerAndAllyAnimations/allyrun1.png', 230, 220);
    game.load.spritesheet('ally1', 'assets/PlayerAndAllyAnimations/allyrun2.png', 210, 230);
    game.load.spritesheet('ally2', 'assets/PlayerAndAllyAnimations/allyrun3.png', 210, 230);
    game.load.spritesheet('ally3', 'assets/PlayerAndAllyAnimations/allyrun4.png', 230, 220);

    // enemies
    game.load.spritesheet('skater_ss', 'assets/enemies/skater_spritesheet.png', 231, 300);

    game.load.spritesheet('aoe', 'assets/aoe.png', 300, 300);
    game.load.spritesheet('musician_ss', 'assets/enemies/musician_spritesheet.png', 231, 210);
    game.load.spritesheet('bully_ss', 'assets/enemies/bully_spritesheet.png', 231, 250);
    game.load.spritesheet('teacher_ss', 'assets/enemies/teacher_spritesheet.png', 231, 250);
    game.load.spritesheet('footballRight_ss', 'assets/enemies/twoftbplayers1_sheet.png', 200, 200);
    game.load.spritesheet('footballLeft_ss', 'assets/enemies/twoftbplayers2_sheet.png', 200, 200);

    //bullets
    game.load.spritesheet('bullet', 'assets/rgblaser.png', 4, 4);
    game.load.spritesheet('football', 'assets/enemies/football.png', 50, 50);
    game.load.spritesheet('spitball', 'assets/enemies/spitball.png', 50, 50);
}

preloadState.prototype.create = function() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
    game.state.start("level1State");
}

preloadState.prototype.update = function() {

}
