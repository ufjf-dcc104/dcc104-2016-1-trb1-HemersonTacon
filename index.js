var fps = 60;
var dt = 1/fps;
var gameTime = 0;
var bgImage = new Image();
var bgImage2 = new Image();
var bgMove = 0, transition = false;
/* Sprites downloaded from:
 * http://gamedev.tutsplus.com/articles/news/enjoy-these-totally-free-space-based-shoot-em-up-sprites/
 * http://opengameart.org/content/shmup-ships
 * http://unluckystudio.com/game-art-giveaway-3-sci-fi-spaceship-game-sprites-pack/
 * http://hasgraphics.com/phaedy-explosion-generator/spritesheet1/
 */
bgImage.src = "farback.png";
bgImage2.src = "starfield.png";

function drawBackground(){

	ctx.drawImage(bgImage, bgMove, 0, myScreen.width, myScreen.height, 0, 0, myScreen.width, myScreen.height);
	bgMove = (bgMove + 2*dt) % bgImage.width;
	// Se chegar ao fim da imagem de fundo, repete ela de uma forma "suave", imperceptível
	if( Math.floor(bgMove % (bgImage.width - myScreen.width)) == 0 || transition){
		ctx.drawImage(bgImage, 0, 0, myScreen.width - (bgImage.width - bgMove), myScreen.height, bgImage.width - bgMove, 0, myScreen.width - (bgImage.width - bgMove), myScreen.height);
		transition = true;
		if(bgMove == 0){
			transition = false;
		}
	}
	// Campo de estrelas tem tamnho da tela então é necessário mover dois deles para manter a tela toda preenchida de estrelas e movimentando
	ctx.drawImage(bgImage2, 0, 0, myScreen.width, myScreen.height - (bgMove*8 % myScreen.height) , 0, (bgMove*8) % myScreen.height, myScreen.width, myScreen.height - (bgMove*8) % myScreen.height);
	ctx.drawImage(bgImage2, 0, bgImage2.height - (bgMove*8 % myScreen.height) , myScreen.width, (bgMove*8) % myScreen.height, 0, 0, myScreen.width, (bgMove*8) % myScreen.height);
}


function step(){
	gameTime += dt;
	drawBackground();

	/** Criação aleatória de inimigos, taxa de criação tem crescimento logaritmo em função do tempo 
	 *	Existe um limite de inimigos na tela que cresce expoenencialmente (^(1.5)) com o tempo
	 *  Como resultado os inimigos aumentam rapidamente com o passar do tempo
	**/
	if ( (gameTime*100) % (50 + 5*Math.log(gameTime)) < (pc.pwr_up + 1 + 7*Math.log(gameTime)) && enemies.length < 5 + (Math.pow(gameTime, 1.5) * 0.02) ){
		enemies.push(createEnemy(gameTime));
	}
	// Cuida do atraso do jogador para atirar
	if(drawback > 0){
		drawback -= dt;
	}
	// Cuida restaura para zero o dano tomado pelo player com o passar do tempo
	if(pc.shield < 10 && pc.shield > 0){
		pc.shield += dt * 0.5;
	}
	// Cuida da movimentação e atualização da posiçõa do jogador
	
	if(pc.shield > 0){
		pc.move();
		pc.restrictions();	
		pc.draw();
	}
	

	// Cuida da movimentação e atualização das balas disparadas pelo jogador
	for (i in bullets){
		bullets[i].move();
		bullets[i].restrictions();
		bullets[i].draw();	
	}
	
	for (i in enemies){
		// Cuida da movimentação e atualização da posição dos inimigos
		enemies[i].move();
		enemies[i].restrictions(gameTime);
		enemies[i].draw();
		// Altera o raio do jogador para detectar a colisão com o escudo caso o mesmo esteja em expansão
		pc.radius += pc.shd_expand/2;
		// Cuida da colisão dos inimigos com o escudo do jogador (inimigos são destruídos ao colidir com o escudo e diminuem a energia do escudo)
		if(pc.circularCollisionDetection(enemies[i]) && pc.shield > 0){
			if(pc.shd_expand <=0){
				pc.shield -= 1;
			}
			if(pc.shield <= 0){
				explosions.push(createExplosion(pc.x, pc.y, 3, 50));	
				pc.lifes -= 1;
				pc.y = -1500;
			}
			if(enemies[i].myIndex >= 3){
				// Cria a explosão para os asteróides destruídos
				explosions.push(createExplosion(enemies[i].x, enemies[i].y, 1, (6 - enemies[i].myIndex) * 8 ));	
				if(enemies[i].myIndex == 3){
					// Cria mais dois asteróides médios no lugar de um asteróide grande destruído
					if(Math.random()*100 <= (40 - 35 * pc.pwr_up) && pc.shd_expand <= 0){
						items.push(createCollectable(pc.pwr_up, enemies[i].x,  enemies[i].y));
					} else{
						enemies.push(createEnemy(gameTime, 4, enemies[i].x - 16, enemies[i].y, - enemies[i].vx * 3, enemies[i].vy * 1.8));
						enemies.push(createEnemy(gameTime, 4, enemies[i].x + 16, enemies[i].y, enemies[i].vx * 3, enemies[i].vy * 1.5));
					}
					
				}
			} else{
				// Cria a explosão para as naves destruídas
				explosions.push(createExplosion(enemies[i].x, enemies[i].y));
			}
			// Joga o inimigo para longe para ser deletado pela restrição do mesmo
			enemies[i].y = 1200;
		}
		// Retorna o raio do jogador ao normal
		pc.radius = 42;
		// Cuida da colisão dos tiros do jogador com os inimigos
		for (j in bullets){
			if(bullets[j].circularCollisionDetection(enemies[i])){
				if(enemies[i].myIndex >= 3){
					// Cria a explosão para os asteróides destruídos
					explosions.push(createExplosion(enemies[i].x, enemies[i].y, 1, (6 - enemies[i].myIndex) * 8 ));	
					if(enemies[i].myIndex == 3){
						if(Math.random()*100 <= (40 - 35 * pc.pwr_up) && pc.shd_expand <= 0 && items.length == 0){
							items.push(createCollectable(pc.pwr_up, enemies[i].x,  enemies[i].y));
						} else{
							enemies.push(createEnemy(gameTime, 4, enemies[i].x - 16, enemies[i].y, - enemies[i].vx * 3, enemies[i].vy * 1.8));
							enemies.push(createEnemy(gameTime, 4, enemies[i].x + 16, enemies[i].y, enemies[i].vx * 3, enemies[i].vy * 1.5));
						}
					}
				} else{
					// Cria a explosão para as naves destruídas
					explosions.push(createExplosion(enemies[i].x, enemies[i].y));
				}
				// Joga o inimigo e bala para longe para que possam ser deletados pela suas respectivas restrições
				enemies[i].y = 1200;
				bullets[j].y = -1200;
				pc.score += enemies[i].radius;
			}	
		}
	}

	for(i in items){
		items[i].move();
		items[i].restrictions();
		items[i].draw();
		if(pc.circularCollisionDetection(items[i])){
			pc.pwr_up += 1;
			deleteItems.push(items[i]);
		}
	}

	for (i in enemyBullets){
		// Cuida da movimentação e atualização das balas disparadas pelos inimigos
		enemyBullets[i].move();
		enemyBullets[i].draw();	
		// Altera o raio do jogador para detectar a colisão com o escudo caso o mesmo esteja em expansão
		pc.radius += pc.shd_expand/2;
		// Cuida da colisão dos tiros inimigos com o escudo do jogador (inimigos são destruídos ao colidir com o escudo e diminuem a energia do escudo)
		if(pc.circularCollisionDetection(enemyBullets[i])  && pc.shield > 0){
			// Cria explosão para os tiros colididos com o escudo
			explosions.push(createExplosion(enemyBullets[i].x, enemyBullets[i].y, 2, 24));
			// Escudo em expansão significa indestrutibilidade
			if(pc.shd_expand <=0){
				pc.shield -= 0.5;
			}
			if(pc.shield <= 0){
				explosions.push(createExplosion(pc.x, pc.y, 3, 50));	
				pc.lifes -=1;
				pc.y = -1500;
			}
			//Joga tiro para longe para ser deletado por sua restição
			enemyBullets[i].y = -1200;
		}
		// Retorna raio do jogador para o normal
		pc.radius = 42;
		enemyBullets[i].restrictions();
	}
	// Atualiza animação da explosão
	for(i in explosions){
		explosions[i].draw();	
		explosions[i].restrictions();
	}
	// Deleta inimigos
	for(i in deleteEnemies){
		if(enemies.indexOf(deleteEnemies[i]) >= 0){
			enemies.splice(enemies.indexOf(deleteEnemies[i]), 1);
		}
		deleteEnemies.shift();
	}
	// Deleta disparos do jogador
	for(i in deleteBullets){
		if(bullets.indexOf(deleteBullets[i]) >= 0){
			bullets.splice(bullets.indexOf(deleteBullets[i]), 1);
		}
		deleteBullets.shift();
	}
	// Deleta itens coletáveis
	for(i in deleteItems){
		if(items.indexOf(deleteItems[i]) >= 0){
			items.splice(items.indexOf(deleteItems[i]), 1);
		}
		deleteItems.shift();
	}
	// Deleta explosões
	for(i in deleteExplosions){
		if(explosions.indexOf(deleteExplosions[i]) >= 0){
			explosions.splice(explosions.indexOf(deleteExplosions[i]), 1);
		}
		deleteExplosions.shift();
	}
	// Deleta disparos inimigos
    for(i in deleteEnemyBullets){
		if(enemyBullets.indexOf(deleteEnemyBullets[i]) >= 0){
			enemyBullets.splice(enemyBullets.indexOf(deleteEnemyBullets[i]), 1);         
		}
		deleteEnemyBullets.shift();     
	} 
	if(pc.shield < 0){
		pc.shield = 0;
	}
	else if(pc.shield > 10){
		pc.shield = 10;
	}

	drawInterface();
}

function keyPress(e){
	switch(e.keyCode){
		case 32: 	//espaço
			if(drawback <= 0.05){

				switch(pc.pwr_up % 3){
					case 2:
						bullets.push(createBullet(pc.x, pc.y, 1));
						bullets.push(createBullet(pc.x, pc.y, 2));
						drawback += 0.03;
					case 0:
						bullets.push(createBullet(pc.x, pc.y, 0));
						break;
					case 1:
						bullets.push(createBullet(pc.x + 12, pc.y, 0));
						bullets.push(createBullet(pc.x - 12, pc.y, 0));
						drawback += 0.02;
						break;
				}
				drawback += 0.20;
			}
			break;
		case 37: 	//esquerda
			pc.vx = -250;
			//pc.ax = -100;
			break;
		case 38: 	//cima
			pc.vy = -250;
			//pc.ay = -100;
			break;
		case 39: 	//direita
			pc.vx = 250;
			//pc.ax = 100;
			break;
		case 40: 	//baixo
			pc.vy = 250;
			//pc.ay = 100;
			break;
	}
}

function drawInterface(){

	ctx.fillStyle = 'hsl('+pc.shield/10*120+', 100%, 25%)';;
	ctx.strokeStyle = "rgb(0, 0, 200)";
	ctx.lineWidth = 1;

	ctx.beginPath();
	ctx.moveTo(10, 10);
	ctx.lineTo(10 + pc.shield*10, 10);
	ctx.lineTo(10 + pc.shield*10, 30);
	ctx.lineTo(10, 30);
	ctx.lineTo(10, 10);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	for(i = 0; i < pc.lifes; i++){
		ctx.drawImage(ship, 0, 0, 512, 512, myScreen.width - 35 - i * 40, 10, 30, 30);	
	}

	ctx.fillStyle = "white";
	ctx.font = "16px Arial";
	ctx.fillText("Pontos: "+pc.score, 10, 50);

	ctx.font = "20px Arial";
	ctx.fillText(Math.floor(pc.shield * 10) + "%", 15 + pc.shield*10, 30);	
	
}

function keyRelease(e){
	switch(e.keyCode){
		case 40: 	//baixo
		case 38: 	//cima
			//pc.ay = 0;
			pc.vy = 0;
			break;
		case 39: 	//direita
		case 37: 	//esquerda
			//pc.ax = 0;
			pc.vx = 0;
			break;
	}
}


setInterval(step, 1000/fps);
addEventListener("keydown", keyPress);
addEventListener("keyup", keyRelease);