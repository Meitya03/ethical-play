const HISTORY_KEY_PREFIX = 'ethical_play_history_';

/**
 * 获取当前登录用户的历史记录 Key
 */
function getUserHistoryKey() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    // 从 JWT token 中解析用户 ID
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return HISTORY_KEY_PREFIX + payload.id;
  } catch (e) {
    console.error('Failed to get user history key:', e);
    return null;
  }
}

/**
 * 保存一条历史记录
 * @param {object} record - 历史记录对象 { profession, caseText, analysis, date }
 */
export function saveHistory(record) {
  try {
    const key = getUserHistoryKey();
    if (!key) return;

    const existingHistory = getHistory();
    const newRecord = {
      ...record,
      id: Date.now().toString(),
      date: new Date().toLocaleString()
    };
    const updatedHistory = [newRecord, ...existingHistory].slice(0, 20); // 最多保留20条
    localStorage.setItem(key, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
}

/**
 * 获取所有历史记录
 * @returns {Array} - 历史记录列表
 */
export function getHistory() {
  try {
    const key = getUserHistoryKey();
    if (!key) return [];

    const history = localStorage.getItem(key);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Failed to get history:', error);
    return [];
  }
}

/**
 * 清除所有历史记录
 */
export function clearHistory() {
  const key = getUserHistoryKey();
  if (key) {
    localStorage.removeItem(key);
  }
}
