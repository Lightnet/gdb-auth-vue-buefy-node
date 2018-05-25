/*
	Created by: Lightnet

	Information: Prototype build.

*/
import RPGData from '../common/RPGData';
import RPGCharacter from '../common/RPGCharacter';

//console.log("RPGData");
//console.log(RPGData);

var CommandSet = require('discord-routes').CommandSet;

export default class DBotFramework{

	constructor(options){
		this.client = options.client || null;
		this.io = options.io || null;
		this.gun = options.gun || null;
		this.bots = [];
		this.setup();
	}

	setup(){
		//console.log(client);
		let client = this.client;
		client.on('ready', () => {
			console.log(`Logged in as ${client.user.tag}!`);
		});
		//client.on('message', msg => {
			//if (msg.content === 'ping') {
				//msg.reply('Pong!');
			//}
		//});
		var commands = this.commands = new CommandSet(client, '!c');
		// responds to all unrecognized paths with a simple help message
		commands.set('', req => {
			req.reply('Try \'!bot ping\'!');
		});
		// responds to '!bot ping' with 'Pong!'
		commands.set('ping', req => {
			req.reply('Pong!');
		});

		commands.set('status', req => {
			//req.reply('checking..!');
			this.getstatus(req);
		});

		// hello world
		// '!bot hello world arg1 arg2' should reply with 'arg1 arg2'
		commands.set('hello world', (req, args) => {
			console.log(args);
			req.reply('Hello world! You gave me these arguments: ' + args.join(' '));
		});
		
		// binds to message event listener
		commands.listen();
		console.log("bot commands setup...");
	}

	async getstatus(req){
		//!c status
		console.log('status!');
		//console.log(req.author.username);
		let gun = this.gun;

		let user = await gun.get(req.author.id).then();

		//console.log('test.......................', user);
		if(!user){
			user = {
				id:req.author.id,
				username:req.author.username,
				hp:100,
				maxhp:100,
				mp:100,
				maxmp:100,
				attack:2,
				defense:1,
				magicattack:1,
				magicdefense:1,
				exp:0,
				nextexp:5,
				level:0,
			}
			gun.get(req.author.id).put(user);
		}
		this.diplaystatus(req,user);
		
		/*
		gun.get(req.author.id).once((data)=>{
			//console.log(data);
			if(data != null){
				console.log("used!");
				console.log("data >>> ");
				console.log(data);
				this.diplaystatus(data)
			}else{
				console.log("create");
				let user = {
					id:req.author.id,
					username:req.author.username,
					hp:100,
					maxhp:100,
					mp:100,
					maxmp:100,
					attack:2,
					defense:1,
					magicattack:1,
					magicdefense:1,
					exp:0,
					nextexp:5,
					level:0,
				}
				
				gun.get(req.author.id).put(user);
				this.diplaystatus(user);

			}
		});
		*/
	}

	diplaystatus(req,data){
		//console.log("display info?",data);
		//req.reply('Name: ' + data.username);
		req.reply('\nHP: ' + data.hp + '/' + data.maxhp + '\n' +
			'Attack: ' + data.attack + '\n' +
			'Defense: ' + data.defense + '\n' +
			'Magic Attack: ' + data.magicattack + '\n' +
			'Magic Defense: ' + data.magicdefense + '\n' +
			'Exp: ' + data.exp + '\n' +
			'Next Exp: ' + data.nextexp);

	}

}