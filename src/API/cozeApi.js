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
      parameters: parameters
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
  return result.data;
}