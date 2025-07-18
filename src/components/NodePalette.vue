<template>
  <div class="node-palette h-full flex flex-col justify-between py-4">
    <div 
      v-for="node in nodeTypes" 
      :key="node.type"
      :draggable="true"
      @dragstart="onDragStart($event, node.type)"
      class="node-item flex-1 group relative p-4 mx-2 bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl cursor-move hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105 hover:border-blue-300 flex items-center"
    >
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <div :class="node.iconClass" class="w-8 h-8 rounded-lg shadow-md flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-200">
            {{ node.icon }}
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold text-slate-800 mb-1 group-hover:text-blue-700 transition-colors">
            {{ node.label }}
          </h4>
          <p class="text-xs text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">
            {{ node.description }}
          </p>
        </div>
      </div>
      
      <!-- Drag indicator -->
      <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      </div>
      
      <!-- Glow effect on hover -->
      <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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
        iconClass: 'bg-gradient-to-br from-blue-500 to-blue-600',
        icon: '📄'
      },
      {
        type: 'k-means',
        label: 'Apply K-means',
        description: 'Cluster reviews using K-means algorithm',
        iconClass: 'bg-gradient-to-br from-green-500 to-green-600',
        icon: '🔍'
      },
      {
        type: 'clusters-to-list',
        label: 'Clusters to List',
        description: 'Convert clusters to customer segments',
        iconClass: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
        icon: '📊'
      },
      {
        type: 'customer-insights',
        label: 'Customer Insights',
        description: 'Generate insights using AI agent',
        iconClass: 'bg-gradient-to-br from-purple-500 to-purple-600',
        icon: '🧠'
      },
      {
        type: 'insights-to-sheets',
        label: 'Export to Sheets',
        description: 'Save results to spreadsheet',
        iconClass: 'bg-gradient-to-br from-red-500 to-red-600',
        icon: '📈'
      },
      {
        type: 'http-request',
        label: 'HTTP Request',
        description: 'Make API calls to external services',
        iconClass: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
        icon: '🌐'
      },
      {
        type: 'google-sheets',
        label: 'Google Sheets',
        description: 'Read/write data to spreadsheets',
        iconClass: 'bg-gradient-to-br from-green-500 to-green-600',
        icon: '📊'
      },
      {
        type: 'slack',
        label: 'Slack',
        description: 'Send notifications to Slack channels',
        iconClass: 'bg-gradient-to-br from-purple-500 to-purple-600',
        icon: '💬'
      },
      {
        type: 'email',
        label: 'Email',
        description: 'Send emails with results',
        iconClass: 'bg-gradient-to-br from-blue-500 to-blue-600',
        icon: '✉️'
      },
      {
        type: 'webhook',
        label: 'Webhook',
        description: 'Receive data from external services',
        iconClass: 'bg-gradient-to-br from-red-500 to-red-600',
        icon: '🪝'
      }
    ]
    
    const onDragStart = (event, nodeType) => {
      console.log('Starting drag for node type:', nodeType)
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
.node-palette {
  min-height: calc(100vh - 200px); /* Account for header space */
}
.node-item {
  position: relative;
  overflow: hidden;
  min-height: 0;
}

.node-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.node-item:hover::before {
  left: 100%;
}

.node-item:active {
  transform: scale(0.98);
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.node-item:hover::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 1s ease-in-out;
}
</style>