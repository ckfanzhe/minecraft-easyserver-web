<template>
  <div class="world-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>世界管理</span>
        </div>
      </template>
      <div class="world-content">
        <p>世界管理功能正在开发中...</p>
        <el-alert
          title="功能说明"
          type="info"
          description="此页面将包含世界文件上传、切换、备份等功能"
          show-icon
          :closable="false"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'WorldManagement'
};
</script>

<style lang="scss" scoped>
.world-management {
  .world-content {
    text-align: center;
    padding: 40px;
    
    p {
      font-size: 16px;
      color: #606266;
      margin-bottom: 20px;
    }
  }
}
</style>