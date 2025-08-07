<template>
  <div id="app">
    <!-- 登录页面独立显示 -->
    <router-view v-if="$route.path === '/login'" />
    
    <!-- 主应用布局 -->
    <el-container v-else class="app-container">
      <!-- Sidebar -->
      <el-aside :width="isCollapsed ? '64px' : '250px'" class="sidebar">
        <div class="logo">
          <h2 v-if="!isCollapsed">🎮 {{ $t('nav.title') }}</h2>
          <h2 v-else>🎮</h2>
        </div>
        <el-menu
          :default-active="$route.path"
          router
          class="sidebar-menu"
          :collapse="isCollapsed"
          background-color="transparent"
          text-color="rgba(255, 255, 255, 0.9)"
          active-text-color="#ffffff"
          :collapse-transition="false"
        >
          <el-menu-item index="/">
            <el-icon><Odometer /></el-icon>
            <span>{{ $t('nav.menu.dashboard') }}</span>
          </el-menu-item>
          
          <!-- Server Management Submenu -->
          <el-sub-menu index="server">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>{{ $t('nav.menu.serverManagement') }}</span>
            </template>
            <el-menu-item index="/config">
              <el-icon><Setting /></el-icon>
              <span>{{ $t('nav.menu.serverConfig') }}</span>
            </el-menu-item>
            <el-menu-item index="/versions">
              <el-icon><VideoPlay /></el-icon>
              <span>{{ $t('nav.menu.versions') }}</span>
            </el-menu-item>
            <el-menu-item index="/performance">
              <el-icon><TrendCharts /></el-icon>
              <span>{{ $t('performance.title') }}</span>
            </el-menu-item>
          </el-sub-menu>
          
          <!-- Player Management Submenu -->
          <el-sub-menu index="players">
            <template #title>
              <el-icon><User /></el-icon>
              <span>{{ $t('nav.menu.playerManagement') }}</span>
            </template>
            <el-menu-item index="/players">
              <el-icon><User /></el-icon>
              <span>{{ $t('nav.menu.allowlist') }}</span>
            </el-menu-item>
            <el-menu-item index="/permissions">
              <el-icon><Key /></el-icon>
              <span>{{ $t('nav.menu.permission') }}</span>
            </el-menu-item>
          </el-sub-menu>
          
          <!-- World Management Submenu -->
          <el-sub-menu index="world">
            <template #title>
              <el-icon><Baseball /></el-icon>
              <span>{{ $t('nav.menu.worldManagement') }}</span>
            </template>
            <el-menu-item index="/worlds">
              <el-icon><Baseball /></el-icon>
              <span>{{ $t('nav.menu.world') }}</span>
            </el-menu-item>
            <el-menu-item index="/resource-packs">
              <el-icon><Box /></el-icon>
              <span>{{ $t('nav.menu.resourcepack') }}</span>
            </el-menu-item>
          </el-sub-menu>
          
          <!-- Interaction and Logs Submenu -->
          <el-sub-menu index="interaction">
            <template #title>
              <el-icon><ChatLineSquare /></el-icon>
              <span>{{ $t('nav.menu.interactionLogs') }}</span>
            </template>
            <el-menu-item index="/commands">
              <el-icon><ChatLineSquare /></el-icon>
              <span>{{ $t('nav.menu.interaction') }}</span>
            </el-menu-item>
            <el-menu-item index="/logs">
              <el-icon><Document /></el-icon>
              <span>{{ $t('nav.menu.logs') }}</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- Main Content Area -->
      <el-container>
        <!-- Top Navigation Bar -->
        <el-header height="60px" class="header">
          <div class="header-content">
            <div class="header-left">
              <div class="collapse-btn" @click="toggleCollapse">
                <el-icon><ArrowRight v-if="isCollapsed" /><ArrowLeft v-else /></el-icon>
              </div>
              <span class="page-title">{{ getPageTitle() }}</span>
            </div>
            <div class="header-actions">
              <div class="status-badge" :class="`status-${getStatusType()}`">
                {{ getStatusText() }}
              </div>
              
              <!-- Server Control Button Group -->
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
              <LanguageSwitcher />
              
              <!-- 退出登录按钮 -->
              <el-button 
                type="danger" 
                size="small"
                @click="logout"
                class="logout-btn"
              >
                <el-icon><SwitchButton /></el-icon>
                {{ $t('nav.buttons.logout') }}
              </el-button>
            </div>
          </div>
        </el-header>

        <!-- Main Content -->
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ElMessage, ElMessageBox } from 'element-plus';
import { 
  Odometer, 
  Setting, 
  User, 
  Key, 
  Baseball, 
  Box,
  ChatLineSquare, 
  Document, 
  TrendCharts,
  VideoPlay,
  VideoPause,
  Refresh,
  RefreshRight,
  ArrowLeft,
  ArrowRight,
  SwitchButton
} from '@element-plus/icons-vue';
import api from './api';
import LanguageSwitcher from './components/LanguageSwitcher.vue';

export default {
  name: 'App',
  components: {
    LanguageSwitcher,
    Odometer,
    Setting,
    User,
    Key,
    Baseball,
    Box,
    ChatLineSquare,
    Document,
    TrendCharts,
    VideoPlay,
    VideoPause,
    Refresh,
    RefreshRight,
    ArrowLeft,
    ArrowRight
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { t } = useI18n();
    const serverStatus = ref('未知');
    const isCollapsed = ref(false);

    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value;
    };

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
          return t('nav.statusOnline'); // Use online status for starting
        case 'stopping':
          return t('nav.statusOffline'); // Use offline status for stopping
        default:
          return t('nav.statusUnknown');
      }
    };

    const refreshStatus = async () => {
      try {
        const response = await api.getServerStatus();
        serverStatus.value = response.data.status;
      } catch (error) {
        console.error('Failed to get server status:', error);
        serverStatus.value = '错误';
      }
    };

    // Server control methods
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
          console.error('Failed to start server:', error);
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
          console.error('Failed to stop server:', error);
          ElMessage.error(t('serverManagement.stopError'));
          refreshStatus();
        }
      }
    };

    // Toggle server status (start/stop)
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
          console.error('Failed to restart server:', error);
          ElMessage.error(t('serverManagement.restartError'));
          refreshStatus();
        }
      }
    };

    // 退出登录
    const logout = () => {
      // 清除本地存储的token
      localStorage.removeItem('token');
      // 跳转到登录页面
      router.push('/login');
      ElMessage.success(t('auth.logout.success'));
    };

    onMounted(() => {
      // 只有在用户已登录时才开始定时查询
      const token = localStorage.getItem('token');
      if (token) {
        refreshStatus();
        // Auto refresh status every 30 seconds
        setInterval(refreshStatus, 30000);
      }
    });

    return {
      serverStatus,
      isCollapsed,
      toggleCollapse,
      getPageTitle,
      getStatusType,
      getStatusText,
      refreshStatus,
      toggleServer,
      restartServer,
      logout
    };
  }
};
</script>

<style lang="scss">
// 全局样式重置
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

// 确保登录页面全屏显示
body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.app-container {
  height: 100vh;
}

.sidebar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  transition: width 0.3s ease;
  
  // Custom scrollbar styles
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    transition: background 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
  
  .logo {
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    position: relative;
    
    h2 {
      color: #ffffff;
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
  }
  

  
  .sidebar-menu {
    border: none;
    background: transparent;
    
    &.el-menu--collapse {
      .el-menu-item {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 8px 6px;
        padding: 0;
        width: 52px;
        height: 52px;
        
        .el-icon {
          margin: 0;
          font-size: 18px;
        }
      }
      
      .el-sub-menu {
        .el-sub-menu__title {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 8px 6px;
          padding: 0;
          width: 52px;
          height: 52px;
          
          .el-icon {
            margin: 0;
            font-size: 18px;
          }
        }
      }
    }
    
    .el-menu-item {
      background: rgba(255, 255, 255, 0.1);
      margin: 8px 12px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      color: rgba(255, 255, 255, 0.9);
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateX(4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        color: #ffffff;
      }
      
      &.is-active {
        background: rgba(255, 255, 255, 0.9);
        color: #667eea;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        
        .el-icon {
          color: #667eea;
        }
      }
      
      .el-icon {
        color: rgba(255, 255, 255, 0.8);
        transition: color 0.3s ease;
      }
      
      span {
        font-weight: 500;
      }
    }
    
    .el-sub-menu {
      .el-sub-menu__title {
        background: rgba(255, 255, 255, 0.1);
        margin: 8px 12px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        color: rgba(255, 255, 255, 0.9);
        
        &:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          color: #ffffff;
        }
        
        .el-icon {
          color: rgba(255, 255, 255, 0.8);
          transition: color 0.3s ease;
        }
        
        span {
          font-weight: 500;
        }
      }
      
      .el-menu {
        background: transparent;
        
        .el-menu-item {
          margin: 4px 20px;
          padding-left: 40px;
          background: rgba(255, 255, 255, 0.05);
          
          &:hover {
            background: rgba(255, 255, 255, 0.15);
          }
        }
      }
    }
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
      
      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .collapse-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          
          &:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
          }
          
          .el-icon {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
          }
        }
        
        .page-title {
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
      }
      
      .header-actions {
        display: flex;
        align-items: center;
        gap: 16px;
        
        .logout-btn {
          margin-left: 8px;
          border-radius: 6px;
          font-weight: 500;
          transition: all 0.3s ease;
          
          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
          }
        }
      }
      
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


.main-content {
  background-color: #f5f5f5;
  padding: 20px;
}
</style>