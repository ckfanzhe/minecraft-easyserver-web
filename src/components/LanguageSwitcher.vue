<template>
  <el-dropdown @command="handleLanguageChange">
    <span class="el-dropdown-link">
      <el-icon><Setting /></el-icon>
      {{ currentLanguageLabel }}
      <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh" :disabled="locale === 'zh'">
          中文
        </el-dropdown-item>
        <el-dropdown-item command="en" :disabled="locale === 'en'">
          English
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Setting, ArrowDown } from '@element-plus/icons-vue'

const { locale, t } = useI18n()

const currentLanguageLabel = computed(() => {
  return locale.value === 'zh' ? '中文' : 'English'
})

const handleLanguageChange = (language) => {
  locale.value = language
  localStorage.setItem('language', language)
}
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.el-dropdown-link:hover {
  color: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
}
</style>