// 测试Coze API连接
const COZE_API_BASE = 'https://api.coze.cn/v1/workflow/run';
const COZE_TOKEN = 'cztei_hDi6pPxpdxk8yfqof1W98kvFePWiVBQpvTaUoxobHX4Sw0YgL76qbeeij94yscvkG';
const WORKFLOW_ID = '7616674520065114139';

async function testCozeApi() {
  try {
    console.log('测试Coze API连接...');
    console.log('Token:', COZE_TOKEN);
    console.log('API URL:', COZE_API_BASE);
    console.log('Workflow ID:', WORKFLOW_ID);
    
    const response = await fetch(COZE_API_BASE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COZE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        workflow_id: WORKFLOW_ID,
        parameters: { profession: '软件工程师' }
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response text:', responseText);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }
    
    const result = JSON.parse(responseText);
    console.log('Parsed result:', result);
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testCozeApi();