// 测试新的Coze API Token
const COZE_API_BASE = 'https://api.coze.cn/v1/workflow/run';
const CASE_TOKEN = 'cztei_heq6hyLThuK87kg26zIwMcdxnMKIzG8qkMeUvlXk0TmcgFXGC6SuXHEr3PrrLeC5n';
const ROLE_TOKEN = 'cztei_qhISyaq9CxcufVMStVdbdAH8EDwrpbny9XF7Jk7dMB8Y4NP9bRZYYxfYsCFBbUslt';
const CASE_WORKFLOW_ID = '7616685426078744618';
const ROLE_WORKFLOW_ID = '7616674520065114139';

async function testToken(token, workflowId, name) {
  try {
    console.log(`\n测试 ${name}:`);
    console.log(`Token: ${token}`);
    console.log(`Workflow ID: ${workflowId}`);
    
    const response = await fetch(COZE_API_BASE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        workflow_id: workflowId,
        parameters: { profession: '软件工程师' }
      })
    });
    
    console.log(`响应状态: ${response.status}`);
    const responseText = await response.text();
    console.log(`响应内容: ${responseText}`);
    
    if (response.ok) {
      console.log(`✅ ${name} 测试成功！`);
      return true;
    } else {
      console.log(`❌ ${name} 测试失败`);
      return false;
    }
  } catch (error) {
    console.error(`${name} 测试出错:`, error);
    return false;
  }
}

async function runTests() {
  console.log('开始测试新的Coze API Token...\n');
  
  const caseResult = await testToken(CASE_TOKEN, CASE_WORKFLOW_ID, 'Case Token');
  const roleResult = await testToken(ROLE_TOKEN, ROLE_WORKFLOW_ID, 'Role Token');
  
  console.log('\n测试结果汇总:');
  console.log(`Case Token: ${caseResult ? '✅ 有效' : '❌ 无效'}`);
  console.log(`Role Token: ${roleResult ? '✅ 有效' : '❌ 无效'}`);
  
  if (caseResult && roleResult) {
    console.log('\n🎉 所有Token都有效，401问题已解决！');
  } else {
    console.log('\n⚠️ 部分Token无效，需要进一步检查');
  }
}

runTests();