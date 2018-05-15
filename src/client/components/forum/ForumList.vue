<template>
	<div>
		<div class="field is-grouped is-grouped-left">
			<p class="control">
				<b-select placeholder="Select a Forum" v-model="forumid" v-on:input="$emit('forumidselect',forumid)">
					<option  
					v-for="forum in forums" 
					:key="forum.id" 
					:value="forum.id"
					>
					{{forum.name}}
					</option>
					<!--
					<option>Test1</option>
					<option>Test2</option>
					-->
				</b-select>
			</p>
			<p class="control">
				<label class="button is-text"> Unknown forum </label> 
				<button class="button">Remove</button>
			</p>
			<p class="control">
				<b-input style="width:200px;"> </b-input>
			</p>

			<p class="control is-expanded">
				<button  class="button">Add</button>
			</p>
			
			<p class="control">
				<button class="button" href="#">Create Forum</button>
				<button class="button" href="#">Options</button>
			</p>
		</div>
	</div>
</template>

<script>
export default {
    //name: 'app',
	props:['forums'],
    data() {
		return {
			bforumlistselect:false,
			//forums:[],
			forumid:null,
		}
	},
	created(){
		let gun = this.$root.user;
		//let gun = this.$root.$gun;
		this.updateForumList();
	},
	methods:{
		formatDate(date) {
			let hours = date.getHours();
			let minutes = date.getMinutes();
			let ampm = hours >= 12 ? 'pm' : 'am';
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0'+minutes : minutes;
			let strTime = hours + ':' + minutes + ' ' + ampm;
			return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + strTime;
		},
		updateForumList(){
			let user = this.$root.$gun.user();
			let self = this;
			//console.log('forums');
			//user.get('forums').map().once((data,id)=>{
				//if(data == 'null')
					//return;
				//console.log(data);
				//console.log(id);
				//self.forums.push({id:id,alias:data.alias});
			//});
		},
	},
	beforeDestroy() {
        // Perform the teardown procedure for someLeakyProperty.
		this.gun_posts = null;
    },
}
</script>