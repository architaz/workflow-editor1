<template>
  <div class="workflow-editor h-full flex">
    <!-- Sidebar with nodes -->
    <div class="sidebar w-64 bg-gray-100 p-4 border-r">
      <h3 class="text-lg font-bold mb-4">Workflow Nodes</h3>
      <NodePalette @node-drag="onNodeDrag" />
    </div>

    <!-- Main canvas area -->
    <div class="canvas-container flex-1 relative">
      <div class="controls absolute top-4 left-4 z-10 space-x-2">
        <button
          @click="runWorkflow"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Run Flow
        </button>
        <button
          @click="clearCanvas"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
    <div class="output-panel w-80 bg-gray-50 p-4 border-l">
      <h3 class="text-lg font-bold mb-4">Execution Output</h3>
      <div class="output-content bg-white p-3 rounded border h-96 overflow-y-auto">
        <pre>{{ executionOutput }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, markRaw } from 'vue'
import { VueFlow, Controls, MiniMap } from '@vue-flow/core'
import NodePalette from './NodePalette.vue'
import CustomNode from './CustomNode.vue'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'

export default {
  name: 'WorkflowEditor',
  components: {
    VueFlow,
    Controls,
    MiniMap,
    NodePalette,
  },
  setup() {
    const nodes = ref([])
    const edges = ref([])
    const executionOutput = ref('Ready to run workflow...')

    // Register custom node types
    const nodeTypes = {
      custom: markRaw(CustomNode)
    }

    // Node counter for unique IDs
    let nodeId = 0

    const onNodeDrag = (nodeType) => {
      // This will be handled when we implement drag and drop
    }

    const onDrop = (event) => {
      event.preventDefault()

      const nodeType = event.dataTransfer.getData('application/node-type')
      if (!nodeType) return

      // Get the position where the node was dropped
      const position = {
        x: event.clientX - 300, // Account for sidebar width
        y: event.clientY - 100,
      }

      // Create a new node using custom node type
      const newNode = {
        id: `${nodeType}-${nodeId++}`,
        type: 'custom',
        position,
        data: {
          label: getNodeLabel(nodeType),
          nodeType: nodeType,
        },
      }

      nodes.value.push(newNode)
    }

    const onDragOver = (event) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    }

    const onConnect = (params) => {
      edges.value.push({
        id: `edge-${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
        type: 'default',
      })
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
      executionOutput.value = 'Starting workflow execution...\n\n'

      // Simulate execution for each node
      nodes.value.forEach((node, index) => {
        setTimeout(() => {
          const output = simulateNodeExecution(node.data.nodeType)
          executionOutput.value += `${index + 1}. ${node.data.label}:\n${output}\n\n`
        }, index * 1000)
      })
    }

    const simulateNodeExecution = (nodeType) => {
      const simulations = {
        'get-reviews':
          '✓ Fetched 150 customer reviews from database\n  Sample: "Great product, highly recommend!"',
        'k-means':
          '✓ Applied K-means clustering (k=3)\n  Cluster 1: 45 reviews, Cluster 2: 67 reviews, Cluster 3: 38 reviews',
        'clusters-to-list':
          '✓ Converted clusters to customer segments\n  Segments: Happy Customers, Neutral Customers, Unhappy Customers',
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
      executionOutput.value = 'Canvas cleared. Ready for new workflow...'
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

<style scoped>
.workflow-editor {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.vue-flow-container {
  height: 100%;
  background-color: #f8fafc;
  background-image:
    linear-gradient(#e2e8f0 1px, transparent 1px),
    linear-gradient(90deg, #e2e8f0 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>