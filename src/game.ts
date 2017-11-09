/// <reference path="../node_modules/phaser-ce/typescript/phaser.d.ts"/>

import { Boot } from './states/boot';
import { Loading } from './states/loading';
import { Menu } from './states/menu';
import { Level1 } from './states/level1';
// Import additional states here

export class MyGame extends Phaser.Game
{
    constructor()
    {
        super(450, 600); //makes new game at specified resolution

        this.state.add('Boot', Boot);
        this.state.add('Loading', Loading);
        this.state.add('Menu', Menu);
        this.state.add('Level1', Level1);
        // Add additional states here

        this.state.start('Boot');
    }
}

new MyGame(); // This kicks everything off
