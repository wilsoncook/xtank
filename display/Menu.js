/**
 * Menu-------------------------------------------------------------------------
 * @type Class
 */

var Menu = function(canvas){
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.canvas.style.backgroundColor = "black";
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    this._timer = null;
    this._translateY = this.height;//scroll start pos
    //---> menu options
    this.options = [
	"Single Player",
	"Two Player",
	"Create New Map"
    ];
    this.presentOptionIndex = 0;//current option
    this.optoinX = this.width / 2 - 50;
    this.optionY = this.height / 2;
    this.tankWidth = 20;
    this.tankHeight = 20;
}
Menu.prototype.destruct = function(){
    //remove event handler
    document.onkeydown = null;
    //remove other references
    //TODO
}
Menu.prototype.onKeyDown = function(e){
    //---> choose option
    if([KEY_UP, KEY_DOWN].indexOf(e.keyCode) != -1){
	this.chooseOption(e.keyCode);
    }
    //---> execute option
    else if(e.keyCode == KEY_SPACE){
	this.executeOption(this.presentOptionIndex);
    }
}
Menu.prototype.chooseOption = function(keyCode){
    //choose option
    switch(keyCode){
	case KEY_UP:
	    this.presentOptionIndex--;
	    break;
	case KEY_DOWN:
	    this.presentOptionIndex++;
	    break;
    }
    //adjust
    if(this.presentOptionIndex < 0) this.presentOptionIndex = 0;
    if(this.presentOptionIndex >= this.options.length) this.presentOptionIndex = this.options.length - 1;
    //re-render
    this.render();
}
Menu.prototype.executeOption = function(optionIndex){
    switch(optionIndex){
	case 0: //Single Player
	case 1: //Two Player
	    //destroy menu
	    this.destruct();
	    //start new game
	    new Stage(this.canvas).start({
		fps: 60,
		playerNumber: optionIndex + 1
	    });
	    break;
	case 2: //Create New Map
	    alert("Under construction...");
	    break;
    }
}

Menu.prototype.start = function(){
    this._timer = setInterval((function(inst){
	return function(e){
	    if(inst._translateY <= 0){//do run menu
		clearInterval(inst._timer);
		//bind event
		if(typeof(inst.onKeyDown) == "function"){
		    document.onkeydown = function(e){inst.onKeyDown(e)};
		}
	    }else{//loading animation
		inst.context.save();
		//translate to scroll up
		inst._translateY -= 50;
		inst.context.translate(0, inst._translateY);
		//render
		inst.render();
		
		inst.context.restore();
	    }
	};
    })(this), 16);
}
Menu.prototype.render = function(){
    this.clear(this.context, "black");
    //---> draw title
    this.drawTitle();
    //---> draw menu options
    this.drawOption();
    //---> draw bottom
    this.drawBottom();
}
Menu.prototype.drawTitle = function(){
    this.context.save();
    //this.context.strokeStyle = "rgba(255, 255, 255, 1)";
    this.context.fillStyle = "rgba(0, 0, 255, 1)";
    this.context.font = "100px Comic Sans MS";
    this.context.textAlign = "center";
    this.context.shadowOffsetX = 5;
    this.context.shadowOffsetY = 2;
    this.context.shadowBlur = 10;
    this.context.shadowColor = "rgba(255, 255, 255, 0.9)";
    
    this.context.fillText("X tank", this.width / 2, 150);
    //this.context.strokeText("X tank", this.width / 2, 150);
    this.context.restore();
}
Menu.prototype.drawOption = function(){
    this.context.save();
    this.context.translate(this.optoinX, this.optionY);
    //---> tank position
    var tankY = this.presentOptionIndex * this.tankHeight;
    this.context.drawImage(ImageManager.repository["player1"]["right"], 0, tankY, this.tankWidth, this.tankHeight);
    //---> option text
    this.context.fillStyle = "rgba(255, 0, 0, 1)";
    this.context.strokeStyle = "rgba(255, 255, 255, 0.2)";
    this.context.font = "12px Times New Roman";
    for(var i = 0; i < this.options.length; i++){
	this.context.fillText(this.options[i], this.tankWidth + 5, (i + 1) * (this.tankHeight - 2));
	this.context.strokeText(this.options[i], this.tankWidth + 5, (i + 1) * (this.tankHeight - 2));
    }
    this.context.restore();
}
Menu.prototype.drawBottom = function(){
    this.context.save();
    this.context.translate(20, this.height - 20);
    //---> bottom text
    this.context.fillStyle = "rgba(255, 255, 255, 1)";
    this.context.font = "12px Times New Roman";
    this.context.fillText("Powered by Wilson.Zeng ( jackzcs@gmail.com ) , 12 / 04 / 2011", 0, 0);
    
    this.context.restore();
}

Menu.prototype.clear = function(context, fillStyle){
    context.save();
    if(fillStyle){
	context.fillStyle = fillStyle;
	context.fillRect(0, 0, this.width, this.height);
    }else{
	context.clearRect(0, 0, this.width, this.height);
    }
    context.restore();
}