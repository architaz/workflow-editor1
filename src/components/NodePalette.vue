<template>
  <div class="node-palette">
    <div 
      v-for="node in nodeTypes" 
      :key="node.type"
      :draggable="true"
      @dragstart="onDragStart($event, node.type)"
      class="node-item p-3 mb-2 bg-white border rounded cursor-move hover:shadow-md transition-shadow"
    >
      <div class="flex items-center space-x-2">
        <div :class="node.iconClass" class="w-4 h-4"></div>
        <span class="text-sm font-medium">{{ node.label }}</span>
      </div>
      <p class="text-xs text-gray-500 mt-1">{{ node.description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NodePalette',
  emits: ['node-drag'],
  setup(props, { emit }) {
    const nodeTypes = [
      {
        type: 'get-reviews',
        label: 'Get Reviews',
        description: 'Fetch customer reviews from database',
        iconClass: 'bg-blue-500 rounded-full'
      },
      {
        type: 'k-means',
        label: 'Apply K-means',
        description: 'Cluster reviews using K-means algorithm',
        iconClass: 'bg-green-500 rounded-full'
      },
      {
        type: 'clusters-to-list',
        label: 'Clusters to List',
        description: 'Convert clusters to customer segments',
        iconClass: 'bg-yellow-500 rounded-full'
      },
      {
        type: 'customer-insights',
        label: 'Customer Insights',
        description: 'Generate insights using AI agent',
        iconClass: 'bg-purple-500 rounded-full'
      },
      {
        type: 'insights-to-sheets',
        label: 'Export to Sheets',
        description: 'Save results to spreadsheet',
        iconClass: 'bg-red-500 rounded-full'
      }
    ]
    
    const onDragStart = (event, nodeType) => {
      event.dataTransfer.setData('application/node-type', nodeType)
      event.dataTransfer.effectAllowed = 'move'
      emit('node-drag', nodeType)
    }
    
    return {
      nodeTypes,
      onDragStart
    }
  }
}
</script>

<style scoped>
.node-item:hover {
  transform: translateY(-1px);
}
</style>