<template>
  <div class="dashboard-container">
    <!-- 顶部卡片统计 -->
    <el-row :gutter="20" class="card-row">
      <el-col :span="8">
        <el-card shadow="hover" class="status-card">
          <div class="card-body-custom">
            <div class="card-title">今日总提交数 (Commits)</div>
            <div class="card-inner">
              <div class="card-value">{{ statsData.todayCommits }}</div>
              <div class="card-trend">
                <span class="trend-up">↑ 14.2%</span>
                <span class="trend-label">较昨日</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="status-card">
          <div class="card-body-custom">
            <div class="card-title">AI 代码平均采纳率</div>
            <div class="card-inner">
              <div class="card-value-highlight">{{ statsData.aiAdoptRate }}</div>
              <div class="card-trend">
                <span class="trend-up">↑ 2.1%</span>
                <span class="trend-label">较上周</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="status-card">
          <div class="card-body-custom">
            <div class="card-title">今日活跃研发人数</div>
            <div class="card-inner">
              <div class="card-value">{{ statsData.activeDevelopers }} <span class="unit">人</span></div>
              <div class="card-trend">
                <span class="trend-down">↓ 3.4%</span>
                <span class="trend-label">较昨日</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <!-- 代码提交趋势 -->
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <div ref="commitChartRef" class="chart-box"></div>
        </el-card>
      </el-col>
      <!-- AI 采纳率 -->
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <div ref="aiChartRef" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// DOM 引用
const commitChartRef = ref(null)
const aiChartRef = ref(null)

// 实例引用
let commitChart = null
let aiChart = null

// 响应式数据绑定，默认值在未请求成功时兜底
const statsData = reactive({
  todayCommits: 0,
  aiAdoptRate: '0%',
  activeDevelopers: 0
})

// 统一的精致悬浮窗配置
const commonTooltip = {
  trigger: 'axis',
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  borderColor: '#eee',
  borderWidth: 1,
  textStyle: { color: '#333', fontSize: 13 },
  extraCssText: 'box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); border-radius: 6px; padding: 10px;'
}

// 统一的网格配置
const commonGrid = {
  top: '20%',
  left: '4%',
  right: '4%',
  bottom: '4%',
  containLabel: true
}

// 初始化折线图
const initCommitChart = (days = [], data = []) => {
  if (!commitChartRef.value) return
  if (!commitChart) {
    commitChart = echarts.init(commitChartRef.value)
  }
  commitChart.setOption({
    title: {
      text: '研发团队代码提交趋势 (近一周)',
      textStyle: { color: '#262626', fontSize: 15, fontWeight: 600 },
      top: '2%',
      left: '1%'
    },
    tooltip: commonTooltip,
    grid: commonGrid,
    xAxis: {
      type: 'category',
      data: days,
      axisLine: { lineStyle: { color: '#bfbfbf' } },
      axisTick: { show: false },
      axisLabel: { color: '#595959', margin: 12 }
    },
    yAxis: {
      type: 'value',
      name: 'Commit 次数',
      nameTextStyle: { color: '#8c8c8c', padding: [0, 0, 0, 40] },
      axisLabel: { color: '#8c8c8c' },
      splitLine: { lineStyle: { color: '#f0f0f0', type: 'dashed' } }
    },
    series: [
      {
        name: '代码提交量',
        data: data,
        type: 'line',
        smooth: 0.3,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false,
        itemStyle: { color: '#1890ff' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24, 144, 255, 0.2)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.01)' }
          ])
        }
      }
    ]
  })
}

// 初始化柱状图
const initAiChart = (days = [], data = []) => {
  if (!aiChartRef.value) return
  if (!aiChart) {
    aiChart = echarts.init(aiChartRef.value)
  }
  aiChart.setOption({
    title: {
      text: 'AI 代码功能采纳率趋势',
      textStyle: { color: '#262626', fontSize: 15, fontWeight: 600 },
      top: '2%',
      left: '1%'
    },
    tooltip: { ...commonTooltip, formatter: '{b}<br/><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#52c41a;"></span>{a}: <strong>{c}%</strong>' },
    grid: commonGrid,
    xAxis: {
      type: 'category',
      data: days,
      axisLine: { lineStyle: { color: '#bfbfbf' } },
      axisTick: { show: false },
      axisLabel: { color: '#595959', margin: 12 }
    },
    yAxis: {
      type: 'value',
      name: '采纳率 (%)',
      max: 80,
      nameTextStyle: { color: '#8c8c8c', padding: [0, 0, 0, 30] },
      axisLabel: { color: '#8c8c8c', formatter: '{value}%' },
      splitLine: { lineStyle: { color: '#f0f0f0', type: 'dashed' } }
    },
    series: [
      {
        name: 'AI 采纳率',
        data: data,
        type: 'bar',
        barWidth: '30%',
        itemStyle: {
          color: '#52c41a',
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  })
}

// 🌐 核心：向 Java 后端请求数据
const fetchDashboardData = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/v1/dashboard/stats')
    if (res.data && res.data.success) {
      const data = res.data.data
      // 1. 刷新卡片数据
      statsData.todayCommits = data.todayCommits
      statsData.aiAdoptRate = data.aiAdoptRate
      statsData.activeDevelopers = data.activeDevelopers

      // 2. 渲染图表
      initCommitChart(data.days, data.commitData)
      initAiChart(data.days, data.adoptData)

      ElMessage.success('成功从后端获取真实数据！')
    }
  } catch (error) {
    console.error('获取后端数据失败：', error)
    ElMessage.error('无法连接到后端服务，请检查 8080 端口是否启动')
  }
}

onMounted(() => {
  fetchDashboardData()
  window.addEventListener('resize', handleResize)
})

const handleResize = () => {
  commitChart?.resize()
  aiChart?.resize()
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  commitChart?.dispose()
  aiChart?.dispose()
})
</script>

<style scoped>
.dashboard-container {
  padding: 24px;
  background-color: #f8f9fa;
  box-sizing: border-box;
  width: 100%;
}

.card-row {
  margin-bottom: 24px;
}

:deep(.el-card__body) {
  padding: 0 !important;
}
:deep(.el-card__header) {
  display: none !important;
}

.status-card {
  border: none;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
}

.card-body-custom {
  padding: 20px 24px;
}

.card-title {
  font-size: 13px;
  color: #8c8c8c;
  font-weight: 500;
  margin-bottom: 12px;
}

.card-inner {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.card-value {
  font-size: 30px;
  font-weight: 700;
  color: #1f1f1f;
  line-height: 1;
}

.card-value-highlight {
  font-size: 30px;
  font-weight: 700;
  color: #52c41a;
  line-height: 1;
}

.unit {
  font-size: 14px;
  font-weight: normal;
  color: #8c8c8c;
  margin-left: 2px;
}

.card-trend {
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.3;
}

.trend-up {
  color: #52c41a;
  font-weight: 600;
}
.trend-down {
  color: #ff4d4f;
  font-weight: 600;
}
.trend-label {
  color: #bfbfbf;
}

.chart-card {
  border: none;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
}

.chart-box {
  width: 100%;
  height: 380px;
  padding: 16px 8px 8px 8px;
  box-sizing: border-box;
}
</style>