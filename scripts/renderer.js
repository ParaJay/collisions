import { instance } from "./script.js";

export class Renderer {

    constructor() {
        this.canvas = document.getElementById("canvas");
        this.context = canvas.getContext("2d");
        this.canvas.width = window.screen.availWidth * 0.8;
        this.canvas.height = window.screen.availHeight * 0.7;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    clear() {   
        this.context.beginPath();
        this.context.fillStyle = "white";
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.stroke();
    }
    
    render() {
        this.clear();
    
        this.context.fillStyle = "black";
    
        for(let i = 0; i < instance.pieces.length; i++) {
            let piece = instance.pieces[i];

            this.context.beginPath();
            this.context.fillStyle = piece.type;
            this.context.fillRect(piece.x, piece.y, piece.width, piece.height);
            this.context.stroke();
        }
    }
}