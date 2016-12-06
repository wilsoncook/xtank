/**
 * Obstacle---------------------------------------------------------------------
 * @type Base Class
 * @implement Sprite
 */
var Obstacle = function(x, y){
    Sprite.call(this, x, y);
    
    this.width = Obstacle.width;
    this.height = Obstacle.height;
}
Obstacle.width = 30;
Obstacle.height = 30;
Obstacle.prototype = new Sprite();

/**
 * Wall-------------------------------------------------------------------------
 * @type Class
 * @implement Obstacle
 */
var Wall = function(x, y){
    Obstacle.call(this, x, y);

    this._animations = {
	"normal": [ ImageManager.repository["obstacle"]["wall"] ]
    };
    
    //init
    this.setCurrentAnimation("normal");
    this.setCurrentFrame(0);
}
Wall.prototype = new Obstacle();
Wall.prototype.onCollided = function(sprite){
    if(sprite instanceof Bullet){//All kinds of bullets
	this.die();
    }
}

/**
 * Steel------------------------------------------------------------------------
 * @type Class
 * @implement Obstacle
 */
var Steel = function(x, y){
    Obstacle.call(this, x, y);

    this._animations = {
	"normal": [ ImageManager.repository["obstacle"]["steel"] ]
    };
    
    //init
    this.setCurrentAnimation("normal");
    this.setCurrentFrame(0);
}
Steel.prototype = new Obstacle();
Steel.prototype.onCollided = function(sprite){
    if(sprite instanceof Bullet){//Only > "tiny" can destroy this
	if(Global.bulletCompareLevel(sprite.power, "tiny")){
	    this.die();
	}
    }
}