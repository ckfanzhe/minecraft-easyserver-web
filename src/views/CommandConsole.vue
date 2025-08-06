<template>
  <div class="command-console">
    <!-- 控制台区域 -->
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
      
      <!-- 快捷命令面板 -->
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
        <!-- 日志显示区域 -->
        <div class="log-container" ref="logContainer">
          <div v-if="mergedTimeline.length === 0" class="empty-logs">
            <el-empty :description="$t('interaction.noLogs')" />
          </div>
          <div v-else class="log-content">
            <!-- 统一时间线 -->
            <template v-for="(item, index) in mergedTimeline" :key="index">
              <!-- 服务器日志 -->
              <div 
                v-if="item.type === 'log'"
                class="log-line"
                :class="getLogClass(item.data.level)"
              >
                <span class="log-timestamp">{{ formatTimestamp(item.data.timestamp) }}</span>
                <span class="log-level">{{ item.data.level }}</span>
                <span class="log-message">{{ item.data.message }}</span>
              </div>
              
              <!-- 命令历史 -->
              <div 
                v-else-if="item.type === 'command'"
                class="command-block"
              >
                <!-- 命令行 -->
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
                <!-- 命令响应 -->
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
        
        <!-- 命令输入框 -->
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

    // 格式化时间戳
    const formatTimestamp = (timestamp) => {
      return new Date(timestamp).toLocaleString();
    };

    // 获取日志样式类
    const getLogClass = (level) => {
      return `log-${level?.toLowerCase() || 'info'}`;
    };

    // 合并日志和命令历史，按时间排序
    const mergedTimeline = computed(() => {
      const timeline = [];
      
      // 添加服务器日志
      logs.value.forEach(log => {
        timeline.push({
          type: 'log',
          timestamp: log.timestamp,
          data: log
        });
      });
      
      // 添加命令历史
      commandHistory.value.forEach(cmd => {
        timeline.push({
          type: 'command',
          timestamp: cmd.timestamp,
          data: cmd
        });
      });
      
      // 按时间戳排序
      return timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    });

    // 滚动到日志底部
    const scrollToBottom = () => {
      nextTick(() => {
        if (logContainer.value) {
          const container = logContainer.value;
          container.scrollTop = container.scrollHeight;
        }
      });
    };

    // 加载日志
    const loadLogs = async () => {
      try {
        const response = await api.getLogs(200);
        logs.value = response.data.logs || [];
        scrollToBottom();
      } catch (error) {
        console.error('加载日志失败:', error);
        ElMessage.error(t('interaction.loadLogsFailed'));
      }
    };

    // 刷新日志
    const refreshLogs = () => {
      loadLogs();
    };

    // 清空日志
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
          console.error('清空日志失败:', error);
          ElMessage.error(t('interaction.clearLogsFailed'));
        }
      }
    };

    // 加载命令历史
    const loadCommandHistory = async () => {
      try {
        const response = await api.getCommandHistory();
        commandHistory.value = response.data.history || [];
      } catch (error) {
        console.error('加载命令历史失败:', error);
      }
    };

    // 加载快捷命令
    const loadQuickCommands = async () => {
      try {
        const response = await api.getQuickCommands();
        quickCommands.value = response.data.commands || [];
      } catch (error) {
        console.error('加载快捷命令失败:', error);
      }
    };

    // 执行命令
    const executeCommand = async () => {
      if (!currentCommand.value.trim()) {
        return;
      }

      // 检查服务器状态
      try {
        const statusResponse = await api.getServerStatus();
        if (statusResponse.data.status !== 'running') {
          ElMessage.warning(t('interaction.serverNotRunning'));
          return;
        }
      } catch (error) {
        console.error('检查服务器状态失败:', error);
        ElMessage.error(t('interaction.checkServerStatusFailed'));
        return;
      }

      executing.value = true;
      const command = currentCommand.value.trim();
      
      // 先立即显示命令（状态为执行中）
      const commandEntry = {
        command,
        response: '执行中...',
        timestamp: new Date().toLocaleString('sv-SE').replace('T', ' '),
        success: null, // null表示执行中
        executing: true
      };
      commandHistory.value.push(commandEntry);
      
      // 清空输入框
      currentCommand.value = '';
      historyIndex.value = -1;
      
      // 滚动到底部显示新命令
      scrollToBottom();
      
      try {
        const response = await api.sendCommand(command);
        
        // 更新命令历史记录的响应
        const lastIndex = commandHistory.value.length - 1;
        commandHistory.value[lastIndex] = {
          ...commandHistory.value[lastIndex],
          response: response.data.message || '命令执行成功',
          success: true,
          executing: false
        };
        
        // 显示执行结果
        ElMessage.success(t('interaction.commandExecuted'));
        
        // 滚动到底部显示更新的结果
        scrollToBottom();
        
      } catch (error) {
        console.error('执行命令失败:', error);
        ElMessage.error(t('interaction.commandExecuteFailed'));
        
        // 更新命令历史记录的错误响应
        const lastIndex = commandHistory.value.length - 1;
        commandHistory.value[lastIndex] = {
          ...commandHistory.value[lastIndex],
          response: error.message || t('interaction.commandExecuteFailed'),
          success: false,
          executing: false
        };
        
        // 滚动到底部显示更新的结果
        scrollToBottom();
      } finally {
        executing.value = false;
      }
    };

    // 执行快捷命令
    const executeQuickCommand = async (cmd) => {
      // 检查服务器状态
      try {
        const statusResponse = await api.getServerStatus();
        if (statusResponse.data.status !== 'running') {
          ElMessage.warning(t('interaction.serverNotRunning'));
          return;
        }
      } catch (error) {
        console.error('检查服务器状态失败:', error);
        ElMessage.error(t('interaction.checkServerStatusFailed'));
        return;
      }

      executing.value = true;
      
      // 先立即显示命令（状态为执行中）
      const commandEntry = {
        command: cmd.command,
        response: '执行中...',
        timestamp: new Date().toLocaleString('sv-SE').replace('T', ' '),
        success: null, // null表示执行中
        executing: true
      };
      commandHistory.value.push(commandEntry);
      
      // 滚动到底部显示新命令
      scrollToBottom();
      
      try {
        const response = await api.executeQuickCommand(cmd.id);
        
        // 更新命令历史记录的响应
        const lastIndex = commandHistory.value.length - 1;
        commandHistory.value[lastIndex] = {
          ...commandHistory.value[lastIndex],
          response: response.data.message || '快捷命令执行成功',
          success: true,
          executing: false
        };
        
        // 显示执行结果
        ElMessage.success(`${cmd.name} ${t('interaction.executed')}`);
        
        // 滚动到底部显示更新的结果
        scrollToBottom();
        
      } catch (error) {
        console.error('执行快捷命令失败:', error);
        ElMessage.error(t('interaction.commandExecuteFailed'));
        
        // 更新命令历史记录的错误响应
        const lastIndex = commandHistory.value.length - 1;
        commandHistory.value[lastIndex] = {
          ...commandHistory.value[lastIndex],
          response: error.message || t('interaction.commandExecuteFailed'),
          success: false,
          executing: false
        };
        
        // 滚动到底部显示更新的结果
        scrollToBottom();
      } finally {
        executing.value = false;
      }
    };

    // 导航命令历史
    const navigateHistory = (direction) => {
      if (commandHistory.value.length === 0) return;
      
      if (direction === -1) { // 上箭头
        if (historyIndex.value < commandHistory.value.length - 1) {
          historyIndex.value++;
          currentCommand.value = commandHistory.value[commandHistory.value.length - 1 - historyIndex.value].command;
        }
      } else if (direction === 1) { // 下箭头
        if (historyIndex.value > 0) {
          historyIndex.value--;
          currentCommand.value = commandHistory.value[commandHistory.value.length - 1 - historyIndex.value].command;
        } else if (historyIndex.value === 0) {
          historyIndex.value = -1;
          currentCommand.value = '';
        }
      }
    };

    // 清空命令历史
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
          console.error('清空命令历史失败:', error);
          ElMessage.error(t('interaction.clearHistoryFailed'));
        }
      }
    };

    // 初始化WebSocket连接
    const initWebSocket = () => {
      try {
        const wsUrl = `ws://${window.location.hostname}:8080/api/logs/ws`;
        logWebSocket = new WebSocket(wsUrl);
        
        logWebSocket.onopen = () => {
          console.log('WebSocket连接已建立');
          // 连接建立后加载历史日志
          loadLogs();
        };
        
        logWebSocket.onmessage = (event) => {
          try {
            const logData = JSON.parse(event.data);
            logs.value.push(logData);
            
            // 限制日志数量，保持最新的200条
            if (logs.value.length > 200) {
              logs.value = logs.value.slice(-200);
            }
            
            scrollToBottom();
          } catch (error) {
            console.error('解析WebSocket消息失败:', error);
          }
        };
        
        logWebSocket.onerror = (error) => {
          console.error('WebSocket错误:', error);
        };
        
        logWebSocket.onclose = () => {
          console.log('WebSocket连接已关闭');
          // 5秒后尝试重连
          setTimeout(initWebSocket, 5000);
        };
      } catch (error) {
        console.error('初始化WebSocket失败:', error);
      }
    };

    onMounted(() => {
      loadCommandHistory();
      loadQuickCommands();
      initWebSocket();
      
      // 定期刷新命令历史（日志通过WebSocket实时更新）
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
      flex: 1;
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
      
      // 自定义滚动条样式
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
      
      // 响应式设计
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
    
    // 旋转动画
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