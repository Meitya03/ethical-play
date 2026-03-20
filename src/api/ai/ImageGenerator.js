// ImageGenerator.js - 处理角色图像生成

const API_URL = "https://grsai.dakka.com.cn/v1/draw/nano-banana";
const API_KEY = "sk-e1662c33975d4043b31a5fe1065d1f0b";
const TIMEOUT_MS = 30000; // 30秒超时

/**
 * 生成角色图像
 * @param {string} role - 角色名称
 * @returns {Promise<string>} - 返回生成的图像URL
 */
export async function generateRoleImage(role) {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`
  };

  const data = {
    "model": "nano-banana-fast",
    "prompt": `简约扁平风格，工程伦理场景，${role}角色插图`
  };

  try {
    // 创建一个超时Promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('请求超时')), TIMEOUT_MS);
    });

    // 竞争fetch和超时
    const response = await Promise.race([
      fetch(API_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      }),
      timeoutPromise
    ]);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    // 由于API返回的是SSE格式，我们需要处理流式响应
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    // 再次为流式读取设置超时
    let startTime = Date.now();
    
    while (true) {
      // 检查是否超时
      if (Date.now() - startTime > TIMEOUT_MS) {
        throw new Error('流式读取超时');
      }

      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6);
          try {
            const event = JSON.parse(jsonStr);
            const status = event.status;
            if (status === "succeeded") {
              const imageUrl = event.results[0].url;
              return imageUrl;
            } else if (status === "failed") {
              throw new Error(`生成失败: ${event.failure_reason}`);
            }
          } catch (error) {
            console.error('JSON解析失败:', jsonStr);
          }
        }
      }
    }

    throw new Error('未收到成功响应');
  } catch (error) {
    console.error('生成图像时出错:', error);
    throw error;
  }
}
