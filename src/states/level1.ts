export class Level1 extends Phaser.State
{
    //entities/sprites
    cat: Phaser.Sprite;
    platforms: Phaser.Group;
    sky: Phaser.TileSprite;
    
    //input
    cursors: Phaser.CursorKeys;
    jump: any; //spacebar

    //physics
    jumping: Boolean;
    facingRight: Boolean = true;

    //mechanics
    cameraYMin: number = 99999;
    platformYMin: number = 99999;
    yOrig: number;
    yChange: number = 0;

    create()
    {
        this.sky = this.game.add.tileSprite(0, -this.game.height, 450, 600, 'sky');
        this.game.add.image(0, 0, 'bg');

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //initialize entitites
        this.initCat();
        this.initPlatforms();

        //setup input
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jump = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }

    update()
    {
        this.cat.body.velocity.x = 0;

        if (this.cat.alive)
        {
            this.physics.arcade.collide( this.cat, this.platforms );

            if (this.cat.body.touching.down || this.cat.body.onFloor()) this.jumping = false;
            else this.jumping = true;

            // Controls & animations
            
            if (((this.input.pointer1.isDown && this.game.input.pointer1.position.y > this.game.height-100) //mouse/touch
                    || this.cursors.up.isDown 
                    || this.jump.isDown)
                && !this.jumping) //tap/spacebar for jump
            {
                this.cat.body.velocity.y = -500;
                this.cat.animations.play('jump');
            } 
            else if ((this.game.input.pointer1.isDown 
                        && this.game.input.pointer1.position.x < this.game.width/2 
                        && this.game.input.pointer1.position.y < this.game.height-100) //mouse/touch
                    || this.cursors.left.isDown) //left
            {
                this.facingRight = false;
                this.cat.body.velocity.x = -200;

                if (!this.jumping)
                { 
                    this.cat.animations.play('walk'); 
                }

                this.cat.scale.setTo(-2, 2);
            }
            else if ((this.game.input.pointer1.isDown 
                        && this.game.input.pointer1.position.x > this.game.width/2 
                        && this.game.input.pointer1.position.y < this.game.height-100) //mouse/touch
                    ||this.cursors.right.isDown) //right
            {
                this.facingRight = true;
                this.cat.body.velocity.x = 200;

                if (!this.jumping)
                { 
                    this.cat.animations.play('walk'); 
                }

                this.cat.scale.setTo(2);
            }
            else
            {
                this.cat.animations.play('idle');
            }
            
            if (this.jumping)
            {
                this.cat.animations.play('fall');
            }

        }
        else
        {
            if (this.jump.isDown || this.game.input.pointer1.isDown) this.game.state.start("Menu"); //restart on spacebar
        }

        //for each platform, find out which is the highest
        //if one goes below the camera view, then create a new one at a distance from the highest one
        //these are pooled so they are very performant
        this.platforms.forEachAlive(
            function( plat )
            {
                this.platformYMin = Math.min( this.platformYMin, plat.y );
                if( plat.y > this.camera.y + this.game.height )
                {
                    plat.kill();
                    this.createPlatform( this.rnd.integerInRange( 50, this.world.width - 146 ), this.platformYMin - 100, 16 );
                }
            },
            this
        );
        
        //max amount the cat has travelled
        this.yChange = Math.max( this.yChange, Math.abs( this.cat.y - this.yOrig ) );

        //the y offset and the height of the world are adjusted
        //to match the highest point the cat has reached
        this.world.setBounds( 0, -this.yChange, this.world.width, this.game.height + this.yChange );
        
        //camera follow that only moves up
        this.cameraYMin = Math.min( this.cameraYMin, this.cat.y - this.game.height + 130 );
        this.camera.y = this.cameraYMin;

        //sky animations/sprite positioning
        this.sky.tilePosition.y = this.yChange;
        this.sky.position.y = this.camera.y;
        
        //if the cat falls below the camera view, game over
        if( this.cat.y > this.cameraYMin + this.game.height && this.cat.alive )
        {
            // Reset everything, or the world will be messed up

            this.world.setBounds( 0, 0, this.game.width, this.game.height );

            this.cat.destroy();
            this.initCat();

            this.platforms.destroy();
            this.initPlatforms();

            this.cameraYMin = 99999;
            this.platformYMin = 99999;
            this.yChange = 0;
            
            this.state.start( 'Level1' );
        }
    }

    render()
    {
        //this.game.debug.spriteInfo(this.cat, 32, 32);
        //this.game.debug.text("X " + (this.cat.x as number) + " Y " + (this.cat.y as number), 30, 30);
    }

    private initCat()
    {
        this.cat = this.game.add.sprite(this.game.width / 2, this.game.height - 28, 'cat');
        
        this.game.physics.arcade.enableBody(this.cat);
        
        //bounds
        this.cat.body.setSize(12,28,26,25);
        this.cat.anchor.setTo(0.5, 0.5);
        this.cat.scale.setTo(2);
        this.yOrig = this.cat.y;

        //more physics
        this.cat.body.checkCollision.up = false;
        this.cat.body.checkCollision.left = false;
        this.cat.body.checkCollision.right = false;
        this.cat.body.collideWorldBounds = true;
        this.cat.body.gravity.y = 1000;
        this.cat.body.maxVelocity.y = 1000;

        //animations
        this.cat.animations.add('idle', [0, 1, 2, 3], 6, true);
        this.cat.animations.add('walk', [16,17,18,19,20,21,22,23], 20, true);
        this.cat.animations.add('jump', [32,33], 6, false);
        this.cat.animations.add('fall', [34,35], 6, true);
        this.cat.animations.add('land', [36,37,38,39], 20,false);
        this.cat.animations.add('dead', [64,65,66,67,68,69,70], 10,false);

        this.cat.smoothed = false;
    }

    private initPlatforms()
    {
        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;
        this.platforms.createMultiple( 10, 'platform' );
        
        //create the base platform, with a buffer on either side so the cat doesn't fall through
        this.createPlatform( 0, this.world.height - 32, 16 );

        //create a batch of platforms that start to move up the level
        for( var i = 0; i < 9; i++ ) {
            this.createPlatform( this.rnd.integerInRange( 0, this.world.width - 146 ), this.world.height - (100 * i), 16 );
        }
    }

    private createPlatform( x, y, worldW )
    {
        //this is a helper function since writing all of this out can get verbose elsewhere
        let platform = this.platforms.getFirstDead(true);
        platform.reset( x, y );
        platform.body.immovable = true;
        return platform;
      }
}
