<template>
  <CustomNode :data="nodeData" :selected="selected">
    <template #config>
      <div class="config-panel p-4 space-y-3">
        <div>
          <label class="block text-sm font-medium mb-1">Spreadsheet ID</label>
          <input v-model="config.spreadsheetId" type="text" class="w-full input">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Range</label>
          <input v-model="config.range" type="text" class="w-full input">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Operation</label>
          <select v-model="config.operation" class="w-full input">
            <option value="append">Append</option>
            <option value="read">Read</option>
            <option value="update">Update</option>
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
import { GoogleSheetsNode } from '@/lib/n8n-nodes';

export default {
  components: { CustomNode },
  props: ['selected', 'initialConfig', 'credentials'],
  setup(props, { emit }) {
    const nodeInstance = ref(null);
    const config = ref({
      spreadsheetId: props.initialConfig?.spreadsheetId || '',
      range: props.initialConfig?.range || 'A1:B2',
      operation: props.initialConfig?.operation || 'read'
    });

    const nodeData = ref({
      label: 'Google Sheets',
      nodeType: 'google-sheets',
      description: 'Read/write data to Google Sheets',
      status: 'idle',
      metrics: {}
    });

    onMounted(() => {
      nodeInstance.value = new GoogleSheetsNode({
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
          rows: result.rows?.length || 0,
          operation: config.value.operation
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