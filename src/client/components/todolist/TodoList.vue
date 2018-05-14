<template>
	<div>
		
		<BaseInputText 
			v-model="newTodoText"
			placeholder="New todo"
			@keydown.enter.native="addTodo"
		/>
		
		<div id="todolistscroll" style="overflow:auto;">
			<ul v-if="todos.length">
				<TodoListItem
					v-for="todo in todos"
					:key="todo.id"
					:todo="todo"
					@keydown.enter.native="editchange"
					@edit="editTodo"
					@remove="removeTodo"
				/>
			</ul>
			<p v-else>
				Nothing left in the list. Add a new todo in the input above.
			</p>
		</div>
	</div>
</template>

<script>
import BaseInputText from './BaseInputText.vue'
import TodoListItem from './TodoListItem.vue'

let nextTodoId = 1

export default {
	components: {
		BaseInputText, TodoListItem
	},
  	data () {
		return {
			newTodoText: '',
			todoid:'',
			todos: [],
			todolistidhandle:'todolistscroll',
		}
  	},
	created() { // get todo items and start listening to events once component is created
		this.fetchTodo();
		let gun = this.$root.$gun;
		this.gun_todolist =  this.$root.user.get('todolist');

		//console.log("thought ?");
		let self = this;
		this.gun_todolist.map().once(function(data, id){
			//console.log(">>",thought,":",id);
			//console.log('id: ',id);
			if ((data == null)||(data == 'null'))
				return;
			self.todos.push({
				id: id,
				text: data.text,
				bedit: false,
			});
      	});
		//this.listenToEvents();
	},
	mounted(){
		window.addEventListener('resize', this.handleResize);
		this.handleResize();
	},
	unmounted(){
		console.log("unmounted");
	},
	beforeDestroy: function () {
		//console.log('beforeDestroy');
  		window.removeEventListener('resize', this.handleResize);
	},
	destroyed(){
		//console.log("destroy");
	},
	methods: {
		handleResize(event){
			//console.log('resize');
			if(window.innerHeight > 200){
				let scrollheight = window.innerHeight - 200;
				document.getElementById(this.todolistidhandle).style.height = scrollheight + 'px';
			}
		},
		fetchTodo() {
			//let uri = 'http://localhost:4000/api/all';
			//axios.get(uri).then((response) => {
				//this.todos = response.data;
			//});
			//console.log(this.$root.$gun);
			//console.log(this.todos);
        },
		addTodo () {
			const trimmedText = this.newTodoText.trim();
			//console.log('trimmedText',trimmedText);
			if (trimmedText) {
				//this.todos.push({
					//id: nextTodoId++,
					//text: trimmedText
				//})
				this.gun_todolist.set({
					text:trimmedText,
					//bedit:false
				});
				this.newTodoText = ''
			}
		},
		editTodo(id){
			//console.log('edit',id);
			this.todos.filter(todo => {
				if(todo.id == id){
					todo.bedit = todo.bedit != true;
					//console.log(todo.bedit);
				}
			});
		},
		isEmpty(str) {
    		return (!str || 0 === str.length);
		},
		editchange(event){
			//this.gun_todolist =  this.$root.user.get('todolist');
			//console.log(event);
			//console.log(event.target.id);
			let id = event.target.id;
			let str_text = event.target.value;
			let user = this.$root.user;

			//console.log(this.isEmpty(str_text));
			if(this.isEmpty(str_text)){
				//console.log('empty string...');
				this.$message('Empty!');
				return;
			}
			//this.gun_todolist.get(id).once(function(data){
				//console.log('data');
				//console.log(data);
			//});
			//console.log('string...');
			//console.log(id);
			//console.log(str_text);
			//this.$root.user.get('todolist')

			this.$root.user.get('todolist').get(id).put({text:str_text},function(ack){
				//console.log(ack);
			});

			this.todos.filter(todo => {
				if(todo.id == id){
					todo.bedit = todo.bedit != true;
					//console.log(todo.bedit);
				}
			});
		},
		removeTodo (idToRemove) {
			//console.log("idToRemove:",idToRemove);
			//this.$root.$gun.get('thoughts').get(idToRemove).put(null);
			//this.gun_thoughts.get(idToRemove).put(null);
			//this.$root.user.get('thoughts').get(idToRemove).once(function(value){
				//console.log(value);
			//});
			//this.$root.user.get('thoughts').get(idToRemove).put(undefined);
			this.$root.user.get('todolist').get(idToRemove).put('null');
			this.todos = this.todos.filter(todo => {
				return todo.id !== idToRemove
			});
		}
	}
}
</script>