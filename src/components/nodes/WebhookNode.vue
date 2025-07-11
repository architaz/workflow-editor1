<template>
  <CustomNode :data="nodeData" :selected="selected">
    <template #config>
      <div class="config-panel p-4 space-y-3">
        <div>
          <label class="block text-sm font-medium mb-1">Webhook Path</label>
          <input v-model="config.path" type="text" class="w-full input">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">HTTP Method</label>
          <select v-model="config.httpMethod" class="w-full input">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
        </div>
        <div v-if="config.httpMethod === 'POST'">
          <label class="block text-sm font-medium mb-1">Response Data</label>
          <textarea v-model="config.responseData" class="w-full input"></textarea>
        </div>
        <button @click="saveConfig" class="btn-primary">Save</button>
      </div>
    </template>
  </CustomNode>
</template>

<script>
import { ref, onMounted } from 'vue';
import CustomNode from './CustomNode.vue';
import { WebhookNode } from '@/lib/n8n-nodes';

export default {
  components: { CustomNode },
  props: ['selected', 'initialConfig'],
  setup(props, { emit }) {
    const nodeInstance = ref(null);
    const config = ref({
      path: props.initialConfig?.path || '/webhook',
      httpMethod: props.initialConfig?.httpMethod || 'POST',
      responseData: props.initialConfig?.responseData || '{}'
    });

    const nodeData = ref({
      label: 'Webhook',
      nodeType: 'webhook',
      description: 'Receive data via webhook',
      status: 'idle',
      metrics: {}
    });

    onMounted(() => {
      nodeInstance.value = new WebhookNode({
        credentials: {},
        parameters: config.value
      });
    });

    const execute = async () => {
      nodeData.value.status = 'waiting';
      return new Promise((resolve) => {
        // In a real implementation, this would wait for an actual webhook call
        setTimeout(() => {
          const mockData = {
            body: { example: 'data' },
            headers: {},
            query: {}
          };
          nodeData.value.status = 'completed';
          nodeData.value.metrics = {
            method: config.value.httpMethod,
            receivedAt: new Date().toISOString()
          };
          resolve(mockData);
        }, 3000);
      });
    };

    const saveConfig = () => {
      emit('update:config', config.value);
    };

    return {
      config,
      nodeData,
      execute,
      saveConfig
    };
  }
};
</script>