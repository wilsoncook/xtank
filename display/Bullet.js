/**
 * [Base Class]Bullet-----------------------------------------------------------
 * @type Class
 * @implement Sprite
 */
//Static config (Can be used in anywhere)
Global.bulletLevelOrder = ["tiny", "medium", "large", "huge"];
Global.bulletConfig = {
    "tiny": {
	"width": 10,
	"height": 10
    },
    "medium": {
	"width": 10,
	"height": 15
    },
    "large": {
	"width": 15,
	"height": 15
    },
    "huge": {
	"width": 15,
	"height": 15
    }
}
//Factory, to make kinds of bullets
Global.bulletFactory = function(power, x, y, direction, shooter){
    switch(power){
	case "medium":
	    return new MediumBullet(power, x, y, direction, shooter);
	case "large":
	    return new LargeBullet(power, x, y, direction, shooter);
	case "huge":
	    return new HugeBullet(power, x, y, direction, shooter);
	case "tiny":
	default:
	    return new TinyBullet(power, x, y, direction, shooter);
    }
}
//compare with two levels, if(level1 > level2) return true;
Global.bulletCompareLevel = function(level1, level2){
    var index1 = Global.bulletLevelOrder.indexOf(level1);
    var index2 = Global.bulletLevelOrder.indexOf(level2);
    return index1 > index2;
}
//return next level of bullet, used for Bullet LevelUp
Global.bulletNextLevel = function(currentLevel){
    var nextIndex = Global.bulletLevelOrder.indexOf(currentLevel) + 1;
    var maxIndex = Global.bulletLevelOrder.length - 1;
    if(nextIndex > maxIndex) nextIndex = maxIndex;
    return Global.bulletLevelOrder[nextIndex];
}

var Bullet = function(power, x, y, direction, shooter){
    Sprite.call(this, x, y);
    
    this.speed = new Vector2(10, 10);
    this.damage = 1;
    
    this.power = power;
    //[Defualt]just use globalConfig
    this.width = Global.bulletConfig[power]["width"];
    this.height = Global.bulletConfig[power]["height"];
    
    //@protected
    this._direction = direction;
    this._shooter = shooter;
}
Bullet.prototype = new Sprite();
Bullet.prototype.runAnimation = function(){
    switch(this._direction){
	case "left"://left
	    this.position.x -= this.speed.x;
	    break;
	case "up"://up
	    this.position.y -= this.speed.y;
	    break;
	case "right"://right
	    this.position.x += this.speed.x;
	    break;
	case "down"://down
	    this.position.y += this.speed.y;
	    break;
    }
    var thisRect = this.toRectangle();
    //[1].Border collision detection
    if(this.stage.checkRectOut(this.stage.toRectangle(), thisRect)){
	//just kill myself
	this.isLive = false;
    }else{
	//[2].Rectangle Object collision detection
	var compositeSprites = this.stage.getCompositeSprites(thisRect, this);
	if(compositeSprites.length > 0){//collided
	    //Now we focus on all
	    this.whenCollidedWith(compositeSprites);
	    /*
	    //we just focus on the first sprite
	    var collidedSprite = compositeSprites[0];
	    if(collidedSprite instanceof Sprite &&
	       collidedSprite != this._shooter){
		//follow-up measures to determine
		this.whenCollidedWith(collidedSprite);
	    }
	    */
	}
    }
}
//more action while encounter someone
Bullet.prototype.whenCollidedWith = function(sprites){
    if(! sprites instanceof Array) sprites = [sprites];
    var isValidCollided = false;//flag: determine is this collided effective
    //Now here ,we focus on all collided sprites
    for(var i = 0; i < sprites.length; i++){
	var sprite = sprites[i];
	if(sprite instanceof Sprite &&
	   sprite != this._shooter &&
	   !(sprite instanceof Material) &&
	   !(sprite instanceof EnemyTank && this._shooter instanceof EnemyTank) &&
	   !(sprite instanceof PlayerTank && this._shooter instanceof PlayerTank)){
	    
	    isValidCollided = true;
	    //fork his own event
	    sprite.onCollided(this);
	}
    }
    //kill myself
    if(isValidCollided) this.isLive = false;
}

/**
 * TinyBullet
 */
var TinyBullet = function(){
    Bullet.apply(this, arguments);
    this.damage = 1;
    
    this.speed = new Vector2(10, 10);
    
    this._animations = {
	"normal": [ ImageManager.repository["weapon"]["bullet"] ]
    }
    //init
    this.setCurrentAnimation("normal");
    this.setCurrentFrame(0);
}
TinyBullet.prototype = new Bullet("tiny");

/**
 * MediumBullet
 */
var MediumBullet = function(){
    Bullet.apply(this, arguments);
    this.damage = 1;
    
    this.speed = new Vector2(15, 15);
    
    this._animations = {
	"normal": [ ImageManager.repository["weapon"]["bullet"] ]
    }
    //init
    this.setCurrentAnimation("normal");
    this.setCurrentFrame(0);
}
MediumBullet.prototype = new Bullet("medium");

/**
 * LargeBullet
 */
var LargeBullet = function(){
    Bullet.apply(this, arguments);
    this.damage = 2;
    
    this.speed = new Vector2(25, 25);
    
    this._animations = {
	"normal": [ ImageManager.repository["weapon"]["bullet"] ]
    }
    //init
    this.setCurrentAnimation("normal");
    this.setCurrentFrame(0);
}
LargeBullet.prototype = new Bullet("large");

/**
 * HugeBullet
 */
var HugeBullet = function(){
    Bullet.apply(this, arguments);
    this.damage = 3;
    
    this.speed = new Vector2(35, 35);
    
    this._animations = {
	"normal": [ ImageManager.repository["weapon"]["bullet"] ]
    }
    //init
    this.setCurrentAnimation("normal");
    this.setCurrentFrame(0);
}
HugeBullet.prototype = new Bullet("huge");