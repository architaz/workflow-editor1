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
          <!-- N8N EXACT STYLE ICON -->
          <div 
            class="w-8 h-8 rounded-lg shadow-md flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-200"
            :style="{ backgroundColor: getN8nNodeColor(node.type) }"
          >
            <div 
              v-html="getN8nNodeIcon(node.type)" 
              class="w-5 h-5"
            ></div>
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
import { getN8nNodeIcon, getN8nNodeColor } from '@/utils/n8nIcons.js'
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
        // icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8Z"/></svg>`
      },
      {
        type: 'google-sheets',
        label: 'Google Sheets',
        description: 'Read/write data to spreadsheets',
        iconClass: 'bg-gradient-to-br from-green-500 to-green-600',
        // iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19M19,5H5V19H19V5M14,17V15.5H9.5V17H14M14,13.5V12H9.5V13.5H14M14,10V8.5H9.5V10H14Z"/></svg>`
      },
      {
        type: 'slack',
        label: 'Slack',
        description: 'Send notifications to Slack channels',
        iconClass: 'bg-gradient-to-br from-purple-500 to-purple-600',
        // iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>`
      },
      {
        type: 'email-send',
        label: 'Email',
        description: 'Send emails via SMTP',
        iconClass: 'bg-gradient-to-br from-blue-500 to-blue-600',
        // iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/></svg>`
      },
      {
        type: 'webhook',
        label: 'Webhook',
        description: 'Receive data from external services',
        iconClass: 'bg-gradient-to-br from-red-500 to-red-600',
        // iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.59,13.41C11,13.8 11,14.4 10.59,14.81C10.2,15.2 9.6,15.2 9.19,14.81L7.77,13.39L9.19,12L10.59,13.41M14.5,18A4.5,4.5 0 0,1 10,13.5A4.5,4.5 0 0,1 14.5,9A4.5,4.5 0 0,1 19,13.5A4.5,4.5 0 0,1 14.5,18M14.5,7A6.5,6.5 0 0,0 8,13.5A6.5,6.5 0 0,0 14.5,20A6.5,6.5 0 0,0 21,13.5A6.5,6.5 0 0,0 14.5,7M16.62,16.62L15.21,18L13.79,16.62L15.21,15.21L16.62,16.62M18,15.21L19.41,13.79L20.82,15.21L19.41,16.62L18,15.21Z"/></svg>`
      }
    ]
    
    const onDragStart = (event, nodeType) => {
      console.log('Starting drag for node type:', nodeType)
      event.dataTransfer.setData('application/node-type', nodeType)
      event.dataTransfer.setData('text/plain', nodeType)
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.dropEffect = 'move'
      emit('node-drag', nodeType)
    }
    
    return {
      nodeTypes,
      onDragStart,
      getN8nNodeIcon,
      getN8nNodeColor
      // getIcon
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