<template>
	<div class="field is-grouped is-grouped-left">
		<p class="control">
			<b-field>
			<b-select placeholder="Select a Chat" v-model="chatroomdata" v-on:input="$emit('chatroomselect',chatroomdata)">
				<option disabled value=""> Select a Chat </option>
				<option
					v-for="chatroom in chatrooms" 
					:key="chatroom.id" 
					:value="chatroom"
					>
					{{chatroom.name}}
					</option>
			</b-select>
			</b-field>
		</p>
		<p class="control">
			<button class="button">Remove</button>
		</p>
		<p class="control">
			<b-input style="width:200px;" v-model="chatroomid"> </b-input>
		</p>
		<p class="control">
			<button class="button is-primary" @click="chatlist_add">Add</button>
		</p>

		<p class="control is-expanded">
			<label class="button is-text">Status: {{chatstatus}}</label>
		</p>

		<p class="control">
			<button class="button" href="#" v-on:click="actionCreateChat">Create Room</button>
			<button class="button" href="#">Options</button>
		</p>
	</div>
</template>

<script>
//event on and emit global
import bus from '../../bus';

export default {
	props:['chatrooms','chatdata'],
	data() {
		return{
			chatroomdata:[],
			chatroomid:'',
			chatroomname:'',
			chatstatus:'None',
		}
	},
	components: {
		//TodoList
	},
	watch:{
		chatroomdata(val) {
			//console.log(n, o) // n is the new value, o is the old value.
			this.chatroomid = this.chatroomdata.key;
			this.chatroomname= this.chatroomdata.name;
		},
		chatroomid(newvalue){
			//console.log("new string?");
			this.chatstatus = 'typing...';
			this.checkingChatID();
		},
	},
	beforeCreate() {
	},
	created(){
		//bus.$on('action',this.action);
		//check if user exist to load page
		if(this.$root.user.is){
			//this.blogin = true;
			//this.updateMessageList();
		}
	},
	mounted(){},
	computed: {},
	methods:{
		checkingChatID:_.debounce(//typing key checks pub key string
			async function(){
				//console.log(this.pubkey.length);
				if(this.chatroomid.length == 32){
					this.CheckChatID();
				}else{
					this.chatstatus = 'Not public key!'
				}
			}

		,500)
		,
		CheckChatID(){
			let gun = this.$root.$gun;
			let self = this;
			gun.get(this.chatroomid).once(data=>{
				//console.log('test',data);
				if(data !=null){
					self.chatstatus = "Found";
				}else{
					self.chatstatus = "Null";
				}
			});
		},
		actionCreateChat(){
			bus.$emit('view','createchatroom');
		},
		async chatlist_add(event){
			let gun = this.$root.$gun;
			let user = gun.user();
			//console.log('add list....');
			//gun.get(this.chatroomid).once(data=>{
				//console.log(data);
			//});
			let bfound = false;

			//if(!this.chatroomdata)
				//return;

			//console.log(this.chatroomid);
			for (let room in this.chatrooms){
				//console.log(this.chatrooms[room]);
				if(this.chatrooms[room].key == this.chatroomid){
					//console.log(this.chatrooms[room].key);
					bfound = true;
					break;
				}
			}
			if(bfound){
				//console.log("found in list");
				return;
			}
			let pub = await gun.get(this.chatroomid).get('pub').then();
			let access = await gun.get(this.chatroomid).get('access').then();
			let own = await gun.get(this.chatroomid).get('own').then();
			let chatname = await gun.get(this.chatroomid).get('name').then();
			//console.log(access);
			//console.log(own);
			//console.log(chatname);
			//console.log(this.chatroomid);
			//console.log(texthash);
			user.get('chatlist').set({
				name:chatname,
				access:access,
				key:this.chatroomid,
				own:own,
				pub:pub
			},(ack)=>{
				//console.log(ack);
				if(ack.err){
					//console.log("err");
					return;
				}
				if(ack.ok){
					//console.log("pass");
				}
			});
		},
		chatlist_delete(event){
		},
	},
	beforeDestroy: function () {
		//console.log('beforeDestroy');
	}
}
</script>

<style lang="scss">
.wrap{
	content: "HTML";
}
</style>
