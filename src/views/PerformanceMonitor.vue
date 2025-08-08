<template>
  <div class="performance-monitor">
    <!-- Performance Overview Cards -->
    <el-row :gutter="20" class="overview-cards">
      <el-col :span="6">
        <el-card class="metric-card">
          <div class="metric-content">
            <div class="metric-icon system-cpu">
              <el-icon><Cpu /></el-icon>
            </div>
            <div class="metric-info">
              <div class="metric-value">{{ systemData.cpu_usage.toFixed(2) }}%</div>
              <div class="metric-label">{{ $t('performance.systemCpu') }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="metric-card">
          <div class="metric-content">
            <div class="metric-icon system-memory">
              <el-icon><Monitor /></el-icon>
            </div>
            <div class="metric-info">
              <div class="metric-value">{{ systemData.memory_usage.toFixed(2) }}%</div>
              <div class="metric-label">{{ $t('performance.systemMemory') }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="metric-card">
          <div class="metric-content">
            <div class="metric-icon bedrock-cpu">
              <el-icon><Cpu /></el-icon>
            </div>
            <div class="metric-info">
              <div class="metric-value">{{ bedrockData.cpu_usage.toFixed(2) }}%</div>
              <div class="metric-label">{{ $t('performance.bedrockCpu') }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="metric-card">
          <div class="metric-content">
            <div class="metric-icon bedrock-memory">
              <el-icon><Monitor /></el-icon>
            </div>
            <div class="metric-info">
              <div class="metric-value">{{ bedrockData.memory_mb.toFixed(2) }}MB</div>
              <div class="metric-label">{{ $t('performance.bedrockMemory') }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Chart Area -->
    <el-row :gutter="20" class="chart-section">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>{{ $t('performance.cpuChart') }}</span>
              <el-button type="text" @click="clearChartData">{{ $t('performance.clearData') }}</el-button>
            </div>
          </template>
          <div class="chart-container">
            <v-chart :option="cpuChartOption" :autoresize="true" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>{{ $t('performance.memoryChart') }}</span>
              <el-button type="text" @click="clearChartData">{{ $t('performance.clearData') }}</el-button>
            </div>
          </template>
          <div class="chart-container">
            <v-chart :option="memoryChartOption" :autoresize="true" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Detailed Information -->
    <el-row :gutter="20" class="detail-section">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>{{ $t('performance.systemInfo') }}</span>
            </div>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item :label="$t('performance.cpuUsage')">{{ systemData.cpu_usage.toFixed(2) }}%</el-descriptions-item>
            <el-descriptions-item :label="$t('performance.memoryUsage')">{{ systemData.memory_usage.toFixed(2) }}%</el-descriptions-item>
            <el-descriptions-item :label="$t('performance.lastUpdate')">{{ formatTime(systemData.timestamp) }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>{{ $t('performance.bedrockInfo') }}</span>
            </div>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item :label="$t('performance.processId')">{{ bedrockData.pid || 'N/A' }}</el-descriptions-item>
            <el-descriptions-item :label="$t('performance.cpuUsage')">{{ bedrockData.cpu_usage.toFixed(2) }}%</el-descriptions-item>
            <el-descriptions-item :label="$t('performance.memoryUsage')">{{ bedrockData.memory_usage.toFixed(2) }}%</el-descriptions-item>
            <el-descriptions-item :label="$t('performance.memorySize')">{{ bedrockData.memory_mb.toFixed(2) }}MB</el-descriptions-item>
            <el-descriptions-item :label="$t('performance.lastUpdate')">{{ formatTime(bedrockData.timestamp) }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Cpu, Monitor } from '@element-plus/icons-vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useI18n } from 'vue-i18n'
import api from '../api'

// Register ECharts components
use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer
])

export default {
  name: 'PerformanceMonitor',
  components: {
    VChart,
    Cpu,
    Monitor
  },
  setup() {
    const { t } = useI18n()
    
    // Reactive data
    const systemData = reactive({
      cpu_usage: 0,
      memory_usage: 0,
      timestamp: ''
    })

    const bedrockData = reactive({
      pid: null,
      cpu_usage: 0,
      memory_usage: 0,
      memory_mb: 0,
      timestamp: ''
    })

    // Chart data
    const chartData = reactive({
      times: [],
      systemCpu: [],
      systemMemory: [],
      bedrockCpu: [],
      bedrockMemory: []
    })

    const maxDataPoints = 50 // Maximum data points
    let updateInterval = null

    // CPU chart configuration
    const cpuChartOption = ref({
      title: {
        text: '',
        left: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          let result = params[0].name + '<br/>'
          params.forEach(param => {
            result += param.marker + param.seriesName + ': ' + param.value + '%<br/>'
          })
          return result
        }
      },
      legend: {
        data: [],
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: chartData.times,
        axisLabel: {
          formatter: function(value) {
            return new Date(value).toLocaleTimeString()
          }
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: '',
          type: 'line',
          data: chartData.systemCpu,
          smooth: true,
          lineStyle: {
            color: '#409EFF'
          },
          itemStyle: {
            color: '#409EFF'
          }
        },
        {
          name: '',
          type: 'line',
          data: chartData.bedrockCpu,
          smooth: true,
          lineStyle: {
            color: '#67C23A'
          },
          itemStyle: {
            color: '#67C23A'
          }
        }
      ]
    })

    // Memory chart configuration
    const memoryChartOption = ref({
      title: {
        text: '',
        left: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          let result = params[0].name + '<br/>'
          params.forEach(param => {
            if (param.seriesName.includes('MB')) {
              result += param.marker + param.seriesName + ': ' + param.value + 'MB<br/>'
            } else {
              result += param.marker + param.seriesName + ': ' + param.value + '%<br/>'
            }
          })
          return result
        }
      },
      legend: {
        data: [],
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: chartData.times,
        axisLabel: {
          formatter: function(value) {
            return new Date(value).toLocaleTimeString()
          }
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '',
          min: 0,
          max: 100,
          position: 'left',
          axisLabel: {
            formatter: '{value}%'
          }
        },
        {
          type: 'value',
          name: '',
          min: 0,
          position: 'right',
          axisLabel: {
            formatter: '{value}MB'
          }
        }
      ],
      series: [
        {
          name: '',
          type: 'line',
          yAxisIndex: 0,
          data: chartData.systemMemory,
          smooth: true,
          lineStyle: {
            color: '#E6A23C'
          },
          itemStyle: {
            color: '#E6A23C'
          }
        },
        {
          name: '',
          type: 'line',
          yAxisIndex: 1,
          data: chartData.bedrockMemory,
          smooth: true,
          lineStyle: {
            color: '#F56C6C'
          },
          itemStyle: {
            color: '#F56C6C'
          }
        }
      ]
    })

    // Update chart configurations when language changes
    const updateChartConfigurations = () => {
      // Update CPU chart
      cpuChartOption.value.title.text = t('performance.cpuChartTitle')
      cpuChartOption.value.legend.data = [t('performance.systemCpuLegend'), t('performance.bedrockCpuLegend')]
      cpuChartOption.value.series[0].name = t('performance.systemCpuLegend')
      cpuChartOption.value.series[1].name = t('performance.bedrockCpuLegend')
      
      // Update Memory chart
      memoryChartOption.value.title.text = t('performance.memoryChartTitle')
      memoryChartOption.value.legend.data = [t('performance.systemMemoryLegend'), t('performance.bedrockMemoryLegend')]
      memoryChartOption.value.yAxis[0].name = t('performance.usagePercentLabel')
      memoryChartOption.value.yAxis[1].name = t('performance.memoryMbLabel')
      memoryChartOption.value.series[0].name = t('performance.systemMemoryLegend')
      memoryChartOption.value.series[1].name = t('performance.bedrockMemoryLegend')
    }

    // Watch for language changes
    watch(() => t('performance.title'), () => {
      updateChartConfigurations()
    })

    // Load performance data
    const loadPerformanceData = async () => {
      try {
        const response = await api.getPerformanceData()
        const data = response.data

        // Update current data
        Object.assign(systemData, data.system)
        Object.assign(bedrockData, data.bedrock)

        // Add to chart data
        const currentTime = new Date().toISOString()
        chartData.times.push(currentTime)
        chartData.systemCpu.push(data.system.cpu_usage)
        chartData.systemMemory.push(data.system.memory_usage)
        chartData.bedrockCpu.push(data.bedrock.cpu_usage)
        chartData.bedrockMemory.push(data.bedrock.memory_mb)

        // Limit data points count
        if (chartData.times.length > maxDataPoints) {
          chartData.times.shift()
          chartData.systemCpu.shift()
          chartData.systemMemory.shift()
          chartData.bedrockCpu.shift()
          chartData.bedrockMemory.shift()
        }
      } catch (error) {
        console.error('Failed to get performance data:', error)
        ElMessage.error('Failed to get performance data')
      }
    }

    // Clear chart data
    const clearChartData = () => {
      chartData.times.length = 0
      chartData.systemCpu.length = 0
      chartData.systemMemory.length = 0
      chartData.bedrockCpu.length = 0
      chartData.bedrockMemory.length = 0
      ElMessage.success('Chart data cleared')
    }

    // Format time
    const formatTime = (timestamp) => {
      if (!timestamp) return 'N/A'
      return new Date(timestamp).toLocaleString()
    }

    // Lifecycle
    onMounted(() => {
      // Initialize chart configurations
      updateChartConfigurations()
      
      // 只有在用户已登录时才开始定时查询
      const token = localStorage.getItem('token')
      if (token) {
        loadPerformanceData()
        // Update data every 5 seconds
        updateInterval = setInterval(loadPerformanceData, 5000)
      }
    })

    onUnmounted(() => {
      if (updateInterval) {
        clearInterval(updateInterval)
      }
    })

    return {
      systemData,
      bedrockData,
      cpuChartOption,
      memoryChartOption,
      clearChartData,
      formatTime
    }
  }
}
</script>

<style lang="scss" scoped>
.performance-monitor {
  .overview-cards {
    margin-bottom: 20px;

    .metric-card {
      .metric-content {
        display: flex;
        align-items: center;
        padding: 10px 0;

        .metric-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          font-size: 24px;
          color: white;

          &.system-cpu {
            background: linear-gradient(135deg, #409EFF, #66B1FF);
          }

          &.system-memory {
            background: linear-gradient(135deg, #E6A23C, #EEBE77);
          }

          &.bedrock-cpu {
            background: linear-gradient(135deg, #67C23A, #85CE61);
          }

          &.bedrock-memory {
            background: linear-gradient(135deg, #F56C6C, #F78989);
          }
        }

        .metric-info {
          flex: 1;

          .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: var(--text-primary);
            line-height: 1;
          }

          .metric-label {
            font-size: 14px;
            color: var(--text-secondary);
            margin-top: 5px;
          }
        }
      }
    }
  }

  .chart-section {
    margin-bottom: 20px;

    .chart-container {
      height: 300px;
      width: 100%;
    }
  }

  .detail-section {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }
}
</style>