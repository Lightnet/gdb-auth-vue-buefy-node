<template>
    <div>
		<div v-if="blogin">
			<PM
                @selectcontact="selectcontact"
			></PM>

            <PMList
                :messages="messages"
            ></PMList>
		</div>
		<div v-else>
			<br>
			<center>
				<b-icon pack="fas" icon="user"></b-icon>
				Please Login.
				<span class="icon"><i class="fas exclamation-circle"></i></span>
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
			console.log('event selected: ',event);
			this.pubkey = event;
			this.updateSelectAliasMessage();
        },
        async updateSelectAliasMessage(){
			//console.log("message?");
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
				console.log("user chat");
				this.UI(say,id,dec);
			});
			//console.log("user.pair().pub: ",user.pair().pub);
			to.get('messages').get(user.pair().pub).map().once((say,id)=>{
				console.log("to chat");
				this.UI(say,id,dec);
			});
		},
		async UI(say, id, dec){
			say = await Gun.SEA.decrypt(say,dec);
			//console.log(say);
			this.messages.push({id:id,from:say.from, subject:say.subject , message:say.content});
		},
    },
}
</script>

