<template>
  <div id="app" class="workflow-container">
    <div class="workflow-editor h-screen w-screen flex">
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
          :style="{ backgroundColor: getN8nNodeColor(node.type) }"
          :title="node.label">
        <div v-html="getN8nNodeIcon(node.type)" class="w-4 h-4"></div>
      </div>
    </div>
  </div>
</div>

  <!-- Main canvas area -->
      <div class="canvas-container flex-1 relative">
        <!-- @drop = "onDrop"
        @dragover.prevent = "onDragOver"> -->
        <!-- Controls moved to top center -->
        <div class="controls absolute top-6 left-1/2 transform -translate-x-1/2 z-10 flex gap-5 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg border border-white/20">
          <button
            @click="runWorkflow"
            class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium flex items-center justify-center gap-2 min-w-[120px]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
            </svg>
            Run Flow
          </button>
          <button
            @click="clearCanvas"
            class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium flex items-center justify-center gap-2 min-w-[140px]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Canvas
          </button>
        </div>

        <!-- Vue Flow Canvas -->
        <VueFlow
          v-model:nodes="nodes"
          v-model:edges="edges"
          class="vue-flow-container"
          @drop="onDrop"
          @dragover="onDragOver"
          @dragleave="onDragLeave"
          @connect="onConnect"
          @node-drag-stop="onNodeDragStop"
          :node-types="nodeTypes"
          :nodes-draggable="!isExecuting"
          :edges-updatable="!isExecuting"
        >
          <template #node-custom="nodeProps">
            <CustomNode
              :ref="(el) => { if (el) nodeRefs[nodeProps.id] = el }"
              :data="nodeProps.data"
              :selected="nodeProps.selected"
              :initial-config="nodeProps.data.config || {}"
              @update:config="updateNodeConfig(nodeProps.id, $event)"
            />
          </template>
          
          <Controls />
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

<script setup>
import { ref, markRaw, onMounted, provide, nextTick } from 'vue'
import { VueFlow } from '@vue-flow/core'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import NodePalette from './components/NodePalette.vue'
import CustomNode from './components/CustomNode.vue'
import { getNodeConfig, getAllNodeTypes } from '@/utils/nodeRegistry'
import { getN8nNodeIcon, getN8nNodeColor } from '@/utils/n8nIcons.js'

const nodes = ref([])
const edges = ref([])
const executionOutput = ref(
  'Ready to run workflow...\n\nDrag nodes from the left panel to the canvas to start building your workflow.\n\n📊 Available Node Types:\n• Get Reviews - Fetch customer data\n• K-means - Apply clustering\n• Clusters to List - Transform data\n• Customer Insights - AI analysis\n• Export to Sheets - Save results\n• HTTP Request - API calls\n• Google Sheets - Spreadsheet ops\n• Slack - Send notifications\n• Email - Send messages\n• Webhook - Receive data',
)
const isExecuting = ref(false)
const nodeRefs = ref({})

// Register custom node types
const nodeTypes = {
  custom: markRaw(CustomNode),
}

// Node counter for unique IDs
let nodeId = 0

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

const onNodeDrag = (nodeType) => {
  console.log('Node drag started:', nodeType)
}

const onDrop = (event) => {
  event.preventDefault()
  event.stopPropagation()
  
  const nodeType = event.dataTransfer.getData('application/node-type') || 
                  event.dataTransfer.getData('text/plain')
  
  console.log('🎯 Dropping node type:', nodeType)
  
  if (!nodeType) {
    console.error('❌ No node type found in drag data')
    return
  }

  // Get the VueFlow instance bounds correctly
  const vueFlowElement = event.currentTarget.querySelector('.vue-flow__pane')
  const bounds = vueFlowElement ? 
    vueFlowElement.getBoundingClientRect() : 
    event.currentTarget.getBoundingClientRect()
  
  const position = {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  }
  
  console.log('📍 Drop position:', position)

  const nodeConfig = getNodeConfig(nodeType)
  if (!nodeConfig) {
    console.error('❌ No config found for node type:', nodeType)
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

  console.log('✅ Creating new node:', newNode)
  
  nodes.value = [...nodes.value, newNode]
  console.log('📊 Total nodes after add:', nodes.value.length)
  
  // Force Vue Flow to update
  nextTick(() => {
    console.log('🔄 Vue Flow updated, checking DOM nodes...')
    const domNodes = document.querySelectorAll('.vue-flow__node-custom')
    console.log('🎯 DOM nodes found:', domNodes.length)
  })
}

const onDragOver = (event) => {
  event.preventDefault()
  event.stopPropagation()
  event.dataTransfer.dropEffect = 'move'
  event.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)'
}

const onDragLeave = (event) => {
  event.currentTarget.style.backgroundColor = ''
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
    'http-request': 'HTTP Request',
    'google-sheets': 'Google Sheets',
    'slack': 'Slack Notifier',
    'email-send': 'Email Sender',
    'webhook': 'Webhook Receiver',
  }
  return labels[nodeType] || nodeType
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
    // First try to use the node's own execute function (for custom nodes)
    if (nodeRefs.value[nodeId] && typeof nodeRefs.value[nodeId].execute === 'function') {
      const result = await nodeRefs.value[nodeId].execute()
      executionOutput.value += `✅ ${node.data.label} executed successfully\n`
      executionOutput.value += `📊 Result: ${JSON.stringify(result, null, 2)}\n\n`
      return result
    }
    
    // Fallback: Direct execution using nodeRegistry
    const { executeNode } = await import('@/utils/nodeRegistry')
    
    const nodeInstance = {
      nodeType,
      parameters: nodeConfig
    }
    
    const result = await executeNode(nodeInstance, null, getCredentialsForNode(nodeType))
    executionOutput.value += `✅ ${node.data.label} executed successfully\n`
    executionOutput.value += `📊 Result: ${JSON.stringify(result, null, 2)}\n\n`
    return result
    
  } catch (error) {
    console.error(`Execution error for ${nodeType}:`, error)
    executionOutput.value += `❌ Error executing ${node.data.label}: ${error.message}\n\n`
    
    // Final fallback: Use simulation
    try {
      const result = simulateNodeExecution(nodeType)
      executionOutput.value += `📝 Fallback simulation: ${result}\n\n`
      return { success: true, simulation: true, data: result }
    } catch (simError) {
      throw error
    }
  }
}

const runWorkflow = async () => {
  if (nodes.value.length === 0) {
    executionOutput.value = 'No nodes to execute. Please add some nodes to the canvas first.'
    return
  }

  // Debug refs
  debugNodeRefs()

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

const checkN8nAvailability = async () => {
  try {
    const { nodeLoader } = await import('@/lib/n8n-nodes.js')
    const availability = await nodeLoader.checkN8nAvailability()
    console.log('n8n wrapper availability:', availability)
    executionOutput.value += `\n\n🔍 Node wrapper status: ${JSON.stringify(availability, null, 2)}\n\n`
  } catch (error) {
    console.warn('Could not check node availability:', error)
  }
}

const debugNodeRefs = () => {
  console.log('Current node refs:', Object.keys(nodeRefs.value))
  Object.entries(nodeRefs.value).forEach(([id, ref]) => {
    console.log(`Node ${id}:`, {
      hasExecute: typeof ref?.execute === 'function',
      nodeType: ref?.nodeType,
      ref: ref
    })
  })
}

const debugNodes = () => {
  console.log('Nodes array:', nodes.value)
  console.log('Node types:', nodeTypes)
  setTimeout(() => {
    const nodeElements = document.querySelectorAll('.vue-flow__node-custom')
    console.log('Found node elements:', nodeElements.length)
    nodeElements.forEach((el, i) => {
      console.log(`Node ${i}:`, {
        display: getComputedStyle(el).display,
        visibility: getComputedStyle(el).visibility,
        opacity: getComputedStyle(el).opacity,
        position: getComputedStyle(el).position
      })
    })
  }, 1000)
}

onMounted(() => {
  console.log('Available node types:', nodeTypes.value)
  console.log('CustomNode component:', CustomNode)
  checkN8nAvailability()
  debugNodes()
})

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
    'http-request': 
      '✅ Made GET request to API endpoint\n  ⏱️ Response time: 320ms\n  📦 Received 1.2KB of data\n  🔗 Status: 200 OK',
    'google-sheets': 
      '📊 Updated Google Sheet "Customer Data"\n  ✏️ Wrote 45 rows of insights data\n  🔗 Sheet: docs.google.com/spreadsheets/...',
    'slack': 
      '💬 Sent message to #customer-insights channel\n  👥 Notified 15 team members\n  📝 Message: "New customer insights ready for review!"',
    'email-send': 
      '✉️ Sent email to marketing@company.com\n  📧 Subject: "Weekly Customer Insights Report"\n  📎 Attached insights summary (PDF)',
    'webhook': 
      '🪝 Webhook endpoint active at /customer-data\n  🔄 Last received data 2 minutes ago\n  📥 Processed 3 incoming requests today'
  }
  return simulations[nodeType] || '✅ Execution completed'
}

const clearCanvas = () => {
  nodes.value = []
  edges.value = []
  nodeRefs.value = {}
  executionOutput.value =
    '🧹 Canvas cleared. Ready for new workflow...\n\nDrag nodes from the left panel to start building.\n\n💡 Pro tip: Connect nodes by dragging from output handles (bottom) to input handles (top)'
}

const sidebarCollapsed = ref(false)

const miniNodeTypes = [
  { type: 'get-reviews', label: 'Get Reviews' },
  { type: 'k-means', label: 'Apply K-means' },
  { type: 'clusters-to-list', label: 'Clusters to List' },
  { type: 'customer-insights', label: 'Customer Insights' },
  { type: 'insights-to-sheets', label: 'Export to Sheets' },
  { type: 'http-request', label: 'HTTP Request' },
  { type: 'google-sheets', label: 'Google Sheets' },
  { type: 'slack', label: 'Slack' },
  { type: 'email-send', label: 'Email' },
  { type: 'webhook', label: 'Webhook' }
]

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const onNodeDragMini = (event, nodeType) => {
  event.dataTransfer.setData('application/node-type', nodeType)
  event.dataTransfer.effectAllowed = 'move'
}

const onNodeDragStop = (event) => {
  console.log('Node drag stopped:', event)
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
  width: 100%;
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

.sidebar {
  position: relative;
  overflow: hidden;
}

.sidebar button {
  z-index: 30;
}

.canvas-container {
  position: relative;
}

.vue-flow {
  width: 100% !important;
  height: 100% !important;
}
.vue-flow__pane {
  cursor: default;
}
:deep(.vue-flow__node-custom) {
  background: white !important;
  border: 2px solid #e2e8f0 !important;
  border-radius: 12px !important;
  padding: 16px !important;
  min-width: 180px !important;
  min-height: 80px !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
  opacity: 1 !important;
  visibility: visible !important;
  display: block !important;
  position: relative !important;
  z-index: 10 !important;
}

:deep(.vue-flow__node) {
  opacity: 1 !important;
  visibility: visible !important;
  display: block !important;
}
</style>