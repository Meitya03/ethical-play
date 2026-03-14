import fetch from 'node-fetch';

const COZE_API_BASE = 'https://api.coze.cn/v1/workflow/run';
const COZE_TOKEN = 'cztei_hDi6pPxpdxk8yfqof1W98kvFePWiVBQpvTaUoxobHX4Sw0YgL76qbeeij94yscvkG';
const WORKFLOW_ID = '7616674520065114139';

async function testCozeAPI() {
  try {
    const response = await fetch(COZE_API_BASE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COZE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        workflow_id: WORKFLOW_ID,
        parameters: {
          profession: 'engineer'
        }
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    const responseText = await response.text();
    console.log('Response body:', responseText);
  } catch (error) {
    console.error('Error:', error);
  }
}

testCozeAPI();
