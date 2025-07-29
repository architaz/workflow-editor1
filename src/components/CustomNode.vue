<template>
  <div class="custom-node group visible-node" :class="{ executing: isExecuting, selected: isSelected }">
    <Handle type="target" :position="Position.Left" class="handle-target" />

    <!-- Background gradient overlay -->
    <div class="node-backdrop"></div>

    <div class="node-content">
      <div class="node-status">
        <div class="status-dot" :class="statusClass"></div>
        <div class="status-ring"></div>
      </div>
      
      <div class="node-icon-container">
        <div class="node-icon" :style="{ backgroundColor: iconColor }">
          <div v-html="iconSvg" class="w-6 h-6 icon-white"></div>
        </div>
        <div class="icon-glow shadow-lg"></div>
      </div>

      <!-- Enhanced progress bar -->
      <div class="progress-container" v-if="showProgress">
        <div class="progress-track">
          <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
          <div class="progress-shimmer"></div>
        </div>
      </div>
    </div>

    <Handle type="source" :position="Position.Right" class="handle-source" />

    <!-- Node label beneath the node -->
    <div class="node-label-external">
      {{ data.label }}
    </div>

    <!-- Enhanced animated border -->
    <div class="animated-border"></div>
    <div class="node-shadow"></div>
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
import { ref, computed, onMounted } from 'vue'
import { getN8nNodeIcon, getN8nNodeColor } from '@/utils/n8nIcons.js'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

const isExecuting = ref(false)
const progressPercent = ref(0)
const showProgress = computed(() => isExecuting.value || props.data.showProgress)

const getNodeTypeLabel = (nodeType) => {
  const labels = {
    'get-reviews': 'Data Source',
    'k-means': 'ML Algorithm',
    'clusters-to-list': 'Transformer',
    'customer-insights': 'AI Agent',
    'insights-to-sheets': 'Export',
    'http-request': 'API Connector',
    'google-sheets': 'Spreadsheet',
    'slack': 'Notification',
    'email-send': 'Communication',
    'webhook': 'Data Receiver',
  }
  return labels[nodeType] || 'Processing Node'
}

const isSelected = computed(() => props.selected)

const statusClass = computed(() => {
  if (isExecuting.value) return 'status-executing'
  if (props.data.status === 'error') return 'status-error'
  if (props.data.status === 'completed') return 'status-completed'
  return 'status-idle'
})

// Get icon info for the current node
const iconSvg = computed(() => getN8nNodeIcon(props.data.nodeType))
const iconColor = computed(() => getN8nNodeColor(props.data.nodeType))

// Simulate execution progress
const simulateExecution = () => {
  isExecuting.value = true
  progressPercent.value = 0

  const interval = setInterval(() => {
    progressPercent.value += Math.random() * 15
    if (progressPercent.value >= 100) {
      progressPercent.value = 100
      clearInterval(interval)
      setTimeout(() => {
        isExecuting.value = false
      }, 1000)
    }
  }, 200)
}

onMounted(() => {
  // Auto-trigger execution demo after 3 seconds
  setTimeout(() => {
    if (Math.random() > 0.2) {
      simulateExecution()
    }
  }, 1600)
})

const execute = async () => {
  const nodeType = props.data.nodeType
  const nodeConfig = props.data.config

  try {
    // Get node definition from registry
    const { executeNode } = await import('@/utils/nodeRegistry')
    const nodeInstance = {
      nodeType,
      parameters: nodeConfig
    }
    const result = await executeNode(nodeInstance)
    return result
  } catch (error) {
    console.error('Node execution failed:', error)
    throw error
  }
}

// Use defineExpose to expose the execute function
defineExpose({ 
  execute,
  nodeType: props.data.nodeType,
  config: props.data.config 
})
</script>

<style scoped>
/* Force visibility - CRITICAL for nodes to show */
.visible-node {
  opacity: 1 !important;
  visibility: visible !important;
  display: block !important;
  position: relative !important;
  z-index: 1 !important;
  pointer-events: auto !important;
}

.custom-node {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 25% 10% 10% 25%;
  padding: 10px;
  min-width: 100px;
  max-width: 100px;
  width: 100px;
  height: 75px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible;
  transform-origin: center;
  visibility: visible !important;
  display: block !important;
}

.node-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(248, 250, 252, 0.05) 50%,
    rgba(241, 245, 249, 0.1) 100%
  );
  z-index: 0;
}

.custom-node:hover {
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(59, 130, 246, 0.1),
    0 0 20px rgba(59, 130, 246, 0.15);
  transform: translateY(-4px) scale(1.02);
}

.custom-node.selected {
  border-color: rgba(59, 130, 246, 0.8);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 2px rgba(59, 130, 246, 0.3),
    0 0 30px rgba(59, 130, 246, 0.2);
  transform: translateY(-2px) scale(1.01);
}

.custom-node.executing {
  border-color: rgba(245, 158, 11, 0.8);
  animation: executeGlow 2s ease-in-out infinite alternate;
  transform: scale(1.15);
  width: 115px;
  height: 86px;
}

.node-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-status {
  position: absolute;
  top: 4px;
  left: 4px;
  z-index: 10;
}

.node-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.node-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
}

.icon-white {
  color: white !important;
  fill: white !important;
}

.icon-white svg {
  color: white !important;
  fill: white !important;
}

.icon-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 8px;
  background: inherit;
  filter: blur(8px);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.group:hover .node-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow:
    0 8px 25px -5px rgba(0, 0, 0, 0.15),
    0 4px 6px -2px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.group:hover .icon-glow {
  opacity: 0.3;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.status-ring {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.status-idle {
  background: #64748b;
}

.status-completed {
  background: #10b981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
}

.status-executing {
  background: #f59e0b;
  animation: statusPulse 1.5s ease-in-out infinite;
}

.status-error {
  background: #ef4444;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
}

.progress-container {
  position: absolute;
  bottom: 2px;
  left: 4px;
  right: 4px;
  padding: 0;
  margin: 0;
}

.progress-track {
  position: relative;
  height: 2px;
  background: rgba(226, 232, 240, 0.8);
  border-radius: 1px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6);
  background-size: 200% 100%;
  animation: progressShimmer 2s linear infinite;
  border-radius: 1px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: shimmer 1.5s ease-in-out infinite;
}

.node-label-external {
  position: absolute;
  top: 89%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.95);
  padding: 4px 8px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  z-index: 100000;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 1px solid rgba(226, 232, 240, 0.5);
  pointer-events: none;  /* Add this line */
}

.animated-border {
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border-radius: 25% 10% 10% 25%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(59, 130, 246, 0.1),
    transparent,
    rgba(139, 92, 246, 0.1),
    transparent
  );
  background-size: 400% 400%;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.custom-node:hover .animated-border {
  opacity: 1;
  animation: gradientShift 3s ease-in-out infinite;
}

.node-shadow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 25% 10% 10% 25%;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -2;
}

.custom-node:hover .node-shadow {
  opacity: 1;
}

.custom-node:hover .node-label-external {
  background: rgba(255, 255, 255, 0.263);
  color: #1e293b;
  font-weight: 750;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateX(-50%) translateY(-2px);
}

/* Enhanced handle styling */
.handle-target,
.handle-source {
  background: linear-gradient(135deg, #3b82f6, #6366f1) !important;
  border: 3px solid rgba(255, 255, 255, 0.9) !important;
  width: 14px !important;
  height: 14px !important;
  border-radius: 50% !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 0 0 2px rgba(59, 130, 246, 0.2) !important;
  opacity: 1 !important;
  visibility: visible !important;
  z-index: 100 !important;
}

.handle-target:hover,
.handle-source:hover {
  background: linear-gradient(135deg, #1d4ed8, #4f46e5) !important;
  transform: scale(1.3) !important;
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.15),
    0 0 0 4px rgba(59, 130, 246, 0.3) !important;
  z-index: 200 !important;
}

.handle-target {
  left: -7px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.handle-source {
  right: -7px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  left: auto !important;
}

:deep(.vue-flow__handle) {
  background: #3b82f6 !important;
  border: 2px solid #ffffff !important;
  width: 14px !important;
  height: 14px !important;
  border-radius: 50% !important;
  opacity: 1 !important;
  visibility: visible !important;
  z-index: 1000 !important;
  transition: all 0.3s ease !important;
}

:deep(.vue-flow__handle:hover) {
  background: #1d4ed8 !important;
  transform: scale(1.3) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
}

/* Animations */
@keyframes statusPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

@keyframes executeGlow {
  0% {
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04),
      0 0 0 1px rgba(245, 158, 11, 0.3),
      0 0 20px rgba(245, 158, 11, 0.2);
  }
  100% {
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04),
      0 0 0 2px rgba(245, 158, 11, 0.5),
      0 0 40px rgba(245, 158, 11, 0.4);
  }
}

@keyframes progressShimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .custom-node {
    background: rgba(15, 23, 42, 0.95);
    border-color: rgba(51, 65, 85, 0.8);
  }

  .node-backdrop {
    background: linear-gradient(
      135deg,
      rgba(15, 23, 42, 0.1) 0%,
      rgba(30, 41, 59, 0.05) 50%,
      rgba(51, 65, 85, 0.1) 100%
    );
  }

  .node-label-external {
    color: #f1f5f9;
    background: rgba(15, 23, 42, 0.95);
  }

  .progress-track {
    background: rgba(51, 65, 85, 0.8);
  }
}
</style>