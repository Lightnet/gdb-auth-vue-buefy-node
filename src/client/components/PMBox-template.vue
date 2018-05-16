<template>
    <div>
		<div v-if="blogin">
			<PM
                @selectcontact="selectcontact"
			></PM>

            <PMList
                :messages="messages"
				@deletemessage="action_deletemessage"
            ></PMList>
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
// private messsage box

import PM from './msgbox/PM.vue';
import PMList from './msgbox/PMList.vue';

export default {
    components:{
        PM,
        PMList
    },
    data(){
        return{
            blogin:false,
            pubkey:'',
            messages:[],
        }
    },
    created(){
        //this.updateList();
        if(this.$root.user.is){
			this.blogin = true;
		}
    },
    methods:{
        selectcontact(event){
			console.log('event selected: ', event);
			this.pubkey = event;
			this.updateSelectAliasMessage();//update select contract to view
        },
        async updateSelectAliasMessage(){
			console.log("update messages?");
			this.messages = [];
			let user = this.$root.$gun.user();
			//console.log(this.pubkey);
			let pub = (this.pubkey || '').trim();
			if(!pub){ return }
			let to = this.$root.$gun.user(pub);
			let who = await to.then() || {};
			this.pubkeystatus = who.alias || "User not found.";
			//console.log(this.pmusercheck);
			if(!who.alias){ return }
			//console.log("who",who);
			let dec = await Gun.SEA.secret(who.epub, user.pair()); // Diffie-Hellman
			user.get('messages').get(pub).map().once((say,id)=>{
				//console.log("user chat",say);
				if((say == 'null') || (say == 'null'))
					return;
				this.UI(say,id,dec,pub);
			});
			//console.log("user.pair().pub: ",user.pair().pub);
			to.get('messages').get(user.pair().pub).map().once((say,id)=>{
				//console.log("to chat",say);
				if((say == 'null') || (say == 'null'))
					return;
				this.UI(say,id,dec,user.pair().pub);
			});
			//console.log('to',to)
			console.log('pub',pub);
			console.log('user.pair().pub',user.pair().pub);
		},
		async UI(say, id, dec, userpub){
			say = await Gun.SEA.decrypt(say,dec);
			//console.log(say);
			this.messages.push({id:id,from:say.from, subject:say.subject , message:say.content,owner:userpub});
		},
		action_deletemessage(event){
			console.log(event);
			this.$dialog.confirm({
				message: 'Delete message ' + event.subject + '?',
				onConfirm:(value)=>{
					//this.$toast.open({message:'Delete Topic! ' + event.subject ,type:'is-success'});
					this.message_delete(event);
				},
				onCancel:()=>{
					this.$toast.open({message:'Cancel Delete!',type:'is-warning'});
				}
			});
		},
		async message_delete(event){
			//console.log("topic_delete:",idToRemove);
			let user = this.$root.$gun.user();
			let gun = this.$root.$gun;

			console.log(user);
			console.log('event.owner: ',event.owner);
			if(event.owner == user.is.pub){
				console.log("self???");
				user.get('messages').get(event.owner).get(event.id).put('null',(ack)=>{
					console.log(ack);
					if(ack.err){
						this.$toast.open({message:'Delete fail! ' + event.subject ,type:'is-warning'});
						return;
					}
					this.$toast.open({message:'Delete Pass! ' + event.subject ,type:'is-success'});
					this.messages = this.messages.filter(message => {
						return message.id !== event.id
					});
				});
			}else{
				console.log("other???");
				let pub = (this.pubkey || '').trim();
				let to = this.$root.$gun.user(pub);
				console.log(to);
				to.get('messages').get(event.owner).get(event.id).put('null',(ack)=>{
					console.log(ack);
					if(ack.err){
						this.$toast.open({message:'Delete fail! ' + event.subject ,type:'is-warning'});
						return;
					}
					this.$toast.open({message:'Delete Pass! ' + event.subject ,type:'is-success'});
					this.messages = this.messages.filter(message => {
						return message.id !== event.id
					});
				});

			}

			
		}
    },
}
</script>

