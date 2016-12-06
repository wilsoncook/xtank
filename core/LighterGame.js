/**
 * Key Defines------------------------------------------------------------------
 * @type Global Const
 * @description keycode mapping
 */
var KEY_A = 65;
var KEY_W = 87;
var KEY_D = 68;
var KEY_S = 83;
var KEY_J = 74;

var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
var KEY_SPACE = 32;

/**
 * Global-----------------------------------------------------------------------
 * @type Global Instance
 * @description this variable is used for global static storing
 */
var Global = {
    damageInfinity: 999
};

/**
 * Vector-----------------------------------------------------------------------
 * @type Class
 */
var Vector2 = function(x, y) { 
    this.x = x; this.y = y; 
};
Vector2.prototype={
    reset:function(x,y){ 
        return new Vector2(x,y);
    },
    add:function(v){ 
        return new Vector2(this.x+v.x,this.y+v.y);
    },
    subtract:function(v){
        return new Vector2(this.x-v.x,this.y-v.y);
    },
    multiply:function(f){
        return new Vector2(this.x*f,this.y*f);
    },
    negate:function(){
        return new Vector2(-this.x,-this.y);
    },
    sqrLength:function(){
        return this.x * this.x + this.y * this.y;
    },
    copy : function() { 
        return new Vector2(this.x, this.y); 
    },
    dot :function(v){
        return this.x * v.x + this.y * v.y; 
    },
    length:function(){
        return Math.sqrt(this.x*this.x+this.y*this.y);
    },
    divide : function(f) { 
        var invf = 1/f; return new Vector2(this.x * invf, this.y * invf); 
    },
    normalize : function() { 
        var inv = 1/this.length(); return new Vector2(this.x * inv, this.y * inv); 
    }
};
Vector2.zero = new Vector2(0, 0);

/**
 * Normal rectangle-------------------------------------------------------------
 * @type Class
 */
var Rectangle = function(x1, x2, y1, y2){
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
}

/**
 * Media manager----------------------------------------------------------------
 * @description Now only support Audio
 * @type Global Instance
 */
var MediaManager = {
    repository: {
		/*
		"fire": "music/enemy3U.wav"
		*/
    },
    loadMedia: function(repo){//Trans source url into Media object
    	this.repository = repo;
    },
    play: function(name){
		var tmpMedia = document.createElement("audio");
		tmpMedia.src = this.repository[name];
		tmpMedia.play();
		delete tmpMedia; //!!!注:这里引起性能问题,每次都要去重新请求数据?!!!
    }
}
//---[INIT].load audio
MediaManager.loadMedia({
    "start": "music/start.wav",
    "fire": "music/fire.wav",
    "blast": "music/blast.wav",
    "hit": "music/hit.wav",
    "add": "music/add.wav"
});


/**
 * Image manager----------------------------------------------------------------
 * @type Global Instance
 */
var ImageManager = {
    total: 0,
    repository: {},
    loadImage: function(repo){//Trans source url into Image object
	this.repository = repo;
	//count total(here use a single loop to avoid any problem)
	for(var cat in this.repository){
	    for(var source in this.repository[cat]){
		this.total++;
	    }
	}
	//load image
	for(var cat in this.repository){
	    for(var source in this.repository[cat]){
		//init image
		var tmpImage = new Image();
		tmpImage.src = this.repository[cat][source];
		this.repository[cat][source] = tmpImage;
		var $this = this;
		tmpImage.onload = function(){
		    //increase loaded
		    $this.loadedNumber++;
		}
	    }
	}
    },
    loadedNumber: 0,
    isLoadedAll: function(){
	return this.loadedNumber >= this.total;
    }
}
//---[INIT].load image
ImageManager.loadImage({
    "player1": {
	"up": "images/p1tankU.gif",
	"down": "images/p1tankD.gif",
	"left": "images/p1tankL.gif",
	"right": "images/p1tankR.gif"
    },
    "enemyLevel1": {
	"up": "images/enemy1U.gif",
	"down": "images/enemy1D.gif",
	"left": "images/enemy1L.gif",
	"right": "images/enemy1R.gif"
    },
    "enemyLevel2": {
	"up": "images/enemy2U.gif",
	"down": "images/enemy2D.gif",
	"left": "images/enemy2L.gif",
	"right": "images/enemy2R.gif"
    },
    "enemyLevel3": {
	"up": "images/enemy3U.gif",
	"down": "images/enemy3D.gif",
	"left": "images/enemy3L.gif",
	"right": "images/enemy3R.gif"
    },
    "obstacle":{
	"wall": "images/wall.gif",
	"steel": "images/steel.gif"
    },
    "tank": {
	"blast1": "images/blast1.gif",
	"blast2": "images/blast2.gif",
	"blast3": "images/blast3.gif",
	"blast4": "images/blast4.gif",
	"blast5": "images/blast5.gif",
	"blast6": "images/blast6.gif",
	"blast7": "images/blast7.gif",
	"blast8": "images/blast8.gif",
	"born1": "images/born1.gif",
	"born2": "images/born2.gif",
	"born3": "images/born3.gif",
	"born4": "images/born4.gif"
    },
    "weapon": {
	"bullet": "images/bullet.gif"
    },
    "material": {
	"star": "images/star.gif",
	"peach": "images/peach.gif",
	"timer": "images/timer.gif"
    },
    "main": {
	"symbol": "images/symbol.gif",
	"destroy": "images/destroy.gif"
    }
});

/**
 * DisplayObject----------------------------------------------------------------
 * @type Global Instance
 * @description just an instance, will share some tools for all object
 */
var DisplayObject = function(){}
DisplayObject.prototype = {
    position: new Vector2(0, 0),
    width: 0,
    height: 0,
    toRectangle: function(){
	return new Rectangle(this.position.x,
			     this.position.x + this.width,
			     this.position.y,
			     this.position.y + this.height);
    }
}

/**
 * Sprite-----------------------------------------------------------------------
 * @type Base Class
 */
var Sprite = function(x, y){
    this.position = new Vector2(x, y);
    
    this.speed = new Vector2(5, 5);
    this.hp = this.maxHp = 1;//Health Point
    
    this.width = 0;
    this.height = 0;
    this.isLive = true;
    
    //save current stage's reference
    this.stage = null;
    
    //[Implement]
    this._animations;
    this._currentAnimation;
    this._frames;//point to currentAnimation's frames
    this._currentFrame = 0;
}
Sprite.prototype = new DisplayObject();
//[Abstract]
Sprite.prototype.setCurrentAnimation = function(animation, currentFrame){
    this._currentAnimation = animation;
    this._frames = this._animations[this._currentAnimation];
    //also update current frame
    if(currentFrame != undefined) this._currentFrame = currentFrame;
}
Sprite.prototype.getCurrentAnimation = function(animation){
    return this._currentAnimation;
}
Sprite.prototype.setCurrentFrame = function(index){
    this._currentFrame = index;
}
Sprite.prototype.getCurrentFrame = function(){
    return this._currentFrame;
}
Sprite.prototype.isPositionIn = function(position){
    return (position.x >= this.position.x &&
	    position.y >= this.position.y &&
	    position.x <= this.position.x + this.width &&
	    position.y <= this.position.y + this.height);
}
//[Abstract Functions]
Sprite.prototype.runAnimation = null;//forked when every "before this.draw()"
Sprite.prototype.onDestroy = null;
Sprite.prototype.onAdd = null;//forked when Stage addSprite(this)
//[Default]
Sprite.prototype.die = function(){//Let this die
    this.isLive = false;
}
Sprite.prototype.decreaseHP = function(damage){
    damage = damage || 1;
    this.hp -= damage;
    if(this.hp <= 0 && typeof(this.onDestroy) == "function"){
	this.onDestroy();
    }
}
Sprite.prototype.increaseHP = function(blood){
    blood = blood || 1;
    this.hp += blood;
    if(this.hp > this.maxHp) this.hp = this.maxHp;
}
//[Default]
Sprite.prototype.draw = function(context){
    //if(this instanceof EnemyTank) console.log(this._currentFrame);
    if(this._frames && this._frames[this._currentFrame] instanceof Image){
	//load children's draw first
	if(typeof(this.subDraw) == "function") this.subDraw(context);
	//just draw current frame
	context.save();
	context.drawImage(this._frames[this._currentFrame], this.position.x, this.position.y, this.width, this.height);
	context.restore();
    }
}
//[Need Implemented]draw before parent's draw
Sprite.prototype.subDraw = null;
//Forked when collided by other sprite
Sprite.prototype.onCollided = function(sponsor){}

/**
 * Stage------------------------------------------------------------------------
 * @type Class
 */
var Stage = function(canvas){
    this.canvas = canvas;
    this.canvas.style.backgroundColor = "black";//default bg
    this.context = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    //buffer
    this.bufferCanvas = document.createElement("canvas");
    this.bufferCanvas.setAttribute("width", this.width);
    this.bufferCanvas.setAttribute("height", this.height);
    this.bufferContext = this.bufferCanvas.getContext("2d");
    
    //this._durationFrame = 0;//How many frames have been passed
    //this._frameNum = 30;//Re-calculate FPS per _frameNum time
    //this._lastFrameTime = 0;
    //this._standardFps = 0;
    this._fps = 0;
    this._stepTime = 0;
    
    this._playerNumber = 0;
    
    this._sprites = [];
    
    this._timer = null;
    
    this._isStop = false;
    
    this._fpsShower = null;
    
    this._generator = new Generator(this);
}

Stage.prototype = new DisplayObject();
Stage.prototype.init = function(options){
    /*
    options = {
	fps: #number
	fpsShower: #DOM
	map: #MapObject
	playerNumber: #number
    }
    */
    options = options || {};
    
    this.setFPS(options.fps || 30);//By default
    this._fpsShower = options.fpsShower || null;
    
    //this._lastFrameTime = (new Date()).getTime();
    this.bufferContext.globalCompositeOperation = 'source-over';
    
    //set player number
    this._playerNumber = options.playerNumber || 1;
    
    //[Default]Map
    var defaultMap = {
	material: [
	    {
		"class": "Star", //[CONFIG]
		"maxQuantity": 3 //[CONFIG]how many materials will show on one-time at most
	    },
	    {
		"class": "Peach",
		"maxQuantity": 3
	    },
	    {
		"class": "Smaller",
		"maxQuantity": 3
	    }
	    //TODO
	],
	enemy: {
	    "maxQuantity": 3, //[CONFIG]the number of tanks that are intend to kept in show in one-time at most
	    "bornPlace": [ //the places where the enemies will born
		"0, 10", //[CONFIG]
		"200, 10", //[CONFIG]
		"400, 10" //[CONFIG]
	    ],
	    "enemies": [
		{
		    "class": "EnemyTankLevel1", //[CONFIG]
		    "targetQuantity": 10 //[CONFIG]how many tanks are intended to generated
		},
		{
		    "class": "EnemyTankLevel2", //[CONFIG]
		    "targetQuantity": 10 //[CONFIG]how many tanks are intended to generated
		}
	    ]
	},
	obstacle: [
	    {
		"class": "Wall",
		"place": [
		    "0, 10",
		    "0, 60"
		]
	    },
	    {
		"class": "Steel",
		"place": [
		    "30, 10",
		    "30, 60"
		]
	    }
	],
	//symbol: "0, 300",
	player:[
	    {
		"position": "20, 100", //[CONFIG]where to place a player
		"option":{
		    "hp": 3,
		    "keyMapping": {
			"left": KEY_LEFT, //[CONFIG]
			"up": KEY_UP, //[CONFIG]
			"right": KEY_RIGHT, //[CONFIG]
			"down": KEY_DOWN, //[CONFIG]
			"fire": KEY_SPACE //[CONFIG]
		    }
		}
	    },
	    {
		"position": "20, 200", //[CONFIG]where to place a player
		"option":{
		    "hp": 3,
		    "keyMapping": {
			"left": KEY_A, //[CONFIG]
			"up": KEY_W, //[CONFIG]
			"right": KEY_D, //[CONFIG]
			"down": KEY_S, //[CONFIG]
			"fire": KEY_J //[CONFIG]
		    }
		}
	    }
	]
    }
    
    //load Generator Configs
    this._generator.buildMap(options.map || defaultMap);
}
Stage.prototype.start = function(){
    //MediaManager.play("start");
    this.init.apply(this, arguments);
    this.render();//just start
}
Stage.prototype.setFPS = function(fps){
    this._standardFps = this._fps = fps;
    this._stepTime = Math.floor(1000 / this._fps);
}
Stage.prototype.calculateFPS = function(){
    this.showFPS();//show FPS
    /*
    this._durationFrame++;
    if(this._durationFrame % this._frameNum == 0){
	var t = (new Date()).getTime();
	this._fps = Math.round((this._frameNum * 10000) / (t - this._lastFrameTime)) / 10;
	this._lastFrameTime = t;
	
	this.showFPS();//show FPS
	//adjust fps
	if (this._fps < this._standardFps && this._stepTime > 10) {
	    this._stepTime--;
	} else if (this._fps > this._standardFps) {
	    this._stepTime++;
	}
	//clear record
	this._durationFrame = 0;
    }*/
}
Stage.prototype.addSprite = function(sprite){
    if(sprite instanceof Array){
	for(var i = 0; i < sprite.length; i++){
	    this.addSprite(sprite[i]);
	}
    }else if(sprite instanceof Sprite){
	//give reference
	sprite.stage = this;
	//join
	this._sprites.push(sprite);
	//if has private init function, here will call
	if(typeof(sprite.onAdd) == "function") sprite.onAdd();
    }
}
Stage.prototype.removeSprite = function(index){
    this._sprites[index] = this._sprites[this._sprites.length - 1];
    this._sprites.pop();
}
Stage.prototype.clear = function(context, fillStyle){
    context.save();
    if(fillStyle){
	context.fillStyle = fillStyle;
	context.fillRect(0, 0, this.width, this.height);
    }else{
	context.clearRect(0, 0, this.width, this.height);
    }
    context.restore();
}
Stage.prototype.render = function(){
    if(this._isStop) return;
    //calculate a new FPS & stepTime
    this.calculateFPS();
    //clear & fill with bg
    this.clear(this.bufferContext);
    //Generator Manager runs here
    this._generator.run();
    //load every sprite's logic
    for(var i = 0; i < this._sprites.length; i++){
	if(this._sprites[i] instanceof Sprite){
	    //remove dead children
	    if(this._sprites[i].isLive === false){
		//call generator's retrieve
		this._generator.retrieve(this._sprites[i]);
		//remove reference
		this.removeSprite(i);
		continue;
	    }
	    //run children's logic
	    if(typeof(this._sprites[i].runAnimation) == "function") this._sprites[i].runAnimation();
	    //draw children
	    this._sprites[i].draw(this.bufferContext);
	}
    }
    //draw on main canvas
    this.clear(this.context);
    this.context.drawImage(this.bufferCanvas, 0, 0);
    
    //new way of refresh (Use setTimeout instead of setInterval)
    this._timer = setTimeout((function(stage){
	return function(){ stage.render() };
    })(this), this._stepTime);
}
Stage.prototype.stop = function(){
    this._isStop = true;
    clearInterval(this._timer);
}
Stage.prototype.play = function(){
    if(this._isStop){
	this._isStop = false;
	this.render();
    }
}
Stage.prototype.getSpriteInPosition = function(position){
    //looping to find
    for(var i = 0; i < this._sprites.length; i++){
	if(this._sprites[i].isPositionIn(position)){
	    return this._sprites[i];
	}
    }
    return null;
}
//Get composite objects by given object(the second param is passed to exclude any sprite)
//(!!!NOTE!!! Here may need to be optimized)
Stage.prototype.getCompositeSprites = function(rectangle, sprite){
    var compositeSprites = [];
    for(var i = 0; i < this._sprites.length; i++){
	if(this._sprites[i] instanceof Sprite){
	    if(this._sprites[i] !== sprite &&
	       this.checkRectComposite(this._sprites[i].toRectangle(), rectangle)){
		compositeSprites.push(this._sprites[i]);
	    }
	}
    }
    return compositeSprites;
}
//"Composite Test" for rectangle
Stage.prototype.checkRectComposite = function(a, b){
    //check
    if(b.x1 >= a.x2 || b.x2 <= a.x1 || b.y1 >= a.y2 || b.y2 <= a.y1){
	return false;
    }
    return true;
}
//check if "rect" is out of "container", both params are Rectangle
Stage.prototype.checkRectOut = function(container, rect){
    return !(rect.x1 >= container.x1 &&
	    rect.x2 <= container.x2 &&
	    rect.y1 >= container.y1 &&
	    rect.y2 <= container.y2);
}
Stage.prototype.showFPS = function(){
    if(this._fpsShower){
	this._fpsShower.innerText = "FPS:" + this._fps + "; StepTime:" + this._stepTime;
    }
}
Stage.prototype.drawGameOver = function(){
    var title = "Game Over !";
    this.context.save();
    this.context.lineWidth = 2;
    this.context.font = "italic 100px serif";
    var metrics = this.context.measureText(title);
    var x = Math.floor((this.width - metrics.width)/2);
    var y = Math.floor(this.height/2);
    this.context.fillStyle = "rgba(255, 0, 0, 1)";
    this.context.fillText(title, x, y);
    this.context.strokeStyle = "rgba(255, 255, 255, 1)";
    this.context.strokeText(title, x, y);
    this.context.restore();
}
Stage.prototype.gameOver = function(){
    this.stop();
    this.drawGameOver();
    //TODO
}
/**
 * Generators-------------------------------------------------------------------
 * @type Class
 * @description 
 */
var Generator = function(stage){
    this.stage = stage;
    this._material = [//By default
	/*
	{
	    "class": Star, //[CONFIG]
	    "generated": 0, //[SYSTEM]
	    "maxQuantity": 3 //[CONFIG]how many materials will show on one-time at most
	}
	*/
    ];
    this._enemy = {//By default
	"live": 0, //[SYSTEM]the number of tanks are currently in show
	"maxQuantity": 10, //[CONFIG]the number of tanks that are intend to kept in show in one-time at most
	"totalGenerated": 0, //[SYSTEM]total generated
	"totalTargetQuantity": 0, //[SYSTEM]total target quantity(WILL COUNT WHEN LOADING AUTOMATICALLY)
	"bornPlace": [ //[CONFIG]the places where the enemies will born
	    /*
	    new Vector2(0, 0)
	    */
	],
	"enemies": [
	    /*
	    {
		"class": EnemyTankLevel1, //[CONFIG]
		"generated": 0, //[SYSTEM]
		"targetQuantity": 10 //[CONFIG]how many tanks are intended to generated
	    }
	    */
	]
    };
    this._player = [];
}

//[Event Dispatcher]for PlayerTank's event
Generator.prototype.onPlayerEvent = function(func, e){
    for(var i = 0; i < this._player.length; i++){
	var player = this._player[i];
	if(typeof(player[func]) == "function") player[func](e);
    }
    //Stop default behavior such as "Scroll when arrow-key is down"
    if([KEY_SPACE, KEY_UP, KEY_DOWN, KEY_LEFT, KEY_RIGHT].indexOf(e.keyCode) != -1){
	e.preventDefault();
    }
}

Generator.prototype.buildMap = function(map){
    if(map.symbol) this.makeSymbol(map.symbol);
    if(map.obstacle) this.makeObstacle(map.obstacle);
    if(map.material) this.loadMaterialConfig(map.material);
    if(map.enemy) this.loadEnemyConfig(map.enemy);
    if(map.player) this.makePlayer(map.player);
}

Generator.prototype.makePlayer = function(config){
    /* [Config Format]
    config = [
	{
	    "position": new Vector2(0, 20), //[CONFIG]where to place a player
	    "option":{
		"hp": 1,
		"keyMapping": {
		    "left": KEY_LEFT, //[CONFIG]
		    "up": KEY_UP, //[CONFIG]
		    "right": KEY_RIGHT, //[CONFIG]
		    "down": KEY_DOWN, //[CONFIG]
		    "fire": KEY_SPACE //[CONFIG]
		}
	    }
	}
    ];
    */
    for(var i = 0; i < this.stage._playerNumber; i++){
	var player = config[i];
	player["position"] = stringToVector2(player["position"]);//trans string into Vector2
	var playerInstance = new PlayerTank(player["position"].x, player["position"].y, player["option"]);
	//bind key event to our Event Dispatcher
	/*
	document.addEventListener('keydown', (function(gen){
	    return function(e){gen.onPlayerEvent("onKeyDown", e)}
	})(this));
	document.addEventListener('keyup', (function(gen){
	    return function(e){gen.onPlayerEvent("onKeyUp", e)}
	})(this));
	*/
	$this = this;
	document.onkeydown = function(e){$this.onPlayerEvent("onKeyDown", e)};
	document.onkeyup = function(e){$this.onPlayerEvent("onKeyUp", e)};
	//track player
	this._player.push(playerInstance);
	//join into stage
	this.stage.addSprite(playerInstance);
    }
}

Generator.prototype.makeSymbol = function(position){
    /* [Config Format]
    symbol: new Vector2(500, 500), //[CONFIG]
    */
    position = stringToVector2(position);//trans string into Vector2
    this.stage.addSprite(new Symbol(position.x, position.y));
}

//just make obstacles once
Generator.prototype.makeObstacle = function(config){
    /* [Config Format]
    config = [
	{
	    "class": Wall, //[CONFIG]
	    "place": [ //[CONFIG]where to place a obstacle
		new Vector2(0, 20) //[CONFIG]
	    ]
	}
    ];
    */
    for(var i = 0; i < config.length; i++){
	var raw = config[i];
	raw["class"] = stringToClass(raw["class"]);//support string class
	for(var j = 0; j < raw["place"].length; j++){
	    raw["place"][j] = stringToVector2(raw["place"][j]);//trans string into Vector2
	    var place = raw["place"][j];
	    //join into stage
	    this.stage.addSprite(new raw["class"](place.x, place.y));
	}
    }
}

Generator.prototype.loadMaterialConfig = function(config){
    /* [Config Format]
    config = [
	{
	    "class": Star, //[CONFIG]
	    "maxQuantity": 3 //[CONFIG]how many materials will show on one-time at most
	}
    ];
    */
    for(var i = 0; i < config.length; i++){
	var raw = config[i];
	raw["class"] = stringToClass(raw["class"]);//support string class
	//add & init extra attributes
	raw["generated"] = 0;
	//join into Generator
	this._material.push(raw);
    }
};
Generator.prototype.loadEnemyConfig = function(config){
    /* [Config Format]
    config = {
	"maxQuantity": 10, //[CONFIG]the number of tanks that are intend to kept in show in one-time at most
	"bornPlace": [ //[CONFIG]the places where the enemies will born
	    new Vector2(0, 0)
	],
	"enemies": [
	    {
		"class": EnemyTankLevel1, //[CONFIG]
		"targetQuantity": 10 //[CONFIG]how many tanks are intended to generated
	    }
	]
    };
    */
    if(config["maxQuantity"] != undefined) this._enemy["maxQuantity"] = config["maxQuantity"];
    if(config["bornPlace"] != undefined){
	//trans string into Vector2
	for(var i = 0; i < config["bornPlace"].length; i++){
	    config["bornPlace"][i] = stringToVector2(config["bornPlace"][i]);
	}
	this._enemy["bornPlace"] = config["bornPlace"];
    }
    if(config["enemies"] != undefined){
	for(var i = 0; i < config["enemies"].length; i++){
	    var raw = config["enemies"][i];
	    raw["class"] = stringToClass(raw["class"]);//support string class
	    //add & init extra attributes
	    raw["generated"] = 0;
	    //join into Generator
	    this._enemy["enemies"].push(raw);
	    //count Total Target Quantity
	    this._enemy["totalTargetQuantity"] += raw["targetQuantity"];
	}
    }
};
Generator.prototype.run = function(){
    //[*].for Material
    for(var i = 0; i < this._material.length; i++){
	var mat = this._material[i];
	if(mat["generated"] < mat["maxQuantity"]){
	    //generate one in random
	    var rand = Math.floor(Math.random() * 1000);
	    if(rand == 1){
		var x = Math.floor(Math.random() * (this.stage.width - Material.width));
		var y = Math.floor(Math.random() * (this.stage.height - Material.height));
		this.stage.addSprite(new mat["class"](x, y));
		mat["generated"]++;
	    }
	}
    }
    //[*].for EnemyTank
    if(this._enemy["totalGenerated"] < this._enemy["totalTargetQuantity"] &&
       this._enemy["live"] < this._enemy["maxQuantity"]){//now we will create new ONE
	
	//just choose a random Enemy to create
	var i = Math.floor(Math.random() * this._enemy["enemies"].length); //(0 - length)
	var enemy = this._enemy["enemies"][i];
	if(enemy["generated"] < enemy["targetQuantity"]){//if not exceed the target number
	    //get a random place to born
	    var place = Math.floor(Math.random() * this._enemy["bornPlace"].length);
	    var x = this._enemy["bornPlace"][place].x;
	    var y = this._enemy["bornPlace"][place].y;
	    //check if there already standing a sprite
	    var placeRect = new enemy["class"](x, y).toRectangle();
	    if(this.stage.getCompositeSprites(placeRect).length <= 0){
		//join
		this.stage.addSprite(new enemy["class"](x, y));
		//count generated
		enemy["generated"] ++;
		this._enemy["totalGenerated"] ++;
		//count lived
		this._enemy["live"] ++;
	    }
	}
    }
}
//Forked when any sprite dead
Generator.prototype.retrieve = function(sprite){
    //[*].for Material
    if(sprite instanceof Material){
	for(var i = 0; i < this._material.length; i++){
	    var mat = this._material[i];
	    if(sprite instanceof mat["class"]){
		mat["generated"]--;
		break;
	    }
	}
    }
    //[*].for Enemy
    else if(sprite instanceof EnemyTank){
	this._enemy["live"] --;
	//check if all enemies are destroyed, to load Victory
	if(this._enemy["live"] <= 0 &&
	   this._enemy["totalGenerated"] >= this._enemy["totalTargetQuantity"]){
	    
	    alert("You Win!!!");
	    //TODO
	}
    }
    //[*].for PlayerTank
    else if(sprite instanceof PlayerTank){//remove it from Generator
	for(var i = 0; i < this._player.length; i++){
	    if(this._player[i] === sprite){
		this._player.splice(i, 1);
		break;
	    }
	}
    }
}
