<template>
    <div>
		<div v-if="blogin">
			<PM v-if="!bviewmessage"
                @selectcontact="selectcontact"
			></PM>

            <PMList
				v-if="!bviewmessage"
				:aliasid="aliasid"
                :messages="messages"
				@deletemessage="action_deletemessage"
				@viewmessage="viewmessage"
            ></PMList>

			<PMView 
				v-if="bviewmessage"
				:messagedata="messagedata"
				@messagelist="bviewmessage=false"
			>
			</PMView>
			
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
import PMView from './msgbox/PMView.vue';

export default {
    components:{
        PM,
		PMList,
		PMView
    },
    data(){
        return{
            blogin:false,
            pubkey:'',
			messages:[],
			aliasid:'',
			bviewmessage:false,
			messagedata:[],
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
			this.aliasid = user.is.pub;
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

			let pub = (this.pubkey || '').trim();
			let to = this.$root.$gun.user(pub);
			let who = await to.then() || {};
			//let dec = await Gun.SEA.secret(who.epub, user.pair()); // Diffie-Hellman
			//user.get('messages').get(pub).get(event.id).put(null);
			//console.log('OWNER: ' , event.owner);
			//console.log('PUB: ' , pub);
			//console.log('USER PUB: ' , user.pair().pub);
			if(event.owner == pub){
				//console.log("from user to alias");
				//user.get('messages').get(pub).get(event.id).once((data,id)=>{
					//console.log('user to pub',id);
					//gun.get(id).put(null);
					//console.log(data);
				//});
				user.get('messages').get(pub).get(event.id).put('null',(ack)=>{
					console.log(ack);
					if(ack.ok){
						this.$toast.open({message:'Delete Message! ' + event.text ,type:'is-success'});
						this.messages = this.messages.filter(message => {
							return message.id !== event.id
						});
					}
				});
			}
			//can't delete message
			if(event.owner == user.pair().pub){
				//console.log("from alias to user");
				
				to.get('messages').get(user.pair().pub).map().once(data=>{
					console.log('data',data);
				});

				//to.get('messages').get(user.pair().pub).get(event.id).put('null');
			}
		},
		viewmessage(event){
			this.messagedata = event;
			console.log('view message');
			this.bviewmessage = true;
		},

    },
}
</script>

