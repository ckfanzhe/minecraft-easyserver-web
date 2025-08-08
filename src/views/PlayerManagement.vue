<template>
  <div class="player-management">
    <!-- Allowlist Management -->
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
          <el-table-column prop="name" :label="$t('allowlist.playerName')" min-width="200" align="center" />
          <el-table-column prop="ignoresPlayerLimit" :label="$t('allowlist.ignoresPlayerLimit')" min-width="150" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.ignoresPlayerLimit ? 'success' : 'info'">
                {{ scope.row.ignoresPlayerLimit ? $t('allowlist.status.yes') : $t('allowlist.status.no') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('allowlist.actions')" min-width="120" align="center">
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

    <!-- Add Player Dialog -->
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
    
    // Load allowlist
     const loadAllowlist = async () => {
       loading.value = true;
       try {
         const response = await api.getAllowlist();
         allowlist.value = response.data.allowlist || [];
       } catch (error) {
         console.error('Failed to get allowlist:', error);
         ElMessage.error(t('allowlist.messages.loadFailed'));
       } finally {
         loading.value = false;
       }
     };
    
    // Add player to allowlist
    const addPlayer = async () => {
      if (!playerForm.value) return;
      
      try {
        await playerForm.value.validate();
        
        // Check if player already exists
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
        console.error('Failed to add player:', error);
        ElMessage.error(t('allowlist.messages.addFailed'));
      } finally {
        adding.value = false;
      }
    };
    
    // Remove player from allowlist
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
          console.error('Failed to remove player:', error);
          ElMessage.error(t('allowlist.messages.removeFailed'));
        }
      } finally {
        removing.value = '';
      }
    };
    
    // Reset form
    const resetForm = () => {
      newPlayer.name = '';
      newPlayer.ignoresPlayerLimit = false;
      if (playerForm.value) {
        playerForm.value.resetFields();
      }
    };
    
    // Close dialog
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