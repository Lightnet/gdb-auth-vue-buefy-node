<template>
  	<div v-if="blogin">
    	<div v-if="bcategory">
			<topiccategory 
				:posts="posts" 
				@newpost="replypost_click" 
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
			blogin:false,
		}
	},
	components: {
		'topics':topics,
		'topiccategory':topiccategory,
	},
	async created(){
		//let gun = this.$root.$gun;
		let gun = this.$root.user;
		this.gun_posts = gun.get('posts');
		if(gun.is){
			this.blogin = true;
			this.updateforum();
		}
		//console.log(gun.is);
	},
	methods:{
		replypost_click(){
			this.$root.publickeypost = this.publickeypost;
			//this.bpost = true;
			//console.log(this.$parent);
			this.$parent.currentView = 'create-post';
		},
		updateforum(){
			let self = this;
			//console.log("test posts?");
			this.gun_posts.map().once((post, id)=>{
				//console.log(">>",thought,":",id);
				if ((post == null) || (post == 'null')){
					return;
				}
				self.posts.push({
					id: id,
					text: post.posttitle,
					bedit: false
				});
			});
		},
		viewpost(event){
			//console.log('view?');
			//console.log('event',event);
			this.bcategory = false;
			this.topics = [];
			let gun = this.$root.user;
			let gun_posts = gun.get('posts');
			//console.log('data');
			let self = this;
			//id post
			gun_posts.get(event.id).once((data)=>{
				//console.log(data);
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
			//get key id for map topic post list
			gun.get(event.id).map().once((data,id)=>{
				//console.log(data);
				//console.log(id);
				if((data == null)||(data == 'null'))
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
			this.topicpubkey = event.id;
			this.publickeypost = event.id;
		},
		topic_editchange(post){ //press enter to finish edit
			//console.log(post);
			//console.log("change?");
			let gun = this.$root.user;
			let gun_posts = gun.get('posts');
			gun_posts.get(post.id).put({posttitle:post.text});
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
				message: 'Topic Delete ' + event.text + '?',
				onConfirm:(value)=>{
					this.$toast.open({message:'Delete Topic! ' + event.text ,type:'is-success'});
					this.topic_delete(event);
				},
				onCancel:()=>{
					this.$toast.open({message:'Cancel Delete!',type:'is-warning'});
				}
			});
		},
		topic_delete(event){
			//console.log("topic_delete:",idToRemove);
			let gun = this.$root.user;
			let gun_posts = gun.get('posts');
			//null child keys
			gun.get(event.id).map().once((key,id)=>{
				gun.get(event.id).get(id).put('null',function(ack){
					//console.log(ack);
				});
			});
			//null key
			gun_posts.get(event.id).put('null',function(ack){
				//console.log(ack);
			});
			//remove item from list
			this.posts = this.posts.filter(post => {
				return post.id !== event.id
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