<template>
	<div>
		<div id="topicscroll" style="overflow:auto;">
			<article class="media" v-for="topic in mtopics" :key="topic.id">
				<figure class="media-left">
					<p class="image is-64x64">
					<img src="https://bulma.io/images/placeholders/128x128.png">
					</p>
				</figure>
				<div class="media-content">
    				<div class="content">
						<p>
							<strong>User: {{topic.alias}} | Title: {{ topic.posttitle }} </strong>
							<br>
							<span v-if="!topic.bedit" class="wrap">{{ topic.content }}</span>
							<b-input type="textarea" v-if="topic.bedit" v-model="topic.content" v-on:keydown.enter.native="topic_editchange(topic)"></b-input>
							<br>
							Date: {{ topic.postdate }}
						</p>
					</div>
				</div>
				<div class="media-right" v-if="topic.isparent==false">
					<button class="button is-primary" icon="el-icon-edit" v-on:click="topic_edit(topic)">
						<b-icon
							pack="fas"
							icon="edit">
						</b-icon>
					</button>
					<button class="button is-danger" icon="el-icon-delete" v-on:click="action_deletetopicpost(topic)">
						<b-icon
							pack="fas"
							icon="trash">
						</b-icon>
					</button>
				</div>
			</article>
		</div>
		<button class="button is-primary" size="mini" v-if="!bpost" v-on:click="replypost_click"> Reply Topic </button>
    </div>
</template>
<script>
import bus from '../../bus';

export default {
	props:['topics','topicpubkey'],
	data() {
		return{
			bpost:false,
			mtopics: this.topics,
			topicidhandle:'topicscroll',
		}
    },
    created(){
		//console.log('ready...');
		//window.addEventListener('resize', this.handleResize);
	},
	mounted(){
		window.addEventListener('resize', this.handleResize);
		this.handleResize();
	},
	methods:{
		handleResize(event){
			//console.log('resize');
			//console.log(window.innerHeight);
			//console.log(document.getElementById(this.topicidhandle).clientHeight);
			//document.getElementById(this.topicidhandle).clientHeight = window.innerHeight;//read only
			if(window.innerHeight > 300){
				let scrollheight = window.innerHeight - 120;
				document.getElementById(this.topicidhandle).style.height = scrollheight + 'px';
			}
		},
		replypost_click(){
			this.$root.publickeypost = this.topicpubkey;
			//this.bpost = true;
			//console.log(this.$parent);
			this.$parent.$parent.currentView = 'create-post';
		},
		topic_edit(post){
			//console.log("topic_edit:",this.bedit);
			//console.log(this);
			post.bedit = !post.bedit;
		},
		topic_editchange(event){
			//console.log("edit finish");
			//console.log(event);
			//post
			let self = this;
			let gun = this.$root.$gun;

			gun.get(this.topicpubkey).get(event.id).put({postcontent:event.content},(ack)=>{
				//console.log(ack);
				if(ack.err){
					//self.poststatus = 'Error Update Post!';
					//self.$message.error({message:'Error Post!',duration:800});
					self.$toast.open({
						message: 'Error Update Post!',
						type: 'is-warning'
					});
				}
				if(ack.ok){
					//self.poststatus = 'Posted!';
					//self.bpost = false;
					//self.$message({message:'Posted!',type: 'success',duration:800});
					self.$toast.open({
						message: 'Updated Posted!',
						type: 'is-success'
					});
				}
				//clear public key
				//self.pubkey = '';
				//self.$root.publickeypost = '';
			});
			
			event.bedit = false;
		},
		action_deletetopicpost(event){
			//console.log(event);
			this.$dialog.confirm({
				message: 'Topic Delete ' + event.posttitle + '?',
				onConfirm:(value)=>{
					//this.$toast.open({message:'Delete Topic! ' + event.posttitle ,type:'is-success'});
					this.topic_delete(event);
				},
				onCancel:()=>{
					this.$toast.open({message:'Cancel Delete!',type:'is-warning'});
				}
			});
		},
		topic_delete(event){
			//console.log("topic_delete:",event);
			let gun = this.$root.$gun;
			let self = this;
			//gun.get(this.topicpubkey).get(event.id).once(data=>{
				//console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
				//console.log(data);
			//});

			gun.get(this.topicpubkey).get(event.id).put('null',(ack)=>{
				//console.log(ack);
				if(ack.err){
					self.$toast.open({
						message: 'Error Update Post!',
						type: 'is-warning'
					});
				}
				if(ack.ok){
					self.$toast.open({
						message: 'Delete Posted!',
						type: 'is-success'
					});
					//remove item from list
					let topics = self.mtopics;
					topics = topics.filter(post => {
						return post.id !== event.id
					});
					self.mtopics = topics;
				}
			});
		},
	},
	beforeDestroy: function () {
		//console.log('beforeDestroy');
  		window.removeEventListener('resize', this.handleResize);
	}
}
</script>
<style lang="scss">
.wrap{
	content: "HTML";
}

code {
  white-space:no-wrap;
  word-break: break-all;
  word-wrap: break-word;
  display:block;
  margin:6px 0;
  color:#af7aa5;
}
</style>
