import { callCozeWorkflow, resumeCozeWorkflow } from './CozeApi';
import { WORKFLOW_IDS } from '../constants';

let multiRoundToken = '';

export function setCozeTokens(multiRoundTokenValue) {
  multiRoundToken = multiRoundTokenValue;
}

export async function fetchMultiRoundCase(profession) {
  if (!multiRoundToken) throw new Error('请先设置 Multi Round Token');
  return callCozeWorkflow(WORKFLOW_IDS.multiRoundCase, {
    profession,
    history: [],
    is_custom: false,
    round: 1
  }, multiRoundToken);
}

export async function resumeMultiRoundCase(eventId, resumeData, interruptType) {
  if (!multiRoundToken) throw new Error('请先设置 Multi Round Token');
  return resumeCozeWorkflow(
    WORKFLOW_IDS.multiRoundCase,
    eventId,
    resumeData,
    interruptType,
    multiRoundToken
  );
}
