<template id="todolistapp">
	<div v-if="$root.blogin">
		<h1>My Todo List!</h1>
		<TodoList/>
	</div>
	<div v-else>
		<br>
		<center>
			<b-icon pack="fas" icon="user"></b-icon>
			Please Login.
			<span class="icon"><i class="fas exclamation-circle"></i></span>
		</center>
	</div>
</template>

<script>
import TodoList from './todolist/TodoList.vue'

export default {
	components: {
		TodoList
	}
}
</script>

<style lang="scss">

</style>