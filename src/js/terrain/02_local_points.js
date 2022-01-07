const {SimplexNoise} = require('simplex-noise');

const cnv = document.getElementById("cnv");
const ctx = cnv.getContext('2d');

const mm_cnv = document.getElementById("mini_map");
const mm_ctx = mm_cnv.getContext('2d');

var input_cellsize   = document.getElementById("cell_size");
var input_scale      = document.getElementById("noise_scale");
var input_sea_lvl    = document.getElementById("sea_level");
var input_mtn_lvl    = document.getElementById("mtn_level");
var input_rare_scale = document.getElementById("rare_noise_scale")
var btn_gen_terrain  = document.getElementById("gen_terrain_btn");

// var input_rare_scale.value = 0.01;
var MM_SCALE = 3;

btn_gen_terrain.onclick = function(e){
	let grid = defineMaxGrid(cnv, input_cellsize.value);
	drawGrid(ctx, grid, input_cellsize.value);

	let simplex = new SimplexNoise();
	fillTerrain(ctx, grid, input_cellsize.value, simplex);

	let mm_grid = defineMMGrid(mm_cnv, grid.X, grid.Y);
	let rare_simplex = new SimplexNoise();
	fillRareSpawns(ctx, grid, input_cellsize.value, rare_simplex, mm_ctx);
}
btn_gen_terrain.click();

function fillRareSpawns(ctx, grid, cell_size, rare_simplex, mm_ctx) {
	for (var i = 0; i < grid.X; i++) {
		for (var j = 0; j < grid.Y; j++) {		
			
			let v = rare_simplex.noise2D(i*input_rare_scale.value, j*input_rare_scale.value);
			let color = `hsl(0, 50%, ${Math.floor((v+1)*100)}%)`;
			if(v > 0){
				color = `hsl(125, 50%, ${Math.floor((1-v)*100)}%)`;
			}
			fillCell(mm_ctx, {'os_x': 0, 'os_y': 0}, MM_SCALE, i, j, color, 0);

			if( isLocalMinMax(grid, input_rare_scale.value, rare_simplex, i, j) ){
				fillCell(ctx, grid, cell_size, i, j, "yellow", 1);
				fillCell(mm_ctx, {'os_x': 0, 'os_y': 0}, MM_SCALE, i, j, "yellow", 0);
			}
		}
	}
}

function isLocalMinMax(grid, scale, simplex, i, j) {
	// look at the 8 neighbors 
	let deltas = [[1,0], [-1,0], [0, 1], [0, -1],
		[1,1], [1,-1], [-1, 1], [-1, -1]];

	let v = simplex.noise2D(i*scale, j*scale);

	let local_min = true;
	let local_max = true;

	for (var d = 0; d < deltas.length; d++) {
		let delta = deltas[d];
		let v2 = simplex.noise2D((i+delta[0])*scale, 
			(j+delta[1])*scale);
		if( v2 >= v){
			local_max = false;
		}
		if( v2 <= v){
			local_min = false;
		}
	}
	return local_min || local_max;
}

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


function defineMMGrid(canvas, X, Y){
	canvas.style.width  = `${X*MM_SCALE}px`;
	canvas.style.height = `${Y*MM_SCALE}px`;
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	return {
		'X': X, 'Y': Y, 'os_x': 0, 'os_y': 0
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

// Uses the provided simplex noise object to find 'height' values for
// each cell. Then, depending on that value, fills in the cell with
// an approriate color. 
function fillTerrain(ctx, grid, cell_size, simplex){
	for (var i = 0; i < grid.X; i++) {
		for (var j = 0; j < grid.Y; j++) {		
			let v = simplex.noise2D(i*input_scale.value, 
									j*input_scale.value);
			let color = "blue";
			if( v > input_sea_lvl.value){
				color = "green";
			}
			if( v > input_mtn_lvl.value){
				color = "lightgrey";
			}
			fillCell(ctx, grid, cell_size, i, j, color, 1)
		}
	}
}

function fillCell(ctx, grid, cell_size, x, y, color, gutter){
	ctx.fillStyle = color;
	ctx.fillRect(grid.os_x+x*cell_size+gutter, grid.os_y+y*cell_size+gutter, cell_size-(2*gutter), cell_size-(2*gutter));
}