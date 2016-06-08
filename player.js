var pc = new Sprite();
var drawback = 0;
var ship = new Image();
var shield = new Image();
ship.src = "ship_animated.png";
shield.src = "spr_shield.png";

pc.shield = 10;
pc.pwr_up = 0;
pc.animation = 0;
pc.shd_expand = 0;
pc.score = 0;
pc.lifes = 3;
pc.restart = false;

pc.draw = function(){	
	// Altera o raio para desenhar
	this.radius = 42;
	ctx.drawImage(ship, Math.floor(pc.animation) * 512, 0, 512, 512, this.x - this.radius, this.y - this.radius, 2*this.radius, 2*this.radius);

	ctx.globalAlpha = pc.shield / 10;
	if(pc.shield < 10){
		if(Math.floor(Math.random()*100) % Math.floor(pc.shield+1) == 0){
			ctx.drawImage(shield, 0, 0, shield.width, shield.height, this.x - this.radius - 10 - pc.shd_expand/2, this.y - this.radius - 15 - pc.shd_expand/2, 2*this.radius + 20 + pc.shd_expand, 2*this.radius + 20 + pc.shd_expand);
		}
	}
	
	ctx.drawImage(shield, 0, 0, shield.width, shield.height, this.x - this.radius - 10 - pc.shd_expand/2, this.y - this.radius - 15 - pc.shd_expand/2, 2*this.radius + 20 + pc.shd_expand, 2*this.radius + 20 + pc.shd_expand);	
	ctx.globalAlpha = 1.0;
	
	//Altera o raio para colisão
	if(pc.restart){
		if(pc.shd_expand <= 600){
			pc.shd_expand += 120*dt;	
			pc.shield = 10;
		} else{
			pc.restart = false;
		}
		
	} else{
		if(pc.shd_expand > 0){
			pc.shd_expand -= 360*dt;	
			pc.shield = 10;
		} 
		if(pc.shd_expand < 0){
			pc.shd_expand = 0;
		}
	}
	
	pc.animation = (pc.animation + 10*dt) % 8;
}