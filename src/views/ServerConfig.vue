<template>
  <div class="server-config">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ $t('config.title') }}</span>
          <el-button 
            type="primary" 
            :loading="saving" 
            @click="saveConfig"
            :disabled="!hasChanges"
          >
            {{ $t('config.save') }}
          </el-button>
        </div>
      </template>
      
      <div class="config-content" v-loading="loading">
        <el-form 
          ref="configForm" 
          :model="config" 
          :rules="rules" 
          label-width="150px"
          class="config-form"
        >
          <!-- 服务器名称 -->
          <el-form-item :label="$t('config.serverName')" prop="server-name">
            <el-input 
              v-model="config['server-name']" 
              :placeholder="$t('config.serverName')"
              @input="markChanged"
            />
          </el-form-item>
          
          <!-- 游戏模式 -->
          <el-form-item :label="$t('config.gamemode')" prop="gamemode">
            <el-select v-model="config.gamemode" @change="markChanged">
              <el-option 
                :label="$t('config.gamemodes.survival')" 
                value="survival"
              />
              <el-option 
                :label="$t('config.gamemodes.creative')" 
                value="creative"
              />
              <el-option 
                :label="$t('config.gamemodes.adventure')" 
                value="adventure"
              />
            </el-select>
          </el-form-item>
          
          <!-- 难度 -->
          <el-form-item :label="$t('config.difficulty')" prop="difficulty">
            <el-select v-model="config.difficulty" @change="markChanged">
              <el-option 
                :label="$t('config.difficulties.peaceful')" 
                value="peaceful"
              />
              <el-option 
                :label="$t('config.difficulties.easy')" 
                value="easy"
              />
              <el-option 
                :label="$t('config.difficulties.normal')" 
                value="normal"
              />
              <el-option 
                :label="$t('config.difficulties.hard')" 
                value="hard"
              />
            </el-select>
          </el-form-item>
          
          <!-- 最大玩家数 -->
          <el-form-item :label="$t('config.maxPlayers')" prop="max-players">
            <el-input-number 
              v-model="config['max-players']" 
              :min="1" 
              :max="100"
              @change="markChanged"
            />
          </el-form-item>
          
          <!-- 服务器端口 -->
          <el-form-item :label="$t('config.serverPort')" prop="server-port">
            <el-input-number 
              v-model="config['server-port']" 
              :min="1024" 
              :max="65535"
              @change="markChanged"
            />
          </el-form-item>
          
          <!-- 世界名称 -->
          <el-form-item :label="$t('config.levelName')" prop="level-name">
            <el-input 
              v-model="config['level-name']" 
              :placeholder="$t('config.levelName')"
              @input="markChanged"
            />
          </el-form-item>
          
          <!-- 默认玩家权限级别 -->
          <el-form-item :label="$t('config.defaultPermission')" prop="default-player-permission-level">
            <el-select v-model="config['default-player-permission-level']" @change="markChanged">
              <el-option 
                :label="$t('config.permissions.visitor')" 
                value="visitor"
              />
              <el-option 
                :label="$t('config.permissions.member')" 
                value="member"
              />
              <el-option 
                :label="$t('config.permissions.operator')" 
                value="operator"
              />
            </el-select>
          </el-form-item>
          
          <!-- 开关选项 -->
          <div class="switch-options">
            <el-form-item :label="$t('config.allowCheats')">
              <el-switch 
                v-model="config['allow-cheats']" 
                @change="markChanged"
              />
            </el-form-item>
            
            <el-form-item :label="$t('config.allowList')">
              <el-switch 
                v-model="config['allow-list']" 
                @change="markChanged"
              />
            </el-form-item>
            
            <el-form-item :label="$t('config.onlineMode')">
              <el-switch 
                v-model="config['online-mode']" 
                @change="markChanged"
              />
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import api from '@/api'

export default {
  name: 'ServerConfig',
  setup() {
    const { t } = useI18n()
    
    const loading = ref(false)
    const saving = ref(false)
    const hasChanges = ref(false)
    const originalConfig = ref({})
    
    const config = reactive({
      'server-name': '',
      'gamemode': 'survival',
      'difficulty': 'normal',
      'max-players': 10,
      'server-port': 19132,
      'allow-cheats': false,
      'allow-list': true,
      'online-mode': true,
      'level-name': 'Bedrock level',
      'default-player-permission-level': 'member'
    })
    
    const rules = {
      'server-name': [
        { required: true, message: t('config.validation.serverNameRequired'), trigger: 'blur' }
      ],
      'max-players': [
        { required: true, message: t('config.validation.maxPlayersRequired'), trigger: 'blur' },
        { type: 'number', min: 1, max: 100, message: t('config.validation.maxPlayersRange'), trigger: 'blur' }
      ],
      'server-port': [
        { required: true, message: t('config.validation.serverPortRequired'), trigger: 'blur' },
        { type: 'number', min: 1024, max: 65535, message: t('config.validation.serverPortRange'), trigger: 'blur' }
      ],
      'level-name': [
        { required: true, message: t('config.validation.levelNameRequired'), trigger: 'blur' }
      ]
    }
    
    const markChanged = () => {
      hasChanges.value = JSON.stringify(config) !== JSON.stringify(originalConfig.value)
    }
    
    const loadConfig = async () => {
      loading.value = true
      try {
        const response = await api.getServerConfig()
        // 后端返回的数据结构是 { config: {...} }
        const configData = response.data.config || response.data
        Object.assign(config, configData)
        originalConfig.value = JSON.parse(JSON.stringify(configData))
        hasChanges.value = false
      } catch (error) {
        console.error('Failed to load config:', error)
        ElMessage.error(t('config.loadError'))
      } finally {
        loading.value = false
      }
    }
    
    const saveConfig = async () => {
      try {
        await ElMessageBox.confirm(
          t('config.saveConfirm'),
          t('common.confirm'),
          {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            type: 'warning'
          }
        )
        
        saving.value = true
        // 后端期望的数据格式是 { config: {...} }
        await api.updateServerConfig({ config: config })
        originalConfig.value = JSON.parse(JSON.stringify(config))
        hasChanges.value = false
        ElMessage.success(t('config.saveSuccess'))
      } catch (error) {
        if (error !== 'cancel') {
          console.error('Failed to save config:', error)
          ElMessage.error(t('config.saveError'))
        }
      } finally {
        saving.value = false
      }
    }
    
    onMounted(() => {
      loadConfig()
    })
    
    return {
      loading,
      saving,
      hasChanges,
      config,
      rules,
      markChanged,
      saveConfig
    }
  }
}
</script>

<style lang="scss" scoped>
.server-config {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .config-content {
    padding: 20px;
  }
  
  .config-form {
    max-width: 600px;
    
    .switch-options {
      .el-form-item {
        margin-bottom: 20px;
      }
    }
  }
  
  :deep(.el-form-item__label) {
    font-weight: 500;
    color: var(--el-text-color-primary);
  }
  
  :deep(.el-input-number) {
    width: 100%;
  }
  
  :deep(.el-select) {
    width: 100%;
  }
}
</style>