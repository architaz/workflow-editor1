<template>
  <CustomNode :data="nodeData" :selected="selected">
    <template #config>
      <div class="config-panel p-4 space-y-3">
        <div>
          <label class="block text-sm font-medium mb-1">URL</label>
          <input v-model="config.url" type="text" class="w-full input">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Method</label>
          <select v-model="config.method" class="w-full input">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
        <button @click="saveConfig" class="btn-primary">Save</button>
      </div>
    </template>
  </CustomNode>
</template>

<script>
import { ref, onMounted } from 'vue';
import CustomNode from './CustomNode.vue';
import { HTTPRequestNode } from '@/lib/n8n-nodes';

export default {
  components: { CustomNode },
  props: ['selected', 'initialConfig'],
  setup(props, { emit }) {
    const nodeInstance = ref(null);
    const config = ref({
      url: props.initialConfig?.url || '',
      method: props.initialConfig?.method || 'GET'
    });

    const nodeData = ref({
      label: 'HTTP Request',
      nodeType: 'http-request',
      description: 'Make API calls to external services',
      status: 'idle',
      metrics: {}
    });

    onMounted(() => {
      nodeInstance.value = new HTTPRequestNode({
        credentials: {},
        parameters: config.value
      });
    });

    const execute = async () => {
      nodeData.value.status = 'executing';
      try {
        const result = await nodeInstance.value.execute();
        nodeData.value.status = 'completed';
        nodeData.value.metrics = {
          status: result.statusCode,
          size: `${(JSON.stringify(result.body).length / 1024).toFixed(2)} KB`
        };
        return result;
      } catch (error) {
        nodeData.value.status = 'error';
        throw error;
      }
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