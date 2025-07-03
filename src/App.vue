<template>
  <div id="app" class="workflow-container">
    <div class="workflow-editor h-screen w-screen flex">
      <!-- Sidebar with nodes -->
      <div class="sidebar w-72 bg-gradient-to-br from-slate-900 to-slate-800 p-6 border-r border-slate-700/50 shadow-xl">
        <div class="mb-8">
          <h3 class="text-xl font-bold text-white mb-2">Workflow Nodes</h3>
          <p class="text-slate-400 text-sm">Drag and drop to build your workflow</p>
        </div>
        <NodePalette @node-drag="onNodeDrag" />
      </div>

      <!-- Main canvas area -->
      <div class="canvas-container flex-1 relative bg-gradient-to-br from-slate-50 to-slate-100">
        <div class="controls absolute top-6 left-6 z-10 flex gap-3">
          <button
            @click="runWorkflow"
            class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
            </svg>
            Run Flow
          </button>
          <button
            @click="clearCanvas"
            class="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear
          </button>
        </div>

        <!-- Vue Flow Canvas -->
        <VueFlow
          v-model:nodes="nodes"
          v-model:edges="edges"
          class="vue-flow-container"
          @drop="onDrop"
          @dragover="onDragOver"
          @connect="onConnect"
          :node-types="nodeTypes"
        >
          <!-- Add controls -->
          <Controls />
          <!-- Add minimap -->
          <MiniMap />
        </VueFlow>
      </div>

      <!-- Output panel -->
      <div class="output-panel w-96 bg-white p-6 border-l border-slate-200 shadow-xl">
        <div class="mb-6">
          <h3 class="text-xl font-bold text-slate-800 mb-2">Execution Output</h3>
          <p class="text-slate-600 text-sm">Watch your workflow come to life</p>
        </div>
        <div class="output-content bg-slate-900 p-4 rounded-xl border border-slate-800 h-96 overflow-y-auto text-sm font-mono shadow-inner">
          <pre class="whitespace-pre-wrap text-green-400">{{ executionOutput }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, markRaw } from 'vue'
import { VueFlow } from '@vue-flow/core'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import NodePalette from './components/NodePalette.vue'
import CustomNode from './components/CustomNode.vue'

export default {
  name: 'App',
  components: {
    VueFlow,
    Controls,
    MiniMap,
    NodePalette,
  },
  setup() {
    const nodes = ref([])
    const edges = ref([])
    const executionOutput = ref(
      'Ready to run workflow...\n\nDrag nodes from the left panel to the canvas to start building your workflow.',
    )

    // Register custom node types
    const nodeTypes = {
      custom: markRaw(CustomNode),
    }

    // Node counter for unique IDs
    let nodeId = 0

    const onNodeDrag = (nodeType) => {
      console.log('Node drag started:', nodeType)
    }

    const onDrop = (event) => {
      event.preventDefault()

      const nodeType = event.dataTransfer.getData('application/node-type')
      if (!nodeType) return

      const reactFlowBounds = event.currentTarget.getBoundingClientRect()
      const position = {
        x: event.clientX - reactFlowBounds.left - 75,
        y: event.clientY - reactFlowBounds.top - 25,
      }

      const newNode = {
        id: `${nodeType}-${nodeId++}`,
        type: 'custom',
        position,
        data: {
          label: getNodeLabel(nodeType),
          nodeType: nodeType,
        },
      }

      nodes.value = [...nodes.value, newNode]
      console.log('Node added:', newNode)
    }

    const onDragOver = (event) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    }

    const onConnect = (params) => {
      const newEdge = {
        id: `edge-${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
        type: 'smoothstep',
        style: { stroke: '#3b82f6', strokeWidth: 2 },
      }
      edges.value = [...edges.value, newEdge]
      console.log('Edge connected:', newEdge)
    }

    const getNodeLabel = (nodeType) => {
      const labels = {
        'get-reviews': 'Get Reviews',
        'k-means': 'Apply K-means Algorithm',
        'clusters-to-list': 'Clusters to List',
        'customer-insights': 'Customer Insights Agent',
        'insights-to-sheets': 'Insights to GSheets',
      }
      return labels[nodeType] || nodeType
    }

    const runWorkflow = () => {
      if (nodes.value.length === 0) {
        executionOutput.value = 'No nodes to execute. Please add some nodes to the canvas first.'
        return
      }

      executionOutput.value = '🚀 Starting workflow execution...\n\n'

      nodes.value.forEach((node, index) => {
        setTimeout(() => {
          const output = simulateNodeExecution(node.data.nodeType)
          executionOutput.value += `${index + 1}. ${node.data.label}:\n${output}\n\n`
        }, index * 1500)
      })
    }

    const simulateNodeExecution = (nodeType) => {
      const simulations = {
        'get-reviews':
          '✅ Fetched 150 customer reviews from database\n  📝 Sample: "Great product, highly recommend!"',
        'k-means':
          '🔍 Applied K-means clustering (k=3)\n  📊 Cluster 1: 45 reviews\n  📊 Cluster 2: 67 reviews\n  📊 Cluster 3: 38 reviews',
        'clusters-to-list':
          '📋 Converted clusters to customer segments\n  🎯 Segments: Happy, Neutral, Unhappy Customers',
        'customer-insights':
          '🤖 Generated insights using AI agent\n  🏷️ Tags: "price-sensitive", "quality-focused", "service-oriented"',
        'insights-to-sheets':
          '📤 Data exported to Google Sheets\n  📄 File: customer-insights-2024.xlsx',
      }
      return simulations[nodeType] || '✅ Execution completed'
    }

    const clearCanvas = () => {
      nodes.value = []
      edges.value = []
      executionOutput.value =
        '🧹 Canvas cleared. Ready for new workflow...\n\nDrag nodes from the left panel to start building.'
    }

    return {
      nodes,
      edges,
      executionOutput,
      nodeTypes,
      onNodeDrag,
      onDrop,
      onDragOver,
      onConnect,
      runWorkflow,
      clearCanvas,
    }
  },
}
</script>

<style>
/* Import Tailwind and Vue Flow styles */
@import 'tailwindcss';
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
@import '@vue-flow/controls/dist/style.css';
@import '@vue-flow/minimap/dist/style.css';

/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100vh;
  width: 100vw;
}

.workflow-container {
  height: 100%;
  width: 100%;
}

.vue-flow-container {
  height: 100%;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  background-image: 
    radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.15) 1px, transparent 0);
  background-size: 24px 24px;
  position: relative;
}

.vue-flow-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(59, 130, 246, 0.05) 100%);
  pointer-events: none;
}

/* Custom node styles fallback */
.vue-flow__node-custom {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  min-width: 180px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.vue-flow__node-custom:hover {
  border-color: #3b82f6;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.vue-flow__node-custom.selected {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Controls styling */
.vue-flow__controls {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.vue-flow__controls-button {
  background: transparent;
  border: none;
  color: #64748b;
  transition: all 0.2s ease;
}

.vue-flow__controls-button:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

/* Minimap styling */
.vue-flow__minimap {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Edge styling */
.vue-flow__edge path {
  stroke: #3b82f6;
  stroke-width: 2;
}

.vue-flow__edge.selected path {
  stroke: #1d4ed8;
  stroke-width: 3;
}

/* Connection line styling */
.vue-flow__connectionline {
  stroke: #3b82f6;
  stroke-width: 2;
  stroke-dasharray: 5, 5;
}

/* Handle styling */
.vue-flow__handle {
  background: #3b82f6;
  border: 2px solid #ffffff;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.vue-flow__handle:hover {
  background: #1d4ed8;
  transform: scale(1.2);
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.8);
}

/* Animation for buttons */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>