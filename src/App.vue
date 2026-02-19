<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from './stores/auth';
import { useChatStore } from './stores/chat';
import { useMcpStore } from './stores/mcp';
import { useWebSocket } from './composables/useWebSocket';
import api from './utils/api';
import logo from './assets/oak_logo.png';

const authStore = useAuthStore();
const chatStore = useChatStore();
const mcpStore = useMcpStore();
const { isConnected, connect, onMessage } = useWebSocket();

const isInitializing = ref(true);
let unsubscribe: (() => void) | null = null;

onMounted(async () => {
  const authed = await authStore.init();
  if (authed) {
    // Fetch initial data
    try {
      const response = await api.get('/models/available');
      chatStore.availableModels = response.data.models || [];
      const firstModel = chatStore.availableModels[0];
      if (firstModel) {
        chatStore.selectedModel = firstModel.id;
      }
    } catch (e) {
      console.error('Failed to fetch models', e);
    }
    
    mcpStore.fetchHealth();
    connect();
    
    unsubscribe = onMessage((msg) => {
      switch (msg.type) {
        case 'agent:thinking':
          chatStore.setThinking();
          break;
        case 'agent:response':
          chatStore.removeThinking();
          chatStore.addMessage({
            role: 'agent',
            content: msg.payload,
            timestamp: Date.now()
          });
          break;
        case 'tool:approval_required':
          chatStore.removeThinking();
          chatStore.addMessage({
            role: 'approval',
            data: msg.payload,
            status: 'pending',
            queuePosition: msg.payload.queuePosition || 1,
            totalInQueue: msg.payload.totalInQueue || 1,
            timestamp: Date.now()
          });
          break;
        case 'tool:output':
          const lastApproval = [...chatStore.messages].reverse().find(m => m.role === 'approval');
          if (lastApproval && lastApproval.role === 'approval') {
            lastApproval.output = msg.payload;
          }
          break;
        case 'agent:error':
          chatStore.removeThinking();
          chatStore.addMessage({
            role: 'agent',
            content: `❌ Error: ${msg.payload}`,
            timestamp: Date.now()
          });
          break;
      }
    });
  }
  isInitializing.value = false;
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>

<template>
  <div v-if="isInitializing" class="h-screen w-full flex flex-col items-center justify-center bg-oak-dark text-white font-mono">
    <div class="relative">
      <div class="animate-spin h-16 w-16 border-4 border-oak-primary/20 border-t-oak-primary rounded-full mb-6"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-2 h-2 bg-oak-primary rounded-full animate-pulse"></div>
      </div>
    </div>
    <p class="tracking-[0.3em] uppercase text-[10px] text-oak-primary font-black animate-pulse">Initializing System Core</p>
  </div>

  <div v-else class="h-screen w-full flex flex-col bg-oak-dark text-gray-100 font-sans selection:bg-oak-primary selection:text-oak-dark">
    <!-- Top Navigation Bar -->
    <nav class="h-16 border-b border-gray-800 bg-gray-950/50 backdrop-blur-md flex items-center justify-between px-6 z-10">
      <div class="flex items-center space-x-8">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-transparent flex items-center justify-center">
            <img :src="logo" alt="Ecoza Corp" class="w-full h-full object-contain" />
          </div>
          <div>
            <h1 class="font-black text-sm tracking-[0.2em] uppercase leading-none">The Oak</h1>
            <div class="flex items-center space-x-2 mt-1">
              <div class="w-1.5 h-1.5 rounded-full" :class="isConnected ? 'bg-oak-status-green shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-oak-status-red'"></div>
              <span class="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{{ isConnected ? 'Uplink Stable' : 'Offline' }}</span>
            </div>
          </div>
        </div>

        <div class="flex space-x-1">
          <router-link to="/chat" 
            active-class="bg-gray-800 text-oak-primary"
            class="px-4 py-1.5 rounded-md text-xs font-black uppercase tracking-widest transition-all text-gray-500 hover:text-gray-300">
            Communications
          </router-link>
          <router-link to="/mcp" 
            active-class="bg-gray-800 text-oak-primary"
            class="px-4 py-1.5 rounded-md text-xs font-black uppercase tracking-widest transition-all text-gray-500 hover:text-gray-300">
            Registry
          </router-link>
        </div>
      </div>

      <div class="flex items-center space-x-6">
        <div v-if="chatStore.availableModels.length > 0" class="hidden md:flex items-center space-x-3 bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-800">
          <span class="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Model</span>
          <select v-model="chatStore.selectedModel" class="bg-transparent text-xs font-bold text-oak-primary focus:outline-none cursor-pointer">
            <option v-for="m in chatStore.availableModels" :key="m.id" :value="m.id">{{ m.name }}</option>
          </select>
        </div>

        <div class="flex items-center space-x-3 border-l border-gray-800 pl-6">
          <div class="text-right hidden sm:block">
            <p class="text-[10px] font-black text-white leading-none uppercase">{{ authStore.user?.name || 'Local User' }}</p>
            <p class="text-[9px] font-bold text-gray-600 uppercase tracking-tighter mt-1">{{ authStore.user?.preferred_username || 'admin' }}</p>
          </div>
          <button @click="authStore.logout" class="p-2 text-gray-500 hover:text-oak-status-red transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-hidden relative">
      <div class="h-full max-w-6xl mx-auto w-full p-6 flex flex-col">
        <router-view />
      </div>
    </main>

    <!-- Footer Status Bar -->
    <footer class="h-8 border-t border-gray-800 bg-gray-950 flex items-center justify-between px-6">
      <div class="flex items-center space-x-6">
        <div class="flex items-center space-x-2">
          <span class="text-[9px] font-black text-gray-700 uppercase tracking-widest">Protocol</span>
          <span class="text-[9px] font-bold text-oak-primary font-mono">v1.0-JSON-RPC</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-[9px] font-black text-gray-700 uppercase tracking-widest">Latency</span>
          <span class="text-[9px] font-bold text-oak-status-green font-mono">14ms</span>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-[9px] font-black text-gray-700 uppercase tracking-widest">Encryption</span>
        <span class="text-[9px] font-bold text-oak-accent uppercase">AES-256-GCM</span>
      </div>
    </footer>
  </div>
</template>

<style>
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 10px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #334155;
}

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
