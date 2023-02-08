import { Random } from "./random.js";
import { instance } from "./script.js";

export class Piece {

	constructor(type) {
		this.type = type;
		this.movement = 8;
		this.movementTicks = 0;
		this.movementCooldown = 8;
		this.invincibilityTicks = 0;
		this.#randomizeGravityTicks();

		let size = instance.getSize();

		this.width = size; this.height = size;

		this.ticks = 0;
		this.moves = 0;

		this.x = (new Random().nextInt(instance.renderer.width - (this.width * 2)));
		this.y = (new Random().nextInt(instance.renderer.height - (this.height * 2)));
	}

	#scaleSpeed() {
		this.movement = 4 * instance.getScale();
	}

	#randomMove(min = 1) {
		return new Random().randint(min, this.movement);
	}

	#randomizeGravityTicks() {
		this.gravitateTicks = (new Random().randint(instance.gravityCap / 5, instance.gravityCap) - instance.gravity) * 60;
	}

	move(force = false) {
		if(!force) {
			this.moves++;
			instance.totalMoves++;
		}

		if(!force && this.gravitateTicks <= 0) {
			for(let i = 0; i < new Random().randint(1, instance.gravityLevel); i++) {
				let b = this.gravitate();

				if(!b || force) {
					break;
				}
			}
			
			this.#randomizeGravityTicks();

			return;
		}

		let xmove = this.#randomMove(-this.movement);
		let ymove = this.#randomMove(-this.movement);

		let tx = xmove + this.x;
		let ty = ymove + this.y;

		//force away from edges
		if(tx <= 0 || tx >= instance.renderer.width - this.width) {
			xmove *= -1;
		}

		if(ty <= 0 || ty >= instance.renderer.height - this.height) {
			ymove *= -1;
		}

		let nx = this.x + xmove;
		let ny = this.y + ymove;

		this.#setXY(nx, ny);
	}

	tick() {
		this.gravitateTicks -= instance.getScale();
		this.movementTicks += instance.getScale();

		if(this.movementTicks >= this.movementCooldown) {
			this.#scaleSpeed();
			this.move();

			this.movementTicks = 0;
		}

		this.ticks++;
	}

	gravitate() {
		let centerX = Math.floor(instance.renderer.width / 2);
		let centerY = Math.floor(instance.renderer.height / 2);

		let distX = centerX - this.x;
		let distY = centerY - this.y;

		if(distX == 0 && distY == 0) {
			this.move(true);
			return false;
		}

		let xmove = 0, ymove = 0;

		if(distX < 0) {
			xmove = -1;
		} else if(distX > 0) {
			xmove = 1;
		}

		if(distY < 0) {
			ymove = -1;
		} else if(distY > 0) {
			ymove = 1;
		}

		xmove *= this.#randomMove()
		ymove *= this.#randomMove();

		this.#setXY(this.x + xmove, this.y + ymove);

		return true;
	}

	#setXY(x, y) {
		this.x = x;
		this.y = y;

		for(let i = 0; i < instance.pieces.length; i++) {
			if(instance.pieces[i].type == this.type) {
				continue;
			}

			if(this.collides(instance.pieces[i])) {
				if(this.canConvert(instance.pieces[i])) {
					instance.pieces[i].type = this.type;
				}
			}
		}
	}

	collides(piece) {
		if(this.x < (piece.x + piece.width) && piece.x < (this.x + this.width)) {
			if(this.y < (piece.y + piece.height) && piece.y < (this.y + this.height)) {
				return true;
			}
		}

		return false;
	}

	canConvert(piece) {
		return true;
	}

	toString() {
		return "x: " + this.x + ", y: " + this.y + ", w: " + this.width + ", h: " + this.height;
	}
}