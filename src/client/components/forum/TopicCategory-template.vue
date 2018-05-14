<template>
	<div>
		<div class="field is-grouped">
			<p class="control">
				<button class="button is-primary" @click="$emit('newpost')">New Topic</button>
			</p>
			<p class="control">
				<b-switch v-model="bforumlistselect">Forum List</b-switch>
			</p>
		</div>
		<div v-if="bforumlistselect">
			<ForumList> </ForumList>
		</div>

		<div id="topicscroll" style="overflow-y:scroll;">
			<div class="card" v-for="post in posts" :key="post.id" href="#">
				<label class="label wrap" v-if="!post.bedit"  v-on:click="$emit('topicview',post)"> {{ post.text }} </label>
				<b-input v-if="post.bedit" v-model="post.text" v-on:change="$emit('topicchange',post)"></b-input>
				<span style="float: right; padding: 3px 0">
					<button class="button is-primary" @click="$emit('topicedit',post)"></button>
					<button class="button is-primary" @click="$emit('topicdelete',post)"></button>
				</span>
			</div>
		</div>
	</div>
</template>
<script>
import bus from '../../bus';

import ForumList from './ForumList.vue';

export default {
	components: {
		'ForumList':ForumList
	},
	props:['posts','topicpubkey'],
	data() {
		return{
			topicidhandle:'topicscroll',
			bforumlistselect:false,
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
