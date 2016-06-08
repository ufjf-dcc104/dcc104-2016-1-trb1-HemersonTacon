
var enemies = [];
var deleteEnemies = [];
var imgEnemy = [];
var enemyBullets = [];

for(i=0; i < 5; i++){
	imgEnemy[i] = new Image();
}

imgEnemy[0].src = "enemy_animated1.png";
imgEnemy[1].src = "enemy_animated2.png";
imgEnemy[2].src = "enemy_animated3.png";
imgEnemy[3].src = "asteroid_big.png";
imgEnemy[4].src = "asteroid_medium.png";


function createEnemy(bornTime, index = Math.floor(Math.random()*100) % 4, x = Math.floor(Math.random()*myScreen.width), y = - 50, vx = 50, vy = 50){
	var enemy = new Sprite();
	enemy.bornTime = bornTime;
	enemy.myIndex = index;
	enemy.ship = imgEnemy[enemy.myIndex];
	enemy.animation = 0;
	enemy.x = x;
	enemy.y = y;
	enemy.vy = vy;
	enemy.vx = vx;
	enemy.radius = 25;
	enemy.drawback = 0;

	switch(enemy.myIndex){
		case 0:
			enemy.vy += (10 + (Math.random() * 30));
			enemy.vx = -100 + (Math.random() * 200);
			break;
		case 1:
			enemy.vy += (Math.random() * 10);
			enemy.vx = -50 + (Math.random() * 100);
			break;
		case 2:
			enemy.vy += (-10 + Math.random() * 50);
			break;
		case 3:
			enemy.vx = -20 + (Math.random() * 40);
			enemy.vy = 25;
			enemy.radius = 24;
			break;
		case 4:
			enemy.radius = 16;
			break;
	}
	
	enemy.restrictions = function(now){
		// Se o inimigo passar do lmite inferior da tela ele é deletado
		if(this.y > myScreen.height + this.radius){
			deleteEnemies.push(this);
		}
		if(this.myIndex == 2){
			//Aceleração X da nave/módulo circular que persegue o jogador
			if(this.vx < 50){
				this.ax = 0.5*(pc.x-this.x);	
			} else{
				this.ax = 0.1*(pc.x-this.x);
			}
			// nave/módulo circular atira no jogador quando está próxima da posição em X dele
			if(Math.abs(pc.x-this.x) < 50 && this.drawback <= 0 && enemyBullets.length <= enemies.length / 2){
				enemyBullets.push(createBullet(this.x, this.y, 3, 8, 0, 100));
				this.drawback = 1.5;
			}
		}
		if(this.myIndex == 0 || this.myIndex == 1){
			//Inversão do movimento em X das naves
			if( (now - this.bornTime) % 10 > (3 + Math.random()*5)){
				this.vx *= -1;	
				this.bornTime = now;
			} 
			// Criação de disparo das naves na direção do jogador
			if(this.myIndex == 0 && this.drawback <= 0 && enemyBullets.length <= enemies.length / 2){
				angle = Math.atan((pc.x - this.x)/(pc.y - this.y));
				angle = (pc.y - this.y) < 0 ? Math.PI + angle : angle;
				vx = 100 * Math.sin(angle);
				vy = 100 * Math.cos(angle);
				enemyBullets.push(createBullet(this.x, this.y, 3, 8, vx, vy));
				// Adiciona um atraso para o próximo disparo desse inimigo
				this.drawback = 3 + Math.random() * 2;
			}
			if(this.myIndex == 1 && this.drawback <= 0 && enemyBullets.length <= enemies.length / 2){
				vx = 20 * (Math.random() < 0.5 ? -1 : 1);
				vy = 80;
				enemyBullets.push(createBullet(this.x, this.y, 3, 8, vx, vy));
				// Adiciona um atraso para o próximo disparo desse inimigo
				this.drawback = 3 + Math.random() * 3;	
			}
		}
		// Cuida da atualização do atraso dos disparos inimigos
		if(this.drawback >0){
			this.drawback -= dt;
		}


	}

	enemy.draw = function(){
		
		switch(this.myIndex % 5){
			case 0:
			case 1:
				//naves
				ctx.drawImage(this.ship, Math.floor(this.animation) * 512, 0, 512, 512, this.x - this.radius, this.y - this.radius, 2*this.radius, 2*this.radius);	
				break;
			case 2:
				// nave/módulo circular
				// Altera o raio para desenho
				this.radius = 25;
				ctx.save();
				ctx.translate(this.x, this.y);
				ctx.rotate(this.animation*40*Math.PI/180);
				ctx.drawImage(this.ship, Math.floor(this.animation) * 95, 0, 94, 96, 0 - this.radius, 0 - this.radius, 2*this.radius, 2*this.radius);	
				ctx.restore();
				//Altera o raio para colisão de acordo com a animação de abertura da nave/módulo circular
				switch(Math.floor(this.animation)){
					case 0:
						this.radius = 19;
						break;
					case 1:
					case 8:
						this.radius = 21;
						break;
					case 2:
					case 7:
						this.radius = 23;
						break;
					case 3:
					case 4:
					case 5:
					case 6:
						this.radius = 25;
						break;
				}
				break;
			case 3:
				// Asteroide grande
				ctx.drawImage(this.ship, 0, 0, 48, 48, this.x - this.radius, this.y - this.radius, 2*this.radius, 2*this.radius);		
				break;
			case 4:
				// Asteroide medio
				ctx.drawImage(this.ship, 0, 0, 48, 48, this.x - this.radius, this.y - this.radius, 2*this.radius, 2*this.radius);		
				break;
		}
		this.animation = (this.animation + 5*dt) % 9;
	}

	return enemy;
}