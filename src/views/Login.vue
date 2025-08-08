<template>
  <div class="login-page">
    <!-- Language switcher in top right corner -->
    <div class="language-switcher">
      <el-button 
        @click="toggleLanguage" 
        type="text" 
        class="language-btn"
      >
        <el-icon><Setting /></el-icon>
        {{ currentLanguageLabel }}
      </el-button>
    </div>
    <div class="login-container">
      <div class="login-box">
        <div class="login-header">
          <h1>🎮 {{ $t('login.title') }}</h1>
          <p>Minecraft Easy Server</p>
        </div>
      
      <el-form 
        ref="loginForm" 
        :model="loginData" 
        :rules="loginRules" 
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="password">
          <el-input
            v-model="loginData.password"
            type="password"
            :placeholder="$t('login.passwordPlaceholder')"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            size="large" 
            :loading="loading" 
            @click="handleLogin"
            class="login-button"
          >
            {{ loading ? $t('login.loggingIn') : $t('login.loginButton') }}
          </el-button>
        </el-form-item>
      </el-form>
      

    </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElButton, ElIcon } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { Setting } from '@element-plus/icons-vue';
import api from '../api';

export default {
  name: 'Login',
  components: {
    ElButton,
    ElIcon,
    Setting
  },
  setup() {
    const router = useRouter();
    const { t, locale } = useI18n();
    const loginForm = ref(null);
    const loading = ref(false);
    
    const currentLanguageLabel = computed(() => {
      return locale.value === 'zh' ? '中文' : 'English'
    });
    
    const toggleLanguage = () => {
      const newLang = locale.value === 'zh' ? 'en' : 'zh';
      locale.value = newLang;
      localStorage.setItem('language', newLang);
    };
    
    const loginData = reactive({
      password: ''
    });
    
    const loginRules = {
      password: [
        { required: true, message: t('login.validation.passwordRequired'), trigger: 'blur' },
        { min: 8, message: t('login.passwordMinLength'), trigger: 'blur' }
      ]
    };
    
    const handleLogin = async () => {
      if (!loginForm.value) return;
      
      try {
        await loginForm.value.validate();
        loading.value = true;
        
        const response = await api.login(loginData.password);
        
        // 存储token到localStorage
        localStorage.setItem('token', response.data.token);
        
        // 设置是否需要修改密码的标志
        if (response.data.requirePasswordChange) {
          localStorage.setItem('requirePasswordChange', 'true');
        } else {
          localStorage.removeItem('requirePasswordChange');
        }
        
        ElMessage.success(t('login.loginSuccess'));
        
        // 检查是否需要强制修改密码
        if (response.data.requirePasswordChange) {
          ElMessage.warning(this.$t('login.defaultPasswordWarning'));
          router.push('/change-password');
        } else {
          // 跳转到首页
          router.push('/');
        }
        
      } catch (error) {
        console.error('Login error:', error);
        
        if (error.response && error.response.status === 401) {
          ElMessage.error(t('login.invalidPassword'));
        } else if (error.response && error.response.status === 429) {
          // 处理速率限制错误
          const errorData = error.response.data;
          ElMessage.error({
            message: t('login.rateLimitExceeded'),
            duration: 8000
          });
          
          // 显示详细的封禁信息
          if (errorData.blocked_until && errorData.retry_after_seconds) {
            const blockedUntil = new Date(errorData.blocked_until).toLocaleString();
            const retryAfter = errorData.retry_after_seconds;
            
            setTimeout(() => {
              ElMessage.warning({
                message: t('login.rateLimitInfo', { 
                  blockedUntil: blockedUntil, 
                  retryAfter: retryAfter 
                }),
                duration: 10000
              });
            }, 1000);
          }
        } else {
          ElMessage.error(t('login.loginError'));
        }
      } finally {
        loading.value = false;
      }
    };
    
    return {
      loginForm,
      loginData,
      loginRules,
      loading,
      handleLogin,
      currentLanguageLabel,
      toggleLanguage
    };
  }
};
</script>

<style scoped>
.login-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 1000;
}

.language-switcher {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10000;
}

/* Language button styles for login page */
.language-switcher .language-btn {
  color: rgba(255, 255, 255, 0.9) !important;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  padding: 8px 12px !important;
  border-radius: 8px !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  transition: all 0.3s ease !important;
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  font-weight: 500 !important;
  min-height: auto !important;
}

.language-switcher .language-btn:hover {
  color: rgba(255, 255, 255, 1) !important;
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  transform: translateY(-1px);
}

.language-switcher .language-btn:focus {
  color: rgba(255, 255, 255, 1) !important;
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
}

.login-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
  padding: 20px;
  box-sizing: border-box;
}

.login-box {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-header h1 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 28px;
  font-weight: 600;
}

.login-header p {
  margin: 0 0 30px 0;
  color: #666;
  font-size: 16px;
}

.login-form {
  margin-bottom: 20px;
}

.login-button {
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
}

.login-footer p {
  margin: 0;
  color: #999;
  font-size: 14px;
}

:deep(.el-input__wrapper) {
  border-radius: 10px;
  height: 50px;
}

:deep(.el-input__inner) {
  font-size: 16px;
}
</style>