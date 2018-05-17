<template id="create-template">
  	<div v-if="$root.blogin">
		Debug: <b-switch v-model="bdebugpost"></b-switch>
		<div v-if="bdebugpost">
		<label>Parent:{{pubname}}</label>
		<br><label>public key:{{pubkey}}</label>
		<br><label>Status Post:{{poststatus}}</label>
		</div>
		<br><label>Create Post</label>
		<section ref="form" action="javascript:void(0);" v-if="bpost" label-width="120px" style="width:500px;">
			<b-field label="Title">
				<div class="col-sm-10">
					<b-input placeholder="Post title Topic:" v-model="topictitle"></b-input>
				</div>
			</b-field>
			<b-field  label="Body:">
				<div class="col-sm-10">
					<b-input type="textarea" rows="5" v-model="topiccontent"></b-input>
				</div>
			</b-field>
			<b-field>
				<button class="button is-primary" @click="topicpost">Create</button>
			</b-field>
		</section>
  	</div>
	<div v-else>
		<br>
		<center>
			<button type="warning" icon="el-icon-warning" circle></button>
			Please Login.
		</center>
	</div>
</template>

<script>
export default {
    name: 'app',
    data() {
		return {
			pubname:'default',
			pubkey:'none',
			poststatus:'normal',
			bpost:true,
			topictitle:'',
			topiccontent:'',
			bdebugpost:false,
		}
	},
	created(){
		let gun = this.$root.user;
		//let gun = this.$root.$gun;
		//this.gun_posts = gun.get('posts');

		this.pubkey = this.$root.publickeypost;
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
		topicpost(){
			//console.log(this.topictitle);
			//console.log(this.topiccontent);
			//console.log("post!");
			let timestamp = new Date();
			timestamp = this.formatDate(timestamp)
			//console.log(timestamp);
			//console.log(this.$root);
			//console.log(this.$root.user);
			let user = this.$root.user.is;
			let self = this;
			if(user){
				var post = {
					//pub:user.pub,
					alias:user.alias,
					//soul:this.$root.user['_'].soul,
					posttitle:this.topictitle,
					postcontent:this.topiccontent,
					postdate: timestamp,
					parent:'default',
				}
				//this.gun_posts.get("pulbic/"+user.pub).set(post);

				let gun = this.$root.$gun;
				let forumdata = this.$root.forumdata;
				//console.log(forumdata);
				if(forumdata.access == 'public'){
					if(this.pubkey){
						//post from topic list
						gun.get(this.pubkey).set(post,(ack)=>{
							//console.log(ack);
							if(ack.err){
								self.poststatus = 'Error Post!';
								//self.$message.error({message:'Error Post!',duration:800});
								self.$toast.open({
									message: 'Error Post!',
									type: 'is-warning'
								});
							}
							if(ack.ok){
								self.poststatus = 'Posted!';
								self.bpost = false;
								//self.$message({message:'Posted!',type: 'success',duration:800});
								self.$toast.open({
									message: 'Posted!',
									type: 'is-success'
								});
							}
							//clear public key
							self.pubkey = '';
							self.$root.publickeypost = '';
						});


					}else{
						//default
						//post from topic level
						gun.get(forumdata.key).get('topic').set(post,ack=>{
							if(ack.err){
								console.log('error!');
								return;
							}
							console.log(ack);
							if(ack.ok){
								self.$toast.open({
									message: 'Posted!',
									type: 'is-success'
								});
							}
						});
					}

					self.pubkey = '';
					self.$root.publickeypost = '';
				}

			}

			//this.bpost = false;
		}
	},
	beforeDestroy() {
        // Perform the teardown procedure for someLeakyProperty.
		this.gun_posts = null;
    },
}
</script>