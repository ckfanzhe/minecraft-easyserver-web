<template>
  <div class="log-viewer">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>日志查看</span>
        </div>
      </template>
      <div class="log-content">
        <p>日志查看功能正在开发中...</p>
        <el-alert
          title="功能说明"
          type="info"
          description="此页面将包含实时日志显示、日志过滤、日志导出等功能"
          show-icon
          :closable="false"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'LogViewer'
};
</script>

<style lang="scss" scoped>
.log-viewer {
  .log-content {
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