<template>
  <div class="custom-node group" :class="{ executing: isExecuting, selected: isSelected }">
    <Handle type="target" :position="Position.Top" class="handle-target" />

    <!-- Background gradient overlay -->
    <div class="node-backdrop"></div>

    <div class="node-content">
      <div class="node-header">
        <div class="node-icon-container">
          <div class="node-icon" :class="iconClass">
            {{ iconText }}
          </div>
          <div class="icon-glow"></div>
        </div>
        <div class="node-status">
          <div class="status-dot" :class="statusClass"></div>
          <div class="status-ring"></div>
        </div>
      </div>

      <div class="node-body">
        <div class="node-label">{{ data.label }}</div>
        <div class="node-type">{{ getNodeTypeLabel(data.nodeType) }}</div>
        <div class="node-description" v-if="data.description">{{ data.description }}</div>
      </div>

      <!-- Enhanced progress bar -->
      <div class="progress-container" v-if="showProgress">
        <div class="progress-track">
          <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
          <div class="progress-shimmer"></div>
        </div>
        <div class="progress-text">{{ progressPercent }}%</div>
      </div>

      <!-- Node metrics/stats -->
      <div class="node-metrics" v-if="data.metrics">
        <div class="metric" v-for="(value, key) in data.metrics" :key="key">
          <span class="metric-label">{{ key }}</span>
          <span class="metric-value">{{ value }}</span>
        </div>
      </div>
    </div>

    <Handle type="source" :position="Position.Bottom" class="handle-source" />

    <!-- Enhanced animated border -->
    <div class="animated-border"></div>
    <div class="node-shadow"></div>
  </div>
</template>

<script>
import { Handle, Position } from '@vue-flow/core'
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'CustomNode',
  components: { Handle },
  props: {
    data: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const isExecuting = ref(false)
    const progressPercent = ref(0)
    const showProgress = ref(false)

    const getIconInfo = (nodeType) => {
      const icons = {
        'get-reviews': {
          class: 'from-blue-500 via-blue-600 to-indigo-600',
          text: '📊',
          glow: 'shadow-blue-500/50',
        },
        'k-means': {
          class: 'from-emerald-500 via-green-600 to-teal-600',
          text: '🔍',
          glow: 'shadow-green-500/50',
        },
        'clusters-to-list': {
          class: 'from-amber-500 via-yellow-600 to-orange-600',
          text: '📈',
          glowL: 'shadow-yellow-500/50',
        },
        'customer-insights': {
          class: 'from-purple-500 via-violet-600 to-indigo-600',
          text: '🧠',
          glow: 'shadow-purple-500/50',
        },
        'insights-to-sheets': {
          class: 'from-rose-500 via-red-600 to-pink-600',
          text: '📋',
          glow: 'shadow-red-500/50',
        },
        'web-scraper': {
          class: 'from-indigo-500 via-indigo-600 to-purple-600',
          text: '🕷️',
          glow: 'shadow-indigo-500/50',
        },
        'slack-notifier': {
          class: 'from-cyan-500 via-cyan-600 to-blue-600',
          text: '💬',
          glow: 'shadow-cyan-500/50',
        },
        'http-api': {
          class: 'from-orange-500 via-orange-600 to-red-600',
          text: '🌐',
          glow: 'shadow-orange-500/50',
        },
        'email-sender': {
          class: 'from-pink-500 via-pink-600 to-rose-600',
          text: '✉️',
          glow: 'shadow-pink-500/50',
        },
        'data-validator': {
          class: 'from-teal-500 via-teal-600 to-cyan-600',
          text: '✅',
          glow: 'shadow-teal-500/50',
        },
      }
      return (
        icons[nodeType] || {
          class: 'from-slate-500 via-gray-600 to-zinc-600',
          text: '⚙️',
          glow: 'shadow-gray-500/50',
        }
      )
    }

    const getNodeTypeLabel = (nodeType) => {
      const labels = {
        'get-reviews': 'Data Source',
        'k-means': 'ML Algorithm',
        'clusters-to-list': 'Transformer',
        'customer-insights': 'AI Agent',
        'insights-to-sheets': 'Export',
        'web-scraper': 'Data Extractor',
        'slack-notifier': 'Notification',
        'http-api': 'API Connector',
        'email-sender': 'Communication',
        'data-validator': 'Data Quality',
      }
      return labels[nodeType] || 'Processing Node'
    }

    const iconInfo = getIconInfo(props.data.nodeType)

    const isSelected = computed(() => props.selected)

    const statusClass = computed(() => {
      if (isExecuting.value) return 'status-executing'
      if (props.data.status === 'error') return 'status-error'
      if (props.data.status === 'completed') return 'status-completed'
      return 'status-idle'
    })

    // Simulate execution progress
    const simulateExecution = () => {
      isExecuting.value = true
      showProgress.value = true
      progressPercent.value = 0

      const interval = setInterval(() => {
        progressPercent.value += Math.random() * 15
        if (progressPercent.value >= 100) {
          progressPercent.value = 100
          clearInterval(interval)
          setTimeout(() => {
            isExecuting.value = false
            showProgress.value = false
          }, 1000)
        }
      }, 200)
    }

    onMounted(() => {
      // Auto-trigger execution demo after 3 seconds
      setTimeout(() => {
        if (Math.random() > 0.7) {
          simulateExecution()
        }
      }, 3000)
    })

    return {
      Position,
      iconClass: `bg-gradient-to-br ${iconInfo.class}`,
      iconText: iconInfo.text,
      iconGlow: iconInfo.glow,
      getNodeTypeLabel,
      isExecuting,
      isSelected,
      statusClass,
      progressPercent,
      showProgress,
      simulateExecution,
    }
  },
}
</script>

<style scoped>
.custom-node {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 20px;
  padding: 0;
  min-width: 220px;
  max-width: 300px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  transform-origin: center;
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
}

.node-content {
  position: relative;
  z-index: 1;
}

.node-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 12px 20px;
}

.node-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
}

.icon-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 14px;
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

.node-status {
  display: flex;
  align-items: center;
  position: relative;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.status-ring {
  position: absolute;
  width: 10px;
  height: 10px;
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

.node-body {
  padding: 0 20px 20px 20px;
}

.node-label {
  font-weight: 600;
  font-size: 16px;
  color: #1e293b;
  margin-bottom: 6px;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.node-type {
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  margin-bottom: 8px;
}

.node-description {
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
  margin-top: 8px;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 0 20px 16px 20px;
}

.progress-track {
  flex: 1;
  position: relative;
  height: 4px;
  background: rgba(226, 232, 240, 0.8);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6);
  background-size: 200% 100%;
  animation: progressShimmer 2s linear infinite;
  border-radius: 2px;
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

.progress-text {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  min-width: 32px;
  text-align: right;
}

.node-metrics {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  padding: 0 20px 16px 20px;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.metric-label {
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 500;
}

.metric-value {
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
}

.animated-border {
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border-radius: 21px;
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
  border-radius: 20px;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -2;
}

.custom-node:hover .node-shadow {
  opacity: 1;
}

.handle-target,
.handle-source {
  background: linear-gradient(135deg, #3b82f6, #6366f1) !important;
  border: 3px solid rgba(255, 255, 255, 0.9) !important;
  width: 16px !important;
  height: 16px !important;
  border-radius: 50% !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 0 0 2px rgba(59, 130, 246, 0.2) !important;
  opacity: 1 !important;
  visibility: visible !important;
  z-index: 10 !important;
}

.handle-target:hover,
.handle-source:hover {
  background: linear-gradient(135deg, #1d4ed8, #4f46e5) !important;
  transform: scale(1.4) !important;
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.15),
    0 0 0 4px rgba(59, 130, 246, 0.3) !important;
}

.handle-target {
  top: -7px !important;
}

.handle-source {
  bottom: -7px !important;
}

/* Add these styles to your CustomNode.vue <style> section */

.handle-target,
.handle-source {
  position: absolute !important;
  width: 14px !important;
  height: 14px !important;
  border-radius: 50% !important;
  background: #3b82f6 !important;
  border: 2px solid #ffffff !important;
  z-index: 1000 !important;
  opacity: 1 !important;
  visibility: visible !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

.handle-target:hover,
.handle-source:hover {
  background: linear-gradient(135deg, #1d4ed8, #4f46e5) !important;
  transform: translateX(-50%) scale(1.3) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
}

.handle-target {
  top: -8px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.handle-source {
  bottom: -8px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
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

:deep(.vue-flow__handle-top) {
  top: -7px !important;
}

:deep(.vue-flow__handle-bottom) {
  bottom: -7px !important;
}

/* Animations */
@keyframes statusPulse {
  0%,
  100% {
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
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
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

  .node-label {
    color: #f1f5f9;
  }

  .node-type,
  .node-description {
    color: #94a3b8;
  }

  .progress-track {
    background: rgba(51, 65, 85, 0.8);
  }

  .metric-value {
    color: #f1f5f9;
  }
}
</style>
