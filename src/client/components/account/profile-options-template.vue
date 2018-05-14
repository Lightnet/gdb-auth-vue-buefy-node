<template>
	<div>
		<b-switch v-model="bchangepassword" style="width:760px;">Change Password</b-switch>

		<section v-if="bchangepassword">
			<b-field label="Current Password">
				<b-input v-model="upassword" placeholder="Current Password" style="width:760px;"></b-input>
			</b-field>
			<b-field label="New Password">
				<b-input v-model="unpassword" placeholder="New Password"></b-input>
			</b-field>
			<b-field>
				<button class="button is-primary" v-on:click="changepassword"> Change Password </button>
			</b-field>
		</section>

		<br><b-switch v-model="bhintpassword">Hint Password</b-switch>

		<section v-if="bhintpassword">
			<b-field label="Q1">
				<b-input v-model="q1" placeholder="Question 1"></b-input>
			</b-field>
			<b-field label="Q2">
				<b-input v-model="q2" placeholder="Question 2"></b-input>
			</b-field>
			<b-field label="Hint">
				<b-input v-model="hint" placeholder="Hint" style="width:760px;"></b-input>
			</b-field>
			<b-field>
				<button class="button is-primary" v-on:click="hintpassword_apply"> Apply </button>
			</b-field>
		</section>

    </div>
</template>
<script>
import bus from '../../bus';

export default {
	//props:['var'],
	data() {
		return{
			upassword:'',
			unpassword:'',
			q1:'',
			q2:'',
			hint:'',
			bchangepassword:false,
			bhintpassword:false,
		}
    },
    async created(){
		if(Gun.SEA == null){
			Gun.SEA = SEA;
		}
		//console.log(this.username);
		if(this.$root.user.is){
			let gun = this.$root.$gun;
			let user = this.$root.$gun.user();
			let gunforgot = user.get('settings');
			//message crypt
			let q1 = await gunforgot.get('q1').then();
			//decode secret
			let dec = await Gun.SEA.secret(user.pair().epub, user.pair()); // Diffie-Hellman
			//decrypt message
			q1 = await Gun.SEA.decrypt(q1,dec);
			this.q1 = q1;
			//decrypt message
			let q2 = await gunforgot.get('q2').then();
			q2 = await Gun.SEA.decrypt(q2,dec);
			this.q2 = q2;
			//decrypt message
			//let hint = await gunforgot.get('hint').then();

			let hint = await gun.user().get('hint').then();
			var proof = await Gun.SEA.work(q1, q2);
			hint = await Gun.SEA.decrypt(hint, proof);
			//console.log(hint);
			this.hint = hint;
		}
	},
	methods:{
		changepassword(){
			if(this.$root.user){
				console.log(this.$root.user);
				//let gun = this.$root.$gun
				let user = this.$root.$gun.user();
				//gun.user().auth(alias, old, cb, {change: newPass})
				let self = this;
				user.auth(user.is.alias,this.upassword,function(ack){
					console.log(ack);
					if(ack.err){
						self.$message({message:'Auth Fail Passwordd!',type: 'warning',duration:800});
						return;
					}
					if(ack.ack){
						self.$message({message:'Update Password!',type: 'success',duration:800});
					}
				},{change:this.unpassword});
			}	
		},
		async hintpassword_apply(){
			//console.log(SEA);
			let gun = this.$root.$gun;
			let user = this.$root.$gun.user();
			console.log(user);
			//need to change this later.
			let gunforgot = user.get('settings');
			//console.log(Gun.SEA);
			//message secret
			var sec = await Gun.SEA.secret(user.pair().epub, user.pair()); // Diffie-Hellman
			console.log(sec);
			//message encrypt
			var enc_q1 = await Gun.SEA.encrypt(this.q1, sec);
			var enc_q2 = await Gun.SEA.encrypt(this.q2, sec);
			gunforgot.get('q1').put(enc_q1);
			gunforgot.get('q1l').put(this.q1.length);
			gunforgot.get('q2').put(enc_q2);
			gunforgot.get('q2l').put(this.q2.length);

			//
			var proof = await Gun.SEA.work(this.q1, this.q2);
			var enc_hint = await Gun.SEA.encrypt(this.hint, proof);
			//gunforgot.get('hint').put(enc_hint);
			gun.user().get('hint').put(enc_hint,(ack)=>{
				console.log(ack);
				if(ack.ok){
					this.$message({message:'Update Hint Password!',type: 'success',duration:800});
				}
			});
			
			//let salt = Gun.text.random(64);
			//console.log(salt);
			//let proof = await SEA.work('pass', salt);
			//https://github.com/amark/gun/blob/master/sea.js
			// line 1090
		},
		async forgot(username, A1, A2){
			let gun = this.$root.$gun;
			// A1 and A2 are answers to security questions they made earlier.
			var scrambled = await gun.user().get('hint').then();
			var proof = await Gun.SEA.work(A1, A2);
			var hint = await Gun.SEA.decrypt(scrambled, proof);

			return hint; // your password hint!
		},
    },
}
</script>
<style lang="scss">

</style>
