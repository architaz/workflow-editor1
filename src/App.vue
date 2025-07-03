<template>
  <div id="app" class="workflow-container">
    <div class="workflow-editor h-screen w-screen flex">
      <!-- Sidebar with nodes -->
      <div class="sidebar w-64 bg-gray-100 p-4 border-r border-gray-300">
        <h3 class="text-lg font-bold mb-4 text-gray-800">Workflow Nodes</h3>
        <NodePalette @node-drag="onNodeDrag" />
      </div>

      <!-- Main canvas area -->
      <div class="canvas-container flex-1 relative bg-gray-50">
        <div class="controls absolute top-4 left-4 z-10 space-x-2">
          <button
            @click="runWorkflow"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-md"
          >
            Run Flow
          </button>
          <button
            @click="clearCanvas"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 shadow-md"
          >
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
      <div class="output-panel w-80 bg-white p-4 border-l border-gray-300">
        <h3 class="text-lg font-bold mb-4 text-gray-800">Execution Output</h3>
        <div
          class="output-content bg-gray-50 p-3 rounded border h-96 overflow-y-auto text-sm font-mono"
        >
          <pre class="whitespace-pre-wrap">{{ executionOutput }}</pre>
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
        type: 'default',
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

      executionOutput.value = 'Starting workflow execution...\n\n'

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
          '✓ Fetched 150 customer reviews from database\n  Sample: "Great product, highly recommend!"',
        'k-means':
          '✓ Applied K-means clustering (k=3)\n  Cluster 1: 45 reviews\n  Cluster 2: 67 reviews\n  Cluster 3: 38 reviews',
        'clusters-to-list':
          '✓ Converted clusters to customer segments\n  Segments: Happy, Neutral, Unhappy Customers',
        'customer-insights':
          '✓ Generated insights using AI agent\n  Tags: "price-sensitive", "quality-focused", "service-oriented"',
        'insights-to-sheets':
          '✓ Data exported to Google Sheets\n  File: customer-insights-2024.xlsx',
      }
      return simulations[nodeType] || '✓ Execution completed'
    }

    const clearCanvas = () => {
      nodes.value = []
      edges.value = []
      executionOutput.value =
        'Canvas cleared. Ready for new workflow...\n\nDrag nodes from the left panel to start building.'
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
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
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
  background-color: #f8fafc;
  background-image:
    linear-gradient(#e2e8f0 1px, transparent 1px),
    linear-gradient(90deg, #e2e8f0 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Custom node styles fallback */
.vue-flow__node-custom {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  min-width: 150px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.vue-flow__node-custom:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
</style>
