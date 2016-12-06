/**
 * Tank-------------------------------------------------------------------------
 * @type Base Class
 * @implement Sprite
 */
var Tank = function(x, y){
    Sprite.call(this, x, y);
    
    this.speed = new Vector2(5, 5);
    
    this.hp = this.maxHp = 1;
    
    this.width = 50;
    this.height = 50;
    this.isDying = false;
    //log fired bullet
    this.bullet = null;
    //bullet power
    this.bulletPower = "tiny";
    
    //[Default]
    this._animations = {
	"direction": {
	    "up": null,
	    "down": null,
	    "left": null,
	    "right": null
	},//directions, MUST include "up","down","left","right"
	"blast": [//default animation of blast when dead
	    ImageManager.repository["tank"]["blast1"],
	    ImageManager.repository["tank"]["blast2"],
	    ImageManager.repository["tank"]["blast3"],
	    ImageManager.repository["tank"]["blast4"],
	    ImageManager.repository["tank"]["blast5"],
	    ImageManager.repository["tank"]["blast6"],
	    ImageManager.repository["tank"]["blast7"],
	    ImageManager.repository["tank"]["blast8"]
	]
    };
    
    this._keepMove = false;
}
Tank.prototype = new Sprite();
//[Override]
Tank.prototype.subDraw = function(context){
    //draw Health Point Bar
    context.save();
    var barWidth = this.hp <=0 ? 0 : this.width * (this.hp / this.maxHp);
    var maxBarWidth = this.width;
    var barHeight = 5;
    var barX = this.position.x;
    var barY = this.position.y - (barHeight + 5);
    //draw bar-border
    context.strokeStyle = "rgba(255, 255, 255, 1)";
    context.lineWidth = 1;
    context.strokeRect(barX, barY, maxBarWidth, barHeight);
    //draw bar
    context.fillStyle = "rgba(0, 255, 0, 0.8)";
    context.fillRect(barX, barY, barWidth, barHeight);
    context.restore();
}
Tank.prototype.keepMove = function(){
    this._keepMove = true;
}
Tank.prototype.stopMove = function(){
    this._keepMove = false;
}
Tank.prototype.onDestroy = function(){
    if(this.getCurrentAnimation() != "blast"){//if is already in blast,will not repeat
	MediaManager.play("blast");
	this.setCurrentAnimation("blast", 0);
    }
}
Tank.prototype.runAnimation = function(){
    switch(this.getCurrentAnimation()){
	case "blast":
	    this.isDying = true;
	    if(this._currentFrame < this._frames.length - 1){//this._currentFrame will increased +1 when end
		//play "blast" animation
		this.setCurrentFrame(this._currentFrame);
		this._currentFrame++;
	    }else{
		//blast over, kill this object
		this.isLive = false;
	    }
	    break;
	case "direction":
	    if(this._keepMove) this.MoveOn(this.getCurrentFrame());
	    break;
    }
}
//normal motion about direction
Tank.prototype.defaultNextPosition = function(direction){
    var nextPosition = new Vector2(this.position.x, this.position.y);
    switch(direction){
	case "left"://left
	    //if(this.getCurrentFrame() == 'left')
	    nextPosition.x -= this.speed.x;
	    this.setCurrentFrame("left");
	    break;
	case "up"://up
	    //if(this.getCurrentFrame() == 'up')
	    nextPosition.y -= this.speed.y;
	    this.setCurrentFrame("up");
	    break;
	case "right"://right
	    //if(this.getCurrentFrame() == 'right')
	    nextPosition.x += this.speed.x;
	    this.setCurrentFrame("right");
	    break;
	case "down"://down
	    //if(this.getCurrentFrame() == 'down')
	    nextPosition.y += this.speed.y;
	    this.setCurrentFrame("down");
	    break;
    }
    return nextPosition;
}
//Move behavior
Tank.prototype.MoveOn = function(direction){
    if(this.getCurrentAnimation() === "direction"){//other animations will not fork this
	var nextPosition = this.defaultNextPosition(direction);
	this.doAboutNextPosition(nextPosition, direction);
    }
}
//[Need Implemented]
Tank.prototype.doAboutNextPosition = function(){}
//make this sprite close to another rect,OR, close to his container-border
Tank.prototype.makeCloseTo = function(direction, nextPosition, collidedRect, isContainer){
    if(isContainer == undefined) isContainer = false;
    switch(direction){
	case "left"://left
	    if(isContainer){
		nextPosition.x = collidedRect.x1;
	    }else{
		nextPosition.x = collidedRect.x2;
	    }
	    break;
	case "up"://up
	    if(isContainer){
		nextPosition.y = collidedRect.y1;
	    }else{
		nextPosition.y = collidedRect.y2;
	    }
	    break;
	case "right"://right
	    if(isContainer){
		nextPosition.x = collidedRect.x2 - this.width;
	    }else{
		nextPosition.x = collidedRect.x1 - this.width;
	    }
	    break;
	case "down"://down
	    if(isContainer){
		nextPosition.y = collidedRect.y2 - this.height;
	    }else{
		nextPosition.y = collidedRect.y1 - this.height;
	    }
	    break;
    }
}
Tank.prototype.setBulletPower = function(power){
    this.bulletPower = power;
}
Tank.prototype.loadBullet = function(playMusic){
    playMusic = playMusic || false;
    if(this.bullet instanceof Bullet && this.bullet.isLive === true){
	return;
    }
    //determine the bullet's coordinate
    var direction = this.getCurrentFrame();
    var newPosition = null;
    var gap = 0;//-Math.floor(this.width/2);
    var patchGap = Math.floor(Global.bulletConfig[this.bulletPower]["width"] / 2);
    switch(direction){
	case "left"://left
	    newPosition = new Vector2(this.position.x - gap,
				      this.position.y + Math.floor(this.height/2) - patchGap);
	    break;
	case "up"://up
	    newPosition = new Vector2(this.position.x + Math.floor(this.width/2) - patchGap,
				      this.position.y - gap);
	    break;
	case "right"://right
	    newPosition = new Vector2(this.position.x + this.width + gap,
				      this.position.y + Math.floor(this.height/2) - patchGap);
	    break;
	case "down"://down
	    newPosition = new Vector2(this.position.x + Math.floor(this.width/2) - patchGap,
				      this.position.y + this.height + gap);
	    break;
    }
    //music
    if(playMusic) MediaManager.play("fire");
    //log & load
    if(newPosition instanceof Vector2){
	this.bullet = new Global.bulletFactory(this.bulletPower, newPosition.x, newPosition.y, direction, this);
	this.stage.addSprite(this.bullet);
    }
}
Tank.prototype.onCollided = function(sprite){
    if(this instanceof PlayerTank && sprite instanceof EnemyTank){
	if(!sprite.isDying) this.decreaseHP(Global.damageInfinity);
    }else if(sprite instanceof PlayerTank && this instanceof EnemyTank){
	if(!this.isDying) sprite.decreaseHP(Global.damageInfinity);
    }else if(sprite instanceof Bullet){
	this.decreaseHP(sprite.damage);
	if(this.hp > 0){
	    MediaManager.play("hit");
	}
    }
}

/**
 * Tank for Player--------------------------------------------------------------
 * @type Class
 * @implement Tank
 */
var PlayerTank = function(x, y, option){
    Tank.call(this, x, y);
    
    //init
    this.hp = this.maxHp = option.hp || 1;
    this.keyMapping = option.keyMapping || {
	"left": KEY_LEFT, //[CONFIG]
	"up": KEY_UP, //[CONFIG]
	"right": KEY_RIGHT, //[CONFIG]
	"down": KEY_DOWN, //[CONFIG]
	"fire": KEY_SPACE //[CONFIG]
    };
    
    this._directionKeyDown = {
	"up": false,
	"down": false,
	"left": false,
	"right": false
    }
    //this.width = this.height = 20;
    this.speed = new Vector2(5, 5);
    this.bulletPower = "tiny";
    this._animations["direction"] = {
	"up": ImageManager.repository["player1"]["up"],
	"down": ImageManager.repository["player1"]["down"],
	"left": ImageManager.repository["player1"]["left"],
	"right": ImageManager.repository["player1"]["right"]
    };
    //set "direction" as default _frames, here we will use frames to point some animations later
    this.setCurrentAnimation("direction");
    this.setCurrentFrame("up");
}
PlayerTank.prototype = new Tank();
PlayerTank.prototype.onKeyDown = function(event){
    var key = hashSearch(this.keyMapping, event.keyCode);
    if(key == "fire"){
	//load bullet
	this.loadBullet(true);
    }else if(key && !this.getDirectionKeyDown(key)){
	//console.log("OnKeyDown:" + key);
	//record this direction key down
	this.setDirectionKeyDown(key, true);
	//set move
	this.keepMove();
	//set current direction
	this.setCurrentFrame(key);
    }
}
PlayerTank.prototype.onKeyUp = function(event){
    var key = hashSearch(this.keyMapping, event.keyCode);
    //console.log("OnKeyUp:" + key,this._directionKeyDown[key]);
    if(this._directionKeyDown[key] != undefined){//only direction key will do this
	//set this key to be up
	this.setDirectionKeyDown(key, false);
	//when no direction key is down, we will not move
	if(this.getDirectionKeyDownNumber() <= 0) this.stopMove();
    }
}
PlayerTank.prototype.setDirectionKeyDown = function(key, isDown){
    this._directionKeyDown[key] = isDown;
}
PlayerTank.prototype.getDirectionKeyDown = function(key){
    return this._directionKeyDown[key];
}
PlayerTank.prototype.getDirectionKeyDownNumber = function(){
    var stillKeyDown = 0;
    for(var x in this._directionKeyDown){
	if(this._directionKeyDown[x]) stillKeyDown++;
    }
    return stillKeyDown;
}
//[Override]
PlayerTank.prototype.doAboutNextPosition = function(nextPosition, direction){
    //--------Collision detection (!!!NOTE!!! Here may need to be optimized)
    //create an Rectangle to represent This object in next step
    var nextRect = new Rectangle(nextPosition.x,
		    nextPosition.x + this.width,
		    nextPosition.y,
		    nextPosition.y + this.height);
    //[1].Border collision detection
    var stageRect = this.stage.toRectangle();
    if(this.stage.checkRectOut(stageRect, nextRect)){
	//this.makeCloseTo(direction, nextPosition, stageRect, true);
	nextPosition = null;
    }else{
	//[2].Rectangle Object collision detection (!!!NOTE!!! Here may need to be optimized)
	var compositeSprites = this.stage.getCompositeSprites(nextRect, this);
	if(compositeSprites.length > 0){//collided
	    //we just focus on the first sprite
	    var collidedSprite = compositeSprites[0];
	    if(collidedSprite instanceof Obstacle ||
	       collidedSprite instanceof Symbol ||
	       collidedSprite instanceof PlayerTank){
		//make this sprite close to obstacle
		//this.makeCloseTo(direction, nextPosition, collidedSprite.toRectangle());
		nextPosition = null;
	    }else if(!(collidedSprite instanceof Bullet)){//if not a Bullet
		//console.log(collidedSprite);
		//fork his own event
		collidedSprite.onCollided(this);
	    }
	}
    }
    //[3].final position
    if(nextPosition instanceof Vector2) this.position = nextPosition;
}

/**
 * Tank for Enemy---------------------------------------------------------------
 * @type Base Class
 * @implement Tank
 */
var EnemyTank = function(x, y){
    Tank.call(this, x, y);
    
    this._keepMove = true;
}
EnemyTank.prototype = new Tank();
EnemyTank.prototype.runAnimation = function(){
    Tank.prototype.runAnimation.call(this);
    //Fire in random
    var rand = Math.floor(Math.random()*100);
    if(rand == 1){
	this.loadBullet(false);
    }
    //Change direction in random
    rand = Math.floor(Math.random()*50);
    if(rand == 2){
	this.doRandDirection();
    }
}
EnemyTank.prototype.doRandDirection = function(){
    var directions = ["up", "down", "left", "right"];
    var rand = Math.floor((Math.random()*10) % 4);
    this.setCurrentFrame(directions[rand]);
}
//[Need to be optimaized] Suck codes - -!!!
EnemyTank.prototype.doAboutNextPosition = function(nextPosition, direction){
    //--------AI of Computer
    //create an Rectangle to represent This object in next step
    var nextRect = new Rectangle(nextPosition.x,
		    nextPosition.x + this.width,
		    nextPosition.y,
		    nextPosition.y + this.height);
    //[1].Border collision detection
    var stageRect = this.stage.toRectangle();
    if(this.stage.checkRectOut(stageRect, nextRect)){
	this.makeCloseTo(direction, nextPosition, stageRect, true);
	//nextPosition = null;
	//change to next random direction
	this.doRandDirection();
    }else{
	//[2].Rectangle Object collision detection
	var compositeSprites = this.stage.getCompositeSprites(nextRect, this);
	if(compositeSprites.length > 0){//collided
	    //we just focus on the first sprite
	    var collidedSprite = compositeSprites[0];
	    if(collidedSprite instanceof Obstacle ||
	       collidedSprite instanceof Symbol ||
	       collidedSprite instanceof EnemyTank){
		//make this sprite close to obstacle
		this.makeCloseTo(direction, nextPosition, collidedSprite.toRectangle());
		//change to next random direction
		this.doRandDirection();
	    }else if(!(collidedSprite instanceof Bullet)){//if not a Bullet
		//fork his own event
		collidedSprite.onCollided(this);
	    }
	}
    }
    //[3].final position
    if(nextPosition instanceof Vector2) this.position = nextPosition;
}

/**
 * Enemy Level1-----------------------------------------------------------------
 * @type Class
 * @implement EnemyTank
 * @description Normal tank
 */
var EnemyTankLevel1 = function(x, y){
    EnemyTank.call(this, x, y);
    
    this.speed = new Vector2(2, 2);
    this.hp = this.maxHp = 2;
    this.bulletPower = "tiny";
    this._animations["direction"] = {
	"up": ImageManager.repository["enemyLevel1"]["up"],
	"down": ImageManager.repository["enemyLevel1"]["down"],
	"left": ImageManager.repository["enemyLevel1"]["left"],
	"right": ImageManager.repository["enemyLevel1"]["right"]
    };
    //set "direction" as default _frames, here we will use frames to point some animations later
    this.setCurrentAnimation("direction");
    this.setCurrentFrame("down");
}
EnemyTankLevel1.prototype = new EnemyTank();

/**
 * Enemy Level2-----------------------------------------------------------------
 * @type Class
 * @implement EnemyTank
 * @description Fast tank
 */
var EnemyTankLevel2 = function(x, y){
    EnemyTank.call(this, x, y);
    
    this.speed = new Vector2(5, 5);
    this.hp = this.maxHp = 1;
    this.bulletPower = "tiny";
    this._animations = {
	"direction": {
	    "up": ImageManager.repository["enemyLevel2"]["up"],
	    "down": ImageManager.repository["enemyLevel2"]["down"],
	    "left": ImageManager.repository["enemyLevel2"]["left"],
	    "right": ImageManager.repository["enemyLevel2"]["right"]
	},//directions, MUST include "up","down","left","right"
	"blast": [//default animation of blast when dead
	    ImageManager.repository["tank"]["blast1"],
	    ImageManager.repository["tank"]["blast2"],
	    ImageManager.repository["tank"]["blast3"],
	    ImageManager.repository["tank"]["blast4"],
	    ImageManager.repository["tank"]["blast5"],
	    ImageManager.repository["tank"]["blast6"],
	    ImageManager.repository["tank"]["blast7"],
	    ImageManager.repository["tank"]["blast8"]
	]
    };
    //set "direction" as default _frames, here we will use frames to point some animations later
    this.setCurrentAnimation("direction");
    this.setCurrentFrame("down");
}
EnemyTankLevel2.prototype = new EnemyTank();