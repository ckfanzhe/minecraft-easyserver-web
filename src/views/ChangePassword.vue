<template>
  <div class="change-password-container">
    <div class="change-password-card">
      <h2>{{ $t('auth.changePassword.title') }}</h2>
      <p v-if="isForceChange" class="warning-text">
        {{ $t('auth.changePassword.warningText') }}
      </p>
      
      <form @submit.prevent="handleChangePassword" class="change-password-form">
        <div class="form-group">
          <label for="currentPassword">{{ $t('auth.changePassword.currentPassword') }}</label>
          <input
            type="password"
            id="currentPassword"
            v-model="currentPassword"
            required
            :placeholder="$t('auth.changePassword.currentPasswordPlaceholder')"
          />
        </div>
        
        <div class="form-group">
          <label for="newPassword">{{ $t('auth.changePassword.newPassword') }}</label>
          <input
            type="password"
            id="newPassword"
            v-model="newPassword"
            required
            :placeholder="$t('auth.changePassword.newPasswordPlaceholder')"
          />
          <div class="password-requirements">
            <p>{{ $t('auth.changePassword.passwordRequirements') }}</p>
            <ul>
              <li :class="{ valid: hasMinLength }">{{ $t('auth.changePassword.requirements.minLength') }}</li>
              <li :class="{ valid: hasUppercase }">{{ $t('auth.changePassword.requirements.uppercase') }}</li>
              <li :class="{ valid: hasLowercase }">{{ $t('auth.changePassword.requirements.lowercase') }}</li>
              <li :class="{ valid: hasNumber }">{{ $t('auth.changePassword.requirements.number') }}</li>
              <li :class="{ valid: hasSpecialChar }">{{ $t('auth.changePassword.requirements.specialChar') }}</li>
            </ul>
          </div>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">{{ $t('auth.changePassword.confirmPassword') }}</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            required
            :placeholder="$t('auth.changePassword.confirmPasswordPlaceholder')"
          />
          <div v-if="confirmPassword && newPassword !== confirmPassword" class="error-text">
            {{ $t('auth.changePassword.passwordMismatch') }}
          </div>
        </div>
        
        <button 
          type="submit" 
          :disabled="!isFormValid || loading"
          class="submit-btn"
        >
          {{ loading ? $t('auth.changePassword.changing') : $t('auth.changePassword.changeButton') }}
        </button>
      </form>
      
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import api from '../api';

export default {
  name: 'ChangePassword',
  setup() {
    const router = useRouter();
    const { t } = useI18n();
    const currentPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');
    const loading = ref(false);
    const message = ref('');
    const messageType = ref('');
    
    // 检查是否为强制修改密码
    const isForceChange = ref(localStorage.getItem('requirePasswordChange') === 'true');
    
    // Password validation
    const hasMinLength = computed(() => newPassword.value.length >= 8);
    const hasUppercase = computed(() => /[A-Z]/.test(newPassword.value));
    const hasLowercase = computed(() => /[a-z]/.test(newPassword.value));
    const hasNumber = computed(() => /[0-9]/.test(newPassword.value));
    const hasSpecialChar = computed(() => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(newPassword.value));
    
    const isPasswordValid = computed(() => {
      return hasMinLength.value && hasUppercase.value && hasLowercase.value && 
             hasNumber.value && hasSpecialChar.value;
    });
    
    const isFormValid = computed(() => {
      return currentPassword.value && newPassword.value && confirmPassword.value &&
             newPassword.value === confirmPassword.value && isPasswordValid.value;
    });
    
    const handleChangePassword = async () => {
      if (!isFormValid.value) return;
      
      loading.value = true;
      message.value = '';
      
      try {
        const response = await api.changePassword(currentPassword.value, newPassword.value);
        
        if (response.data.success) {
          message.value = isForceChange.value ? 
            t('auth.changePassword.changeSuccess') : 
            t('auth.changePassword.changeSuccessVoluntary');
          messageType.value = 'success';
          
          // 根据是否为强制修改密码决定后续操作
          setTimeout(() => {
            if (isForceChange.value) {
              // 强制修改密码：清除token和标志，跳转到登录页
              localStorage.removeItem('token');
              localStorage.removeItem('requirePasswordChange');
              router.push('/login');
            } else {
              // 用户自发修改密码：返回仪表板
              router.push('/');
            }
          }, 2000);
        } else {
          message.value = response.data.message || t('auth.changePassword.changeFailed');
          messageType.value = 'error';
        }
      } catch (error) {
        console.error('Change password error:', error);
        message.value = error.response?.data?.message || t('auth.changePassword.changeFailed');
        messageType.value = 'error';
      } finally {
        loading.value = false;
      }
    };
    
    return {
      currentPassword,
      newPassword,
      confirmPassword,
      loading,
      message,
      messageType,
      isForceChange,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
      isFormValid,
      handleChangePassword
    };
  }
};
</script>

<style scoped>
.change-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.change-password-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.change-password-card h2 {
  text-align: center;
  margin-bottom: 10px;
  color: #333;
  font-size: 28px;
  font-weight: 600;
}

.warning-text {
  text-align: center;
  color: #e74c3c;
  margin-bottom: 30px;
  padding: 15px;
  background: #fdf2f2;
  border-radius: 8px;
  border-left: 4px solid #e74c3c;
}

.change-password-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.password-requirements {
  margin-top: 10px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.password-requirements p {
  margin: 0 0 10px 0;
  font-weight: 500;
  color: #555;
}

.password-requirements ul {
  margin: 0;
  padding-left: 20px;
  list-style: none;
}

.password-requirements li {
  margin-bottom: 5px;
  color: #dc3545;
  position: relative;
}

.password-requirements li::before {
  content: '✗';
  position: absolute;
  left: -20px;
  color: #dc3545;
}

.password-requirements li.valid {
  color: #28a745;
}

.password-requirements li.valid::before {
  content: '✓';
  color: #28a745;
}

.error-text {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
}

.submit-btn {
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.message {
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>