<template>
  <div class="player-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>玩家管理</span>
        </div>
      </template>
      <div class="player-content">
        <p>玩家管理功能正在开发中...</p>
        <el-alert
          title="功能说明"
          type="info"
          description="此页面将包含白名单管理、权限设置等玩家相关功能"
          show-icon
          :closable="false"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'PlayerManagement'
};
</script>

<style lang="scss" scoped>
.player-management {
  .player-content {
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