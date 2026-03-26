import { COZE_API_BASE } from '../constants';

/**
 * 调用 Coze 工作流
 * @param {string} workflowId - 工作流 ID
 * @param {object} parameters - 输入参数
 * @param {string} token - Coze API 令牌（从环境变量或后端获取）
 * @returns {Promise<object>} - 返回工作流的 data 字段
 */
export async function callCozeWorkflow(workflowId, parameters, token) {
  const response = await fetch(COZE_API_BASE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      workflow_id: workflowId,
      parameters: parameters,
      is_async: false
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  if (result.code !== 0) {
    throw new Error(result.msg || '未知错误');
  }
  // 检查data是否为字符串，如果是则解析为对象
  if (typeof result.data === 'string') {
    try {
      return JSON.parse(result.data);
    } catch (error) {
      throw new Error('解析数据失败');
    }
  }
  return result.data;
}

/**
 * 恢复 Coze 工作流
 * @param {string} workflowId - 工作流 ID
 * @param {string} eventId - 中断事件 ID
 * @param {string} resumeData - 恢复数据
 * @param {string} interruptType - 中断类型
 * @param {string} token - Coze API 令牌（从环境变量或后端获取）
 * @returns {Promise<object>} - 返回工作流的 data 字段
 */
export async function resumeCozeWorkflow(workflowId, eventId, resumeData, interruptType, token) {
  const response = await fetch('https://api.coze.cn/v1/workflow/run/resume', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      workflow_id: workflowId,
      event_id: eventId,
      resume_data: resumeData,
      interrupt_type: interruptType
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  if (result.code !== 0) {
    throw new Error(result.msg || '未知错误');
  }
  // 检查data是否为字符串，如果是则解析为对象
  if (typeof result.data === 'string') {
    try {
      return JSON.parse(result.data);
    } catch (error) {
      throw new Error('解析数据失败');
    }
  }
  return result.data;
}
