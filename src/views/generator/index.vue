<template>
  <div class="generator-container">
    <el-row :gutter="20">
      <!-- 左侧：需求输入 -->
      <el-col :span="10">
        <el-card class="box-card" header="✨ 提出你的组件需求">
          <el-input
            v-model="userPrompt"
            type="textarea"
            :rows="8"
            placeholder="请输入你想要生成的组件描述，例如：\n生成一个包含姓名、年龄、电子邮箱的用户列表表格，带模糊搜索功能，并使用 Element Plus 样式。"
          />
          <div class="action-bar">
            <el-button type="primary" :loading="isGenerating" @click="generateComponent">
              <el-icon><Cpu /></el-icon>&nbsp;立即智能生成
            </el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：代码生成结果 -->
      <el-col :span="14">
        <el-card class="box-card">
          <template #header>
            <div class="card-header-output">
              <span>🛠️ 生成的 Vue 3 组件代码</span>
              <el-button v-if="generatedCode" type="success" size="small" @click="copyCode">
                复制完整代码
              </el-button>
            </div>
          </template>

          <div class="code-output-container">
            <!-- 加载状态 -->
            <div v-if="isGenerating" class="loading-status">
              <el-skeleton :rows="10" animated />
              <p class="loading-text">AI 正在深度思考并编写代码中...</p>
            </div>

            <!-- 代码展示区域 -->
            <pre v-else-if="generatedCode" class="code-block"><code>{{ generatedCode }}</code></pre>

            <!-- 空状态 -->
            <el-empty v-else description="暂无生成的组件，请在左侧输入需求" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Cpu } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const userPrompt = ref('')
const isGenerating = ref(false)
const generatedCode = ref('')

// 🌐 真实请求 Java 后端 AI 组件生成接口
const generateComponent = async () => {
  if (!userPrompt.value.trim()) {
    ElMessage.warning('请输入您的组件需求描述！')
    return
  }

  isGenerating.value = true
  generatedCode.value = ''

  try {
    const res = await axios.post('http://localhost:8080/api/v1/generator/component', {
      prompt: userPrompt.value
    })

    if (res.data && res.data.success) {
      generatedCode.value = res.data.data
      ElMessage.success('后端 AI 接口响应成功！组件代码已生成')
    } else {
      ElMessage.error(res.data.message || '生成失败')
    }
  } catch (error) {
    console.error('调用生成接口异常：', error)
    ElMessage.error('无法连接到后端服务，请检查 8080 端口')
  } finally {
    isGenerating.value = false
  }
}

// 复制到剪贴板功能
const copyCode = () => {
  navigator.clipboard.writeText(generatedCode.value)
  ElMessage.success('代码已成功复制到剪贴板！')
}
</script>

<style scoped>
.generator-container {
  padding: 24px;
}
.action-bar {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
.card-header-output {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.code-output-container {
  min-height: 300px;
}
.code-block {
  background-color: #282c34;
  color: #abb2bf;
  padding: 16px;
  border-radius: 6px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
  line-height: 1.5;
  overflow-x: auto;
  margin: 0;
}
.loading-status {
  padding: 20px 0;
}
.loading-text {
  text-align: center;
  color: #8c8c8c;
  font-size: 14px;
  margin-top: 16px;
}
</style>