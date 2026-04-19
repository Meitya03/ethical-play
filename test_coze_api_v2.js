// 测试Coze API连接 - 详细版本
const COZE_TOKEN = 'cztei_hDi6pPxpdxk8yfqof1W98kvFePWiVBQpvTaUoxobHX4Sw0YgL76qbeeij94yscvkG';
const WORKFLOW_ID = '7616674520065114139';

// 测试不同的API端点
const endpoints = [
  'https://api.coze.cn/v1/workflow/run',
  'https://www.coze.com/v1/workflow/run',
  'https://api.coze.com/v1/workflow/run'
];

async function testEndpoint(endpoint) {
  try {
    console.log(`\n测试端点: ${endpoint}`);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COZE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        workflow_id: WORKFLOW_ID,
        parameters: { profession: '软件工程师' },
        is_async: false
      })
    });
    
    console.log('响应状态:', response.status);
    const responseText = await response.text();
    console.log('响应内容:', responseText);
    
    return { status: response.status, text: responseText };
  } catch (error) {
    console.error('测试失败:', error);
    return { status: 500, text: error.message };
  }
}

async function runAllTests() {
  console.log('开始测试Coze API连接...');
  console.log('使用的Token:', COZE_TOKEN);
  console.log('使用的Workflow ID:', WORKFLOW_ID);
  
  const results = [];
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push({ endpoint, ...result });
  }
  
  console.log('\n测试结果汇总:');
  results.forEach(result => {
    console.log(`端点: ${result.endpoint}`);
    console.log(`状态: ${result.status}`);
    console.log(`响应: ${result.text}`);
    console.log('---');
  });
}

runAllTests();