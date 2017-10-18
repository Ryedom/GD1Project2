let cutTwoState = function() {

}

cutTwoState.prototype.preload = function() {
    this.framePaths = [
        "assets/Cutscene1/cutscene1_1.png",
        "assets/Cutscene1/cutscene1_2.png",
        "assets/Cutscene1/cutscene1_3.png",
        "assets/Cutscene1/cutscene1_4.png",
        "assets/Cutscene1/cutscene1_5.png",
        "assets/Cutscene1/cutscene1_6.png"
    ]

    this.frameSprites = [];
    for (var i = 0; i < this.framePaths.length; i++) {
        var frameName = "cutscene_1_" + (i+1);
        game.load.image(frameName,this.framePaths[i]);
        this.frameSprites.push(frameName);
    }
}

cutTwoState.prototype.create = function() {
    this.frames = game.add.group();
    this.cameraTween = game.add.tween(game.camera);
    this.currentFrame = 0;
    for (var i = 0; i < this.frameSprites.length; i++) {
        var thisFrame = game.add.sprite(i * 750,0,this.frameSprites[i]);
        this.frames.add(thisFrame);
    }
    game.world.setBounds(0,0,750 * this.frameSprites.length,1334);
    game.input.onTap.add(this.onTap,this);
}

cutTwoState.prototype.update = function() {

}

cutTwoState.prototype.onTap = function(eventPointer,isDoubleTap) {
    if (this.cameraTween.isRunning)
        return;
    game.tweens.removeAll();
    if (eventPointer.clientX < (game.scale.width / 2.0) + game.scale.margin.left && this.currentFrame > 0) {
        this.cameraTween = game.add.tween(game.camera);
        this.cameraTween.to({ x: Math.max(game.camera.x - 750, 0) }, 750, "Sine.easeInOut", true, -1, 0);
        this.currentFrame--;
    }
    else if (eventPointer.clientX >= (game.scale.width / 2.0) + game.scale.margin.left && this.currentFrame < this.frames.length - 1) {
        this.cameraTween = game.add.tween(game.camera);
        this.cameraTween.to({ x: Math.min(game.camera.x + 750, 750 * this.frameSprites.length) }, 750, "Sine.easeInOut", true, -1, 0);
        this.currentFrame++;
    }
    else if (this.currentFrame == this.frames.length - 1) {
        game.state.start("level2State", Phaser.Plugin.StateTransition.Out.SlideLeft, Phaser.Plugin.StateTransition.In.SlideLeft);
    }
}