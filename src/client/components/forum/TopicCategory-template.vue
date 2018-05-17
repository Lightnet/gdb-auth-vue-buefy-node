<template>
	<div>
		<div id="topicscroll" style="overflow-y:scroll;">
			<div class="card" v-for="post in posts" :key="post.id" href="#">
				<div class="card-content">
					<div class="field is-grouped is-grouped-left">
						<p class="control is-expanded">
						<label class="label wrap" v-if="!post.bedit" v-on:click="$emit('topicview',post)"> {{ post.text }} </label>
						<b-input type="textarea" v-if="post.bedit" v-model="post.text"  v-on:keyup.enter.native="$emit('topicchange',post)"></b-input>
						</p>
						<p class="control">
							<button class="button is-primary" @click="$emit('topicedit',post)">
								<b-icon
									pack="fas"
									icon="edit">
								</b-icon>
							</button>
							<button class="button is-danger" @click="$emit('topicdelete',post)">
								<b-icon
									pack="fas"
									icon="trash">
								</b-icon>
							</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import bus from '../../bus';

export default {
	components: {
		//'ForumList':ForumList
	},
	props:['posts','topicpubkey','forumdata'],
	data() {
		return{
			topicidhandle:'topicscroll',
			//forumlist:[
				//{id:'testsdf',name:'test'},
				//{id:'testddf',name:'test2'},
			//],
			//bpost:false,
			//mtopics: this.topics,
		}
    },
    created(){
		//console.log('ready...');
		window.addEventListener('resize', this.handleResize);
	},
	mounted(){
		this.handleResize();
	},
	methods:{
		handleResize(event){
			//console.log('resize');
			//console.log(window.innerHeight);
			//console.log(document.getElementById(this.topicidhandle).clientHeight);
			//document.getElementById(this.topicidhandle).clientHeight = window.innerHeight;//read only
			if(!document.getElementById(this.topicidhandle))
				return;
			if(window.innerHeight > 300){
				let scrollheight = window.innerHeight - 120;
				document.getElementById(this.topicidhandle).style.height = scrollheight + 'px';
			}
		}
	},
	beforeDestroy: function () {
		//console.log('beforeDestroy');
  		window.removeEventListener('resize', this.handleResize);
	}
}
</script>
<style lang="scss">

</style>
