<template>
  <div class="resource-pack-management">
    <!-- Upload Area -->
    <el-card class="upload-card" shadow="hover">
      <template #header>
        <div class="upload-header">
          <el-icon class="upload-icon"><FolderOpened /></el-icon>
          <span>{{ $t('resourcepack.upload') }}</span>
        </div>
      </template>
      
      <div class="upload-area">
        <el-upload
          ref="uploadRef"
          :auto-upload="false"
          :show-file-list="true"
          :limit="1"
          accept=".zip,.mcpack"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
          drag
          class="upload-dragger"
        >
          <div class="upload-content">
            <el-icon class="upload-main-icon"><upload-filled /></el-icon>
            <div class="upload-text">
              <p class="upload-title">{{ $t('resourcepack.uploadDesc') }}</p>
              <p class="upload-hint">{{ $t('resourcepack.uploadHint') }}</p>
            </div>
          </div>
          
        </el-upload>
        
        <div class="upload-actions" v-if="uploadForm.file">
          <el-button 
            type="primary" 
            @click="uploadResourcePack"
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
        
        <div class="upload-note">
          <el-icon><InfoFilled /></el-icon>
          <span>{{ $t('resourcepack.uploadNote') }}</span>
        </div>
      </div>
    </el-card>

    <!-- Resource Pack List -->
    <el-card class="resource-pack-list-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t('resourcepack.title') }}</span>
          <el-button type="text" @click="fetchResourcePacks" :loading="loading">
            <el-icon><Refresh /></el-icon>
            {{ $t('common.refresh') }}
          </el-button>
        </div>
      </template>
      
      <div class="resource-pack-content">
        <el-table 
          :data="resourcePacks" 
          v-loading="loading"
          style="width: 100%"
          :empty-text="$t('resourcepack.empty')"
          stripe
        >
          <el-table-column prop="name" :label="$t('common.name')" min-width="200" show-overflow-tooltip />
          <el-table-column prop="description" :label="$t('common.description')" min-width="250" show-overflow-tooltip />
          <el-table-column :label="$t('common.version')" width="120" align="center">
            <template #default="scope">
              <span v-if="scope.row.version">{{ scope.row.version.join('.') }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.status')" width="140" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.active ? 'success' : 'info'">
                {{ scope.row.active ? $t('common.active') : $t('common.inactive') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.actions')" width="200" align="center">
            <template #default="scope">
              <el-button 
                v-if="!scope.row.active"
                type="primary" 
                size="small" 
                @click="activateResourcePack(scope.row.uuid)"
                :loading="activating === scope.row.uuid"
              >
                {{ $t('common.activate') }}
              </el-button>
              <el-button 
                v-else
                type="warning" 
                size="small" 
                @click="deactivateResourcePack(scope.row.uuid)"
                :loading="deactivating === scope.row.uuid"
              >
                {{ $t('common.deactivate') }}
              </el-button>
              <el-button 
                type="danger" 
                size="small" 
                @click="confirmDeleteResourcePack(scope.row)"
                :loading="deleting === scope.row.uuid"
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
import { Upload, UploadFilled, FolderOpened, Close, Refresh, InfoFilled } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import api from '@/api';

export default {
  name: 'ResourcePackManagement',
  components: {
    Upload,
    UploadFilled,
    FolderOpened,
    Close,
    Refresh,
    InfoFilled
  },
  setup() {
    const { t } = useI18n();
    
    const resourcePacks = ref([]);
    const loading = ref(false);
    const uploading = ref(false);
    const activating = ref('');
    const deactivating = ref('');
    const deleting = ref('');
    const uploadRef = ref(null);
    
    const uploadForm = reactive({
      file: null
    });

    // Get resource pack list
    const fetchResourcePacks = async () => {
      try {
        loading.value = true;
        const response = await api.getResourcePacks();
        resourcePacks.value = response.data.resource_packs || [];
      } catch (error) {
        console.error('Failed to get resource pack list:', error);
        if (error.response && error.response.data && error.response.data.error) {
          ElMessage.error(`加载失败: ${error.response.data.error}`);
        } else if (error.request) {
          ElMessage.error('网络请求失败，请检查网络连接');
        } else {
          ElMessage.error(t('common.loadFailed'));
        }
      } finally {
        loading.value = false;
      }
    };

    // Handle file selection
    const handleFileChange = (file) => {
      uploadForm.file = file.raw;
    };

    // Handle file removal
    const handleFileRemove = () => {
      uploadForm.file = null;
    };

    // Upload resource pack file
    const uploadResourcePack = async () => {
      if (!uploadForm.file) {
        ElMessage.warning(t('common.selectFile'));
        return;
      }

      try {
        uploading.value = true;
        const formData = new FormData();
        formData.append('resource_pack', uploadForm.file);
        
        await api.uploadResourcePack(formData);
        ElMessage.success('资源包上传成功');
        
        clearUpload();
        await fetchResourcePacks();
      } catch (error) {
        console.error('Failed to upload resource pack file:', error);
        if (error.response && error.response.data && error.response.data.error) {
          ElMessage.error(`上传失败: ${error.response.data.error}`);
        } else if (error.request) {
          ElMessage.error('网络请求失败，请检查网络连接');
        } else {
          ElMessage.error(t('common.operationFailed'));
        }
      } finally {
        uploading.value = false;
      }
    };

    // Clear upload
    const clearUpload = () => {
      uploadForm.file = null;
      uploadRef.value?.clearFiles();
    };

    // Activate resource pack
    const activateResourcePack = async (uuid) => {
      try {
        activating.value = uuid;
        await api.activateResourcePack(uuid);
        ElMessage.success('资源包激活成功');
        await fetchResourcePacks();
      } catch (error) {
        console.error('Failed to activate resource pack:', error);
        if (error.response && error.response.data && error.response.data.error) {
          ElMessage.error(`激活失败: ${error.response.data.error}`);
        } else if (error.request) {
          ElMessage.error('网络请求失败，请检查网络连接');
        } else {
          ElMessage.error(t('common.operationFailed'));
        }
      } finally {
        activating.value = '';
      }
    };

    // Deactivate resource pack
    const deactivateResourcePack = async (uuid) => {
      try {
        deactivating.value = uuid;
        await api.deactivateResourcePack(uuid);
        ElMessage.success('资源包停用成功');
        await fetchResourcePacks();
      } catch (error) {
        console.error('Failed to deactivate resource pack:', error);
        if (error.response && error.response.data && error.response.data.error) {
          ElMessage.error(`停用失败: ${error.response.data.error}`);
        } else if (error.request) {
          ElMessage.error('网络请求失败，请检查网络连接');
        } else {
          ElMessage.error(t('common.operationFailed'));
        }
      } finally {
        deactivating.value = '';
      }
    };

    // Confirm delete resource pack
    const confirmDeleteResourcePack = async (resourcePack) => {
      try {
        await ElMessageBox.confirm(
          t('resourcepack.deleteConfirm'),
          t('common.warning'),
          {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            type: 'warning'
          }
        );
        await deleteResourcePack(resourcePack.uuid);
      } catch (error) {
        // User cancelled deletion
      }
    };

    // Delete resource pack
    const deleteResourcePack = async (uuid) => {
      try {
        deleting.value = uuid;
        await api.deleteResourcePack(uuid);
        ElMessage.success('资源包删除成功');
        await fetchResourcePacks();
      } catch (error) {
        console.error('Failed to delete resource pack:', error);
        if (error.response && error.response.data && error.response.data.error) {
          ElMessage.error(`删除失败: ${error.response.data.error}`);
        } else if (error.request) {
          ElMessage.error('网络请求失败，请检查网络连接');
        } else {
          ElMessage.error(t('common.operationFailed'));
        }
      } finally {
        deleting.value = '';
      }
    };

    onMounted(() => {
      fetchResourcePacks();
    });

    return {
      resourcePacks,
      loading,
      uploading,
      activating,
      deactivating,
      deleting,
      uploadRef,
      uploadForm,
      fetchResourcePacks,
      handleFileChange,
      handleFileRemove,
      uploadResourcePack,
      clearUpload,
      activateResourcePack,
      deactivateResourcePack,
      confirmDeleteResourcePack
    };
  }
};
</script>

<style lang="scss" scoped>
.resource-pack-management {
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
    
    .upload-note {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      padding: 12px 16px;
      background-color: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 8px;
      color: #0369a1;
      font-size: 14px;
      
      .el-icon {
        font-size: 16px;
        color: #0284c7;
      }
    }
  }
  
  .resource-pack-list-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .resource-pack-content {
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