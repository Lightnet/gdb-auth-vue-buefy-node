<template>
	<div id="app">
		<section>

			<nav class="navbar is-transparent">
				<div class="navbar-brand">
					<a class="navbar-item" href="https://bulma.io">
					<img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28">
					</a>
					<div class="navbar-burger burger" @click="toggleMenu" :class="{'is-active': navIsActive}" data-target="navbarTransparent">
					<span></span>
					<span></span>
					<span></span>
					</div>
				</div>

				<div id="navbarTransparent" class="navbar-menu" :class="{'is-active': navIsActive}">
					<div class="navbar-start">
					<a class="navbar-item is-active" href="#" @click="currentView='home'">
						Home
					</a>
					<a class="navbar-item" href="#" @click="currentView='account'">
						Account
					</a>
					<a class="navbar-item" href="#" @click="currentView='pm'">
						Messages
					</a>
					<a class="navbar-item" href="#" @click="currentView='chat'">
						Chat
					</a>
					<a class="navbar-item" href="#" @click="currentView='todolist'">
						To Do List
					</a>
					<a class="navbar-item" href="#" @click="currentView='forum'">
						Forum
					</a>

					<a class="navbar-item" href="#" @click="currentView='prototype'">
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
import chatTemplate from './components/chat-template.vue';

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
			navIsActive: false,
		}
	},
	watch:{

	},
	created(){
		this.$on('update:username',(event)=>{
			console.log("data child?");
		});
		//document.querySelector('body').classList.add("dark");
	},
	components: {
		'home':hometemplate,
		'forum':forumtemplate,
		'create-post': createtemplate,
		'todolist':toDoListTemplate,
		'account':accountTemplate,
		//'messagebox':MessageBoxTemplate,
		'chat':chatTemplate,
		'pm':MsgBoxTemplate,
		'prototype':PrototypeTemplate,
	},
	methods: {
		toggleMenu() {
			this.navIsActive = !this.navIsActive;
			console.log(this);
			console.log("test");
      	},

		handleSelect(event) {
			//console.log(key, keyPath);
			//console.log(key);
			console.log(event);
			console.log(event.target.innerText);
			
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