<template>
  <div class="command-console">
    <!-- 日志显示区域 -->
    <el-card class="log-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t('interaction.logs') }}</span>
          <div class="header-actions">
            <el-button type="primary" size="small" @click="refreshLogs">
              <el-icon><Refresh /></el-icon>
              {{ $t('common.refresh') }}
            </el-button>
            <el-button type="danger" size="small" @click="clearLogs">
              <el-icon><Delete /></el-icon>
              {{ $t('interaction.clearLogs') }}
            </el-button>
          </div>
        </div>
      </template>
      
      <div class="log-container" ref="logContainer">
        <div v-if="logs.length === 0" class="empty-logs">
          <el-empty :description="$t('interaction.noLogs')" />
        </div>
        <div v-else class="log-content">
          <div 
            v-for="(log, index) in logs" 
            :key="index" 
            class="log-line"
            :class="getLogClass(log.level)"
          >
            <span class="log-timestamp">{{ formatTimestamp(log.timestamp) }}</span>
            <span class="log-level">{{ log.level }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 命令输入区域 -->
    <el-card class="command-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t('interaction.commandInput') }}</span>
          <div class="header-actions">
            <el-button type="primary" size="small" @click="showQuickCommands = !showQuickCommands">
              <el-icon><Menu /></el-icon>
              {{ $t('interaction.quickCommands') }}
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
      
      <!-- 命令历史 -->
      <div v-if="commandHistory.length > 0" class="command-history">
        <div class="history-header">
          <span>{{ $t('interaction.commandHistory') }}</span>
          <span class="history-count">({{ commandHistory.length }})</span>
        </div>
        <div class="history-list">
          <div 
            v-for="(cmd, index) in commandHistory.slice(-10)" 
            :key="index"
            class="history-item"
            :class="{ 'success': cmd.success, 'error': !cmd.success }"
            @click="currentCommand = cmd.command"
          >
            <span class="history-timestamp">{{ formatTimestamp(cmd.timestamp) }}</span>
            <span class="history-command">{{ cmd.command }}</span>
            <span class="history-status">
              <el-icon v-if="cmd.success"><Check /></el-icon>
              <el-icon v-else><Close /></el-icon>
            </span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import api from '../api';

export default {
  name: 'CommandConsole',
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
      
      try {
        const response = await api.sendCommand(command);
        
        // 添加到历史记录
        commandHistory.value.push({
          command,
          response: response.data.message || '命令已发送',
          timestamp: new Date().toISOString(),
          success: true
        });
        
        // 清空输入框
        currentCommand.value = '';
        historyIndex.value = -1;
        
        // 显示执行结果
        ElMessage.success(t('interaction.commandExecuted'));
        
        // 刷新日志
        setTimeout(loadLogs, 1000);
        
      } catch (error) {
        console.error('执行命令失败:', error);
        ElMessage.error(t('interaction.commandExecuteFailed'));
        
        // 仍然添加到历史记录
        commandHistory.value.push({
          command,
          response: error.message || t('interaction.commandExecuteFailed'),
          timestamp: new Date().toISOString(),
          success: false
        });
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

      try {
        executing.value = true;
        const response = await api.executeQuickCommand(cmd.id);
        
        // 添加到历史记录
        commandHistory.value.push({
          command: cmd.command,
          response: response.data.message || '快捷命令已执行',
          timestamp: new Date().toISOString(),
          success: true
        });
        
        // 显示执行结果
        ElMessage.success(`${command.name} ${t('interaction.executed')}`);
        
        // 刷新日志
        setTimeout(loadLogs, 1000);
        
      } catch (error) {
        console.error('执行快捷命令失败:', error);
        ElMessage.error(t('interaction.commandExecuteFailed'));
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
      loadLogs();
      loadCommandHistory();
      loadQuickCommands();
      initWebSocket();
      
      // 定期刷新数据
      refreshInterval = setInterval(() => {
        loadLogs();
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

  .log-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    :deep(.el-card__body) {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 0;
    }
    
    .log-container {
      width: 100%;
      flex: 1;
      max-height: 550px;
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
      }
    }
  }

  .command-card {
    flex-shrink: 0;
    
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
    
    .command-input-area {
      margin-bottom: 16px;
      
      .input-wrapper {
        display: flex;
        align-items: center;
        background: #1e1e1e;
        border-radius: 6px;
        padding: 8px 12px;
        
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
    
    .command-history {
      .history-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        font-weight: 600;
        color: #606266;
        
        .history-count {
          margin-left: 4px;
          font-size: 12px;
          color: #909399;
        }
      }
      
      .history-list {
        max-height: 200px;
        overflow-y: auto;
        
        .history-item {
          display: flex;
          align-items: center;
          padding: 6px 8px;
          margin-bottom: 2px;
          background: #f8f9fa;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
          
          &:hover {
            background: #e9ecef;
          }
          
          &.success {
            border-left: 3px solid #67c23a;
          }
          
          &.error {
            border-left: 3px solid #f56c6c;
          }
          
          .history-timestamp {
            font-size: 11px;
            color: #909399;
            margin-right: 8px;
            min-width: 120px;
            flex-shrink: 0;
          }
          
          .history-command {
            flex: 1;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 12px;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .history-status {
            margin-left: 8px;
            flex-shrink: 0;
            
            .el-icon {
              font-size: 14px;
              
              &.success {
                color: #67c23a;
              }
              
              &.error {
                color: #f56c6c;
              }
            }
          }
        }
      }
    }
  }
}
</style>