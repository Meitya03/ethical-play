import { callCozeWorkflow } from './CozeApi';
import { WORKFLOW_IDS } from '../constants';

let caseToken = '';
let roleToken = '';

export function setCozeTokens(caseTokenValue, roleTokenValue) {
  caseToken = caseTokenValue;
  roleToken = roleTokenValue;
}

export async function fetchCaseAndOptions(profession) {
  if (!caseToken) throw new Error('请先设置 Case Token');
  return callCozeWorkflow(WORKFLOW_IDS.generateCase, { profession }, caseToken);
}

export async function fetchResultWithImage(profession, caseDesc, selectedOption) {
  if (!roleToken) throw new Error('请先设置 Role Token');
  return callCozeWorkflow(WORKFLOW_IDS.generateResult, {
    profession,
    case: caseDesc,
    option: selectedOption
  }, roleToken);
}
