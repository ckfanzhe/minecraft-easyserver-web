<template>
  <div class="world-management">
    <!-- 上传区域 -->
    <el-card class="upload-card" shadow="hover">
      <template #header>
        <div class="upload-header">
          <el-icon class="upload-icon"><FolderOpened /></el-icon>
          <span>{{ $t('world.upload') }}</span>
        </div>
      </template>
      
      <div class="upload-area">
        <el-upload
          ref="uploadRef"
          :auto-upload="false"
          :show-file-list="true"
          :limit="1"
          accept=".zip,.mcworld"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
          drag
          class="upload-dragger"
        >
          <div class="upload-content">
            <el-icon class="upload-main-icon"><upload-filled /></el-icon>
            <div class="upload-text">
              <p class="upload-title">{{ $t('world.uploadDesc') }}</p>
              <p class="upload-hint">拖拽文件到此处或点击选择</p>
            </div>
          </div>
          
        </el-upload>
        
        <div class="upload-actions" v-if="uploadForm.file">
          <el-button 
            type="primary" 
            @click="uploadWorld"
            :loading="uploading"
            size="large"
          >
            <el-icon v-if="!uploading"><Upload /></el-icon>
            {{ uploading ? '上传中...' : '立即上传' }}
          </el-button>
          <el-button @click="clearUpload" size="large">
            <el-icon><Close /></el-icon>
            清除
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 世界列表 -->
    <el-card class="world-list-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t('world.title') }}</span>
          <el-button type="text" @click="fetchWorlds" :loading="loading">
            <el-icon><Refresh /></el-icon>
            {{ $t('common.refresh') }}
          </el-button>
        </div>
      </template>
      
      <div class="world-content">
        <el-table 
          :data="worlds" 
          v-loading="loading"
          style="width: 100%"
          empty-text="暂无世界文件"
          stripe
        >
          <el-table-column prop="name" :label="$t('common.name')" min-width="250" show-overflow-tooltip />
          <el-table-column :label="$t('common.status')" width="140" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.active ? 'success' : 'info'">
                {{ scope.row.active ? $t('world.current') : $t('common.inactive') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.actions')" width="180" align="center">
            <template #default="scope">
              <el-button 
                v-if="!scope.row.active"
                type="primary" 
                size="small" 
                @click="activateWorld(scope.row.name)"
                :loading="activating === scope.row.name"
              >
                {{ $t('common.activate') }}
              </el-button>
              <el-button 
                type="danger" 
                size="small" 
                @click="confirmDeleteWorld(scope.row.name)"
                :loading="deleting === scope.row.name"
                :disabled="scope.row.active"
              >
                {{ $t('common.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Upload, UploadFilled, FolderOpened, Close, Refresh } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import api from '@/api';

export default {
  name: 'WorldManagement',
  components: {
    Upload,
    UploadFilled,
    FolderOpened,
    Close,
    Refresh
  },
  setup() {
    const { t } = useI18n();
    
    const worlds = ref([]);
    const loading = ref(false);
    const uploading = ref(false);
    const activating = ref('');
    const deleting = ref('');
    const uploadRef = ref(null);
    
    const uploadForm = reactive({
      file: null
    });

    // 获取世界列表
    const fetchWorlds = async () => {
      try {
        loading.value = true;
        const response = await api.getWorlds();
        worlds.value = response.data.worlds || [];
      } catch (error) {
        console.error('获取世界列表失败:', error);
        ElMessage.error(t('common.loadFailed'));
      } finally {
        loading.value = false;
      }
    };

    // 处理文件选择
    const handleFileChange = (file) => {
      uploadForm.file = file.raw;
    };

    // 处理文件移除
    const handleFileRemove = () => {
      uploadForm.file = null;
    };

    // 上传世界文件
    const uploadWorld = async () => {
      if (!uploadForm.file) {
        ElMessage.warning(t('common.selectFile'));
        return;
      }

      try {
        uploading.value = true;
        const formData = new FormData();
        formData.append('world', uploadForm.file);
        
        await api.uploadWorld(formData);
        ElMessage.success(t('message.worldUploaded'));
        
        clearUpload();
        await fetchWorlds();
      } catch (error) {
        console.error('上传世界文件失败:', error);
        ElMessage.error(t('common.operationFailed'));
      } finally {
        uploading.value = false;
      }
    };

    // 清除上传
    const clearUpload = () => {
      uploadForm.file = null;
      uploadRef.value?.clearFiles();
    };

    // 激活世界
    const activateWorld = async (worldName) => {
      try {
        activating.value = worldName;
        await api.activateWorld(worldName);
        ElMessage.success(t('message.worldActivated'));
        await fetchWorlds();
      } catch (error) {
        console.error('激活世界失败:', error);
        ElMessage.error(t('common.operationFailed'));
      } finally {
        activating.value = '';
      }
    };

    // 确认删除世界
    const confirmDeleteWorld = async (worldName) => {
      try {
        await ElMessageBox.confirm(
          t('world.deleteConfirm', { worldName }),
          t('common.warning'),
          {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            type: 'warning'
          }
        );
        await deleteWorld(worldName);
      } catch (error) {
        // 用户取消删除
      }
    };

    // 删除世界
    const deleteWorld = async (worldName) => {
      try {
        deleting.value = worldName;
        await api.deleteWorld(worldName);
        ElMessage.success(t('message.worldDeleted'));
        await fetchWorlds();
      } catch (error) {
        console.error('删除世界失败:', error);
        ElMessage.error(t('common.operationFailed'));
      } finally {
        deleting.value = '';
      }
    };

    onMounted(() => {
      fetchWorlds();
    });

    return {
      worlds,
      loading,
      uploading,
      activating,
      deleting,
      uploadRef,
      uploadForm,
      fetchWorlds,
      handleFileChange,
      handleFileRemove,
      uploadWorld,
      clearUpload,
      activateWorld,
      confirmDeleteWorld
    };
  }
};
</script>

<style lang="scss" scoped>
.world-management {
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  .upload-card {
    .upload-header {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .upload-icon {
        font-size: 20px;
        color: #667eea;
      }
      
      span {
        font-weight: 600;
        color: #303133;
      }
    }
    
    .upload-area {
      padding: 20px 0;
    }
  }
  
  .world-list-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .world-content {
      padding: 20px 0;
    }
  }
}

:deep(.upload-dragger) {
  .el-upload-dragger {
    border: 2px dashed #d9d9d9;
    border-radius: 8px;
    background-color: #fafbfc;
    padding: 30px 20px;
    transition: all 0.3s ease;
    min-height: 120px;
    
    &:hover {
      border-color: #667eea;
      background-color: #f8f9ff;
      
      .upload-main-icon {
        transform: translateY(-3px);
        color: #667eea;
      }
    }
    
    &.is-dragover {
      border-color: #667eea;
      background-color: #f0f2ff;
    }
  }
  
  .upload-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    
    .upload-main-icon {
      font-size: 48px;
      color: #c0c4cc;
      transition: all 0.3s ease;
    }
    
    .upload-text {
      text-align: left;
      
      .upload-title {
        margin: 0 0 4px 0;
        font-size: 16px;
        font-weight: 500;
        color: #303133;
      }
      
      .upload-hint {
        margin: 0;
        font-size: 14px;
        color: #909399;
      }
    }
  }
  
  .upload-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 12px;
    padding: 8px 12px;
    background-color: #f5f7fa;
    border-radius: 6px;
    
    span {
      font-size: 12px;
      color: #606266;
    }
  }
  
  .el-upload-list {
    margin-top: 16px;
    
    .el-upload-list__item {
      border-radius: 6px;
      border: 1px solid #e4e7ed;
      background-color: white;
      
      &:hover {
        background-color: #f8f9ff;
      }
    }
  }
}

.upload-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
  
  .el-button {
    border-radius: 6px;
    padding: 10px 20px;
    font-weight: 500;
    
    &.el-button--primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      
      &:hover {
        background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
      }
    }
  }
}
</style>