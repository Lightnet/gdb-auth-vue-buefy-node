<template>
	<div id="chatscroll" style="overflow-y: scroll;">
		<div class="card" v-for="message in messages" :key="message.id">
			<div class="card-content">
				<label class="wrap" >Alias: {{ message.from }} > </label>
				<label class="wrap" v-if="!message.bedit">
					{{ message.message }}
				</label>

				<button class="button" style="float: right;" circle v-on:click="$emit('deletechatmessage',message)">
					<b-icon
						pack="fas"
						icon="trash"
						>
					</b-icon>
				</button>

				<button class="button" style="float: right;" circle v-on:click="$emit('editchatmessage',message)">
					<b-icon
						pack="fas"
						icon="edit"
						>
					</b-icon>
				</button>
				
				<b-input v-if="message.bedit" v-model="message.message" v-on:keydown.enter.native="$emit('editchangemessagechange',message)">
				</b-input>
			</div>
		</div>
	</div>
</template>

<script>
//event on and emit global
import bus from '../../bus';

export default {
	props:['messages'],
	data() {
		return{
			scrollhandleid:'chatscroll'
		}
	},
	created(){
		bus.$on('action',this.action);
	},
	mounted(){
		window.addEventListener('resize', this.handleResize);
		this.handleResize();
	},
	methods:{
		handleResize(event){
			if(!document.getElementById(this.scrollhandleid))
				return;
			if(window.innerHeight > 300){
				let scrollheight = window.innerHeight - 150;
				document.getElementById(this.scrollhandleid).style.height = scrollheight + 'px';
			}
		},
		/*
		chateditchange(event){
			//console.log('event',event);
			//console.log(event.id);
			//console.log(event.message);
			let user = this.$root.$gun.user();
			user.get('chatroom').get(this.publickey_chat).get(event.id).put({message:event.message});
			event.bedit = false;
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
		*/
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
