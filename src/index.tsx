import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";

// 将英文月份转换为数字
const MONTHS: { [key: string]: number } = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

// 处理序数后缀
const stripOrdinal = (day: string): number => {
  return parseInt(day.replace(/(st|nd|rd|th)/, ""));
};

// 解析英文日期
const parseEnglishDate = (dateStr: string): Date => {
  // "November 25th, 2024" -> ['November', '25th', '2024']
  const [month, day, year] = dateStr.replace(",", "").split(" ");
  return new Date(parseInt(year), MONTHS[month] - 1, stripOrdinal(day));
};

// Move this function to module scope (before any other functions)
const getDayWithSuffix = (day: number): string => {
  if (day > 3 && day < 21) return day + "th";
  switch (day % 10) {
    case 1:
      return day + "st";
    case 2:
      return day + "nd";
    case 3:
      return day + "rd";
    default:
      return day + "th";
  }
};

// 获取历史日期的页面 uid
const getHistoricalPageUid = async (date: Date): Promise<string | null> => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Roam 的日期格式：November 25th, 2024
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const pageTitle = `${months[month - 1]} ${getDayWithSuffix(day)}, ${year}`;

  console.log("Searching for page:", pageTitle); // debug log

  // 查询这个日期页面的 uid
  const result = await (window as any).roamAlphaAPI.q(`
    [:find ?uid
     :where 
     [?e :node/title "${pageTitle}"]
     [?e :block/uid ?uid]]
  `);

  return result.length > 0 ? result[0][0] : null;
};

const getHistoricalPages = async (
  currentDateStr: string,
  yearsBack: number
) => {
  const currentDate = parseEnglishDate(currentDateStr);
  const pages = [];

  for (let i = 1; i <= yearsBack; i++) {
    const historicalDate = new Date(currentDate);
    historicalDate.setFullYear(currentDate.getFullYear() - i);

    const uid = await getHistoricalPageUid(historicalDate);
    if (uid) {
      pages.push({
        date: historicalDate,
        uid: uid,
      });
    }
  }

  return pages;
};

const onload = async () => {
  console.log("Last Year Today plugin loading...");

  try {
    // 获取当前日期
    const now = new Date();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const today = `${months[now.getMonth()]} ${getDayWithSuffix(
      now.getDate()
    )}, ${now.getFullYear()}`;

    // 获取过去5年的页面
    const historicalPages = await getHistoricalPages(today, 5);

    if (historicalPages.length > 0) {
      // 打开右侧栏
      await (window as any).roamAlphaAPI.ui.rightSidebar.open();

      // 为每个找到的历史页面打开一个窗口
      for (const page of historicalPages) {
        const date = page.date;
        const formattedDate = `${months[date.getMonth()]} ${getDayWithSuffix(
          date.getDate()
        )}, ${date.getFullYear()}`;

        await (window as any).roamAlphaAPI.ui.rightSidebar.addWindow({
          window: {
            type: "outline",
            "block-uid": page.uid,
            title: formattedDate,
          },
        });
      }

      console.log("Historical pages opened successfully!");
    } else {
      console.log("No historical pages found");
    }
  } catch (error) {
    console.error("Error loading Last Year Today plugin:", error);
  }
};

const onunload = () => {
  console.log("Last Year Today plugin unloaded!");
};

export default {
  onload,
  onunload,
};
