/**
 * Function tools for all
 */

//search a Hash(object), return the attribute name
function hashSearch(hash, needle){
    for(var attr in hash){
	if(hash[attr] == needle) return attr;
    }
    return "";
}

//trans className into Class Literal
function stringToClass(className){
    if(typeof(className) == "string") return eval(className);
    return className;
}

//trans pos string into Vector2
function stringToVector2(pos){
    if(typeof(pos) == "string"){
	var tmp = pos.split(",");
	return new Vector2(parseFloat(tmp[0]), parseFloat(tmp[1]));
    }
    return pos;
}

//clone
function clone(obj, isDeep){
    isDeep = isDeep || false;
    var replica = Object.prototype.toString.call(obj) === "[object Array]" ? [] : {};
    for(var x in obj){
	if(isDeep && typeof(obj[x]) == "object"){
	    replica[x] = arguments.callee(obj[x], isDeep);
	}else{
	    replica[x] = obj[x];
	}
    }
    return replica;
}

//inherit
function inherit(subClass, superClass){
    var prototype = clone(superClass.prototype, true);
    prototype.constructor = subClass;
    subClass.prototype = prototype;
}