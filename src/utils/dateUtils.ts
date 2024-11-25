declare let window: any;

interface HistoricalPage {
  date: string;
  uid: string;
}

export function getHistoricalPages(): HistoricalPage[] {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  const currentYear = today.getFullYear();

  const historicalPages: HistoricalPage[] = [];

  // 获取过去5年的同一天
  for (let i = 1; i <= 5; i++) {
    const year = currentYear - i;
    const dateString = `${year}年${currentMonth}月${currentDay}日`;

    // 查询页面及其 UID
    const result = window.roamAlphaAPI.q(`
      [:find (pull ?page [:block/uid :node/title])
       :where [?page :node/title "${dateString}"]]
    `);

    if (result.length > 0) {
      const page = result[0][0];
      historicalPages.push({
        date: dateString,
        uid: page.uid,
      });
    }
  }

  return historicalPages;
}
