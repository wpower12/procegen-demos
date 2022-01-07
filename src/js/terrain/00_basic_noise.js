const {SimplexNoise} = require('simplex-noise');

const cnv = document.getElementById("cnv");
const ctx = cnv.getContext('2d');

var input_cellsize  = document.getElementById("cell_size");
var input_scale     = document.getElementById("noise_scale");
var input_sea_lvl   = document.getElementById("sea_level");
var input_mtn_lvl   = document.getElementById("mtn_level");
var btn_gen_terrain = document.getElementById("gen_terrain_btn");

btn_gen_terrain.onclick = function(e){
	let grid = defineMaxGrid(cnv, input_cellsize.value);
	drawGrid(ctx, grid, input_cellsize.value);

	let simplex = new SimplexNoise();
	fillTerrain(ctx, grid, input_cellsize.value, simplex);
}
btn_gen_terrain.click();

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
			fillCell(ctx, grid, cell_size, i, j, color)
		}
	}
}

function fillCell(ctx, grid, cell_size, x, y, color){
	ctx.fillStyle = color;
	ctx.fillRect(grid.os_x+x*cell_size+1, 
		grid.os_y+y*cell_size+1,
		cell_size-2, 
		cell_size-2);
}