import { Random } from "./random.js";
import { Piece } from "./pieces.js";
import { Renderer } from "./renderer.js";
import * as Constants from "./constants.js";
import {} from "./listeners.js";

export var instance;

class Main {
	#vars;

	constructor() {
		instance = this;

		//TODO: change size to mult starting at 2

		this.#vars = {
			"scale": 2,
			"size": 32,
			"entityCount": 10,
			"varietyCount": 2
		};

		this.renderer = new Renderer();

		this.reset();
	}

	set(name, value) { this.#vars[name] = value; }

	get(name) { return this.#vars[name]; }

	getVars() { return this.#vars; }

	getScale() { return this.get("scale"); };
	getSize() { return this.get("size"); };
	getEntityCount() { return this.get("entityCount"); };
	getVarietyCount() { return this.get("varietyCount"); };

	setScale(scale) {
		if(scale < 1) {
			scale = 1;
		}

		if(scale > 16) {
			scale = 16;
		}
		
		this.set("scale", scale);

		Constants.speed.textContent = "speed: x" + this.getScale();
	}

	spawn() {
		let types = Constants.colours.slice(0, this.getVarietyCount());
	
		let index = 0;
	
		this.pieces = [];
	
		for(let i = 0; i < this.getEntityCount(); i++) {
			if(this.getEntityCount() < types.length) {
				this.pieces.push(new Piece(types[new Random().nextInt(types.length - 1)]));
				continue;
			}
	
			index++;
	
			if(index == types.length) {
				index = 0;
			}
	
			this.pieces.push(new Piece(types[index]));
		}
	}

	reset() {
		this.gravityTicks = 0;
		this.gravity = 1;
		this.gravityLevel = 5;
		this.totalMoves = 0;
		this.gravityCap = 50;
		this.gup = new Random().randint(250, 500);

		this.spawn();

		this.renderer.render();
	}

	tick() {
		for(let i = 0; i < this.pieces.length; i++) {
			this.pieces[i].tick();
		}
	
		this.gravityTicks += this.getScale();
	
		if(this.gravityTicks >= this.gup) {	
			this.gravity += new Random().randint(1, 3);
			this.gravityTicks = 0;
	
			if(this.gravity > this.gravityCap) {
				this.gravity = this.gravityCap;
			}
	
			this.gup = new Random().randint(this.gravityCap * 5,this. gravityCap * 10);
	
			console.log("upped gravity to: " + this.gravity + ", next in: " + this.gup);
	
			let glevel = Math.ceil(this.gravity / 12);
	
			if(glevel != this.gravityLevel) {
				this.gravityLevel = glevel;
	
				console.log("upped glevel");
			}
		}
	}
	
	render() {
		this.renderer.render();
	}

	matchAll() {
		let type = null;
		
		for(let i = 0; i < this.pieces.length; i++) {
			let e = this.pieces[i];
	
			if(type == null) {
				type = e.type;
			}
	
			if(type != e.type) {
				return false;
			}
		}
	
		return true;
	}
}

export async function start() {
	instance.running = true;

	const target = 60;
	const optimal = 1000000000 / target; //optimal wait time in nanoseconds

	while(instance.running) {
		let now = new Date();

		instance.tick();
		instance.render();

		if(instance.matchAll()) {
			instance.running = false;
			break;
		}

		let updateTime = new Date() - now; //how long tick and render took in nanoseconds
		
		let wait = (optimal - updateTime) / 1000000; //calculate wait time and convert to milliseconds

		await sleep(wait); //wait
	}
}

export async function stop() {
	instance.running = false;
}


function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

new Main();