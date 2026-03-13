import { callCozeWorkflow } from './cozeApi';
import { WORKFLOW_IDS } from '../constants';

// 这个 token 需要从环境变量或后端获取，这里先作为参数传入
let cozeToken = '';

export function setCozeToken(token) {
  cozeToken = token;
}

export async function fetchCaseAndOptions(profession) {
  if (!cozeToken) throw new Error('请先设置 Coze Token');
  return callCozeWorkflow(WORKFLOW_IDS.generateCase, { profession }, cozeToken);
}

export async function fetchResultWithImage(profession, caseDesc, selectedOption) {
  if (!cozeToken) throw new Error('请先设置 Coze Token');
  return callCozeWorkflow(WORKFLOW_IDS.generateResult, {
    profession,
    case: caseDesc,
    option: selectedOption
  }, cozeToken);
}