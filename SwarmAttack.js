const randomNumber = (max, min) => {
	return Math.floor(Math.random() * (max - min)) + min;
}
const verbose = (text) => {
	console.log(`[] ${text}`);
} 
const graphicVerbose = (text) => {
	try{
		document.querySelector('.commentary').innerHTML = `${text}`;
	}catch{

	}
}
class Bee{
	constructor(type){
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

	attack(victimBee, victimHive){
		if(this.attr.type != 'queen'){
			victimBee.attr.health-=this.attr.damage[randomNumber(0,this.attr.damage.length)];
		}else{
			victimBee.attr.health-=this.attr.damage;
		}
		//graphic attack
		let victimBeeHiveIndex = parseInt(victimHive.id.replace( /^\D+/g, '')) - 1;
		let victimBeeGraphic = bees[victimBeeHiveIndex][victimBee.attr.id];
		let attackerBeeGraphic = bees[victimBeeHiveIndex === 0 ? 1 : 0][this.attr.id];
		// console.log('Attacker', attackerBeeGraphic, 'Victim', victimBeeGraphic);
		// attackerBeeGraphic.attack(victimBeeGraphic);
		attackerBeeGraphic.setVictim(victimBeeGraphic);
		// attackerBeeGraphic.x = victimBeeGraphic.x;
		// attackerBeeGraphic.y = victimBeeGraphic.y;
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
		let queen = [new Bee('queen')];
		let workers = [];
		let warriors = []
		for(var i = 0; i < randomNumber(15,20); i++){
			workers.push(new Bee('worker'));
		}
		for(var i = 0; i < randomNumber(10,15); i++){
			warriors.push(new Bee('warrior'));
		};
		this.bees = queen.concat(workers, warriors);
		this.id = id;
		this.attackStopped = 0;
		//assign id for each bee
		this.bees.map( (bee, index) => {
			bee.attr.id = index;
		})
		// initBeeGraphics(this);
	}
	attack(victimHive){
		let checkIfEitherQueenIsDead = () => {
		    return victimHive.bees[0].attr.health <= 0 || this.bees[0].attr.health <= 0 ? true : false;
		}
		let victimBee;
		if(!checkIfEitherQueenIsDead()){
			verbose(`--------- ${this.id} BeeHive to Attack ${this.bees.length} times ---------\n`);
			this.bees.map( async (bee,index) => {
				if(!checkIfEitherQueenIsDead()){
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
		verbose(`\n`);
	}

	endWar(){
		if(!this.attackStopped){
			graphicVerbose(`-------------- Winner: ${this.id} BeeHive! --------------`);
			verbose('QUEEN IS DEAD!');
			verbose(`\n-------------- Winner: ${this.id} BeeHive! --------------`)
			clearInterval(warInterval);
			this.attackStopped = 1;
			// clearGraphics();
		}
	}

	chooseVictimBee(victimHive){
		let beeIndex = randomNumber(0, victimHive.bees.length);
		// console.log('victimbeeIndex', beeIndex, victimHive.bees[beeIndex].attr.health);
		if(victimHive.bees[0].attr.health > 0){
			// verbose(`queen health ${victimHive.bees[0].attr.health}`);
			return victimHive.bees[beeIndex];
		}else{
			return 'Queen Dead'
		}
	}
}

const startWar = (b1, b2) => {
	verbose(`-------------- War: ${b1.id} vs ${b2.id} Begins! --------------\n`);
	graphicVerbose(`-------------- War: ${b1.id} vs ${b2.id} Begins! --------------\n`);
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