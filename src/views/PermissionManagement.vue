<template>
  <div class="permission-management">
    <!-- Permission Management -->
    <el-card class="permission-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t('permission.title') }}</span>
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            {{ $t('permission.add') }}
          </el-button>
        </div>
      </template>
      
      <div class="permission-content">
        <el-table :data="permissions" v-loading="loading" stripe>
          <el-table-column prop="xuid" :label="$t('permission.playerXuid')" min-width="200" align="center" />
          <el-table-column prop="permission" :label="$t('permission.permissionLevel')" min-width="150" align="center">
            <template #default="scope">
              <el-tag :type="getPermissionTagType(scope.row.permission)">
                {{ $t(`permission.levels.${scope.row.permission}`) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('permission.actions')" min-width="120" align="center">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="editPermission(scope.row)"
                style="margin-right: 8px;"
              >
                {{ $t('common.edit') }}
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="removePermission(scope.row.xuid)"
                :loading="removing === scope.row.xuid"
              >
                {{ $t('permission.remove') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div v-if="permissions.length === 0 && !loading" class="empty-state">
          <el-empty :description="$t('permission.empty')" />
        </div>
      </div>
    </el-card>

    <!-- Add/Edit Permission Dialog -->
    <el-dialog
      v-model="showAddDialog"
      :title="isEditing ? $t('permission.editDialog.title') : $t('permission.addDialog.title')"
      width="400px"
      :before-close="handleCloseDialog"
    >
      <el-form :model="newPermission" :rules="rules" ref="permissionForm" label-width="120px">
        <el-form-item :label="$t('permission.addDialog.xuidsLabel')" prop="xuid">
          <el-input 
            v-model="newPermission.xuid" 
            :placeholder="$t('permission.addDialog.xuidsPlaceholder')"
            :disabled="isEditing"
          />
        </el-form-item>
        <el-form-item :label="$t('permission.addDialog.levelLabel')" prop="level">
          <el-select v-model="newPermission.level" :placeholder="$t('permission.addDialog.levelPlaceholder')" style="width: 100%">
            <el-option
              v-for="level in permissionLevels"
              :key="level.value"
              :label="$t(`permission.levels.${level.value}`)"
              :value="level.value"
            >
              <div class="permission-option">
                <div class="permission-name">{{ $t(`permission.levels.${level.value}`) }}</div>
                <div class="permission-desc">{{ $t(`permission.levels.${level.value}Desc`) }}</div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseDialog">{{ $t('permission.addDialog.cancel') }}</el-button>
          <el-button type="primary" @click="savePermission" :loading="saving">
            {{ isEditing ? $t('common.save') : $t('permission.addDialog.confirm') }}
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
  name: 'PermissionManagement',
  components: {
    Plus
  },
  setup() {
    const { t } = useI18n();
    const permissions = ref([]);
    const loading = ref(false);
    const saving = ref(false);
    const removing = ref('');
    const showAddDialog = ref(false);
    const isEditing = ref(false);
    const permissionForm = ref(null);
    
    const newPermission = reactive({
      xuid: '',
      level: ''
    });
    
    const permissionLevels = [
      { value: 'visitor' },
      { value: 'member' },
      { value: 'operator' }
    ];
    
    const rules = computed(() => ({
      xuid: [
        { required: true, message: t('permission.validation.xuidsRequired'), trigger: 'blur' },
        { min: 16, max: 16, message: t('permission.validation.xuidsLength'), trigger: 'blur' },
        { pattern: /^[0-9]+$/, message: t('permission.validation.xuidsPattern'), trigger: 'blur' }
      ],
      level: [
        { required: true, message: t('permission.validation.levelRequired'), trigger: 'change' }
      ]
    }));
    
    // Get permission tag type
    const getPermissionTagType = (level) => {
      switch (level) {
        case 'operator': return 'danger';
        case 'member': return 'success';
        case 'visitor': return 'info';
        default: return 'info';
      }
    };
    
    // Load permission list
    const loadPermissions = async () => {
      loading.value = true;
      try {
        const response = await api.getPermissions();
        permissions.value = response.data.permissions || [];
      } catch (error) {
        console.error('Failed to get permission list:', error);
        ElMessage.error(t('permission.messages.loadFailed'));
      } finally {
        loading.value = false;
      }
    };
    
    // Save permission
    const savePermission = async () => {
      if (!permissionForm.value) return;
      
      try {
        await permissionForm.value.validate();
        
        // Check if player already exists (only when adding)
        if (!isEditing.value && permissions.value.some(p => p.xuid === newPermission.xuid)) {
          ElMessage.warning(t('permission.messages.playerExists'));
          return;
        }
        
        saving.value = true;
        await api.updatePermission({
          xuid: newPermission.xuid,
          level: newPermission.level
        });
        
        ElMessage.success(isEditing.value ? t('permission.messages.updateSuccess') : t('permission.messages.addSuccess'));
        showAddDialog.value = false;
        resetForm();
        await loadPermissions();
      } catch (error) {
        console.error('Failed to save permissions:', error);
        ElMessage.error(isEditing.value ? t('permission.messages.updateFailed') : t('permission.messages.addFailed'));
      } finally {
        saving.value = false;
      }
    };
    
    // Edit permission
    const editPermission = (permission) => {
      isEditing.value = true;
      newPermission.xuid = permission.xuid;
      newPermission.level = permission.permission;
      showAddDialog.value = true;
    };
    
    // Delete permission
    const removePermission = async (xuid) => {
      try {
        await ElMessageBox.confirm(
          t('permission.messages.removeConfirm', { xuid }),
          t('permission.messages.removeConfirmTitle'),
          {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            type: 'warning'
          }
        );
        
        removing.value = xuid;
        await api.removePermission(xuid);
        
        ElMessage.success(t('permission.messages.removeSuccess'));
        await loadPermissions();
      } catch (error) {
        if (error !== 'cancel') {
          console.error('Failed to delete permission:', error);
          ElMessage.error(t('permission.messages.removeFailed'));
        }
      } finally {
        removing.value = '';
      }
    };
    
    // Reset form
    const resetForm = () => {
      isEditing.value = false;
      newPermission.xuid = '';
      newPermission.level = '';
      if (permissionForm.value) {
        permissionForm.value.resetFields();
      }
    };
    
    // Close dialog
    const handleCloseDialog = () => {
      showAddDialog.value = false;
      resetForm();
    };
    
    onMounted(() => {
      loadPermissions();
    });
    
    return {
      permissions,
      loading,
      saving,
      removing,
      showAddDialog,
      isEditing,
      permissionForm,
      newPermission,
      permissionLevels,
      rules,
      getPermissionTagType,
      loadPermissions,
      savePermission,
      editPermission,
      removePermission,
      handleCloseDialog
    };
  }
};
</script>

<style lang="scss" scoped>
.permission-management {
  .permission-card {
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
    
    .permission-content {
      .empty-state {
        padding: 40px 0;
      }
    }
  }
  
  .permission-option {
    .permission-name {
      font-weight: 600;
      margin-bottom: 2px;
    }
    
    .permission-desc {
      font-size: 12px;
      color: #909399;
      line-height: 1.2;
    }
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

:deep(.el-select-dropdown__item) {
  height: auto;
  padding: 8px 20px;
  line-height: 1.4;
}
</style>