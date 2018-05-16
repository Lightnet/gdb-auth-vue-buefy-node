<template>
	<div>
		<div v-if="blogin">
			<div class="field">
			<label>Chat Room:(Not public yet!)</label>
			<b-switch v-model="bchatlistselect">Chat Room List</b-switch>
			</div>
			<div v-if="bchatlistselect">
				<ChatList
					:chatrooms="chatrooms"
					@chatroomselect="chatroomselect"
				></ChatList>
			</div>
			<ChatLog 
				:messages="messages"
			></ChatLog>
			<div>
				<ChatInput
					v-model="chatmessage"
					placeholder="Type something here..."
					@enterchat="enterchat"
					@keydown.enter.native="sentmessage"
				></ChatInput>
			</div>
		</div>
		<div v-else>
			<br>
			<center>
            	<b-icon pack="fas" icon="user"></b-icon>
            	Please Login.
            	<b-icon
                	pack="fas"
                	icon="exclamation-triangle">
            	</b-icon>
        	</center>
		</div>
	</div>
</template>

<script>
//event on and emit global
import bus from '../bus';

import ChatList from './chat/ChatList-template.vue';
import ChatLog from './chat/ChatLog-template.vue';
import ChatInput from './chat/ChatInput-template.vue';

export default {
	//props:['blogin'],
	data() {
		return{
			bchatlistselect:true,
			userpublickey:'',
			blogin:false,
			messages:[],
			sendersubject:'test subject',
			chatmessage:'test message',
			publickey_chat : '0CKF4mpoQ1KcQy_mNOoIgB5EjoAhPwLe49bGn5URdBY.XqRVAfqyCpyUawlUDumtMitr6IZrRIUUEwNV6z-onNM',
			epublickey_chat : '0VhBMpjKslndJbh3BFmNWca1TeIFq4PEerZJcRmNH9k.pW-MTXsu7witNqyYLGIuguQhDpZ5TCojE87O9gOB9nc',
			chatidhandle:'chatscroll',
			chatrooms:[
				{id:'233w45',name:'test'},
				{id:'232345',name:'test2'},
				{id:'2s2345',name:'test3'},
			],
		}
	},
	components: {
		'ChatList':ChatList,
		'ChatLog':ChatLog,
		'ChatInput':ChatInput,
	},
	watch:{},
	beforeCreate() {},
	created(){
		//bus.$on('action',this.action);
		//check if user exist to load page
		if(this.$root.user.is){
			this.blogin = true;
			this.updateChatMessages();
		}
	},
	mounted(){
		//window.addEventListener('resize', this.handleResize);
		//this.handleResize();
	},
	computed: {

	},
	methods:{
		chatroomselect(event){
			console.log(event);
		},
		handleResize(event){
			if(!document.getElementById(this.chatidhandle))
				return;
			if(window.innerHeight > 300){
				let scrollheight = window.innerHeight - 150;
				document.getElementById(this.chatidhandle).style.height = scrollheight + 'px';
			}
		},
		genChatKey(){
			console.log(Gun.SEA.pair());
		},
		chateditchange(event){
			//console.log('event',event);
			//console.log(event.id);
			//console.log(event.message);
			let user = this.$root.$gun.user();
			user.get('chatroom').get(this.publickey_chat).get(event.id).put({message:event.message});
			event.bedit = false;
		},
		async updateChatMessages(){
			//console.log("list?");
			let gun = this.$root.$gun;
			let user = this.$root.user;
			let self = this;

			//let to = this.$root.$gun.user(this.publickey_chat);
			//let dec = await Gun.SEA.secret(this.epublickey_chat, user.pair());

			user.get('chatroom').map().once((data,id)=>{
				//console.log("chat data");
				//console.log("data",data);
				//console.log('id',id);
				if((data == null)||(data == 'null'))
					return;
				self.messages.push({id:id,from:data.alias,message:data.message,bedit:false});
			});

			//user.get('chatroom').get(this.publickey_chat).map().once((say,id)=>{
				//console.log("user chat");
				//this.UI(say,id,dec);
				//self.messages.push({id:say.id,text:say.message});
			//});

			//to.get('chatroom').get(user.pair().pub).map().once((say,id)=>{
				//console.log("to chat");
				//this.UI(say,id,dec);
				//self.messages.push({id:say.id,text:say.message});
			//});
		},
		async UI(say, id, dec){
			say = await Gun.SEA.decrypt(say,dec);
			//console.log(say);
			if(!say)
				return;
			this.messages.push({id:id,from:say.alias,message:say.message,bedit:false});
		},
		enterchat(event){
			this.chatmessage = event;
			console.log('test');
			this.sentmessage();
		},
		async sentmessage(){
			//console.log("send!");
			//console.log(this.$root.user);
			
			let user = this.$root.$gun.user();
			var messagedata ={
				//'_':{'#':public_pair().pub},
				pub:user.is.pub,
				alias:user.is.alias,
				message:this.chatmessage,
				bedit:'none',
			};
			
			//var sec = await Gun.SEA.secret(this.epublickey_chat, user.pair());
			//var enc = await Gun.SEA.encrypt(messagedata, sec);
			let enc = messagedata;
			user.get('chatroom').set(enc, function(ack){
				//console.log(ack);
			});

			this.chatmessage = '';
			
			//user.get('chatroom').get(this.publickey_chat).set(enc, function(ack){
				//console.log(ack);
			//});
		},
		editchat(event){
			//console.log("edit",event);
			event.bedit = event.bedit != true;
			//console.log(event.bedit);
		},
		deletechat(event){
			//console.log("delete",event);
			let user = this.$root.$gun.user();

			//user.get('chatroom').get(this.publickey_chat).get(event.id).put('null');
			user.get('chatroom').get(event.id).put('null');

			this.messages = this.messages.filter(todo => {
				return todo.id !== event.id;
			});
		},
	},
	beforeDestroy: function () {
		//console.log('beforeDestroy');
  		//window.removeEventListener('resize', this.handleResize);
	}
}
</script>

<style lang="scss">
.wrap{
	content: "HTML";
}
</style>
