let cutTwoState = function() {

}

cutTwoState.prototype.preload = function() {
    this.framePaths = [
        "assets/Cutscenes/Cutscene2/cutscene2_1.png",
        "assets/Cutscenes/Cutscene2/cutscene2_2.png",
        "assets/Cutscenes/Cutscene2/cutscene2_3.png",
    ]

    this.frameSprites = [];
    for (var i = 0; i < this.framePaths.length; i++) {
        var frameName = "cutscene_2_" + (i+1);
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
    // Arrows that follow the camera and indicate that the "comic" can be flipped through.
    // Visibility fades in and out
    // Left Arrow
    this.leftArrow = game.add.sprite(0,game.camera.height / 2.0,'carrow');
    this.leftArrow.alpha = 0.5;
    this.leftArrow.fixedToCamera = true;
    this.leftArrowTween = game.add.tween(this.leftArrow).to({alpha: 0,}, 1000, "Sine.easeInOut", true, -1, -1,true);
    // Right Arrow
    this.rightArrow = game.add.sprite(game.camera.width - 60,game.camera.height / 2.0,'carrow');
    // Some extra math to flip the sprite
    this.rightArrow.anchor.setTo(0.5,0);
    this.rightArrow.scale.x *= -1;
    this.rightArrow.alpha = 0.5;
    this.rightArrow.fixedToCamera = true;
    this.rightArrowTween = game.add.tween(this.rightArrow).to({alpha: 0,}, 1000, "Sine.easeInOut", true, -1, -1,true);
    game.world.setBounds(0,0,750 * this.frameSprites.length,1334);
    game.input.onTap.add(this.onTap,this);
    this.checkArrowVisibility();
}

cutTwoState.prototype.update = function() {

}

cutTwoState.prototype.checkArrowVisibility = function() {
    // Right arrow eventually leads to gameplay so it's not checked here
    if (this.currentFrame == 0) {
        this.leftArrow.visible = false;
    }
    else this.leftArrow.visible = true;
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
    this.checkArrowVisibility();
}
