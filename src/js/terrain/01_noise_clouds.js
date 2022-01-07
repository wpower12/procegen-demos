const {SimplexNoise} = require('simplex-noise');

const cnv = document.getElementById("cnv");
const ctx = cnv.getContext('2d');

var input_cloud_cellsize = document.getElementById("cell_size");
var input_cloud_scale    = document.getElementById("noise_scale");
var input_cloud_thresh   = document.getElementById("noise_thresh");
var input_cloud_dz       = document.getElementById("cloud_dz");
var btn_gen_terrain = document.getElementById("gen_terrain_btn");

var anim_req;

const CELL_SIZE = 15;
const NOISE_SCALE = 0.1;
const SEA_LEVEL = 0.0;
const MTN_LEVEL = 0.7;

btn_gen_terrain.onclick = function(e){
	let grid = defineMaxGrid(cnv, CELL_SIZE);
	let cloud_grid = defineMaxGrid(cnv, input_cloud_cellsize.value);
	let simplex = new SimplexNoise();
	let cloud_z = 0;

	if(anim_req){ window.cancelAnimationFrame(anim_req); }

	function step(ts){
		drawGrid(ctx, grid, CELL_SIZE);
		fillTerrain(ctx, grid, CELL_SIZE, simplex);
		cloud_z += parseFloat(input_cloud_dz.value);
		drawClouds(ctx, cloud_grid, cloud_z, input_cloud_scale.value, simplex);
		anim_req = requestAnimationFrame(step);		
	}
	anim_req = requestAnimationFrame(step);

}
btn_gen_terrain.click();


function drawClouds(ctx, cloud_grid, cloud_z, cloud_scale, simplex){
	for (var i = 0; i < cloud_grid.X; i++) {
		for (var j = 0; j < cloud_grid.Y; j++) {
			let v = simplex.noise3D((i+cloud_z)*cloud_scale, // To translate while going 'up' (along z)
				j*cloud_scale, 
				cloud_z*cloud_scale)
			if(v > input_cloud_thresh.value){
				ctx.fillStyle = `rgba(200, 200, 255, ${v})`;
				ctx.fillRect(cloud_grid.os_x+i*input_cloud_cellsize.value, 
				    cloud_grid.os_y+j*input_cloud_cellsize.value,
					input_cloud_cellsize.value, 
					input_cloud_cellsize.value);
			}
		}
	}
}

// Forces the canvas to fill its parents width, and then
// computes the offsets and extents for the grid based on
// the dimensions and cell size. 
function defineMaxGrid(canvas, cell_size){
	canvas.style.width = "100%";
	canvas.width = canvas.offsetWidth;
	let X = Math.floor(canvas.width/cell_size);
    let Y = Math.floor(canvas.height/cell_size);
	return { 'X': X, 
		'Y': Y,
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
				cell_size-2, 
				cell_size-2);
		}
	}
}

// Uses the provided simplex noise object to find 'height' values for
// each cell. Then, depending on that value, fills in the cell with
// an approriate color. 
function fillTerrain(ctx, grid, cell_size, simplex){
	for (var i = 0; i < grid.X; i++) {
		for (var j = 0; j < grid.Y; j++) {		
			let v = simplex.noise2D(i*NOISE_SCALE, 
									j*NOISE_SCALE);
			let color = "blue";
			if( v > SEA_LEVEL){
				color = "green";
			}
			if( v > MTN_LEVEL){
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