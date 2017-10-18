// References used: https://phaser.io/docs/2.6.2/index
//                  https://phaser.io/examples
let helpState = function() {

}

helpState.prototype.preload = function() {

}

helpState.prototype.create = function() {
    this.titleBackground = game.add.sprite(0,0,"help_background");
    this.sprites = game.add.group();
    this.texts = game.add.group();

    // Player
    var playerSprite = game.add.sprite(375,160,"carole",0,this.sprites);
    playerSprite.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 25, true);
    playerSprite.animations.play('run');
    playerSprite.scale.x *= 0.5;
    playerSprite.scale.y *= 0.5;
    playerSprite.anchor.set(0.5,0.5);

    // Band member 4
    var bandSpriteOne = game.add.sprite(200,375,"ally0",0,this.sprites);
    bandSpriteOne.animations.add('run', [0, 1, 2, 3, 4], 25, true);
    bandSpriteOne.animations.play('run');
    bandSpriteOne.scale.x *= 0.5;
    bandSpriteOne.scale.y *= 0.5;
    bandSpriteOne.anchor.set(0.5,0.5);

    // Band member 4
    var bandSpriteTwo = game.add.sprite(325,375,"ally1",0,this.sprites);
    bandSpriteTwo.animations.add('run', [0, 1, 2, 3, 4], 25, true);
    bandSpriteTwo.animations.play('run');
    bandSpriteTwo.scale.x *= 0.5;
    bandSpriteTwo.scale.y *= 0.5;
    bandSpriteTwo.anchor.set(0.5,0.5);

    // Band member 4
    var bandSpriteThree = game.add.sprite(450,375,"ally2",0,this.sprites);
    bandSpriteThree.animations.add('run', [0, 1, 2, 3, 4], 25, true);
    bandSpriteThree.animations.play('run');
    bandSpriteThree.scale.x *= 0.5;
    bandSpriteThree.scale.y *= 0.5;
    bandSpriteThree.anchor.set(0.5,0.5);

    // Band member 4
    var bandSpriteFour = game.add.sprite(575,375,"ally3",0,this.sprites);
    bandSpriteFour.animations.add('run', [0, 1, 2, 3, 4], 25, true);
    bandSpriteFour.animations.play('run');
    bandSpriteFour.scale.x *= 0.5;
    bandSpriteFour.scale.y *= 0.5;
    bandSpriteFour.anchor.set(0.5,0.5);

    // Band member pickup
    var bandPickupSprite = game.add.sprite(375,535,"ally_powerup",0,this.sprites);
    bandPickupSprite.animations.add('stand', [0, 1], 5, true);
    bandPickupSprite.animations.play("stand");
    bandPickupSprite.scale.x *= 0.5;
    bandPickupSprite.scale.y *= 0.5;
    bandPickupSprite.anchor.set(0.5,0.5);

    // Bully
    var bullySprite = game.add.sprite(200,725,"bully_ss",0,this.sprites);
    bullySprite.animations.add('idle', [0, 1, 2, 3], 5, true);
    bullySprite.animations.play("idle");
    bullySprite.scale.x *= 0.5;
    bullySprite.scale.y *= 0.5;
    bullySprite.anchor.set(0.5,0.5);

    // Musician
    var musicianSprite = game.add.sprite(525,815,"musician_ss",0,this.sprites);
    musicianSprite.animations.add('idle', [0, 1, 2, 3], 5, true);
    musicianSprite.animations.play("idle");
    musicianSprite.scale.x *= 0.5;
    musicianSprite.scale.y *= 0.5;
    musicianSprite.anchor.set(0.5,0.5);

    // Jock (one on the left)
    var jockLeftSprite = game.add.sprite(180,950,"footballLeft_ss",0,this.sprites);
    jockLeftSprite.scale.x *= 0.5;
    jockLeftSprite.scale.y *= 0.5;
    jockLeftSprite.anchor.set(0.5,0.5);

    // Jock (one on the right)
    var jockRightSprite = game.add.sprite(300,950,"footballRight_ss",0,this.sprites);
    jockRightSprite.scale.x *= 0.5;
    jockRightSprite.scale.y *= 0.5;
    jockRightSprite.anchor.set(0.5,0.5);

    // Football projectile
    var football = game.add.sprite(240,900,"football",0,this.sprites);
    football.scale.x *= 0.5;
    football.scale.y *= 0.5;
    football.anchor.set(0.5,0.5);

    // Teacher
    var teacherSprite = game.add.sprite(525,1050,"teacher_ss",0,this.sprites);
    teacherSprite.animations.add('burn', [3, 4], 5, true);
    teacherSprite.animations.play("burn");
    teacherSprite.scale.x *= 0.5;
    teacherSprite.scale.y *= 0.5;
    teacherSprite.anchor.set(0.5,0.5);

    // Skater
    var skaterSprite = game.add.sprite(225,1175,"skater_ss",0,this.sprites);
    skaterSprite.animations.add('skate', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 25, true);
    skaterSprite.animations.play("skate");
    skaterSprite.scale.x *= 0.5;
    skaterSprite.scale.y *= 0.5;
    skaterSprite.anchor.set(0.5,0.5);
}

helpState.prototype.update = function() {
    if (game.input.activePointer.isDown) {
        game.state.start("titlemenu", Phaser.Plugin.StateTransition.Out.SlideLeft, Phaser.Plugin.StateTransition.In.SlideLeft);
    }
}
