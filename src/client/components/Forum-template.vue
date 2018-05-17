<template>
  	<div v-if="blogin">

		<b-field>
			<p class="control is-expanded">
				<label class="label">Forum: {{forumname}}</label>
			</p>
		</b-field>
		<b-field>
			<p class="control is-expanded">
				<button class="button is-primary" @click="newTopicPost">New Topic</button>
			</p>
			<p class="control">
				<b-switch v-model="bforumlistselect">Forum List</b-switch>
			</p>
		</b-field>

		<div v-if="bforumlistselect">
			<ForumList
				:forums="forumlist"
				@forumselect="selectForumID"
			></ForumList>
		</div>

    	<div v-if="bcategory">
			<topiccategory
				:forumdata="forumdata"
				:posts="posts"
				@topicedit="topic_edit" 
				@topicdelete="action_deletetopic"
				@topicchange="topic_editchange"
				@topicview="viewpost"
			></topiccategory>
    	</div>

		<div v-if="!bcategory">
			<topics 
				:topics="topics" 
				:publickeypost="publickeypost" 
				:topicpubkey="topicpubkey"
			></topics>
		</div>
		
  	</div>
	<div v-else>
		<br>
		<center>
            <b-icon pack="fas" icon="user"></b-icon>
            Please Login.
            <b-icon
                pack="fas"
                icon="exclamation-triangle">
            </b-icon>
        </center>
	</div>
</template>

<script>
import topics from './forum/Topics-template.vue';
import topiccategory from './forum/TopicCategory-template.vue';
import forumListTemplate from './forum/ForumList-template.vue';

export default {
    //name: 'app',
    data() {
		return {
			bcategory: true,
			publickeypost:'',
			topicpubkey:'',
			bpost:false,
			posts: [],
			topics:[],
			forumlist:[],
			blogin:false,
			forumname:'Null',
			forumdata:null,
			bforumlistselect:false,
		}
	},
	components: {
		'topics':topics,
		'topiccategory':topiccategory,
		'ForumList':forumListTemplate,
	},
	async created(){
		//let gun = this.$root.$gun;
		let gun = this.$root.user;
		this.gun_posts = gun.get('posts');
		if(gun.is){
			this.blogin = true;
			//this.updateforum();
			this.updateforumlist();
		}
		//console.log(gun.is);
	},
	methods:{
		updateforumlist(){
			this.forumlist = [];
			let gun = this.$root.$gun;
			let user = gun.user();
			user.get('forumlist').map().once((data,id)=>{
				//console.log(data);
				//console.log(id);
				this.forumlist.push({
					id:id,
					name:data.name,
					own:data.own,
					pub:data.pub,
					key:data.key,
					access:data.access
				});
			});
		},
		selectForumID(event){
			//console.log(event);
			this.forumdata = event;
			this.forumname = event.name;
			this.updateforum();
		},
		newTopicPost(){
			this.$root.publickeypost = this.publickeypost;
			//this.bpost = true;
			//console.log(this.forumdata);

			if(!this.forumdata){
				//console.log('forum null');
				return;
			}
			this.$root.forumdata = this.forumdata;
			this.$parent.currentView = 'create-post';
		},
		updateforum(){
			let self = this;
			//console.log("test posts?");
			let gun = this.$root.$gun;
			let user = gun.user();
			this.posts = [];

			if(this.forumdata.access == 'public'){
				gun.get(this.forumdata.key).get('topic').map().once((data,id)=>{
					//console.log('topic',data);

					if((data == null)||(data == 'null'))
						return;

					self.posts.push({
						id: id,
						text: data.posttitle,
						alias: data.alias,
						bedit: false
					});
				});
			}

		},
		viewpost(event){
			//console.log('view?');
			//console.log('event',event);
			this.bcategory = false;
			this.topics = [];
			let gun = this.$root.$gun;
			//let gun_posts = gun.get('posts');
			//console.log('data');
			let self = this;

			if(this.forumdata.access == 'public'){
				gun.get(this.forumdata.key).get('topic').get(event.id).once((data,id)=>{
				
					if((data == null)||(data == 'null'))
						return;

					self.topics.push({
						id:event.id,
						alias:data.alias,
						posttitle:data.posttitle,
						content:data.postcontent,
						postdate:data.postdate,
						bedit:false,
						isParent:true,
					});
				});

				gun.get(this.forumdata.key).get('topic').get(event.id).map().once((data,id)=>{
					//console.log('DATA>>>>>>>>>>>>');
					//console.log(data);
					//console.log(id);
					if((data == null)||(data == 'null')||(data.alias == null))
						return;

					self.topics.push({
						id:id,
						alias:data.alias,
						posttitle:data.posttitle,
						content:data.postcontent,
						postdate:data.postdate,
						bedit:false,
						isparent:false,
					});
						
				});

			}

			this.topicpubkey = event.id;
			this.publickeypost = event.id;
		},
		topic_editchange(post){ //press enter to finish edit
			//console.log(post);
			//console.log("change?");
			let gun = this.$root.$gun;

			gun.get(this.forumdata.key).get('topic').get(post.id).put({posttitle:post.text},ack=>{
				//console.log('ack',ack);
				if(ack.err){
					//console.log("fail edit!");
					this.$toast.open({
						message: 'Topic Edit Fail!',
						type: 'is-warning'
					});
					return;
				}
				if(ack.ok){
					//console.log("pass edit!");
					this.$toast.open({
						message: 'Topic Edit Update!',
						type: 'is-success'
					});
				}
			});

			post.bedit = false;
		},
		topic_edit(post){
			//console.log("topic_edit:",this.bedit);
			//console.log(this);
			post.bedit = !post.bedit;
		},
		action_deletetopic(event){
			//console.log(event);

			this.$dialog.confirm({
				message: 'Delete Topic! ' + event.text ,
				onConfirm:(value)=>{
					//this.$toast.open({message:'Access Grant!',type:'is-success'});
					this.topic_delete(event);
				},
				onCancel:()=>{
					this.$toast.open({message:'Delete Topic Cancel !',type:'is-warning'});
				}
			});

		},
		topic_delete(event){
			//console.log("topic_delete:",idToRemove);
			let gun = this.$root.$gun;
			//let gun_posts = gun.get('posts');
			let self = this;

			gun.get(this.forumdata.key).get('topic').get(event.id).put('null',ack=>{
				//console.log('ack',ack);
				if(ack.err){
					//console.log("fail edit!");
					this.$toast.open({
						message: 'Topic delete Fail!',
						type: 'is-warning'
					});
					return;
				}
				if(ack.ok){
					//console.log("pass edit!");
					this.$toast.open({
						message: 'Topic Delete!',
						type: 'is-success'
					});

					//remove item from list
					self.posts = self.posts.filter(post => {
						return post.id !== event.id
					});
				}
			});

		}
	},
	beforeDestroy() {
        // Perform the teardown procedure for someLeakyProperty.
    },
}
</script>

<style lang="scss">
 .el-header, .el-footer {
	//background-color: #B3C0D1;
	color: #333;
	height: 25px !important;
	margin-top: 0;
	margin-bottom: 0;
	//line-height: 20px;
	//font-size: 1.5em;
}

.el-main {
	background-color: #E9EEF3;
    color: #333;
}

.wrap{
	content: "HTML";
}
  
</style>
