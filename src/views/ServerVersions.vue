<template>
  <div class="server-versions">
    <el-card>
      <template #header>
        <div class="card-header">
          <div>
            <h3>{{ $t('server.versions.title') }}</h3>
            <p class="description">{{ $t('server.versions.description') }}</p>
          </div>
          <el-button 
            type="primary" 
            :loading="updating" 
            @click="updateVersionList"
            :icon="Refresh"
          >
            {{ $t('server.versions.update') }}
          </el-button>
        </div>
      </template>
      
      <div class="versions-content" v-loading="loading">
        <div v-if="versions.length === 0" class="empty-state">
          <el-empty :description="$t('server.versions.empty')" />
        </div>
        
        <div v-else class="versions-grid">
          <div 
            v-for="version in versions" 
            :key="version.version" 
            class="version-card"
            :class="{ 'active': version.active, 'downloaded': version.downloaded }"
          >
            <div class="version-header">
              <div class="version-info">
                <h4 class="version-number">{{ version.version }}</h4>
                <p class="version-description">{{ version.description }}</p>
                <p class="version-date" v-if="version.release_date">
                  {{ formatDate(version.release_date) }}
                </p>
              </div>
              <div class="version-status">
                <el-tag v-if="version.active" type="success" size="small">
                  {{ $t('server.versions.active') }}
                </el-tag>
                <el-tag v-else-if="version.downloaded" type="info" size="small">
                  {{ $t('server.versions.downloaded') }}
                </el-tag>
              </div>
            </div>
            
            <div class="version-actions">
              <!-- 下载按钮 -->
              <el-button 
                v-if="!version.downloaded"
                type="primary"
                size="small"
                :loading="downloadingVersions.includes(version.version)"
                @click="downloadVersion(version.version)"
                :icon="Download"
              >
                {{ $t('server.versions.download') }}
              </el-button>
              
              <!-- 下载进度 -->
              <div v-if="downloadingVersions.includes(version.version)" class="download-progress">
                <el-progress 
                  :percentage="getDownloadProgress(version.version)" 
                  :status="getProgressStatus(version.version)"
                  :stroke-width="6"
                />
                <p class="progress-text">{{ getProgressText(version.version) }}</p>
              </div>
              
              <!-- 激活按钮 -->
              <el-button 
                v-if="version.downloaded && !version.active"
                type="success"
                size="small"
                :loading="activating === version.version"
                @click="activateVersion(version.version)"
                :icon="Check"
              >
                {{ $t('server.versions.activate') }}
              </el-button>
              
              <!-- 当前激活标识 -->
              <div v-if="version.active" class="active-indicator">
                <el-icon class="active-icon"><CircleCheckFilled /></el-icon>
                <span>{{ $t('server.versions.active') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { 
  Refresh, 
  Download, 
  Check, 
  CircleCheckFilled 
} from '@element-plus/icons-vue'
import api from '@/api'

export default {
  name: 'ServerVersions',
  components: {
    Refresh,
    Download,
    Check,
    CircleCheckFilled
  },
  setup() {
    const { t } = useI18n()
    
    const loading = ref(false)
    const updating = ref(false)
    const activating = ref('')
    const versions = ref([])
    const downloadingVersions = ref([])
    const downloadProgress = reactive({})
    
    let progressInterval = null
    
    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString()
    }
    
    // 获取下载进度
    const getDownloadProgress = (version) => {
      const progress = downloadProgress[version]?.progress || 0
      return Math.round(progress * 100) / 100 // 保留两位小数
    }
    
    // 获取进度状态
    const getProgressStatus = (version) => {
      const progress = downloadProgress[version]
      if (!progress) return ''
      if (progress.status === 'error') return 'exception'
      if (progress.progress === 100) return 'success'
      return ''
    }
    
    // 获取进度文本
    const getProgressText = (version) => {
      const progress = downloadProgress[version]
      if (!progress) return ''
      
      if (progress.status === 'downloading') {
        return t('server.versions.downloading')
      } else if (progress.status === 'extracting') {
        return t('server.versions.extracting')
      } else if (progress.status === 'error') {
        return t('server.versions.downloadFailed')
      }
      
      return progress.message || ''
    }
    
    // 加载版本列表
    const loadVersions = async () => {
      loading.value = true
      try {
        const response = await api.getServerVersions()
        if (response.data.success) {
          versions.value = response.data.data || []
        } else {
          ElMessage.error('获取版本列表失败')
        }
      } catch (error) {
        console.error('Failed to load versions:', error)
        ElMessage.error('获取版本列表失败')
      } finally {
        loading.value = false
      }
    }
    
    // 更新版本列表
    const updateVersionList = async () => {
      updating.value = true
      try {
        // 调用更新版本配置的API接口
        await api.updateVersionConfig({})
        // 更新配置后重新加载版本列表
        await loadVersions()
        ElMessage.success('版本列表已更新')
      } catch (error) {
        console.error('Failed to update versions:', error)
        ElMessage.error('更新版本列表失败')
      } finally {
        updating.value = false
      }
    }
    
    // 下载版本
    const downloadVersion = async (version) => {
      try {
        downloadingVersions.value.push(version)
        downloadProgress[version] = { progress: 0, status: 'downloading', message: '' }
        
        await api.downloadServerVersion(version)
        ElMessage.success(`开始下载版本 ${version}`)
        
        // 开始监控下载进度
        startProgressMonitoring(version)
        
      } catch (error) {
        console.error('Failed to download version:', error)
        ElMessage.error(`下载版本 ${version} 失败`)
        downloadingVersions.value = downloadingVersions.value.filter(v => v !== version)
        delete downloadProgress[version]
      }
    }
    
    // 监控下载进度
    const startProgressMonitoring = (version) => {
      const checkProgress = async () => {
        try {
          const response = await api.getDownloadProgress(version)
          let progress
          if (response.data.success) {
            progress = response.data.data
            downloadProgress[version] = progress
          } else {
            throw new Error(response.data.message || 'Failed to get progress')
          }
          
          // 如果下载完成或失败，停止监控
          if (progress.progress >= 100 || progress.status === 'error' || progress.status === 'completed') {
            downloadingVersions.value = downloadingVersions.value.filter(v => v !== version)
            
            if (progress.status === 'completed' || progress.progress >= 100) {
              ElMessage.success(`版本 ${version} 下载完成`)
              // 重新加载版本列表以更新状态
              await loadVersions()
            } else if (progress.status === 'error') {
              ElMessage.error(`版本 ${version} 下载失败`)
            }
            
            delete downloadProgress[version]
            return
          }
          
          // 继续监控
          setTimeout(checkProgress, 1000)
          
        } catch (error) {
          console.error('Failed to get download progress:', error)
          downloadingVersions.value = downloadingVersions.value.filter(v => v !== version)
          delete downloadProgress[version]
        }
      }
      
      checkProgress()
    }
    
    // 激活版本
    const activateVersion = async (version) => {
      try {
        await ElMessageBox.confirm(
          t('server.versions.activateConfirm', { version }),
          t('common.confirm'),
          {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            type: 'warning'
          }
        )
        
        activating.value = version
        await api.activateServerVersion(version)
        
        ElMessage.success(t('server.versions.activated'))
        // 重新加载版本列表以更新状态
        await loadVersions()
        
      } catch (error) {
        if (error !== 'cancel') {
          console.error('Failed to activate version:', error)
          ElMessage.error(t('server.versions.activateFailed'))
        }
      } finally {
        activating.value = ''
      }
    }
    
    onMounted(() => {
      loadVersions()
    })
    
    onUnmounted(() => {
      if (progressInterval) {
        clearInterval(progressInterval)
      }
    })
    
    return {
      loading,
      updating,
      activating,
      versions,
      downloadingVersions,
      downloadProgress,
      Refresh,
      Download,
      Check,
      CircleCheckFilled,
      formatDate,
      getDownloadProgress,
      getProgressStatus,
      getProgressText,
      updateVersionList,
      downloadVersion,
      activateVersion
    }
  }
}
</script>

<style lang="scss" scoped>
.server-versions {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    
    .description {
      margin: 8px 0 0 0;
      color: var(--el-text-color-regular);
      font-size: 14px;
    }
  }
  
  .versions-content {
    padding: 20px;
  }
  
  .empty-state {
    text-align: center;
    padding: 40px 0;
  }
  
  .versions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 20px;
  }
  
  .version-card {
    border: 2px solid var(--el-border-color-light);
    border-radius: 8px;
    padding: 20px;
    transition: all 0.3s ease;
    background: var(--el-bg-color);
    
    &:hover {
      border-color: var(--el-color-primary-light-7);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    &.active {
      border-color: var(--el-color-success);
      background: var(--el-color-success-light-9);
    }
    
    &.downloaded {
      border-color: var(--el-color-info);
    }
  }
  
  .version-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }
  
  .version-info {
    flex: 1;
    
    .version-number {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
    
    .version-description {
      margin: 0 0 4px 0;
      color: var(--el-text-color-regular);
      font-size: 14px;
    }
    
    .version-date {
      margin: 0;
      color: var(--el-text-color-placeholder);
      font-size: 12px;
    }
  }
  
  .version-status {
    margin-left: 16px;
  }
  
  .version-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .download-progress {
      .progress-text {
        margin: 8px 0 0 0;
        font-size: 12px;
        color: var(--el-text-color-regular);
        text-align: center;
      }
    }
    
    .active-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--el-color-success);
      font-weight: 500;
      
      .active-icon {
        font-size: 16px;
      }
    }
  }
}
</style>