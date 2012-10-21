function Game() {
	//init
	var events = new Array();
	var listeners = new Array();
	var blocks = new Array();
	var collisionsMap = new Array();
	var currentLevelIndex = 0;
	var levelLoaderLength = null;
	var levelLoader = null;
	
	//internal functions
	function generateCollisionsMap() {
		//reinit collisionsMap
		collisionsMap = new Array(null, null, null, null, null, null);
		for(var i=0; i < 6; i++) {
			collisionsMap[i] = new Array(null, null, null, null, null, null);
		}
		for(var i=0; i < blocks.length; i++) {
			if(blocks[i].orientation == "vertical") {
				for(var j=0; j < blocks[i].size ; j++)
					collisionsMap[blocks[i].coord.x][blocks[i].coord.y+j] = blocks[i];
			} else {
				for(var j=0; j < blocks[i].size ; j++)
					collisionsMap[blocks[i].coord.x+j][blocks[i].coord.y] = blocks[i];
			}
		}
	}
	
	function dispatch(event, data) {
		var index = events.indexOf(event);
		if(index != -1) {
			for(var i=0; i<listeners[index].length; i++) {
					listeners[index][i](data);
			}
		}
	}
	
	function loadLevel(index) {
		blocks = levelLoader(index);
		generateCollisionsMap();
		dispatch("changelevel");
		dispatch("levelindex", currentLevelIndex);
	}
	
	function prepareBlock(block) { // trouve l'offsetMax et l'offsetMin
		if(block.orientation == "horizontal") {
			offsetMax = 5;
			offsetMin = 0;
			var i = block.coord.x;
			i--;
			while(i >= 0) {
				if(collisionsMap[i][block.coord.y]) {
					offsetMin = i+1;
					i = 0;
				}
				i--;
			}
			var i = block.coord.x;
			i += block.size;
			while(i <6) {
				if(collisionsMap[i][block.coord.y]) {
					offsetMax = i-1;
					i = 6;
				}
				i++;
			}
		} else {
			offsetMax = 5;
			offsetMin = 0;
			var i = block.coord.y;
			i--;
			while(i >= 0) {
				if(collisionsMap[block.coord.x][i]) {
					offsetMin = i+1;
					i = 0;
				}
				i--;
			}
			var i = block.coord.y;
			i += block.size;
			while(i <6) {
				if(collisionsMap[block.coord.x][i]) {
					offsetMax = i-1;
					i = 6;
				}
				i++;
			}
		}
		block.offsetMax = offsetMax;
		block.offsetMin = offsetMin;
	}
	
	//apis
	this.addEventListener = function(event, callback) {
		var index = events.indexOf(event);
		if(index == -1) {
			events.push(event);
			listeners.push(new Array(callback));
		} else {
			if(listeners[index].indexOf(callback) == -1)
				listeners[index].push(callback);
		}
	};
	this.removeEventListener = function(event, callback) {
		var index = events.indexOf(event);
		if(index != -1) {
			var indexCallback = listeners[index].indexOf(callback);
			if(indexCallback != -1)
				listeners[index].splice(indexCallback, 1);
		}
	};
	this.getCurrentLevelIndex = function() {
		return currentLevelIndex;
	};
	this.setLevelLoader = function(callback) {
		currentLevelIndex = 0;
		levelLoader = callback;
		loadLevel(currentLevelIndex);
	};
	this.setLevelsLoaderLength = function(callback) {
		levelLoaderLength = callback;
	};
	this.getBlock = function(offsetX, offsetY) {
		if(offsetX >= 0 && offsetX < 6 && offsetY >= 0 && offsetY < 6) {
			var block = collisionsMap[offsetX][offsetY];
			if(block) {
				prepareBlock(block);
				return block;
			}
			else
				return null;
		}
	};
	this.getBlocks = function() {
		return blocks;
	};
	this.moveBlock = function(block, offset) {
		if(block) {
			prepareBlock(block);
			if(block.orientation == "horizontal") {
				if(offset < 0) {
					var realOffset = block.coord.x + offset;
					if(realOffset < block.offsetMin)
						realOffset = block.offsetMin;
					if(realOffset != block.coord.x) {
						block.coord.x = realOffset;
						generateCollisionsMap();
						dispatch("moveblock", block);
					}
				} else if(offset > 0) {
					var realOffset = block.coord.x + offset;
					if(realOffset > block.offsetMax - block.size + 1)
						realOffset = block.offsetMax - block.size + 1;
					if(realOffset != block.coord.x) {
						block.coord.x = realOffset;
						generateCollisionsMap();
						dispatch("moveblock", block);
					}
				}
			} else {
				if(offset < 0) {
					var realOffset = block.coord.y + offset;
					if(realOffset < block.offsetMin)
						realOffset = block.offsetMin;
					if(realOffset != block.coord.y) {
						block.coord.y = realOffset;
						generateCollisionsMap();
						dispatch("moveblock", block);
					}
				} else if(offset > 0) {
					var realOffset = block.coord.y + offset;
					if(realOffset > block.offsetMax - block.size + 1)
						realOffset = block.offsetMax - block.size + 1;
					if(realOffset != block.coord.y) {
						block.coord.y = realOffset;
						generateCollisionsMap();
						dispatch("moveblock", block);
					}
				}
			}
			if(block.important && block.coord.x == 4) {
				dispatch("win");
				this.nextLevel();
			}
		}
	};
	this.nextLevel = function() {
		currentLevelIndex++;
		if(currentLevelIndex >= levelLoaderLength())
			currentLevelIndex = 0;
		loadLevel(currentLevelIndex);
	};
	this.previousLevel = function() {
		currentLevelIndex--;
		if(currentLevelIndex < 0)
			currentLevelIndex = levelLoaderLength() - 1;
		loadLevel(currentLevelIndex);
	};
	this.selectLevel = function(index) {
		if(index < 0)
			index = 0;
		else if(index > levelLoaderLength() - 1)
			index = levelLoaderLength() - 1;
		currentLevelIndex = index;
		loadLevel(index);
	};
	
	//events
	/*
		moveblock {block}
		win {}
		changelevel {}
		levelindex {currentLevelIndex}
	*/
}
