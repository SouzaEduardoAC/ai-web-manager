<script setup lang="ts">
import { ref } from 'vue';
import { useMcpStore } from '../stores/mcp';
import McpHealthDashboard from '../components/McpHealthDashboard.vue';
import TransportForm from '../components/TransportForm.vue';

const mcpStore = useMcpStore();
const showAddMcpModal = ref(false);

const handleAddMcp = async (data: { name: string, config: any }) => {
  try {
    await mcpStore.addMcp(data.name, data.config);
    showAddMcpModal.value = false;
  } catch (e) {
    alert('Failed to add MCP server');
  }
};

const handleRemoveMcp = async (name: string) => {
  if (confirm(`Are you sure you want to remove ${name}?`)) {
    try {
      await mcpStore.removeMcp(name);
    } catch (e) {
      alert('Failed to remove MCP server');
    }
  }
};
</script>

<template>
  <div class="flex-1 overflow-y-auto">
    <div class="mb-6 flex justify-between items-end">
      <div>
        <h2 class="text-2xl font-black uppercase tracking-tighter text-white">System Registry</h2>
        <p class="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">Manage external machine context protocols</p>
      </div>
      <button @click="showAddMcpModal = true" class="bg-brand-primary hover:bg-blue-400 text-brand-dark px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-primary/20 transition-all active:scale-95">
        + Register Server
      </button>
    </div>
    
    <McpHealthDashboard @remove="handleRemoveMcp" />

    <!-- Add MCP Modal -->
    <div v-if="showAddMcpModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm" @click="showAddMcpModal = false"></div>
      <div class="bg-gray-800 border border-gray-700 w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden">
        <div class="p-6 border-b border-gray-700 bg-gray-900/50 flex justify-between items-center">
          <h3 class="text-xl font-black uppercase tracking-tighter">Register New Protocol</h3>
          <button @click="showAddMcpModal = false" class="text-gray-500 hover:text-white transition text-2xl leading-none">&times;</button>
        </div>
        <div class="p-6 max-h-[70vh] overflow-y-auto">
          <TransportForm @submit="handleAddMcp" @cancel="showAddMcpModal = false" />
        </div>
      </div>
    </div>
  </div>
</template>
