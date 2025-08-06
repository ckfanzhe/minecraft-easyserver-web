<template>
  <div class="command-console">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>命令控制台</span>
        </div>
      </template>
      <div class="console-content">
        <p>命令控制台功能正在开发中...</p>
        <el-alert
          title="功能说明"
          type="info"
          description="此页面将包含服务器命令执行、快捷命令、命令历史等功能"
          show-icon
          :closable="false"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'CommandConsole'
};
</script>

<style lang="scss" scoped>
.command-console {
  .console-content {
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