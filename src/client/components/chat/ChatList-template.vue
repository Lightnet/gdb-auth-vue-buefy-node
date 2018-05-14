<template>
	<div class="field is-grouped is-grouped-left">
		<p class="control">
			<b-select placeholder="Select a Chat">
				<option>Test1</option>
				<option>Test2</option>
			</b-select>
		</p>
		<p class="control">
			<label class="button is-text"> Unknown chat </label>
		</p>
		<p class="control">
			<button class="button">Remove</button>
		</p>
		<p class="control">
			<b-input style="width:200px;"> </b-input>
		</p>
		<p class="control">
			<button class="button is-primary">Add</button>
		</p>

		<p class="control is-expanded">
			<label class="button is-text">Status:</label>
		</p>

		<p class="control">
			<button class="button" href="#">Create Room</button>
			<button class="button" href="#">Options</button>
		</p>
	</div>
</template>

<script>
//event on and emit global
//import bus from '../../bus';

export default {
	//props:['blogin'],
	data() {
		return{
			//bchatlistselect:false,
		}
	},
	components: {
		//TodoList
	},
	watch:{
		//blogin(n, o) {
      		//console.log(n, o) // n is the new value, o is the old value.
    	//}
	},
	beforeCreate() {
	},
	created(){
		//bus.$on('action',this.action);
		//check if user exist to load page
		if(this.$root.user.is){
			this.updateChatList();
			//this.blogin = true;
			//this.updateMessageList();
		}
	},
	mounted(){},
	computed: {},
	methods:{
		updateChatList(){
			let user = this.$root.$gun.user();
			user.get('contacts').map().once((data,id)=>{
				console.log(data);
				console.log("list?");
			});
		},
		genChatKey(){
			console.log(Gun.SEA.pair());
		},
		chatlist_edit(event){
			//console.log("edit",event);
			//event.bedit = event.bedit != true;
			//console.log(event.bedit);
		},
		chatlist_delete(event){
			//console.log("delete",event);
			//let user = this.$root.$gun.user();
			//user.get('chatroom').get(this.publickey_chat).get(event.id).put('null');
			//user.get('chatroom').get(event.id).put('null');
			//this.messages = this.messages.filter(todo => {
				//return todo.id !== event.id;
			//});
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
