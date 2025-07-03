<template>
  <div class="custom-node group">
    <Handle 
      type="target" 
      :position="Position.Top" 
      class="handle-target" 
    />

    <div class="node-content">
      <div class="node-header">
        <div class="node-icon" :class="iconClass">
          {{ iconText }}
        </div>
        <div class="node-status">
          <div class="status-dot"></div>
        </div>
      </div>
      
      <div class="node-body">
        <div class="node-label">{{ data.label }}</div>
        <div class="node-type">{{ getNodeTypeLabel(data.nodeType) }}</div>
      </div>
      
      <!-- Progress bar (hidden by default, shown during execution) -->
      <div class="progress-container">
        <div class="progress-bar"></div>
      </div>
    </div>

    <Handle 
      type="source" 
      :position="Position.Bottom" 
      class="handle-source" 
    />
    
    <!-- Animated border -->
    <div class="animated-border"></div>
  </div>
</template>

<script>
import { Handle, Position } from '@vue-flow/core'

export default {
  name: 'CustomNode',
  components: { Handle },
  props: ['data'],
  setup(props) {
    const getIconInfo = (nodeType) => {
      const icons = {
        'get-reviews': { class: 'from-blue-500 to-blue-600', text: '📄' },
        'k-means': { class: 'from-green-500 to-green-600', text: '🔍' },
        'clusters-to-list': { class: 'from-yellow-500 to-yellow-600', text: '📊' },
        'customer-insights': { class: 'from-purple-500 to-purple-600', text: '🧠' },
        'insights-to-sheets': { class: 'from-red-500 to-red-600', text: '📈' },
      }
      return icons[nodeType] || { class: 'from-gray-500 to-gray-600', text: '⚙️' }
    }

    const getNodeTypeLabel = (nodeType) => {
      const labels = {
        'get-reviews': 'Data Source',
        'k-means': 'Algorithm',
        'clusters-to-list': 'Transformer',
        'customer-insights': 'AI Agent',
        'insights-to-sheets': 'Export',
      }
      return labels[nodeType] || 'Node'
    }

    const iconInfo = getIconInfo(props.data.nodeType)

    return {
      Position,
      iconClass: `bg-gradient-to-br ${iconInfo.class}`,
      iconText: iconInfo.text,
      getNodeTypeLabel,
    }
  },
}
</script>

<style scoped>
.custom-node {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 0;
  min-width: 200px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.custom-node:hover {
  border-color: #3b82f6;
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05),
    0 0 0 3px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.custom-node.selected {
  border-color: #3b82f6;
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05),
    0 0 0 3px rgba(59, 130, 246, 0.2);
}

.node-content {
  position: relative;
  z-index: 1;
}

.node-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 8px 16px;
}

.node-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.group:hover .node-icon {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.node-status {
  display: flex;
  align-items: center;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.node-body {
  padding: 0 16px 16px 16px;
}

.node-label {
  font-weight: 600;
  font-size: 14px;
  color: #1e293b;
  margin-bottom: 4px;
  line-height: 1.3;
}

.node-type {
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.progress-container {
  position: relative;
  height: 2px;
  background: #e2e8f0;
  margin-top: 12px;
  border-radius: 1px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #6366f1);
  width: 0%;
  transition: width 0.3s ease;
  border-radius: 1px;
}

.animated-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 16px;
  background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.custom-node:hover .animated-border {
  opacity: 1;
  animation: borderRotate 3s linear infinite;
}

.handle-target,
.handle-source {
  background: #3b82f6;
  border: 3px solid #ffffff;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.handle-target:hover,
.handle-source:hover {
  background: #1d4ed8;
  transform: scale(1.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.handle-target {
  top: -6px;
}

.handle-source {
  bottom: -6px;
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes borderRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Execution state styles */
.custom-node.executing {
  border-color: #f59e0b;
  animation: glow 1.5s ease-in-out infinite alternate;
}
</style>