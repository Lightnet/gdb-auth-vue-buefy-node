<template id="Account">
	<div>
		<div v-if="blogin">
			<DatabaseOptions></DatabaseOptions>
			<!--
			<button class="button" v-on:click="cleardata">Clear Local Database</button>
			<button class="button" v-on:click="Connect">Connect</button>
			<button class="button" v-on:click="Disconnect">Disconnect</button>
			-->
		</div>

		<div v-if="!blogin">
			<button class="button is-primary"  style="float: right;" v-on:click="click_logout()">Logout</button>
			<button class="button" v-on:click="setview('profile')">Profile</button>
			<button class="button" v-on:click="setview('contacts')">Contacts</button>
			<button class="button" v-on:click="setview('options')">Settings</button>
			<button class="button" v-on:click="Disconnect">Disconnect</button>
		</div>

		<div class="container">
			<component :is="currentView"></component>
		</div>

	</div>
</template>

<script>
//event on and emit global
import bus from '../bus';
import logintemplate from './account/login-template.vue';
import profiletemplate from './account/profile-template.vue';
import contactstemplate from './account/contacts-template.vue';
import profileoptionstemplate from './account/profile-options-template.vue';

import DatabaseOptions from './helpers/DataBaseOptions-template.vue';

export default {
	//props:['blogin','username'],
	data() {
		return{
			currentView: 'login',
			//iusername:'test',
			//ipassphrase:'test',
			username:'',
			userpublickey:'',
			//pubname:'',
			//pubborn:'',
			//pubeducation:'',
			//pubskills:'',
			//pubname:'',
			//pborn:'',
			//peducation:'',
			//pskills:'',
			blogin:true,
			contacts:[],
		}
	},
	watch:{
		pubname(n, o) {
			//console.log(n, o) // n is the new value, o is the old value.
			this.setprofilevar('pubname', n);
    	}
	},
	created(){
		//console.log(this.$root.blogin);
		bus.$on('action',this.action);
		if(this.$root.blogin){
			this.blogin = false;
			this.updateprofile();
			this.currentView = 'profile';
		}else{
			this.blogin = true;
		}
		//console.log("user",this.$root.user);
	},
	methods:{
		Connect(){
			let gun = this.$root.$gun;
			gun.get('data').once(function(){});
		},
		Disconnect(){
			let peers = this.$root.$gun.back('opt.peers');
			let url;
			if(location.origin == 'http://localhost:3000'){
				url ='http://localhost:8080' + '/gun';
			}else{
				url = location.origin + '/gun';
			}
			
			//console.log(peers);
			peers[url].wire.close();
			peers[url].url = null;
			clearTimeout(peers[url].defer);
		},
		cleardata(){
			localStorage.clear(); //clear database for gun
			//this.$message({message:'Clear Database!',type: 'success',duration:800});
			this.$toast.open({
				message: 'Clear Database!',
				type: 'is-success'
			})
		},
		setview(value){
			this.currentView = value;
		},
		setprofilevar(name,value){
			if(!this.$root.user.is){ return }
			let user = this.$root.user;
			//user.get('profile').get(name).secret(value);
		},
		async grantaccess(event){
			if(!this.$root.user.is){ return }
			let id;
			//console.log(event);
			var pub = prompt("What is the Public Key or DID you want to give read access to?");
			//console.log(pub);
			var to = this.$root.$gun.user(pub);
			var who = await to.get('alias').then();
			if(!confirm("You want to give access to " + who + "?")){ return }
			user.get('profile').get(event).grant(to);
		},
		updateprofile:function(){
			if(this.$root.user.is){
				this.username = this.$root.user.is.alias;
				this.userpublickey = this.$root.user.is.pub;
				//console.log(this.username );
				//this.updatecontacts();
			}
		},
		updateMessage(message) {
      		// By emitting the 'update' event in every intermediary component we can pass data
      		// from GrandchildComponent to ChildComponent and from there to the parent
      		this.$emit('update', message);
    	},
		updatecontacts(){
			let user = this.$root.user;
			let self = this;

			//console.log('contacts');
			user.get('contacts').map().once((data,id)=>{
				if(data == 'null')
					return;
				//console.log(data);
				//console.log(id);
				self.contacts.push({id:id,alias:data.alias});
			});
		},
		deletecontact(event){
			//console.log('event');
			//console.log(event);
			let user = this.$root.user;

			this.contacts.filter(contact => {
				if(contact.id == event.id){
					//self.pubkey = contact.id;
					user.get('contacts').get(contact.id).put('null');
				}
				//return post.id !== idToRemove
			});
		},
		getProfile:function(){
			let user = this.$root.user;
			//console.log(user);
			let gun = this.$root.$gun;
		},
		click_logout:function(){
			bus.$emit('userlogout');
		},
		action:function(params){
			if(params == "hidelogin"){
				this.blogin = false;
				this.$root.blogin = true;
				this.updateprofile();
				this.currentView = 'profile';
				//console.log('login >> account');
			}
			if(params == "logout"){
				//this.blogin = true;
				this.$root.blogin = false;
			}
		}
	},
	components: {
		'login':logintemplate,
		'profile':profiletemplate,
		'contacts':contactstemplate,
		'options':profileoptionstemplate,
		DatabaseOptions,
	}
}
</script>

<style lang="scss">
.section{
	width:512px;
}
</style>
