<template>
  <CustomNode :data="nodeData" :selected="selected">
    <template #config>
      <div class="config-panel p-4 space-y-3">
        <div>
          <label class="block text-sm font-medium mb-1">Channel</label>
          <input v-model="config.channel" type="text" class="w-full input">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Message</label>
          <textarea v-model="config.text" class="w-full input"></textarea>
        </div>
        <button @click="saveConfig" class="btn-primary">Save</button>
      </div>
    </template>
  </CustomNode>
</template>

<script>
import { ref, onMounted } from 'vue';
import CustomNode from './CustomNode.vue';
import { SlackNode } from '@/lib/n8n-nodes';

export default {
  components: { CustomNode },
  props: ['selected', 'initialConfig', 'credentials'],
  setup(props, { emit }) {
    const nodeInstance = ref(null);
    const config = ref({
      channel: props.initialConfig?.channel || '',
      text: props.initialConfig?.text || ''
    });

    const nodeData = ref({
      label: 'Slack',
      nodeType: 'slack',
      description: 'Send messages to Slack channels',
      status: 'idle',
      metrics: {}
    });

    onMounted(() => {
      nodeInstance.value = new SlackNode({
        credentials: props.credentials,
        parameters: config.value
      });
    });

    const execute = async () => {
      nodeData.value.status = 'executing';
      try {
        const result = await nodeInstance.value.execute();
        nodeData.value.status = 'completed';
        nodeData.value.metrics = {
          channel: config.value.channel,
          timestamp: result.ts
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