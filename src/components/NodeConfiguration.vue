<template>
  <div class="node-config p-4 bg-white border rounded-lg">
    <h3 class="text-lg font-semibold mb-4">{{ nodeData.label }} Configuration</h3>
    
    <div v-for="property in nodeProperties" :key="property.name" class="mb-4">
      <label class="block text-sm font-medium mb-2">
        {{ property.displayName }}
      </label>
      
      <!-- String input -->
      <input 
        v-if="property.type === 'string'"
        v-model="config[property.name]"
        type="text"
        :placeholder="property.placeholder"
        class="w-full p-2 border rounded"
      />
      
      <!-- Number input -->
      <input 
        v-else-if="property.type === 'number'"
        v-model.number="config[property.name]"
        type="number"
        class="w-full p-2 border rounded"
      />
      
      <!-- Select options -->
      <select 
        v-else-if="property.type === 'options'"
        v-model="config[property.name]"
        class="w-full p-2 border rounded"
      >
        <option v-for="option in property.options" :key="option.value" :value="option.value">
          {{ option.name }}
        </option>
      </select>
      
      <!-- JSON editor -->
      <textarea 
        v-else-if="property.type === 'json'"
        v-model="config[property.name]"
        rows="3"
        class="w-full p-2 border rounded font-mono text-sm"
        :placeholder="JSON.stringify(property.default, null, 2)"
      ></textarea>
    </div>
    
    <button 
      @click="$emit('update:config', config)"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Update Configuration
    </button>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'NodeConfiguration',
  props: {
    nodeData: Object,
    nodeProperties: Array,
    initialConfig: Object
  },
  emits: ['update:config'],
  setup(props) {
    const config = ref({ ...props.initialConfig })
    
    watch(() => props.initialConfig, (newConfig) => {
      config.value = { ...newConfig }
    }, { deep: true })
    
    return { config }
  }
}
</script>