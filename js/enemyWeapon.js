// References used: https://phaser.io/docs/2.6.2/index
//                  https://phaser.io/examples
/** @constructor */
// enemy types - skater, bully, football_player_left, football_player_right, musician
enemyProjectile = function(enemyRef){ //x, y, type, playerRef, enemyRef
    // call super constructor on sprite
    if (enemyRef.enemyType === "bully"){
      Phaser.Sprite.call(this, game, enemyRef.x, enemyRef.y, 'spitball');
    } else if ((enemyRef.enemyType === "football_player_left") || (enemyRef.enemyType === "football_player_right")){
      Phaser.Sprite.call(this, game, enemyRef.x + 100, enemyRef.y, 'football');
    }

    game.add.existing(this);
    this.lifespan = 5000; // stays alive for 5 seconds
}

enemyProjectile.prototype = Object.create(Phaser.Sprite.prototype);
enemyProjectile.prototype.constructor = enemyProjectile;

enemyProjectile.prototype.die = function(){
    this.kill();
}
