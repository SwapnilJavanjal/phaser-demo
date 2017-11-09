export class Loading extends Phaser.State
{
    preloadBar: Phaser.Sprite;
    loadingText: Phaser.Text;

    preload()
    {
        let fontStyle = {
            font: '18px Walter Turncoat',
            fill: '#7edcfc'
        };

        let loadingBarBg = this.game.add.sprite(this.game.world.centerX,
                                                this.game.world.centerY,
                                                'loadingBarBg');
        loadingBarBg.tint = 0x7edcfc; // Same blue as text
        loadingBarBg.anchor.setTo(0.5);

        let loadingBar = this.game.add.sprite(this.game.world.centerX - 175,
                                              this.game.world.centerY - 16,
                                              'loadingBar');
        loadingBar.tint = 0xdcfc7e; // A contrasting green

        this.load.setPreloadSprite(loadingBar);

        this.loadingText = this.add.text(this.world.centerX,
                                         this.world.centerY - 30,
                                         'Loading...', fontStyle);
        this.loadingText.anchor.setTo(0.5);

        /*---LOAD GAME ASSETS---*/
        this.load.spritesheet('cat','assets/guy/guyspritesheet.png',64,64);

        this.load.image('bg','assets/bg.png');
        this.load.image('sky','assets/sky.jpg');
        this.load.image('pause','assets/UI/pause.png');
        this.load.image('panel','assets/UI/panel.png');
        this.load.image('button','assets/UI/button.png');

        this.load.image('platform','assets/platform.png');
    }

    create()
    {
        this.game.state.start('Menu');
    }
}
