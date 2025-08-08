<template>
  <div class="log-viewer">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ $t('logs.title') }}</span>
          <div class="header-actions">
            <el-button type="primary" size="small" @click="refreshLogs" :loading="loading">
              <el-icon><Refresh /></el-icon>
              {{ $t('logs.refresh') }}
            </el-button>
            <el-button type="danger" size="small" @click="clearLogs">
              <el-icon><Delete /></el-icon>
              {{ $t('logs.clear') }}
            </el-button>
            <el-switch
              v-model="autoRefresh"
              :active-text="$t('logs.autoRefresh')"
              size="small"
            />
            <div class="connection-status">
              <span class="status-text">{{ $t('logs.status') }}</span>
              <el-tag :type="connectionStatusType" size="small">
                {{ connectionStatusText }}
              </el-tag>
            </div>
          </div>
        </div>
      </template>
      
      <!-- Log Filters -->
      <div class="log-filters">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-select v-model="logLevel" placeholder="日志级别" clearable size="small">
              <el-option label="全部" value="" />
              <el-option label="INFO" value="INFO" />
              <el-option label="WARN" value="WARN" />
              <el-option label="ERROR" value="ERROR" />
              <el-option label="DEBUG" value="DEBUG" />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索日志内容"
              clearable
              size="small"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-select v-model="logLimit" size="small">
              <el-option label="最近100条" :value="100" />
              <el-option label="最近200条" :value="200" />
              <el-option label="最近500条" :value="500" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" size="small" @click="applyFilters">
              {{ $t('common.refresh') }}
            </el-button>
          </el-col>
        </el-row>
      </div>

      <!-- Log Display Area -->
      <div class="log-container" ref="logContainer">
        <div v-if="filteredLogs.length === 0" class="no-logs">
          <el-empty :description="$t('logs.noLogs')" />
        </div>
        <div v-else class="log-content">
          <div 
            v-for="log in filteredLogs" 
            :key="log.timestamp + log.message"
            class="log-item"
            :class="getLogClass(log.level)"
          >
            <span class="log-time">{{ formatTime(log.timestamp) }}</span>
            <span class="log-level">{{ log.level }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Refresh, Delete, Search } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import api from '@/api';

export default {
  name: 'LogViewer',
  components: {
    Refresh,
    Delete,
    Search
  },
  setup() {
    const { t } = useI18n();
    const logs = ref([]);
    const loading = ref(false);
    const autoRefresh = ref(false);
    const logLevel = ref('');
    const searchKeyword = ref('');
    const logLimit = ref(200);
    const logContainer = ref(null);
    const connectionStatus = ref('disconnected');
    let refreshInterval = null;
    let logWebSocket = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 10;
    let reconnectTimeout = null;

    // Connection status
    const connectionStatusType = computed(() => {
      switch (connectionStatus.value) {
        case 'connected': return 'success';
        case 'connecting': return 'warning';
        case 'disconnected': return 'danger';
        default: return 'info';
      }
    });

    const connectionStatusText = computed(() => {
      switch (connectionStatus.value) {
        case 'connected': return t('logs.connected');
        case 'connecting': return t('logs.connecting');
        case 'disconnected': return t('logs.disconnected');
        default: return t('logs.connectionError');
      }
    });

    // Filtered logs
    const filteredLogs = computed(() => {
      let filtered = logs.value;
      
      // Filter by level
      if (logLevel.value) {
        filtered = filtered.filter(log => log.level === logLevel.value);
      }
      
      // Filter by keyword
      if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase();
        filtered = filtered.filter(log => 
          log.message.toLowerCase().includes(keyword)
        );
      }
      
      return filtered;
    });

    // Format time
    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleString('sv-SE').replace('T', ' ');
    };

    // Get log style class
    const getLogClass = (level) => {
      return `log-${level?.toLowerCase() || 'info'}`;
    };

    // Scroll to bottom
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
        loading.value = true;
        const response = await api.getLogs(logLimit.value);
        logs.value = response.data.logs || [];
        scrollToBottom();
      } catch (error) {
        console.error('Failed to load logs:', error);
        ElMessage.error(t('logs.loadFailed'));
      } finally {
        loading.value = false;
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
          t('logs.confirmClear'),
          t('common.confirm'),
          {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            type: 'warning'
          }
        );
        
        await api.clearLogs();
        logs.value = [];
        ElMessage.success(t('logs.clearSuccess'));
      } catch (error) {
        if (error !== 'cancel') {
          console.error('Failed to clear logs:', error);
          ElMessage.error(t('logs.clearFailed'));
        }
      }
    };

    // Apply filters
    const applyFilters = () => {
      loadLogs();
    };

    // Establish WebSocket connection
    const connectWebSocket = () => {
      if (logWebSocket) {
        logWebSocket.close();
      }

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        connectionStatus.value = 'disconnected';
        return;
      }

      connectionStatus.value = 'connecting';
      const wsUrl = `ws://${window.location.hostname}:8080/api/websocket/logs?token=${encodeURIComponent(token)}`;
      logWebSocket = new WebSocket(wsUrl);

      logWebSocket.onopen = () => {
        connectionStatus.value = 'connected';
        reconnectAttempts = 0;
        // Load historical logs after connection is established
        loadLogs();
      };

      logWebSocket.onmessage = (event) => {
        try {
          const logData = JSON.parse(event.data);
          logs.value.push(logData);
          
          // Limit log count, keep the latest specified number of entries
          if (logs.value.length > logLimit.value) {
            logs.value = logs.value.slice(-logLimit.value);
          }
          
          scrollToBottom();
        } catch (error) {
          console.error('Failed to parse log data:', error);
        }
      };

      logWebSocket.onclose = () => {
        connectionStatus.value = 'disconnected';
        
        // Auto reconnect
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          reconnectTimeout = setTimeout(() => {
            connectWebSocket();
          }, delay);
        } else {
          ElMessage.error('Log connection disconnected, please refresh the page and try again');
        }
      };

      logWebSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        connectionStatus.value = 'disconnected';
      };
    };

    // Setup auto refresh
    const setupAutoRefresh = () => {
      if (autoRefresh.value && !refreshInterval) {
        refreshInterval = setInterval(() => {
          if (!logWebSocket || logWebSocket.readyState !== WebSocket.OPEN) {
            loadLogs();
          }
        }, 5000);
      } else if (!autoRefresh.value && refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
      }
    };

    onMounted(() => {
      loadLogs();
      connectWebSocket();
    });

    onUnmounted(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (logWebSocket) {
        logWebSocket.close();
      }
    });

    return {
      logs,
      loading,
      autoRefresh,
      logLevel,
      searchKeyword,
      logLimit,
      logContainer,
      connectionStatus,
      connectionStatusType,
      connectionStatusText,
      filteredLogs,
      formatTime,
      getLogClass,
      refreshLogs,
      clearLogs,
      applyFilters,
      setupAutoRefresh
    };
  }
};
</script>

<style lang="scss" scoped>
.log-viewer {
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
      align-items: center;
      gap: 12px;
      
      .connection-status {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .status-text {
          font-size: 14px;
          color: #606266;
        }
      }
    }
  }
  
  .log-filters {
    margin-bottom: 16px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 4px;
  }
  
  .log-container {
    height: 500px;
    max-height: 500px;
    overflow-y: auto;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    
    .no-logs {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    
    .log-content {
      .log-item {
        display: flex;
        padding: 8px 12px;
        border-bottom: 1px solid #f0f0f0;
        transition: background-color 0.2s;
        
        &:hover {
          background-color: #f8f9fa;
        }
        
        &:last-child {
          border-bottom: none;
        }
        
        .log-time {
          width: 140px;
          color: #909399;
          font-size: 12px;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          flex-shrink: 0;
        }
        
        .log-level {
          width: 60px;
          font-size: 12px;
          font-weight: bold;
          flex-shrink: 0;
        }
        
        .log-message {
          flex: 1;
          font-size: 13px;
          word-break: break-all;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        }
        
        &.log-info .log-level {
          color: #409EFF;
        }
        
        &.log-warn .log-level {
          color: #E6A23C;
        }
        
        &.log-error .log-level {
          color: #F56C6C;
        }
        
        &.log-debug .log-level {
          color: #909399;
        }
      }
    }
    
    // Custom scrollbar styles
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;
      
      &:hover {
        background: #a8a8a8;
      }
    }
  }
}
</style>