const randomNumber = (max, min) => {
	return Math.floor(Math.random() * (max - min)) + min;
}
class BeeHive {
	constructor(queen = null, workers = null, warriors = null){
		this.queen = queen == null ? new Queen() : queen;
		this.workers = workers == null ? new Workers(randomNumber(10,15)) : workers;
		this.warriors = warriors == null ? new Warriors(randomNumber(10,15)) : warriors;
		this.bees = [
			this.queen,
			this.workers.workers,
			this.warriors.warriors
		];
	}

	beeType(index){
		return index === 0 ? 'Queen': index === 1 ? 'Worker': index === 2 ? 'Warrior':null;
	}

	attack(victimHive){
		let attacker,victimBee,attackerType,victimBeeType;
		victimBee = this.chooseBee(victimHive);

		//queen attack
		attackerType = 'Queen';
		attacker = this.bees[0];
		victimBee.id = victimBee.id ? victimBee.id : 'Queen';
		victimBee.health-=attacker.damage;
		this.verbose(`${attackerType} attacks ${victimBee.type ? victimBee.type : 'Queen'} BeeID:${victimBee.id}`);


		//workers attack
		this.bees[1].map( (bee, index) => {
			attacker = bee;
			victimBee = this.chooseBee(victimHive);
			victimBee.id = victimBee.id ? victimBee.id : 'Queen';
			victimBee.health-=attacker.damage[randomNumber(0,3)];
			this.verbose(`${attacker.type}BeeID:${attacker.id} attacks ${victimBee.type ? victimBee.type : 'Queen'} BeeID:${victimBee.id}`);
		});

		//warriors attack
		this.bees[2].map( (bee, index) => {
			attacker = bee;
			victimBee = this.chooseBee(victimHive);
			victimBee.id = victimBee.id ? victimBee.id : 'Queen';
			victimBee.health-=attacker.damage[randomNumber(0,3)];
			this.verbose(`${attacker.type}BeeID:${attacker.id} attacks ${victimBee.type ? victimBee.type : 'Queen'} BeeID:${victimBee.id}`);
		});
	}

	verbose(text){
		console.log(text);
	}

	chooseBee(hive){
		let beeType = randomNumber(0,3);
		if(beeType === 0){
			return hive.bees[beeType];
		}else{
			return hive.bees[beeType][randomNumber(0, hive.bees[beeType].length)];
		}
	}


}

class Queen{
	constructor(){
		this.health = 50;
		this.damage = 1;
	}
}

class Workers{
	constructor(amount){
		this.workers = [];
		for(let i = 1; i <= amount; i++)
		{
			let attr = {
				id:i,
				health:5,
				damage:[2,3,4],
				type: 'Worker'
			}
			this.workers.push(attr);
		}
	}
}

class Warriors{
	constructor(amount)
	{	this.warriors = [];
		for(let i = 1; i <= amount; i++)
		{
			let attr = {
				id:i,
				health:10,
				damage:[4,5,6,7],
				type: 'Warrior'
			}
			this.warriors.push(attr);
		}
	}
}

const startWar = (b1, b2) => {

	b1.verbose('----------- War Begins! -----------');
	warInterval = setInterval(() => {
		let date = new Date();
		let time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
		let updateText = `[tick:${time}]`;

		// ShowText(updateText);
		LaunchAttack(b1, b2);
		checkIfQueenIsDead();

	}, 1000);
}

const LaunchAttack = (b1, b2) => {
	checkIfQueenIsDead = () => {
		if(b1.bees[0].health <= 0){
			b1.verbose('BeeHive 1 Queen is DEAD, The winner is Beehive2');
			b1.verbose('----------- War Ends! -----------');
			clearInterval(warInterval);
		}else if(b2.bees[0].health <= 0){
			b2.verbose('BeeHive 2 Queen is DEAD, The winner is Beehive1');
			b1.verbose('----------- War Ends! -----------');
			clearInterval(warInterval);
		}else{
			b1.verbose(`BeeHive1 Queen Health: ${b1.bees[0].health} && BeeHive2 Queen Health: ${b2.bees[0].health} After attack`);
			b1.verbose('');
			b1.verbose('');
		}
	}

	b1.attack(b2);
	b2.attack(b1);
}

let b1 = new BeeHive();
let b2 = new BeeHive();
let warInterval;
startWar(b1, b2);
