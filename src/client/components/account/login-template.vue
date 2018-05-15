<template>
	<div v-if="!blogin">
		<section v-if="!bforgetpassword">
			<b-field label="User">
				<b-input placeholder="alias" v-model="aliasname" style="width:300px;"></b-input>
			</b-field>
			<b-field label="Passphrase">
				<b-input placeholder="password" v-model="passphrase" style="width:300px;"></b-input>
			</b-field>
			<b-field grouped>
				<button class="button is-primary" size="mini" v-on:click="loginclick()">
					<b-icon pack="fas" icon="user"></b-icon>
					<span>Login</span>
				</button>
				<button class="button" v-on:click="siginupclick()">
					<b-icon pack="fas" icon="user"></b-icon>
					<span>Sign Up</span>
				</button>
				<a class="button is-text" href="#" v-on:click="bforgetpassword=true">Forgot Password?</a>
			</b-field>
		</section>

		<div v-if="bforgetpassword">
			<forgotpassword></forgotpassword>
		</div>

	</div>
</template>
<script>
import bus from '../../bus';

import forgotpassword from './forgotpassword-template.vue'

export default {
	props:['blogin'],
	data() {
		return{
			aliasname:'test',
			passphrase:'test',
			bforgetpassword:false,
		}
    },
	components:{
		'forgotpassword':forgotpassword,
	},
    async created(){
		if(Gun.SEA == null){
			Gun.SEA = SEA;
		}
	},
	methods:{
		loginclick:function(){
			//console.log(this);
			//console.log("this.username",this.username);
			//console.log("this.passphrase",this.passphrase);
			bus.$emit('userlogin',{username:this.aliasname,passphrase:this.passphrase});
			this._passphrase = '';
			//bus.$emit('userlogin',{username:'test',passphrase:'test'});
			//console.log("login...");
		},
		siginupclick:function(){
			bus.$emit('usersiginup',{username:this.aliasname,passphrase:this.passphrase});
			this.passphrase = '';
		},
    },
}
</script>
<style lang="scss">

</style>
