<template>
	<div>
		<div class="field is-grouped is-grouped-left">
			<p class="control">
				<b-select placeholder="Select a Forum" v-model="forumdata" v-on:input="$emit('forumselect',forumdata)">
					<option  
					v-for="forum in forums" 
					:key="forum.id" 
					:value="forum"
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
				<button class="button">Remove</button>
			</p>
			<p class="control">
				<b-input style="width:200px;" v-model="forumid"> </b-input>
			</p>

			<p class="control is-expanded">
				<button class="button" @click="forumlist_add">Add</button>
				<label class="button is-text"> Status: {{forumstatus}} </label> 
			</p>
			
			<p class="control">
				<button class="button" href="#" v-on:click="actionCreateForum">Create Forum</button>
				<button class="button" href="#">Options</button>
			</p>
		</div>
	</div>
</template>

<script>
import bus from '../../bus';

export default {
    //name: 'app',
	props:['forums'],
    data() {
		return {
			bforumlistselect:true,
			//forums:[],
			forumid:null,
			forumdata:null,
			forumstatus:'None',
		}
	},
	watch:{
		forumdata(val) {
			//console.log(n, o) // n is the new value, o is the old value.
			this.forumid = this.forumdata.key;
			//this.chatroomname= this.forumdata.name;
		},
		forumid(newvalue){
			//console.log("new string?");
			this.forumstatus = 'typing...';
			this.TypingcheckForumID();
		},
	},
	created(){
		let gun = this.$root.user;
		//let gun = this.$root.$gun;
		this.updateForumList();
	},
	methods:{
		TypingcheckForumID:_.debounce(//typing key checks pub key string
			async function(){
				//console.log(this.pubkey.length);
				if(this.forumid.length == 32){
					this.CheckForumID();
				}else{
					this.forumstatus = 'Not public key!'
				}
			}

		,500)
		,
		CheckForumID(){
			let gun = this.$root.$gun;
			let self = this;
			gun.get(this.forumid).once(data=>{
				console.log('test',data);
				if(data !=null){
					self.forumstatus = "Found";
				}else{
					self.forumstatus = "Null";
				}
			});
		},
		actionCreateForum(){
			bus.$emit('view','createforum');
		},
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
		async forumlist_add(event){
			let gun = this.$root.$gun;
			let user = gun.user();
			//console.log('add list....');
			//gun.get(this.chatroomid).once(data=>{
				//console.log(data);
			//});
			let bfound = false;

			//if(!this.forumdata)
				//return;

			//console.log(this.chatroomid);
			for (let room in this.forums){
				//console.log(this.chatrooms[room]);
				if(this.forums[room].key == this.forumid){
					//console.log(this.chatrooms[room].key);
					bfound = true;
					break;
				}
			}

			if(bfound){
				console.log("found in list");
				return;
			}

			console.log(this.forumid);

			let pub = await gun.get(this.forumid).get('pub').then();
			let access = await gun.get(this.forumid).get('access').then();
			let own = await gun.get(this.forumid).get('own').then();
			let chatname = await gun.get(this.forumid).get('name').then();
			//console.log(access);
			//console.log(own);
			//console.log(chatname);
			//console.log(this.chatroomid);
			//console.log(texthash);
			user.get('forumlist').set({
				name:chatname,
				access:access,
				key:this.forumid,
				own:own,
				pub:pub
			},(ack)=>{
				//console.log(ack);
				if(ack.err){
					//console.log("err");
					this.$toast.open({
						message: 'Fail Added Forum List!',
						type: 'is-warning'
					});
					return;
				}
				if(ack.ok){
					//console.log("pass");
					this.$toast.open({
						message: 'Pass Added Forum List!',
						type: 'is-success'
					});

				}
			});
			
		},
	},
	beforeDestroy() {
        // Perform the teardown procedure for someLeakyProperty.
		this.gun_posts = null;
    },
}
</script>