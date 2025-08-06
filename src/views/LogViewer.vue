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
      
      <!-- 日志过滤器 -->
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

      <!-- 日志显示区域 -->
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

    // 连接状态
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

    // 过滤后的日志
    const filteredLogs = computed(() => {
      let filtered = logs.value;
      
      // 按级别过滤
      if (logLevel.value) {
        filtered = filtered.filter(log => log.level === logLevel.value);
      }
      
      // 按关键词过滤
      if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase();
        filtered = filtered.filter(log => 
          log.message.toLowerCase().includes(keyword)
        );
      }
      
      return filtered;
    });

    // 格式化时间
    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleString('sv-SE').replace('T', ' ');
    };

    // 获取日志样式类
    const getLogClass = (level) => {
      return `log-${level?.toLowerCase() || 'info'}`;
    };

    // 滚动到底部
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
        loading.value = true;
        const response = await api.getLogs(logLimit.value);
        logs.value = response.data.logs || [];
        scrollToBottom();
      } catch (error) {
        console.error('加载日志失败:', error);
        ElMessage.error(t('logs.loadFailed'));
      } finally {
        loading.value = false;
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
          console.error('清空日志失败:', error);
          ElMessage.error(t('logs.clearFailed'));
        }
      }
    };

    // 应用过滤器
    const applyFilters = () => {
      loadLogs();
    };

    // 建立WebSocket连接
    const connectWebSocket = () => {
      if (logWebSocket) {
        logWebSocket.close();
      }

      connectionStatus.value = 'connecting';
      const wsUrl = `ws://${window.location.hostname}:8080/api/logs/ws`;
      logWebSocket = new WebSocket(wsUrl);

      logWebSocket.onopen = () => {
        connectionStatus.value = 'connected';
        reconnectAttempts = 0;
        // 连接建立后加载历史日志
        loadLogs();
      };

      logWebSocket.onmessage = (event) => {
        try {
          const logData = JSON.parse(event.data);
          logs.value.push(logData);
          
          // 限制日志数量，保持最新的指定条数
          if (logs.value.length > logLimit.value) {
            logs.value = logs.value.slice(-logLimit.value);
          }
          
          scrollToBottom();
        } catch (error) {
          console.error('解析日志数据失败:', error);
        }
      };

      logWebSocket.onclose = () => {
        connectionStatus.value = 'disconnected';
        
        // 自动重连
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          reconnectTimeout = setTimeout(() => {
            connectWebSocket();
          }, delay);
        } else {
          ElMessage.error('日志连接已断开，请刷新页面重试');
        }
      };

      logWebSocket.onerror = (error) => {
        console.error('WebSocket错误:', error);
        connectionStatus.value = 'disconnected';
      };
    };

    // 设置自动刷新
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
    
    // 自定义滚动条样式
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