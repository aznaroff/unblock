function Render(visual, id) {
	var canvas = document.querySelector('#' + id);
	var ctx = canvas.getContext("2d");
	var last = {
		x: 0,
		y: 0
	};
	visual.addEventListener("changelevel", function() {
		console.log("changelevel");
		var elements = visual.getElements();
		var size = visual.getSize();
		ctx.clearRect (0, 0, size.width, size.height);
		ctx.strokeStyle = "#000";
		ctx.lineWidth = 1;
	
		//controls
		for(x in elements.controls) {
			var element = elements.controls[x];
			if(typeof element == "object") {
				ctx.fillStyle = '#000';
				ctx.font = element.fontSize+'px sans-serif';
				ctx.textBaseline = 'top';

				ctx.strokeRect (element.left, element.top, element.right-element.left, element.bottom-element.top);
				ctx.fillText(element.value, element.left+Math.floor(((element.right - element.left)-ctx.measureText(element.value).width)/2), element.top);
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
	});
	visual.addEventListener("moveblock", function(block) {
		console.log("moveblock");
		var elements = visual.getElements();
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
		alert(visual.getWinMessage());
	});
	document.addEventListener("mousewheel", function(event) {
		visual.wheeling(event.offsetX, event.offsetY, -1*(event.wheelDelta/120));
		event.preventDefault();
	});
	document.addEventListener("mousemove", function(event) {
		visual.pointerMove(event.offsetX, event.offsetY);
		event.preventDefault();
	});
	document.addEventListener("mousedown", function(event) {
		visual.pointerDown(event.offsetX, event.offsetY);
		event.preventDefault();
	});
	document.addEventListener("mouseup", function(event) {
		visual.pointerUp(event.offsetX, event.offsetY);
		event.preventDefault();
	});
	document.addEventListener("touchmove", function(event) {
		last.x = event.touches[0].pageX-canvas.offsetLeft;
		last.y = event.touches[0].pageY-canvas.offsetTop;
		visual.pointerMove(event.touches[0].pageX-canvas.offsetLeft, event.touches[0].pageY-canvas.offsetTop);
		event.preventDefault();
	});
	document.addEventListener("touchstart", function(event) {
		last.x = event.touches[0].pageX-canvas.offsetLeft;
		last.y = event.touches[0].pageY-canvas.offsetTop;
		visual.pointerDown(event.touches[0].pageX-canvas.offsetLeft, event.touches[0].pageY-canvas.offsetTop);
		event.preventDefault();
	});
	document.addEventListener("dblclick", function(event) {
		event.preventDefault();
	});
	document.addEventListener("touchend", function(event) {
		if(event.touches.length > 0) {
			visual.pointerUp(event.touches[0].pageX-canvas.offsetLeft, event.touches[0].pageY-canvas.offsetTop);
		} else
			visual.pointerUp(last.x, last.y);
		event.preventDefault();
	});
}
