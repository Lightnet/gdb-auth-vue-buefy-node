<template>
	<section>
		<b-field>
        	<label class="label">Create Chat Room</label>
		</b-field>
		
		<b-field label="Access">
			<div class="block">
				<b-radio v-model="chataccess"
					native-value="public">
					Public
				</b-radio>
				<b-radio v-model="chataccess"
					native-value="private">
					Private
				</b-radio>
			</div>
		</b-field>
		
		<b-field label="Name">
			<b-input v-model="chatroomname"></b-input>
		</b-field>

		<b-field label="Create">
			<div class="block">
				<button class="button is-primary" @click="createRoom">Submit</button>
				<button class="button" @click="back">Cancel</button>
			</div>
		</b-field>

    </section>
</template>
<script>
import bus from '../../bus';

export default {
	props:[],
	data() {
		return{
			chatroomname:'Test',
			chataccess:'public',
		}
    },
    created(){
		
	},
	methods:{
		createRoom(){
			//this.chatroomname;
			let user = this.$root.$gun.user();
			let gun = this.$root.$gun;
			let texthash = Gun.text.random(32);
			console.log(texthash);
			user.get('chatlist').set({name:this.chatroomname,access:'public',key:texthash,own:user.is.alias,pub:user.is.pub},(ack)=>{
				console.log(ack);
				if(ack.err){
					console.log("err");
					return;
				}
				if(ack.ok){
					console.log("pass");
				}
			});
			
			gun.get(texthash).put({
				name:this.chatroomname,
				access:'public',
				own:user.is.alias,
				pub:user.is.pub
			});
		},
		back(){
			bus.$emit('view','chat');
		}
    },
}
</script>
<style lang="scss">

</style>