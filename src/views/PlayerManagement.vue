<template>
  <div class="player-management">
    <!-- 白名单管理 -->
    <el-card class="allowlist-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t('allowlist.title') }}</span>
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            {{ $t('allowlist.addPlayer') }}
          </el-button>
        </div>
      </template>
      
      <div class="allowlist-content">
        <el-table :data="allowlist" v-loading="loading" stripe>
          <el-table-column prop="name" :label="$t('allowlist.playerName')" width="200" />
          <el-table-column prop="ignoresPlayerLimit" :label="$t('allowlist.ignoresPlayerLimit')" width="150">
            <template #default="scope">
              <el-tag :type="scope.row.ignoresPlayerLimit ? 'success' : 'info'">
                {{ scope.row.ignoresPlayerLimit ? $t('allowlist.status.yes') : $t('allowlist.status.no') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('allowlist.actions')" width="120">
            <template #default="scope">
              <el-button
                type="danger"
                size="small"
                @click="removePlayer(scope.row.name)"
                :loading="removing === scope.row.name"
              >
                {{ $t('allowlist.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div v-if="allowlist.length === 0 && !loading" class="empty-state">
          <el-empty :description="$t('allowlist.emptyState')" />
        </div>
      </div>
    </el-card>

    <!-- 添加玩家对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="$t('allowlist.addPlayerDialog.title')"
      width="400px"
      :before-close="handleCloseDialog"
    >
      <el-form :model="newPlayer" :rules="rules" ref="playerForm" label-width="120px">
        <el-form-item :label="$t('allowlist.addPlayerDialog.playerNameLabel')" prop="name">
          <el-input v-model="newPlayer.name" :placeholder="$t('allowlist.addPlayerDialog.playerNamePlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('allowlist.addPlayerDialog.ignoresPlayerLimitLabel')" prop="ignoresPlayerLimit">
          <el-switch v-model="newPlayer.ignoresPlayerLimit" />
          <div class="form-tip">
            {{ $t('allowlist.addPlayerDialog.ignoresPlayerLimitTip') }}
          </div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseDialog">{{ $t('allowlist.addPlayerDialog.cancel') }}</el-button>
          <el-button type="primary" @click="addPlayer" :loading="adding">
            {{ $t('allowlist.addPlayerDialog.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import api from '../api';

export default {
  name: 'PlayerManagement',
  components: {
    Plus
  },
  setup() {
    const { t } = useI18n();
    const allowlist = ref([]);
    const loading = ref(false);
    const adding = ref(false);
    const removing = ref('');
    const showAddDialog = ref(false);
    const playerForm = ref(null);
    
    const newPlayer = reactive({
      name: '',
      ignoresPlayerLimit: false
    });
    
    const rules = computed(() => ({
      name: [
        { required: true, message: t('allowlist.validation.nameRequired'), trigger: 'blur' },
        { min: 3, max: 16, message: t('allowlist.validation.nameLength'), trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9_]+$/, message: t('allowlist.validation.namePattern'), trigger: 'blur' }
      ]
    }));
    
    // 加载白名单
     const loadAllowlist = async () => {
       loading.value = true;
       try {
         const response = await api.getAllowlist();
         allowlist.value = response.data.allowlist || [];
       } catch (error) {
         console.error('获取白名单失败:', error);
         ElMessage.error(t('allowlist.messages.loadFailed'));
       } finally {
         loading.value = false;
       }
     };
    
    // 添加玩家到白名单
    const addPlayer = async () => {
      if (!playerForm.value) return;
      
      try {
        await playerForm.value.validate();
        
        // 检查玩家是否已存在
        if (allowlist.value.some(player => player.name === newPlayer.name)) {
          ElMessage.warning(t('allowlist.messages.playerExists'));
          return;
        }
        
        adding.value = true;
         await api.addToAllowlist({
           name: newPlayer.name,
           ignoresPlayerLimit: newPlayer.ignoresPlayerLimit
         });
        
        ElMessage.success(t('allowlist.messages.addSuccess'));
        showAddDialog.value = false;
        resetForm();
        await loadAllowlist();
      } catch (error) {
        console.error('添加玩家失败:', error);
        ElMessage.error(t('allowlist.messages.addFailed'));
      } finally {
        adding.value = false;
      }
    };
    
    // 从白名单移除玩家
    const removePlayer = async (playerName) => {
      try {
        await ElMessageBox.confirm(
          t('allowlist.messages.removeConfirm', { playerName }),
          t('allowlist.messages.removeConfirmTitle'),
          {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            type: 'warning'
          }
        );
        
        removing.value = playerName;
         await api.removeFromAllowlist(playerName);
        
        ElMessage.success(t('allowlist.messages.removeSuccess'));
        await loadAllowlist();
      } catch (error) {
        if (error !== 'cancel') {
          console.error('移除玩家失败:', error);
          ElMessage.error(t('allowlist.messages.removeFailed'));
        }
      } finally {
        removing.value = '';
      }
    };
    
    // 重置表单
    const resetForm = () => {
      newPlayer.name = '';
      newPlayer.ignoresPlayerLimit = false;
      if (playerForm.value) {
        playerForm.value.resetFields();
      }
    };
    
    // 关闭对话框
    const handleCloseDialog = () => {
      showAddDialog.value = false;
      resetForm();
    };
    
    onMounted(() => {
      loadAllowlist();
    });
    
    return {
      allowlist,
      loading,
      adding,
      removing,
      showAddDialog,
      playerForm,
      newPlayer,
      rules,
      loadAllowlist,
      addPlayer,
      removePlayer,
      handleCloseDialog
    };
  }
};
</script>

<style lang="scss" scoped>
.player-management {
  .allowlist-card {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      span {
        font-size: 18px;
        font-weight: 600;
      }
    }
    
    .allowlist-content {
      .empty-state {
        padding: 40px 0;
      }
    }
  }
  
  .form-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 5px;
    line-height: 1.4;
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}

:deep(.el-table) {
  .el-table__row {
    &:hover {
      background-color: #f5f7fa;
    }
  }
}

:deep(.el-dialog) {
  .el-dialog__header {
    padding: 20px 20px 10px;
    
    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
    }
  }
  
  .el-dialog__body {
    padding: 10px 20px 20px;
  }
  
  .el-dialog__footer {
    padding: 10px 20px 20px;
  }
}
</style>