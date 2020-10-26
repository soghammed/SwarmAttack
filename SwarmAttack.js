let env = typeof process === 'undefined' ? 'browser' : 'console';
let c = typeof process === 'undefined' ? document.getElementById("field") : null;

const randomNumber = (max, min) => {
	return Math.floor(Math.random() * (max - min)) + min;
}
const verbose = (text) => {
	console.log(`[] ${text}`);
	if(env === 'browser'){
		graphicVerbose(text);
	}
} 
const graphicVerbose = (text) => {
	let commentaryBox = document.querySelector('#commentary')
	commentaryBox.innerHTML += `<br>${text}`;
	commentaryBox.scrollTop = commentaryBox.scrollHeight;
}
const circle = (d, x, y, radius, fillCircle, alpha = 1) =>{

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

class Bee{
	constructor(type, x, y){
		this.victim = null;
		this.x = x;
		this.y = y;
		this.active = 1;
		switch(type)
		{
			case 'queen':
				this.attr = {
					type:type,
					health: 50,
					damage: 1
				}
				break;
			case 'worker':
				this.attr = {
					type:type,
					health: 5,
					damage: [2,3,4]
				}
				break;

			case 'warrior':
				this.attr = {
					type:type,
					health:10,
					damage:[4,5,6,7]
				}
				break;
		}
	}

	draw(d){
		d.lineWidth = 1;
		d.strokeStyle = 'black';
		circle(d, this.x,this.y, 3, true, this.active ? 1 : 0.2);
	}
	boundaries(width, height){
		if(this.x >= width){
		 this.x = width - 10;
		}
		 if(this.x <= 0){
		 this.x = 10;
		}
		if(this.y >= height){
		 this.y = height - 10;
		}
		if(this.y <= 0){
		 this.y = 10;
		}
	}

	setVictim(victim){
		this.victim = victim;
	}
	graphicAttack(){
		if(this.victim != null && this.active){
			this.x = this.victim.x
			this.y = this.victim.y;
		}
	}

	buzz(){
		var offsetx = Math.floor((Math.random() * 4 - 2) + 0.5);
		var offsety = Math.floor((Math.random() * 4 - 2) + 0.5);
		this.x += offsetx;
		this.y += offsety;
	}

	attack(victimBee, victimHive){
		if(this.attr.type != 'queen'){
			victimBee.attr.health-=this.attr.damage[randomNumber(0,this.attr.damage.length)];
		}else{
			victimBee.attr.health-=this.attr.damage;
		}
		//graphic attack
		// let victimBeeHiveIndex = parseInt(victimHive.id.replace( /^\D+/g, '')) - 1;
		let victimbeeraphic = victimBee;
		let attackerbeeraphic = this;
		this.setVictim(victimbeeraphic);
		if(victimBee.attr.type === 'queen'){
			verbose(`***************************`);
			verbose(`${victimHive.id} BeeHive Queen is attacked`);
			verbose(`${victimHive.id} BeeHive Queen Health: ${victimBee.attr.health}`);
			verbose(`***************************`);
		}
	}
}

class BeeHive{
	constructor(id){
		let lastPositionX, lastPositionY;
		let workers = [];
		let warriors = []
		if(id === 'b1'){
			lastPositionX = 10;
			lastPositionY = 20;
		}else if(id === 'b2'){
			lastPositionX = 10;
			lastPositionY = 80;
		}
		let queen = [new Bee('queen', lastPositionX, lastPositionY)];
		//workers
		for(var i = 0; i < randomNumber(15,20); i++){
			lastPositionX+=25;
			//new row of bees;
			if(i % 11 === 0){
				lastPositionY+=20
				lastPositionX = 1+25
			}
			workers.push(new Bee('worker', lastPositionX, lastPositionY));
		}
		//warriors
		for(var i = 0; i < randomNumber(10,15); i++){
			lastPositionX+=25;
			//new row of bees;
			if(i % 11 === 0){
				lastPositionY+=20
				lastPositionX = 1+25
			}
			warriors.push(new Bee('warrior', lastPositionX, lastPositionY));
		};
		this.bees = queen.concat(workers, warriors);
		this.id = id;
		this.attackStopped = 0;
		//assign id for each bee
		this.bees.map( (bee, index) => {
			bee.attr.id = index;
		})
	}
	attack(victimHive){
		let checkIfEitherQueenIsDead = () => {
		    return victimHive.bees[0].attr.health <= 0 || this.bees[0].attr.health <= 0 ? true : false;
		}
		let victimBee;
		if(!checkIfEitherQueenIsDead()){
			verbose(`\n--------- ${this.id} BeeHive to Attack ${this.bees.length} times ---------\n`);
			this.bees.map( (bee,index) => {
				//each bee attacks if queen isnt dead
				if(!checkIfEitherQueenIsDead()){
					//select victim
					victimBee = this.chooseVictimBee(victimHive);
					if(victimBee){
						//if bee exists check still alive otherwise re select bee;
						while(victimBee.attr.health <= 0){
							victimBee = this.chooseVictimBee(victimHive);
						}
						verbose(`${this.id}Bee${bee.attr.id} Attacking ${victimHive.id}Bee${victimBee.attr.id}`);
						bee.attack(victimBee, victimHive);
					}
				}else{
					this.endWar();
					return;
				}
			});
		}
	}

	endWar(){
		if(!this.attackStopped){
			verbose('QUEEN IS DEAD!');
			verbose(`\n-------------- Winner: ${this.id} BeeHive! --------------`)
			if(c === 'browser'){
				document.querySelector('.title').innerHTML = `-------------- Winner: ${this.id} BeeHive! --------------`;
			}
			clearInterval(warInterval);
			this.attackStopped = 1;
			// clearGraphics();
		}
	}

	chooseVictimBee(victimHive){
		let beeIndex = randomNumber(0, victimHive.bees.length);
		if(victimHive.bees[0].attr.health > 0){
			return victimHive.bees[beeIndex];
		}else{
			return 'Queen Dead'
		}
	}
}

const startGraphic =  (b1, b2) => {
	let beehiveArr = [b1, b2];
	let width = c.width;
	let height = c.height;
	let d = c.getContext('2d');
	let canvasInterval;
	canvasInterval = setInterval(() => {
		d.clearRect(0,0,width,height);
		d.globalAlpha = 1;
		d.fillStyle = "#2d2d2d";
		d.fillRect(0, 0, c.width, c.height)
		for(let i = 0; i < beehiveArr.length; i++)
		{
			beehiveArr[i].bees.map( (bee,index) => {
				if(i === 0 && bee.attr.health <= 0 || i === 1 && bee.attr.health <= 0){
					bee.active = 0;
				}
				if(index === 0){
					//queen
					if(i === 0){
						//beehive1
						d.fillStyle = 'brown';
					}else{
						//beehive2
						d.fillStyle = 'purple';
					}
				}else if(i === 0){
					//beehive 1
					d.fillStyle = 'blue';
				}else{
					//beehive2
					d.fillStyle = 'green';
				}
				d.font = '6px verdana';
				bee.boundaries(width, height);
				//draw bee
				bee.draw(d);
				d.fillStyle = 'white';
				//add health
				d.fillText(`+${i === 0 ? b1.bees[index].attr.health <= 0 ? 0 : b1.bees[index].attr.health : b2.bees[index].attr.health <= 0 ? '' : b2.bees[index].attr.health}`, bee.x-4.5, bee.y-10);
				d.font = '7px verdana';
				//add bee id
				d.fillText(`${index === 0 ? `${beehiveArr[i].id}`: index}`, bee.x-3.5, bee.y+4);
				//fix
				if(bee.active){
					if(bee.victim !=null && bee.victim.active){
						bee.graphicAttack();
					}
					bee.buzz();
				}
			})
		}
	}, 60);
}

const startWar = (b1, b2) => {
	verbose(`-------------- War: ${b1.id} vs ${b2.id} Begins! --------------\n`);
	if(env === 'browser'){
		startGraphic(b1, b2);
	}
	warInterval = setInterval(() => {
		let date = new Date();
		let time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
		let updateText = `[tick:${time}]`;
		LaunchAttack(b1, b2);

	}, 2000);
}

const LaunchAttack = (b1, b2) => {
	b1.attack(b2);
	b2.attack(b1);
}

let b1 = new BeeHive('b1');
let b2 = new BeeHive('b2');

let warInterval;
startWar(b1, b2);