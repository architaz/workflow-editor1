<template>
  <div class="custom-node">
    <Handle type="target" :position="Position.Top" />

    <div class="node-content">
      <div class="node-icon" :class="iconClass">
        {{ iconText }}
      </div>
      <div class="node-label">{{ data.label }}</div>
    </div>

    <Handle type="source" :position="Position.Bottom" />
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
        'get-reviews': { class: 'bg-blue-500', text: '📄' },
        'k-means': { class: 'bg-green-500', text: '🔍' },
        'clusters-to-list': { class: 'bg-yellow-500', text: '📊' },
        'customer-insights': { class: 'bg-purple-500', text: '🧠' },
        'insights-to-sheets': { class: 'bg-red-500', text: '📈' },
      }
      return icons[nodeType] || { class: 'bg-gray-500', text: '⚙️' }
    }

    const iconInfo = getIconInfo(props.data.nodeType)

    return {
      Position,
      iconClass: iconInfo.class,
      iconText: iconInfo.text,
    }
  },
}
</script>

<style scoped>
.custom-node {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  min-width: 150px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.custom-node:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.node-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.node-label {
  font-weight: 500;
  font-size: 14px;
}
</style>
