const cnv = document.getElementById("cnv");
const ctx = cnv.getContext('2d');

const MAX_ITERATIONS = 200;
 
var input_cellsize  = document.getElementById("cell_size");
var input_numrooms  = document.getElementById("num_rooms");
var input_maxsize   = document.getElementById("max_size");
var btn_gen_dungeon = document.getElementById("gen_dungeon_btn");

btn_gen_dungeon.onclick = function(e){
	let grid  = defineMaxGrid(cnv, input_cellsize.value);
	let rooms = generateRooms(grid, input_numrooms.value, input_maxsize.value);
	let halls = generateHallways(rooms, grid);

	drawGrid(ctx, grid, input_cellsize.value);
	drawHallways(ctx, halls, grid, input_cellsize.value);
	drawRooms(ctx, rooms, grid, input_cellsize.value);
}
btn_gen_dungeon.click();

// Forces the canvas to fill its parents width, and then
// computes the offsets and extents for the grid based on
// the dimensions and cell size. 
function defineMaxGrid(canvas, cell_size){
	canvas.style.width = "100%";
	canvas.width = canvas.offsetWidth;
	let X = Math.floor(canvas.width/cell_size);
	let Y = Math.floor(canvas.height/cell_size);
	return { 'X': X, 'Y': Y,
		'os_x': (canvas.width-X*cell_size)/2,
		'os_y': (canvas.height-Y*cell_size)/2 };
}

// Return a list of non-overlapping rectangles, representing rooms. 
function generateRooms(grid, num_rooms, max_l){
	let rooms = [];
	let num_iterations = 0;
	while(rooms.length < num_rooms){
		let c_w = getRandomInt(4, max_l);
		let c_h = getRandomInt(4, max_l);
		let c_x = getRandomInt(0, grid.X-c_w);
		let c_y = getRandomInt(0, grid.Y-c_h);
		let new_room = {'x': c_x, 'y': c_y, 'w': c_w, 'h': c_h};
		let new_pad_room = {'x': c_x-1, 'y': c_y-1, 'w': c_w+1, 'h': c_h+1};
		let collided = false;
		rooms.forEach(function(room){ 
			let pad_room = {'x': room.x-1, 'y': room.y-1, 'w': room.w+1, 'h': room.h+1};
			if(intersect(pad_room, new_pad_room)){ 
				collided = true;
			}
		});
		if(!collided){
			rooms.push(new_room);
		}
		if(num_iterations++ > MAX_ITERATIONS){
			break;
		}
	}
	return rooms;
}

function generateHallways(rooms, grid){
	let rs = rooms.slice();
	let connected = []
	let hallways = [];
	while(rs.length > 0){
		let room = rs.pop();
		if(connected.length > 0){
			// randomly pick a room and make a hallway to it.
			var to_room = connected[Math.floor(Math.random()*connected.length)];
			let mp1 = {'x': Math.floor(room.x+(room.w/2)),
				'y': Math.floor(room.y+(room.h/2))};
			let mp2 = {'x': Math.floor(to_room.x+(to_room.w/2)), 
				'y': Math.floor(to_room.y+(to_room.h/2))};
			hallways.push(findPath(mp1, mp2, grid));
		} 
		connected.push(room);
	}
	return hallways;
}

function adjacentNodes(p, grid){
	let deltas = [[0,1], [1,0], [-1,0], [0,-1]];
	let neighbors = [];
	deltas.forEach(function(d){
		if( d[0]+p.x > 0 && 
			d[0]+p.x < grid.X &&
			d[1]+p.y > 0 && 
			d[1]+p.y < grid.Y ){
			neighbors.push({
				'x': d[0]+p.x,
				'y': d[1]+p.y
			});
		}
	});
	shuffle(neighbors); // makes the paths look interesting. 
	return neighbors;
}

// bfs with a random heuristic to find a (non-optimal-probably) path. 
function findPath(p1, p2, grid){
	let visited = [];  // 2d array of the grid. 
	for(var i=0; i<grid.X; i++){
		let new_col = [];
		for(var j=0; j<grid.Y; j++){
			new_col.push(false);
		}
		visited.push(new_col);
	}

	let paths = [];    // queue of paths
	paths.push([p1]);
	while(paths.length > 0){
		path = paths.shift();
		last_node = path.at(-1);
		if(last_node.x == p2.x && last_node.y == p2.y){
			return path;
		}

		adjacentNodes(last_node, grid).forEach(function(n){
			if(!visited[n.x][n.y]){
				let new_path = path.slice();
				new_path.push(n);
				paths.push(new_path);
				visited[n.x][n.y] = true;
			}
		});
	}
}

// Draws the 'grid' by just drawing a square with cell_size-2 sides
// in every cell. Its that or deal with borders explicitly idk. 
function drawGrid(c, grid, cell_size){
	for (var i = 0; i < grid.X; i++) {
		for (var j = 0; j < grid.Y; j++) {
			c.fillStyle = 'grey';
			c.fillRect(grid.os_x+i*cell_size+1, 
				grid.os_y+j*cell_size+1,
				cell_size-2, cell_size-2);
		}
	}
}

function drawHallways(ctx, halls, grid, cell_size){
	halls.forEach(function(cells){
		cells.forEach(function(cell){
			ctx.fillStyle = 'black';
			ctx.fillRect(grid.os_x+cell.x*cell_size+1,
				grid.os_y+cell.y*cell_size+1,
				cell_size-2, cell_size-2);
		})
	});
}

function drawRooms(ctx, rooms, grid, cell_size){
	ctx.fillStyle = "lightblue";
	rooms.forEach(function(room){
		ctx.fillRect(grid.os_x+room.x*cell_size,
			grid.os_y+room.y*cell_size,
			room.w*cell_size,
			room.h*cell_size);
	});
}

// *** Utils ------------
// from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

// from: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
function intersect(rect1, rect2){
	return(rect1.x < rect2.x + rect2.w &&
		rect1.x + rect1.w > rect2.x &&
		rect1.y < rect2.y + rect2.h &&
		rect1.h + rect1.y > rect2.y)
}

// from: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}