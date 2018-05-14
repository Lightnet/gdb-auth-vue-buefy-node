<template>
	<div>
		<section>
			<b-field>
				Forget Password
			</b-field>
			<b-field label="Alias">
				<b-input placeholder="alias" v-model="aliasname" style="width:300px"></b-input>
			</b-field>
			<b-field label="Q1:">
				<b-input placeholder="Question1" v-model="question1" style="width:600px"></b-input> 
			</b-field>
			<b-field>
				<label>{{question1.length}} / {{question1l}} </label>
			</b-field>
			<b-field label="Q2:">
				<b-input placeholder="Question2" v-model="question2" style="width:600px"></b-input> 
			</b-field>
			<b-field>
				<label> {{question2.length}} / {{question2l}} </label>
			</b-field>
			<b-field label="Answer:">
				<b-input placeholder="Hint" v-model="hint" style="width:600px"></b-input>
			</b-field>
			<b-field>
				<button class="button is-primary" v-on:click="forgotpassword_aliascheck">Get Hint</button>
				<button class="button" v-on:click="$parent.bforgetpassword=false">Back</button>
			</b-field>
		</section>
	</div>
</template>
<script>
import bus from '../../bus';

export default {
	props:['blogin'],
	data() {
		return{
			aliasname:'',
			question1:'',
			question1l:0,
			question2:'',
			question2l:0,
			hint:'',
		}
	},
	watch: {
		aliasname(newvalue,oldvalue){
			console.log("new string?");
			this.aliascheck();
		},
		question1(newvalue,oldvalue){
			//console.log("new string?");
		},
		question1(newvalue,oldvalue){
			//console.log("new string?");
			//this.pubkeystatus = 'typing...';
			//this.getpubkey();
		},
	},
    async created(){
		if(Gun.SEA == null){
			Gun.SEA = SEA;
		}
	},
	methods:{
		aliascheck:_.debounce(//typing key checks pub key string
			async function(){
				let user = this.$root.$gun.user();
				let gun = this.$root.$gun;
				let alias = await gun.get('alias/'+this.aliasname).then();
				//console.log(alias);
				if(!alias){
					//console.log('not found!');
					return;
				}
				if(alias){
					//console.log("Found Alias");
					this.question1l = await gun.get('alias/'+this.aliasname).map().get('settings').get('q1l').then();
					this.question2l = await gun.get('alias/'+this.aliasname).map().get('settings').get('q2l').then();
					//hint = await gun.get('alias/'+this.aliasname).map().get('hint').then();
				}
			}
		,500)
		,
		async forgotpassword_aliascheck(){
			//console.log('hint');
			let user = this.$root.$gun.user();
			let gun = this.$root.$gun;
			//console.log('user',user);
			//console.log(user);
			let hint;
			let alias = await gun.get('alias/'+this.aliasname).then();
			console.log(alias);
			if(alias){
				//console.log("checking...");
				hint = await gun.get('alias/'+this.aliasname).map().get('hint').then();
				//console.log(hint);
				this.checkhint(hint);
			}else{
				this.$message({message:'No Alias Found!',type: 'warning',duration:800});
			}
		},
		async checkhint(hint){
			let proof = await Gun.SEA.work(this.question1, this.question2);
			hint = await Gun.SEA.decrypt(hint, proof);
			console.log(hint);
			if(hint){
				this.hint = hint;
				this.$message({message:'Hint Found!',type: 'success',duration:800});
			}else{
				this.$message({message:'Fail Hint!',type: 'warning',duration:800});
			}
		}
    },
}
</script>
<style lang="scss">

</style>
