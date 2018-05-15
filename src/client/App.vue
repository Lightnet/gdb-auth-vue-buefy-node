<template>
	<div id="app">

		<section>
			<nav class="navbar is-primary">
				<div class="navbar-brand">
					<a class="navbar-item" href="#">
					<img src="https://cdn.glitch.com/c9391fb8-fcc8-4514-ab30-7e896028d056%2Flogoc.png?1526351308640" alt="" width="112" height="28">
					</a>
					<div class="navbar-burger burger" data-target="navbarTransparent" @click="toggleMenu" v-bind:class="{ 'is-active': isActive }" >
					<span></span>
					<span></span>
					<span></span>
					</div>
				</div>

				<div id="navbarTransparent" class="navbar-menu" @click="handleSelect" v-bind:class="{ 'is-active': isActive }">

					<div class="navbar-start">
					<a class="navbar-item" href="#">
						Home
					</a>
					<a class="navbar-item" href="#">
						Account
					</a>
					<a class="navbar-item" href="#">
						Messages
					</a>
					<a class="navbar-item" href="#">
						Chat
					</a>
					<a class="navbar-item" href="#">
						To Do List
					</a>
					<a class="navbar-item" href="#">
						Forum
					</a>
					<a class="navbar-item" href="#">
						Test
					</a>
					<div class="navbar-item has-dropdown is-hoverable">
						<a class="navbar-link" href="#">
						Theme
						</a>
						<div class="navbar-dropdown is-boxed">
						<a class="navbar-item" @click="handleSelect" href="#">
							Light
						</a>
						<a class="navbar-item" @click="handleSelect" href="#">
							Dark
						</a>
						</div>
					</div>
					</div>

					<div class="navbar-end">
					<div class="navbar-item">
						<div class="field is-grouped">
						<p class="control">
							<a class="bd-tw-button button" data-social-network="Twitter" data-social-action="tweet" data-social-target="http://localhost:3000" target="_blank" href="#">
							<span class="icon">
								<i class="fab fa-twitter"></i>
							</span>
							<span>
								Tweet
							</span>
							</a>
						</p>
						<p class="control">
							<a class="button is-primary" href="#">
							<span class="icon">
								<i class="fas fa-download"></i>
							</span>
							<span>Download</span>
							</a>
						</p>
						</div>
					</div>
					</div>
				</div>
				</nav>
		</section>

		<div class="container">
			<component :is="currentView" ></component>
		</div>

		<nav class="navbar is-fixed-bottom">
			<div class="navbar-brand">
				<div class="navbar-burger burger" data-target="navbarBottom" @click="toggleMenu" v-bind:class="{ 'is-active': isActive }" >
				<span></span>
				<span></span>
				<span></span>
				</div>
			</div>

			<div id="navbarBottom" class="navbar-menu" @click="handleSelect" v-bind:class="{ 'is-active': isActive }">
				<div class="navbar-start">
					<a class="navbar-item" href="#">
						Home
					</a>
				</div>
				<div class="navbar-end">
					<div class="navbar-item">
						{{guntime}}
					</div>
				</div>
			</div>
		</nav>



	</div>
</template>

<script>
import Vue from 'vue';
import hometemplate from './components/Home-template.vue';
import forumtemplate from './components/Forum-template.vue';
import createtemplate from './components/forum/CreateTopic-template.vue';
import toDoListTemplate from './components/Todolist-template.vue';
import accountTemplate from './components/Account-template.vue';
import MsgBoxTemplate from './components/PMBox-template.vue';
import chatTemplate from './components/Chat-template.vue';

import PrototypeTemplate from './components/Prototype-template.vue';

export default {
    name: 'app',
    data() {
		return {
			//activeIndex:'account',
			//activeName: 'Account',
			username:'none',
			//currentView: 'manage-posts'
			currentView: 'account',
			//currentView: 'todolistapp',
			//currentView: 'create-post',
			//blogin:false,
			postid:'default',
			postlistid:'default',
			navIsActive: null,
			isActive: false,
			timer: '',
			guntime:'',
		}
	},
	watch:{

	},
	created(){
		this.$on('update:username',(event)=>{
			console.log("data child?");
		});
		this.timeEvent();
		this.timer = setInterval(this.timeEvent, 1000)
		//document.querySelector('body').classList.add("dark");
	},
	components: {
		'home':hometemplate,
		'forum':forumtemplate,
		'create-post': createtemplate,
		'todolist':toDoListTemplate,
		'account':accountTemplate,
		'chat':chatTemplate,
		'pm':MsgBoxTemplate,
		'prototype':PrototypeTemplate,
	},
	methods: {
		timeEvent(){
			let time = new Date(Gun.state());
			this.guntime = time.toLocaleString() +' '+ (time.getMilliseconds()/1000).toFixed(3).slice(1);
			//console.log(this.guntime);
		},
		cancelAutoTime(){ 
			clearInterval(this.timer);
		},
		toggleMenu(){
			this.isActive = !this.isActive;
			//console.log(this);
			//console.log("test");
      	},
		handleSelect(event) {
			//console.log(event);			
			//this.isActive = !this.isActive;
			if(this.navIsActive !=null){
				this.navIsActive.classList.remove('is-active');
			}
			//console.log(event.target.innerText);
			event.target.classList.toggle('is-active');
			//event.toElement.classList.toggle('is-active');
			this.navIsActive = event.target;

			if(event.target.innerText == 'Home'){
				this.currentView = 'home'
			}
			if(event.target.innerText == 'Forum'){
				this.currentView = 'forum'
			}
			if(event.target.innerText == 'Account'){
				this.currentView = 'account'
			}
			if(event.target.innerText == 'Chat'){
				this.currentView = 'chat'
			}
			if(event.target.innerText == 'Messages'){
				this.currentView = 'pm'
			}
			if(event.target.innerText == 'Test'){
				this.currentView = 'prototype'
			}

			if(event.target.innerText == 'To Do List'){
				this.currentView = 'todolist'
			}
			if(event.target.innerText == 'Light'){
				//require('./element-light.scss');
				//console.log(document);
				document.querySelector('body').classList.remove("dark");
				document.querySelector('body').classList.add("light");
				return;
			}
			if(event.target.innerText == 'Dark'){
				//require('./element-dark.scss');
				document.querySelector('body').classList.remove("light");
				document.querySelector('body').classList.add("dark");
				//document.querySelector('body').classList.add("theme_dark");
				return;
			}
			//check if string is empty incase it goes blank.
			//if(key != ''){
				//this.currentView = key;
			//}
      	},
		updateMessage (message) {
      		// By emitting the 'update' event in every intermediary component we can pass data
      		// from GrandchildComponent to ChildComponent and from there to the parent
      		this.$emit('update', message)
		}
		
		
	},
	beforeDestroy() {
  		clearInterval(this.timer);
	}
}
</script>

<style lang="scss">
//theme light
body.light {
	--text-color: white;
	--bg-color: black;
}
//theme dark
body.dark {
	--text-color: black;
	--bg-color: white;
}

.theme_dark {
	--color-primary: rgb(255, 0, 0);
	--text-color: black;
}

body {
	background-color: var(--text-color);
	color: var(--bg-color);
}

.header {
  padding: 15px 15px 20px 15px;
  border-bottom: 1px solid #e5e5e5;
}

.header h3 {
  margin-top: 0;
  margin-bottom: 0;
  line-height: 40px;
}
</style>