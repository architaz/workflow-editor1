<template>
  <CustomNode :data="nodeData" :selected="selected">
    <template #config>
      <div class="config-panel p-4 space-y-3">
        <div>
          <label class="block text-sm font-medium mb-1">To</label>
          <input v-model="config.to" type="text" class="w-full input">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Subject</label>
          <input v-model="config.subject" type="text" class="w-full input">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Body</label>
          <textarea v-model="config.body" class="w-full input"></textarea>
        </div>
        <button @click="saveConfig" class="btn-primary">Save</button>
      </div>
    </template>
  </CustomNode>
</template>

<script>
import { ref, onMounted } from 'vue';
import CustomNode from './CustomNode.vue';
import { EmailSendNode } from '@/lib/n8n-nodes';

export default {
  components: { CustomNode },
  props: ['selected', 'initialConfig', 'credentials'],
  setup(props, { emit }) {
    const nodeInstance = ref(null);
    const config = ref({
      to: props.initialConfig?.to || '',
      subject: props.initialConfig?.subject || '',
      body: props.initialConfig?.body || ''
    });

    const nodeData = ref({
      label: 'Email',
      nodeType: 'email',
      description: 'Send emails via SMTP',
      status: 'idle',
      metrics: {}
    });

    onMounted(() => {
      nodeInstance.value = new EmailSendNode({
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
          to: config.value.to,
          status: 'sent'
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