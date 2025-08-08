<template>
  <div class="home">
    <!-- Server Status Overview -->
    <div class="status-overview">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="status-card">
            <div class="status-item">
              <div class="status-icon running">
                <el-icon><Monitor /></el-icon>
              </div>
              <div class="status-info">
                <h3>{{ $t('dashboard.statusOverview.serverStatus') }}</h3>
                <p :class="getStatusClass()">{{ serverStatus }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="status-card">
            <div class="status-item">
              <div class="status-icon performance">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <div class="status-info">
                <h3>{{ $t('dashboard.statusOverview.cpuUsage') }}</h3>
                <p>{{ cpuUsage }}%</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="status-card">
            <div class="status-item">
              <div class="status-icon memory">
                <el-icon><PieChart /></el-icon>
              </div>
              <div class="status-info">
                <h3>{{ $t('dashboard.statusOverview.memoryUsage') }}</h3>
                <p>{{ memoryUsage }}%</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>{{ $t('dashboard.quickActions.title') }}</span>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-button 
              type="success" 
              size="large" 
              :disabled="serverStatus === 'running'"
              @click="startServer"
              class="action-button"
            >
              <el-icon><VideoPlay /></el-icon>
              {{ $t('dashboard.quickActions.startServer') }}
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button 
              type="danger" 
              size="large" 
              :disabled="serverStatus === 'stopped'"
              @click="stopServer"
              class="action-button"
            >
              <el-icon><VideoPause /></el-icon>
              {{ $t('dashboard.quickActions.stopServer') }}
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button 
              type="warning" 
              size="large" 
              @click="restartServer"
              class="action-button"
            >
              <el-icon><Refresh /></el-icon>
              {{ $t('dashboard.quickActions.restartServer') }}
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button 
              type="primary" 
              size="large" 
              @click="$router.push('/commands')"
              class="action-button"
            >
              <el-icon><ChatLineSquare /></el-icon>
              {{ $t('dashboard.quickActions.commandConsole') }}
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- Recent Logs -->
    <div class="recent-logs">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>{{ $t('dashboard.recentLogs.title') }}</span>
            <el-button type="text" @click="$router.push('/logs')">
              {{ $t('dashboard.recentLogs.viewMore') }}
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </template>
        <div class="log-container">
          <div v-if="logs.length === 0" class="no-logs">
            <el-empty :description="$t('dashboard.recentLogs.noLogs')" />
          </div>
          <div v-else>
            <div 
              v-for="log in logs.slice(0, 10)" 
              :key="log.timestamp" 
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

    <!-- System Information -->
    <div class="system-info">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>{{ $t('dashboard.serverInfo.title') }}</span>
              </div>
            </template>
            <div class="info-list">
              <div class="info-item">
                 <span class="info-label">{{ $t('dashboard.serverInfo.serverName') }}:</span>
                 <span class="info-value">{{ serverInfo.name || $t('dashboard.serverInfo.notSet') }}</span>
                </div>
                <div class="info-item">
                 <span class="info-label">{{ $t('dashboard.serverInfo.gameMode') }}:</span>
                 <span class="info-value">{{ serverInfo.gamemode || $t('dashboard.serverInfo.unknown') }}</span>
                </div>
                <div class="info-item">
                 <span class="info-label">{{ $t('dashboard.serverInfo.difficulty') }}:</span>
                 <span class="info-value">{{ serverInfo.difficulty || $t('dashboard.serverInfo.unknown') }}</span>
                </div>
                <div class="info-item">
                 <span class="info-label">{{ $t('dashboard.serverInfo.port') }}:</span>
                 <span class="info-value">{{ serverInfo.port || '19132' }}</span>
                </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>{{ $t('dashboard.quickLinks.title') }}</span>
              </div>
            </template>
            <div class="quick-links">
              <el-button type="text" @click="$router.push('/config')">
                <el-icon><Setting /></el-icon>
                {{ $t('dashboard.quickLinks.serverConfig') }}
              </el-button>
              <el-button type="text" @click="$router.push('/players')">
                <el-icon><User /></el-icon>
                {{ $t('dashboard.quickLinks.playerManagement') }}
              </el-button>
              <el-button type="text" @click="$router.push('/worlds')">
                <el-icon><Globe /></el-icon>
                {{ $t('dashboard.quickLinks.resourceManagement') }}
              </el-button>
              <el-button type="text" @click="$router.push('/performance')">
                <el-icon><TrendCharts /></el-icon>
                {{ $t('dashboard.quickLinks.performanceMonitoring') }}
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import api from '../api';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';

export default {
  name: 'Home',
  setup() {
    const { t } = useI18n();
    const serverStatus = ref('unknown');
    const maxPlayers = ref(10);
    const cpuUsage = ref(0);
    const memoryUsage = ref(0);
    const logs = ref([]);
    const serverInfo = ref({});
    let refreshInterval = null;

    const getStatusClass = () => {
      return `status-${serverStatus.value}`;
    };

    const getLogClass = (level) => {
      return `log-${level.toLowerCase()}`;
    };

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString();
    };

    const loadServerStatus = async () => {
      try {
        const response = await api.getServerStatus();
        serverStatus.value = response.data.status;
      } catch (error) {
        console.error('Failed to get server status:', error);
      }
    };

    const loadPerformanceData = async () => {
      try {
        const response = await api.getPerformanceData();
        const data = response.data;
        cpuUsage.value = Math.round(data.system.cpu_usage);
        memoryUsage.value = Math.round(data.system.memory_usage);
      } catch (error) {
        console.error('Failed to get performance data:', error);
      }
    };

    const loadRecentLogs = async () => {
      try {
        const response = await api.getLogs(10);
        logs.value = response.data.logs || [];
      } catch (error) {
        console.error('Failed to get logs:', error);
      }
    };

    const loadServerInfo = async () => {
      try {
        const response = await api.getServerConfig();
        const config = response.data.config || response.data;
         serverInfo.value = {
           name: config['server-name'] || '',
           gamemode: config.gamemode || '',
           difficulty: config.difficulty || '',
           port: config['server-port'] || '19132'
         };
        maxPlayers.value = config['max-players'] || 10;
      } catch (error) {
        console.error('Failed to get server info:', error);
        // Set default values in case API call fails
         serverInfo.value = {
           name: '',
           gamemode: '',
           difficulty: '',
           port: '19132'
         };
        maxPlayers.value = 10;
      }
    };

    const startServer = async () => {
      try {
         await api.startServer();
         ElMessage.success(t('dashboard.messages.startServerSuccess'));
         setTimeout(loadServerStatus, 2000);
       } catch (error) {
         ElMessage.error(t('dashboard.messages.startServerError'));
       }
    };

    const stopServer = async () => {
      try {
         await api.stopServer();
         ElMessage.success(t('dashboard.messages.stopServerSuccess'));
         setTimeout(loadServerStatus, 2000);
       } catch (error) {
         ElMessage.error(t('dashboard.messages.stopServerError'));
       }
    };

    const restartServer = async () => {
      try {
         await api.restartServer();
         ElMessage.success(t('dashboard.messages.restartServerSuccess'));
         setTimeout(loadServerStatus, 2000);
       } catch (error) {
         ElMessage.error(t('dashboard.messages.restartServerError'));
       }
    };

    const loadAllData = () => {
      loadServerStatus();
      loadPerformanceData();
      loadRecentLogs();
      loadServerInfo();
    };

    onMounted(() => {
      // 只有在用户已登录时才开始定时查询
      const token = localStorage.getItem('token');
      if (token) {
        loadAllData();
        // Refresh data every 30 seconds
        refreshInterval = setInterval(loadAllData, 30000);
      }
    });

    onUnmounted(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    });

    return {
      serverStatus,
      maxPlayers,
      cpuUsage,
      memoryUsage,
      logs,
      serverInfo,
      getStatusClass,
      getLogClass,
      formatTime,
      startServer,
      stopServer,
      restartServer
    };
  }
};
</script>

<style lang="scss" scoped>
.home {
  .status-overview {
    margin-bottom: 20px;
    
    .status-card {
      .status-item {
        display: flex;
        align-items: center;
        
        .status-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          font-size: 24px;
          color: white;
          
          &.running {
            background-color: #67C23A;
          }
          
          &.players {
            background-color: #409EFF;
          }
          
          &.performance {
            background-color: #E6A23C;
          }
          
          &.memory {
            background-color: #F56C6C;
          }
        }
        
        .status-info {
          h3 {
            margin: 0 0 5px 0;
            font-size: 14px;
            color: #909399;
          }
          
          p {
            margin: 0;
            font-size: 20px;
            font-weight: bold;
            
            &.status-running {
              color: #67C23A;
            }
            
            &.status-stopped {
              color: #F56C6C;
            }
            
            &.status-starting,
            &.status-stopping {
              color: #E6A23C;
            }
          }
        }
      }
    }
  }
  
  .quick-actions {
    margin-bottom: 20px;
    
    .action-button {
      width: 100%;
      height: 60px;
      font-size: 16px;
    }
  }
  
  .recent-logs {
    margin-bottom: 20px;
    
    .log-container {
      max-height: 300px;
      overflow-y: auto;
      
      .log-item {
        display: flex;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
        
        .log-time {
          width: 100px;
          color: #909399;
          font-size: 12px;
        }
        
        .log-level {
          width: 60px;
          font-size: 12px;
          font-weight: bold;
        }
        
        .log-message {
          flex: 1;
          font-size: 13px;
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
      }
    }
  }
  
  .system-info {
    .info-list {
      .info-item {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #f0f0f0;
        
        &:last-child {
          border-bottom: none;
        }
        
        .info-label {
          color: #909399;
        }
        
        .info-value {
          font-weight: bold;
        }
      }
    }
    
    .quick-links {
      display: flex;
      flex-direction: column;
      gap: 10px;
      
      .el-button {
        justify-content: flex-start;
        padding: 10px 0;
      }
    }
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>