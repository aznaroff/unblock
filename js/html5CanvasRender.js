function Render(visual, id) {
	//init
	var canvas = document.querySelector('#' + id);
	var ctx = canvas.getContext("2d");
	var last = {
		x: 0,
		y: 0
	};
	var popupConfig = {
		left:100,
		top:10,
		width: 200,
		lineWidth: 2,
		winMessage: "you win",
		fontColor: "#666",
		borderColor: "#aaa",
		backgroundColor: "#fff",
		animationDuration: 700
	};
	var drawPopup = false;
	var elements;
	visual.addEventListener("changelevel", function() {
		console.log("changelevel");
		changeLevelCallback();
	});
	visual.addEventListener("moveblock", function(block) {
		console.log("moveblock");
		ctx.strokeStyle = "#000";
		ctx.lineWidth = 1;
	
		if(block.important)
			ctx.fillStyle = '#f00';
		else
			ctx.fillStyle = '#000';
		ctx.clearRect(block.frame.left, block.frame.top, block.frame.right - block.frame.left, block.frame.bottom - block.frame.top);
		ctx.fillRect(block.left, block.top, block.right-block.left, block.bottom-block.top);
	});
	visual.addEventListener("win", function() {
		drawPopup = true;
		popupConfig.left = elements.controls.info.left;
		popupConfig.width = elements.controls.info.right - elements.controls.info.left;
		popupConfig.height = Math.floor(popupConfig.width/2.5);
		popupConfig.top = (elements.grille.bottom - elements.grille.top)/2 + elements.grille.top - (popupConfig.height/2);
		
		setTimeout(function(){
			drawPopup = false;
			changeLevelCallback();
		}, popupConfig.animationDuration);
	});
	document.addEventListener("DOMMouseScroll", function(event) {//firefox
		if(!drawPopup) {
			visual.wheeling(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, event.detail/Math.abs(event.detail));
		}
		event.preventDefault();
	}, false);
	document.addEventListener("mousewheel", function(event) {//webkit
		if(!drawPopup) {
			visual.wheeling(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, -1*(event.wheelDelta/120));
		}
		event.preventDefault();
	}, false);
	document.addEventListener("mousemove", function(event) {
		if(!drawPopup) {
			visual.pointerMove(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
		}
		event.preventDefault();
	}, false);
	document.addEventListener("mousedown", function(event) {
		if(!drawPopup) {
			visual.pointerDown(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
		}
		event.preventDefault();
	}, false);
	document.addEventListener("mouseup", function(event) {
		if(!drawPopup) {
			visual.pointerUp(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
		}
		event.preventDefault();
	}, false);
	document.addEventListener("touchmove", function(event) {
		if(!drawPopup) {
			last.x = event.touches[0].pageX-canvas.offsetLeft;
			last.y = event.touches[0].pageY-canvas.offsetTop;
			visual.pointerMove(event.touches[0].pageX-canvas.offsetLeft, event.touches[0].pageY-canvas.offsetTop);
		}
		event.preventDefault();
	}, false);
	document.addEventListener("touchstart", function(event) {
		if(!drawPopup) {
			last.x = event.touches[0].pageX-canvas.offsetLeft;
			last.y = event.touches[0].pageY-canvas.offsetTop;
			visual.pointerDown(event.touches[0].pageX-canvas.offsetLeft, event.touches[0].pageY-canvas.offsetTop);
		}
		event.preventDefault();
	}, false);
	document.addEventListener("dblclick", function(event) {
		event.preventDefault();
	}, false);
	document.addEventListener("touchend", function(event) {
		if(!drawPopup) {
			if(event.touches.length > 0) {
				visual.pointerUp(event.touches[0].pageX-canvas.offsetLeft, event.touches[0].pageY-canvas.offsetTop);
			} else
				visual.pointerUp(last.x, last.y);
		}
		event.preventDefault();
	}, false);
	
	//internal functions
	function drawWinMessagePopup() {
		ctx.fillStyle = popupConfig.backgroundColor;
		ctx.fillRect(popupConfig.left,popupConfig.top, popupConfig.width,popupConfig.height);

		ctx.strokeStyle = popupConfig.borderColor;
		ctx.lineWidth   = popupConfig.lineWidth;
		ctx.strokeRect(popupConfig.left,popupConfig.top, popupConfig.width,popupConfig.height);
		ctx.strokeRect(popupConfig.left+2*popupConfig.lineWidth,popupConfig.top+2*popupConfig.lineWidth, popupConfig.width - 4*popupConfig.lineWidth,popupConfig.height - 4*popupConfig.lineWidth);
		
		
		ctx.fillStyle = popupConfig.fontColor;
		ctx.font = "9px monospace";
		ctx.font = ((popupConfig.width/6)/(ctx.measureText(popupConfig.winMessage).width/35)) +"px monospace";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";

		ctx.fillText(popupConfig.winMessage, popupConfig.left+Math.floor(popupConfig.width/2),popupConfig.top+Math.floor(popupConfig.height/2));
	}
	
	function changeLevelCallback() {
		elements = visual.getElements();
		var size = visual.getSize();
		ctx.clearRect (0, 0, size.width, size.height);
		ctx.strokeStyle = "#000";
		ctx.lineWidth = 1;
	
		//controls
		for(x in elements.controls) {
			var element = elements.controls[x];
			if(typeof element == "object") {
				ctx.fillStyle = '#000';
				ctx.font = element.fontSize+'px monospace';
				ctx.textAlign = "left";
				ctx.textBaseline = "alphabetic";

				ctx.strokeRect (element.left, element.top, element.right-element.left, element.bottom-element.top);
				ctx.fillText(element.value, element.left+Math.floor(((element.right - element.left)-ctx.measureText(element.value).width)/2), element.bottom - element.fontSize/6);
			}
		}
		//grille
		ctx.strokeRect (elements.grille.left, elements.grille.top, elements.grille.right-elements.grille.left, elements.grille.bottom-elements.grille.top);
		
		var blocks = elements.grille.blocks;
		for(var i=0; i<blocks.length; i++) {
			if(blocks[i].important)
				ctx.fillStyle = '#f00';
			else
				ctx.fillStyle = '#000';
			ctx.fillRect(blocks[i].left, blocks[i].top, blocks[i].right-blocks[i].left, blocks[i].bottom-blocks[i].top);
		}
		
		if(drawPopup) {
			drawWinMessagePopup();
		}
	}
	
	this.draw = function() {
		popupConfig.left = elements.controls.info.left;
		popupConfig.width = elements.controls.info.right - elements.controls.info.left;
		popupConfig.height = Math.floor(popupConfig.width/2.5);
		popupConfig.top = (elements.grille.bottom - elements.grille.top)/2 + elements.grille.top - (popupConfig.height/2);
		drawWinMessagePopup();
	};
}
