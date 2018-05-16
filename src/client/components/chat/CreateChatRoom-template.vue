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

			<b-radio v-model="chataccess"
                native-value="password">
                Password
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
			chatroomname:'',
			chataccess:'public',
		}
    },
    created(){
		
	},
	methods:{
		createRoom(){

		},
		back(){
			bus.$emit('view','chat');
		}
    },
}
</script>
<style lang="scss">

</style>