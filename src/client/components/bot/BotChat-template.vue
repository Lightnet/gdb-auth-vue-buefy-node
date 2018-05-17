<template>
	<div>
        <label class="label">Bot Status: {{botstatus}}</label>

		<BotChatMessage
			:messages="messages"
		></BotChatMessage>
		<BotChatInput
			v-model="chatmessage"
			placeholder="Type something here..."
			@enterchat="enterchat"
			@keydown.enter.native="sentmessage"
		></BotChatInput>
    </div>
</template>
<script>
import bus from '../../bus';

import BotChatInput from './BotChatInput-template.vue';
import BotChatMessage from './BotChatMessage-template.vue';

export default {
	props:[],
	data() {
		return{
			botstatus:'offline',
			messages:[],
			chatmessage:'test message',
		}
	},
	components:{
		BotChatMessage,
		BotChatInput,
	},
    created(){
		this.updateChatMessages();
	},
	methods:{
		enterchat(event){
			this.chatmessage = event;
			//console.log('test');
			this.sentmessage();
		},
		updateChatMessages(){
			let gun = this.$root.$gun;
			let user = gun.user();
			let self = this;

			gun.get('chatmessage').map().once((data,id)=>{
				//console.log("chat data");
				//console.log("data",data);
				//console.log('id',id);
				if((data == null)||(data == 'null'))
					return;
				if(!data.message)
					return;
				self.messages.push({id:id,from:data.alias,message:data.message,bedit:false});
			});
		},
		async sentmessage(){

			let gun = this.$root.$gun;
			let user = gun.user();

			var messagedata ={
				//'_':{'#':public_pair().pub},
				pub:user.is.pub,
				alias:user.is.alias,
				message:this.chatmessage,
				bedit:'false'
			};
			
			//if(this.chatdata.access == 'public'){
				let enc = messagedata;
				gun.get('chatmessage').set(enc,ack=>{
					console.log(ack);
				});
			//}
			//console.log(this.chatmessage);

			//this.chatmessage = '';
		},
    },
}
</script>
<style lang="scss">

</style>