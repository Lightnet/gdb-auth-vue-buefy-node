<template>
	<section>
		<b-field>
        	<label class="label">Create Forum</label>
		</b-field>

		<b-field label="Access">
		<div class="block">
			<b-radio v-model="forumaccess"
                native-value="public">
                Public
            </b-radio>
            <b-radio v-model="forumaccess"
                native-value="private">
                Private
            </b-radio>

		</div>
		</b-field>

		<b-field label="Name">
			<b-input v-model="forumname"></b-input>
		</b-field>

		<b-field label="Create">
			<div class="block">
				<button class="button is-primary" @click="createForum">Submit</button>
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
			forumaccess:'public',
			forumname:'Test',
		}
    },
    created(){
		
	},
	methods:{
		back(){
			bus.$emit('view','forum');	
		},
		createForum(){
			let gun = this.$root.$gun;
			let user = gun.user();
			
			let texthash = Gun.text.random(32);
			//console.log(texthash);
			user.get('forumlist').set({name:this.forumname,access:'public',key:texthash,own:user.is.alias,pub:user.is.pub},(ack)=>{
				console.log(ack);
				if(ack.err){
					console.log("err");
					return;
				}
				if(ack.ok){
					console.log("pass");
					self.$toast.open({
						message: 'Forum' + this.forumname +' Created!',
						type: 'is-success'
					});
				}
			});
			
			gun.get(texthash).put({
				name:this.forumname,
				access:'public',
				own:user.is.alias,
				pub:user.is.pub
			});



		},
    },
}
</script>
<style lang="scss">

</style>