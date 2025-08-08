<template>
  <div class="command-console">
    <!-- Console Area -->
    <el-card class="console-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t('interaction.logs') }}</span>
          <div class="header-actions">
            <el-button type="primary" size="small" @click="showQuickCommands = !showQuickCommands">
              <el-icon><Menu /></el-icon>
              {{ $t('interaction.quickCommands') }}
            </el-button>
            <el-button type="primary" size="small" @click="refreshLogs">
              <el-icon><Refresh /></el-icon>
              {{ $t('common.refresh') }}
            </el-button>
            <el-button type="danger" size="small" @click="clearLogs">
              <el-icon><Delete /></el-icon>
              {{ $t('interaction.clearLogs') }}
            </el-button>
            <el-button type="warning" size="small" @click="clearHistory">
              <el-icon><Delete /></el-icon>
              {{ $t('interaction.clearHistory') }}
            </el-button>
          </div>
        </div>
      </template>
      
      <!-- Quick Commands Panel -->
      <div v-if="showQuickCommands" class="quick-commands-panel">
        <div class="quick-commands-grid">
          <el-button 
            v-for="cmd in quickCommands" 
            :key="cmd.id"
            type="info"
            size="small"
            @click="executeQuickCommand(cmd)"
            class="quick-cmd-btn"
          >
            {{ cmd.name }}
          </el-button>
        </div>
      </div>
      
      <div class="console-container">
        <!-- Log Display Area -->
        <div class="log-container" ref="logContainer">
          <div v-if="mergedTimeline.length === 0" class="empty-logs">
            <el-empty :description="$t('interaction.noLogs')" />
          </div>
          <div v-else class="log-content">
            <!-- Unified Timeline -->
            <template v-for="(item, index) in mergedTimeline" :key="index">
              <!-- Server Logs -->
              <div 
                v-if="item.type === 'log'"
                class="log-line"
                :class="getLogClass(item.data.level)"
              >
                <span class="log-timestamp">{{ formatTimestamp(item.data.timestamp) }}</span>
                <span class="log-level">{{ item.data.level }}</span>
                <span class="log-message">{{ item.data.message }}</span>
              </div>
              
              <!-- Command History -->
              <div 
                v-else-if="item.type === 'command'"
                class="command-block"
              >
                <!-- Command Line -->
                <div 
                  class="command-line"
                  :class="{ 
                    'success': item.data.success === true, 
                    'error': item.data.success === false,
                    'executing': item.data.executing
                  }"
                >
                  <span class="log-timestamp">{{ formatTimestamp(item.data.timestamp) }}</span>
                  <span class="command-prompt">></span>
                  <span class="command-text">{{ item.data.command }}</span>
                  <span class="command-status">
                    <el-icon v-if="item.data.executing" class="rotating"><Loading /></el-icon>
                    <el-icon v-else-if="item.data.success === true"><Check /></el-icon>
                    <el-icon v-else-if="item.data.success === false"><Close /></el-icon>
                  </span>
                </div>
                <!-- Command Response -->
                <div 
                  class="command-response"
                  :class="{ 
                    'success': item.data.success === true, 
                    'error': item.data.success === false,
                    'executing': item.data.executing
                  }"
                >
                  {{ item.data.response }}
                </div>
              </div>
            </template>
          </div>
        </div>
        
        <!-- Command Input Box -->
        <div class="command-input-area">
          <div class="input-wrapper">
            <span class="command-prompt">></span>
            <el-input
              v-model="currentCommand"
              :placeholder="$t('interaction.commandPlaceholder')"
              @keyup.enter="executeCommand"
              @keyup.up="navigateHistory(-1)"
              @keyup.down="navigateHistory(1)"
              class="command-input"
              :disabled="executing"
            />
            <el-button 
              type="primary" 
              @click="executeCommand"
              :loading="executing"
              class="execute-btn"
            >
              <el-icon><Right /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { Check, Close, Right, Loading } from '@element-plus/icons-vue';
import api from '../api';

export default {
  name: 'CommandConsole',
  components: {
    Check,
    Close,
    Right,
    Loading
  },
  setup() {
    const { t } = useI18n();
    const logs = ref([]);
    const currentCommand = ref('');
    const commandHistory = ref([]);
    const quickCommands = ref([]);
    const executing = ref(false);
    const showQuickCommands = ref(false);
    const historyIndex = ref(-1);
    const logContainer = ref(null);
    let logWebSocket = null;
    let refreshInterval = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 10;
    let reconnectTimeout = null;

    // Format timestamp
    const formatTimestamp = (timestamp) => {
      return new Date(timestamp).toLocaleString('sv-SE').replace('T', ' ');
    };

    // Get log style class
    const getLogClass = (level) => {
      return `log-${level?.toLowerCase() || 'info'}`;
    };

    // Merge logs and command history, sort by time
    const mergedTimeline = computed(() => {
      const timeline = [];
      
      // Add server logs
      logs.value.forEach(log => {
        timeline.push({
          type: 'log',
          timestamp: log.timestamp,
          data: log
        });
      });
      
      // Add command history
      commandHistory.value.forEach(cmd => {
        timeline.push({
          type: 'command',
          timestamp: cmd.timestamp,
          data: cmd
        });
      });
      
      // Sort by timestamp
      return timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    });

    // Scroll to bottom of logs
    const scrollToBottom = () => {
      nextTick(() => {
        if (logContainer.value) {
          const container = logContainer.value;
          container.scrollTop = container.scrollHeight;
        }
      });
    };

    // Load logs
    const loadLogs = async () => {
      try {
        const response = await api.getLogs(200);
        logs.value = response.data.logs || [];
        scrollToBottom();
      } catch (error) {
        console.error('Failed to load logs:', error);
        ElMessage.error(t('interaction.loadLogsFailed'));
      }
    };

    // Refresh logs
    const refreshLogs = () => {
      loadLogs();
    };

    // Clear logs
    const clearLogs = async () => {
      try {
        await ElMessageBox.confirm(
          t('interaction.confirmClearLogs'),
          t('common.confirm'),
          {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            type: 'warning'
          }
        );
        
        await api.clearLogs();
        logs.value = [];
        ElMessage.success(t('interaction.logsCleared'));
      } catch (error) {
        if (error !== 'cancel') {
          console.error('Failed to clear logs:', error);
          ElMessage.error(t('interaction.clearLogsFailed'));
        }
      }
    };

    // Load command history
    const loadCommandHistory = async () => {
      try {
        const response = await api.getCommandHistory();
        commandHistory.value = response.data.history || [];
      } catch (error) {
        console.error('Failed to load command history:', error);
      }
    };

    // Load quick commands
    const loadQuickCommands = async () => {
      try {
        const response = await api.getQuickCommands();
        quickCommands.value = response.data.commands || [];
      } catch (error) {
        console.error('Failed to load quick commands:', error);
      }
    };

    // Execute command
    const executeCommand = async () => {
      if (!currentCommand.value.trim()) {
        return;
      }

      // Check server status
      try {
        const statusResponse = await api.getServerStatus();
        if (statusResponse.data.status !== 'running') {
          ElMessage.warning(t('interaction.serverNotRunning'));
          return;
        }
      } catch (error) {
        console.error('Failed to check server status:', error);
        ElMessage.error(t('interaction.checkServerStatusFailed'));
        return;
      }

      executing.value = true;
      const command = currentCommand.value.trim();
      
      // Immediately show command (status: executing)
      const commandEntry = {
        command,
        response: '执行中...',
        timestamp: new Date().toLocaleString('sv-SE').replace('T', ' '),
        success: null, // null表示执行中
        executing: true
      };
      commandHistory.value.push(commandEntry);
      
      // Clear input field
      currentCommand.value = '';
      historyIndex.value = -1;
      
      // Scroll to bottom to show new command
      scrollToBottom();
      
      try {
        const response = await api.sendCommand(command);
        
        // Update command history response
        const lastIndex = commandHistory.value.length - 1;
        commandHistory.value[lastIndex] = {
          ...commandHistory.value[lastIndex],
          response: response.data.message || '命令执行成功',
          success: true,
          executing: false
        };
        
        // Show execution result
        ElMessage.success(t('interaction.commandExecuted'));
        
        // Scroll to bottom to show updated result
        scrollToBottom();
        
      } catch (error) {
        console.error('Failed to execute command:', error);
        
        // Provide more specific error information
        let errorMessage = t('interaction.commandExecuteFailed');
        if (error.response) {
          // Server returned error
          errorMessage = error.response.data?.error || error.response.data?.message || errorMessage;
        } else if (error.request) {
          // Network error
          errorMessage = 'Network connection failed, please check server status';
        } else {
          // Other errors
          errorMessage = error.message || errorMessage;
        }
        
        ElMessage.error(errorMessage);
        
        // Update error response in command history
        const lastIndex = commandHistory.value.length - 1;
        commandHistory.value[lastIndex] = {
          ...commandHistory.value[lastIndex],
          response: errorMessage,
          success: false,
          executing: false
        };
        
        // Scroll to bottom to show updated result
        scrollToBottom();
      } finally {
        executing.value = false;
      }
    };

    // Execute quick command
    const executeQuickCommand = async (cmd) => {
      // Check server status
      try {
        const statusResponse = await api.getServerStatus();
        if (statusResponse.data.status !== 'running') {
          ElMessage.warning(t('interaction.serverNotRunning'));
          return;
        }
      } catch (error) {
        console.error('Failed to check server status:', error);
        ElMessage.error(t('interaction.checkServerStatusFailed'));
        return;
      }

      executing.value = true;
      
      // Immediately show command (status: executing)
      const commandEntry = {
        command: cmd.command,
        response: '执行中...',
        timestamp: new Date().toLocaleString('sv-SE').replace('T', ' '),
        success: null, // null表示执行中
        executing: true
      };
      commandHistory.value.push(commandEntry);
      
      // Scroll to bottom to show new command
      scrollToBottom();
      
      try {
        const response = await api.executeQuickCommand(cmd.id);
        
        // Update command history response
        const lastIndex = commandHistory.value.length - 1;
        commandHistory.value[lastIndex] = {
          ...commandHistory.value[lastIndex],
          response: response.data.message || '快捷命令执行成功',
          success: true,
          executing: false
        };
        
        // Show execution result
        ElMessage.success(`${cmd.name} ${t('interaction.executed')}`);
        
        // Scroll to bottom to show updated result
        scrollToBottom();
        
      } catch (error) {
        console.error('Failed to execute quick command:', error);
        
        // Provide more specific error information
        let errorMessage = t('interaction.commandExecuteFailed');
        if (error.response) {
          // Server returned error
          errorMessage = error.response.data?.error || error.response.data?.message || errorMessage;
        } else if (error.request) {
          // Network error
          errorMessage = '网络连接失败，请检查服务器状态';
        } else {
          // Other errors
          errorMessage = error.message || errorMessage;
        }
        
        ElMessage.error(errorMessage);
        
        // Update error response in command history
        const lastIndex = commandHistory.value.length - 1;
        commandHistory.value[lastIndex] = {
          ...commandHistory.value[lastIndex],
          response: errorMessage,
          success: false,
          executing: false
        };
        
        // Scroll to bottom to show updated result
        scrollToBottom();
      } finally {
        executing.value = false;
      }
    };

    // Navigate command history
    const navigateHistory = (direction) => {
      if (commandHistory.value.length === 0) return;
      
      if (direction === -1) { // Up arrow
        if (historyIndex.value < commandHistory.value.length - 1) {
          historyIndex.value++;
          const targetIndex = commandHistory.value.length - 1 - historyIndex.value;
          if (targetIndex >= 0 && targetIndex < commandHistory.value.length) {
            currentCommand.value = commandHistory.value[targetIndex].command;
          }
        }
      } else if (direction === 1) { // Down arrow
        if (historyIndex.value > 0) {
          historyIndex.value--;
          const targetIndex = commandHistory.value.length - 1 - historyIndex.value;
          if (targetIndex >= 0 && targetIndex < commandHistory.value.length) {
            currentCommand.value = commandHistory.value[targetIndex].command;
          }
        } else if (historyIndex.value === 0) {
          historyIndex.value = -1;
          currentCommand.value = '';
        }
      }
    };

    // Clear command history
    const clearHistory = async () => {
      try {
        await ElMessageBox.confirm(
          t('interaction.confirmClearHistory'),
          t('common.confirm'),
          {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            type: 'warning'
          }
        );
        
        await api.clearCommandHistory();
        commandHistory.value = [];
        ElMessage.success(t('interaction.historyCleared'));
      } catch (error) {
        if (error !== 'cancel') {
          console.error('Failed to clear command history:', error);
          ElMessage.error(t('interaction.clearHistoryFailed'));
        }
      }
    };

    // Initialize WebSocket connection
    const initWebSocket = () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          return;
        }
        const wsUrl = `ws://${window.location.hostname}:8080/api/websocket/logs?token=${encodeURIComponent(token)}`;
        logWebSocket = new WebSocket(wsUrl);
        
        logWebSocket.onopen = () => {
          console.log('WebSocket connection established');
          reconnectAttempts = 0; // Reset reconnection attempts
          // Load historical logs after connection is established
          loadLogs();
        };
        
        logWebSocket.onmessage = (event) => {
          try {
            const logData = JSON.parse(event.data);
            logs.value.push(logData);
            
            // Limit log count, keep the latest 200 entries
            if (logs.value.length > 200) {
              logs.value = logs.value.slice(-200);
            }
            
            scrollToBottom();
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };
        
        logWebSocket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
        
        logWebSocket.onclose = () => {
          console.log('WebSocket connection closed');
          
          // Implement exponential backoff reconnection strategy
          if (reconnectAttempts < maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000); // Maximum delay 30 seconds
            console.log(`Attempting reconnection ${reconnectAttempts + 1} after ${delay}ms`);
            
            reconnectTimeout = setTimeout(() => {
              reconnectAttempts++;
              initWebSocket();
            }, delay);
          } else {
            console.error('WebSocket reconnection attempts exceeded limit, stopping reconnection');
            ElMessage.error('Log connection disconnected, please refresh the page and try again');
          }
        };
      } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
        
        // Attempt reconnection even if initialization fails
        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          reconnectTimeout = setTimeout(() => {
            reconnectAttempts++;
            initWebSocket();
          }, delay);
        }
      }
    };

    onMounted(() => {
      loadCommandHistory();
      loadQuickCommands();
      initWebSocket();
      
      // Periodically refresh command history (logs are updated in real-time via WebSocket)
      refreshInterval = setInterval(() => {
        loadCommandHistory();
      }, 30000);
    });

    onUnmounted(() => {
      if (logWebSocket) {
        logWebSocket.close();
      }
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    });

    return {
      logs,
      currentCommand,
      commandHistory,
      quickCommands,
      executing,
      showQuickCommands,
      logContainer,
      mergedTimeline,
      formatTimestamp,
      getLogClass,
      refreshLogs,
      clearLogs,
      executeCommand,
      executeQuickCommand,
      navigateHistory,
      clearHistory
    };
  }
};
</script>

<style lang="scss" scoped>
.command-console {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  gap: 16px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    span {
      font-size: 18px;
      font-weight: 600;
    }
    
    .header-actions {
      display: flex;
      gap: 8px;
    }
  }

  .console-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    :deep(.el-card__body) {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 0;
    }
    
    .console-container {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .log-container {
      width: 100%;
      height: 650px;
      max-height: 650px;
      overflow-y: auto;
      overflow-x: hidden;
      background: #1e1e1e;
      color: #d4d4d4;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.4;
      padding: 12px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      scroll-behavior: smooth;
      
      // Custom scrollbar styles
      &::-webkit-scrollbar {
        width: 8px;
      }
      
      &::-webkit-scrollbar-track {
        background: #2d2d2d;
        border-radius: 4px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: #555;
        border-radius: 4px;
        
        &:hover {
          background: #777;
        }
      }
      
      // Responsive design
      @media (max-width: 768px) {
        height: 300px;
        min-height: 250px;
        font-size: 12px;
        padding: 8px;
      }
      
      .empty-logs {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        
        :deep(.el-empty) {
          .el-empty__description {
            color: #909399;
          }
        }
      }
      
      .log-content {
        .log-line {
          display: flex;
          margin-bottom: 2px;
          padding: 2px 0;
          
          .log-timestamp {
            color: #569cd6;
            margin-right: 8px;
            min-width: 140px;
            flex-shrink: 0;
          }
          
          .log-level {
            margin-right: 8px;
            min-width: 60px;
            flex-shrink: 0;
            font-weight: bold;
          }
          
          .log-message {
            flex: 1;
            word-break: break-all;
          }
          
          &.log-info {
            .log-level {
              color: #4ec9b0;
            }
          }
          
          &.log-warn {
            .log-level {
              color: #dcdcaa;
            }
          }
          
          &.log-error {
            .log-level {
              color: #f44747;
            }
          }
          
          &.log-debug {
            .log-level {
              color: #9cdcfe;
            }
          }
        }
        
        .command-line {
          display: flex;
          margin-bottom: 2px;
          padding: 2px 0;
          
          .log-timestamp {
            color: #569cd6;
            margin-right: 8px;
            min-width: 140px;
            flex-shrink: 0;
          }
          
          .command-prompt {
            color: #4ec9b0;
            font-weight: bold;
            margin-right: 8px;
            min-width: 20px;
            flex-shrink: 0;
          }
          
          .command-text {
            flex: 1;
            color: #d4d4d4;
            word-break: break-all;
          }
          
          .command-status {
            margin-left: 8px;
            flex-shrink: 0;
            
            .el-icon {
              font-size: 14px;
            }
          }
          
          &.success {
            .command-status .el-icon {
              color: #67c23a;
            }
          }
          
          &.error {
            .command-status .el-icon {
              color: #f56c6c;
            }
          }
          
          &.executing {
            .command-status .el-icon {
              color: #409eff;
            }
          }
        }
        
        .command-response {
          margin-left: 148px;
          padding: 4px 8px;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 12px;
          white-space: pre-wrap;
          border-left: 3px solid #409eff;
          background: rgba(64, 158, 255, 0.1);
          
          &.success {
            border-left-color: #67c23a;
            background: rgba(103, 194, 58, 0.1);
            color: #67c23a;
          }
          
          &.error {
            border-left-color: #f56c6c;
            background: rgba(245, 108, 108, 0.1);
            color: #f56c6c;
          }
          
          &.executing {
            border-left-color: #409eff;
            background: rgba(64, 158, 255, 0.1);
            color: #409eff;
          }
        }
      }
    }
    
    // Rotation animation
    .rotating {
      animation: rotate 1s linear infinite;
    }
    
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    
    .command-input-area {
      flex-shrink: 0;
      padding: 12px;
      background: #1e1e1e;
      border-top: 1px solid #333;
      
      .input-wrapper {
        display: flex;
        align-items: center;
        
        .command-prompt {
          color: #4ec9b0;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          font-weight: bold;
          margin-right: 8px;
          font-size: 14px;
        }
        
        .command-input {
          flex: 1;
          
          :deep(.el-input__wrapper) {
            background: transparent;
            border: none;
            box-shadow: none;
            
            .el-input__inner {
              background: transparent;
              color: #d4d4d4;
              font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
              font-size: 13px;
              
              &::placeholder {
                color: #6a6a6a;
              }
            }
          }
        }
        
        .execute-btn {
          margin-left: 8px;
          flex-shrink: 0;
        }
      }
    }
  }

    .quick-commands-panel {
      margin-bottom: 16px;
      padding: 12px;
      background: #f5f7fa;
      border-radius: 6px;
      
      .quick-commands-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 8px;
        
        .quick-cmd-btn {
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
}
</style>