<template>
	<div>
		<div v-if="blogin">
			<b-field>
				<p class="control is-expanded">
					<label class="label">Chat Room: {{chatroomname}}</label>
				</p>
				<p class="control">
					<b-switch v-model="bchatlistselect">Chat Room List</b-switch>
				</p>
			</b-field>
			<div v-if="bchatlistselect">
				<ChatList
					:chatrooms="chatrooms"
					:chatdata="chatdata"
					@chatroomselect="chatroomselect"
				></ChatList>
			</div>
			<ChatLog 
				:messages="messages"
				@editchatmessage="editchatmessage"
				@deletechatmessage="deletechatmessage"
				@editchangemessagechange="editchatmessagechange"
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
			bchatlistselect:false,
			blogin:false,
			messages:[],
			chatmessage:'test message',
			chatdata:null,
			chatroomname:'Null',
			chatrooms:[
				//{id:'233w45',name:'test'},
			],
		}
	},
	components: {
		'ChatList':ChatList,
		'ChatLog':ChatLog,
		'ChatInput':ChatInput,
	},
	beforeCreate() {},
	created(){
		//bus.$on('action',this.action);
		//check if user exist to load page
		if(this.$root.user.is){
			this.blogin = true;
			//this.updateChatMessages();
			this.updatechatlist();
		}
	},
	computed: {

	},
	methods:{
		updatechatlist(){
			let user = this.$root.$gun.user();
			user.get('chatlist').map().once((data,id)=>{
				//console.log(data);
				//console.log("list?");
				if((data == 'null')||(data == null))
					return;
				if(!data.key)
					return;
				//console.log(data);
				this.chatrooms.push({
					id:id,
					name:data.name,
					access:data.access,
					own:data.own,
					pub:data.pub,
					key:data.key
				});
			});
		},
		chatroomselect(event){
			//console.log(event);
			let user = this.$root.$gun.user();
			this.messages = [];
			//console.log('clear message');
			//console.log(event);
			this.chatdata = event;
			this.chatroomname = event.name;
			this.updateChatMessages();
			this.bchatlistselect = false;
		},
		handleResize(event){
			if(!document.getElementById(this.chatidhandle))
				return;
			if(window.innerHeight > 300){
				let scrollheight = window.innerHeight - 150;
				document.getElementById(this.chatidhandle).style.height = scrollheight + 'px';
			}
		},
		//genChatKey(){
			//console.log(Gun.SEA.pair());
		//},
		editchatmessagechange(event){
			//console.log('event',event);
			//console.log(event.id);
			//console.log(event.message);
			//let user = this.$root.$gun.user();
			//user.get('chatroom').get(this.publickey_chat).get(event.id).put({message:event.message});
			let gun = this.$root.$gun;
			let user = this.$root.$gun.user();

			if(!this.chatdata){
				//console.log("Null Chat Room!");
				return;
			}

			//user.get('chatroom').get(this.publickey_chat).get(event.id).put('null');
			//user.get('chatroom').get(event.id).put('null');
			if(this.chatdata.access == 'public'){
				gun.get(this.chatdata.key).get(event.id).put({message:event.message}, ack=>{
					//console.log(ack);
				});
			}

			event.bedit = false;
		},
		async updateChatMessages(){
			//console.log("list?");
			let gun = this.$root.$gun;
			let user = this.$root.user;
			let self = this;

			if(!this.chatdata)
				return;

			//let to = this.$root.$gun.user(this.publickey_chat);
			//let dec = await Gun.SEA.secret(this.epublickey_chat, user.pair());

			//console.log(this.chatdata);
			if(this.chatdata.access == 'public'){
				//console.log('key:'+ this.chatdata.key);
				//gun.get(this.chatdata.key).once(data=>{
					//console.log(data);
				//});
				gun.get(this.chatdata.key).map().once((data,id)=>{
					//console.log("chat data");
					//console.log("data",data);
					//console.log('id',id);
					if((data == null)||(data == 'null'))
						return;
					if(!data.message)
						return;
					self.messages.push({id:id,from:data.alias,message:data.message,bedit:false});
				});
			}

			if(this.chatdata.access == 'private'){


			}

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
			//console.log('test');
			this.sentmessage();
		},
		async sentmessage(){
			//console.log("send!");
			//console.log(this.$root.user);

			if(!this.chatdata){
				//console.log("Null Chat Room!");
				return;
			}
			let gun = this.$root.$gun;
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
			//let enc = messagedata;
			//user.get('chatroom').set(enc, function(ack){
				//console.log(ack);
			//});
			
			if(this.chatdata.access == 'public'){
				let enc = messagedata;
				gun.get(this.chatdata.key).set(enc,ack=>{
					//console.log(ack);
				});
			}

			this.chatmessage = '';
		},
		editchatmessage(event){
			//console.log("edit",event);
			event.bedit = event.bedit != true;
			//console.log(event.bedit);
		},
		deletechatmessage(event){
			//console.log("delete",event);
			let gun = this.$root.$gun;
			let user = this.$root.$gun.user();

			if(!this.chatdata){
				//console.log("Null Chat Room!");
				return;
			}

			//user.get('chatroom').get(this.publickey_chat).get(event.id).put('null');
			//user.get('chatroom').get(event.id).put('null');
			if(this.chatdata.access == 'public'){
				gun.get(this.chatdata.key).get(event.id).put('null', ack=>{
					//console.log(ack);
				});
			}

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
