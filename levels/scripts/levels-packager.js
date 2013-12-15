function compress(maps_decompressed) {
	var maps = new Array();
	for(var i=0; i<maps_decompressed.length; i++) {
		var map = '';
		for(var j=0; j<maps_decompressed[i].length; j++) {
			var coord = maps_decompressed[i][j].coord.x + maps_decompressed[i][j].coord.y*6;
			if(coord < 10)
				coord = '0'+coord;
			map += coord;
			if(maps_decompressed[i][j].orientation == "horizontal") {
				if(maps_decompressed[i][j].size == 2)
					map += 1;
				else
					map += 3;
			} else {
				if(maps_decompressed[i][j].size == 2)
					map += 2;
				else
					map += 4;
			}
		}
		maps.push(map);
	}
	return maps;
}

var fs = require("fs");
var levels = {};
fs.readFile("src/01-beginner/beginner.json", "utf-8", function(err, data) {
	if(err) return console.log(err);
	var beginnerArray = compress(JSON.parse(data));
	levels.beginner = beginnerArray;
	
	fs.readFile("src/02-intermediate/intermediate.json", "utf-8", function(err, data) {
		if(err) return console.log(err);
		var intermediateArray = compress(JSON.parse(data));
		levels.intermediate = intermediateArray;
		
		fs.readFile("src/03-advanced/advanced.json", "utf-8", function(err, data) {
			if(err) return console.log(err);
			var advancedArray = compress(JSON.parse(data));
			levels.advanced = advancedArray;
			
			fs.readFile("src/04-expert/expert.json", "utf-8", function(err, data) {
				if(err) return console.log(err);
				var expertArray = compress(JSON.parse(data));
				levels.expert = expertArray;
				
				console.log("var levels = " + JSON.stringify(levels));
			});
		});
	});
});
