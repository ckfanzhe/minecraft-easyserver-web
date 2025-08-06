<template>
  <div id="app">
    <el-container class="app-container">
      <!-- 侧边栏 -->
      <el-aside width="250px" class="sidebar">
        <div class="logo">
          <h2>🎮 {{ $t('nav.title') }}</h2>
        </div>
        <el-menu
          :default-active="$route.path"
          router
          class="sidebar-menu"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/">
            <el-icon><Odometer /></el-icon>
            <span>{{ $t('nav.menu.dashboard') }}</span>
          </el-menu-item>
          <el-menu-item index="/config">
            <el-icon><Setting /></el-icon>
            <span>{{ $t('nav.menu.serverConfig') }}</span>
          </el-menu-item>
          <el-menu-item index="/players">
            <el-icon><User /></el-icon>
            <span>{{ $t('nav.menu.allowlist') }}</span>
          </el-menu-item>
          <el-menu-item index="/permissions">
            <el-icon><Key /></el-icon>
            <span>{{ $t('nav.menu.permission') }}</span>
          </el-menu-item>
          <el-menu-item index="/worlds">
            <el-icon><Baseball /></el-icon>
            <span>{{ $t('nav.menu.world') }}</span>
          </el-menu-item>
          <el-menu-item index="/commands">
            <el-icon><ChatLineSquare /></el-icon>
            <span>{{ $t('nav.menu.interaction') }}</span>
          </el-menu-item>
          <el-menu-item index="/logs">
            <el-icon><Document /></el-icon>
            <span>{{ $t('nav.menu.logs') }}</span>
          </el-menu-item>
          <el-menu-item index="/performance">
            <el-icon><TrendCharts /></el-icon>
            <span>{{ $t('performance.title') }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-container>
        <!-- 顶部导航栏 -->
        <el-header class="header">
          <div class="header-content">
            <span class="page-title">{{ getPageTitle() }}</span>
            <div class="header-actions">
              <div class="status-badge" :class="`status-${getStatusType()}`">
                {{ getStatusText() }}
              </div>
              
              <!-- 服务器控制按钮组 -->
              <el-button-group class="control-btn-group">
                <el-button 
                  :type="serverStatus === 'running' ? 'warning' : 'success'"
                  size="small"
                  :disabled="serverStatus === 'starting' || serverStatus === 'stopping'"
                  @click="toggleServer"
                  class="control-btn"
                >
                  <el-icon v-if="serverStatus === 'running'"><VideoPause /></el-icon>
                  <el-icon v-else><VideoPlay /></el-icon>
                  {{ serverStatus === 'running' ? $t('nav.buttons.stop') : $t('nav.buttons.start') }}
                </el-button>
                
                <el-button 
                  type="primary" 
                  size="small"
                  :disabled="serverStatus === 'stopped' || serverStatus === 'starting' || serverStatus === 'stopping'"
                  @click="restartServer"
                  class="control-btn"
                >
                  <el-icon><RefreshRight /></el-icon>
                  {{ $t('nav.buttons.restart') }}
                </el-button>
              </el-button-group>
              
              <el-button type="text" @click="refreshStatus">
                <el-icon><Refresh /></el-icon>
                {{ $t('common.refresh') }}
              </el-button>
              <LanguageSwitcher />
            </div>
          </div>
        </el-header>

        <!-- 主要内容 -->
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ElMessage, ElMessageBox } from 'element-plus';
import api from './api';
import LanguageSwitcher from './components/LanguageSwitcher.vue';

export default {
  name: 'App',
  components: {
    LanguageSwitcher
  },
  setup() {
    const route = useRoute();
    const { t } = useI18n();
    const serverStatus = ref('未知');

    const getPageTitle = () => {
      const titles = {
        '/': t('nav.menu.dashboard'),
        '/config': t('nav.menu.serverConfig'),
        '/players': t('nav.menu.allowlist'),
        '/permissions': t('nav.menu.permission'),
        '/worlds': t('nav.menu.world'),
        '/commands': t('nav.menu.interaction'),
        '/logs': t('nav.menu.logs'),
        '/performance': t('performance.title')
      };
      return titles[route.path] || t('nav.menu.dashboard');
    };

    const getStatusType = () => {
      switch (serverStatus.value) {
        case 'running':
          return 'success';
        case 'stopped':
          return 'danger';
        case 'starting':
        case 'stopping':
          return 'warning';
        default:
          return 'info';
      }
    };

    const getStatusText = () => {
      switch (serverStatus.value) {
        case 'running':
          return t('nav.statusRunning');
        case 'stopped':
          return t('nav.statusStopped');
        case 'starting':
          return t('nav.statusOnline'); // 使用在线状态作为启动中
        case 'stopping':
          return t('nav.statusOffline'); // 使用离线状态作为停止中
        default:
          return t('nav.statusUnknown');
      }
    };

    const refreshStatus = async () => {
      try {
        const response = await api.getServerStatus();
        serverStatus.value = response.data.status;
      } catch (error) {
        console.error('获取服务器状态失败:', error);
        serverStatus.value = '错误';
      }
    };

    // 服务器控制方法
    const startServer = async () => {
      try {
        await ElMessageBox.confirm(
          t('serverManagement.confirmStart'),
          t('serverManagement.confirm'),
          {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            type: 'warning'
          }
        );
        
        serverStatus.value = 'starting';
        await api.startServer();
        ElMessage.success(t('serverManagement.startSuccess'));
        setTimeout(refreshStatus, 2000);
      } catch (error) {
        if (error !== 'cancel') {
          console.error('启动服务器失败:', error);
          ElMessage.error(t('serverManagement.startError'));
          refreshStatus();
        }
      }
    };

    const stopServer = async () => {
      try {
        await ElMessageBox.confirm(
          t('serverManagement.confirmStop'),
          t('serverManagement.confirm'),
          {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            type: 'warning'
          }
        );
        
        serverStatus.value = 'stopping';
        await api.stopServer();
        ElMessage.success(t('serverManagement.stopSuccess'));
        setTimeout(refreshStatus, 2000);
      } catch (error) {
        if (error !== 'cancel') {
          console.error('停止服务器失败:', error);
          ElMessage.error(t('serverManagement.stopError'));
          refreshStatus();
        }
      }
    };

    // 切换服务器状态（启动/停止）
    const toggleServer = async () => {
      if (serverStatus.value === 'running') {
        await stopServer();
      } else {
        await startServer();
      }
    };

    const restartServer = async () => {
      try {
        await ElMessageBox.confirm(
          t('serverManagement.confirmRestart'),
          t('serverManagement.confirm'),
          {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            type: 'warning'
          }
        );
        
        serverStatus.value = 'stopping';
        await api.restartServer();
        ElMessage.success(t('serverManagement.restartSuccess'));
        setTimeout(refreshStatus, 3000);
      } catch (error) {
        if (error !== 'cancel') {
          console.error('重启服务器失败:', error);
          ElMessage.error(t('serverManagement.restartError'));
          refreshStatus();
        }
      }
    };

    onMounted(() => {
      refreshStatus();
      // 每30秒自动刷新状态
      setInterval(refreshStatus, 30000);
    });

    return {
      serverStatus,
      getPageTitle,
      getStatusType,
      getStatusText,
      refreshStatus,
      toggleServer,
      restartServer
    };
  }
};
</script>

<style lang="scss">
.app-container {
  height: 100vh;
}

.sidebar {
  background-color: #304156;
  
  .logo {
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid #434a50;
    
    h2 {
      color: #fff;
      margin: 0;
      font-size: 18px;
    }
  }
  
  .sidebar-menu {
    border: none;
  }
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-bottom: none;
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    
    .page-title {
      font-size: 20px;
      font-weight: 600;
      color: #ffffff;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .status-badge {
        display: inline-flex;
        align-items: center;
        padding: 6px 12px;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        font-weight: 500;
        font-size: 12px;
        color: #333;
        border: 2px solid transparent;
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        &.status-success {
          color: #67c23a;
          border-color: rgba(103, 194, 58, 0.3);
          background: rgba(103, 194, 58, 0.1);
        }
        
        &.status-danger {
          color: #f56c6c;
          border-color: rgba(245, 108, 108, 0.3);
          background: rgba(245, 108, 108, 0.1);
        }
        
        &.status-warning {
          color: #e6a23c;
          border-color: rgba(230, 162, 60, 0.3);
          background: rgba(230, 162, 60, 0.1);
        }
        
        &.status-info {
          color: #909399;
          border-color: rgba(144, 147, 153, 0.3);
          background: rgba(144, 147, 153, 0.1);
        }
      }
      
      .control-btn-group {
        .el-button {
          border-radius: 0;
          padding: 6px 12px;
          font-weight: 500;
          font-size: 12px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          
          &:first-child {
            border-top-left-radius: 16px;
            border-bottom-left-radius: 16px;
          }
          
          &:last-child {
            border-top-right-radius: 16px;
            border-bottom-right-radius: 16px;
          }
          
          &:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            z-index: 1;
          }
          
          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          .el-icon {
            margin-right: 2px;
            font-size: 12px;
          }
        }
      }
      
      .control-btn {
        border-radius: 16px;
        padding: 6px 12px;
        font-weight: 500;
        font-size: 12px;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        
        &:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .el-icon {
          margin-right: 2px;
          font-size: 12px;
        }
      }
      
      .el-button {
         border-radius: 20px;
         padding: 8px 16px;
         font-weight: 500;
         transition: all 0.3s ease;
         background: rgba(255, 255, 255, 0.9);
         backdrop-filter: blur(10px);
         border: 1px solid rgba(255, 255, 255, 0.2);
         color: #667eea;
         box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
         
         &:hover {
           transform: translateY(-1px);
           background: rgba(255, 255, 255, 1);
           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
           color: #5a67d8;
         }
         
         .el-icon {
           margin-right: 4px;
         }
       }
    }
  }
}

.main-content {
  background-color: #f5f5f5;
  padding: 20px;
}
</style>