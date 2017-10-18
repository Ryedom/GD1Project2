// References used: https://phaser.io/docs/2.6.2/index
//                  https://phaser.io/examples
var FadeOut = Phaser.Plugin.StateTransition.createTransition({
    intro: true,
    props: {
        alpha: 1.0
    }
})

var FadeIn = Phaser.Plugin.StateTransition.createTransition({
    props: {
        alpha: 0.0
    }
})
