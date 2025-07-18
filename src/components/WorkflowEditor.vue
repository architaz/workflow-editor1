<template>
  <div class="workflow-editor h-full flex">
    <!-- Sidebar with nodes -->
    <div class="sidebar transition-all duration-300 ease-in-out bg-gradient-to-br from-slate-900 to-slate-800 border-r border-slate-700/50 shadow-xl" 
        :class="sidebarCollapsed ? 'w-16' : 'w-72'">
  
      <!-- Collapse toggle button -->
      <button @click="toggleSidebar" 
              class="absolute top-8 right-1 z-20 p-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
        <svg class="w-6 h-6 transition-transform duration-200" 
            :class="sidebarCollapsed ? 'rotate-180' : ''"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <!-- Full sidebar content -->
      <div class="h-full flex flex-col" :class="sidebarCollapsed ? 'hidden' : ''">
        <div class="p-6 pb-4 flex-shrink-0">
          <h3 class="text-xl font-bold text-white mb-2">Workflow Nodes</h3>
          <p class="text-slate-400 text-sm">Drag and drop to build your workflow</p>
        </div>
        <div class="flex-1 px-6 pb-6">
          <NodePalette @node-drag="onNodeDrag" />
        </div>
      </div>
      
      <!-- Collapsed state mini icons -->
      <div v-if="sidebarCollapsed" class="p-4 pt-16">
        <div class="flex flex-col gap-3">
          <div v-for="node in miniNodeTypes" :key="node.type"
              :draggable="true"
              @dragstart="onNodeDragMini($event, node.type)"
              class="w-8 h-8 rounded-lg cursor-move hover:scale-110 transition-transform flex items-center justify-center text-white text-sm"
              :class="node.bgClass"
              :title="node.label">
            {{ node.icon }}
          </div>
        </div>
      </div>
    </div>

    <!-- Main canvas area -->
    <div class="canvas-container flex-1 relative">
      <div class="controls absolute top-6 left-1/2 transform -translate-x-1/2 z-10 flex gap-5 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg border border-white/20">
        <button 
          @click="runWorkflow" 
          class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium flex items-center justify-center gap-2 min-w-[120px]">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
          </svg>
          Run Flow
        </button>
        <button
          @click="clearCanvas"
          class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium flex items-center justify-center gap-2 min-w-[140px]">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        @node-drag-stop="onNodeDragStop"
        :node-types="nodeTypes"
        :nodes-draggable="!isExecuting"
        :edges-updatable="!isExecuting"
      >
      <template #node-custom="nodeProps">
        <component
          :is="nodeComponents[nodeProps.id]"
          :ref="(el) => nodeRefs[nodeProps.id] = el"
          :selected="nodeProps.selected"
          :initial-config="nodeProps.data.config || {}"
          @update:config="updateNodeConfig(nodeProps.id, $event)"
        />
      </template>
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
</template>

<script>
import { ref, markRaw, onMounted, provide } from 'vue'
import { VueFlow } from '@vue-flow/core'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import NodePalette from './components/NodePalette.vue'
import CustomNode from './components/CustomNode.vue'
import { getNodeConfig, getAllNodeTypes } from '@/utils/nodeRegistry'
import { n8nNodes } from '@/lib/n8n-nodes.js'
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
    const isExecuting = ref(false)
    const nodeRefs = ref({})
    const nodeComponents = ref({})
    const sidebarCollapsed = ref(false)

    // Provide credentials to all nodes
    provide('credentials', {
      slack: { token: import.meta.env.VITE_SLACK_TOKEN },
      google: { 
        clientEmail: import.meta.env.VITE_GOOGLE_CLIENT_EMAIL,
        privateKey: import.meta.env.VITE_GOOGLE_PRIVATE_KEY 
      },
      smtp: {
        user: import.meta.env.VITE_SMTP_USER,
        password: import.meta.env.VITE_SMTP_PASSWORD
      }
    })
    // Register custom node types
    const nodeTypes = {
      custom: markRaw(CustomNode)
    }
    const miniNodeTypes = [
      { type: 'get-reviews', icon: '📄', bgClass: 'bg-blue-500 hover:bg-blue-600', label: 'Get Reviews' },
      { type: 'k-means', icon: '🔍', bgClass: 'bg-green-500 hover:bg-green-600', label: 'Apply K-means' },
      { type: 'clusters-to-list', icon: '📊', bgClass: 'bg-yellow-500 hover:bg-yellow-600', label: 'Clusters to List' },
      { type: 'customer-insights', icon: '🧠', bgClass: 'bg-purple-500 hover:bg-purple-600', label: 'Customer Insights' },
      { type: 'insights-to-sheets', icon: '📈', bgClass: 'bg-red-500 hover:bg-red-600', label: 'Export to Sheets' },
      { type: 'http-request', icon: '🌐', bgClass: 'bg-indigo-500 hover:bg-indigo-600', label: 'HTTP Request' },
      { type: 'google-sheets', icon: '📊', bgClass: 'bg-emerald-500 hover:bg-emerald-600', label: 'Google Sheets' },
      { type: 'slack', icon: '💬', bgClass: 'bg-purple-500 hover:bg-purple-600', label: 'Slack' },
      { type: 'email-send', icon: '✉️', bgClass: 'bg-cyan-500 hover:bg-cyan-600', label: 'Email' },
      { type: 'webhook', icon: '🪝', bgClass: 'bg-orange-500 hover:bg-orange-600', label: 'Webhook' }
    ]   

    // Node counter for unique IDs
    let nodeId = 0

    const onNodeDrag = (nodeType) => {
      // This will be handled when we implement drag and drop
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

      const nodeConfig = getNodeConfig(nodeType)
      if (!nodeConfig) {
        console.error('No config found for node type:', nodeType)
        return
      }

      const newNode = {
        id: `${nodeType}-${nodeId++}`,
        type: 'custom',
        position,
        data: {
          label: getNodeLabel(nodeType),
          nodeType,
          config: { ...nodeConfig.defaults },
          description: nodeConfig.description
        },
      }

      nodeComponents.value[newNode.id] = { type: nodeType }
      nodes.value = [...nodes.value, newNode]
    }

    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value
    }

    const onNodeDragMini = (event, nodeType) => {
        event.dataTransfer.setData('application/node-type', nodeType)
        event.dataTransfer.effectAllowed = 'move'
    }

    const updateNodeConfig = (nodeId, config) => {
        nodes.value = nodes.value.map(node => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                config
              }
            }
          }
          return node
        })
    }

    const handleNodeExecute = async (nodeId) => {
        const node = nodes.value.find(n => n.id === nodeId)
        if (!node) return
        
        const nodeType = node.data.nodeType
        const nodeConfig = node.data.config
        
        try {
          const n8nNodeTypes = ['http-request', 'google-sheets', 'slack', 'email-send', 'webhook']
          
          if (n8nNodeTypes.includes(nodeType)) {
            const n8nNode = await n8nNodes.createNode(nodeType, {
              parameters: nodeConfig,
              credentials: getCredentialsForNode(nodeType)
            })
            
            const result = await n8nNode.execute()
            executionOutput.value += `✅ ${node.data.label} executed successfully\n`
            executionOutput.value += `📊 Result: ${JSON.stringify(result, null, 2)}\n\n`
            return result
          } else {
            if (nodeRefs.value[nodeId]) {
              const result = await nodeRefs.value[nodeId].execute()
              executionOutput.value += `✅ ${node.data.label} executed successfully\n\n`
              return result
            }
          }
        } catch (error) {
          executionOutput.value += `❌ Error executing ${node.data.label}: ${error.message}\n\n`
          throw error
        }
    }

    const getCredentialsForNode = (nodeType) => {
        const credentialsMap = {
          'slack': { token: import.meta.env.VITE_SLACK_TOKEN },
          'google-sheets': { 
            clientEmail: import.meta.env.VITE_GOOGLE_CLIENT_EMAIL,
            privateKey: import.meta.env.VITE_GOOGLE_PRIVATE_KEY,
            accessToken: import.meta.env.VITE_GOOGLE_ACCESS_TOKEN
          },
          'email-send': {
            user: import.meta.env.VITE_SMTP_USER,
            password: import.meta.env.VITE_SMTP_PASSWORD,
            host: import.meta.env.VITE_SMTP_HOST || 'smtp.gmail.com',
            port: import.meta.env.VITE_SMTP_PORT || 587
          },
          'http-request': {},
          'webhook': {}
        }
        
        return credentialsMap[nodeType] || {}
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

    const runWorkflow = async () => {
      if (nodes.value.length === 0) {
        executionOutput.value = 'No nodes to execute. Please add some nodes to the canvas first.'
        return
      }

      isExecuting.value = true
      executionOutput.value = '🚀 Starting workflow execution...\n\n'

      try {
        const sortedNodes = [...nodes.value]
        
        for (let i = 0; i < sortedNodes.length; i++) {
          const node = sortedNodes[i]
          executionOutput.value += `📋 Executing: ${node.data.label}\n`
          
          try {
            await handleNodeExecute(node.id)
            if (i < sortedNodes.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 1000))
            }
          } catch (error) {
            executionOutput.value += `❌ Workflow stopped due to error in ${node.data.label}\n`
            break
          }
        }
        
        executionOutput.value += '✅ Workflow execution completed!\n'
      } catch (error) {
        executionOutput.value += `❌ Workflow execution failed: ${error.message}\n`
      } finally {
        isExecuting.value = false
      }
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
      isExecuting,
      nodeRefs,
      nodeComponents,
      simulateNodeExecution,
      sidebarCollapsed,
      miniNodeTypes,
      toggleSidebar,
      onNodeDragMini,
      updateNodeConfig,
      handleNodeExecute,
      getCredentialsForNode,
      getNodeLabel
    }
  },
}
// Save workflow
const saveWorkflow = () => {
  const workflow = {
    nodes: nodes.value,
    edges: edges.value
  }
  localStorage.setItem('workflow', JSON.stringify(workflow))
  alert('Workflow saved!')
}

// Load workflow
const loadWorkflow = () => {
  const saved = localStorage.getItem('workflow')
  if (saved) {
    const workflow = JSON.parse(saved)
    nodes.value = workflow.nodes
    edges.value = workflow.edges
    alert('Workflow loaded!')
  }
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