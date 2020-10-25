window.onload = () => {
	// console.log(b1, b2);
	// initBees();
	// startWar(b1, b2);
}
// const randomNumber = (max, min) => {
// 	return Math.floor(Math.random() * (max - min)) + min;
// }
const c = document.getElementById("field");
let beehiveArr = [b1, b2];
let width = c.width;
let height = c.height;
let d = c.getContext('2d');

let bees = [];
let sim = 1;
const initBeeGraphics = async () => {
	// let beehiveElement = document.querySelector(`.${beehive.id}`);
	//black
	//gold
	await beehiveArr.map( (beehive, index) => {
		let lastPositionX = index === 0 ? 0.5 : 0.5;
		let lastPositionY = index === 0 ? 1 : 80;
		bees[index] = [];
		if(index === 0){
			d.fillStyle = 'orange';
		}else{
			d.fillStyle = 'red';
		}
		for(let i = 0; i < beehive.bees.length; i++)
		{
			lastPositionX+=25;
			if(i % 11 === 0){
				lastPositionY+=20
				lastPositionX = 1+25
			}

			bees[index][i] = new beeGraphic(lastPositionX, lastPositionY);
			bees[index][i].beehiveID = beehive.id; 
			bees[index][i].type = beehive.bees[i].attr.type;
			bees[index][i].id = `${beehive.id}bee${beehive.bees[i].attr.id}`;
			bees[index][i].health = beehive.bees[i].attr.health;
		}
		console.log(bees);
	})

	// let beeElements = beehive.bees.map( beeObject => {
	// 	let leftEar = document.createElement('div');
	// 	let rightEar = document.createElement('div');
	// 	let beeEl = document.createElement('div');
	// 	let beeElHealth = document.createElement('span');
	// 	beeElHealth.innerHTML = beeObject.attr.health;
	// 	beeEl.classList.add('bee');
	// 	beeEl.classList.add(beeObject.attr.type);
	// 	switch(beeObject.attr.type){
	// 		case 'queen':
	// 			beeEl.style.backgroundColor = 'red';
	// 			break;

	// 		case 'worker':
	// 			beeEl.style.backgroundColor = 'Green';
	// 			break;

	// 		case 'warrior':
	// 			beeEl.style.backgroundColor = 'Orange';
	// 			break;
	// 	}
	// 	beeEl.id = `${beehive.id}bee${beeObject.attr.id}`;
	// 	leftEar.classList.add('beeEar');
	// 	leftEar.classList.add('LeftEar');
	// 	rightEar.classList.add('beeEar');
	// 	rightEar.classList.add('RightEar');
	// 	beeEl.appendChild(leftEar);
	// 	beeEl.appendChild(rightEar);
	// 	beeEl.appendChild(beeElHealth);
	// 	beehiveElement.appendChild(beeEl)
	// 	// document.body.appendChild(bee);
	// 	// beehiveElement.innerHTML = (
	// 	// 	<div id='worker' class="bee">
	// 	// 		<div class="beeEar LeftEar"></div>
	// 	// 		<div class="beeEar RightEar"></div>
	// 	// 	</div>
	// 	// )
	// });
		// let beeObj = new bee();
		// beeObj.draw();
}

// const attackGraphic = (attackerBeeHive, attacker, victim, victimBeeHive) => {
// 	let attackerId = `${attackerBeeHive.id}bee${attacker.attr.id}`;
// 	let victimId = `${victimBeeHive.id}bee${victim.attr.id}`;
// 	let attackerEl = document.querySelector(`#${attackerId}`);
// 	let victimEl = document.querySelector(`#${victimId}`);
// }

function beeGraphic(x, y){
	this.x = x;
	this.y = y;
	this.active = 1;
	this.attacking = 0;
	this.victim = null;
	// this.x = randomNumber(3, 300);
	// this.y = randomNumber(3, 100);
}

beeGraphic.prototype.draw = function(){

	d.lineWidth = 1;
	d.strokeStyle = 'black';
	circle(this.x,this.y, 3, true, this.active ? 1 : 0.2);
}
beeGraphic.prototype.collision = function(){
	if(this.x > width){
	 this.x = width - 5;
	}
	 if(this.x < 0){
	 this.x = 5;
	}
	if(this.y > height){
	 this.y = height - 5;
	}
	if(this.y < 0){
	 this.y = 5;
	}
}

beeGraphic.prototype.setVictim = function(victim){
	this.victim = victim;
	console.log('setVictim', this.victim, this);
}
beeGraphic.prototype.attack = function(){
	// console.log(this.victim);
	if(this.victim != null && this.active){
		let oldx = this.x;
		let oldy = this.y;
		// console.log('victimooooooooooooo', this.victim);
		this.x = this.victim.x
		this.y = this.victim.y;
		// setTimeout( () => {
		// 	this.x = oldx;
		// 	this.y = oldy;
		// }, 1000);

	}else{
		// console.log('ok.......', this.victim);
	}
	// console.log('attack', attacker.id, victim.id
}

beeGraphic.prototype.buzz = function(){
	var offsetx = Math.floor((Math.random() * 6 - 3) + 0.5);
	var offsety = Math.floor((Math.random() * 6 - 3) + 0.5);
	this.x += offsetx;
	this.y += offsety;
}
const circle = (x, y, radius, fillCircle, alpha = 1) =>{

  d.beginPath();
  d.arc(x, y, radius+3, 0, Math.PI * 2, false);
  d.globalAlpha = alpha;
  if(fillCircle){
    d.fill();
  } else{
    d.stroke();
  }

  d.beginPath();
  d.arc(x+4.5,y-5, radius, 0, Math.PI * 2, false);
  // fillCircle= true;
  d.globalAlpha = alpha;
  d.fillStyle = 'black';
  if(fillCircle){
    d.fill();
  } else{
    d.stroke();
  }


  d.beginPath();
  d.arc(x-4.5,y-5, radius, 0, Math.PI * 2, false);
  d.globalAlpha = alpha;
  if(fillCircle){
    d.fill();
  } else{
    d.stroke();
  }

};  

clearGraphics = () => {
	clearInterval(canvasInterval);
}

initBeeGraphics();
let canvasInterval = setInterval(() => {
	d.clearRect(0,0,width,height);
	d.globalAlpha = 1;
	d.fillStyle = "#2d2d2d";
	d.fillRect(0, 0, c.width, c.height)
	for(let i = 0; i < bees.length; i++)
	{
		bees[i].map( (beeG,index) => {
			if(i === 0 && b1.bees[index].attr.health <= 0 || i===1 && b2.bees[index].attr.health <= 0){
				beeG.active = 0;
			}
				if(index === 0){
					if(i === 0){
						d.fillStyle = 'brown';
					}else{
						d.fillStyle = 'purple';
					}
				}else if(i === 0){
					d.fillStyle = 'blue';
				}else{
					d.fillStyle = 'green';
				}
				d.font = '6px verdana';
				beeG.draw();
				d.fillStyle = 'white';
				d.fillText(`+${i === 0 ? b1.bees[index].attr.health <= 0 ? '' : b1.bees[index].attr.health : b2.bees[index].attr.health <= 0 ? '' : b2.bees[index].attr.health}`, beeG.x-4.5, beeG.y-10);
				d.font = '7px verdana';
				d.fillText(`${index === 0 ? `${beeG.beehiveID}`: index}`, beeG.x-3.5, beeG.y+4);
				beeG.collision();	
				if(beeG.active){
					if(beeG.victim !=null && beeG.victim.active){
						beeG.attack();
					}
					beeG.buzz();
				}
		})
	}
}, 60);