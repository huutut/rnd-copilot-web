<template>
  <div class="tester-container">
    <el-card class="box-card" header="🚀 快捷接口测试（网关连通性调试）">
      <!-- URL 输入栏 -->
      <div class="url-input-bar">
        <el-select v-model="requestMethod" style="width: 120px">
          <el-option label="GET" value="GET" />
          <el-option label="POST" value="POST" />
        </el-select>
        <el-input v-model="apiUrl" placeholder="请输入测试的请求 URL，例如：http://localhost:8080/api/v1/copilot/stats" />
        <button class="send-btn" :disabled="isSending" @click="sendRequest">
          {{ isSending ? '发送中...' : 'Send' }}
        </button>
      </div>

      <!-- 请求配置区域 -->
      <el-tabs v-model="activeTab" class="request-config-tabs">
        <el-tab-pane label="Body (JSON)" name="body">
          <el-input
            v-model="requestBody"
            type="textarea"
            :rows="5"
            placeholder='{\n  "tester": "Admin",\n  "env": "local"\n}'
          />
        </el-tab-pane>
        <el-tab-pane label="Headers" name="headers">
          <p class="tab-tip">默认携带：<code>Content-Type: application/json</code></p>
        </el-tab-pane>
      </el-tabs>

      <!-- 响应结果展示 -->
      <div class="response-section">
        <div class="response-header">
          <span>📊 Response 响应结果</span>
          <span v-if="responseStatus" :class="['status-badge', responseStatus === 200 ? 'status-success' : 'status-error']">
            Status: {{ responseStatus }}
          </span>
        </div>
        <div class="response-body">
          <pre v-if="responseResult" class="json-block"><code>{{ responseResult }}</code></pre>
          <div v-else class="empty-response">暂无响应数据，请输入请求并点击 Send 按钮</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const requestMethod = ref('POST')
const apiUrl = ref('http://localhost:8080/api/v1/copilot/stats')
const activeTab = ref('body')
const requestBody = ref('{\n  "tester": "Admin",\n  "env": "dev"\n}')

const isSending = ref(false)
const responseStatus = ref<number | null>(null)
const responseResult = ref('')

// 🌐 真实动态发送 HTTP 请求给后端
const sendRequest = async () => {
  if (!apiUrl.value.trim()) {
    ElMessage.warning('请输入合法的请求 URL！')
    return
  }

  isSending.value = true
  responseStatus.value = null
  responseResult.value = ''

  let payload = {}
  if (requestBody.value.trim()) {
    try {
      payload = JSON.parse(requestBody.value)
    } catch (e) {
      ElMessage.error('JSON 格式不正确，请检查！')
      isSending.value = false
      return
    }
  }

  try {
    const response = await axios({
      method: requestMethod.value,
      url: apiUrl.value,
      data: payload,
      headers: { 'Content-Type': 'application/json' }
    })

    responseStatus.value = response.status
    responseResult.value = JSON.stringify(response.data, null, 2)
    ElMessage.success('联通性测试成功！')
  } catch (error: any) {
    if (error.response) {
      responseStatus.value = error.response.status
      responseResult.value = JSON.stringify(error.response.data, null, 2)
    } else {
      responseStatus.value = 500
      responseResult.value = JSON.stringify({ error: 'Network Error', message: '网络异常或后端服务未启动' }, null, 2)
    }
    ElMessage.error('请求发生异常')
  } finally {
    isSending.value = false
  }
}
</script>

<style scoped>
.tester-container {
  padding: 24px;
}
.url-input-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}
.send-btn {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 0 24px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.send-btn:hover {
  opacity: 0.9;
}
.send-btn:disabled {
  background-color: #bfbfbf;
  cursor: not-allowed;
}
.request-config-tabs {
  margin-bottom: 24px;
}
.tab-tip {
  font-size: 13px;
  color: #8c8c8c;
  margin: 8px 0;
}
.response-section {
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  background-color: #fafafa;
}
.response-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}
.status-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
}
.status-success {
  background-color: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}
.status-error {
  background-color: #fff1f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}
.response-body {
  padding: 16px;
  min-height: 150px;
}
.json-block {
  margin: 0;
  background-color: #ffffff;
  border: 1px solid #e8e8e8;
  padding: 12px;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
  color: #333;
  overflow-x: auto;
}
.empty-response {
  color: #bfbfbf;
  text-align: center;
  font-size: 13px;
  padding-top: 40px;
}
</style>