<template>
  <div id="app">
    <WorkflowEditor />
  </div>
</template>

<script>
import WorkflowEditor from './components/WorkflowEditor.vue'

export default {
  name: 'App',
  components: {
    WorkflowEditor,
  },
}
</script>

<style scoped>
#app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
