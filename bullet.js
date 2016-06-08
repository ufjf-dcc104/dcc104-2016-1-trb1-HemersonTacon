var bullets = [];
var explosions = [];
var deleteBullets = [];
var deleteExplosions = [];
var deleteEnemyBullets = [];
var imgBullet = [];
var imgExplosion = [];

for(i = 0; i < 4; i++){
	imgBullet[i] = new Image();
}

imgBullet[0].src = "bullet.png";
imgBullet[1].src = "bullet_l.png";
imgBullet[2].src = "bullet_r.png";
imgBullet[3].src ="bullet_red.png";

for(i = 0; i < 4; i++){
	imgExplosion[i] = new Image();
}

imgExplosion[0].src = "red_explosion_animated.png";
imgExplosion[1].src = "explosion_animated.png";
imgExplosion[2].src = "explosion_animated2.png";
imgExplosion[3].src = "explosion_animated3.png";

function createBullet(x, y, index, radius = 16, vx, vy){
	var bullet = new Sprite();
	bullet.radius = radius;
	bullet.myIndex = index;
	switch(bullet.myIndex){
		case 0:
			//bullet pra cima bullet.png
			bullet.vx = 0;
			bullet.vy = - 450;
			break;
		case 1:
			//bullet inclinado pra esquerda bullet_l.png
			bullet.vx = - 450 * Math.sin(22.5 * Math.PI / 180);
			bullet.vy = - 450 * Math.cos(22.5 * Math.PI / 180);	
			break;
		case 2:
			//bullet inclinado pra direita bullet_r.png	
			bullet.vx = 450 * Math.sin(22.5 * Math.PI / 180);	
			bullet.vy = - 450 * Math.cos(22.5 * Math.PI / 180);	
			break;
		case 3:
			//bullet inimiga
			bullet.vx = vx;	
			bullet.vy = vy;	
	}
	bullet.x = x;
	bullet.y = y;

	bullet.draw = function(){
		ctx.save();
		/* TODO Inclinação do tiro inimigo
		if(this.myIndex == 3){
			ctx.translate(this.x, this.y);
			ctx.rotate((Math.atan(this.vx / this.vy)) * Math.PI/180);
		}*/
		ctx.drawImage(imgBullet[index], this.x - this.radius, this.y - this.radius, 2*this.radius, 2*this.radius);
		ctx.restore();
	}

	bullet.restrictions = function(){
		if(this.y > myScreen.height + this.radius || this.x > myScreen.width + this.radius || this.x < - this.radius || this.y < - this.radius){
			if(this.myIndex == 3){
				deleteEnemyBullets.push(this);
			} else{
				deleteBullets.push(this);
			}
			
		}
	}

	return bullet;
}

function createExplosion(x, y, index = 0, radius = 50){
	var explosion = new Sprite();
	explosion.animation = 0;
	explosion.myIndex = index;
	explosion.radius = radius;
	explosion.x = x;
	explosion.y = y;

	explosion.draw = function(){
		switch(this.myIndex){
			case 0:
				ctx.drawImage(imgExplosion[1], 256 * Math.floor(this.animation % 17), 0, 256, 256, this.x - this.radius, this.y - this.radius, 2*this.radius, 2*this.radius);
				ctx.drawImage(imgExplosion[0], 256 * Math.floor(this.animation % 17), 0, 256, 256, this.x - this.radius, this.y - this.radius, 2*this.radius, 2*this.radius);

				this.animation = this.animation + 40*dt;

				if(this.animation >= 17){
					this.x = -1200;
				}

				break;
			case 1:
				ctx.drawImage(imgExplosion[3], 100 * Math.floor(this.animation % 9), 100 * Math.floor(this.animation / 9), 100, 100, this.x - this.radius, this.y - this.radius, 2*this.radius, 2*this.radius);

				this.animation = this.animation + 240*dt;

				if(this.animation >= 81){
					this.x = -1200;
				}

				break;
			case 2:
				ctx.drawImage(imgExplosion[0], 256 * Math.floor(this.animation % 17), 0, 256, 256, this.x - this.radius, this.y - this.radius, 2*this.radius, 2*this.radius);

				this.animation = this.animation + 40*dt;

				if(this.animation >= 17){
					this.x = -1200;
				}
				
				break;
			case 3:
				ctx.drawImage(imgExplosion[3], 100 * Math.floor(this.animation % 9), 100 * Math.floor(this.animation / 9), 100, 100, this.x - this.radius, this.y - this.radius, 2*this.radius, 2*this.radius);
				this.animation = this.animation + 30*dt;

				if(this.animation >= 81){
					this.x = -1200;
					if(pc.lifes >= 0){
						pc.x = myScreen.width / 2; 
						pc.y = myScreen.height - 50;
						pc.restart = true;
						pc.shield = 10;
						console.log("Vidas restantes: " + pc.lifes);
					} else{
						console.log("Game OVER\n Pontuação: " + pc.score);
					}
					
				}

				break;
		}
		
	}

	explosion.restrictions = function(){
		if(this.x < 0){
			deleteExplosions.push(this);
		}
	}

	return explosion;
}

