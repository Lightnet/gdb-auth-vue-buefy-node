<template>
	<div id="chatscroll" style="overflow-y: scroll;">
		<div class="card" v-for="message in messages" :key="message.id">
			<div class="card-content">
				<label class="wrap" >Alias: {{ message.from }} > </label>
				<label class="wrap" v-if="!message.bedit">
					{{ message.message }}
				</label>

				<button class="button" style="float: right;" circle v-on:click="deletechat(message)">
					<b-icon
						pack="fas"
						icon="trash"
						>
					</b-icon>
				</button>


				<button class="button" style="float: right;" circle v-on:click="deletechat(message)">
					<b-icon
						pack="fas"
						icon="edit"
						>
					</b-icon>
				</button>
				
				<b-input v-if="message.bedit" v-model="message.message" v-on:change="chateditchange(message)">
				</b-input>
			</div>
		</div>
	</div>
</template>

<script>
//event on and emit global
import bus from '../../bus';

export default {
	//props:['blogin'],
	data() {
		return{
			bchatlistselect:false,
			userpublickey:'',
			blogin:false,
			messages:[],
			sendersubject:'test subject',
			chatmessage:'test message',
			publickey_chat : '0CKF4mpoQ1KcQy_mNOoIgB5EjoAhPwLe49bGn5URdBY.XqRVAfqyCpyUawlUDumtMitr6IZrRIUUEwNV6z-onNM',
			epublickey_chat : '0VhBMpjKslndJbh3BFmNWca1TeIFq4PEerZJcRmNH9k.pW-MTXsu7witNqyYLGIuguQhDpZ5TCojE87O9gOB9nc',
			chatidhandle:'chatscroll'
		}
	},
	created(){
		bus.$on('action',this.action);
		//check if user exist to load page
		if(this.$root.user.is){
			this.blogin = true;
			this.updateMessageList();	
		}
	},
	mounted(){
		window.addEventListener('resize', this.handleResize);
		this.handleResize();
	},
	methods:{
		handleResize(event){
			if(!document.getElementById(this.chatidhandle))
				return;
			if(window.innerHeight > 300){
				let scrollheight = window.innerHeight - 150;
				document.getElementById(this.chatidhandle).style.height = scrollheight + 'px';
			}
		},
		chateditchange(event){
			//console.log('event',event);
			//console.log(event.id);
			//console.log(event.message);
			let user = this.$root.$gun.user();
			user.get('chatroom').get(this.publickey_chat).get(event.id).put({message:event.message});
			event.bedit = false;
		},
		checkchatmessage(){
			let user =  this.$root.$gun.user();
			let self = this;
			//let dec = await Gun.SEA.secret(this.epublickey_chat, user.pair());
			//user.get('chatroom').get(this.publickey_chat).map().once((data)=>{
				//console.log("data");
				//console.log(data);
				//self.messages.push({id:data.id,text:data.message});
			//});
			user.get('chatroom').map().once((data,id)=>{
				//console.log("chat data");
				//console.log(data);
				//console.log(id);
				self.messages.push({id:data.id,text:data.message});
			});
		},
		async updateMessageList(){
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
  		window.removeEventListener('resize', this.handleResize);
	}
}
</script>

<style lang="scss">
.wrap{
	content: "HTML";
}
</style>
