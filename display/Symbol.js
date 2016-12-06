/**
 * Symbol-----------------------------------------------------------------------
 * @type Class
 * @description Player's life-line
 */
var Symbol = function(x, y){
    Sprite.call(this, x, y);
    
    this.width = 60;
    this.height = 45;
    
    this._animations = {
	"normal": [ ImageManager.repository["main"]["symbol"] ],
	"over": [ ImageManager.repository["main"]["destroy"] ]
    }
    //init
    this.setCurrentAnimation("normal");
    this.setCurrentFrame(0);
}
Symbol.prototype = new Sprite();
Symbol.prototype.onAdd = function(){
    /*
    //init position
    var x = Math.floor(this.stage.width/2 - this.width/2);
    var y = Math.floor(this.stage.height - this.height);
    this.position = new Vector2(x, y);
    */
}
Symbol.prototype.onCollided = function(sprite){
    if(sprite instanceof Bullet){
	//play music
	MediaManager.play("blast");
	this.setCurrentAnimation("over", 0);
	//game over
	setTimeout((function(stage){
	    return function(){stage.gameOver()};
	})(this.stage), this.stage._stepTime * 3);
    }
}