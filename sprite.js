
var myScreen = document.getElementsByTagName("canvas")[0];
var ctx = myScreen.getContext("2d");

function Sprite(){

	this.x = myScreen.width / 2; 
	this.y = myScreen.height - 50;
	this.vx = 0;
	this.ax = 0;
	this.vy = 0;
	this.ay = 0;
	this.radius = 42;
	this.color = 'lightgray'
}

Sprite.prototype.move = function(){

	this.vx = this.vx + this.ax*dt;
	this.x = this.x + this.vx*dt;
	
	this.vy = this.vy + this.ay*dt;
	this.y = this.y + this.vy*dt;
}

Sprite.prototype.draw = function(){

	ctx.fillStyle = this.color;
	ctx.strokeStyle = "rgb(150, 50, 50)";
	ctx.lineWidth = 3;

	ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
	ctx.closePath();

	ctx.fill();
	ctx.stroke();
}

Sprite.prototype.restrictions =  function(){
	// Limite lateral esquerdo
	if(this.x < this.radius){
		this.x = this.radius;
		// Para parar a movimentação
		//this.vx = 0;
		//this.ax = 0;
		// Para quicar nos lados
		//this.vx = -this.vx;
		//this.ax = -this.ax;
	} 
	// Limite lateral direito
	if(this.x > myScreen.width - this.radius){
		this.x = myScreen.width - this.radius;
		// Para parar a movimentação
		//this.vx = 0;
		//this.ax = 0;
		// Para quicar nos lados
		//this.vx = -this.vx;
		//this.ax = -this.ax;
	}
	// Limite lateral superior
	if(this.y < this.radius){
		this.y = this.radius;
		// Para parar a movimentação
		//this.vx = 0;
		//this.ax = 0;
		// Para quicar nos lados
		//this.vy = -this.vy;
		//this.ay = -this.ay;
	} 
	// Limite lateral inferior
	if(this.y > myScreen.height - this.radius){
		this.y = myScreen.height - this.radius;
		// Para parar a movimentação
		//this.vx = 0;
		//this.ax = 0;
		// Para quicar nos lados
		//this.vy = -this.vy;
		//this.ay = -this.ay;
	}
}

Sprite.prototype.circularCollisionDetection = function (target){

	var distance = Math.sqrt( 
								Math.pow(target.x - this.x, 2) + 
								Math.pow(target.y - this.y, 2)
							);

	return distance < (target.radius + this.radius);
}