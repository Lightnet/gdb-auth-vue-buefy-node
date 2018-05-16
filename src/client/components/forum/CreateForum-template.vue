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
			forumname:'',
		}
    },
    created(){
		
	},
	methods:{
		back(){
			bus.$emit('view','forum');	
		},
		createForum(){

		},
		
    },
}
</script>
<style lang="scss">

</style>