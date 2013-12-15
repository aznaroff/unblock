var levelsCompressed = levels.beginner;

function loadLevel(index) {
	var level = new Array();
	for(var i = 0; i < levelsCompressed[index].length/3; i++) {
		var coord = parseInt(levelsCompressed[index][i*3]+levelsCompressed[index][i*3+1],10);
		var type = parseInt(levelsCompressed[index][i*3+2], 10);
		var block = new Object;
		block.coord = {
			x: coord%6,
			y: Math.floor(coord/6)
		};
		block.index = i;
		switch(type) {
			case 1:
				block.size=2;
				block.orientation= "horizontal";
			break;
			case 2:
				block.size=2;
				block.orientation= "vertical";
			break;
			case 3:
				block.size=3;
				block.orientation= "horizontal";
			break;
			case 4:
				block.size=3;
				block.orientation= "vertical";
			break;
		}
		if(block.coord.y == 2 && block.orientation == "horizontal")
			block.important = true;
	
		level.push(block);
	}
	return level;
}
function levelsLength() {
	return levelsCompressed.length;
}
