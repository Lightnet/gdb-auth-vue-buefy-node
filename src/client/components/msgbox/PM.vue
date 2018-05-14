<template>
    <div>
		<section>
			<b-field label="Contacts">
				<b-select v-model="contact" v-on:input="$emit('selectcontact',contact)">
					<option disabled value="">Please select one</option>
					<option v-for="item in contacts" :key="item.id" :value="item.id">
						{{ item.alias }}
					</option>
				</b-select>
			</b-field>
			<b-field>
				<b-switch v-model="bwritemessage">Compose Message</b-switch>
			</b-field>
		</section>
		
		<section v-if="bwritemessage">
			<b-field>
				<label class="button is-text">Public Key:</label>
				<b-input v-model="pubkey" style="width:740px;"></b-input>
				<p class="control">
					<button class="button is-primary" @click="addcontact">Add</button>
				</p>
			</b-field>
			<b-field>
				<label class="label">Status: {{pubkeystatus}}</label>
			</b-field>
			<b-field label="Subject"  style="width:600px;">
				<b-input v-model="sendersubject"></b-input>
			</b-field>
			<b-field label="Content">
				<b-input type="textarea" v-model="sendercontent" style="width:600px;"> </b-input>
			</b-field>
			<b-field>
				<button class="button is-primary" @click="sentmessage"> Send </button>
			</b-field>
		</section>
		
	</div>
</template>
<script>
// private messsage to alias contact
export default {
    //components:{},
    data(){
        return{
            contact:'',
            contacts:[],
            contactpubstatus:'Normal',
            //messages:[],
            pubkey:'',
            sendersubject:'test subject',
			sendercontent:'test content',
			pubkeystatus:'Normal',
			messagescrollid:'messagescroll',
			bwritemessage:true,
        }
    },
    watch: {
		pubkey:function(newvalue,oldvalue){
			//console.log("new string?");
			this.pubkeystatus = 'typing...';
			this.getpubkey();
		},
		contact:function(newvalue,oldvalue){
			//console.log('change contact!',newvalue,oldvalue);
			//let self = this;
			this.pubkey = newvalue;
			//this.contacts.filter(contact => {
				//if(contact.alias == newvalue){
					//self.pubkey = contact.id;
				//}
				//return post.id !== idToRemove
			//});
		}
	},
    created(){
        this.updateList();
    },
    methods:{
		SelectItem(evemt){
			console.log('test?');
		},
        async updateList(){
            let user = this.$root.$gun.user();
            user.get('contacts').map().once((data,id)=>{
                if((data == null)||(data == 'null'))
					return;
                //console.log('contact',data);
                this.contacts.push({id:id,alias:data.alias});
            });
        },
        getpubkey:_.debounce(//typing key checks pub key string
			async function(){
				//console.log(this.pubkey.length);
				if(this.pubkey.length == 87){
					this.checkpubkey();
				}else{
					this.pubkeystatus = 'Not Alias public key and single key current!'
				}
			}
		,500)
		,
        async sentmessage(){
			//console.log(this.sendername);
			//console.log(this.sendersubject);
			//console.log(this.sendercontent);
			//console.log(this.$root.user);
			let gun = this.$root.$gun;
			let user = this.$root.user;
			var messagedata ={
				from:user.is.alias,
				subject:this.sendersubject,
				content:this.sendercontent,
			};
			let what = messagedata;
			if(!what){ return }
			var pub = (this.pubkey || '').trim();
			if(!pub) {
				//this.$message('Send failed!');
				this.$toast.open({
						message: 'Send failed!',
						type: 'is-warning'
					});
				return 
			}
			//console.log(SEA);
			//get user data
			var who = await gun.user(pub).then();
			//get user pub key
			var sec = await Gun.SEA.secret(who.epub, user.pair()); // Diffie-Hellman
			var enc = await Gun.SEA.encrypt(what, sec);
			user.get('messages').get(pub).set(enc);
			console.log("send message?");
		},
		async checkpubkey(){//needed
			//this.messages = [];
			this.pubkeystatus = 'checking pub key...'
			let user = this.$root.$gun.user();
			let pub = (this.pubkey || '').trim();
			if(!pub){ return }
			let to = this.$root.$gun.user(pub);
			let who = await to.then() || {};
			this.pubkeystatus = 'Alias: ' + who.alias || "User not found.";
			if(!who.alias){ return }
			//$emit('selectcontact',this.contact);
			//console.log("who",who);
		},
		async addcontact(){
			let user = this.$root.$gun.user();
			//console.log(this.pubkey);
			let pub = (this.pubkey || '').trim();
			if(!pub){ return }
			let to = this.$root.$gun.user(pub);
			let who = await to.then() || {};
			this.pubkeystatus = who.alias || "User not found.";
			//console.log(this.pmusercheck);
			if(!who.alias){ return }
			user.get('contacts').get(pub).put({alias:who.alias});

			this.$toast.open({
				message: 'Added contact!',
				type: 'is-success'
			});
		},
    },
}
</script>

