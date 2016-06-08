var imgItems = [];
var items = []; 
var deleteItems = [];

for(i = 0; i < 2; i++){
	imgItems[i] = new Image();
}

imgItems[0].src = "pwr_up1.png";
imgItems[1].src = "pwr_up2.png";

createCollectable = function(index, x, y, radius = 21){
	var item = new Sprite();
	item.radius = radius;
	item.myIndex = index;
	item.x = x;
	item.y = y;
	item.vy = 30;
	item.vx = 30;
	item.ax = -10;

	item.restrictions = function(){
		if(this.vx <= -30 || this.vx >= 30){
			item.ax = - item.ax;
		}
		if(this.y >= myScreen.height + this.radius){
			deleteItems.push(this);
		}
	}

	item.draw = function(){

		ctx.drawImage(imgItems[this.myIndex], this.x - this.radius, this.y - this.radius, 2*this.radius, 2*this.radius);		
	}

	return item;
}