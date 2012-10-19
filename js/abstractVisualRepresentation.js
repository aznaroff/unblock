function Visual(game) {
	//init
	var events = new Array();
	var listeners = new Array();
	var size = {
		width: 300,
		height: 300
	};
	var tileSize = 0;
	var game = game;
	var paddingOut = 10;
	var paddingIn = 3;
	var elements = {
		controls: {
			info: {
				top: 0,
				right: 0,
				bottom: 0,
				left:0,
				value: 0,
				fontSize: 0
			},
			leftArrow: {
				top: 0,
				right: 0,
				bottom: 0,
				left:0,
				value: '<',
				fontSize: 0
			},
			rightArrow: {
				top: 0,
				right: 0,
				bottom: 0,
				left:0,
				value: '>',
				fontSize: 0
			}
		},
		grille: {
			top: 0,
			right: 0,
			bottom: 0,
			left:0,
			blocks: new Array()
		}
	};
	var lastBlock = null;
	var dragging = false;
	var moved = false;
	var start = {
		x: 0,
		y: 0
	};
	var winMessage = "you win";
	game.addEventListener("changelevel", changeLevelCallback);
	game.addEventListener("moveblock", moveBlockCallback);
	game.addEventListener("win", winCallback);
	
	//callback
	function changeLevelCallback() {
		updateElements();
		dispatch("changelevel");
	}
	function moveBlockCallback(block) {
		visualBlock = elements.grille.blocks[block.index];
		updateBlock(visualBlock, block);
		dispatch("moveblock", visualBlock);
	}
	function winCallback() {
		lastBlock = null;
		dispatch("win");
	}
	
	//fonctions internes
	function updateElements() {
		tileSize = Math.min(Math.floor((size.width-2*paddingOut)/6),Math.floor((size.height-3*paddingOut)/7));
		
		elements.grille.left = Math.floor((size.width-6*tileSize)/2);
		elements.grille.right = elements.grille.left +6*tileSize;
		elements.grille.top = Math.floor((size.height-(7*tileSize+paddingOut))/2)+paddingOut+tileSize;
		elements.grille.bottom = elements.grille.top + 6*tileSize;
		
		elements.controls.top = Math.floor((size.height-(7*tileSize+paddingOut))/2);
		elements.controls.bottom = elements.controls.top+tileSize;
		elements.controls.left = elements.grille.left;
		elements.controls.right = elements.grille.right;
		
		elements.controls.leftArrow.top = elements.controls.top;
		elements.controls.leftArrow.bottom = elements.controls.bottom;
		elements.controls.leftArrow.left = elements.controls.left;
		elements.controls.leftArrow.right = elements.controls.leftArrow.left + tileSize;
		elements.controls.leftArrow.fontSize = tileSize-paddingOut/2.5;
		
		elements.controls.rightArrow.top = elements.controls.top;
		elements.controls.rightArrow.bottom = elements.controls.bottom;
		elements.controls.rightArrow.right = elements.controls.right;
		elements.controls.rightArrow.left = elements.controls.rightArrow.right - tileSize;
		elements.controls.rightArrow.fontSize = tileSize-paddingOut/2.5;
		
		elements.controls.info.value = game.getCurrentLevelIndex() + 1;
		elements.controls.info.fontSize = tileSize-paddingOut/2.5;
		elements.controls.info.top = elements.controls.top;
		elements.controls.info.right =elements.controls.rightArrow.left;
		elements.controls.info.bottom = elements.controls.bottom;
		elements.controls.info.left = elements.controls.leftArrow.right;
		
		var blocks = game.getBlocks();
		elements.grille.blocks = new Array();
		for(var i=0; i<blocks.length; i++) {
			var block = new Object;
			block.top = elements.grille.top + blocks[i].coord.y*tileSize+paddingIn;
			block.left = elements.grille.left + blocks[i].coord.x*tileSize+paddingIn;
			if(blocks[i].orientation == "horizontal") {
				block.right = block.left+blocks[i].size*tileSize-2*paddingIn;
				block.bottom = block.top+tileSize-2*paddingIn;
			} else {
				block.bottom = block.top+blocks[i].size*tileSize-2*paddingIn;
				block.right = block.left+tileSize-2*paddingIn;
			}
			if(blocks[i].important)
				block.important = true;
			elements.grille.blocks.push(block);
		}
	}
	function updateBlock(visualBlock, block) {
		if(block.orientation == "horizontal") {
			visualBlock.left = elements.grille.left + block.coord.x*tileSize+paddingIn;
			visualBlock.right = visualBlock.left+block.size*tileSize-2*paddingIn;
			
			visualBlock.frame = new Object;
			visualBlock.frame.top = visualBlock.top;
			visualBlock.frame.bottom = visualBlock.bottom;
			
			visualBlock.frame.left = elements.grille.left + block.offsetMin*tileSize + paddingIn;
			visualBlock.frame.right = elements.grille.left + (block.offsetMax+1)*tileSize - paddingIn;
		} else {
			visualBlock.top = elements.grille.top + block.coord.y*tileSize+paddingIn;
			visualBlock.bottom = visualBlock.top+block.size*tileSize-2*paddingIn;
			
			visualBlock.frame = new Object;
			visualBlock.frame.left = visualBlock.left;
			visualBlock.frame.right = visualBlock.right;
			
			visualBlock.frame.top = elements.grille.top + block.offsetMin*tileSize + paddingIn;
			visualBlock.frame.bottom = elements.grille.top + (block.offsetMax+1)*tileSize - paddingIn;
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
	function getBlock(x, y) {
		x -= elements.grille.left;
		y -= elements.grille.top;
		var offsetx = Math.floor(x/tileSize);
		var offsety = Math.floor(y/tileSize);
		return game.getBlock(offsetx, offsety);
	}
	function smoothMoveBlock(block, x, y) {
		var moved = false;
		var visualBlock = elements.grille.blocks[block.index];
		if(block.orientation == "horizontal") {
			var diffx = start.x - (block.coord.x*tileSize+elements.grille.left);
			var left = x - diffx + paddingIn;
			if(left < block.offsetMin*tileSize + elements.grille.left + paddingIn)
				left = block.offsetMin*tileSize + elements.grille.left + paddingIn;
			if(left > (block.offsetMax+1-block.size)*tileSize + elements.grille.left + paddingIn)
				left = (block.offsetMax+1-block.size)*tileSize + elements.grille.left + paddingIn;
			if(left != visualBlock.left) {
				visualBlock.left = left;
				visualBlock.right = left + block.size*tileSize - 2*paddingIn;
				dispatch("moveblock", visualBlock);
				moved = true;
			}
		} else {
			var diffy = start.y - (block.coord.y*tileSize+elements.grille.top);
			var top = y - diffy + paddingIn;
			if(top < block.offsetMin*tileSize + elements.grille.top + paddingIn)
				top = block.offsetMin*tileSize + elements.grille.top + paddingIn;
			if(top > (block.offsetMax+1-block.size)*tileSize + elements.grille.top + paddingIn)
				top = (block.offsetMax+1-block.size)*tileSize + elements.grille.top + paddingIn;
			if(top != visualBlock.top) {
				visualBlock.top = top;
				visualBlock.bottom = top + block.size*tileSize - 2*paddingIn;
				dispatch("moveblock", visualBlock);
				moved = true;
			}
		}
		if(moved && block.orientation == "horizontal" && block.coord.y == 2) {
			var diffx = start.x - (block.coord.x*tileSize+elements.grille.left);
			var left = x - diffx - elements.grille.left;
			if(left > (block.offsetMax+1-block.size)*tileSize)
				left = (block.offsetMax+1-block.size)*tileSize;
			if(left/tileSize > 3.5) {
				dragging = false;
				game.moveBlock(block, 4);
			}
		}
	}
	function moveBlock(block, x, y) {
		var visualBlock = elements.grille.blocks[block.index];
		if(block.orientation == "horizontal") {
			var diffx = start.x - (block.coord.x*tileSize+elements.grille.left);
			var left = x - diffx - elements.grille.left;
			var offsetx = Math.floor(left/tileSize);
			if(left/tileSize - offsetx > 0.5)
				offsetx++;
			if(offsetx < block.offsetMin)
				offsetx = block.offsetMin;
			if(offsetx > block.offsetMax - block.size + 1)
				offsetx = block.offsetMax - block.size + 1;
			offsetx -= block.coord.x;
			
			if(offsetx == 0) {
				visualBlock.left = elements.grille.left + block.coord.x*tileSize + paddingIn;
				visualBlock.right = visualBlock.left + block.size*tileSize - 2*paddingIn;
				dispatch("moveblock", visualBlock);
			} else {
				game.moveBlock(block, offsetx);
			}
		} else {
			var diffy = start.y - (block.coord.y*tileSize+elements.grille.top);
			var top = y - diffy - elements.grille.top;
			var offsety = Math.floor(top/tileSize);
			if(top/tileSize - offsety > 0.5)
				offsety++;
			if(offsety < block.offsetMin)
				offsety = block.offsetMin;
			if(offsety > block.offsetMax - block.size + 1)
				offsety = block.offsetMax - block.size + 1;
			offsety -= block.coord.y;
			
			if(offsety == 0) {
				visualBlock.top = elements.grille.top + block.coord.y*tileSize + paddingIn;
				visualBlock.bottom = visualBlock.top + block.size*tileSize - 2*paddingIn;
				dispatch("moveblock", visualBlock);
			} else {
				game.moveBlock(block, offsety);
			}
		}
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
	this.pointerDown = function(x, y) {
		moved = false;
		var block = getBlock(x, y);
		if(block) {
			lastBlock = block;
			var visualBlock = elements.grille.blocks[block.index];
			dragging = true;
			start.x = x;
			start.y = y;
			updateBlock(visualBlock, block);
		}
	};
	this.pointerMove = function(x, y) {
		moved = true;
		if(dragging) {
			smoothMoveBlock(lastBlock, x, y);
		} else {
			if(x >= elements.grille.left && x <= elements.grille.right && y >= elements.grille.top && y <= elements.grille.bottom) {
				var block = getBlock(x, y);
				if(block)
					lastBlock = block;
			} else
				lastBlock = null;
		}
	};
	this.pointerUp = function(x, y) {
		if(dragging) {
			if(!moved) {
				var visualBlock = elements.grille.blocks[lastBlock.index];
				if(lastBlock.orientation == "horizontal") {
					x -= visualBlock.left;
					if(x > Math.floor((visualBlock.right - visualBlock.left)/2))
						game.moveBlock(lastBlock, 1);
					else
						game.moveBlock(lastBlock, -1);
				} else {
					y -= visualBlock.top;
					if(y > Math.floor((visualBlock.bottom - visualBlock.top)/2))
						game.moveBlock(lastBlock, 1);
					else
						game.moveBlock(lastBlock, -1);
				}
			} else
				moveBlock(lastBlock, x, y);
		} else {
			if(!moved && x >= elements.controls.leftArrow.left && x <= elements.controls.leftArrow.right && y >= elements.controls.leftArrow.top && y <= elements.controls.leftArrow.bottom) {
				game.previousLevel();
			}
			if(!moved && x >= elements.controls.rightArrow.left && x <= elements.controls.rightArrow.right && y >= elements.controls.rightArrow.top && y <= elements.controls.rightArrow.bottom) {
				game.nextLevel();
			}
		}
		dragging = false;
	};
	this.wheeling = function(x, y, offset) {
		if(!dragging) {
			var block = getBlock(x, y);
			if(block)
				lastBlock = block;
			game.moveBlock(lastBlock, offset);
			if(x >=elements.controls.left && x <= elements.controls.right && y >= elements.controls.top && y <= elements.controls.bottom) {
				if(offset > 0)
					game.nextLevel();
				else
					game.previousLevel();
			}
		}
	};
	this.setSize = function(width, height) {
		size.width = width;
		size.height = height;
		updateElements();
		dispatch("changelevel");
	};
	this.getElements = function() {
		return elements;
	};
	this.setPaddingIn = function(value) {
		paddingIn = value;
	};
	this.setPaddingOut = function(value) {
		paddingOut = value;
	};
	this.getWinMessage = function() {
		return winMessage;
	};
	this.setWinMessage = function(value) {
		winMessage = value;
	};
	this.getSize = function() {
		return size;
	};
	//events
	/*
		moveblock {block}
		changelevel {}
		win {}
	*/
}
