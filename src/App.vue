<template>
  <div id="app" class="h-screen w-screen">
    <WorkflowEditor />
  </div>
</template>

<script>
import WorkflowEditor from './components/WorkflowEditor.vue'

export default {
  name: 'App',
  components: {
    WorkflowEditor
  }
}
</script>