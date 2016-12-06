/**
 * Material---------------------------------------------------------------------
 * @type Base Class
 * @implement Sprite
 */
var Material = function(x, y){
    Sprite.call(this, x, y);
    
    this.speed = Vector2(0, 0);
    this.width = Material.width;
    this.height = Material.height;
}
Material.width = 40;
Material.height = 40;
Material.prototype = new Sprite();
Material.prototype.onCollided = function(sprite){
    if(sprite instanceof Tank){//only accept Tank
	//play music
	MediaManager.play("add");
	//give reward
	this.giveRewardTo(sprite);
	//kill himself
	this.die();
    }
}
//Give reward to any sprite (Now only accept Tank)
Material.prototype.giveRewardTo = function(tank){}

/**
 * Peach------------------------------------------------------------------------
 * @type Class
 * @implement Material
 */
var Peach = function(){
    Material.apply(this, arguments);
    
    this._animations = {
	"normal": [ ImageManager.repository["material"]["peach"] ]
    }
    //init
    this.setCurrentAnimation("normal");
    this.setCurrentFrame(0);
}
Peach.prototype = new Material();
Peach.prototype.giveRewardTo = function(sprite){
    sprite.increaseHP(1);
}

/**
 * Star-------------------------------------------------------------------------
 * @type Class
 * @implement Material
 */
var Star = function(){
    Material.apply(this, arguments);
    
    this._animations = {
	"normal": [ ImageManager.repository["material"]["star"] ]
    }
    //init
    this.setCurrentAnimation("normal");
    this.setCurrentFrame(0);
}
Star.prototype = new Material();
Star.prototype.giveRewardTo = function(sprite){
    sprite.setBulletPower(Global.bulletNextLevel(sprite.bulletPower));
}

/**
 * Smaller----------------------------------------------------------------------
 * @type Class
 * @implement Material
 */
var Smaller = function(){
    Material.apply(this, arguments);
    
    this._animations = {
	"normal": [ ImageManager.repository["material"]["timer"] ]
    }
    //init
    this.setCurrentAnimation("normal");
    this.setCurrentFrame(0);
}
Smaller.prototype = new Material();
Smaller.prototype.giveRewardTo = function(sprite){
    var edge = 10;
    //become smaller
    if(sprite.width - edge > 20) sprite.width -= edge;
    if(sprite.height - edge > 20) sprite.height -= edge;
}