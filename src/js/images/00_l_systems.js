const in_rules     = document.getElementById("rules");
const in_num_iters = document.getElementById("num_iters");
const in_line_len  = document.getElementById("line_len");
const in_line_w    = document.getElementById("line_w");
const in_rand_mag  = document.getElementById("rand_mag");
const in_angle     = document.getElementById("angle");

const cnv = document.getElementById("cnv");
cnv.style.width = "100%"; 
cnv.width = cnv.offsetWidth;


function applyRules(in_str, rules){
	let out_str = new String("");
	for (var c = 0; c < in_str.length; c++) {
		let ch = in_str[c];
		if(rules.has(in_str[c])){
			out_str = out_str.concat(rules.get(in_str[c]));
		} else {
			out_str = out_str.concat(in_str[c]);
		}
	}
	return out_str;
}


class Turtle {
	constructor(canvas){
		this.ctx = canvas.getContext('2d');
		this.ctx.clearRect(0, 0, canvas.width, canvas.height);
		this.x = canvas.width/2;
		this.y = canvas.height;
		this.facing = 180;
	}

	left(amt){ this.facing -= amt; }

	right(amt){ this.facing += amt; }

	stroke(dist){
		let dx = dist*Math.sin((this.facing/360)*2*Math.PI);
		let dy = dist*Math.cos((this.facing/360)*2*Math.PI);
		
		this.ctx.lineWidth = parseInt(in_line_w.value);
		this.ctx.beginPath();
		this.ctx.moveTo(this.x, this.y);
		this.ctx.lineTo(this.x+dx, this.y+dy);
		this.ctx.stroke(); 
		
		this.x += dx;
		this.y += dy;
	}

	leaf(){
		this.ctx.beginPath();
		this.ctx.arc(this.x, 
			this.y, 
			parseInt(in_line_w.value), 
			0, 2*Math.PI);
		this.ctx.fillStyle = "green";
		this.ctx.fill();
	}

	move(i, j, dir){
		this.x = i;
		this.y = j;
		this.facing = dir;
	}
}


function drawSentence(canvas, in_str, line_len, angle){
	let turtle = new Turtle(canvas);
	let stack  = [];
	for (var c = 0; c < in_str.length; c++) {
		switch (in_str[c]) {
			case '1': // Line Segment
				turtle.stroke(line_len+in_rand_mag.value*Math.random());
				break;
			case '0': // Line Segment, Leaf
				turtle.stroke(line_len+in_rand_mag.value*Math.random());
				turtle.leaf();
				break;
			case '[': // Push (pos, facing), then turn <angle> Left
				stack.push([turtle.x, turtle.y, turtle.facing]);
				turtle.left(angle+in_rand_mag.value*Math.random());
				break;
			case ']': // Pop (pos, facing), then turn <angle> Right
				let s = stack.pop();
				turtle.move(s[0], s[1], s[2]);
				turtle.right(angle+in_rand_mag.value*Math.random());
				break;
		}
	}
}


function readRules(){
	let rules = new Map();
	let lines = in_rules.value.split("\n");
	lines.forEach(function(line){
		let s = line.split(": ");
		rules.set(`${s[0]}`, s[1]);
	});
	return rules;
}


function redraw(){
	let pattern_str = "0";
	let pattern_rules = readRules();
	for (var n = 0; n < parseInt(in_num_iters.value); n++){
		pattern_str = applyRules(pattern_str, pattern_rules);
	}
	drawSentence(cnv, 
		pattern_str, 
		parseInt(in_line_len.value), 
		parseInt(in_angle.value));
}

redraw();
in_num_iters.onclick = redraw;
in_line_len.onclick = redraw; 
in_line_w.onclick = redraw;   
in_rand_mag.onclick = redraw; 
in_angle.onclick = redraw;    